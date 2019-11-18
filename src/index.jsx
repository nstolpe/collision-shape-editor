import React, { useContext, useReducer } from 'react';
import { render } from 'react-dom';
import { Provider } from "react-redux";

import { AppContext, Stage } from 'react-pixi-fiber';

// components
import AppWrapper from 'components/AppWrapper';
import Controls from 'components/Controls';
import FlexResizer from 'components/FlexResizer';
import Screen from 'components/Screen';
import Sprites from 'components/Sprites';
import Vertices from 'components/Vertices';
import ScreenContext from 'contexts/ScreenContext';

import store from 'store/store';

import Circle from 'components/Circle';


const appContainer = document.getElementById('root');

window.store = store;

render(
    <Provider store={store}>
        <AppWrapper>
            <FlexResizer>
                <Screen context={ScreenContext}>
                    <Sprites />
                    <Vertices />
                </Screen>
            </FlexResizer>
            <Controls />
        </AppWrapper>
    </Provider>,
    appContainer
);

const OuterContext = React.createContext();
const InnerContext = React.createContext();

const useOuterContext = () => useContext(OuterContext);
const useInnerContext = () => useContext(InnerContext);

const Wrapper = ({ children }) => (<div>{children}</div>);

const TextDisplay = () => {
    const state = useOuterContext();
    console.log(state);
    return (
        <pre>{JSON.stringify({ ...state, fill: state.fill.toString(16) }, null, 4)}</pre>
    );
};

const Child = () => {
    const { radius, fill, position, dispatch } = useInnerContext();
    return (
        <Circle
            radius={radius}
            fill={fill}
            position={position}
            interactive
            buttonMode
            pointertap={e => dispatch({ type: CHANGE_FILL, data: { fill: 0xffffff - fill } })}
        />
    );
};

// Renders the `Stage` with `InnerStore` inside it but above any children
const GraphicsScreen = ({ children }) => {
    const state = useOuterContext();
    return (
        <Stage
            width={state.width}
            height={state.height}
            options={{ backgroundColor: state.backgroundColor }}
        >
            <InnerStore state={state}>{children}</InnerStore>
        </Stage>);
};

// state
const initialState = {
    backgroundColor: 0x777777,
    radius: 20,
    fill: 0xffffff,
    width: 200,
    height: 200,
    position: [100 , 100],
};

const CHANGE_FILL = 'CHANGE_FILL';
const CHANGE_RADIUS = 'CHANGE_RADIUS';

// reducer to pass to `useReducer` inside `OuterStore`.
const reducer = (state, { data, type }) => {
    switch (type) {
        case CHANGE_FILL:
            const { fill } = data;
            return { ...state, fill };
        case CHANGE_RADIUS:
            const { radius } = data;
            return { ...state, radius };
        default:
            return state;
    };
};

// the outer store for the whole app. adds `dispatch` to state so it can be updated.
const OuterStore = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <OuterContext.Provider value={{ ...state, dispatch }}>
            {children}
        </OuterContext.Provider>
    );
};

// the inner store for components rendered by PIXI. render it inside of
// Stage and pass it `state` from `useOuterContext()`.
const InnerStore = ({ children, state }) => {
    return (
        <InnerContext.Provider value={state}>
            {children}
        </InnerContext.Provider>
    );
};

// render(
//     <Wrapper>
//         <OuterStore>
//             <TextDisplay />
//             <GraphicsScreen><Child /></GraphicsScreen>
//         </OuterStore>
//     </Wrapper>,
//     appContainer
// );
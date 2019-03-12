// src/js/components/TestContainer.js

import React from 'react';
import { Container } from 'react-pixi-fiber';
import { connect } from "react-redux";

import Circle from 'App/components/Circle';
import Rectangle from 'App/components/Rectangle';
import ScreenContext from 'App/contexts/ScreenContext';

const mapStateToProps = state => ({ ...state });

const TestContainer = props => {
    return (
        <Container name="TestContainer" position={props.testContainerPosition}>
            <Rectangle
                x={250}
                y={200}
                rotation={0.7853981633974483}
                pivot={[125, 100]}
                width={300}
                height={200}
                fill={0xffffff - props.backgroundColor}
                strokeColor={0xff00ff}
                strokeWidth={20}
                onMouseDown={e => console.log('onMouseDown', e)}
                onMouseUp={e => console.log('onMouseUp', e)}
                interactive
                buttonMode
            />
            <Circle
                x={500}
                y={400}
                fill={0xffffff - Math.round(props.backgroundColor * 0.5)}
                radius={100}
                strokeWidth={30}
                strokeAlignment={1}
            />
        </Container>
    );
};

// export default TestContainer;
export default connect(mapStateToProps, null, null, { context: ScreenContext })(TestContainer);

// src/js/components/Test.js
import React from 'react';
import {
    Container,
    Stage,
} from 'react-pixi-fiber';
import { connect } from "react-redux";
import { Provider } from "react-redux";

import TestContainer from 'App/components/TestContainer';
import store from 'App/store/store';

const mapStateToProps = state => ({ ...state });

const Test = props => {
    return(
        <Stage
            width={props.width}
            height={props.height}
            options={
                {
                    backgroundColor: 0x05ffd5,
                    autoResize: true,
                    resolution: props.resolution,

                }
            }
            style={{
                width: '100%',
                height: '100%',
            }}
            name="stage"
        >
            <TestContainer { ...props }/>
        </Stage>
    );
}

export default connect(mapStateToProps, null)(Test);
// export default Test;

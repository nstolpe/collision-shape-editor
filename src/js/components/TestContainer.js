// components/TestContainer.js

import React from 'react';
import { Container } from 'react-pixi-fiber';
import { connect } from "react-redux";

const mapStateToProps = state => ({ ...state });

const TestContainer = (props, state) => {
    console.log(props);
    return (<Container name="TestContainer" position={props.testContainerPosition} foo={props.lastResize}/>);
};

// export default TestContainer;
export default connect(mapStateToProps, null)(TestContainer);

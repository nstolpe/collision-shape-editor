// src/js/components/TestContainer.js

import React from 'react';
import { Container } from 'react-pixi-fiber';
import { connect } from "react-redux";

import ScreenContext from 'App/contexts/ScreenContext';

const mapStateToProps = (state, ownProps) => ({ ...state });

const TestContainer = props => {
    return (<Container name="TestContainer" position={props.testContainerPosition} />);
};

// export default TestContainer;
export default connect(mapStateToProps, null, null, { context: ScreenContext })(TestContainer);

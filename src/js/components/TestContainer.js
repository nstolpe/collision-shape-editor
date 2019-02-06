// components/TestContainer.js

import React from 'react';
import { Container } from 'react-pixi-fiber';
import { connect } from "react-redux";

const mapStateToProps = state => ({ ...state });

const TestContainer = props => <Container name="foobar" position={props.testContainerPosition} />;

export default connect(mapStateToProps, null)(TestContainer);

// src/js/components/ScreenWrapper.js
import React from 'react';

import { StageWrapper as style } from 'App/data/styles';

const ScreenWrapper = props => (<div style={{ ...style }}>{props.children}</div>);

export default ScreenWrapper;

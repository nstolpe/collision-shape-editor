// src/js/components/AppWrapper.js
import React from 'react';

import { AppWrapper as style } from 'App/data/styles';

const AppWrapper = props => (<div style={{ ...style }}>{props.children}</div>);

export default AppWrapper;

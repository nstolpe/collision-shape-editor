// src/js/components/AppWrapper.js
import React from 'react';
import styled from 'styled-components';

import { AppWrapper as style } from 'App/data/styles';
const Styled = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    height: 100%;
    font-size: 10px;
    line-height: 1.5rem;
`;

const AppWrapper = props => (<Styled>{props.children}</Styled>);

export default AppWrapper;
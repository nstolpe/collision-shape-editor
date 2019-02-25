// src/js/components/ColorPicker.js
// reference: https://codepen.io/amwill/pen/ZbdGeW
import PropTypes from 'prop-types';
import React, {
    useEffect,
    useRef,
    useState,
} from 'react';
import { connect } from "react-redux";
import styled from 'styled-components';

import { setBackgroundColor } from 'App/actions/actions';
import {
    hexToRgb,
    hslToRgb,
    rgbToHex,
    rgbToHsl,
    toHex,
} from 'App/tools/color';

const Trigger = styled.a`
    text-decoration: none;
    width: ${({triggerWidth}) => triggerWidth == null ? '4em' : triggerWidth};
    height: ${({triggerHeight}) => triggerHeight == null ?'4em' : triggerHeight};
    display: inline-block;
    box-sizing: border-box;
    position: relative;
    background-color: ${({backgroundColor}) => backgroundColor};
    transition: opacity 0.2s ease;
    &:hover {
        box-shadow: 0 0 2px #ffffff;
    }
    border-radius: .2em;
    vertical-align: middle;
    cursor: pointer;
`;

const Panel = styled.div`
    position: absolute;
    display: ${({active}) => active ? 'flex' : 'none'};
    bottom: 100%;
    background-color: #ebebeb;
    padding: 1em;
    margin-bottom: 1em;
    border-radius: .2em .2em 0 0;
    cursor: default;
`;

const CanvasWrapper = styled.div`
    display: flex;
`;

const ValuesWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const PadCanvas = styled.canvas`
    display: inline-block;
    width: ${({width}) => `${width}px`};
    height: ${({height}) => `${height}px`};
    vertical-align: middle;
    cursor: crosshair;
    cursor: url("data:image/svg+xml;utf8,
        <svg xmlns='http://www.w3.org/2000/svg' height='19' width='19' viewBox='0 0 19 19'>
            <line x1='0' y1='9' x2='19' y2='9' stroke='%23ffffff' stroke-width='1' />
            <line x1='9' y1='0' x2='9' y2='19' stroke='%23ffffff' stroke-width='1' />
        </svg>") 9 9, crosshair;
`;

const SlideCanvas = styled.canvas`
    display: inline-block;
    width: ${({width}) => `${width}px`};
    height: ${({height}) => `${height}px`};
    vertical-align: middle;
    cursor: url("data:image/svg+xml;utf8,
        <svg xmlns='http://www.w3.org/2000/svg' height='19' width='19' viewBox='0 0 19 19'>
            <line x1='0' y1='9' x2='19' y2='9' stroke='%23ffffff' stroke-width='1' />
            <line x1='9' y1='0' x2='9' y2='19' stroke='%23ffffff' stroke-width='1' />
        </svg>") 9 9, crosshair;
    margin: ${({width}) => `0 ${width * .5}px`};
`;

const mapStateToProps = (state, ownProps) => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onChange: event => {
        const colorString = event.target.value;
        const color = parseInt(colorString.replace('#',''), 16);
        dispatch(setBackgroundColor(color));
    },
});

const drawPadCanvas = (canvas, colorString) => {
    if (canvas.offsetWidth < 1 || canvas.offsetHeight < 1) {
        return;
    }
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const gradientWhite = ctx.createLinearGradient(0, 0, width, 0);
    const gradientBlack = ctx.createLinearGradient(0, 0, 0, height);

    ctx.rect(0, 0, width, height);
    ctx.fillStyle = colorString;
    ctx.fillRect(0, 0, width, height);

    gradientWhite.addColorStop(0, 'rgba(255,255,255,1)');
    gradientWhite.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradientWhite;
    ctx.fillRect(0, 0, width, height);

    gradientBlack.addColorStop(0, 'rgba(0,0,0,0)');
    gradientBlack.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gradientBlack;
    ctx.fillRect(0, 0, width, height);
};

const drawSlideCanvas = (canvas) => {
    if (canvas.offsetWidth < 1 || canvas.offsetHeight < 1) {
        return;
    }
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const gradientWhite = ctx.createLinearGradient(0, 0, width, 0);
    const gradientBlack = ctx.createLinearGradient(0, 0, 0, height);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
};

const colorChange = (event, callback) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    const ctx = event.target.getContext('2d');
    const color = ctx.getImageData(x, y, 1, 1).data;
    callback({ r: color[0], g: color[1], b: color[2] });
};

const ColorPicker = ({ color, padWidth, padHeight, slideWidth, slideHeight, onColorChange }) => {
    const padCanvas = useRef(null);
    const slideCanvas = useRef(null);
    const [active, setActive] = useState(false);
    const [padDragging, setPadDragging] = useState(false);
    const [padPixelCoords, setPadPixelCoords] = useState(false);
    const [slideDragging, setSlideDragging] = useState(false);
    const hexColorString = toHex(color);
    const rgb = hexToRgb(hexColorString);
    const hue = rgbToHsl(rgb);
    const hueBase = { ...hue, s: 1, l: .5 };
    const rgbBase = hslToRgb({ ...hueBase });
    const hexBase = rgbToHex({ ...rgbBase });
    const [currentColor, setCurrentColor] = useState(hexColorString);
    const toggleActive = () => setActive(!active);
    useEffect(() => {
        drawPadCanvas(padCanvas.current, hexBase);
        drawSlideCanvas(slideCanvas.current);
    });

    return (
        <Trigger backgroundColor={hexColorString} onClick={toggleActive}>
            <Panel active={active} onClick={event => event.stopPropagation()} onMouseMove={event => event.preventDefault()}>
                <PadCanvas ref={padCanvas} width={padWidth} height={padHeight}
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                    onMouseMove={event => {
                        event.preventDefault();
                        if (padDragging) {
                            setPadPixelCoords({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
                            colorChange(event, onColorChange);
                        }
                    }}
                    onMouseDown={event => {
                        setPadPixelCoords({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
                        colorChange(event, onColorChange);
                        setPadDragging(true);
                    }}
                    onMouseUp={event => {
                        setPadDragging(false);
                    }}
                    onMouseOut={event => {
                        setPadDragging(false);
                    }}
                />
                <SlideCanvas ref={slideCanvas} width={slideWidth} height={slideHeight}
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                    onMouseMove={event => {
                        event.preventDefault();
                        if (padDragging) {
                            colorChange(event, onColorChange);
                        }
                    }}
                    onMouseDown={event => {
                        setPadDragging(true);
                    }}
                    onMouseUp={event => {
                        setPadDragging(false);
                    }}
                    onMouseOut={event => {
                        setPadDragging(false);
                    }}
                />
                <ValuesWrapper>
                    <label>RGB:<input type="text" value={`${rgb.r}/${rgb.g}/${rgb.b}`} readOnly /></label>
                    <label>HSL:<input type="text" value={`${hue.h.toFixed(2)}/${hue.s.toFixed(2)}/${hue.l.toFixed(2)}`} readOnly /></label>
                    <label>Hex:<input type="text" value={hexColorString} readOnly /></label>
                </ValuesWrapper>
            </Panel>
        </Trigger>
    );
};

ColorPicker.defaultProps = {
    color: 0xff0000,
    padWidth: 200,
    padHeight: 200,
    slideWidth: 40,
    slideHeight: 200,
    onColorChange: ({ r, g, b }) => ({ r, g, b }),
};

ColorPicker.propTypes = {
    color: PropTypes.number,
    padWidth: PropTypes.number,
    padHeight: PropTypes.number,
    slideWidth: PropTypes.number,
    slideHeight: PropTypes.number,
    onColorChange: PropTypes.func,
};

export default ColorPicker;
// export default connect(mapStateToProps, mapDispatchToProps)(ColorPicker);


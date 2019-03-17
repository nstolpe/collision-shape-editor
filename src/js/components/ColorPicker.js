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

import {
    hexToRgb,
    hslToRgb,
    rgbToHex,
    rgbToHsl,
    toHex,
} from 'App/tools/color';

const Trigger = styled.a.attrs(
    ({ triggerWidth, triggerHeight, backgroundColor }) => ({
        style: {
            width: triggerWidth == null ? '5.4em' : triggerWidth,
            height: triggerHeight == null ?'5.4em' : triggerHeight,
            backgroundColor: backgroundColor,
        },
    }),
)`
    text-decoration: none;
    display: inline-block;
    box-sizing: border-box;
    position: relative;
    transition: opacity 0.2s ease;
    border-radius: .2em;
    vertical-align: middle;
    cursor: pointer;
    &:hover {
        box-shadow: 0 0 2px #ffffff;
    }
`;
const Panel = styled.div`
    position: absolute;
    display: ${({active}) => active ? 'flex' : 'none'};
    bottom: 100%;
    background-color: #d9d9d9;
    padding: 1em;
    margin-bottom: 1em;
    border-radius: .2em .2em 0 0;
    cursor: default;
`;

const CanvasWrapper = styled.div`
    display: flex;
    display: inline-block;
    box-sizing: border-box;
    position: relative;
`;

const ValuesWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const cursor = `url("data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' height='19' width='19' viewBox='0 0 19 19'>
        <line x1='0' y1='9' x2='19' y2='9' stroke='%23ffffff' stroke-width='1' />
        <line x1='9' y1='0' x2='9' y2='19' stroke='%23ffffff' stroke-width='1' />
    </svg>") 9 9, crosshair`;

const PadCanvas = styled.canvas`
    display: inline-block;
    width: ${({width}) => `${width}px`};
    height: ${({height}) => `${height}px`};
    vertical-align: middle;
    cursor: crosshair;
    cursor: ${({dragging}) => dragging ? 'none' : cursor};
    touch-action: none;
`;

const SlideCanvas = styled.canvas`
    display: inline-block;
    width: ${({width}) => `${width}px`};
    height: ${({height}) => `${height}px`};
    vertical-align: middle;
    cursor: ${({dragging}) => dragging ? 'none' : cursor};
    margin: ${({width}) => `0 ${width * .25}px`};
    touch-action: none;
`;

const Label = styled.label`
    font-family: sans-serif;
    font-size: 1.4em;
    font-weight: bold;
    user-select: none;
`;

const Input = styled.input`
`;

const drawPadCanvas = (canvas, colorString) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const gradientWhite = ctx.createLinearGradient(0, 0, width, 0);
    const gradientBlack = ctx.createLinearGradient(0, 0, 0, height);

    gradientWhite.addColorStop(0, 'rgba(255,255,255,1)');
    gradientWhite.addColorStop(1, 'rgba(255,255,255,0)');
    gradientBlack.addColorStop(0, 'rgba(0,0,0,0)');
    gradientBlack.addColorStop(1, 'rgba(0,0,0,1)');

    // ctx.rect(0, 0, width, height);

    ctx.fillStyle = colorString;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = gradientWhite;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = gradientBlack;
    ctx.fillRect(0, 1, width, height);

    // ensure the first pixel is white, the gradients don't usually get it.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1, 1);
    // ensure the pixel at width, height is the base color.
    ctx.fillStyle = colorString;
    ctx.fillRect(width - 1, 0, 1, 1);
};

const drawCursor = ({ canvas, color, coordinates, mode='xy', alpha=0.5, compositeOperation='source-over' }) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    ctx.globalCompositeOperation = compositeOperation;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    if (['x', 'xy'].includes(mode)) {
        ctx.beginPath();
        ctx.moveTo(0, coordinates.y);
        ctx.lineTo(width, coordinates.y);
        ctx.stroke();
    }

    if (['y', 'xy'].includes(mode)) {
        ctx.beginPath();
        ctx.moveTo(coordinates.x, 0);
        ctx.lineTo(coordinates.x, height);
        ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
};

const drawSlideCanvas = (canvas) => {
    if (canvas.offsetWidth < 1 || canvas.offsetHeight < 1) {
        return;
    }

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
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

const coordinatesToColor = ({ x, y }, ctx) => {
    let color;
    try {
        color = ctx.getImageData(x, y, 1, 1).data;
    } catch (e) {
        debugger;
    }

    return { r: color[0], g: color[1], b: color[2] };
};

const findColorCoordinates = (canvas, targetHex) => {
    const ctx = canvas.getContext('2d');
    const { offsetWidth: width, offsetHeight: height } = canvas;
    const pixels = ctx.getImageData(0, 0, width, height).data;
    const r = pixels.findIndex((val, idx, arr) => {
        if (idx % 4 === 0) {
            const r = arr[idx];
            const g = arr[idx + 1];
            const b = arr[idx + 2];
            const currentHex = rgbToHex({ r, g, b })
            if (currentHex === targetHex) {
                return true;
            }
        }
        return false;
    });

    return r < 0 ? undefined : {
        x: (r * .25) % width,
        y: Math.floor((r * .25) / width),
    };
};

// ignore the color prop after initial render
const isEqual = (prevProps, nextProps) => Object.entries(nextProps).reduce((acc, [key, val]) => !acc ? acc : key === 'color' ? true : val === prevProps[key], true);

const ColorPicker = ({ color, padWidth, padHeight, slideWidth, slideHeight, onColorChange }) => {
    // two canvas components
    const padCanvas = useRef(null);
    const slideCanvas = useRef(null);
    // state
    const [active, setActive] = useState(false);
    // state - dragging
    const [padDragging, setPadDragging] = useState(false);
    const [slideDragging, setSlideDragging] = useState(false);
    // state - coordinates
    const [padPixelCoordinates, setPadPixelCoordinates] = useState(false);
    const [slidePixelCoordinates, setSlidePixelCoordinates] = useState(false);
    // state - hex color for trigger and whatever's embedding the component.
    const hexColorString = toHex(color);
    const rgb = hexToRgb(hexColorString);
    const hue = rgbToHsl(rgb);
    const hueBase = { ...hue, s: 1, l: .5 };
    const rgbBase = hslToRgb({ ...hueBase });
    const [hexBase, setHexBase] = useState(rgbToHex({ ...rgbBase }));
    const [currentColor, setCurrentColor] = useState(hexColorString);
    const toggleActive = () => setActive(!active);

    useEffect(() => {
        const { current: canvas } = padCanvas;
        const { offsetWidth: width, offsetWidth: height } = canvas;
        const context = canvas.getContext('2d');

        if (width > 0 && height > 0) {
            let coordinates;
            context.clearRect(0, 0, width, height);
            drawPadCanvas(canvas, hexBase);

            if (padPixelCoordinates) {
                coordinates = padPixelCoordinates;
            } else {
                coordinates = findColorCoordinates(canvas, currentColor);
                setPadPixelCoordinates(coordinates);
            }

            if (coordinates) {
                const rgb = coordinatesToColor(coordinates, canvas.getContext('2d'));
                const hex = rgbToHex(rgb);

                onColorChange(rgb);
                drawCursor({
                    canvas: padCanvas.current,
                    color: '#ffffff',
                    coordinates,
                    // compositeOperation: 'lighter',
                });

                if (hex !== currentColor) {
                    setCurrentColor(rgbToHex(rgb));
                }
            }
        }
    });

    useEffect(() => {
        const { current: canvas } = slideCanvas;
        const { offsetWidth: width, offsetWidth: height } = canvas;
        const context = canvas.getContext('2d');

        if (width > 0 && height > 0) {
            let coordinates;
            context.clearRect(0, 0, width, height);
            drawSlideCanvas(canvas);

            if (slidePixelCoordinates) {
                coordinates = slidePixelCoordinates;
            } else {
                coordinates = findColorCoordinates(canvas, hexBase);
                setSlidePixelCoordinates(coordinates);
            }

            if (coordinates) {
                const rgb = coordinatesToColor(coordinates, canvas.getContext('2d'));
                const hex = rgbToHex(rgb);
                drawCursor({
                    canvas: slideCanvas.current,
                    // color: '#000000',
                    color: toHex(0xffffff - parseInt(hex.replace('#', ''), 16)),
                    coordinates,
                    mode: 'x',
                    // compositeOperation: 'lighter',
                    alpha: 1,
                });

                if (hex !== hexBase) {
                    setHexBase(hex);
                }
            }
        }
    });

    return (
        <Trigger backgroundColor={currentColor} onClick={toggleActive}>
            <Panel active={active} onClick={event => event.stopPropagation()} onMouseMove={event => event.preventDefault()}>
                <PadCanvas ref={padCanvas} width={padWidth} height={padHeight}
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                    onMouseMove={event => {
                        event.preventDefault();
                        if (padDragging) {
                            const { target: canvas } = event;
                            const coordinates = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
                            setPadPixelCoordinates(coordinates);
                        }
                    }}
                    onMouseDown={event => {
                        const { target: canvas } = event;
                        const coordinates = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
                        setPadPixelCoordinates(coordinates);
                        setPadDragging(true);
                    }}
                    onMouseUp={event => setPadDragging(false)}
                    onPointerDown={event => {
                        const { target: canvas } = event;
                        const coordinates = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
                        setPadPixelCoordinates(coordinates);
                        setPadDragging(true);
                    }}
                    onPointerMove={event => {
                        event.preventDefault();
                        if (padDragging) {
                            const { target: canvas } = event;
                            const coordinates = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
                            setPadPixelCoordinates(coordinates);
                        }
                    }}
                    onPointerUp={event => {
                        setPadDragging(false);
                    }}
                    dragging={padDragging}
                />
                <SlideCanvas ref={slideCanvas} width={slideWidth} height={slideHeight}
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                    onMouseMove={event => {
                        event.preventDefault();
                        if (slideDragging) {
                            const { target: canvas } = event;
                            const coordinates = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
                            setSlidePixelCoordinates(coordinates);
                        }
                    }}
                    onMouseDown={event => {
                        const { target: canvas } = event;
                        const coordinates = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
                        setSlidePixelCoordinates(coordinates);
                        setSlideDragging(true);
                    }}
                    onMouseUp={event => {
                        setSlideDragging(false);
                    }}
                    onPointerDown={event => {
                        const { target: canvas } = event;
                        const coordinates = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
                        setSlidePixelCoordinates(coordinates);
                        setSlideDragging(true);
                    }}
                    onPointerMove={event => {
                        event.preventDefault();
                        if (slideDragging) {
                            const { target: canvas } = event;
                            const coordinates = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
                            setSlidePixelCoordinates(coordinates);
                        }
                    }}
                    onPointerUp={event => {
                        setSlideDragging(false);
                    }}
                    dragging={slideDragging}
                />
                <ValuesWrapper>
                    <Label>
                        RGB:<Input type="text" value={`${rgb.r}/${rgb.g}/${rgb.b}`} readOnly />
                    </Label>
                    <Label>
                        HSL:<Input type="text" value={`${hue.h.toFixed(2)}/${hue.s.toFixed(2)}/${hue.l.toFixed(2)}`} readOnly />
                    </Label>
                    <Label>
                        Hex:<Input type="text" value={currentColor} readOnly />
                    </Label>
                </ValuesWrapper>
            </Panel>
        </Trigger>
    );
};

ColorPicker.defaultProps = {
    color: 0xff0000,
    padWidth: 256,
    padHeight: 256,
    slideWidth: 48,
    slideHeight: 256,
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

export default React.memo(ColorPicker, isEqual);

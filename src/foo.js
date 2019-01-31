import turtleBodySrc from './img/turtle-body.png';
import MarchingSquares from './js/tools/marching-squares.js';
const rgb2hsv = () => {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
};

const castRange = (oldValue, sourceMin, sourceMax, targetMin, targetMax) => {
    const sourceRange = (sourceMax - sourceMin);
    if (sourceRange == 0) {
        return targetMin;
    }
    const targetRange = (targetMax - targetMin)
    return (((oldValue - sourceMin) * targetRange) / sourceRange) + targetMin
};

const image = document.getElementById('image');
image.src = turtleBodySrc;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const { width, height } = image;
const border = 10;
canvas.width = width + border;
canvas.height = height + border;

ctx.drawImage(image, border, border);

window.ctx = ctx;

console.log(ctx.getImageData(0, 0, width, height));

const imageData = ctx.getImageData(0, 0, width + border, height + border);

const pixels = imageData.data;

const redImageData = ctx.createImageData(width + border, height + border);

for (let i = 0; i < pixels.length; i += 4) {
    const r = castRange(pixels[i], 0, 255, 0, 1);
    const g = castRange(pixels[i+1], 0, 255, 0, 1);
    const b = castRange(pixels[i+2], 0, 255, 0, 1);
    const a = castRange(pixels[i+3], 0, 255, 0, 1);
    // if (a !== 0 || a !== 1) console.log('alpha', a);
    redImageData.data[i] = castRange(r * .7, 0, 1, 0, 255);
    redImageData.data[i+1] = castRange(g * .9, 0, 1, 0, 255);
    redImageData.data[i+2] = castRange(b * .9, 0, 1, 0, 255);
    redImageData.data[i+3] = castRange(a, 0, 1, 0, 255);
}

// redImageData.data = pixels;

ctx.putImageData(redImageData, 0, 0);

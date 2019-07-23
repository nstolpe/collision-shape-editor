// /src/js/tools/color.js
import { property } from 'tools/utilities';

// https://jsfiddle.net/t5nq6jjc/1
// https://stackoverflow.com/a/9493060 (link above from comments)
export const rgbToHsl = ({ r, g, b }) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0;
    }else{
        const d = (max - min);
        s = l >= 0.5 ? d / (2 - (max + min)) : d / (max + min);
        switch(max){
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
            case g: h = ((b - r) / d + 2) * 60; break;
            case b: h = ((r - g) / d + 4) * 60; break;
        }
    }

    return { h, s, l };
}

// https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
export const hslToRgb = ({ h, s, l }) => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60.0;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let rgb;
    if (isNaN(h)) rgb = [0, 0, 0];
    else if (hp <= 1) rgb = [c, x, 0];
    else if (hp <= 2) rgb = [x, c, 0];
    else if (hp <= 3) rgb = [0, c, x];
    else if (hp <= 4) rgb = [0, x, c];
    else if (hp <= 5) rgb = [x, 0, c];
    else if (hp <= 6) rgb = [c, 0, x];
    let m = l - c * 0.5;
    return {
        r: Math.round(255 * (rgb[0] + m)),
        g: Math.round(255 * (rgb[1] + m)),
        b: Math.round(255 * (rgb[2] + m)),
    };
};

/**
 * Converts rgb values (0-255) to the string representation of their hexadecimal integer
 * values. Optionally prepends a # to the string.
 * Source: https://stackoverflow.com/a/5624139
 *
 * @param r {number}  red value
 * @param g {number}  green value
 * @param b {number}  blue value
 * @param hex {bool}  if true, `#` will be prepended to the returned hex string.
 * @return {string}
 */
export const rgbToHex = ({ r, g, b }, hex=true) => `${hex ? '#' : ''}${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

// https://stackoverflow.com/a/5624139
export const hexToRgb = hex => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Will convert numbers
 *
 * @param  number  The number that
 */
export const toHex = (number, hex=true, min=6) => {
    const hexString = parseInt(
        property(
            (parseInt(number, 10) || Object(number)).toString(16).split('.')[0].match(/^(?:#|0x)?(?<hex>[0-9A-Fa-f]+)$/),
            ['groups', 'hex'],
            0
        ), 16
    ).toString(16);

    return `${hex ? '#' : ''}${'0'.repeat(Math.max(min - hexString.length, 0)) + hexString}`;
};

export default {
    rgbToHsl,
    hslToRgb,
    rgbToHex,
    hexToRgb,
    toHex,
};

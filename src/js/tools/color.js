// /src/js/tools/color.js

// https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
// export const rgbToHsl = ({ r, g, b }) => {
//     r /= 255; g /= 255; b /= 255;
//     const max = Math.max(r, g, b);
//     const min = Math.min(r, g, b);
//     const d = max - min;
//     let h;
//     if (d === 0) h = 0;
//     else if (max === r) h = (g - b) / d % 6;
//     else if (max === g) h = (b - r) / d + 2;
//     else if (max === b) h = (r - g) / d + 4;
//     let l = (min + max) / 2;
//     let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
//     return { h: h * 60, s, l };
// };
export const rgbToHsl = ({ r, g, b }) => {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = (max - min);
        s = l >= 0.5 ? d / (2 - (max + min)) : d / (max + min);
        switch(max){
            case r: h = ((g - b) / d + (g < b ? 6 : 0))*60; break;
            case g: h = ((b - r) / d + 2)*60; break;
            case b: h = ((r - g) / d + 4)*60; break;
        }
    }

    return { h, s, l };
}
// export const rgbToHsl = ({ r, g, b }) => {
//     r /= 255, g /= 255, b /= 255;
//     var max = Math.max(r, g, b), min = Math.min(r, g, b);
//     var h, s, l = (max + min) / 2;

//     if(max == min){
//         h = s = 0; // achromatic
//     }else{
//         var d = max - min;
//         s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//         switch(max){
//             case r: h = (g - b) / d + (g < b ? 6 : 0); break;
//             case g: h = (b - r) / d + 2; break;
//             case b: h = (r - g) / d + 4; break;
//         }
//         h /= 6;
//     }

//     return {h, s, l};
// }
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

// https://stackoverflow.com/a/5624139
export const rgbToHex = ({ r, g, b, hex=true }) => `${hex ? '#' : ''}${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

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
 * Converts anything to a hex string. Works bests with integers.
 *
 * @param  number  The number that
 */
export const toHex = number => `#${('00000' + (~~number).toString(16)).substr(-6)}`;

export default {
    rgbToHsl,
    hslToRgb,
    rgbToHex,
    hexToRgb,
    toHex,
};

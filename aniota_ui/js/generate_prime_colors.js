function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function pastelize(hex) {
  const { r, g, b } = hexToRgb(hex);
  let { h, s, l } = rgbToHsl(r, g, b);
  s = Math.max(0.25, s * 0.5);
  l = Math.min(0.85, l * 1.2 + 0.15);
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function neonize(hex) {
  const { r, g, b } = hexToRgb(hex);
  let { h, s, l } = rgbToHsl(r, g, b);
  s = Math.min(1, s * 1.5 + 0.2);
  l = Math.max(0.45, Math.min(0.7, l * 1.1));
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function emeraldize(hex) {
  // Shift hue toward green/emerald, boost sat/brightness
  const { r, g, b } = hexToRgb(hex);
  let { h, s, l } = rgbToHsl(r, g, b);
  h = 0.38; // ~emerald hue
  s = Math.max(0.6, s);
  l = Math.max(0.45, Math.min(0.7, l));
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map(x => {
        const h = x.toString(16);
        return h.length === 1 ? '0' + h : h;
      })
      .join('')
  );
}

function makeGradient(colorA, colorB) {
  const steps = 16;
  const result = [];
  for (let i = 0; i < steps; ++i) {
    const t = i / (steps - 1);
    result.push(rgbToHex(
      lerp(colorA.r, colorB.r, t),
      lerp(colorA.g, colorB.g, t),
      lerp(colorA.b, colorB.b, t)
    ));
  }
  return result;
}

const colorPairs = [
  { name: 'red_orange',   from: '#e81416', to: '#ffa500' },
  { name: 'orange_yellow',from: '#ffa500', to: '#faeb36' },
  { name: 'yellow_green', from: '#faeb36', to: '#79c314' },
  { name: 'green_blue',   from: '#79c314', to: '#487de7' },
  { name: 'blue_indigo',  from: '#487de7', to: '#4b369d' },
  { name: 'indigo_violet',from: '#4b369d', to: '#70369d' },
  { name: 'violet_red',   from: '#70369d', to: '#e81416' }, // Violet to Red wraparound
];

const gradients = {};

for (const pair of colorPairs) {
  const grad = makeGradient(hexToRgb(pair.from), hexToRgb(pair.to));
  gradients[pair.name] = {
    prime: grad,
    pastel: grad.map(pastelize),
    neon: grad.map(neonize),
    emerald: grad.map(emeraldize)
  };
}
const grayscale = [];
for (let i = 0; i < 16; ++i) {
  const t = i / 15;
  const v = lerp(0, 255, t);
  grayscale.push(rgbToHex(v, v, v));
}
gradients.grayscale = {
  prime: grayscale,
  pastel: grayscale.map(pastelize),
  neon: grayscale.map(neonize),
  emerald: grayscale.map(emeraldize)
};

const fs = require('fs');
fs.writeFileSync('prime_colors.json', JSON.stringify(gradients, null, 2));
console.log('prime_colors.json generated.');

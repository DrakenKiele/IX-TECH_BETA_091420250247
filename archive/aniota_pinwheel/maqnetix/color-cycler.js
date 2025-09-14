
export const systemProfile = {
  lastColor: null,
  // Add more system-wide settings here as needed
};

export const COLORS = [
  'system',      // system (none)
  '#000000',     // black
  '#d3d3d3',     // light gray
  '#444444',     // dark gray
  '#ffffff',     // white
  '#e81416',     // red
  '#ffa500',     // orange
  '#faeb36',     // yellow
  '#79c314',     // green
  '#487de7',     // blue
  '#4b369d',     // indigo
  '#70369d',     // violet
];


let currentColorIndex = 0;

export function cycleColor(target) {
  currentColorIndex = (currentColorIndex + 1) % COLORS.length;
  const color = COLORS[currentColorIndex];
  systemProfile.lastColor = color;
  if (target && target.style) {
    target.style.background = color;
  } else if (typeof document !== 'undefined') {
    // fallback: apply to body or log
    document.body.style.background = color;
  }
  return color;
}

// These color pairs should match those in generate_prime_colors.js
export const colorPairs = [
  { name: 'red_orange',   from: '#e81416', to: '#ffa500' },
  { name: 'orange_yellow',from: '#ffa500', to: '#faeb36' },
  { name: 'yellow_green', from: '#faeb36', to: '#79c314' },
  { name: 'green_blue',   from: '#79c314', to: '#487de7' },
  { name: 'blue_indigo',  from: '#487de7', to: '#4b369d' },
  { name: 'indigo_violet',from: '#4b369d', to: '#70369d' },
  { name: 'violet_red',   from: '#70369d', to: '#e81416' },
];

// Utility to get all 16-step gradients for each color pair
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

export const colorGradients = colorPairs.map(pair => makeGradient(hexToRgb(pair.from), hexToRgb(pair.to)));

// ColorCycler class for use with draggable colorable objects
export class ColorCycler {
  constructor() {
    this.pairIndex = Math.floor(Math.random() * colorGradients.length);
    this.colorIndex = Math.floor(Math.random() * 16);
  }
  getColor() {
    return colorGradients[this.pairIndex][this.colorIndex];
  }
  cyclePair(delta) {
    this.pairIndex = (this.pairIndex + delta + colorGradients.length) % colorGradients.length;
    this.colorIndex = 0;
    return this.getColor();
  }
  cycleShade(delta) {
    this.colorIndex = (this.colorIndex + delta + 16) % 16;
    return this.getColor();
  }
  setRandom() {
    this.pairIndex = Math.floor(Math.random() * colorGradients.length);
    this.colorIndex = Math.floor(Math.random() * 16);
    return this.getColor();
  }
}
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

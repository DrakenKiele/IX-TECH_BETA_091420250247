// Generate a grid of screen objects (cells) with calculated dx/dy values
// uiRows: number of rows, uiCols: number of columns, xGap: horizontal gap, yGap: vertical gap, gridType: layout type, xStagger: stagger for fan
function generateGridCells(uiRows, uiCols, xGap, yGap, gridType, xStagger = 0) {
  const cells = [];
  switch (gridType) {
    case 'fan': {
      // Create 7 sensors fanned to the left, staggered by xStagger
      const fanCount = 7;
      const fanAngle = Math.PI / 3; // 60 degrees total fan
      const fanStart = Math.PI; // Start at 180 degrees (left)
      const fanRadius = xGap; // Use xGap as the radius for spread
      for (let i = 0; i < fanCount; ++i) {
        // Angle for each sensor
        const angle = fanStart + (i - (fanCount-1)/2) * (fanAngle / (fanCount-1));
        // dx: negative for left, staggered by xStagger
        const dx = Math.cos(angle) * fanRadius + i * xStagger;
        // dy: vertical spread
        const dy = Math.sin(angle) * fanRadius;
        cells.push({
          label: `Fan ${i+1}`,
          dx,
          dy
        });
      }
      break;
    }
    case 'uniform':
      // Center the grid as a group around (0,0)
      const totalWidth = (uiCols - 1) * xGap;
      const totalHeight = (uiRows - 1) * yGap;
      for (let row = 0; row < uiRows; ++row) {
        for (let col = 0; col < uiCols; ++col) {
          const dx = (col * xGap) - totalWidth / 2;
          const dy = (row * yGap) - totalHeight / 2;
          cells.push({
            label: `Cell ${row * uiCols + col + 1}`,
            dx,
            dy
          });
        }
      }
      break;
    case 'staggered':
      // Example: every other row is offset by half xGap
      const totalW = (uiCols - 1) * xGap;
      const totalH = (uiRows - 1) * yGap;
      for (let row = 0; row < uiRows; ++row) {
        for (let col = 0; col < uiCols; ++col) {
          let dx = (col * xGap) - totalW / 2;
          if (row % 2 === 1) dx += xGap / 2;
          const dy = (row * yGap) - totalH / 2;
          cells.push({
            label: `Cell ${row * uiCols + col + 1}`,
            dx,
            dy
          });
        }
      }
      break;
    case 'custom':
      // Placeholder for custom logic; user can fill in as needed
      // Example: only fill diagonal
      const tW = (uiCols - 1) * xGap;
      const tH = (uiRows - 1) * yGap;
      for (let i = 0; i < Math.min(uiRows, uiCols); ++i) {
        const dx = (i * xGap) - tW / 2;
        const dy = (i * yGap) - tH / 2;
        cells.push({
          label: `Cell ${i + 1}`,
          dx,
          dy
        });
      }
      break;
    default:
      throw new Error('Unknown gridType: ' + gridType);
  }
  return cells;
}
// Render response buttons sized to fit their text
function renderResponseButtons(items) {
  const font = 'bold 1.2vw monospace';
  const margin = 18;
  const height = 36;
  items.forEach((item, i) => {
    // Create a temporary span to measure text width
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.font = font;
    span.textContent = item.label;
    document.body.appendChild(span);
    const textWidth = span.offsetWidth;
    document.body.removeChild(span);
    const width = textWidth + margin * 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = 0.5 * vw + item.dx * vw;
    const cy = 0.5 * vh + item.dy * vh;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.position = 'absolute';
    svg.style.left = `${cx - width/2}px`;
    svg.style.top = `${cy - height/2}px`;
    svg.classList.add('cell-graphic');
    svg.style.zIndex = '2';
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', 0);
    rect.setAttribute('y', 0);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('rx', 15);
    rect.setAttribute('ry', 30);
  rect.setAttribute('fill', 'rgb(127,127,127)');
  rect.setAttribute('stroke', '#888');
    rect.setAttribute('stroke-width', '1');
    svg.appendChild(rect);
    document.body.appendChild(svg);
    const div = document.createElement('div');
    div.className = 'cell-label';
    div.style.left = `${cx}px`;
    div.style.top = `${cy}px`;
    div.style.transform = 'translate(-50%, -50%)';
  div.style.color = '#fff';
    div.style.fontWeight = 'bold';
    div.style.textAlign = 'center';
    div.style.font = font;
    div.textContent = item.label;
    div.style.zIndex = '3';
    div.style.position = 'absolute';
    document.body.appendChild(div);
  });
}
const subjectColors = {
  math:    ['#FF8A80', '#FF5252', '#FF1744', '#D50000', '#B71C1C'],
  science: ['#82B1FF', '#448AFF', '#2979FF', '#0D47A1', '#1A237E'],
  lang:    ['#FFF59D', '#FFF176', '#FFEB3B', '#FBC02D', '#F57F17']
  // Add more subjects as needed
};

function applyLearningLevelColors(element, subject, level) {
  const idx = Math.max(0, Math.min(4, level - 1));
  const color = subjectColors[subject][idx];
  element.style.background = color;
  element.style.borderColor = color;
  element.style.color = (level < 3) ? '#222' : '#fff';
}

function setLearnerLevel(level) {
  // Map of button order to subject (should match createControlButtons logic)
  const rightSubjects = ['math', 'science', 'lang', 'math', 'science', 'lang'];
  const leftSubjects = ['math', 'science', 'lang', 'math', 'science', 'lang'];
  // Get all control buttons
  const btns = document.querySelectorAll('#control-buttons .control-btn');
  btns.forEach((btn, idx) => {
    // There are 12 buttons, 6 per row
    const col = idx % 6;
    const row = Math.floor(idx / 6);
    // Determine subject for this button
    let subject = null;
    if (col === 5) {
      subject = rightSubjects[row * 3 + 2];
      if (row === 0) subject = rightSubjects[0];
      if (row === 1) subject = rightSubjects[3];
    } else if (col === 4) {
      subject = leftSubjects[row * 3 + 2];
      if (row === 0) subject = leftSubjects[0];
      if (row === 1) subject = leftSubjects[3];
    } else if (col === 0) {
      subject = leftSubjects[row];
    } else if (col === 1) {
      subject = leftSubjects[row + 2];
    } else if (col === 2) {
      subject = leftSubjects[row + 4];
    }
    if (subject) applyLearningLevelColors(btn, subject, level);
  });
}
/*
function updateViewportDimensions() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  document.getElementById('viewport-dimensions').textContent = `Viewport: ${w} x ${h}`;
}
window.addEventListener('resize', updateViewportDimensions);
window.addEventListener('DOMContentLoaded', updateViewportDimensions);
*/

// Unified grid/button placements: merge cellRatios and uiButtonRatios into a single array of items to render
const cellRatiosLeft = [
  { label: 'Text 21', dx: -0.42, dy: -0.40 },
  { label: 'Text 19', dx: -0.45, dy: -0.27 },
  { label: 'Text 17', dx: -0.47, dy: -0.13 },
  { label: 'Text 15', dx: -0.48, dy: 0.0 },
  { label: 'Text 16', dx: -0.47, dy: 0.13 },
  { label: 'Text 18', dx: -0.45, dy: 0.27 },
  { label: 'Text 20', dx: -0.42, dy: 0.40 }
];

const cellRatiosMiddle = [
  { label: 'Text 14', dx:-0.22, dy: -0.33 },
  { label: 'Text 12', dx: -0.238, dy: -0.22 },
  { label: 'Text 10', dx: -0.262, dy: -0.106 },
  { label: 'Text 8', dx: -0.269, dy: 0.0 },
  { label: 'Text 9', dx: -0.262, dy: 0.106 },
  { label: 'Text 11', dx: -0.238, dy: 0.22 },
  { label: 'Text 13', dx: -0.22, dy: 0.33 }
];

const cellRatiosRight = [
  { label: 'Text 7', dx: -0.02, dy: -0.27 },
  { label: 'Text 5', dx: -0.036, dy: -0.18 },
  { label: 'Text 3',  dx: -0.045, dy: -0.09 },
  { label: 'Text 1', dx: -0.048, dy: 0.0 },
  { label: 'Text 2', dx: -0.045, dy: 0.09 },
  { label: 'Text 4', dx: -0.036, dy: 0.18 },
  { label: 'Text 6',  dx:-0.02, dy: 0.27 }
];

const uiButtonRatios = [
  { label: 'Aniota', dx: 0.25, dy: 0.40 },
  { label: 'Profile', dx: 0.31, dy: 0.40 },
  { label: 'Settings', dx: 0.376, dy: 0.40 },
  { label: 'Exit', dx: 0.432, dy: 0.40 }
];

// Binary response group
const binary_response = [
  { label: 'Yes (True)', dx: 0.225, dy: -0.10 },
  { label: 'No (False)', dx: 0.325, dy: -0.10 }
];

// Multiple choice response group
const mc_response = [
  { label: 'A', dx: 0.20, dy: -0.22 },
  { label: 'B', dx: 0.25, dy: -0.22 },
  { label: 'C', dx: 0.30, dy: -0.22 },
  { label: 'D', dx: 0.35, dy: -0.22 }
];

// Response group for Expand, Extend, Explore, Review
// Response cross: Activate center, Expand above, Explore below, Extend left, Review right
const responseButtonRatios = [
  { label: 'Expand', dx: 0.27, dy: 0.0},    // above
  { label: 'Extend', dx: 0.21, dy: 0.09 }, // left (dx of Choice 3)
  { label: 'Go', dx: 0.27, dy: 0.09 }, // center
  { label: 'Review', dx: 0.33, dy: 0.09 }, // right (dx of Choice 2, but should be positive, so 0.20+)
  { label: 'Explore', dx: 0.27, dy: 0.19 }    // below
];

// Unified render function for all grid/cell/button items
function renderUnifiedGrid(items) {
  document.querySelectorAll('.cell-label, .cell-graphic').forEach(e => e.remove());
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const defaultWidth = 210;
  const height = 36;
  const margin = 9;
  const font = 'bold 1.2vw monospace';
  const uiLabels = ['Aniota', 'Profile', 'Settings', 'Exit'];
  items.forEach((item, i) => {
    const cx = 0.5 * vw + item.dx * vw;
    const cy = 0.5 * vh + item.dy * vh;
    // Style: round for A, B, C, D; rectangle for others
    const isRound = ['A', 'B', 'C', 'D'].includes(item.label);
    const isUI = uiLabels.includes(item.label);
    const fillGrey = Math.round((i) * 255 / (items.length - 1));
    const borderGrey = Math.round(255 - (i) * 255 / (items.length - 1));
    let svg, shape, btnWidth, btnHeight, width;
  if (isRound) {
      btnWidth = btnHeight = 48;
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', btnWidth);
      svg.setAttribute('height', btnHeight);
      svg.style.position = 'absolute';
      svg.style.left = `${cx - btnWidth/2}px`;
      svg.style.top = `${cy - btnHeight/2}px`;
      svg.classList.add('cell-graphic');
      svg.style.zIndex = '10'; // Ensure visibility
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shape.setAttribute('cx', btnWidth/2);
      shape.setAttribute('cy', btnHeight/2);
      shape.setAttribute('r', btnWidth/2 - 2);
  shape.setAttribute('fill', 'rgb(127,127,127)');
      shape.setAttribute('stroke', `rgb(${borderGrey},${borderGrey},${borderGrey})`);
      shape.setAttribute('stroke-width', '2');
      svg.appendChild(shape);
      document.body.appendChild(svg);
      const div = document.createElement('div');
      div.className = 'cell-label';
      div.style.left = `${cx}px`;
      div.style.top = `${cy}px`;
      div.style.transform = 'translate(-50%, -50%)';
  div.style.color = '#fff';
      div.style.fontWeight = 'bold';
      div.style.textAlign = 'center';
      div.textContent = item.label;
      div.style.zIndex = '11'; // Ensure visibility
      div.style.position = 'absolute';
      div.style.fontSize = '1.1vw';
      document.body.appendChild(div);
  } else if (isUI) {
      // Measure text width for UI buttons
      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.font = font;
      span.textContent = item.label;
      document.body.appendChild(span);
      const textWidth = span.offsetWidth;
      document.body.removeChild(span);
      width = textWidth + margin * 2;
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
      svg.style.position = 'absolute';
      svg.style.left = `${cx - width/2}px`;
      svg.style.top = `${cy - height/2}px`;
      svg.classList.add('cell-graphic');
      svg.style.zIndex = '2';
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shape.setAttribute('x', 0);
      shape.setAttribute('y', 0);
      shape.setAttribute('width', width);
      shape.setAttribute('height', height);
      shape.setAttribute('rx', 15);
      shape.setAttribute('ry', 30);
  shape.setAttribute('fill', 'rgb(127,127,127)');
      shape.setAttribute('stroke', `rgb(${borderGrey},${borderGrey},${borderGrey})`);
      shape.setAttribute('stroke-width', '1');
      svg.appendChild(shape);
      document.body.appendChild(svg);
      const div = document.createElement('div');
      div.className = 'cell-label';
      div.style.left = `${cx}px`;
      div.style.top = `${cy}px`;
      div.style.transform = 'translate(-50%, -50%)';
  div.style.color = '#fff';
      div.style.fontWeight = 'bold';
      div.style.textAlign = 'center';
      div.textContent = item.label;
      div.style.zIndex = '3';
      div.style.position = 'absolute';
      div.style.font = font;
      document.body.appendChild(div);
  } else {
      width = defaultWidth;
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
      svg.style.position = 'absolute';
      svg.style.left = `${cx}px`;
      svg.style.top = `${cy}px`;
      svg.style.transform = 'translate(0, -50%)';
      svg.classList.add('cell-graphic');
      svg.style.zIndex = '0'; // Keep z-index for non-round items
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shape.setAttribute('x', 0);
      shape.setAttribute('y', 0);
      shape.setAttribute('width', width);
      shape.setAttribute('height', height);
      shape.setAttribute('rx', 15);
      shape.setAttribute('ry', 30);
  shape.setAttribute('fill', 'rgb(127,127,127)');
      shape.setAttribute('stroke', `rgb(${borderGrey},${borderGrey},${borderGrey})`);
      shape.setAttribute('stroke-width', '1');
      svg.appendChild(shape);
      document.body.appendChild(svg);
      const div = document.createElement('div');
      div.className = 'cell-label';
      div.style.left = `${cx + margin}px`;
      div.style.top = `${cy}px`;
      div.style.transform = 'translate(0, -50%)';
  div.style.color = '#fff';
      div.style.fontWeight = 'bold';
      div.style.textAlign = 'left';
      div.textContent = item.label;
      div.style.zIndex = '1'; // Keep z-index for non-round items
      div.style.position = 'absolute';
      document.body.appendChild(div);
    }
  });
}

// Render both groups: choice/content cells and UI buttons

// Deprecated: renderAllGridButtons is replaced by renderUnifiedGrid


function displayTextOnGrid(words) {
  // Remove all overlays and SVGs
  document.querySelectorAll('.cell-label, .cell-graphic').forEach(e => e.remove());
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // Precompute all cell centers
  const centers = cellRatios.map(cell => {
    return {
      num: cell.num,
      cx: 0.5 * vw + cell.dx * vw,
      cy: 0.5 * vh + cell.dy * vh
    };
  });
  // Show only as many cells as needed for the words, in numerical order
  const sortedCenters = centers.slice().sort((a, b) => a.num - b.num);
  const width = 210;
  const height = 36;
  const margin = 9;
  for (let i = 0; i < words.length && i < sortedCenters.length; ++i) {
    const cell = sortedCenters[i];
    // Fill: black to white by number
    const fillGrey = Math.round((cell.num - 1) * 255 / (cellRatios.length - 1));
    // Border: black to white, but in reverse order for contrast
    const borderGrey = Math.round(255 - (cell.num - 1) * 255 / (cellRatios.length - 1));
    // SVG rectangle, left edge is at the label's x, label is fully inside with margin
    const rectLeft = cell.cx;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.position = 'absolute';
    svg.style.left = `${rectLeft}px`;
    svg.style.top = `${cell.cy}px`;
    svg.style.transform = 'translate(0, -50%)';
    svg.classList.add('cell-graphic');
    svg.style.zIndex = '0';
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', 0);
    rect.setAttribute('y', 0);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('rx', 14);
    rect.setAttribute('ry', 14);
    rect.setAttribute('fill', 'white'); // DEBUG: make ghost rectangles obvious
    rect.setAttribute('stroke', `rgb(${borderGrey},${borderGrey},${borderGrey})`);
    rect.setAttribute('stroke-width', '1');
    svg.appendChild(rect);
    document.body.appendChild(svg);
    // Overlay word at cell's calculated position, left-aligned with margin inside the rectangle
    const div = document.createElement('div');
    div.className = 'cell-label';
    div.style.left = `${cell.cx + margin}px`;
    div.style.top = `${cell.cy}px`;
    div.style.transform = 'translate(0, -50%)';
    div.style.color = `rgb(${borderGrey},${borderGrey},${borderGrey})`;
    div.style.fontWeight = 'bold';
    div.style.textAlign = 'left';
  div.textContent = words[i] ? words[i] : `[cell ${cell.num}]`;
    div.style.zIndex = '1';
    document.body.appendChild(div);
  }
}


async function fetchQuestionsWithFallback(topic = 'math', level = 'intermediate') {
  // Try API first
  try {
    const apiRes = await fetch('http://localhost:8001/api/sie/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, level })
    });
    if (apiRes.ok) {
      const apiData = await apiRes.json();
      // Use all question types if available
      const q = apiData.socratic_questions;
      const questions = [q.primary, q.follow_up, q.deeper, q.reflective].filter(Boolean);
      displayTextOnGrid(questions);
      return;
    }
  } catch (e) {
    // API failed, will try local
  }
  // Fallback: load local JSON (replace with your preferred file)
  try {
    const localRes = await fetch('../data/descriptions_radix.json');
    if (localRes.ok) {
      const localData = await localRes.json();
      // Example: use first 4 descriptions as questions
      const questions = Object.values(localData).slice(0, 4).map(d => d.description || d);
      displayTextOnGrid(questions);
      return;
    }
  } catch (e) {
    // Local file failed
  }
  // If all else fails, show fallback
  displayTextOnGrid(['No questions available', 'Check API and data folder']);
}


window.addEventListener('DOMContentLoaded', () => {
  // Set background to black
  document.body.style.background = 'black';
  // Example: show all grid cells, UI buttons, MC response buttons, and binary response buttons in one unified render
  const allItems = [...cellRatios, ...uiButtonRatios, ...mc_response];
  renderUnifiedGrid(allItems);
  renderResponseButtons(responseButtonRatios);
  renderResponseButtons(binary_response);
});

/*
// Add coordinate display in a fixed window position (top right)
let coordDiv = document.createElement('div');
coordDiv.className = 'mouse-coord';
coordDiv.style.position = 'fixed';
coordDiv.style.top = '12px';
coordDiv.style.right = '24px';
coordDiv.style.left = 'auto';
coordDiv.style.pointerEvents = 'none';
coordDiv.style.background = 'rgba(128,0,128,0.85)';
coordDiv.style.color = '#000';
coordDiv.style.fontFamily = 'monospace';
coordDiv.style.fontSize = '1.1vw';
coordDiv.style.padding = '2px 8px';
coordDiv.style.borderRadius = '6px';
coordDiv.style.boxShadow = '0 2px 8px #0002';
coordDiv.style.zIndex = '10001';
document.body.appendChild(coordDiv);
document.addEventListener('mousemove', e => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = Math.round(e.clientX - vw / 2);
  const cy = Math.round(e.clientY - vh / 2);
  coordDiv.textContent = `x: ${-cx}, y: ${-cy}`;
});
*/

window.addEventListener('resize', placeCells);
placeCells();



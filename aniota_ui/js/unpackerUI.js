
import { getBlockCorners, generalizeBlockLocation } from './unpacker.js';

let shapes = [];
let pageDims = { width: 1920, height: 1080 };

export function setShapesData(shapesArray, dims) {
  shapes = shapesArray;
  if (dims) pageDims = dims;
}

export function showUnpackerUI() {
  if (document.getElementById('unpacker-ui')) return;
  const panel = document.createElement('div');
  panel.id = 'unpacker-ui';
  panel.style.position = 'fixed';
  panel.style.bottom = '10px';
  panel.style.left = '10px';
  panel.style.background = 'rgba(0,0,0,0.85)';
  panel.style.color = '#fff';
  panel.style.padding = '12px';
  panel.style.borderRadius = '8px';
  panel.style.zIndex = 10002;
  panel.style.maxWidth = '350px';
  panel.innerHTML = `<b>Unpacker</b><br><select id="unpacker-shape-select"></select> <button id="unpacker-all">Unpack All</button><div id="unpacker-output" style="margin-top:10px;"></div>`;
  document.body.appendChild(panel);
  // Populate select
  const select = panel.querySelector('#unpacker-shape-select');
  shapes.forEach((s, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${s.label} (${s.id})`;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => {
    showShapeUnpack(select.value);
  });
  panel.querySelector('#unpacker-all').addEventListener('click', showAllUnpack);
  // Show first by default
  if (shapes.length) showShapeUnpack(0);
}

function showShapeUnpack(idx) {
  const shape = shapes[idx];
  const output = document.getElementById('unpacker-output');
  if (!shape || !output) return;
  const corners = getBlockCorners(shape);
  const logic = generalizeBlockLocation(shape, shapes, pageDims);
  output.innerHTML = `<b>${shape.label}</b><br>Corners: <pre>${JSON.stringify(corners, null, 2)}</pre>Logic: <pre>${JSON.stringify(logic, null, 2)}</pre>`;
}

function showAllUnpack() {
  const output = document.getElementById('unpacker-output');
  if (!output) return;
  let html = '';
  shapes.forEach((shape, idx) => {
    const corners = getBlockCorners(shape);
    const logic = generalizeBlockLocation(shape, shapes, pageDims);
    html += `<b>${shape.label}</b><br>Corners: <pre>${JSON.stringify(corners, null, 2)}</pre>Logic: <pre>${JSON.stringify(logic, null, 2)}</pre><hr>`;
  });
  output.innerHTML = html;
}

export function hideUnpackerUI() {
  const panel = document.getElementById('unpacker-ui');
  if (panel) panel.remove();
}

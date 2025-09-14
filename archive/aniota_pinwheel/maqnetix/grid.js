
export function resizeEdgeGlow() {
  // TODO: Implement edge glow effect for the grid if needed
}

export function attachDragResizeHandlers() {
  // Deprecated: See new grid Marks logic.
  // ...existing code...
}


import { THEME_REF, getTheme, getThemeName } from "../js/theme.js";
import { moveSquareToArea, findPossibleDuplicateShapes, rectsOverlap } from "./shapes.js";
import { cycleColor, COLORS } from "./color-cycler.js";

export const GRID_COLS = 8;
export const GRID_ROWS = 8;

export const GRID_WIDTH = {
  get value() {
    return window.innerWidth || 1920;
  },
};

export const GRID_HEIGHT = {
  get value() {
    return window.innerHeight || 1080;
  },
};

export function getCoarseCellSize() {
  return {
    width: GRID_WIDTH.value / GRID_COLS,
    height: GRID_HEIGHT.value / GRID_ROWS,
  };
}

export function getFineCellSize() {
  const coarse = getCoarseCellSize();
  return {
    width: coarse.width / 2,
    height: coarse.height / 2,
  };
}

export function getAreaOffsets() {
  return { 1: { x: 0, y: 0 } };
}

const DEFAULT_BG_COLOR = "#000000ff";
const SNAP_OPACITY = 0.5;

export function renderGrid(selectedArea = 1) {
  const workspace = document.getElementById("snapgrid-workspace");
  if (!workspace) {
    console.warn("[renderGrid] No #snapgrid-workspace element found");
    return;
  }


  const width = GRID_WIDTH.value;
  const height = GRID_HEIGHT.value;
  console.log(`[renderGrid] Called with selectedArea=`, selectedArea, "width=", width, "height=", height);

  const coarse = getCoarseCellSize();
  const fine = getFineCellSize();
  console.log(`[renderGrid] coarse=`, coarse, "fine=", fine);

  const coarseCols = Math.floor(width / coarse.width);
  const coarseRows = Math.floor(height / coarse.height);
  const fineCols = Math.floor(width / fine.width);
  const fineRows = Math.floor(height / fine.height);
  console.log(`[renderGrid] coarseCols=`, coarseCols, "coarseRows=", coarseRows, "fineCols=", fineCols, "fineRows=", fineRows);

  workspace.style.position = "relative";
  workspace.style.overflow = "hidden";
  workspace.style.width = width + "px";
  workspace.style.height = height + "px";

  workspace
    .querySelectorAll(".snapgrid-gridline, .snapgrid-snappoint")
    .forEach((e) => e.remove());

  const theme = getTheme(selectedArea);
  let color = theme.gridColor;
  console.log(`[renderGrid] theme=`, theme, "gridColor=", color);
  if (/^#([0-9a-fA-F]{8})$/.test(color)) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const a = parseInt(color.slice(7, 9), 16) / 255;
    color = `rgba(${r},${g},${b},${a * 0.6})`;
  } else if (/^#([0-9a-fA-F]{6})$/.test(color)) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    color = `rgba(${r},${g},${b},0.6)`;
  } else if (color.startsWith("rgba")) {
    color = color.replace(
      /rgba\(([^)]+),\s*([\d.]+)\)/,
      (m, rgb, a) => `rgba(${rgb},${Math.min(parseFloat(a) * 0.6, 1)})`
    );
  } else if (color.startsWith("rgb")) {
    color = color.replace(/rgb\(([^)]+)\)/, (m, rgb) => `rgba(${rgb},0.6)`);
  }
  drawGridLines(
    workspace,
    coarseCols,
    coarseRows,
    coarse.width,
    coarse.height,
    color
  );
  drawSnapPoints(
    workspace,
    fineCols,
    fineRows,
    fine.width,
    fine.height,
    4,
    color,
    SNAP_OPACITY
  );
}

function drawGridLines(workspace, cols, rows, cellW, cellH, color) {
  for (let i = 0; i <= cols; i++) {
    const line = document.createElement("div");
    line.className = "snapgrid-gridline";
    line.style.position = "absolute";
    line.style.left = i * cellW + "px";
    line.style.top = "0";
    line.style.width = "1px";
    line.style.height = GRID_HEIGHT.value + "px";
    line.style.background = color;
    workspace.appendChild(line);
  }
  for (let j = 0; j <= rows; j++) {
    const line = document.createElement("div");
    line.className = "snapgrid-gridline";
    line.style.position = "absolute";
    line.style.left = "0";
    line.style.top = j * cellH + "px";
    line.style.width = GRID_WIDTH.value + "px";
    line.style.height = "1px";
    line.style.background = color;
    workspace.appendChild(line);
  }
}

function drawSnapPoints(
  workspace,
  cols,
  rows,
  cellW,
  cellH,
  snapSize,
  color,
  opacity
) {
  if (window.console && typeof window.console.log === "function") {
    console.log(
      `[gridRenderer.js] drawSnapPoints: cols=${cols}, rows=${rows}, total=${
        (cols + 1) * (rows + 1)
      }, cellW=${cellW}, cellH=${cellH}`
    );
  }
  let snapPointsCreated = 0;
  for (let i = 0; i <= cols; i++) {

  // --- Color cycling for draggables ---
  // Attach color cycling to all draggable objects (shapes, marks, lines)
  setTimeout(() => {
    const draggables = document.querySelectorAll('.aniota-shape, .aniota-mark, .aniota-line');
    draggables.forEach(el => {
      if (el._colorCyclerAttached) return;
      el._colorCyclerAttached = true;

      // Helper: get type
      const getType = (el) => {
        if (el.classList.contains('aniota-shape')) return 'shape';
        if (el.classList.contains('aniota-mark')) return 'mark';
        if (el.classList.contains('aniota-line')) return 'line';
        return 'unknown';
      };

      // Helper: get current color
      const getCurrentColor = (el, type, which) => {
        if (type === 'shape') {
          if (which === 'fill') return el.style.backgroundColor || el.getAttribute('data-fill') || COLORS[0];
          if (which === 'border') return el.style.borderColor || el.getAttribute('data-border') || COLORS[0];
        } else {
          return el.style.backgroundColor || el.style.borderColor || el.getAttribute('data-color') || COLORS[0];
        }
      };

      // Helper: set color
      const setColor = (el, type, which, color) => {
        if (type === 'shape') {
          if (which === 'fill') {
            el.style.backgroundColor = color;
            el.setAttribute('data-fill', color);
          }
          if (which === 'border') {
            el.style.borderColor = color;
            el.setAttribute('data-border', color);
          }
        } else {
          el.style.backgroundColor = color;
          el.setAttribute('data-color', color);
        }
      };

      // Mouse wheel: cycle color
      el.addEventListener('wheel', (e) => {
        if (!window.isDragging) return;
        e.preventDefault();
        const type = getType(el);
        if (type === 'shape') {
          // Default: cycle fill
          const cur = getCurrentColor(el, type, 'fill');
          const next = cycleColor(cur);
          setColor(el, type, 'fill', next);
        } else {
          // marks/lines: cycle main color
          const cur = getCurrentColor(el, type);
          const next = cycleColor(cur);
          setColor(el, type, null, next);
        }
      });

      // Mouse down: left/right click to cycle fill/border (shapes only)
      el.addEventListener('mousedown', (e) => {
        if (!window.isDragging) return;
        const type = getType(el);
        if (type === 'shape') {
          if (e.button === 0) { // left click: fill
            e.preventDefault();
            const cur = getCurrentColor(el, type, 'fill');
            const next = cycleColor(cur);
            setColor(el, type, 'fill', next);
          } else if (e.button === 2) { // right click: border
            e.preventDefault();
            const cur = getCurrentColor(el, type, 'border');
            const next = cycleColor(cur);
            setColor(el, type, 'border', next);
          }
        } else {
          // marks/lines: any click cycles main color
          e.preventDefault();
          const cur = getCurrentColor(el, type);
          const next = cycleColor(cur);
          setColor(el, type, null, next);
        }
      });
      // Prevent context menu on right click while dragging
      el.addEventListener('contextmenu', (e) => {
        if (window.isDragging) e.preventDefault();
      });
    });
  }, 0);
    for (let j = 0; j <= rows; j++) {
      const pt = document.createElement("div");
      pt.className = "snapgrid-snappoint";
      pt.style.position = "absolute";
      // Store actual grid intersection coordinates as data attributes
      const gridX = i * cellW;
      const gridY = j * cellH;
      pt.setAttribute('data-grid-x', gridX);
      pt.setAttribute('data-grid-y', gridY);
      // Position visual dot centered on grid intersection
      pt.style.left = gridX - snapSize / 2 + "px";
      pt.style.top = gridY - snapSize / 2 + "px";
      pt.style.width = snapSize + "px";
      pt.style.height = snapSize + "px";
      pt.style.background = color;
      pt.style.borderRadius = "50%";
      pt.style.opacity = opacity;
      if (
        typeof window.snapI === "number" &&
        typeof window.snapJ === "number" &&
        i === window.snapI &&
        j === window.snapJ
      ) {
        pt.classList.add("snapped");
      }
      workspace.appendChild(pt);
      snapPointsCreated++;
      if (window.console && typeof window.console.log === "function") {
        console.log(
          `[gridRenderer.js] Snap-point created at (i=${i}, j=${j}) left=${pt.style.left}, top=${pt.style.top}`
        );
      }
    }
  }
  if (window.console && typeof window.console.log === "function") {
    console.log(
      `[gridRenderer.js] drawSnapPoints: Finished. Total snap-points created: ${snapPointsCreated}`
    );
  }





  function handleDragMove(e, dragStart, GRID_WIDTH, GRID_HEIGHT) {
    if (!window.isDragging || !dragStart) return;
    const dx = e.clientX - dragStart.mouseX;
    const dy = e.clientY - dragStart.mouseY;
    dragStart.positions.forEach(({ square: sq, left, top }) => {
      let newLeft = left + dx;
      let newTop = top + dy;
      newLeft = Math.max(0, Math.min(GRID_WIDTH - sq.offsetWidth, newLeft));
      newTop = Math.max(0, Math.min(GRID_HEIGHT - sq.offsetHeight, newTop));
      sq.style.left = newLeft + "px";
      sq.style.top = newTop + "px";
    });
  }

  function handleDragEnd(e, dragStart) {
    if (!window.isDragging || !dragStart) return;
    dragStart.positions.forEach(({ square: sq }) => {
      const centroidX = sq.offsetLeft + sq.offsetWidth / 2;
      const centroidY = sq.offsetTop + sq.offsetHeight / 2;
      const snapPoints = Array.from(
        document.querySelectorAll(".snapgrid-snappoint")
      );
      let currentShape = null;
      let otherShapes = [];
      if (
        sq.dataset &&
        sq.dataset.id &&
        Array.isArray(window._aniotaAllShapes)
      ) {
        currentShape = window._aniotaAllShapes.find(
          (s) => s.id === sq.dataset.id
        );
        if (currentShape) {
          otherShapes = window._aniotaAllShapes.filter(
            (s) =>
              s.id !== currentShape.id &&
              s.area === currentShape.area &&
              s.state === "active"
          );
        }
      }
      function overlapsAny(x, y, w, h, others) {
        return others.some((s) => {
          const sx = parseInt(s.x, 10);
          const sy = parseInt(s.y, 10);
          const sw = parseInt(s.width, 10);
          const sh = parseInt(s.height, 10);
          return x < sx + sw && x + w > sx && y < sy + sh && y + h > sy;
        });
      }
      const snapCandidates = snapPoints
        .map((pt) => {
          // Use stored grid coordinates instead of calculating from visual position
          const ptX = parseFloat(pt.getAttribute('data-grid-x'));
          const ptY = parseFloat(pt.getAttribute('data-grid-y'));
          const dist = Math.hypot(ptX - centroidX, ptY - centroidY);
          const i = Math.round(
            ptX / (window.GRID_WIDTH?.value / window.GRID_COLS)
          );
          const j = Math.round(
            ptY / (window.GRID_HEIGHT?.value / window.GRID_ROWS)
          );
          return { pt, ptX, ptY, dist, i, j };
        })
        .sort((a, b) => a.dist - b.dist);
      let found = null;
      for (const cand of snapCandidates) {
        const left = cand.ptX - sq.offsetWidth / 2;
        const top = cand.ptY - sq.offsetHeight / 2;
        if (
          !overlapsAny(left, top, sq.offsetWidth, sq.offsetHeight, otherShapes)
        ) {
          found = cand;
          break;
        }
      }
      if (found) {
        const { ptX, ptY, i, j } = found;
        sq.style.left = ptX - sq.offsetWidth / 2 + "px";
        sq.style.top = ptY - sq.offsetHeight / 2 + "px";
        window.snapI = i;
        window.snapJ = j;
        if (
          sq.dataset &&
          sq.dataset.id &&
          Array.isArray(window._aniotaAllShapes)
        ) {
          const shape = window._aniotaAllShapes.find(
            (s) => s.id === sq.dataset.id
          );
          if (shape) {
            shape.x = Math.round(ptX - sq.offsetWidth / 2);
            shape.y = Math.round(ptY - sq.offsetHeight / 2);
            shape.updated = new Date().toISOString();
          }
        }
      }
    });
    window.isDragging = false;
    window.dragStart = null;
    document.body.style.userSelect = "";
    if (window.autoCommitEnabled) {
      saveShapesToLocalStorage();
    }
  }

  function handleResizeMove(e, resizeStart, GRID_WIDTH, GRID_HEIGHT) {
    if (!window.isResizing || !resizeStart) return;
    let dx = e.clientX - resizeStart.startX;
    let dy = e.clientY - resizeStart.startY;
    let newW = resizeStart.startW,
      newH = resizeStart.startH,
      newL = resizeStart.startL,
      newT = resizeStart.startT;
    const sq = resizeStart.square;
    let snapCorner = null,
      minDist = 16;
    if (["nw", "ne", "sw", "se"].includes(resizeStart.dir)) {
      const centerX = resizeStart.startL + resizeStart.startW / 2;
      const centerY = resizeStart.startT + resizeStart.startH / 2;
      let cornerVecX = 0,
        cornerVecY = 0;
      if (resizeStart.dir === "nw") {
        cornerVecX = -resizeStart.startW / 2;
        cornerVecY = -resizeStart.startH / 2;
      }
      if (resizeStart.dir === "ne") {
        cornerVecX = resizeStart.startW / 2;
        cornerVecY = -resizeStart.startH / 2;
      }
      if (resizeStart.dir === "sw") {
        cornerVecX = -resizeStart.startW / 2;
        cornerVecY = resizeStart.startH / 2;
      }
      if (resizeStart.dir === "se") {
        cornerVecX = resizeStart.startW / 2;
        cornerVecY = resizeStart.startH / 2;
      }
      let newCornerX = centerX + cornerVecX + dx;
      let newCornerY = centerY + cornerVecY + dy;
      const snapPoints = document.querySelectorAll(".snapgrid-snappoint");
      for (const pt of snapPoints) {
        const ptX = parseFloat(pt.getAttribute('data-grid-x'));
        const ptY = parseFloat(pt.getAttribute('data-grid-y'));
        const dist = Math.hypot(ptX - newCornerX, ptY - newCornerY);
        if (dist < minDist) {
          minDist = dist;
          snapCorner = { x: ptX, y: ptY };
        }
      }
      if (snapCorner) {
        newCornerX = snapCorner.x;
        newCornerY = snapCorner.y;
      }
      newW = Math.max(60, Math.abs(newCornerX - centerX) * 2);
      newH = Math.max(40, Math.abs(newCornerY - centerY) * 2);
      newL = centerX - newW / 2;
      newT = centerY - newH / 2;
    } else {
      switch (resizeStart.dir) {
        case "n":
          newH = resizeStart.startH - dy;
          newT = resizeStart.startT + dy;
          break;
        case "e":
          newW = resizeStart.startW + dx;
          break;
        case "s":
          newH = resizeStart.startH + dy;
          break;
        case "w":
          newW = resizeStart.startW - dx;
          newL = resizeStart.startL + dx;
          break;
      }
    }
    newW = Math.max(60, newW);
    newH = Math.max(40, newH);
    if (newL < 0) {
      newW -= 0 - newL;
      newL = 0;
    }
    if (newT < 0) {
      newH -= 0 - newT;
      newT = 0;
    }
    if (newL + newW > GRID_WIDTH) {
      newW = GRID_WIDTH - newL;
    }
    if (newT + newH > GRID_HEIGHT) {
      newH = GRID_HEIGHT - newT;
    }
    newW = Math.max(60, newW);
    newH = Math.max(40, newH);
    sq.style.width = newW + "px";
    sq.style.height = newH + "px";
    sq.style.left = newL + "px";
    sq.style.top = newT + "px";
    const snapPoints = Array.from(
      document.querySelectorAll(".snapgrid-snappoint")
    );
    const snapSet = new Set(
      snapPoints.map(
        (pt) =>
          `${Math.round(parseFloat(pt.getAttribute('data-grid-x')))},${Math.round(
            parseFloat(pt.getAttribute('data-grid-y'))
          )}`
      )
    );
    const corners = [
      { x: newL, y: newT },
      { x: newL + newW, y: newT },
      { x: newL, y: newT + newH },
      { x: newL + newW, y: newT + newH },
    ];
    const centroid = { x: newL + newW / 2, y: newT + newH / 2 };
    sq.querySelectorAll(".centroid-marker").forEach((el) => el.remove());
    const marker = document.createElement("div");
    marker.className = "centroid-marker";
    marker.style.position = "absolute";
    marker.style.left = centroid.x - newL - 6 + "px";
    marker.style.top = centroid.y - newT - 6 + "px";
    marker.style.width = "12px";
    marker.style.height = "12px";
    marker.style.background = "#a259f7";
    marker.style.border = "2px solid #fff";
    marker.style.borderRadius = "50%";
    marker.style.zIndex = 30;
    marker.title = "Centroid";
    sq.appendChild(marker);
    snapPoints.forEach((pt) => {
      pt.style.setProperty("background", "#2196f3", "important");
      pt.style.setProperty("box-shadow", "", "important");
    });
    const allPoints = [...corners, centroid];
    let allSnapped = true;
    allPoints.forEach((pt) => {
      const key = `${Math.round(pt.x)},${Math.round(pt.y)}`;
      if (snapSet.has(key)) {
        const snapEl = snapPoints.find(
          (el) =>
            `${Math.round(parseFloat(el.getAttribute('data-grid-x')))},${Math.round(
              parseFloat(el.getAttribute('data-grid-y'))
            )}` === key
        );
        if (snapEl) {
          snapEl.style.setProperty("background", "#4caf50", "important");
          snapEl.style.setProperty(
            "box-shadow",
            "0 0 8px 2px #4caf50",
            "important"
          );
        }
      } else {
        allSnapped = false;
      }
    });
  }

  function handleResizeEnd(e) {
    if (!window.isResizing || !window.resizeStart) return;
    window.isResizing = false;
    window.resizeStart = null;
    document.body.style.userSelect = "";
    if (window.autoCommitEnabled) {
      saveShapesToLocalStorage();
    }
  }
}

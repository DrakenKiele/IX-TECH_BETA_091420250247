let pinNameCounter = 1;
import { ColorCycler } from "./color-cycler.js";
import { createToggleButton } from "./button-maker.js";
export function renderDotConnectLinesFromShapes() {
  if (!window._aniotaAllShapes || !Array.isArray(window._aniotaAllShapes))
    return;
  // Find the SVG overlay or create it if needed
  let svg = document.getElementById("dot-connect-svg");
  if (!svg) {
    const workspace =
      document.getElementById("snapgrid-workspace") || document.body;
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "dot-connect-svg");
    svg.style.position = "absolute";
    svg.style.top = 0;
    svg.style.left = 0;
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = 9999;
    workspace.appendChild(svg);
  }
  // Remove any existing lines
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  // Draw each line shape
  window._aniotaAllShapes.forEach((shape) => {
    if (shape.type === "dot-connect-line") {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", shape.x1);
      line.setAttribute("y1", shape.y1);
      line.setAttribute("x2", shape.x2);
      line.setAttribute("y2", shape.y2);
      line.setAttribute("stroke", shape.color || "#fff");
      line.setAttribute("stroke-width", shape.width || 2);
      line.setAttribute("stroke-linecap", "round");
      svg.appendChild(line);
    }
  });
}
export function addDotConnectLinesToShapes() {
  if (!window._aniotaAllShapes || !Array.isArray(window._aniotaAllShapes))
    return;
  // Remove any previous dot-connect line shapes
  window._aniotaAllShapes = window._aniotaAllShapes.filter(
    (s) => s.type !== "dot-connect-line"
  );

  // Only save lines, not pins
  pinLines.forEach(({ pinEl1, pinEl2 }) => {
    const getPinCenter = (el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY,
      };
    };
    const c1 = getPinCenter(pinEl1);
    const c2 = getPinCenter(pinEl2);
    window._aniotaAllShapes.push({
      type: "dot-connect-line",
      x1: c1.x,
      y1: c1.y,
      x2: c2.x,
      y2: c2.y,
      color: "#fff",
      width: 2,
      created: new Date().toISOString(),
    });
  });
}

export function createToggleGridMarksButton(config = {}) {
  return createToggleButton({
    id: "button-toggle-grid-marks",
    label: "Enable Grid Pins",
    right: "10px",
    onEnable: () => {
      enableGridMarks();
      const btn = document.getElementById("button-toggle-grid-marks");
      if (btn) {
        btn.textContent = "Disable Grid Pins";
        btn.classList.add("active");
      }
    },
    onDisable: () => {
      disableGridMarks();
      const btn = document.getElementById("button-toggle-grid-marks");
      if (btn) {
        btn.textContent = "Enable Grid Pins";
        btn.classList.remove("active");
      }
    },
    styleOverrides: {
      left: "unset",
    },
    ...config,
  });
}


// Attach color cycler to selected pins (grid marks)
function attachPinColorCycler(pinEl, shape) {
  if (!pinEl || !shape) return;
  // Remove any previous wheel event to avoid stacking
  pinEl.onwheel = null;
  // Only allow color cycling if the pin is selected
  pinEl.addEventListener("wheel", function onWheel(e) {
    if (!shape.selected) return;
    e.preventDefault();
    // Use ColorCycler to get next color
    if (!window._pinColorCycler) {
      window._pinColorCycler = new ColorCycler();
    }
    const nextColor = window._pinColorCycler.cycle(
      shape.background,
      e.deltaY > 0 ? 1 : -1
    );
    shape.background = nextColor;
    // Update pin color visually (assumes pinEl is an <img> or <div>)
    if (pinEl.tagName === "IMG") {
      pinEl.style.filter = `drop-shadow(0 0 0 ${nextColor})`;
    } else {
      pinEl.style.background = nextColor;
    }
    // Optionally trigger a save or re-render here
  });
}

// Example usage: after creating or selecting a pin, call attachPinColorCycler(pinEl, shape)

let gridMarksEnabled = false;
// Use a Map for pins for compatibility with createPinElement/addPin
let pins = new Map();
let currentDraggingPin = null;
let currentCycler = null;
let deleteHeld = false;
let gridMarksOverlay = null;
let dotConnectSVG = null;
let pinOrder = [];
let pinLines = [];
// --- Enable/Disable Grid Marks ---
function enableGridMarks() {
  if (gridMarksEnabled) return;
  gridMarksEnabled = true;
  // Create overlay for pin placement
  const workspace =
    document.getElementById("snapgrid-workspace") || document.body;
  gridMarksOverlay = document.createElement("div");
  gridMarksOverlay.id = "grid-marks-overlay";
  gridMarksOverlay.style.position = "absolute";
  gridMarksOverlay.style.top = 0;
  gridMarksOverlay.style.left = 0;
  gridMarksOverlay.style.width = "100%";
  gridMarksOverlay.style.height = "100%";
  gridMarksOverlay.style.pointerEvents = "auto";
  gridMarksOverlay.style.background = "rgba(0,0,0,0.01)"; // nearly invisible
  gridMarksOverlay.style.zIndex = 100;
  workspace.appendChild(gridMarksOverlay);

  // Add SVG for dot connect lines
  dotConnectSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  dotConnectSVG.setAttribute("id", "dot-connect-svg");
  dotConnectSVG.style.position = "absolute";
  dotConnectSVG.style.top = 0;
  dotConnectSVG.style.left = 0;
  dotConnectSVG.style.width = "100%";
  dotConnectSVG.style.height = "100%";
  dotConnectSVG.style.pointerEvents = "none";
  dotConnectSVG.style.zIndex = 9999;
  workspace.appendChild(dotConnectSVG);
  gridMarksOverlay.addEventListener("mousedown", onGridMarkMouseDown);
  document.addEventListener("keydown", onDeleteKeyDown);
  document.addEventListener("keyup", onDeleteKeyUp);
  // Show existing pins if any
  pins.forEach((pinObj) => {
    if (!workspace.contains(pinObj.element)) {
      workspace.appendChild(pinObj.element);
    }
  });
}

function disableGridMarks() {
  if (!gridMarksEnabled) return;
  gridMarksEnabled = false;
  if (gridMarksOverlay && gridMarksOverlay.parentNode) {
    gridMarksOverlay.removeEventListener("mousedown", onGridMarkMouseDown);
    gridMarksOverlay.parentNode.removeChild(gridMarksOverlay);
    gridMarksOverlay = null;
  }
  if (dotConnectSVG && dotConnectSVG.parentNode) {
    dotConnectSVG.parentNode.removeChild(dotConnectSVG);
    dotConnectSVG = null;
  }
  document.removeEventListener("keydown", onDeleteKeyDown);
  document.removeEventListener("keyup", onDeleteKeyUp);
  // Optionally hide pins (or leave them visible)
  pins.forEach((pinObj) => {
    if (pinObj.element && pinObj.element.parentNode) {
      pinObj.element.parentNode.removeChild(pinObj.element);
    }
  });
  pinOrder = [];
  pinLines = [];
}

function getCoarseCellSize() {
  return {
    width: (window.innerWidth || 1920) / 8,
    height: (window.innerHeight || 1080) / 8,
  };
}

function getNearestSnapPoint(x, y) {
  const coarse = getCoarseCellSize();
  const fine = typeof getFineCellSize === 'function' ? getFineCellSize() : { width: coarse.width / 2, height: coarse.height / 2 };
  // Snap to both coarse and fine grid points, choose the closest
  const coarseSnap = {
    x: Math.round(x / coarse.width) * coarse.width,
    y: Math.round(y / coarse.height) * coarse.height,
  };
  const fineSnap = {
    x: Math.round(x / fine.width) * fine.width,
    y: Math.round(y / fine.height) * fine.height,
  };
  // Calculate distances
  const distCoarse = Math.hypot(x - coarseSnap.x, y - coarseSnap.y);
  const distFine = Math.hypot(x - fineSnap.x, y - fineSnap.y);
  // Return the closer snap point
  return distCoarse <= distFine ? coarseSnap : fineSnap;
}

function createMapPin(x, y, color) {
  const el = document.createElement("div");
  el.className = "map-pin aniota-mark";
  el.style.position = "absolute";
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.width = "24px";
  el.style.height = "24px";
  el.style.background = color;
  el.style.borderRadius = "50%";
  el.style.boxShadow = "0 2px 8px #000a";
  el.style.cursor = "grab";
  el.style.zIndex = 20000;
  el.setAttribute("tabindex", 0);
  el.setAttribute("alt", "");
  el.setAttribute("title", "");

  // Add pin image on top of colored circle
  const img = document.createElement("img");
  img.src = "assets/pin.png";
  img.alt = "pin";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "contain";
  img.style.position = "absolute";
  img.style.left = 0;
  img.style.top = 0;
  img.style.pointerEvents = "none";
  el.appendChild(img);

  // Make pin selectable and highlight on click
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    // Remove highlight from all pins
    document
      .querySelectorAll(".map-pin.selected, .aniota-mark.selected")
      .forEach((pin) => pin.classList.remove("selected"));
    el.classList.add("selected");
    // Optionally, set as selectedPinElement if needed
    window.selectedPinElement = el;
  });
  // Drag and delete logic
  el.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    currentDraggingPin = { el, color };
    currentCycler = new ColorCycler();
    document.addEventListener("mousemove", onPinDragMove);
    document.addEventListener("mouseup", onPinDragEnd);
    document.addEventListener("wheel", onPinWheel, { passive: false });
    e.preventDefault();
  });
  // Prevent scaling: do not add any scaling logic or handles
  // (If you have a global scaling/resize handler, ensure it ignores .map-pin elements)
  return { el, color };
}

function onGridMarkMouseDown(e) {
  if (e.button !== 0) return;
  if (e.target.closest("button")) return;

  // If a shape is clicked, select it and do not drop a pin/line
  // Assume shapes have a class 'aniota-shape' or similar, or are tracked in window._aniotaAllShapes
  let shapeEl = null;
  if (window._aniotaAllShapes && Array.isArray(window._aniotaAllShapes)) {
    // Try to find a shape element at the click position
    for (const shape of window._aniotaAllShapes) {
      if (shape.id) {
        const el = document.getElementById(shape.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            shapeEl = el;
            break;
          }
        }
      }
    }
  }
  if (shapeEl) {
    // Select the shape (use selectionManager if available)
    if (
      window.selectionManager &&
      typeof window.selectionManager.select === "function"
    ) {
      window.selectionManager.select(shapeEl);
    } else {
      // Fallback: add a selected class
      shapeEl.classList.add("selected");
    }
    return; // Do not drop a pin or line
  }

  let x = e.clientX,
    y = e.clientY;
  if (window.snapToGridEnabled) {
    const snapped = getNearestSnapPoint(x, y);
    x = snapped.x;
    y = snapped.y;
  }
  const cycler = new ColorCycler();
  const color = cycler.getColor();
  // Check if a pin already exists at this location
  let duplicatePin = null;
  let duplicatePinIndex = -1;
  pins.forEach((pinObj, _, map) => {
    const px = parseInt(pinObj.el.style.left, 10);
    const py = parseInt(pinObj.el.style.top, 10);
    if (Math.abs(px - x) < 2 && Math.abs(py - y) < 2) {
      duplicatePin = pinObj;
      duplicatePinIndex = Array.from(map.values()).indexOf(pinObj);
    }
  });
  // Only close the loop if dot connect is enabled, pin count >= 3, and clicking the first pin
  if (
    window.dotConnectEnabled &&
    duplicatePin &&
    pinOrder.length >= 3 &&
    pinOrder[0] &&
    duplicatePin.el === pinOrder[0].el
  ) {
    addDotConnectLinesToShapes();
    // Remove all pins and lines
    pins.forEach((pinObj) => {
      if (pinObj.el && pinObj.el.parentNode)
        pinObj.el.parentNode.removeChild(pinObj.el);
    });
    pins.clear();
    pinOrder = [];
    pinLines = [];
    return;
  }
  const pin = createMapPin(x, y, color);
  pins.set(pin.el, pin);
  // Actually append the pin to the workspace here (if not already)
  const workspace =
    document.getElementById("snapgrid-workspace") || document.body;
  if (!workspace.contains(pin.el)) {
    workspace.appendChild(pin.el);
  }
  // Dot connect logic
  if (window.dotConnectEnabled) {
    if (pinOrder.length > 0) {
      const prevPin = pinOrder[pinOrder.length - 1];
      drawDotConnectLine(prevPin.el, pin.el);
    }
    pinOrder.push(pin);
  } else {
    pinOrder.push(pin);
  }
  currentDraggingPin = pin;
  currentCycler = cycler;
  pin.el.style.pointerEvents = "none";
  document.addEventListener("mousemove", onPinDragMove);
  document.addEventListener("mouseup", onPinDragEnd);
  document.addEventListener("wheel", onPinWheel, { passive: false });
  e.preventDefault();
}
// Draw a line between two pin elements
function drawDotConnectLine(pinEl1, pinEl2) {
  if (!dotConnectSVG) return;
  const getCenter = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + rect.height / 2 + window.scrollY,
    };
  };
  const c1 = getCenter(pinEl1);
  const c2 = getCenter(pinEl2);
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", c1.x);
  line.setAttribute("y1", c1.y);
  line.setAttribute("x2", c2.x);
  line.setAttribute("y2", c2.y);
  line.setAttribute("stroke", "#fff");
  line.setAttribute("stroke-width", "2");
  line.setAttribute("stroke-linecap", "round");
  dotConnectSVG.appendChild(line);
  pinLines.push({ line, pinEl1, pinEl2 });
}

function onPinDragMove(e) {
  if (!currentDraggingPin) return;
  let x = e.clientX,
    y = e.clientY;
  if (window.snapToGridEnabled) {
    const snapped = getNearestSnapPoint(x, y);
    x = snapped.x;
    y = snapped.y;
  }
  currentDraggingPin.el.style.left = x + "px";
  currentDraggingPin.el.style.top = y + "px";
}

function onPinWheel(e) {
  if (!currentCycler || !currentDraggingPin) return;
  e.preventDefault();
  if (e.shiftKey) {
    currentDraggingPin.color = currentCycler.cycleShade(e.deltaY > 0 ? 1 : -1);
  } else {
    currentDraggingPin.color = currentCycler.cyclePair(e.deltaY > 0 ? 1 : -1);
  }
  currentDraggingPin.el.style.background = currentDraggingPin.color;
}

function onPinDragEnd(e) {
  if (!currentDraggingPin) return;
  document.removeEventListener("mousemove", onPinDragMove);
  document.removeEventListener("mouseup", onPinDragEnd);
  document.removeEventListener("wheel", onPinWheel, { passive: false });
  currentDraggingPin.el.style.pointerEvents = "";
  if (deleteHeld) {
    removePin(currentDraggingPin);
    currentDraggingPin = null;
    currentCycler = null;
    return;
  }
  // Assign a sequential name if the pin does not already have one
  const currentAlt = currentDraggingPin.el.getAttribute("alt") || "";
  if (!currentAlt) {
    const name = `Pin ${pinNameCounter++}`;
    currentDraggingPin.el.setAttribute("alt", name);
    currentDraggingPin.el.title = name;
  }
  currentDraggingPin = null;
  currentCycler = null;
}

function onDeleteKeyDown(e) {
  if (e.key === "Delete") {
    deleteHeld = true;
    // Remove all selected pins
    document
      .querySelectorAll(".map-pin.selected, .aniota-mark.selected")
      .forEach((pin) => {
        if (pins.has(pin)) {
          removePin(pins.get(pin), e.shiftKey); // Pass shiftKey for line removal
        } else if (pin.parentNode) {
          pin.parentNode.removeChild(pin);
        }
      });
  }
}
function onDeleteKeyUp(e) {
  if (e.key === "Delete") deleteHeld = false;
}

// Remove pin, optionally remove lines if removeLines is true (default: false)
function removePin(pin, removeLines = false) {
  if (!pin) return;
  if (pin.el && pin.el.parentNode) pin.el.parentNode.removeChild(pin.el);
  pins.delete(pin.el);
  // Remove from pinOrder
  const idx = pinOrder.indexOf(pin);
  if (idx !== -1) pinOrder.splice(idx, 1);
  // Remove any lines connected to this pin only if removeLines is true
  if (dotConnectSVG && removeLines) {
    pinLines = pinLines.filter(({ line, pinEl1, pinEl2 }) => {
      if (pinEl1 === pin.el || pinEl2 === pin.el) {
        if (line.parentNode) line.parentNode.removeChild(line);
        return false;
      }
      return true;
    });
  }
}

// Removed duplicate export of enableGridMarks/disableGridMarks (see below for correct version)

// Create a pin element and attach handlers
function createPinElement(id, x, y, color, altText) {
  const pin = document.createElement("div");
  pin.className = "grid-pin";
  pin.style.position = "absolute";
  pin.style.left = x + "px";
  pin.style.top = y + "px";
  pin.style.color = color;
  pin.style.cursor = "pointer";
  pin.title = altText;
  pin.dataset.pinId = id;
  pin.innerHTML = pushPinSVG;

  pin.addEventListener("click", (e) => {
    e.stopPropagation();
    const currentAlt = pins.get(id)?.altText || "";
    const newAlt = prompt("Edit pin description:", currentAlt);
    if (newAlt !== null) {
      pins.get(id).altText = newAlt;
      pin.title = newAlt;
    }
    selectedPinElement = pin;
    if (typeof window.setCycleColorTarget === "function") {
      window.setCycleColorTarget(pin);
    }
  });

  return pin;
}

// Add a pin at snapped grid coordinates
export function addPin(x, y) {
  const id = `pin-${++pinIdCounter}`;
  const color = getRandomColor();
  const altText = `Pin ${id}`;
  const pinElem = createPinElement(id, x, y, color, altText);

  const workspace = document.getElementById("snapgrid-workspace");
  if (!workspace) {
    console.warn("snapgrid-workspace element not found");
    return;
  }
  workspace.appendChild(pinElem);
  pins.set(id, { id, x, y, color, altText, element: pinElem });
}

// (Removed duplicate/orphaned code after correct enableGridMarks/disableGridMarks)

// --- Delete Selected Button Support ---
// Call this function from your Delete Selected button's onclick
export function deleteSelectedPins() {
  document
    .querySelectorAll(".map-pin.selected, .aniota-mark.selected")
    .forEach((pin) => {
      if (pins.has(pin)) {
        removePin(pins.get(pin));
      } else if (pin.parentNode) {
        pin.parentNode.removeChild(pin);
      }
    });
}

// Expose grid snapping function to global scope for shapesLoader.js
window.getNearestSnapPoint = getNearestSnapPoint;
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

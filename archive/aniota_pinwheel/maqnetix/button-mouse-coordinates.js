
const defaultTheme = {
  background: "#111",
  color: "#fff",
  backgroundEnabled: "#4caf50",
  overlayBackground: "rgba(0,0,0,0.7)",
  overlayColor: "#fff",
  fontFamily: "'Noto Sans', sans-serif",
};

let overlayDiv = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let updateOverlayListener = null;
let mouseOverlayActive = false;

import { createToggleButton } from './button-maker.js';

export function createButtonMouseCoordinates(config = {}) {
  const mergedTheme = { ...defaultTheme, ...(config.theme || {}) };
  return createToggleButton({
    id: 'button-mouse-coordinates',
    label: 'Mouse Coordinates Overlay',
    right: '10px',
    onEnable: () => {
      mouseOverlayActive = true;
      showMouseOverlay(mergedTheme);
    },
    onDisable: () => {
      mouseOverlayActive = false;
      hideMouseOverlay();
    },
    defaultActiveState: 'off',
    isSelectable: false,
    isDeletable: false,
    theme: mergedTheme,
    ...config,
  });
}

function showMouseOverlay(theme) {
  if (!overlayDiv) {
    overlayDiv = document.createElement("div");
    overlayDiv.id = "mouse-overlay";
    Object.assign(overlayDiv.style, {
      position: "fixed",
      right: "10px",
      bottom: "115px", // 92px minimap height + 16px margin
      background: theme.overlayBackground,
      color: theme.overlayColor,
      padding: "6px 12px",
      borderRadius: "8px",
      zIndex: 10002,
      cursor: "move",
      userSelect: "none",
      fontFamily: theme.fontFamily,
      minWidth: "100px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
    });
    document.body.appendChild(overlayDiv);

    overlayDiv.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", endDrag);
  }
  if (updateOverlayListener) {
    document.removeEventListener("mousemove", updateOverlayListener);
  }
  updateOverlayListener = (e) => {
    if (!overlayDiv) return;
    overlayDiv.textContent = `X: ${e.clientX}, Y: ${e.clientY}`;
  };
  document.addEventListener("mousemove", updateOverlayListener);

  overlayDiv.style.display = "block";
}

function startDrag(e) {
  isDragging = true;
  dragOffset.x = e.clientX - overlayDiv.offsetLeft;
  dragOffset.y = e.clientY - overlayDiv.offsetTop;
  e.preventDefault();
}

function dragMove(e) {
  if (!isDragging || !overlayDiv) return;
  overlayDiv.style.left = e.clientX - dragOffset.x + "px";
  overlayDiv.style.top = e.clientY - dragOffset.y + "px";
}

function endDrag() {
  isDragging = false;
}

function hideMouseOverlay() {
  if (overlayDiv) {
    overlayDiv.style.display = "none";
  }
  if (updateOverlayListener) {
    document.removeEventListener("mousemove", updateOverlayListener);
    updateOverlayListener = null;
  }
}

export function refreshMinimap(currentTheme = 1, onThemeChange = () => {}) {
  createMinimapButton(currentTheme, onThemeChange);
}

import { THEME_REF, getTheme } from "../js/theme.js"; // Import getTheme for background

let minimapDiv = null;

let minimapCurrentTheme = 1;
let minimapOnThemeChange = () => {};
let minimapButtons = [];

export function createMinimapButton(currentTheme = 1, onThemeChange = () => {}) {
  minimapCurrentTheme = currentTheme;
  minimapOnThemeChange = onThemeChange;
  // Remove and recreate minimapDiv every time to ensure clean state
  let oldDiv = document.getElementById("snapgrid-minimap");
  if (oldDiv) oldDiv.remove();
  minimapDiv = document.createElement("div");
  minimapDiv.id = "snapgrid-minimap";
  document.body.appendChild(minimapDiv);
  minimapDiv.innerHTML = "";
  Object.assign(minimapDiv.style, {
    position: "fixed",
    bottom: "10px",
    left: "10px",
    zIndex: "1000",
    background: "transparent",
    border: "2px solid #444",
    borderRadius: "12px",
    boxShadow: "0 2px 12px #000a",
    display: "flex",
    flexWrap: "wrap",
    width: "164px",
    height: "92px",
    justifyContent: "center",
    alignItems: "center",
  });
  minimapButtons = [];
  // Modular theme set selection
  // themeSet: e.g. 'curved', 'geometric', 'minimal', etc.
  const themeSet = window.minimapThemeSet || 'curved';
  const svgNames = [
    'nw-corner.svg',
    'n-edge.svg',
    'ne-corner.svg',
    'w-edge.svg',
    'c-center.svg',
    'e-edge.svg',
    'sw-corner.svg',
    's-edge.svg',
    'se-corner.svg'
  ];
  let basePath = window.location.pathname.includes('/MAQNETIX/') ? `../assets/svg-themes/${themeSet}-` : `./assets/svg-themes/${themeSet}-`;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const themeNum = row * 3 + col + 1;
      const color = THEME_REF.LAYER_COLORS[(themeNum - 1) % THEME_REF.LAYER_COLORS.length] || "#000";
      const themeName = THEME_REF.AREA_NAMES[themeNum] || String(themeNum);
      const btn = document.createElement("button");
      btn.style.width = "48px";
      btn.style.height = "24px";
      btn.style.margin = "2px";
      btn.style.borderRadius = "6px";
      // Make color 40% transparent (alpha = 0.4)
      // If color is hex, convert to rgba
      let bgColor = color;
      if (color.startsWith('#')) {
        // Expand short hex if needed
        let hex = color.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        const r = parseInt(hex.substring(0,2),16);
        const g = parseInt(hex.substring(2,4),16);
        const b = parseInt(hex.substring(4,6),16);
        bgColor = `rgba(${r},${g},${b},0.7)`;
      }
      btn.style.background = `url('${basePath}${svgNames[themeNum-1]}') center/cover no-repeat, ${bgColor}`;
      btn.style.backgroundBlendMode = 'multiply';
      btn.style.position = "relative";
      btn.title = themeName;
      btn.setAttribute("aria-label", themeName);
      btn.tabIndex = 0;
      btn.textContent = "";
      btn.style.border = (themeNum === Number(currentTheme)) ? "2px solid #111" : "1px solid #444";
      // Add white label (ALT text) as a centered span
      const label = document.createElement('span');
      label.textContent = themeName;
      label.style.position = 'absolute';
      label.style.left = '50%';
      label.style.top = '50%';
      label.style.transform = 'translate(-50%, -50%)';
      label.style.color = '#fff';
      label.style.fontWeight = 'bold';
      label.style.fontSize = '0.85em';
      label.style.textShadow = '0 1px 4px #000, 0 0 2px #000';
      label.style.pointerEvents = 'none';
      label.style.zIndex = 2;
      btn.appendChild(label);
      btn.onclick = () => {
        // Remove selection from all buttons
        minimapButtons.forEach(b => {
          b.style.border = "1px solid #444";
        });
        btn.style.border = "2px solid #fff";
        if (window.selectionManager && window._aniotaAllShapes) {
          const selectedEls = window.selectionManager.getSelected();
          const selectedIds = selectedEls.map((el) => el.id);
          let changed = false;
          window._aniotaAllShapes.forEach((shape) => {
            if (selectedIds.includes(shape.id)) {
              if (Number(shape.area) !== Number(themeNum)) {
                const el = selectedEls.find((e) => e.id === shape.id);
                if (el) {
                  shape.x = parseInt(el.style.left, 10);
                  shape.y = parseInt(el.style.top, 10);
                  shape.width = el.style.width;
                  shape.height = el.style.height;
                }
                shape.area = themeNum;
                changed = true;
              }
            }
          });
          if (changed) {
            console.log(`[minimap] Moved selected shapes to zone ${themeNum}:`, selectedIds);
          }
          if (window.selectionManager) window.selectionManager.clear();
        }
        setTimeout(() => {
          // Update global currentTheme and re-render ONLY grid lines (no shape filtering)
          if (typeof window !== 'undefined') {
            window.currentTheme = themeNum;
            // Only update grid visuals without triggering area-based shape filtering
            if (typeof window.renderForTheme === 'function') {
              window.renderForTheme(themeNum);
            }
          }
          // Don't call onThemeChange which might trigger reloadUICAForArea
          // Just update the visual theme, preserve all shapes regardless of area
          console.log(`[minimap] Theme switched to: ${themeNum} (${themeName}) - all shapes preserved`);
        }, 0);
      };
      btn.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      };
      minimapDiv.appendChild(btn);
      minimapButtons.push(btn);
    }
  }
}

export function redmimmap() {
  if (!minimapDiv) return;
  const theme = getTheme(minimapCurrentTheme);
  minimapDiv.style.background = theme.background;
}

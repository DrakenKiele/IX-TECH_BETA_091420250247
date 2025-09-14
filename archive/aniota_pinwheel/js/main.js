




import {
  renderGrid,
  getAreaOffsets,
  attachDragResizeHandlers
} from "./grid.js";

import { getTheme, THEME_REF } from "./theme.js";



import {
  initializeMultiSelect,
  selectionManager
} from "./logic.js";

import {
  saveShapesToLocalStorage,
  loadShapesFromLocalStorage
} from "./local_UICA_storage.js";

import { reloadUICAForArea, loadShapesFromJSON, renderAllShapes } from "./shapesLoader.js";


import { renderForTheme } from "./theme.js";
window.renderForTheme = renderForTheme;
import { moveSquareToArea, findPossibleDuplicateShapes, rectsOverlap, autoFitBlueprintToWorkspace } from "./shapes.js";


import { createAllButtons } from "./button-manager.js";

window.autoFitBlueprint = autoFitBlueprintToWorkspace;


let currentTheme = 1;
window.currentTheme = currentTheme;
let selectedSquaresRef = { value: [] }; // Only for legacy compatibility


window.attachDragResizeHandlers = attachDragResizeHandlers;
window.initializeMultiSelect = initializeMultiSelect;
window.reloadUICAForArea = reloadUICAForArea;
window.loadShapesFromJSON = loadShapesFromJSON;
window.selectedSquaresRef = selectedSquaresRef;
window.selectionManager = selectionManager;




// Initialization sequence: everything that must happen before user interaction

attachDragResizeHandlers();
initializeMultiSelect(selectedSquaresRef);
renderForTheme(currentTheme);

// ...removed dynamic pattern background...


// Initialize all UI buttons (including minimap) in a single call
createAllButtons(currentTheme, (themeNum) => {
  currentTheme = themeNum;
  window.currentTheme = currentTheme;
  renderForTheme(currentTheme);
});


// After all buttons are placed, use the OS-aware loader to load shapes if available
setTimeout(() => {
  if (typeof window.loadShapesFromLocalStorage === 'function') {
    window.loadShapesFromLocalStorage();
    // Render all shapes from all areas (no area filtering)
    setTimeout(() => {
      if (window.renderAllShapes) window.renderAllShapes(window._aniotaAllShapes);
    }, 100);
    console.log('[main.js] Shapes loaded - all areas preserved');
  }
}, 300);

// Listen for window resize events
window.addEventListener("resize", () => {
  renderForTheme(currentTheme);
});
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

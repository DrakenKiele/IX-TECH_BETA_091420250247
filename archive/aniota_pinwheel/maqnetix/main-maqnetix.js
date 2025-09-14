
import {
  renderGrid,
  getAreaOffsets,
  attachDragResizeHandlers
} from "./grid.js";

import { getTheme, THEME_REF } from "../js/theme.js";
import { initializeMultiSelect, selectionManager } from "../js/logic.js";
import { saveShapesToLocalStorage, loadShapesFromLocalStorage } from "./local_UICA_storage.js";
import { reloadUICAForArea, loadShapesFromJSON, renderAllShapes } from "./shapesLoader.js";
import { renderForTheme } from "../js/theme.js";
window.renderForTheme = renderForTheme;
import { moveSquareToArea, findPossibleDuplicateShapes, rectsOverlap, autoFitBlueprintToWorkspace } from "./shapes.js";
import { createAllButtons } from "./button-manager.js";
import { quickZeroLossTest, runZeroLossTestSuite } from "./zeroLossTest.js";
import { bootstrapMAQNETIXInterface, quickBootstrap } from "./bootstrapMAQNETIX.js";
import { startInfiniteEvolution, infiniteEvolution, aniotaEvolve } from "../js/infiniteEvolution.js";
window.autoFitBlueprint = autoFitBlueprintToWorkspace;

window.quickZeroLossTest = quickZeroLossTest;
window.runZeroLossTestSuite = runZeroLossTestSuite;

window.bootstrapMAQNETIXInterface = bootstrapMAQNETIXInterface;
window.quickBootstrap = quickBootstrap;

window.startInfiniteEvolution = startInfiniteEvolution;
window.infiniteEvolution = infiniteEvolution;
window.aniotaEvolve = aniotaEvolve;

let currentTheme = 1;
window.currentTheme = currentTheme;
let selectedSquaresRef = { value: [] };
window.attachDragResizeHandlers = attachDragResizeHandlers;
window.initializeMultiSelect = initializeMultiSelect;
window.reloadUICAForArea = reloadUICAForArea;
window.loadShapesFromJSON = loadShapesFromJSON;
window.selectedSquaresRef = selectedSquaresRef;
window.selectionManager = selectionManager;

attachDragResizeHandlers();
initializeMultiSelect(selectedSquaresRef);
renderForTheme(currentTheme);
createAllButtons(currentTheme, (themeNum) => {
  currentTheme = themeNum;
  window.currentTheme = currentTheme;
  renderForTheme(currentTheme);
});
setTimeout(() => {
  if (typeof window.loadShapesFromLocalStorage === 'function') {
    window.loadShapesFromLocalStorage();
    // Render all shapes from all areas (no area filtering)
    setTimeout(() => {
      if (window.renderAllShapes) window.renderAllShapes(window._aniotaAllShapes);
    }, 100);
    console.log('[main-maqnetix.js] Shapes loaded - all areas preserved');
  }
}, 300);
window.addEventListener("resize", () => {
  renderForTheme(currentTheme);
});
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

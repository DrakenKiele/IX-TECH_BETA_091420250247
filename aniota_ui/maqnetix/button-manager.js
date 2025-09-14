import { createSaveTargetSelectionButton, getCurrentSaveTarget } from './button-save-load-target.js';
import { createSaveButton, createLoadButton } from './button-save-load-action.js';
import { createDeleteSelectedButton } from './button-delete-selected.js';
import { createButtonMouseCoordinates } from './button-mouse-coordinates.js';
import { createToggleZoneLockButton } from './button-toggle-zone-lock.js';
import { createToggleDotConnectButton } from './button-toggle-dot-connect.js';
import { createAutoFitBlueprintButton } from './button-auto-fit-blueprint.js';
import { createToggleGridMarksButton } from './button-toggle-grid-marks.js';
import { createToggleColorCyclerButton } from './button-toggle-color-cycler.js';
import { createToggleSnapToGridButton } from './button-toggle-snap-to-grid.js';
import { createMinimapButton } from './button-minimap.js';
import { createMetaCreateButton } from './button-create-new-button.js';
import { createZeroLossConverterButton } from './button-zero-loss-converter.js';
import { createRecursiveBootstrapButton } from './button-recursive-bootstrap.js';
import { createInfiniteEvolutionButton } from './button-infinite-evolution.js';
import { createPackerButton } from './button-packer.js';
import { createUnpackerButton } from './button-unpacker.js';

export function createAllButtons(currentTheme, onThemeChange) {
  // Button layout constants
  const BUTTON_HEIGHT = 20;
  const BUTTON_MARGIN = 5;
  const BUTTON_SPACING = BUTTON_HEIGHT + BUTTON_MARGIN;
  let top = 10;

  // Helper to place each button and increment top
  function placeButton(createFn, config = {}) {
    createFn({
      ...config,
      initialTop: top
    });
    top += BUTTON_SPACING;
  }

  // --- File/Project Actions ---
  placeButton(createSaveTargetSelectionButton);
  placeButton(createSaveButton);
  placeButton(createLoadButton);

  // --- Grid/Snap/Alignment ---
  placeButton(createToggleSnapToGridButton);
  placeButton(createToggleGridMarksButton);
  placeButton(createToggleDotConnectButton);

  // --- Visual/Theme ---
  placeButton(createToggleColorCyclerButton);
  placeButton(createAutoFitBlueprintButton);

  // --- Editing/Selection ---
  placeButton(createMetaCreateButton);
  placeButton(createToggleZoneLockButton);
  placeButton(createDeleteSelectedButton);

  // --- Zero-Loss Conversion System ---
  placeButton(createZeroLossConverterButton);
  
  // --- Packer/Unpacker Tools ---
  placeButton(createPackerButton);
  placeButton(createUnpackerButton);

  // --- Recursive Bootstrap (Self-Redesign) ---
  placeButton(createRecursiveBootstrapButton);

  // --- Infinite Evolution (Never-Ending Improvement) ---
  placeButton(createInfiniteEvolutionButton);

  // --- Navigation/Minimap ---
  placeButton(createButtonMouseCoordinates);
  createMinimapButton({ currentTheme, onThemeChange, initialTop: top });
}

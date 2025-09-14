import { createToggleButton } from './button-maker.js';
import { customButtons } from './button-maker.js';

import { selectedCustomButtons } from './button-maker.js';

export function createDeleteSelectedButton(config = {}) {
  function deleteSelectedObjects() {
    for (const obj of Array.from(selectedCustomButtons)) {
      if (obj.isSelectable && obj.isDeletable) {
        if (obj.domElement && typeof obj.domElement.remove === 'function') {
          obj.domElement.remove();
        }
        selectedCustomButtons.delete(obj);
        // Remove from customButtons if present
        const idx = customButtons.indexOf(obj);
        if (idx !== -1) customButtons.splice(idx, 1);
      }
    }
  }

  return createToggleButton({
    id: 'delete-selected-btn',
    label: 'Delete Selected',
    right: '10px',
    onEnable: deleteSelectedObjects,
    onDisable: () => {},
    defaultActiveState: 'on',
    isSelectable: false,
    isDeletable: false,
    ...config,
  });
}

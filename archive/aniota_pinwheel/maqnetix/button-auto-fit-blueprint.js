import { createToggleButton } from './button-maker.js';

export function createAutoFitBlueprintButton(config = {}) {
  return createToggleButton({
    id: 'auto-fit-blueprint',
    label: 'Enable Auto-Fit',
    right: '10px',
    onEnable: () => {
      // Only enable if there are shapes (not pins)
      const shapes = (window._aniotaAllShapes || []).filter(s => !s.type || s.type !== 'dot-connect-line');
      if (!shapes.length) {
        console.log('No shapes loaded to auto-fit.');
        const btn = document.getElementById('auto-fit-blueprint');
        if (btn) btn.disabled = true;
        return;
      }
      if (typeof window.autoFitBlueprint === 'function') {
        window.autoFitBlueprint();
        const btn = document.getElementById('auto-fit-blueprint');
        if (btn) btn.textContent = 'Disable Auto-Fit';
      }
    },
    onDisable: () => {
      const btn = document.getElementById('auto-fit-blueprint');
      if (btn) btn.textContent = 'Enable Auto-Fit';
    },
    defaultActiveState: 'off',
    isSelectable: false,
    isDeletable: false,
    ...config,
  });
}

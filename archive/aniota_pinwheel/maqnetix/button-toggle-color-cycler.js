
import { createToggleButton, customButtons } from './button-maker.js';
import { cycleColor } from './color-cycler.js';

import { selectedCustomButtons } from './button-maker.js';

export function createToggleColorCyclerButton(config = {}) {
  // Restore last used color index from localStorage if available
  let lastColorIndex = 0;
  try {
    const saved = localStorage.getItem('maqnetix_color_cycler_index');
    if (saved) lastColorIndex = parseInt(saved);
  } catch (e) {}
  return createToggleButton({
    id: 'toggle-color-cycler',
    label: 'Color Selected',
    right: '10px',
    theme: config.theme || {},
    alt: 'Scroll to cycle color of selection',
    'aria-label': 'Scroll to cycle color of selection',
    onEnable: () => {
      // Get selected system buttons (not user-created)
      const selectedSystemButtons = Array.from(selectedCustomButtons).filter(btn => !btn.isDeletable && btn.domElement);
      if (selectedSystemButtons.length > 0) {
        selectedSystemButtons.forEach(btn => {
          const idx = cycleColor(btn.domElement, lastColorIndex);
          localStorage.setItem('maqnetix_color_cycler_index', idx);
        });
      } else {
        const idx = cycleColor(undefined, lastColorIndex);
        localStorage.setItem('maqnetix_color_cycler_index', idx);
      }
    },
    onDisable: () => {},
    styleOverrides: {
      left: 'unset',
    },
    ...config,
  });
}

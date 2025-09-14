import { createToggleButton } from './button-maker.js';

export function createToggleSnapToGridButton(config = {}) {
  // Restore state from localStorage if available
  if (typeof window.snapToGridEnabled === 'undefined') {
    const saved = localStorage.getItem('maqnetix_snap_to_grid_enabled');
    window.snapToGridEnabled = saved === null ? false : saved === 'true';
  }
  return createToggleButton({
    id: 'toggle-snap-to-grid',
    label: window.snapToGridEnabled ? 'Disable Snap To Grid' : 'Enable Snap To Grid',
    right: '10px',
    onEnable: () => {
      window.snapToGridEnabled = true;
      localStorage.setItem('maqnetix_snap_to_grid_enabled', 'true');
      const btn = document.getElementById('toggle-snap-to-grid');
      if (btn) btn.textContent = 'Disable Snap To Grid';
    },
    onDisable: () => {
      window.snapToGridEnabled = false;
      localStorage.setItem('maqnetix_snap_to_grid_enabled', 'false');
      const btn = document.getElementById('toggle-snap-to-grid');
      if (btn) btn.textContent = 'Enable Snap To Grid';
    },
    styleOverrides: {
      left: 'unset',
      background: window.snapToGridEnabled ? '#4caf50' : '#111',
      color: '#fff',
    },
    ...config,
  });
}

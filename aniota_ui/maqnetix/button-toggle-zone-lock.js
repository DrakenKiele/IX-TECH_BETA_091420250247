import { createToggleButton } from './button-maker.js';

export function createToggleZoneLockButton(config = {}) {
  const zone = window.currentTheme;
  // Restore zone locks from localStorage if available
  window.snapgridZoneLocks ??= {};
  try {
    const saved = localStorage.getItem('maqnetix_zone_locks');
    if (saved) {
      window.snapgridZoneLocks = JSON.parse(saved);
    }
  } catch (e) {}
  return createToggleButton({
    id: 'toggle-zone-lock',
    label: window.snapgridZoneLocks[zone] ? 'Disable Zone Lock' : 'Enable Zone Lock',
    right: '10px',
    onEnable: () => {
      window.snapgridZoneLocks[zone] = true;
      localStorage.setItem('maqnetix_zone_locks', JSON.stringify(window.snapgridZoneLocks));
      updateZoneLockUI(zone, true);
      const btn = document.getElementById('toggle-zone-lock');
      if (btn) btn.textContent = 'Disable Zone Lock';
    },
    onDisable: () => {
      window.snapgridZoneLocks[zone] = false;
      localStorage.setItem('maqnetix_zone_locks', JSON.stringify(window.snapgridZoneLocks));
      updateZoneLockUI(zone, false);
      const btn = document.getElementById('toggle-zone-lock');
      if (btn) btn.textContent = 'Enable Zone Lock';
    },
    styleOverrides: {
      left: 'unset',
      background: window.snapgridZoneLocks[zone] ? '#4caf50' : '#111',
      color: '#fff',
    },
    ...config,
  });
}

function updateZoneLockUI(zone, isLocked) {
  document.querySelectorAll('.snapgrid-square').forEach((sq) => {
    if (parseInt(sq.dataset.theme) === zone) {
      const lockLabel = sq.querySelector('.shape-lock-toggle-label');
      const lockToggle = lockLabel?.querySelector('.shape-lock-toggle');
      if (isLocked) {
        if (lockToggle) {
          lockToggle.disabled = false;
          lockToggle.style.cursor = 'pointer';
          lockLabel.style.opacity = '1';
        }
      } else {
        sq.dataset.locked = 'false';
        sq.classList.remove('locked');
        if (lockToggle) {
          lockToggle.checked = false;
          lockToggle.disabled = true;
          lockToggle.style.cursor = 'not-allowed';
          lockLabel.style.background = '#fff';
          lockLabel.style.opacity = '0.6';
        }
      }
    }
  });
}

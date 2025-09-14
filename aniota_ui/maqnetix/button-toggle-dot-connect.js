import { createToggleButton } from './button-maker.js';

export function createToggleDotConnectButton(config = {}) {
  // Restore state from localStorage if available
  if (typeof window.dotConnectEnabled === 'undefined') {
    const saved = localStorage.getItem('maqnetix_dot_connect_enabled');
    window.dotConnectEnabled = saved === null ? false : saved === 'true';
  }
  return createToggleButton({
    id: 'toggle-dot-connect',
    label: window.dotConnectEnabled ? 'Disable Dot Connect' : 'Enable Dot Connect',
    right: '10px',
    onEnable: () => {
      window.dotConnectEnabled = true;
      localStorage.setItem('maqnetix_dot_connect_enabled', 'true');
      const btn = document.getElementById('toggle-dot-connect');
      if (btn) btn.textContent = 'Disable Dot Connect';
    },
    onDisable: () => {
      window.dotConnectEnabled = false;
      localStorage.setItem('maqnetix_dot_connect_enabled', 'false');
      const btn = document.getElementById('toggle-dot-connect');
      if (btn) btn.textContent = 'Enable Dot Connect';
    },
    styleOverrides: {
      left: 'unset',
      background: window.dotConnectEnabled ? '#4caf50' : '#111',
      color: '#fff',
    },
    ...config,
  });
}

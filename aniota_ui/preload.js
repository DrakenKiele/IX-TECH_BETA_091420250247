const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('AniotaAPI', {
  // User activity tracking
  trackMouseActivity: (data) => ipcRenderer.invoke('track-mouse', data),
  trackKeyboardActivity: (data) => ipcRenderer.invoke('track-keyboard', data),
  trackApplicationFocus: (data) => ipcRenderer.invoke('track-app-focus', data),
  trackWebActivity: (data) => ipcRenderer.invoke('track-web-activity', data),
  
  // Server communication
  sendToBackend: (endpoint, data) => ipcRenderer.invoke('backend-request', { endpoint, data }),
  subscribeToBackend: (callback) => ipcRenderer.on('backend-update', callback),
  
  // System integration
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getActiveWindow: () => ipcRenderer.invoke('get-active-window'),
  
  // Aniota state management
  updateAniotaState: (state) => ipcRenderer.invoke('update-aniota-state', state),
  getAniotaState: () => ipcRenderer.invoke('get-aniota-state'),
  
  // Transparency control
  setWindowTransparency: (level) => ipcRenderer.invoke('set-transparency', level),
  setClickThrough: (enabled) => ipcRenderer.invoke('set-click-through', enabled)
});

window.isElectron = true;

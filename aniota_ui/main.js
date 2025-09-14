const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false, // Hide initially for headless-like behavior
  });

  win.loadFile(__dirname + '/../index.html');

  // Allow input passthrough
  win.once('ready-to-show', () => {
    win.setIgnoreMouseEvents(true, { forward: true });
    win.show();
  });

  // Optional: Hide window from taskbar
  win.setSkipTaskbar(true);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

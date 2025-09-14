const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require("electron");
const path = require("path");
const AniotaBiome = require('./biome/AniotaBiome');
const DKSoftworksThemedSplash = require('./biome/DKSoftworksThemedSplash');

class AniotaDesktopApp {
  constructor() {
    this.biome = null;
    this.splash = null;
    this.backendUrl = 'http://192.168.254.200:52330';
    
    app.on("ready", this.initialize.bind(this));
    app.on("window-all-closed", this.onAllClosed.bind(this));
    app.on("activate", this.onActivate.bind(this));
  }

  async initialize() {
    console.log('🚀 Initializing Aniota Desktop with DK Softworks LLC theming...');
    
    // Show DK Softworks themed splash first
    this.splash = new DKSoftworksThemedSplash();
    this.splash.createSplashWindow();
    
    this.setupIPC();
    this.setupGlobalShortcuts();
    this.startBackendCommunication();
    
    console.log('✨ DK Softworks LLC themed interface loaded!');
  }
  
  async startAniotaBiome() {
    console.log('🌊 Starting Aniota\'s biome after splash...');
    
    // Close splash
    if (this.splash) {
      this.splash.close();
      this.splash = null;
    }
    
    // Create Aniota's living environment
    this.biome = new AniotaBiome();
    await this.biome.createBiome();
    
    console.log('🐠 Aniota is now living on your desktop!');
  }

  setupIPC() {
    // Splash completion handler
    ipcMain.on('splash-complete', () => {
      console.log('🎯 Splash completed - Starting biome...');
      this.startAniotaBiome();
    });
    
    // Character interaction events
    ipcMain.on('character-clicked', () => {
      console.log('🎯 Aniota was clicked!');
      if (this.biome) {
        this.biome.showChatBubble('Hi! I\'m Aniota, your learning companion! 🌟');
      }
    });
    
    // User activity tracking for biome awareness
    ipcMain.handle('track-user-activity', async (event, data) => {
      await this.sendToBackend('/api/track/activity', data);
      return true;
    });

    // Backend communication for learning data
    ipcMain.handle('backend-request', async (event, { endpoint, data }) => {
      return await this.sendToBackend(endpoint, data);
    });

    // System info for biome positioning
    ipcMain.handle('get-system-info', async () => {
      return {
        platform: process.platform,
        arch: process.arch,
        version: process.version,
        screenSize: screen.getPrimaryDisplay().workAreaSize,
        displays: screen.getAllDisplays()
      };
    });
  }
  
  setupGlobalShortcuts() {
    // Global shortcuts for biome control
    globalShortcut.register('CommandOrControl+Shift+A', () => {
      if (this.biome) {
        this.biome.showChatBubble('Hello! What would you like to learn today? 📚');
      }
    });
    
    // Emergency hide/show
    globalShortcut.register('CommandOrControl+Shift+H', () => {
      if (this.biome && this.biome.characterWindow) {
        const isVisible = this.biome.characterWindow.isVisible();
        if (isVisible) {
          this.biome.characterWindow.hide();
        } else {
          this.biome.characterWindow.show();
        }
      }
    });
  }

  onAllClosed() {
    // Clean up biome
    if (this.biome) {
      this.biome.destroy();
    }
    
    if (process.platform !== "darwin") {
      app.quit();
    }
  }

  onActivate() {
    if (!this.biome && !this.splash) {
      this.initialize();
    }
  }
  
  async startBackendCommunication() {
    console.log('🔗 Connecting to backend for learning analytics...');
    // Implementation for backend communication
  }
  
  async sendToBackend(endpoint, data) {
    try {
      // Backend communication logic
      console.log(`📡 Sending to backend: ${endpoint}`, data);
      return { success: true, data: null };
    } catch (error) {
      console.error('❌ Backend communication failed:', error);
      return { success: false, error: error.message };
    }
  }
}

new AniotaDesktopApp();

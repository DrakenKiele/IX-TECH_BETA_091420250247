const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require("electron");
const path = require("path");
const AniotaBiome = require('./aniota_pinwheel/biome/AniotaBiome_modular');
const DKSoftworksThemedSplash = require('./aniota_pinwheel/biome/DKSoftworksThemedSplash');

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
    
    // TEMPORARILY SKIP SPLASH FOR TESTING
    console.log('⚡ Skipping splash for direct biome testing...');
    this.setupIPC();
    this.setupGlobalShortcuts();
    this.startBackendCommunication();
    
    // Start biome directly
    await this.startAniotaBiome();
    
    console.log('✨ DK Softworks LLC themed interface loaded!');
  }
  
  async startAniotaBiome() {
    console.log('🌊 Starting Aniota\'s biome after splash...');
    
    // Close splash
    if (this.splash) {
      console.log('🗂️ Closing splash window...');
      this.splash.close();
      this.splash = null;
    }
    
    // Create Aniota's living environment
    console.log('🏗️ Creating new AniotaBiome instance...');
    this.biome = new AniotaBiome();
    console.log('🎮 Calling createBiome()...');
    await this.biome.createBiome();
    
    console.log('🐠 Aniota is now living on your desktop!');
  }

  setupIPC() {
    console.log('🔧 Setting up IPC handlers...');
    // Splash completion handler
    ipcMain.on('splash-complete', () => {
      console.log('🎯 Splash completed - Starting biome...');
      this.startAniotaBiome();
    });
    
    // Character interaction events - Enhanced for Training Academy
    ipcMain.on('character-clicked', async () => {
      console.log('🎯 Aniota was clicked! Processing training click...');
      if (this.biome && this.biome.petBehavior) {
        await this.biome.petBehavior.handleClick('single');
        // Give immediate token reward for responding to click
        if (this.biome.tokenInterface) {
          this.biome.tokenInterface.processToken({ type: 'positive', behavior: 'sit' });
        }
      }
    });
    
    // Training Academy specific events
    ipcMain.on('start-training-academy', async () => {
      console.log('🎓 Starting Aniota Training Academy...');
      if (this.biome) {
        const success = this.biome.enableTeacherMode();
        console.log(success ? '✅ Teacher mode activated' : '📚 Building trust for full features');
      }
    });
    
    // Authentic Token Training events
    ipcMain.on('start-token-training', async () => {
      console.log('🪙 Starting authentic token training...');
      if (this.biome && this.biome.tokenInterface) {
        this.biome.tokenInterface.enableInterface();
      }
    });
    
    ipcMain.on('give-token', async (event, tokenData) => {
      console.log('🪙 Token given:', tokenData.type);
      if (this.biome && this.biome.tokenInterface) {
        await this.biome.tokenInterface.processToken(tokenData);
      }
    });
    
    // Aniota Pointer Extension events
    ipcMain.on('pointer-position-update', async (event, { x, y }) => {
      if (this.biome && this.biome.pointerExtension) {
        this.biome.pointerExtension.updatePointerPosition(x, y);
      }
    });
    
    ipcMain.on('pointer-acknowledged', async () => {
      console.log('👆 User acknowledged Aniota\'s pointer communication');
      if (this.biome && this.biome.pointerExtension) {
        this.biome.pointerExtension.recordCommunicationSuccess();
      }
    });
    
    // Start pointer communication system
    ipcMain.on('start-pointer-system', async () => {
      console.log('🖱️ Starting Aniota pointer communication system...');
      if (this.biome) {
        const success = this.biome.enableTeacherMode();
        console.log(success ? '🎯 Pointer system active' : '🔒 Need more trust for pointer');
      }
    });
    
    // Desktop double-click for "come" command
    ipcMain.on('desktop-double-click', async (event, { x, y }) => {
      console.log(`🎯 Desktop double-click at (${x}, ${y}) - Teaching "come" command`);
      if (this.biome && this.biome.petBehavior) {
        await this.biome.petBehavior.executeCommand('come', { targetX: x, targetY: y });
        // Give immediate token reward for successful command
        if (this.biome.tokenInterface) {
          this.biome.tokenInterface.processToken({ type: 'positive', behavior: 'come' });
        }
      }
    });
    
    // Mouse drag for "jump" command
    ipcMain.on('mouse-drag-command', async (event, { startX, startY, endX, endY }) => {
      console.log(`🎯 Mouse drag from (${startX}, ${startY}) to (${endX}, ${endY}) - Teaching "jump" command`);
      if (this.biome && this.biome.petBehavior) {
        const direction = Math.atan2(endY - startY, endX - startX);
        const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        await this.biome.petBehavior.executeCommand('jump', { direction, distance });
        // Give immediate token reward for successful command
        if (this.biome.tokenInterface) {
          this.biome.tokenInterface.processToken({ type: 'positive', behavior: 'jump' });
        }
      }
    });
    
    // Get learning progress and trust status
    ipcMain.handle('get-learning-status', async () => {
      if (this.biome) {
        return this.biome.getLearningStatus();
      }
      return { trustLevel: 0, behaviorProgress: {}, tokenCount: 0, pointerAvailable: false };
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
    console.log('🚪 All windows closed, cleaning up...');
    
    // Clean up biome safely
    try {
      if (this.biome && typeof this.biome.destroy === 'function') {
        this.biome.destroy();
        this.biome = null;
      }
    } catch (error) {
      console.log('⚠️ Error during biome cleanup:', error.message);
    }
    
    // Clean up splash safely
    try {
      if (this.splash && typeof this.splash.close === 'function') {
        this.splash.close();
        this.splash = null;
      }
    } catch (error) {
      console.log('⚠️ Error during splash cleanup:', error.message);
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

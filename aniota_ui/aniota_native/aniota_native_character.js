const { BrowserWindow, app, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

class AniotaNativeCharacter {
    constructor() {
        this.characterData = null;
        this.window = null;
        this.currentState = 'idle';
        this.position = { x: 100, y: 100 };
        this.loadCharacterData();
    }

    loadCharacterData() {
        try {
            const dataPath = path.join(__dirname, 'aniota_character_data.json');
            const data = fs.readFileSync(dataPath, 'utf8');
            this.characterData = JSON.parse(data);
            this.position = this.characterData.character.default_position;
        } catch (error) {
            console.error('Failed to load character data:', error);
        }
    }

    createCharacterWindow() {
        const { width, height } = this.characterData.character.default_size;
        
        this.window = new BrowserWindow({
            width: width,
            height: height,
            x: this.position.x,
            y: this.position.y,
            frame: false,
            transparent: true,
            alwaysOnTop: this.characterData.behaviors.always_on_top,
            skipTaskbar: true,
            resizable: false,
            movable: this.characterData.behaviors.draggable,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        // Load the character renderer
        this.window.loadFile(path.join(__dirname, 'character_renderer.html'));

        // Handle window events
        this.setupWindowEvents();
        
        // Send character data to renderer
        this.window.webContents.once('dom-ready', () => {
            this.window.webContents.send('character-data', this.characterData);
            this.setState(this.currentState);
        });

        return this.window;
    }

    setupWindowEvents() {
        // Track position changes
        this.window.on('moved', () => {
            const [x, y] = this.window.getPosition();
            this.position = { x, y };
        });

        // Handle interactions from renderer
        ipcMain.on('character-clicked', () => {
            this.handleClick();
        });

        ipcMain.on('character-double-clicked', () => {
            this.handleDoubleClick();
        });

        ipcMain.on('character-right-clicked', () => {
            this.showContextMenu();
        });

        // Keep window on screen
        if (this.characterData.behaviors.stay_on_screen) {
            this.window.on('moved', () => {
                this.keepOnScreen();
            });
        }
    }

    setState(stateName) {
        this.currentState = stateName;
        const stateData = this.characterData.visual_states[stateName];
        
        if (this.window && stateData) {
            this.window.webContents.send('set-visual-state', stateData);
        }
    }

    handleClick() {
        const clickConfig = this.characterData.interactions.click;
        
        if (clickConfig.action === 'toggle_state') {
            this.setState(clickConfig.target_state);
            
            // Return to idle after duration
            setTimeout(() => {
                this.setState('idle');
            }, clickConfig.duration);
        }
    }

    handleDoubleClick() {
        const doubleClickConfig = this.characterData.interactions.double_click;
        
        if (doubleClickConfig.action === 'open_interface') {
            this.openLearningInterface();
        }
    }

    showContextMenu() {
        const menuConfig = this.characterData.interactions.right_click.menu;
        const template = menuConfig.map(item => ({
            label: item.label,
            click: () => this.handleMenuAction(item.action)
        }));

        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: this.window });
    }

    handleMenuAction(action) {
        switch (action) {
            case 'open_settings':
                this.openSettings();
                break;
            case 'show_about':
                this.showAbout();
                break;
            case 'minimize':
                this.window.hide();
                break;
            case 'quit':
                app.quit();
                break;
        }
    }

    openLearningInterface() {
        // Create the main learning interface window
        const learningWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        learningWindow.loadFile(path.join(__dirname, '../aniota_epicenter/aniota_epicenter_dev.html'));
    }

    openSettings() {
        // Placeholder for settings window
        console.log('Opening settings...');
    }

    showAbout() {
        // Placeholder for about dialog
        console.log('Showing about...');
    }

    keepOnScreen() {
        const { screen } = require('electron');
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
        const [x, y] = this.window.getPosition();
        const [windowWidth, windowHeight] = this.window.getSize();

        let newX = x;
        let newY = y;

        // Keep within screen bounds
        if (x < 0) newX = 0;
        if (y < 0) newY = 0;
        if (x + windowWidth > screenWidth) newX = screenWidth - windowWidth;
        if (y + windowHeight > screenHeight) newY = screenHeight - windowHeight;

        if (newX !== x || newY !== y) {
            this.window.setPosition(newX, newY);
        }
    }

    show() {
        if (this.window) {
            this.window.show();
        }
    }

    hide() {
        if (this.window) {
            this.window.hide();
        }
    }

    destroy() {
        if (this.window) {
            this.window.close();
            this.window = null;
        }
    }
}

module.exports = AniotaNativeCharacter;

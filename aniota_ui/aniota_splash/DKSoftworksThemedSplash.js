const { BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

class DKSoftworksThemedSplash {
    constructor() {
        this.theme = null;
        this.content = null;
        this.splashWindow = null;
        
        this.loadThemeData();
        this.loadContentData();
    }
    
    loadThemeData() {
        try {
            const themePath = path.join(__dirname, 'dk_softworks_theme.json');
            this.theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
            console.log('🎨 DK Softworks LLC theme loaded');
        } catch (error) {
            console.error('❌ Failed to load DK Softworks theme:', error);
            this.theme = this.getDefaultTheme();
        }
    }
    
    loadContentData() {
        try {
            const contentPath = path.join(__dirname, 'splash_content.json');
            this.content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
            console.log('📄 Splash content loaded');
        } catch (error) {
            console.error('❌ Failed to load splash content:', error);
            this.content = this.getDefaultContent();
        }
    }
    
    getDefaultTheme() {
        return {
            colors: {
                jewel_tones: { ruby_red: "#D73527", emerald_green: "#50C878", sapphire_blue: "#0F52BA" },
                grays: { charcoal: "#2C2C2C", slate: "#484848", white_smoke: "#F5F5F5" },
                text: { primary_light: "#FFFFFF", primary_dark: "#000000" }
            }
        };
    }
    
    getDefaultContent() {
        return {
            splash_content: {
                title: "Welcome to Aniota",
                mission_statement: { greeting: "Your learning companion awaits!" },
                call_to_action: { button_text: "BEGIN" }
            }
        };
    }
    
    createSplashWindow() {
        console.log('🌟 Creating DK Softworks LLC themed splash...');
        
        this.splashWindow = new BrowserWindow({
            width: 1000,
            height: 700,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            center: true,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });
        
        // Generate themed HTML
        const themedHTML = this.generateThemedHTML();
        
        // Load the themed content
        this.splashWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(themedHTML));
        
        return this.splashWindow;
    }
    
    generateThemedHTML() {
        const { colors, typography, ui_elements, effects } = this.theme;
        const { splash_content, background } = this.content;
        
        return `...existing code...`;
    }
    
    close() {
        if (this.splashWindow && !this.splashWindow.isDestroyed()) {
            this.splashWindow.close();
        }
    }
}

module.exports = DKSoftworksThemedSplash;

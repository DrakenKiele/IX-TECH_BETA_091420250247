
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
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>DK Softworks LLC - Aniota</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Rounded:wght@300;400;500;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: ${typography.fonts.primary};
                    background: url('${background.image}') ${background.position} / ${background.size} no-repeat, ${colors.backgrounds.primary};
                    color: ${colors.text.primary_light};
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                
                .main-container {
                    max-width: ${this.content.layout.content_max_width};
                    padding: ${this.content.layout.padding};
                    text-align: ${this.content.layout.text_alignment};
                }
                
                .content-panel {
                    background: ${ui_elements.panels.glass.background};
                    border: ${ui_elements.panels.glass.border};
                    backdrop-filter: ${ui_elements.panels.glass.backdrop_filter};
                    border-radius: ${ui_elements.panels.glass.border_radius};
                    padding: 40px;
                    box-shadow: ${effects.shadows.strong};
                }
                
                .welcome-title {
                    font-size: ${typography.sizes.heading_large};
                    font-weight: 700;
                    color: ${colors.text.primary_light};
                    margin-bottom: 30px;
                    text-shadow: ${effects.shadows.soft};
                }
                
                .mission-text {
                    font-size: ${typography.sizes.body};
                    line-height: 1.6;
                    margin-bottom: 20px;
                    color: ${colors.text.primary_light};
                }
                
                .mission-text strong {
                    color: ${colors.jewel_tones.ruby_red};
                    font-weight: 600;
                }
                
                .mission-text em {
                    color: ${colors.jewel_tones.emerald_green};
                    font-style: italic;
                    font-weight: 500;
                }
                
                .attribution {
                    font-size: ${typography.sizes.caption};
                    color: ${colors.grays.light_gray};
                    margin: 30px 0;
                    font-style: italic;
                }
                
                .call-to-action {
                    margin-top: 40px;
                }
                
                .cta-text {
                    font-size: ${typography.sizes.heading_small};
                    color: ${colors.jewel_tones.sapphire_blue};
                    margin-bottom: 20px;
                    animation: pulse 2s infinite;
                }
                
                .hope-button {
                    background: ${ui_elements.buttons.primary.background};
                    color: ${ui_elements.buttons.primary.text};
                    border: ${ui_elements.buttons.primary.border};
                    font-size: ${typography.sizes.heading_medium};
                    font-weight: 700;
                    padding: 15px 40px;
                    border-radius: 25px;
                    cursor: pointer;
                    box-shadow: ${ui_elements.buttons.primary.shadow};
                    transition: all 0.3s ease;
                    font-family: ${typography.fonts.heading};
                    letter-spacing: 2px;
                }
                
                .hope-button:hover {
                    transform: scale(${ui_elements.buttons.primary.hover_scale});
                    box-shadow: ${effects.glows.ruby};
                }
                
                .jewel-accent {
                    width: 100%;
                    height: 4px;
                    background: ${effects.borders.jewel_gradient};
                    margin: 20px 0;
                    border-radius: 2px;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                .trademark-footer {
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    font-size: 10px;
                    color: ${colors.grays.silver};
                    opacity: 0.8;
                }
            </style>
        </head>
        <body>
            <div class="main-container">
                <div class="content-panel">
                    <h1 class="welcome-title">${splash_content.title}</h1>
                    
                    <div class="jewel-accent"></div>
                    
                    <p class="mission-text">
                        <strong>${splash_content.mission_statement.introduction}</strong>
                    </p>
                    
                    <p class="mission-text">
                        <em>${splash_content.mission_statement.definition}</em>
                    </p>
                    
                    <p class="mission-text">
                        ${splash_content.mission_statement.purpose}
                    </p>
                    
                    <p class="mission-text">
                        ${splash_content.mission_statement.philosophy}
                    </p>
                    
                    <p class="mission-text">
                        ${splash_content.mission_statement.greeting}
                    </p>
                    
                    <div class="attribution">
                        ${splash_content.attribution}
                    </div>
                    
                    <div class="jewel-accent"></div>
                    
                    <div class="call-to-action">
                        <p class="cta-text">${splash_content.call_to_action.text}</p>
                        <button class="hope-button" onclick="startAniota()">
                            ${splash_content.call_to_action.button_text}
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="trademark-footer">
                © DK Softworks LLC - Trademarked Theme
            </div>
            
            <script>
                const { ipcRenderer } = require('electron');
                
                function startAniota() {
                    console.log('🌟 Hope button clicked - Starting Aniota journey!');
                    console.log('📡 Sending splash-complete IPC message...');
                    ipcRenderer.send('splash-complete');
                    console.log('✅ splash-complete message sent!');
                }
                
                // Auto-advance after 10 seconds if no interaction
                setTimeout(() => {
                    console.log('⏰ 10-second timer expired, auto-starting...');
                    startAniota();
                }, 10000);
                
                console.log('🎬 Splash screen JavaScript loaded and ready!');
            </script>
        </body>
        </html>`;
    }
    
    close() {
        if (this.splashWindow && !this.splashWindow.isDestroyed()) {
            this.splashWindow.close();
        }
    }
}

module.exports = DKSoftworksThemedSplash;

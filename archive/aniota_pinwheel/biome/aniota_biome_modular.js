
const { BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

const AniotaPetBehavior = require('./modules/aniotaBiome_petBehavior');
const AniotaPetMood = require('./modules/aniotaBiome_petMood');
const AniotaTrainingAcademy = require('./modules/aniotaBiome_trainingAcademy');
const AniotaVisualRenderer = require('./modules/aniotaBiome_visualRenderer');
const AniotaTrustTokenLearning = require('./modules/aniotaBiome_trustTokenLearning');
const AniotaTokenInterface = require('./modules/aniotaBiome_tokenInterface');
const AniotaUserTokenEconomy = require('./modules/aniotaBiome_userTokenEconomy');
const AniotaPointerExtension = require('./modules/aniotaBiome_pointerExtension');

function logEntry(method, file) {
    console.log(`📝 ${file}::${method}()`);
}

class AniotaBiome {
    constructor() {
        logEntry('constructor', 'AniotaBiome.js');
        
        this.characterData = null;
        this.characterWindow = null;
        this.uiElements = new Map();
        this.animationFrames = new Map();
        
        // Initialize modular components
        this.petBehavior = new AniotaPetBehavior(this);
        this.petMood = new AniotaPetMood(this);
        this.trainingAcademy = new AniotaTrainingAcademy(this);
        this.visualRenderer = new AniotaVisualRenderer(this);
        this.trustTokenLearning = new AniotaTrustTokenLearning(this);
        this.tokenInterface = new AniotaTokenInterface(this);
        this.userTokenEconomy = new AniotaUserTokenEconomy(this);
        this.pointerExtension = new AniotaPointerExtension(this);
        
        // Core state
        this.behaviorState = {
            mode: 'observing',
            attentionLevel: 0,
            idlePoints: 0,
            lastUserActivity: Date.now()
        };
        
        console.log('🌊 AniotaBiome initialized with modular components');
    }

    getDefaultCharacterData() {
        return {
            character: { name: "Aniota", type: "learning_companion" },
            visual: { 
                base_shape: "sphere", 
                size: { width: 80, height: 80 },
                colors: { primary: "#FFD700", secondary: "#B8860B" }
            },
            behavior: { idle_positions: [{ x: "screen.width - 100", y: "20" }] }
        };
    }

    // Backend integration methods
    async initializeBackendConnection() {
        console.log('🔗 Initializing backend connection to existing IX-TECH systems...');
        
        try {
            const response = await fetch('http://localhost:8001/health');
            if (response.ok) {
                console.log('✅ Backend connection established');
                return true;
            }
        } catch (error) {
            console.log('⚠️ Backend not available, using fallback mode');
        }
        
        return false;
    }

    async requestSocraticQuestion() {
        try {
            const response = await fetch('http://localhost:8001/api/sie/question');
            if (response.ok) {
                const data = await response.json();
                console.log('🎓 Received SIE question:', data);
                return data;
            }
        } catch (error) {
            console.log('⚠️ SIE not available, using fallback');
        }
        
        return this.getFallbackQuestion();
    }

    getFallbackQuestion() {
        const fallbackQuestions = [
            { question: "What's something new you'd like to learn about today?" },
            { question: "Can you think of a problem you'd like to solve?" },
            { question: "What makes you curious right now?" },
            { question: "If you could ask an expert one question, what would it be?" },
            { question: "What's the most interesting thing you've discovered recently?" }
        ];
        
        return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    }

    // Training Academy Methods
    async handleTrainingClick() {
        if (this.trainingAcademy.isActive) {
            const result = this.trainingAcademy.processTrainingInteraction('click');
            const behaviorResult = this.petBehavior.handleClick('single');
            this.petMood.updateMoodFromInteraction('click', 0.1);
            
            console.log('🎓 Training click processed:', result);
            return result;
        } else {
            await this.startTrainingAcademy();
        }
    }

    async startTrainingAcademy() {
        return await this.trainingAcademy.startTrainingAcademy();
    }

    async teachComeCommand(x, y) {
        const trainingResult = this.trainingAcademy.processTrainingInteraction('desktop-click', { x, y });
        const behaviorResult = this.petBehavior.executeComeCommand(x, y);
        this.petMood.updateMoodFromInteraction('command_success', 0.15);
        
        console.log('🐕 Come command taught:', { trainingResult, behaviorResult });
        return { trainingResult, behaviorResult };
    }

    async teachJumpCommand(startX, startY, endX, endY) {
        const trainingResult = this.trainingAcademy.processTrainingInteraction('drag', { startX, startY, endX, endY });
        const behaviorResult = this.petBehavior.executeJumpCommand(startX, startY, endX, endY);
        this.petMood.updateMoodFromInteraction('command_success', 0.15);
        
        console.log('🐕 Jump command taught:', { trainingResult, behaviorResult });
        return { trainingResult, behaviorResult };
    }

    // Main biome creation
    async createBiome() {
        console.log('🏗️ Creating Aniota\'s biome environment...');
        
        this.characterData = this.getDefaultCharacterData();
        await this.initializeBackendConnection();
        await this.createCharacterWindow();
        await this.positionCharacter();
        await this.renderCharacter();
        
        // Small delay to ensure all modules are fully initialized
        setTimeout(() => {
            this.startBehaviorEngine();
        }, 500);
        
        console.log('✨ Aniota\'s biome is alive and active!');
    }

    async createCharacterWindow() {
        console.log('🪟 Creating character window...');
        
        this.characterWindow = new BrowserWindow({
            width: this.characterData.visual.size.width,
            height: this.characterData.visual.size.height,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            skipTaskbar: true,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });
        
        this.characterWindow.setIgnoreMouseEvents(false);
        console.log('🪟 Character window created successfully');
    }

    async positionCharacter() {
        const primary = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primary.workAreaSize;
        
        console.log('Primary display: ' + screenWidth + 'x' + screenHeight);
        
        const defaultPos = this.characterData.behavior.idle_positions[0];
        const x = this.calculatePosition(defaultPos.x, screenWidth, screenHeight);
        const y = this.calculatePosition(defaultPos.y, screenWidth, screenHeight);
        
        console.log('Calculated position: (' + x + ', ' + y + ')');
        this.characterWindow.setPosition(x, y);
        
        const actualPosition = this.characterWindow.getPosition();
        console.log('Window positioned at (' + actualPosition[0] + ', ' + actualPosition[1] + ')');
    }

    calculatePosition(expression, screenWidth, screenHeight) {
        if (typeof expression === 'string') {
            const screen = { width: screenWidth, height: screenHeight };
            return eval(expression);
        }
        return expression || 0;
    }

    async renderCharacter() {
        if (global.executionTracer) {
            global.executionTracer.trace('renderCharacter', 'renderCharacter');
        }
        
        // Create minimal HTML container for canvas rendering
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    margin: 0; 
                    padding: 0; 
                    background: transparent; 
                    overflow: hidden;
                    cursor: pointer;
                }
                canvas { 
                    display: block; 
                    transition: transform 0.2s ease;
                }
                canvas:hover {
                    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
                }
            </style>
        </head>
        <body>
            <canvas id="aniotaCanvas" width="80" height="80"></canvas>
            
            <script>
                const { ipcRenderer } = require('electron');
                const canvas = document.getElementById('aniotaCanvas');
                const ctx = canvas.getContext('2d');
                
                // Initialize visual renderer
                let frame = 0;
                let lastDebugTime = 0;
                
                function drawAniota(animationPhase = 0) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const time = animationPhase * 0.1;
                    
                    // Get current state from mood and behavior systems
                    // (This would normally come from the modules)
                    const currentState = 'learning'; // Default state
                    const sphereColor = getRingColor(currentState);
                    
                    // Draw Saturn rings
                    drawSaturnRings(centerX, centerY, time);
                    
                    // Draw central golden sphere
                    const gradient = ctx.createRadialGradient(centerX - 8, centerY - 8, 0, centerX, centerY, 25);
                    gradient.addColorStop(0, '#FFFFFF40');
                    gradient.addColorStop(0.3, sphereColor + 'CC');
                    gradient.addColorStop(0.7, sphereColor);
                    gradient.addColorStop(1, sphereColor + '80');
                    
                    const breathe = Math.sin(time * 0.5) * 2;
                    const radius = 20 + breathe;
                    
                    ctx.beginPath();
                    ctx.fillStyle = gradient;
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Add golden glow
                    ctx.shadowColor = '#FFD700';
                    ctx.shadowBlur = 25;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.shadowColor = '#FFA500';
                    ctx.shadowBlur = 15;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    
                    // Golden surface texture
                    ctx.fillStyle = '#FFFFE060';
                    for (let i = 0; i < 5; i++) {
                        const angle = (time * 0.3 + i * 1.26) % (Math.PI * 2);
                        const dotX = centerX + Math.cos(angle) * (radius * 0.6);
                        const dotY = centerY + Math.sin(angle) * (radius * 0.6) * 0.5;
                        ctx.beginPath();
                        ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                function drawSaturnRings(centerX, centerY, time) {
                    const rings = [
                        { radius: 35, thickness: 3, color: '#DAA520', alpha: 0.7, rotation: time * 0.02 },
                        { radius: 45, thickness: 2, color: '#CD853F', alpha: 0.6, rotation: time * 0.03 },
                        { radius: 55, thickness: 4, color: '#FFD700', alpha: 0.5, rotation: time * 0.025 },
                        { radius: 65, thickness: 2, color: '#FFA500', alpha: 0.4, rotation: time * 0.015 }
                    ];
                    
                    rings.forEach(ring => {
                        ctx.save();
                        ctx.translate(centerX, centerY);
                        ctx.rotate(ring.rotation);
                        ctx.globalAlpha = ring.alpha;
                        
                        const gradient = ctx.createLinearGradient(-ring.radius, 0, ring.radius, 0);
                        gradient.addColorStop(0, 'transparent');
                        gradient.addColorStop(0.3, ring.color);
                        gradient.addColorStop(0.7, ring.color);
                        gradient.addColorStop(1, 'transparent');
                        
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = ring.thickness;
                        ctx.beginPath();
                        ctx.ellipse(0, 0, ring.radius, ring.radius * 0.3, 0, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        ctx.restore();
                    });
                }
                
                function getRingColor(activityState) {
                    const stateColors = {
                        'thinking': '#DAA520',
                        'processing': '#CD853F',
                        'learning': '#FFD700',
                        'questioning': '#FF8C00',
                        'responding': '#FFA500',
                        'idle': '#F4A460',
                        'excited': '#FFB347',
                        'focused': '#B8860B'
                    };
                    return stateColors[activityState] || stateColors['idle'];
                }
                
                // Animation loop
                function animate() {
                    drawAniota(frame);
                    frame++;
                    
                    if (frame % 120 === 0) {
                        const now = Date.now();
                        const fps = 120000 / (now - lastDebugTime) || 0;
                        console.log('Animation frame ' + frame + ', estimated FPS: ' + fps.toFixed(1));
                        lastDebugTime = now;
                    }
                    
                    requestAnimationFrame(animate);
                }
                
                console.log('Starting Aniota animation loop...');
                animate();
                
                // Click interaction
                canvas.addEventListener('click', () => {
                    ipcRenderer.send('character-clicked');
                    
                    canvas.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        canvas.style.transform = 'scale(1)';
                    }, 200);
                });
                
                canvas.addEventListener('mouseenter', () => {
                    canvas.style.filter = 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))';
                });
                
                canvas.addEventListener('mouseleave', () => {
                    canvas.style.filter = 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.4))';
                });
            </script>
        </body>
        </html>`;
        
        this.characterWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    }

    startBehaviorEngine() {
        console.log('Starting Aniota behavior engine...');
        
        setInterval(() => {
            // Safety checks to prevent race conditions
            if (!this.petMood || !this.petBehavior) {
                console.log('⚠️ Modules not fully initialized, skipping update cycle');
                return;
            }
            
            try {
                const moodState = this.petMood.getCurrentMoodState();
                const movementState = this.petBehavior.getCurrentMovement();
                
                // Process behavior updates
                if (movementState && movementState.action !== 'idle') {
                    console.log('🎭 Active behavior:', movementState.action);
                }
                
                // Update mood over time
                this.petMood.applyMoodDecay();
                
            } catch (error) {
                console.log('⚠️ Error in behavior engine cycle:', error.message);
            }
            
        }, 100); // Update every 100ms
        
        console.log('✅ Behavior engine started');
    }

    // Enable teacher mode - allows bidirectional communication via pointer
    enableTeacherMode() {
        console.log('🎓 Activating teacher mode...');
        
        // Activate training academy
        this.trainingAcademy.activate();
        
        // Enable token interface for learning
        this.tokenInterface.enableInterface();
        
        // Try to enable pointer extension (requires trust)
        const pointerEnabled = this.pointerExtension.enableTeacherMode();
        
        if (pointerEnabled) {
            console.log('✨ Teacher mode fully activated - Aniota can now communicate back!');
            return true;
        } else {
            console.log('📚 Teacher mode active - continue building trust for pointer extension');
            return false;
        }
    }

    // Disable teacher mode
    disableTeacherMode() {
        console.log('🎓 Deactivating teacher mode...');
        
        this.trainingAcademy.deactivate();
        this.tokenInterface.disableInterface();
        this.pointerExtension.disableTeacherMode();
        
        console.log('✅ Teacher mode deactivated');
    }

    // Get current learning progress and trust level
    getLearningStatus() {
        return {
            trustLevel: this.trustTokenLearning.getTrustLevel(),
            behaviorProgress: this.trustTokenLearning.getBehaviorProgress(),
            tokenCount: this.trustTokenLearning.getCurrentTokens(),
            userTokens: this.userTokenEconomy.getUserStatus(),
            motivation: this.userTokenEconomy.getMotivationMessage(),
            pointerAvailable: this.pointerExtension.isActive,
            communicationCapabilities: this.pointerExtension.getCurrentCapabilities()
        };
    }

    // Cleanup method for proper shutdown
    destroy() {
        console.log('🧹 Cleaning up Aniota biome...');
        
        try {
            // Close pointer extension
            if (this.pointerExtension) {
                this.pointerExtension.close();
            }
            
            // Clear any running intervals
            if (this.behaviorInterval) {
                clearInterval(this.behaviorInterval);
            }
            
            // Close character window
            if (this.characterWindow && !this.characterWindow.isDestroyed()) {
                this.characterWindow.close();
            }
            
            // Clear animation frames
            this.animationFrames.forEach(frameId => {
                if (frameId) {
                    cancelAnimationFrame(frameId);
                }
            });
            this.animationFrames.clear();
            
            console.log('✅ Aniota biome cleanup completed');
        } catch (error) {
            console.log('⚠️ Error during cleanup:', error.message);
        }
    }
}

module.exports = AniotaBiome;

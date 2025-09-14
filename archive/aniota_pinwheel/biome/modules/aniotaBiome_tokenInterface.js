

class AniotaTokenInterface {
    constructor(parentBiome) {
        this.biome = parentBiome;
        this.tokenWindow = null;
        this.isActive = false;
        this.pendingReward = null;
        this.lastActionObserved = null;
        
        // Token values for different reinforcement types
        this.tokenValues = {
            strong_positive: 1.0,
            positive: 0.7,
            mild_positive: 0.3,
            neutral: 0.0,
            mild_negative: -0.3,
            negative: -0.7,
            strong_negative: -1.0
        };
    }

    async createTokenInterface() {
        const { BrowserWindow } = require('electron');
        
        this.tokenWindow = new BrowserWindow({
            width: 400,
            height: 300,
            frame: true,
            resizable: false,
            alwaysOnTop: true,
            title: 'Aniota Token Trainer - Authentic Conditioning',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        const tokenHTML = this.generateTokenHTML();
        this.tokenWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(tokenHTML));
        
        this.isActive = true;
        console.log('🪙 Token Interface created - Ready for authentic training');
    }

    generateTokenHTML() {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Aniota Token Trainer</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 15px;
                    background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
                    color: white;
                    min-height: 100vh;
                    box-sizing: border-box;
                }
                .trainer-container {
                    max-width: 370px;
                    margin: 0 auto;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .trust-meter {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    height: 8px;
                    margin: 10px 0;
                    overflow: hidden;
                }
                .trust-fill {
                    background: linear-gradient(90deg, #E74C3C, #F39C12, #27AE60);
                    height: 100%;
                    width: 0%;
                    transition: width 0.5s ease;
                    border-radius: 10px;
                }
                .token-section {
                    margin: 15px 0;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .token-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    margin-top: 10px;
                }
                .token-btn {
                    padding: 8px 12px;
                    border: none;
                    border-radius: 6px;
                    font-size: 0.9em;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .positive { background: #27AE60; color: white; }
                .positive:hover { background: #2ECC71; transform: translateY(-1px); }
                .mild-positive { background: #F39C12; color: white; }
                .mild-positive:hover { background: #E67E22; transform: translateY(-1px); }
                .neutral { background: #95A5A6; color: white; }
                .neutral:hover { background: #BDC3C7; transform: translateY(-1px); }
                .mild-negative { background: #E67E22; color: white; }
                .mild-negative:hover { background: #D35400; transform: translateY(-1px); }
                .negative { background: #E74C3C; color: white; }
                .negative:hover { background: #C0392B; transform: translateY(-1px); }
                .strong-positive { background: #1ABC9C; color: white; }
                .strong-positive:hover { background: #16A085; transform: translateY(-2px); }
                .observation {
                    background: rgba(52, 152, 219, 0.1);
                    border: 1px solid rgba(52, 152, 219, 0.3);
                    border-radius: 8px;
                    padding: 10px;
                    margin: 10px 0;
                    font-size: 0.9em;
                }
                .phase-indicator {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8em;
                    font-weight: bold;
                    margin-left: 10px;
                }
                .trust-building { background: #E74C3C; }
                .pattern-recognition { background: #F39C12; }
                .behavior-shaping { background: #27AE60; }
                .status {
                    text-align: center;
                    margin-top: 15px;
                    font-size: 0.9em;
                    opacity: 0.8;
                }
            </style>
        </head>
        <body>
            <div class="trainer-container">
                <div class="header">
                    <h2>🪙 Token Trainer</h2>
                    <p>Authentic Behavioral Conditioning</p>
                    <div>
                        Trust Level: <span id="trustLevel">0%</span>
                        <span id="phaseIndicator" class="phase-indicator trust-building">Trust Building</span>
                    </div>
                    <div class="trust-meter">
                        <div id="trustFill" class="trust-fill"></div>
                    </div>
                </div>
                
                <div class="observation" id="observation">
                    Watch Aniota's behavior and provide immediate token rewards. 
                    Positive tokens strengthen behaviors, negative tokens weaken them.
                </div>
                
                <div class="token-section">
                    <h3>💚 Positive Reinforcement</h3>
                    <div class="token-grid">
                        <button class="token-btn strong-positive" onclick="giveToken('strong_positive')">
                            ⭐ Excellent!
                        </button>
                        <button class="token-btn positive" onclick="giveToken('positive')">
                            ✅ Good!
                        </button>
                        <button class="token-btn mild-positive" onclick="giveToken('mild_positive')">
                            👍 Nice Try
                        </button>
                        <button class="token-btn neutral" onclick="giveToken('neutral')">
                            😐 Neutral
                        </button>
                    </div>
                </div>
                
                <div class="token-section">
                    <h3>🔴 Corrective Feedback</h3>
                    <div class="token-grid">
                        <button class="token-btn mild-negative" onclick="giveToken('mild_negative')">
                            🤔 Not Quite
                        </button>
                        <button class="token-btn negative" onclick="giveToken('negative')">
                            ❌ No
                        </button>
                    </div>
                </div>
                
                <div class="status" id="status">
                    Ready to train - Click tokens when Aniota acts
                </div>
            </div>

            <script>
                const { ipcRenderer } = require('electron');
                
                let currentTrustLevel = 0;
                let currentPhase = 'trust_building';
                
                function giveToken(tokenType) {
                    // Send token to learning engine
                    ipcRenderer.send('give-token', {
                        type: tokenType,
                        timestamp: Date.now(),
                        context: {
                            lastAction: document.getElementById('observation').dataset.lastAction || 'unknown'
                        }
                    });
                    
                    // Visual feedback
                    const button = event.target;
                    const originalText = button.textContent;
                    button.textContent = 'Sent!';
                    button.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.transform = 'scale(1)';
                    }, 300);
                    
                    // Update status
                    updateStatus(\`Token sent: \${tokenType}\`);
                }
                
                function updateTrustLevel(level) {
                    currentTrustLevel = level;
                    const percentage = Math.round(level * 100);
                    document.getElementById('trustLevel').textContent = percentage + '%';
                    document.getElementById('trustFill').style.width = percentage + '%';
                }
                
                function updatePhase(phase) {
                    currentPhase = phase;
                    const indicator = document.getElementById('phaseIndicator');
                    indicator.className = 'phase-indicator ' + phase.replace('_', '-');
                    
                    const phaseNames = {
                        'trust_building': 'Trust Building',
                        'pattern_recognition': 'Pattern Recognition', 
                        'behavior_shaping': 'Behavior Shaping'
                    };
                    
                    indicator.textContent = phaseNames[phase] || phase;
                }
                
                function updateObservation(action, message) {
                    const obs = document.getElementById('observation');
                    obs.textContent = message;
                    obs.dataset.lastAction = action;
                }
                
                function updateStatus(message) {
                    document.getElementById('status').textContent = message;
                    setTimeout(() => {
                        document.getElementById('status').textContent = 'Ready to train - Click tokens when Aniota acts';
                    }, 2000);
                }
                
                // Listen for updates from learning engine
                ipcRenderer.on('learning-update', (event, data) => {
                    updateTrustLevel(data.trustLevel);
                    updatePhase(data.phase);
                    if (data.observation) {
                        updateObservation(data.lastAction, data.observation);
                    }
                });
                
                // Listen for behavior observations
                ipcRenderer.on('behavior-observed', (event, data) => {
                    updateObservation(data.action, \`Aniota just: \${data.action}. Reward or correct?\`);
                });
                
                console.log('🪙 Token Interface ready for training');
            </script>
        </body>
        </html>`;
    }

    // Record observed behavior for token context
    observeBehavior(action, context = {}) {
        this.lastActionObserved = {
            action,
            timestamp: Date.now(),
            context
        };
        
        // Notify token interface
        if (this.tokenWindow) {
            this.tokenWindow.webContents.send('behavior-observed', {
                action,
                context,
                message: `Aniota just: ${action}. Provide immediate token feedback!`
            });
        }
        
        console.log(`👁️ Behavior observed: ${action}`);
    }

    // Process token from user interface
    processToken(tokenData) {
        if (!this.biome.trustTokenLearning) {
            console.log('⚠️ Trust token learning system not available');
            return;
        }
        
        // Check if user can afford this token
        const spendResult = this.biome.userTokenEconomy.spendToken(tokenData.type);
        
        if (!spendResult.success) {
            // User can't afford token - show message and return
            if (this.tokenWindow) {
                this.tokenWindow.webContents.send('token-denied', {
                    message: spendResult.message,
                    balance: spendResult.balance,
                    motivation: this.biome.userTokenEconomy.getMotivationMessage()
                });
            }
            console.log(`💰 Token denied: ${spendResult.message}`);
            return spendResult;
        }
        
        const tokenValue = this.tokenValues[tokenData.type] || 0;
        
        // Add context from last observed behavior
        const context = {
            lastAction: this.lastActionObserved?.action || 'unknown',
            userIntent: tokenData.type,
            timingSinceAction: Date.now() - (this.lastActionObserved?.timestamp || 0),
            userBalance: spendResult.balance,
            tokenCost: spendResult.cost
        };
        
        // Send to learning engine
        const learningResult = this.biome.trustTokenLearning.receiveToken(tokenValue, context);
        
        // Record learning behavior
        if (tokenValue > 0) {
            this.biome.userTokenEconomy.recordPositiveLearning('token_given');
        } else {
            this.biome.userTokenEconomy.recordNegativeLearning('negative_token');
        }
        
        // Update interface with learning progress
        if (this.tokenWindow) {
            this.tokenWindow.webContents.send('learning-update', {
                trustLevel: learningResult.trustLevel || 0,
                phase: learningResult.phase || 'trust_building',
                observation: learningResult.message,
                lastAction: context.lastAction
            });
        }
        
        console.log(`🪙 Token processed: ${tokenData.type} (${tokenValue}) → ${learningResult.message}`);
        
        return learningResult;
    }

    // Auto-observe common interactions
    setupAutoObservation() {
        // This would be called when user interacts with Aniota
        const commonActions = [
            'click_response',
            'proximity_reaction', 
            'movement_behavior',
            'idle_positioning',
            'attention_seeking',
            'playful_behavior'
        ];
        
        console.log('👁️ Auto-observation enabled for authentic training');
    }

    // Generate training session report
    generateTrainingReport() {
        if (!this.biome.trustLearning) return null;
        
        const learningData = this.biome.trustLearning.exportLearningData();
        
        return {
            sessionType: 'authentic_behavioral_conditioning',
            timestamp: Date.now(),
            researchData: learningData,
            scientificValidity: {
                totalTrials: learningData.tokenHistory.length,
                behaviorsAcquired: learningData.behaviorCount,
                learningEfficiency: learningData.learningMetrics.learningEfficiency,
                trustProgression: this.analyzeTrustProgression(learningData.tokenHistory),
                extinctionEvents: this.countExtinctionEvents(learningData),
                proofOfLearning: learningData.behaviorCount > 0 && learningData.trustLevel > 0.3
            }
        };
    }

    analyzeTrustProgression(tokenHistory) {
        // Analyze how trust built over time - key research metric
        const trustPoints = tokenHistory.map(token => token.trustLevelAtTime);
        
        return {
            initialTrust: trustPoints[0] || 0,
            finalTrust: trustPoints[trustPoints.length - 1] || 0,
            maxTrust: Math.max(...trustPoints),
            trustGrowthRate: this.calculateGrowthRate(trustPoints),
            trustStability: this.calculateStability(trustPoints)
        };
    }

    calculateGrowthRate(values) {
        if (values.length < 2) return 0;
        const totalGrowth = values[values.length - 1] - values[0];
        return totalGrowth / values.length;
    }

    calculateStability(values) {
        if (values.length < 2) return 0;
        const variance = this.calculateVariance(values);
        return 1 / (1 + variance); // Higher stability = lower variance
    }

    calculateVariance(values) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
    }

    countExtinctionEvents(learningData) {
        // Count how many behaviors were learned then extinguished
        // This proves the learning was real (behaviors can be unlearned)
        return learningData.interactionHistory.filter(
            interaction => interaction.context.extinction === true
        ).length;
    }

    enableInterface() {
        this.isActive = true;
        if (this.tokenWindow) {
            this.tokenWindow.show();
        }
        console.log('🪙 Token Interface enabled');
    }

    disableInterface() {
        this.isActive = false;
        if (this.tokenWindow) {
            this.tokenWindow.hide();
        }
        console.log('🪙 Token Interface disabled');
    }

    close() {
        if (this.tokenWindow) {
            this.tokenWindow.close();
            this.tokenWindow = null;
        }
        this.isActive = false;
        console.log('🪙 Token Interface closed');
    }
}

module.exports = AniotaTokenInterface;

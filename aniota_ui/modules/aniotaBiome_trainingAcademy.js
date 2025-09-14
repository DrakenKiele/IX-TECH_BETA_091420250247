
class AniotaTrainingAcademy {
    constructor(parentBiome) {
        this.biome = parentBiome;
        this.isActive = false;
        this.trainingSession = null;
        this.trainingWindow = null;
        
        this.lessons = {
            introduction: {
                title: "Welcome to Pet Training Psychology",
                description: "Learn behavioral principles by training Aniota",
                commands: ['click', 'double-click']
            },
            basic_commands: {
                title: "Basic Command Structure",
                description: "Establish clear command-response patterns",
                commands: ['sit', 'stay', 'come']
            },
            advanced_interaction: {
                title: "Advanced Interaction Design",
                description: "Complex gesture-based communication",
                commands: ['jump', 'follow', 'play']
            },
            behavioral_psychology: {
                title: "Understanding Behavioral Conditioning",
                description: "Why timing and consistency matter",
                commands: ['reward', 'ignore', 'redirect']
            }
        };
    }

    async startTrainingAcademy() {
        console.log('🎓 Launching Aniota Training Academy...');
        this.isActive = true;
        this.trainingSession = {
            startTime: Date.now(),
            currentLesson: 'introduction',
            commandsLearned: [],
            clickCount: 0,
            successfulCommands: 0,
            learningPoints: []
        };

        await this.createTrainingWindow();
        return true;
    }

    async createTrainingWindow() {
        const { BrowserWindow } = require('electron');
        
        this.trainingWindow = new BrowserWindow({
            width: 600,
            height: 500,
            frame: true,
            resizable: true,
            alwaysOnTop: true,
            title: 'Aniota Training Academy - Learn by Teaching',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        const trainingHTML = this.generateTrainingHTML();
        this.trainingWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(trainingHTML));
        
        console.log('🎓 Training Academy window created');
    }

    generateTrainingHTML() {
        const currentLesson = this.lessons[this.trainingSession?.currentLesson || 'introduction'];
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Aniota Training Academy</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
                    color: #333;
                    min-height: 100vh;
                    box-sizing: border-box;
                }
                .academy-container {
                    max-width: 550px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 25px;
                }
                .academy-icon {
                    font-size: 3em;
                    margin-bottom: 10px;
                }
                h1 {
                    color: #B8860B;
                    margin: 0 0 10px 0;
                    font-size: 1.8em;
                }
                .subtitle {
                    color: #666;
                    font-style: italic;
                    margin-bottom: 20px;
                }
                .lesson-card {
                    background: #FFF8DC;
                    border: 2px solid #DAA520;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 15px;
                }
                .command-list {
                    background: #F0F8FF;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 15px 0;
                }
                .command-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #E0E0E0;
                }
                .command-item:last-child {
                    border-bottom: none;
                }
                .command-action {
                    font-weight: bold;
                    color: #FF8C00;
                    min-width: 120px;
                }
                .command-result {
                    color: #555;
                }
                .psychology-note {
                    background: #E6F3FF;
                    border-left: 4px solid #4A90E2;
                    padding: 12px;
                    margin: 15px 0;
                    font-size: 0.9em;
                }
                .progress-bar {
                    background: #E0E0E0;
                    border-radius: 10px;
                    height: 8px;
                    margin: 10px 0;
                    overflow: hidden;
                }
                .progress-fill {
                    background: linear-gradient(90deg, #FFD700, #FFA500);
                    height: 100%;
                    transition: width 0.3s ease;
                }
                .start-btn {
                    background: linear-gradient(135deg, #FFD700, #FFA500);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 25px;
                    font-size: 1.1em;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: block;
                    margin: 20px auto 0;
                }
                .start-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(255, 165, 0, 0.4);
                }
            </style>
        </head>
        <body>
            <div class="academy-container">
                <div class="header">
                    <div class="academy-icon">🎓🐕</div>
                    <h1>Aniota Training Academy</h1>
                    <p class="subtitle">Learn by Teaching - Master Skills Through Practice</p>
                </div>
                
                <div class="lesson-card">
                    <h3>Current Lesson: ${currentLesson.title} 🎯</h3>
                    <p>${currentLesson.description}</p>
                    
                    <div class="psychology-note">
                        <strong>🧠 Learning Principle:</strong> The best way to learn something is to teach it. 
                        By training Aniota, you'll internalize how commands, timing, and rewards create lasting behavioral patterns.
                    </div>
                </div>

                <div class="lesson-card">
                    <h3>Pet Training Commands 📚</h3>
                    <div class="command-list">
                        <div class="command-item">
                            <span class="command-action">Single Click:</span>
                            <span class="command-result">"Sit" - Aniota stays in place</span>
                        </div>
                        <div class="command-item">
                            <span class="command-action">Double Click:</span>
                            <span class="command-result">"Stay" - Long-term position hold</span>
                        </div>
                        <div class="command-item">
                            <span class="command-action">Desktop Double-Click:</span>
                            <span class="command-result">"Come" - Move to clicked location</span>
                        </div>
                        <div class="command-item">
                            <span class="command-action">Click + Drag:</span>
                            <span class="command-result">"Jump" - Leap in drag direction</span>
                        </div>
                        <div class="command-item">
                            <span class="command-action">Mouse Proximity:</span>
                            <span class="command-result">"Play" - Excited circling behavior</span>
                        </div>
                    </div>
                    
                    <div class="psychology-note">
                        <strong>🎯 Training Principle:</strong> Consistent timing and clear commands create 
                        predictable responses. Notice how each gesture has a specific meaning - this is how 
                        all communication systems work!
                    </div>
                </div>

                <div class="lesson-card">
                    <h3>What You're Really Learning 🚀</h3>
                    <ul>
                        <li><strong>Behavioral Psychology:</strong> Action → Response → Reinforcement cycles</li>
                        <li><strong>Command Design:</strong> How to create intuitive interaction patterns</li>
                        <li><strong>Timing & Feedback:</strong> Why immediate responses matter</li>
                        <li><strong>Pattern Recognition:</strong> Building consistent interaction vocabularies</li>
                        <li><strong>User Experience:</strong> Designing natural, predictable interfaces</li>
                    </ul>
                </div>

                <div class="lesson-card">
                    <h3>Training Progress 📊</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 25%"></div>
                    </div>
                    <p>Commands Mastered: ${this.trainingSession?.commandsLearned.length || 0} / 5</p>
                </div>

                <button class="start-btn" onclick="startTraining()">Begin Training Session 🎯</button>
            </div>

            <script>
                function startTraining() {
                    alert('Training Academy Starting! Watch Aniota closely - she\\'s ready to learn your commands!');
                    window.close();
                }
            </script>
        </body>
        </html>`;
    }

    // Process training interactions
    processTrainingInteraction(interactionType, data = {}) {
        if (!this.isActive) return null;
        
        console.log(`🎓 Training interaction: ${interactionType}`, data);
        
        this.trainingSession.clickCount++;
        
        switch (interactionType) {
            case 'click':
                return this.processClickCommand();
            case 'double-click':
                return this.processDoubleClickCommand();
            case 'desktop-click':
                return this.processComeCommand(data.x, data.y);
            case 'drag':
                return this.processJumpCommand(data);
            case 'proximity':
                return this.processProximityCommand(data);
        }
    }

    processClickCommand() {
        const command = 'sit';
        this.recordLearning(command, 'Single click teaches "sit" - immediate response builds trust');
        
        return {
            command,
            feedback: 'Excellent! You just taught Aniota to sit. Notice how immediate the response was?',
            learningPoint: 'Quick feedback strengthens behavioral conditioning',
            nextStep: 'Try double-clicking for "stay" command'
        };
    }

    processDoubleClickCommand() {
        const command = 'stay';
        this.recordLearning(command, 'Double click creates different behavior - pattern recognition');
        
        return {
            command,
            feedback: 'Perfect! Double-click creates a longer "stay" behavior. You\'re building a command vocabulary!',
            learningPoint: 'Different gestures create different behaviors - this is interface design',
            nextStep: 'Double-click on the desktop to teach "come"'
        };
    }

    processComeCommand(x, y) {
        const command = 'come';
        this.recordLearning(command, 'Spatial commands link location to behavior - advanced interaction');
        
        return {
            command,
            feedback: `Brilliant! You taught Aniota to come to (${x}, ${y}). Spatial commands are advanced UI!`,
            learningPoint: 'Combining location with action creates rich interaction vocabularies',
            nextStep: 'Try click-and-drag for directional "jump" command'
        };
    }

    processJumpCommand(data) {
        const command = 'jump';
        this.recordLearning(command, 'Gesture-based directional commands - sophisticated interaction design');
        
        return {
            command,
            feedback: 'Amazing! Gesture-based directional commands are sophisticated interaction design!',
            learningPoint: 'Vector input (direction + magnitude) creates natural control systems',
            nextStep: 'Move mouse close to Aniota to trigger proximity play behavior'
        };
    }

    processProximityCommand(data) {
        const command = 'play';
        this.recordLearning(command, 'Proximity-based interaction - ambient computing principles');
        
        return {
            command,
            feedback: 'Excellent! Proximity-based interaction demonstrates ambient computing principles!',
            learningPoint: 'Sensors and proximity create responsive, ambient interfaces',
            nextStep: 'You\'ve mastered the basic command set! Ready for advanced training?'
        };
    }

    recordLearning(command, principle) {
        if (!this.trainingSession.commandsLearned.includes(command)) {
            this.trainingSession.commandsLearned.push(command);
            this.trainingSession.successfulCommands++;
        }
        
        this.trainingSession.learningPoints.push({
            command,
            principle,
            timestamp: Date.now()
        });
        
        console.log(`📚 Learning recorded: ${command} - ${principle}`);
    }

    // Generate training progress report
    generateProgressReport() {
        if (!this.trainingSession) return null;
        
        const duration = Date.now() - this.trainingSession.startTime;
        const completionRate = this.trainingSession.commandsLearned.length / 5;
        
        return {
            sessionDuration: duration,
            commandsLearned: this.trainingSession.commandsLearned,
            totalClicks: this.trainingSession.clickCount,
            successRate: this.trainingSession.successfulCommands / this.trainingSession.clickCount,
            completionRate,
            learningPoints: this.trainingSession.learningPoints,
            nextLesson: this.getNextLesson()
        };
    }

    getNextLesson() {
        const lessons = Object.keys(this.lessons);
        const currentIndex = lessons.indexOf(this.trainingSession.currentLesson);
        return lessons[currentIndex + 1] || 'completed';
    }

    // Activate training academy (called by teacher mode)
    activate() {
        console.log('🎓 Activating Training Academy');
        return this.startTrainingAcademy();
    }

    // Deactivate training academy (called when leaving teacher mode)
    deactivate() {
        console.log('🎓 Deactivating Training Academy');
        return this.endTrainingSession();
    }

    // End training session
    endTrainingSession() {
        console.log('🎓 Ending training session');
        const report = this.generateProgressReport();
        
        this.isActive = false;
        this.trainingSession = null;
        
        if (this.trainingWindow) {
            this.trainingWindow.close();
            this.trainingWindow = null;
        }
        
        return report;
    }
}

module.exports = AniotaTrainingAcademy;

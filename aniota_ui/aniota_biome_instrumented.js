
const { logEntry, logExit, log } = require('..\..\execution_tracer');

const { BrowserWindow, screen, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

const { logEntry, logExit, logUnused, logPerf, log } = require('../../execution_tracer');
log('🚀 AniotaBiome module loaded', 'MODULE_LOAD');

class AniotaBiome {
    constructor() {
    logEntry('constructor', 'aniota_ui/biome/AniotaBiome.js');
    try {
        logEntry('constructor', 'AniotaBiome.js');
        
        this.characterData = null;
        this.characterWindow = null;
        this.uiElements = new Map();
        this.animationFrames = new Map(); // Initialize animation frames tracking
        
        // Training Academy state
        this.isInTrainingMode = false;
        this.trainingSession = null;
        this.trainingWindow = null;
        
        // Pet behavior state for clicker training
        this.petState = {
            currentCommand: 'idle',
            isTraining: false,
            targetX: null,
            targetY: null,
            jumpDirection: null,
            excitement: 0,
            attention: 0,
            lastClickTime: 0,
            mouseX: 0,
            mouseY: 0,
            proximityResponse: false
        };
        
        // Enhanced behavior state with purposeful behavior categories and backend integration
        this.behaviorState = {
            mode: 'observing', // Current behavior mode
            attentionLevel: 0, // 0-100
            idlePoints: 0,
            lastUserActivity: Date.now(),
            observationBuffer: [],
            
            // Backend system connections
            backendConnection: {
                baseUrl: 'http://localhost:8000/api',
                connected: false,
                lastSync: Date.now(),
                syncInterval: 5000, // 5 seconds
                retryCount: 0,
                maxRetries: 3
            },
            
            // Environmental context awareness (enhanced with backend data)
            environmentalContext: {
                timeOfDay: this.getTimeOfDay(),
                dayOfWeek: new Date().getDay(),
                dayOfYear: this.getDayOfYear(),
                season: this.getSeason(),
                isWeekend: this.isWeekend(),
                
                // Digital environment monitoring
                interactionRate: 0, // interactions per minute
                typingIntensity: 0, // keystrokes per minute
                clickIntensity: 0, // clicks per minute
                systemLoad: 'normal', // 'low', 'normal', 'high'
                activeApplications: [],
                
                // User energy estimation (enhanced with backend AI)
                userEnergyLevel: 'normal', // 'low', 'normal', 'high', 'excited', 'tired'
                userMoodEstimate: 'neutral', // 'happy', 'focused', 'frustrated', 'relaxed', 'stressed'
                sessionActivity: 'moderate', // 'light', 'moderate', 'intense'
                
                // Backend AI analysis integration
                tvmleVector: null, // Triadic Vector Mathematical Learning Engine data
                cafAnalysis: null, // Cognitive Architecture Framework insights
                microvibrationProfile: null, // Authentication and personality patterns
                learningContext: null // Current learning state from backend
            },
            
            // Contextual awareness (like a smart pet)
            userContext: {
                currentActivity: 'unknown', // 'typing', 'reading', 'browsing', 'idle', 'kitchen', 'bathroom'
                activityConfidence: 0,
                locationPattern: [], // Track where user typically goes
                timeOfDay: 'unknown', // 'morning', 'afternoon', 'evening', 'night'
                sessionDuration: 0,
                typingRhythm: 'normal' // 'fast', 'normal', 'slow', 'frustrated'
            },
            
            // Behavioral purposes and triggers
            behaviorCategories: {
                // CUTE BEHAVIORS - Just for charm and personality
                cute: {
                    enabled: true,
                    frequency: 0.1, // 10% chance
                    triggers: ['idle_long', 'user_return', 'reward_earned'],
                    actions: ['head_tilt', 'yawn', 'stretch', 'playful_bounce', 'curious_peek']
                },
                
                // PRE-INTERVENTION - Prepare user for learning
                preIntervention: {
                    enabled: true,
                    frequency: 0.8, // 80% chance when triggered
                    triggers: ['session_start', 'new_topic_detected', 'user_seems_distracted'],
                    actions: ['attention_getter', 'position_optimally', 'gentle_reminder', 'readiness_check']
                },
                
                // POST-INTERVENTION - Reinforce and reward learning
                postIntervention: {
                    enabled: true,
                    frequency: 0.9, // 90% chance when triggered
                    triggers: ['task_completed', 'learning_milestone', 'good_progress'],
                    actions: ['celebration', 'progress_acknowledgment', 'next_step_hint', 'reward_display']
                },
                
                // DURING LEARNING - Support active learning
                duringLearning: {
                    enabled: true,
                    frequency: 0.3, // 30% chance, don't interrupt too much
                    triggers: ['user_struggling', 'long_pause', 'error_pattern'],
                    actions: ['gentle_encouragement', 'hint_positioning', 'break_suggestion', 'technique_demo']
                },
                
                // ATTENTION SEEKING - Get user engagement
                attentionSeeking: {
                    enabled: true,
                    frequency: 0.6, // 60% chance when needed
                    triggers: ['user_distracted', 'important_notification', 'scheduled_break'],
                    actions: ['gentle_movement', 'color_pulse', 'proximity_approach', 'subtle_animation']
                },
                
                // CONTEXTUAL FOLLOWING - Smart pet-like responses
                contextualFollowing: {
                    enabled: true,
                    frequency: 0.7, // 70% chance when appropriate
                    triggers: ['user_activity_change', 'interesting_content', 'workflow_transition'],
                    actions: ['follow_to_relevant_area', 'stay_in_comfort_zone', 'anticipate_needs']
                }
            },
            
            // Pet-like intelligence tracking
            petIntelligence: {
                masterRoutines: new Map(), // Learn user's patterns like a pet
                favoriteSpots: [], // Where user likes Aniota to be
                avoidanceZones: [], // Where user gets annoyed by presence
                rewardAssociations: new Map(), // What actions get positive responses
                familiarityLevel: 0 // How well we "know" this user (0-100)
            },
            
            mouseTracker: {
                x: 0, y: 0,
                velocityX: 0, velocityY: 0,
                isMoving: false,
                lastUpdate: Date.now()
            }
        };
        
        // Digital pet intelligence - monitoring the "master" through interface
        this.digitalPetIntelligence = {
            // Context awareness - what is the user doing?
            currentContext: {
                activeApplication: '',
                windowTitle: '',
                activityType: 'unknown', // 'working', 'browsing', 'learning', 'idle', 'creating'
                focusLevel: 'normal', // 'deep_focus', 'distracted', 'break_time', 'frustrated'
                workPattern: 'unknown' // 'morning_person', 'night_owl', 'steady_worker', 'burst_worker'
            },
            
            // Master's behavioral patterns - like knowing your owner's habits
            masterProfile: {
                preferredWorkHours: [],
                typingRhythm: 'unknown', // 'fast', 'thoughtful', 'hunt_and_peck', 'professional'
                breakPatterns: [],
                attentionSpan: 0, // minutes
                stressIndicators: [],
                learningStyle: 'unknown' // 'visual', 'kinesthetic', 'analytical', 'creative'
            },
            
            // Recent observations - short term memory
            recentBehaviors: [],
            
            // Intervention triggers - when to act
            interventionTriggers: {
                inactivityThreshold: 300000, // 5 minutes
                frustrationDetected: false,
                breakTimeNeeded: false,
                learningOpportunity: false,
                celebrationMoment: false
            }
        };
        
        this.loadCharacterData();
    }
    
    loadCharacterData() {
    logEntry('loadCharacterData', 'aniota_ui/biome/AniotaBiome.js');
    try {
        try {
            const dataPath = path.join(__dirname, 'aniota_character.json');
            this.characterData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            console.log('🐠 Aniota character data loaded successfully');
        } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.error('❌ Failed to load character data:', error);
            this.characterData = this.getDefaultCharacterData();
        }
    }
    
    getDefaultCharacterData() {
    logEntry('getDefaultCharacterData', 'aniota_ui/biome/AniotaBiome.js');
    try {
        
    logExit('currentFunction', {
            character: { name: "Aniota", type: "learning_companion" },
            visual: { 
                base_shape: "sphere", 
                size: { width: 80, height: 80 },
                colors: { primary: "#9370DB", secondary: "#7B68EE" } // Medium purple and slate blue
            },
            behavior: { idle_positions: [{ x: "screen.width - 100", y: "20" }] }
        });
    return {
            character: { name: "Aniota", type: "learning_companion" },
            visual: { 
                base_shape: "sphere", 
                size: { width: 80, height: 80 },
                colors: { primary: "#9370DB", secondary: "#7B68EE" } // Medium purple and slate blue
            },
            behavior: { idle_positions: [{ x: "screen.width - 100", y: "20" }] }
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }
    
    // Backend integration methods - Connect to existing HCI monitoring and AI systems
    async initializeBackendConnection() {
    logEntry('initializeBackendConnection', 'aniota_ui/biome/AniotaBiome.js');
    try {
        console.log('🔗 Initializing backend connection to existing IX-TECH systems...');
        
        try {
            // Test connection to main backend
            const response = await fetch(`${this.behaviorState.backendConnection.baseUrl}/dev/status`);
            if (response.ok) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                this.behaviorState.backendConnection.connected = true;
                this.behaviorState.backendConnection.retryCount = 0;
                console.log('✅ Connected to IX-TECH backend successfully');
                
                // Start syncing with backend systems
                this.startBackendSync();
            }
        } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.warn('⚠️ Backend connection failed, running in offline mode:', error.message);
            this.behaviorState.backendConnection.connected = false;
            this.retryBackendConnection();
        }
    }
    
    async startBackendSync() {
    logEntry('startBackendSync', 'aniota_ui/biome/AniotaBiome.js');
    try {
        if (!this.behaviorState.backendConnection.connected) return;
        
        // Sync with backend every 5 seconds
        setInterval(async () => {
            try {
                await this.syncWithBackendSystems();
            } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
                console.warn('Backend sync error:', error.message);
                this.retryBackendConnection();
            }
        }, this.behaviorState.backendConnection.syncInterval);
    }
    
    async syncWithBackendSystems() {
    logEntry('syncWithBackendSystems', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const { baseUrl } = this.behaviorState.backendConnection;
        
        try {
            // Get TVMLE (Triadic Vector Mathematical Learning Engine) data
            const tvmleResponse = await fetch(`${baseUrl}/tvmle/stats`);
            if (tvmleResponse.ok) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                this.behaviorState.environmentalContext.tvmleVector = await tvmleResponse.json();
            }
            
            // Get CAF (Cognitive Architecture Framework) status
            const cafResponse = await fetch(`${baseUrl}/caf/status`);
            if (cafResponse.ok) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                this.behaviorState.environmentalContext.cafAnalysis = await cafResponse.json();
            }
            
            // Update learning context and adjust behaviors accordingly
            this.updateLearningContext();
            
            this.behaviorState.backendConnection.lastSync = Date.now();
            
        } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            throw new Error(`Backend sync failed: ${error.message}`);
        }
    }
    
    updateLearningContext() {
    logEntry('updateLearningContext', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const { tvmleVector, cafAnalysis } = this.behaviorState.environmentalContext;
        
        if (tvmleVector) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            // Adjust behavior based on learning velocity and patterns
            if (tvmleVector.learning_velocity > 1.0) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                this.setBehaviorMode('encouraging'); // User is learning well
            } else if (tvmleVector.correlation_patterns < 50) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                this.setBehaviorMode('supportive'); // User might need help
            }
        }
        
        if (cafAnalysis && cafAnalysis.status === 'initialized') {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            // Backend cognitive systems are active - Aniota can be more intelligent
            this.behaviorState.environmentalContext.learningContext = 'active_ai_support';
        } else {
            this.behaviorState.environmentalContext.learningContext = 'basic_support';
        }
    }
    
    async sendLearningEvent(eventType, data = {
    logEntry('sendLearningEvent', 'aniota_ui/biome/AniotaBiome.js');
    try {}) {
        if (!this.behaviorState.backendConnection.connected) return;
        
        try {
            const learningEvent = {
                event_type: eventType,
                timestamp: Date.now() / 1000,
                x: this.position.x,
                y: this.position.y,
                user_data: data
            };
            
            const response = await fetch(`${this.behaviorState.backendConnection.baseUrl}/tvmle/learn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(learningEvent)
            });
            
            if (response.ok) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                const result = await response.json();
                console.log('📊 Learning event processed by backend:', result);
                
                // Use backend analysis to adjust behavior
                if (result.correlation_analysis?.pattern_detected) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    this.triggerPatternRecognitionBehavior();
                }
            }
        } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.warn('Failed to send learning event to backend:', error.message);
        }
    }
    
    retryBackendConnection() {
    logEntry('retryBackendConnection', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const connection = this.behaviorState.backendConnection;
        
        if (connection.retryCount < connection.maxRetries) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            connection.retryCount++;
            
            setTimeout(() => {
                console.log('Retrying backend connection (' + connection.retryCount + '/' + connection.maxRetries + ')...');
                this.initializeBackendConnection();
            }, 5000 * connection.retryCount); // Exponential backoff
        } else {
            console.log('🔄 Max retries reached, continuing in offline mode');
        }
    }
    
    // Enhanced behavior methods that leverage backend intelligence
    triggerPatternRecognitionBehavior() {
    logEntry('triggerPatternRecognitionBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Celebrate when backend detects learning patterns
        this.performSpecialAnimation('pattern_recognition');
        this.changeMoodIndicator('excited');
        
        // Send positive reinforcement
        setTimeout(() => {
            this.changeMoodIndicator('encouraging');
        }, 2000);
    }
    
    async requestSocraticQuestion() {
    logEntry('requestSocraticQuestion', 'aniota_ui/biome/AniotaBiome.js');
    try {
        if (!this.behaviorState.backendConnection.connected) 
    logExit('currentFunction', null);
    return null;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        
        try {
            const context = {
                user_state: this.behaviorState.environmentalContext.userMoodEstimate,
                learning_context: this.behaviorState.environmentalContext.learningContext,
                session_activity: this.behaviorState.environmentalContext.sessionActivity
            };
            
            const response = await fetch(`${this.behaviorState.backendConnection.baseUrl}/sie/question`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(context)
            });
            
            if (response.ok) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                const question = await response.json();
                console.log('🤔 Socratic question from SIE:', question);
                
    logExit('currentFunction', question);
    return question;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            }
        } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.warn('Failed to get Socratic question from backend:', error.message);
        }
        
        
    logExit('currentFunction', null);
    return null;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    async showQuestioningInterface() {
    logEntry('showQuestioningInterface', 'aniota_ui/biome/AniotaBiome.js');
    try {
        console.log('🤔 Opening Aniota\'s questioning interface...');
        
        // Get a Socratic question from the SIE system
        const question = await this.requestSocraticQuestion();
        
        if (question) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.log('🎓 SIE Question:', question.question);
            // Create a new questioning window
            this.createQuestioningWindow(question);
        } else {
            // Fallback to offline questioning mode
            console.log('📚 Offline mode: Using built-in learning prompts');
            const fallbackQuestion = this.getFallbackQuestion();
            this.createQuestioningWindow(fallbackQuestion);
        }
        
        // Show that Aniota is in questioning mode
        this.changeMoodIndicator('thoughtful');
        this.performSpecialAnimation('questioning');
    }

    createQuestioningWindow(questionData) {
    logEntry('createQuestioningWindow', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const { BrowserWindow } = require('electron');
        
        // Create questioning interface window
        const questionWindow = new BrowserWindow({
            width: 500,
            height: 400,
            frame: true,
            resizable: true,
            alwaysOnTop: true,
            title: 'Aniota\'s Learning Questions',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        // Generate questioning interface HTML
        const questioningHTML = this.generateQuestioningHTML(questionData);
        questionWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(questioningHTML));
        
        console.log('🖥️ Questioning interface window created');
    }

    generateQuestioningHTML(questionData) {
    logEntry('generateQuestioningHTML', 'aniota_ui/biome/AniotaBiome.js');
    try {
        
    logExit('currentFunction', `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Aniota's Learning Questions</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Aniota's Learning Questions</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                    box-sizing: border-box;
                }
                .container {
                    max-width: 450px;
                    margin: 0 auto;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .aniota-icon {
                    font-size: 2em;
                    margin-bottom: 10px;
                }
                .question-card {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 25px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    margin-bottom: 20px;
                }
                .question-text {
                    font-size: 1.1em;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .buttons {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .btn {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 10px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9em;
                }
                .btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }
                .response-area {
                    margin-top: 20px;
                }
                .text-input {
                    width: 100%;
                    min-height: 80px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                    color: white;
                    padding: 15px;
                    font-size: 1em;
                    resize: vertical;
                    box-sizing: border-box;
                }
                .text-input::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="aniota-icon">🌟</div>
                    <h2>Learning with Aniota</h2>
                    <p>Let's explore ideas together!</p>
                </div>
                
                <div class="question-card">
                    <div class="question-text">
                        ${questionData.question || questionData.text || 'What would you like to explore today?'}
                    </div>
                    
                    <div class="buttons">
                        <button class="btn" onclick="respondQuick('Tell me more')">Tell me more</button>
                        <button class="btn" onclick="respondQuick('I need help')">I need help</button>
                        <button class="btn" onclick="respondQuick('Let me think')">Let me think</button>
                        <button class="btn" onclick="showTextInput()">Type my thoughts</button>
                    </div>
                    
                    <div class="response-area" id="responseArea" style="display: none;">
                        <textarea class="text-input" placeholder="Share your thoughts here..." id="userResponse"></textarea>
                        <div style="margin-top: 10px;">
                            <button class="btn" onclick="submitResponse()">Share with Aniota</button>
                            <button class="btn" onclick="getNewQuestion()">Ask me something else</button>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                function respondQuick(response) {
    logEntry('respondQuick', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    console.log('🎓 User quick response:', response);
                    // This would send the response back to the main process
                    getNewQuestion();
                }

                function showTextInput() {
    logEntry('showTextInput', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    document.getElementById('responseArea').style.display = 'block';
                }

                function submitResponse() {
    logEntry('submitResponse', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    const response = document.getElementById('userResponse').value;
                    console.log('🎓 User detailed response:', response);
                    // This would send the response back for SIE analysis
                    getNewQuestion();
                }

                function getNewQuestion() {
    logEntry('getNewQuestion', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    console.log('🔄 Requesting new question...');
                    // In full implementation, this would request a new question from SIE
                    window.close();
                }
            </script>
        </body>
        </html>`;
    }

    getFallbackQuestion() {
    logEntry('getFallbackQuestion', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const fallbackQuestions = [
            { question: "What's something new you'd like to learn about today?" },
            { question: "Can you think of a problem you'd like to solve?" },
            { question: "What makes you curious right now?" },
            { question: "If you could ask an expert one question, what would it be?" },
            { question: "What's the most interesting thing you've discovered recently?" }
        ];
        
        
    logExit('currentFunction', fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]);
    return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // ========== ANIOTA TRAINING ACADEMY ==========
    // Meta-learning system: Users think they're training Aniota, 
    // but they're actually learning behavioral psychology, command structures, and learning principles

    async handleTrainingClick() {
    logEntry('handleTrainingClick', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Enhanced click handler that determines if this is training or questioning
        if (this.isInTrainingMode) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            await this.processTrainingClick();
        } else {
            // Start Training Academy introduction
            await this.startTrainingAcademy();
        }
    }

    async startTrainingAcademy() {
    logEntry('startTrainingAcademy', 'aniota_ui/biome/AniotaBiome.js');
    try {
        console.log('🎓 Launching Aniota Training Academy...');
        this.isInTrainingMode = true;
        this.trainingSession = {
            startTime: Date.now(),
            commandsLearned: [],
            clickCount: 0,
            successfulCommands: 0,
            currentLesson: 'introduction'
        };

        // Create Training Academy interface
        await this.createTrainingAcademyWindow();
    }

    async createTrainingAcademyWindow() {
    logEntry('createTrainingAcademyWindow', 'aniota_ui/biome/AniotaBiome.js');
    try {
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

        const trainingHTML = this.generateTrainingAcademyHTML();
        this.trainingWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(trainingHTML));
        
        console.log('🎓 Training Academy window created');
    }

    generateTrainingAcademyHTML() {
    logEntry('generateTrainingAcademyHTML', 'aniota_ui/biome/AniotaBiome.js');
    try {
        
    logExit('currentFunction', `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Aniota Training Academy</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Aniota Training Academy</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
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
                    <h3>Welcome, Trainer! 🎯</h3>
                    <p>You're about to train Aniota to respond to your commands. But here's the secret: 
                    <strong>while you train her, you'll master behavioral psychology, command structures, 
                    and learning principles yourself!</strong></p>
                    
                    <div class="psychology-note">
                        <strong>🧠 Learning Principle:</strong> The best way to learn something is to teach it. 
                        By training Aniota, you'll internalize how commands, timing, and rewards create lasting behavioral patterns.
                    </div>
                </div>

                <div class="lesson-card">
                    <h3>Basic Commands to Master 📚</h3>
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
                    <h3>What You'll Actually Learn 🚀</h3>
                    <ul>
                        <li><strong>Behavioral Psychology:</strong> Action → Response → Reinforcement cycles</li>
                        <li><strong>Command Design:</strong> How to create intuitive interaction patterns</li>
                        <li><strong>Timing & Feedback:</strong> Why immediate responses matter</li>
                        <li><strong>Pattern Recognition:</strong> Building consistent interaction vocabularies</li>
                        <li><strong>User Experience:</strong> Designing natural, predictable interfaces</li>
                    </ul>
                </div>

                <button class="start-btn" onclick="startTraining()">Begin Training Session 🎯</button>
            </div>

            <script>
                function startTraining() {
    logEntry('startTraining', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    // Close training window and begin hands-on training
                    alert('Training Academy Starting! Watch Aniota closely - she\\'s ready to learn your commands!');
                    window.close();
                }
            </script>
        </body>
        </html>`;
    }

    async processTrainingClick() {
    logEntry('processTrainingClick', 'aniota_ui/biome/AniotaBiome.js');
    try {
        this.trainingSession.clickCount++;
        
        // Implement "sit" command - Aniota stops and stays put
        console.log('🐕 Training Click: Teaching "Sit" command');
        this.petState.currentCommand = 'sit';
        this.petState.isTraining = true;
        
        // Provide feedback about the training
        await this.showTrainingFeedback('sit', 'Aniota is learning to sit! Click the desktop to teach her "come".');
    }

    async teachComeCommand(x, y) {
    logEntry('teachComeCommand', 'aniota_ui/biome/AniotaBiome.js');
    try {
        console.log(`🐕 Teaching "Come" command to position (${x}, ${y})`);
        this.petState.currentCommand = 'come';
        this.petState.targetX = x;
        this.petState.targetY = y;
        
        this.trainingSession.commandsLearned.push('come');
        this.trainingSession.successfulCommands++;
        
        await this.showTrainingFeedback('come', `Excellent! Aniota is learning to come when called. Try click-and-drag to teach "jump"!`);
    }

    async teachJumpCommand(startX, startY, endX, endY) {
    logEntry('teachJumpCommand', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const direction = Math.atan2(endY - startY, endX - startX);
        console.log(`🐕 Teaching "Jump" command in direction ${direction}`);
        
        this.petState.currentCommand = 'jump';
        this.petState.jumpDirection = direction;
        
        this.trainingSession.commandsLearned.push('jump');
        this.trainingSession.successfulCommands++;
        
        await this.showTrainingFeedback('jump', `Amazing! Aniota learned to jump on command. You're mastering behavioral training!`);
    }

    async showTrainingFeedback(command, message) {
    logEntry('showTrainingFeedback', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Create a small feedback bubble that appears near Aniota
        console.log(`🎓 Training Feedback [${command}]: ${message}`);
        
        // Show feedback in character window (temporary implementation)
        if (this.characterWindow) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            // Could enhance this to show actual feedback bubbles
            console.log('📚 Training progress updated');
        }
    }

    async createBiome() {
    logEntry('createBiome', 'aniota_ui/biome/AniotaBiome.js');
    try {
        logEntry('createBiome', 'AniotaBiome.js');
        
        if (this.isInitialized) return;
        
        console.log('🌊 Creating Aniota\'s aquarium biome...');
        
        try {
            // Create transparent, frameless character window
            this.characterWindow = new BrowserWindow({
                width: this.characterData.visual.size.width + 20, // Padding for effects
                height: this.characterData.visual.size.height + 20,
                frame: false,
                transparent: true,
                alwaysOnTop: true,
                skipTaskbar: true,
                resizable: false,
                focusable: false,
                show: true, // Explicitly show the window
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                }
            });
            
            console.log('🪟 Character window created:', {
                id: this.characterWindow.id,
                bounds: this.characterWindow.getBounds(),
                visible: this.characterWindow.isVisible(),
                minimized: this.characterWindow.isMinimized()
            });
            
            // Position Aniota based on character data
            console.log('🔧 Step 1: Positioning character...');
            this.positionCharacter();
            
            // Create the character visually using canvas/webgl
            console.log('🔧 Step 2: Rendering character...');
            await this.renderCharacter();
            
            // Start behavior systems
            console.log('🔧 Step 3: Starting behavior engine...');
            this.startBehaviorEngine();
            
            console.log('🔧 Step 4: Starting animation engine...');
            this.startAnimationEngine();
            
            console.log('🔧 Step 5: Starting advanced behaviors...');
            this.startAdvancedBehaviors();
            
            // Initialize connection to existing backend AI systems
            console.log('🔧 Step 6: Initializing backend connection...');
            await this.initializeBackendConnection();
            
            this.isInitialized = true;
            console.log('✨ Aniota is now living on your desktop!');
            
            // Final status check
            console.log('🔍 Final window status:', {
                isDestroyed: this.characterWindow.isDestroyed(),
                isVisible: this.characterWindow.isVisible(),
                position: this.characterWindow.getPosition(),
                bounds: this.characterWindow.getBounds()
            });
        } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.error('💥 CRITICAL ERROR in createBiome:', error);
            console.error('💥 Error stack:', error.stack);
            console.error('💥 This is why Symbie behaviors never execute!');
        }
    }
    
    positionCharacter() {
    logEntry('positionCharacter', 'aniota_ui/biome/AniotaBiome.js');
    try {
        console.log('📍 Positioning character...');
        
        const displays = screen.getAllDisplays();
        const primary = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primary.workAreaSize;
        
        console.log('Primary display: ' + screenWidth + 'x' + screenHeight);
        
        // Safe position calculation from character data
        const defaultPos = this.characterData.behavior.idle_positions[0];
        console.log('📋 Default position from data:', defaultPos);
        
        const x = this.calculatePosition(defaultPos.x, screenWidth, screenHeight);
        const y = this.calculatePosition(defaultPos.y, screenWidth, screenHeight);
        
        console.log('Calculated position: (' + x + ', ' + y + ')');
        
        this.characterWindow.setPosition(x, y);
        
        // Verify position was set
        const actualPosition = this.characterWindow.getPosition();
        console.log('Window positioned at (' + actualPosition[0] + ', ' + actualPosition[1] + ')');
        console.log('Aniota positioned at (' + x + ', ' + y + ')');
    }
    
    async renderCharacter() {
    logEntry('renderCharacter', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // 🔍 EXECUTION TRACER
        if (global.executionTracer) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
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
                }
                #character-canvas {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            </style>
        </head>
        <body>
            <canvas id="character-canvas"></canvas>
            <script>
                const { ipcRenderer } = require('electron');
                
                // Canvas-based character rendering
                const canvas = document.getElementById('character-canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size
                canvas.width = ${this.characterData.visual.size.width + 20};
                canvas.height = ${this.characterData.visual.size.height + 20};
                
                // Saturn ring system - maps activity states to ring colors
                function drawSaturnRings(centerX, centerY, time) {
    logEntry('drawSaturnRings', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    const rings = [
                        { 
                            radius: 35, 
                            thickness: 3, 
                            rotation: time * 0.3,
                            color: getRingColor('thinking'), // Blue-green for cognitive activity
                            alpha: 0.7 
                        },
                        { 
                            radius: 45, 
                            thickness: 2, 
                            rotation: time * -0.2,
                            color: getRingColor('processing'), // Purple for processing
                            alpha: 0.6 
                        },
                        { 
                            radius: 55, 
                            thickness: 4, 
                            rotation: time * 0.15,
                            color: getRingColor('learning'), // Gold for learning activity
                            alpha: 0.5 
                        }
                    ];
                    
                    rings.forEach(ring => {
                        ctx.save();
                        ctx.translate(centerX, centerY);
                        ctx.rotate(ring.rotation);
                        ctx.globalAlpha = ring.alpha;
                        
                        // Create ring gradient
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
                
                // Map activity states to ring colors - Soft Nebula Palette
                function getRingColor(activityState) {
    logEntry('getRingColor', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    const stateColors = {
                        'thinking': '#7B68EE',      // Medium slate blue - cognitive activity
                        'processing': '#9370DB',    // Medium purple - data processing  
                        'learning': '#BA55D3',      // Medium orchid - active learning
                        'questioning': '#DA70D6',   // Orchid - questioning mode
                        'responding': '#FF69B4',    // Hot pink - generating responses
                        'idle': '#6495ED',          // Cornflower blue - idle state
                        'excited': '#FF6347',       // Tomato red - high engagement
                        'focused': '#8A2BE2'        // Blue violet - focused attention
                    };
                    
    logExit('currentFunction', stateColors[activityState] || stateColors['idle']);
    return stateColors[activityState] || stateColors['idle'];
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
                }
                
                // Character rendering function with layered approach
                function drawAniota(animationPhase = 0) {
    logEntry('drawAniota', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const time = animationPhase * 0.1;
                    
                    // Layer 1: Draw nebula background
                    drawNebulaBackground(centerX, centerY, time);
                    
                    // Layer 2: Draw Saturn rings (activity color indicators)
                    drawSaturnRings(centerX, centerY, time);
                    
                    // Layer 3: Draw pixie sprite on top
                    drawPixieSprite(centerX, centerY, time);
                }
                
                // Layer 1: Nebula background
                function drawNebulaBackground(centerX, centerY, time) {
    logEntry('drawNebulaBackground', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    // Create soft nebula glow effect
                    const radius = 30;
                    const breathe = Math.sin(time * 0.5) * 3;
                    const nebulaRadius = radius + breathe;
                    
                    // Create radial gradient for nebula effect
                    const gradient = ctx.createRadialGradient(centerX - 10, centerY - 10, 0, centerX, centerY, nebulaRadius);
                    gradient.addColorStop(0, '#9370DB40'); // Medium purple center
                    gradient.addColorStop(0.3, '#7B68EE60'); // Slate blue
                    gradient.addColorStop(0.6, '#6495ED40'); // Cornflower blue
                    gradient.addColorStop(0.8, '#FF69B420'); // Hint of pink
                    gradient.addColorStop(1, 'transparent');
                    
                    ctx.beginPath();
                    ctx.fillStyle = gradient;
                    ctx.arc(centerX, centerY, nebulaRadius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Add subtle nebula sparkles
                    ctx.fillStyle = '#E6E6FA40'; // Lavender sparkles
                    for (let i = 0; i < 8; i++) {
    logEntry('for', 'aniota_ui/biome/AniotaBiome.js');
    try {
                        const angle = (time * 0.2 + i * 0.785) % (Math.PI * 2);
                        const sparkX = centerX + Math.cos(angle) * (nebulaRadius * 0.7);
                        const sparkY = centerY + Math.sin(angle) * (nebulaRadius * 0.7);
                        ctx.beginPath();
                        ctx.arc(sparkX, sparkY, 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                // Layer 3: Pixie sprite rendering
                let currentDirection = 'front'; // Track current direction
                let pixieSprites = {}; // Cache for loaded sprites
                
                function drawPixieSprite(centerX, centerY, time) {
    logEntry('drawPixieSprite', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    // Gentle hovering motion - slow vertical bobbing like floating
                    const hover = Math.sin(time * 0.4) * 3; // 3 pixel hover range, slow frequency
                    const spriteY = centerY + hover;
                    
                    // Slight horizontal sway for more natural hovering
                    const sway = Math.sin(time * 0.3) * 1; // 1 pixel horizontal sway
                    const spriteX = centerX + sway;
                    
                    // Determine sprite direction based on movement or state
                    const spriteDirection = getCurrentSpriteDirection();
                    
                    // Load and draw sprite (placeholder for now)
                    if (!pixieSprites[spriteDirection]) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                        loadPixieSprite(spriteDirection);
                    }
                    
                    // Draw sprite if loaded, otherwise draw placeholder
                    if (pixieSprites[spriteDirection] && pixieSprites[spriteDirection].complete) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                        const sprite = pixieSprites[spriteDirection];
                        const spriteSize = 60; // Adjust size as needed
                        ctx.drawImage(
                            sprite, 
                            spriteX - spriteSize/2, 
                            spriteY - spriteSize/2, 
                            spriteSize, 
                            spriteSize
                        );
                    } else {
                        // Placeholder while sprite loads
                        drawPixiePlaceholder(spriteX, spriteY, time);
                    }
                }
                
                function getCurrentSpriteDirection() {
    logEntry('getCurrentSpriteDirection', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    // This will be enhanced later with actual movement tracking
                    // For now, 
    logExit('currentFunction', a direction based on simple logic
                    const directions = ['front', 'left', 'right', 'back']);
    return a direction based on simple logic
                    const directions = ['front', 'left', 'right', 'back'];
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
                    const timeBasedIndex = Math.floor(Date.now() / 3000) % directions.length;
                    
    logExit('currentFunction', directions[timeBasedIndex]);
    return directions[timeBasedIndex];
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
} // Cycle through directions for testing
                }
                
                function loadPixieSprite(direction) {
    logEntry('loadPixieSprite', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    const sprite = new Image();
                    sprite.onload = function() {
    logEntry('function', 'aniota_ui/biome/AniotaBiome.js');
    try {
                        console.log(\`Pixie sprite loaded: \${direction}\`);
                    };
                    sprite.onerror = function() {
    logEntry('function', 'aniota_ui/biome/AniotaBiome.js');
    try {
                        console.log(\`Failed to load pixie sprite: \${direction}\`);
                    };
                    
                    // Map direction to actual filename
                    const spriteFiles = {
                        'front': 'aniota_pixie_front.png',
                        'back': 'aniota_pixie_back.png', 
                        'left': 'aniota_pixie_left.png',
                        'right': 'aniota_pixie_right.png',
                        'front_fly': 'aniota_pixie_front_fly.png'
                    };
                    
                    const filename = spriteFiles[direction] || spriteFiles['front'];
                    sprite.src = \`../images/\${filename}\`;
                    pixieSprites[direction] = sprite;
                }
                
                function drawPixiePlaceholder(centerX, centerY, time) {
    logEntry('drawPixiePlaceholder', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    // Simple pixie placeholder while sprites load with gentle animation
                    
                    // Head
                    ctx.fillStyle = '#FF69B4'; // Hot pink
                    ctx.beginPath();
                    ctx.arc(centerX, centerY - 5, 8, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Body
                    ctx.fillStyle = '#DA70D6'; // Orchid
                    ctx.fillRect(centerX - 4, centerY, 8, 12);
                    
                    // Animated wings with gentle fluttering
                    const wingFlutter = Math.sin(time * 2) * 0.2; // Fast wing flutter
                    ctx.fillStyle = '#E6E6FA80'; // Semi-transparent lavender wings
                    ctx.save();
                    
                    // Left wing
                    ctx.translate(centerX - 8, centerY + 2);
                    ctx.rotate(-0.3 + wingFlutter);
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 6, 10, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    
                    // Right wing
                    ctx.save();
                    ctx.translate(centerX + 8, centerY + 2);
                    ctx.rotate(0.3 - wingFlutter);
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 6, 10, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                
                // Animation loop
                let frame = 0;
                let lastDebugTime = 0;
                
                function animate() {
    logEntry('animate', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    drawAniota(frame);
                    frame++;
                    
                    // Debug logging every 120 frames (about 2 seconds at 60fps)
                    if (frame % 120 === 0) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                        const now = Date.now();
                        const fps = 120000 / (now - lastDebugTime) || 0;
                        console.log('Animation frame ' + frame + ', estimated FPS: ' + fps.toFixed(1));
                        console.log('Canvas size: ' + canvas.width + 'x' + canvas.height);
                        console.log('Canvas visible: ' + canvas.offsetWidth + 'x' + canvas.offsetHeight);
                        lastDebugTime = now;
                    }
                    
                    requestAnimationFrame(animate);
                }
                
                // Start animation
                console.log('Starting Aniota animation loop...');
                animate();
                
                // Click interaction
                canvas.addEventListener('click', () => {
                    ipcRenderer.send('character-clicked');
                    
                    // Pulse effect
                    canvas.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        canvas.style.transform = 'scale(1)';
                    }, 200);
                });
                
                // Hover effects - Nebula theme
                canvas.addEventListener('mouseenter', () => {
                    canvas.style.filter = 'drop-shadow(0 0 15px rgba(186, 85, 211, 0.8))'; // Medium orchid glow
                });
                
                canvas.addEventListener('mouseleave', () => {
                    canvas.style.filter = 'drop-shadow(0 0 5px rgba(147, 112, 219, 0.4))'; // Medium purple glow
                });
            </script>
        </body>
        </html>`;
        
        // Load the character into the window
        this.characterWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    }
    
    startBehaviorEngine() {
    logEntry('startBehaviorEngine', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // 🔍 EXECUTION TRACER
        if (global.executionTracer) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            global.executionTracer.trace('startBehaviorEngine', 'startBehaviorEngine');
        }
        
        console.log('Starting Aniota pet behavior engine...');
        
        // Pet state variables
        this.petState = {
            mode: 'following', // 'following', 'sitting', 'playing', 'jumping', 'prancing'
            attention: 0.5, // 0-1 how much attention user is giving
            excitement: 0.3, // 0-1 how excited Aniota is
            lastInteraction: Date.now(),
            mousePosition: { x: 0, y: 0 },
            targetPosition: null,
            isMoving: false,
            clickCount: 0,
            lastClickTime: 0
        };
        
        // Track mouse movement globally
        this.initializeMouseTracking();
        
        // Pet behavior loop - efficient polling unless in training
        const petBehaviorLoop = setInterval(() => {
            this.updatePetBehavior();
        }, this.petState.isInTraining ? 500 : 60000); // 500ms during training, 1 minute normally
        
        console.log('Pet behavior engine active - efficient mode (1min polling, 500ms during training)');
    }
    
    initializeMouseTracking() {
    logEntry('initializeMouseTracking', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Track mouse globally using Electron's screen API
        const { screen } = require('electron');
        
        // Global mouse tracking
        setInterval(() => {
            const mousePos = screen.getCursorScreenPoint();
            this.petState.mousePosition = mousePos;
            
            // Calculate distance from Aniota to mouse
            const aniotaPos = this.characterWindow.getPosition();
            const distance = Math.sqrt(
                Math.pow(mousePos.x - aniotaPos[0], 2) + 
                Math.pow(mousePos.y - aniotaPos[1], 2)
            );
            
            // Update attention based on proximity
            this.updateAttentionLevel(distance);
        }, 50); // Very responsive mouse tracking
    }
    
    updateAttentionLevel(distance) {
    logEntry('updateAttentionLevel', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const maxAttentionDistance = 200; // pixels
        const proximity = Math.max(0, 1 - (distance / maxAttentionDistance));
        
        // Smooth attention changes
        this.petState.attention = this.petState.attention * 0.9 + proximity * 0.1;
        
        // Update excitement based on attention
        if (this.petState.attention > 0.7) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.petState.excitement = Math.min(1, this.petState.excitement + 0.02);
        } else {
            this.petState.excitement = Math.max(0, this.petState.excitement - 0.01);
        }
    }
    
    updatePetBehavior() {
    logEntry('updatePetBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const now = Date.now();
        const timeSinceInteraction = now - this.petState.lastInteraction;
        
        switch (this.petState.mode) {
    logEntry('switch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            case 'following':
                this.followingBehavior();
                break;
            case 'sitting':
                this.sittingBehavior(timeSinceInteraction);
                break;
            case 'playing':
                this.playingBehavior();
                break;
            case 'prancing':
                this.prancingBehavior();
                break;
            case 'jumping':
                this.jumpingBehavior();
                break;
        }
        
        // Auto-
    logExit('currentFunction', to following if neglected too long
        if (timeSinceInteraction > 30000 && this.petState.mode === 'sitting') {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js'));
    return to following if neglected too long
        if (timeSinceInteraction > 30000 && this.petState.mode === 'sitting') {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    try {
            this.petState.mode = 'following';
            console.log('🐕 Aniota got lonely and started following again');
        }
    }
    
    followingBehavior() {
    logEntry('followingBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        if (this.petState.attention > 0.7 && this.petState.excitement > 0.6) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            // High attention + excitement = prancing time!
            this.petState.mode = 'prancing';
            return;
        }
        
        // Gentle following behavior - pace user movement
        const mousePos = this.petState.mousePosition;
        const aniotaPos = this.characterWindow.getPosition();
        const distance = Math.sqrt(
            Math.pow(mousePos.x - aniotaPos[0], 2) + 
            Math.pow(mousePos.y - aniotaPos[1], 2)
        );
        
        // Follow at a comfortable distance
        if (distance > 150) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.gentleMoveTo(mousePos.x - 100, mousePos.y - 50);
        }
    }
    
    prancingBehavior() {
    logEntry('prancingBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Excited bouncing and circling when user is close
        const time = Date.now() * 0.003;
        const mousePos = this.petState.mousePosition;
        
        // Circle around mouse position
        const radius = 80 + Math.sin(time * 2) * 20;
        const angle = time;
        const targetX = mousePos.x + Math.cos(angle) * radius;
        const targetY = mousePos.y + Math.sin(angle) * radius;
        
        this.bounceMoveTo(targetX, targetY);
        
        // Exit prancing if attention drops
        if (this.petState.attention < 0.5) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.petState.mode = 'following';
        }
    }
    
    sittingBehavior(timeSinceInteraction) {
    logEntry('sittingBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Stay put, just gentle breathing
        // Maybe occasionally look toward mouse if it's close
        
        if (this.petState.attention > 0.8) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            // User came back close - get excited but stay sitting
            this.petState.excitement = Math.min(1, this.petState.excitement + 0.05);
        }
    }
    
    playingBehavior() {
    logEntry('playingBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // This mode could be for specific games/interactions
        // For now, just bounce around the current area
        const time = Date.now() * 0.002;
        const aniotaPos = this.characterWindow.getPosition();
        
        const bounceX = aniotaPos[0] + Math.sin(time) * 30;
        const bounceY = aniotaPos[1] + Math.cos(time * 1.3) * 20;
        
        this.characterWindow.setPosition(Math.round(bounceX), Math.round(bounceY));
    }
    
    jumpingBehavior() {
    logEntry('jumpingBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Execute jump to target, then 
    logExit('currentFunction', to following
        if (this.petState.targetPosition) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js'));
    return to following
        if (this.petState.targetPosition) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    try {
            this.jumpTo(this.petState.targetPosition.x, this.petState.targetPosition.y);
            this.petState.targetPosition = null;
            this.petState.mode = 'following';
        }
    }
    
    gentleMoveTo(x, y) {
    logEntry('gentleMoveTo', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Smooth, pet-like movement - not instant
        const aniotaPos = this.characterWindow.getPosition();
        const speed = 0.1; // Gentle movement speed
        
        const newX = aniotaPos[0] + (x - aniotaPos[0]) * speed;
        const newY = aniotaPos[1] + (y - aniotaPos[1]) * speed;
        
        this.characterWindow.setPosition(Math.round(newX), Math.round(newY));
    }
    
    bounceMoveTo(x, y) {
    logEntry('bounceMoveTo', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Bouncy, excited movement for prancing
        const aniotaPos = this.characterWindow.getPosition();
        const speed = 0.15; // Slightly faster for excitement
        
        const newX = aniotaPos[0] + (x - aniotaPos[0]) * speed;
        const newY = aniotaPos[1] + (y - aniotaPos[1]) * speed;
        
        // Add bounce effect
        const bounce = Math.sin(Date.now() * 0.01) * 5;
        
        this.characterWindow.setPosition(Math.round(newX), Math.round(newY + bounce));
    }
    
    jumpTo(x, y) {
    logEntry('jumpTo', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Quick jump movement
        this.characterWindow.setPosition(x, y);
        console.log('🦘 Aniota jumped to (' + x + ', ' + y + ')');
    }

    startAnimationEngine() {
    logEntry('startAnimationEngine', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // 🔍 EXECUTION TRACER
        if (global.executionTracer) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            global.executionTracer.trace('startAnimationEngine', 'startAnimationEngine');
        }
        
        console.log('Starting animation engine...');
        
        // Animation cycles based on character data
        this.animationFrames.set('heartbeat', setInterval(() => {
            // Silent heartbeat - just pulse the character without console spam
            this.pulseCharacter();
        }, this.characterData.visual.animations.heartbeat.duration));
        
        console.log('Animation engine started with heartbeat interval:', this.characterData.visual.animations.heartbeat.duration);
    }
    
    evaluateBehavior() {
    logEntry('evaluateBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        try {
            // Check for learning intervention opportunities every behavior cycle
            this.detectLearningNeeds();
            
            // Use dynamic movement chance based on behavior mode
            const moveChance = Math.random();
            const currentMovementChance = this.movementChance || 0.15; // Default 15%
            
            console.log('Move chance roll:', moveChance, 'vs threshold:', currentMovementChance);
            
            if (moveChance < currentMovementChance) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                console.log('Aniota decided to move to a new position');
                this.moveToRandomPosition();
            }
        } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.error('Error in evaluateBehavior:', error.message);
            // Don't throw - just log and continue
        }
    }
    
    pulseCharacter() {
    logEntry('pulseCharacter', 'aniota_ui/biome/AniotaBiome.js');
    try {
        if (!this.characterWindow) return;
        
        const { scale_range } = this.characterData.visual.animations.heartbeat;
        const [min, max] = scale_range;
        
        // Subtle heartbeat effect
        this.characterWindow.webContents.executeJavaScript(`
            document.body.style.transform = 'scale(${max})';
            setTimeout(() => {
                document.body.style.transform = 'scale(${min})';
            }, 100);
        `);
    }
    
    moveToRandomPosition() {
    logEntry('moveToRandomPosition', 'aniota_ui/biome/AniotaBiome.js');
    try {
        try {
            console.log('Starting moveToRandomPosition...');
            
            const displays = screen.getAllDisplays();
            const primary = screen.getPrimaryDisplay();
            const { width: screenWidth, height: screenHeight } = primary.workAreaSize;
            
            console.log('Screen size: ' + screenWidth + 'x' + screenHeight);
            
            const positions = this.characterData.behavior.idle_positions;
            console.log('Available positions:', positions);
            
            // Get current position to avoid selecting the same one
            const currentPos = this.characterWindow.getPosition();
            console.log('Current position:', currentPos);
            
            let selectedPos = null;
            let attempts = 0;
            const maxAttempts = 10;
            
            // Try to find a different position
            do {
                const randomPos = positions[Math.floor(Math.random() * positions.length)];
                const x = this.calculatePosition(randomPos.x, screenWidth, screenHeight);
                const y = this.calculatePosition(randomPos.y, screenWidth, screenHeight);
                
                // Check if this position is different from current (with some tolerance)
                const distanceFromCurrent = Math.sqrt(
                    Math.pow(x - currentPos[0], 2) + Math.pow(y - currentPos[1], 2)
                );
                
                if (distanceFromCurrent > 50 || attempts >= maxAttempts) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try { // At least 50 pixels away
                    selectedPos = { x, y, originalPos: randomPos };
                    break;
                }
                attempts++;
            } while (attempts < maxAttempts);
            
            if (!selectedPos) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                // Fallback to a definitely different position
                const fallbackX = Math.random() < 0.5 ? 50 : screenWidth - 150;
                const fallbackY = Math.random() < 0.5 ? 50 : screenHeight - 150;
                selectedPos = { x: fallbackX, y: fallbackY, originalPos: 'fallback' };
                console.log('Using fallback position:', selectedPos);
            }
            
            console.log('Selected position:', selectedPos);
            
            if (this.characterWindow && !this.characterWindow.isDestroyed()) {
                // Ensure positions are integers to avoid Electron errors
                const roundedX = Math.round(selectedPos.x);
                const roundedY = Math.round(selectedPos.y);
                
                this.characterWindow.setPosition(roundedX, roundedY);
                console.log('Aniota swam from (' + currentPos[0] + ', ' + currentPos[1] + ') to (' + roundedX + ', ' + roundedY + ')');
                
                // Verify the move actually happened
                setTimeout(() => {
                    const newPos = this.characterWindow.getPosition();
                    console.log('Position after move:', newPos);
                }, 100);
                
            } else {
                console.error('Character window is not available');
            }
        } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.error('Error in moveToRandomPosition:', error.message);
            console.error('Stack:', error.stack);
            // Don't throw - just log and continue
        }
    }
    
    calculatePosition(positionExpression, screenWidth, screenHeight) {
    logEntry('calculatePosition', 'aniota_ui/biome/AniotaBiome.js');
    try {
        try {
            // Safe position calculation replacing eval()
            if (typeof positionExpression === 'number') {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                
    logExit('currentFunction', positionExpression);
    return positionExpression;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            }
            
            if (typeof positionExpression === 'string') {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                // Handle common position expressions safely
                if (positionExpression.includes('screen.width')) {
                    const expression = positionExpression.replace(/screen\.width/g, screenWidth);
                    
    logExit('currentFunction', this.evaluateSimpleExpression(expression));
    return this.evaluateSimpleExpression(expression);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
                }
                if (positionExpression.includes('screen.height')) {
                    const expression = positionExpression.replace(/screen\.height/g, screenHeight);
                    
    logExit('currentFunction', this.evaluateSimpleExpression(expression));
    return this.evaluateSimpleExpression(expression);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
                }
                // If it's just a number string
                const parsed = parseInt(positionExpression) || 0;
                
    logExit('currentFunction', parsed);
    return parsed;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            }
            
            
    logExit('currentFunction', 0);
    return 0;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.error('Error in calculatePosition:', error.message);
            
    logExit('currentFunction', 0);
    return 0;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
    }
    
    evaluateSimpleExpression(expression) {
    logEntry('evaluateSimpleExpression', 'aniota_ui/biome/AniotaBiome.js');
    try {
        try {
            // Only allow simple mathematical expressions
            if (/^[\d\s+\-*/().]+$/.test(expression)) {
                const result = Function(`"use strict"; 
    logExit('currentFunction', (${expression})`)());
    return (${expression})`)();
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
                
    logExit('currentFunction', result);
    return result;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            }
            
            const parsed = parseInt(expression) || 0;
            
    logExit('currentFunction', parsed);
    return parsed;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.error('Error evaluating expression:', error.message);
            
    logExit('currentFunction', 0);
    return 0;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
    }
    
    showChatBubble(message) {
    logEntry('showChatBubble', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Create temporary UI element for chat
        const bubble = new BrowserWindow({
            width: this.characterData.ui_elements.chat_bubble.max_width,
            height: 100,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            skipTaskbar: true,
            focusable: false,
            parent: this.characterWindow
        });
        
        // Position relative to character
        const [charX, charY] = this.characterWindow.getPosition();
        bubble.setPosition(charX - 150, charY - 120);
        
        const bubbleHtml = `
        <div style="
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #FF69B4;
            border-radius: 20px;
            padding: 15px;
            font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            backdrop-filter: blur(5px);
        ">
            ${message}
        </div>`;
        
        bubble.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(bubbleHtml));
        
        // Auto-hide after timeout
        setTimeout(() => {
            if (!bubble.isDestroyed()) {
                bubble.close();
            }
        }, this.characterData.ui_elements.chat_bubble.auto_hide);
    }
    
    destroy() {
    logEntry('destroy', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Clean up animation frames
        this.animationFrames.forEach(frame => clearInterval(frame));
        this.animationFrames.clear();
        
        // Close windows
        if (this.characterWindow && !this.characterWindow.isDestroyed()) {
            this.characterWindow.close();
        }
        
        this.uiElements.forEach(element => {
            if (!element.isDestroyed()) {
                element.close();
            }
        });
        
        console.log('🌊 Aniota\'s biome has been closed');
    }
    
    // ============================================================================
    // ADVANCED BEHAVIOR SYSTEMS
    // ============================================================================
    
    startAdvancedBehaviors() {
    logEntry('startAdvancedBehaviors', 'aniota_ui/biome/AniotaBiome.js');
    try {
        console.log('🧠 Starting advanced behavior systems...');
        
        // Start global mouse tracking
        this.startMouseTracking();
        
        // Start idle point accumulation
        this.startIdlePointSystem();
        
        // Start user pattern recognition
        this.startPatternRecognition();
        
        // Start attention system
        this.startAttentionSystem();
        
        console.log('🎓 Advanced behaviors initialized');
    }
    
    startMouseTracking() {
    logEntry('startMouseTracking', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Track global mouse movements for attention and responses
        if (typeof document !== 'undefined') {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            document.addEventListener('mousemove', (event) => {
                const now = Date.now();
                const prevX = this.behaviorState.mouseTracker.x;
                const prevY = this.behaviorState.mouseTracker.y;
                const dt = now - this.behaviorState.mouseTracker.lastUpdate;
                
                if (dt > 0) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    this.behaviorState.mouseTracker.velocityX = (event.clientX - prevX) / dt;
                    this.behaviorState.mouseTracker.velocityY = (event.clientY - prevY) / dt;
                }
                
                this.behaviorState.mouseTracker.x = event.clientX;
                this.behaviorState.mouseTracker.y = event.clientY;
                this.behaviorState.mouseTracker.isMoving = true;
                this.behaviorState.mouseTracker.lastUpdate = now;
                
                // Check if mouse is near Aniota
                this.checkMouseProximity(event.clientX, event.clientY);
                
                // Update user activity
                this.updateUserActivity('mouse_move');
            }, { passive: true });
            
            // Stop tracking movement after inactivity
            setInterval(() => {
                const timeSinceLastMove = Date.now() - this.behaviorState.mouseTracker.lastUpdate;
                if (timeSinceLastMove > 1000) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try { // 1 second
                    this.behaviorState.mouseTracker.isMoving = false;
                }
            }, 1000);
        }
    }
    
    checkMouseProximity(mouseX, mouseY) {
    logEntry('checkMouseProximity', 'aniota_ui/biome/AniotaBiome.js');
    try {
        if (!this.characterWindow) return;
        
        const windowPos = this.characterWindow.getPosition();
        const windowBounds = this.characterWindow.getBounds();
        const centerX = windowPos[0] + windowBounds.width / 2;
        const centerY = windowPos[1] + windowBounds.height / 2;
        
        const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
        const proximityThreshold = 150; // pixels
        
        if (distance < proximityThreshold) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.triggerCuriousBehavior();
        }
    }
    
    startIdlePointSystem() {
    logEntry('startIdlePointSystem', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Earn points for observing and being present
        setInterval(() => {
            this.behaviorState.idlePoints += 1;
            
            // Every 10 points, do something special
            if (this.behaviorState.idlePoints % 10 === 0) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                console.log(`✨ Aniota earned observation points! Total: ${this.behaviorState.idlePoints}`);
                this.rewardIdleBehavior();
            }
        }, 45000); // Every 45 seconds
    }
    
    rewardIdleBehavior() {
    logEntry('rewardIdleBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Reward patient observation with special behaviors
        const rewards = [
            () => this.triggerPlayfulBehavior(),
            () => this.changeMoodIndicator('happy'),
            () => this.performSpecialAnimation(),
            () => this.moveToOptimalPosition()
        ];
        
        const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
        randomReward();
    }
    
    startPatternRecognition() {
    logEntry('startPatternRecognition', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Track user behavior patterns
        ['click', 'scroll', 'keydown'].forEach(eventType => {
    logEntry('forEach', 'aniota_ui/biome/AniotaBiome.js');
    try {
            if (typeof document !== 'undefined') {
                document.addEventListener(eventType, (event) => {
                    this.analyzeUserPattern(event);
                    this.updateUserActivity(eventType);
                }, { passive: true });
            }
        });
        
        // Analyze patterns every 2 minutes
        setInterval(() => {
            this.processUserPatterns();
        }, 120000);
    }
    
    analyzeUserPattern(event) {
    logEntry('analyzeUserPattern', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const observation = {
            type: event.type,
            timestamp: Date.now(),
            element: event.target?.tagName || 'unknown'
        };
        
        // Add to observation buffer
        this.behaviorState.observationBuffer.push(observation);
        
        // Keep only last 50 observations
        if (this.behaviorState.observationBuffer.length > 50) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.behaviorState.observationBuffer.shift();
        }
        
        // Update element preferences
        const elementMap = this.behaviorState.userPatterns.preferredElements;
        elementMap.set(observation.element, (elementMap.get(observation.element) || 0) + 1);
    }
    
    processUserPatterns() {
    logEntry('processUserPatterns', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const observations = this.behaviorState.observationBuffer;
        if (observations.length === 0) return;
        
        // Calculate click frequency
        const clicks = observations.filter(obs => obs.type === 'click');
        const timeSpan = Date.now() - observations[0].timestamp;
        this.behaviorState.userPatterns.clickFrequency = clicks.length / (timeSpan / 60000); // clicks per minute
        
        // Detect if user seems busy or idle
        if (this.behaviorState.userPatterns.clickFrequency > 2) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.setBehaviorMode('focused');
        } else if (this.behaviorState.userPatterns.clickFrequency < 0.5) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.setBehaviorMode('sleepy');
        } else {
            this.setBehaviorMode('observing');
        }
        
        console.log(`📊 Pattern analysis: ${this.behaviorState.userPatterns.clickFrequency.toFixed(2)} clicks/min, mode: ${this.behaviorState.mode}`);
    }
    
    startAttentionSystem() {
    logEntry('startAttentionSystem', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Dynamic attention level based on activity
        setInterval(() => {
            this.updateAttentionLevel();
        }, 10000); // Every 10 seconds
    }
    
    updateAttentionLevel() {
    logEntry('updateAttentionLevel', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const timeSinceActivity = Date.now() - this.behaviorState.lastUserActivity;
        const inactivityMinutes = timeSinceActivity / 60000;
        
        // Attention decreases with inactivity, increases with activity
        if (inactivityMinutes > 5) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.behaviorState.attentionLevel = Math.max(0, this.behaviorState.attentionLevel - 10);
        } else if (inactivityMinutes < 1) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.behaviorState.attentionLevel = Math.min(100, this.behaviorState.attentionLevel + 15);
        }
        
        // Adjust behavior based on attention level
        if (this.behaviorState.attentionLevel > 70) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.setBehaviorMode('curious');
        } else if (this.behaviorState.attentionLevel < 30) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.setBehaviorMode('sleepy');
        }
    }
    
    updateUserActivity(activityType) {
    logEntry('updateUserActivity', 'aniota_ui/biome/AniotaBiome.js');
    try {
        this.behaviorState.lastUserActivity = Date.now();
        
        // Boost attention on direct interaction
        if (activityType === 'click') {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            this.behaviorState.attentionLevel = Math.min(100, this.behaviorState.attentionLevel + 20);
        }
    }
    
    setBehaviorMode(newMode) {
    logEntry('setBehaviorMode', 'aniota_ui/biome/AniotaBiome.js');
    try {
        if (this.behaviorState.mode !== newMode) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.log(`🎭 Aniota behavior mode: ${this.behaviorState.mode} → ${newMode}`);
            this.behaviorState.mode = newMode;
            this.adaptBehaviorToMode();
        }
    }
    
    adaptBehaviorToMode() {
    logEntry('adaptBehaviorToMode', 'aniota_ui/biome/AniotaBiome.js');
    try {
        switch (this.behaviorState.mode) {
    logEntry('switch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            case 'curious':
                // More frequent position changes when curious
                this.adjustMovementFrequency(0.3); // 30% chance
                break;
            case 'playful':
                // Very active movement
                this.adjustMovementFrequency(0.5); // 50% chance
                this.triggerPlayfulBehavior();
                break;
            case 'focused':
                // Less movement, more stable
                this.adjustMovementFrequency(0.1); // 10% chance
                break;
            case 'sleepy':
                // Minimal movement
                this.adjustMovementFrequency(0.05); // 5% chance
                break;
            default: // observing
                this.adjustMovementFrequency(0.15); // 15% chance (default)
        }
    }
    
    adjustMovementFrequency(newChance) {
    logEntry('adjustMovementFrequency', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Store the movement chance for the next behavior evaluation
        this.movementChance = newChance;
    }
    
    triggerCuriousBehavior() {
    logEntry('triggerCuriousBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        console.log('👀 Aniota is curious about mouse proximity');
        this.setBehaviorMode('curious');
        
        // Maybe move slightly toward the mouse
        if (Math.random() < 0.3) {
            this.moveTowardsMouse();
        }
    }
    
    triggerPlayfulBehavior() {
    logEntry('triggerPlayfulBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        console.log('🎮 Aniota is feeling playful!');
        this.setBehaviorMode('playful');
        
        // Quick sequence of movements
        setTimeout(() => this.moveToRandomPosition(), 100);
        setTimeout(() => this.moveToRandomPosition(), 1500);
        setTimeout(() => this.setBehaviorMode('observing'), 3000);
    }
    
    performSpecialAnimation() {
    logEntry('performSpecialAnimation', 'aniota_ui/biome/AniotaBiome.js');
    try {
        console.log('✨ Aniota performs special animation');
        // Trigger a special heartbeat sequence
        for (let i = 0; i < 3; i++) {
    logEntry('for', 'aniota_ui/biome/AniotaBiome.js');
    try {
            setTimeout(() => this.pulseCharacter(), i * 200);
        }
    }
    
    moveToOptimalPosition() {
    logEntry('moveToOptimalPosition', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Move to a position that's visible but not intrusive
        console.log('🎯 Aniota moves to optimal position');
        
        // Find a nice corner position
        const optimalPositions = [
            { x: 50, y: 50 }, // Top-left
            { x: 'screen.width - 150', y: 50 }, // Top-right
            { x: 50, y: 'screen.height - 150' }, // Bottom-left
            { x: 'screen.width - 150', y: 'screen.height - 150' } // Bottom-right
        ];
        
        const randomOptimal = optimalPositions[Math.floor(Math.random() * optimalPositions.length)];
        
        if (this.characterWindow && !this.characterWindow.isDestroyed()) {
            const electronScreen = require('electron').screen;
            const display = electronScreen.getPrimaryDisplay();
            const { width: screenWidth, height: screenHeight } = display.workAreaSize;
            
            const x = this.calculatePosition(randomOptimal.x, screenWidth, screenHeight);
            const y = this.calculatePosition(randomOptimal.y, screenWidth, screenHeight);
            
            this.characterWindow.setPosition(Math.round(x), Math.round(y));
            console.log(`🎯 Moved to optimal position: (${x}, ${y})`);
        }
    }
    
    moveTowardsMouse() {
    logEntry('moveTowardsMouse', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const mouseX = this.behaviorState.mouseTracker.x;
        const mouseY = this.behaviorState.mouseTracker.y;
        
        if (mouseX === 0 && mouseY === 0) return; // No mouse data
        
        if (this.characterWindow && !this.characterWindow.isDestroyed()) {
            const currentPos = this.characterWindow.getPosition();
            const targetX = mouseX - 50; // Offset so we don't cover the mouse
            const targetY = mouseY - 50;
            
            // Move partially toward mouse (not all the way)
            const newX = Math.round(currentPos[0] + (targetX - currentPos[0]) * 0.3);
            const newY = Math.round(currentPos[1] + (targetY - currentPos[1]) * 0.3);
            
            this.characterWindow.setPosition(newX, newY);
            console.log(`🐕 Aniota moves toward mouse: (${newX}, ${newY})`);
        }
    }
    
    changeMoodIndicator(mood) {
    logEntry('changeMoodIndicator', 'aniota_ui/biome/AniotaBiome.js');
    try {
        console.log(`😊 Aniota mood changed to: ${mood}`);
        // This would update the visual mood indicators in the character rendering
        // For now, just log the mood change
    }
    
    // ============================================================================
    // LEARNING INTERVENTION BEHAVIORS - Leverage existing backend systems
    // ============================================================================
    
    async detectLearningNeeds() {
    logEntry('detectLearningNeeds', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Use existing backend systems to detect learning needs
        const learningContext = await this.analyzeLearningContext();
        
        if (learningContext.needsIntervention) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            await this.executeLearningIntervention(learningContext);
        }
    }
    
    async analyzeLearningContext() {
    logEntry('analyzeLearningContext', 'aniota_ui/biome/AniotaBiome.js');
    try {
        let context = {
            needsIntervention: false,
            interventionType: null,
            confidence: 0,
            backendSupport: false
        };
        
        // Check if backend systems are available
        if (this.behaviorState.backendConnection.connected) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            try {
                // Get learning readiness level from LRS system
                const lrsResponse = await fetch(`${this.behaviorState.backendConnection.baseUrl}/learning/sessions`);
                if (lrsResponse.ok) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    const sessions = await lrsResponse.json();
                    context.backendSupport = true;
                    
                    // Analyze learning patterns
                    if (sessions.sessions && sessions.sessions.length > 0) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                        const recentSession = sessions.sessions[sessions.sessions.length - 1];
                        
                        // Detect learning negatives
                        if (this.detectLearningNegatives(recentSession)) {
                            context.needsIntervention = true;
                            context.interventionType = 'encourage_learning';
                            context.confidence = 0.8;
                        }
                    }
                }
                
                // Get cognitive analysis from CAF
                const cafResponse = await fetch(`${this.behaviorState.backendConnection.baseUrl}/caf/status`);
                if (cafResponse.ok) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    const cafData = await cafResponse.json();
                    
                    if (cafData.status === 'initialized') {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                        // Backend cognitive systems are active - enhance intervention
                        context.confidence = Math.min(1.0, context.confidence + 0.2);
                    }
                }
                
            } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
                console.warn('Failed to analyze learning context from backend:', error.message);
            }
        }
        
        // Fallback to local analysis if backend unavailable
        if (!context.backendSupport) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            context = this.analyzeLocalLearningContext();
        }
        
        
    logExit('currentFunction', context);
    return context;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }
    
    detectLearningNegatives(sessionData) {
    logEntry('detectLearningNegatives', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Learning negative indicators based on backend session analysis
        const negativeIndicators = [
            'long_idle_periods', // User inactive for extended periods
            'rapid_task_switching', // Distraction patterns
            'error_repetition', // Same mistakes repeatedly
            'decreased_interaction', // Reduced engagement
            'frustration_patterns' // Signs of frustration
        ];
        
        // Check for patterns that indicate learning difficulties
        if (sessionData.user_patterns) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            
    logExit('currentFunction', negativeIndicators.some(indicator => 
                sessionData.user_patterns.includes(indicator)
            ));
    return negativeIndicators.some(indicator => 
                sessionData.user_patterns.includes(indicator)
            );
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
        
        
    logExit('currentFunction', false);
    return false;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }
    
    analyzeLocalLearningContext() {
    logEntry('analyzeLocalLearningContext', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Local fallback analysis when backend is unavailable
        const env = this.behaviorState.environmentalContext;
        const context = {
            needsIntervention: false,
            interventionType: null,
            confidence: 0.5, // Lower confidence without backend
            backendSupport: false
        };
        
        // Detect local learning negative patterns
        if (env.interactionRate < 1 && env.sessionActivity === 'light') {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            // Low engagement pattern
            context.needsIntervention = true;
            context.interventionType = 'encourage_engagement';
        } else if (env.userMoodEstimate === 'frustrated') {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            // Frustration detected
            context.needsIntervention = true;
            context.interventionType = 'provide_support';
        }
        
        
    logExit('currentFunction', context);
    return context;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }
    
    async executeLearningIntervention(context) {
    logEntry('executeLearningIntervention', 'aniota_ui/biome/AniotaBiome.js');
    try {
        console.log('🎯 Executing learning intervention:', context.interventionType);
        
        switch (context.interventionType) {
    logEntry('switch', 'aniota_ui/biome/AniotaBiome.js');
    try {
            case 'encourage_learning':
                await this.encourageLearningBehavior();
                break;
            case 'encourage_engagement':
                await this.encourageEngagementBehavior();
                break;
            case 'provide_support':
                await this.provideSupportBehavior();
                break;
            default:
                await this.defaultLearningSupport();
        }
        
        // Send intervention event to backend for analysis
        await this.sendLearningEvent('intervention_executed', {
            intervention_type: context.interventionType,
            confidence: context.confidence,
            backend_supported: context.backendSupport
        });
    }
    
    async encourageLearningBehavior() {
    logEntry('encourageLearningBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Move to an encouraging position
        this.moveToOptimalPosition();
        
        // Show encouraging mood
        this.changeMoodIndicator('encouraging');
        
        // Request a Socratic question from the backend SIE system
        const question = await this.requestSocraticQuestion();
        
        if (question) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.log('🤔 Aniota suggests:', question.question);
            // In a full implementation, this would show a UI with the question
            this.performSpecialAnimation('thoughtful');
        } else {
            // Fallback encouragement without backend
            console.log('💪 Aniota encourages: Keep exploring! Learning happens through curiosity.');
            this.performSpecialAnimation('encouraging');
        }
        
        // Gentle attention-getting behavior
        setTimeout(() => {
            this.triggerCuriousBehavior();
        }, 3000);
    }
    
    async encourageEngagementBehavior() {
    logEntry('encourageEngagementBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Playful attention-getting
        this.triggerPlayfulBehavior();
        
        // Move towards user's focus area
        this.moveTowardsMouse();
        
        // Show playful mood to encourage interaction
        this.changeMoodIndicator('playful');
        
        console.log('🎮 Aniota encourages engagement through playful behavior');
        
        // Send user activity encouragement to backend
        await this.sendLearningEvent('engagement_encouragement', {
            current_activity: this.behaviorState.environmentalContext.sessionActivity,
            interaction_rate: this.behaviorState.environmentalContext.interactionRate
        });
    }
    
    async provideSupportBehavior() {
    logEntry('provideSupportBehavior', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Calming, supportive behavior
        this.changeMoodIndicator('supportive');
        
        // Move to a supportive position (nearby but not intrusive)
        this.moveToOptimalPosition();
        
        // If backend is available, get appropriate support from SIE
        if (this.behaviorState.backendConnection.connected) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            try {
                const supportContext = {
                    user_state: 'frustrated',
                    support_needed: true,
                    learning_context: 'difficulty_detected'
                };
                
                const response = await fetch(`${this.behaviorState.backendConnection.baseUrl}/sie/question`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(supportContext)
                });
                
                if (response.ok) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    const supportData = await response.json();
                    console.log('🤝 Aniota provides support:', supportData.feedback || 'Take a moment to breathe. Learning is a journey.');
                }
            } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
                console.log('🤝 Aniota provides support: It\'s okay to take breaks. Learning takes time.');
            }
        } else {
            console.log('🤝 Aniota provides support: You\'re doing great! Every challenge is a learning opportunity.');
        }
        
        // Gentle, calming animation
        this.performSpecialAnimation('supportive');
    }
    
    async defaultLearningSupport() {
    logEntry('defaultLearningSupport', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // General learning support behavior
        this.changeMoodIndicator('encouraging');
        this.performSpecialAnimation('gentle');
        
        console.log('✨ Aniota provides gentle learning support');
        
        // Check for learning opportunities
        const learningOpportunity = await this.identifyLearningOpportunity();
        if (learningOpportunity) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            console.log('🎯 Learning opportunity detected:', learningOpportunity);
        }
    }
    
    async identifyLearningOpportunity() {
    logEntry('identifyLearningOpportunity', 'aniota_ui/biome/AniotaBiome.js');
    try {
        // Use backend AI to identify learning opportunities
        if (this.behaviorState.backendConnection.connected) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
            try {
                const tvmleStats = await fetch(`${this.behaviorState.backendConnection.baseUrl}/tvmle/stats`);
                if (tvmleStats.ok) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                    const stats = await tvmleStats.json();
                    
                    // Use TVMLE data to identify learning patterns
                    if (stats.learning_velocity < 1.0 && stats.correlation_patterns < 50) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                        
    logExit('currentFunction', 'pattern_recognition_opportunity');
    return 'pattern_recognition_opportunity';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
                    } else if (stats.mathematical_confidence < 0.7) {
    logEntry('if', 'aniota_ui/biome/AniotaBiome.js');
    try {
                        
    logExit('currentFunction', 'concept_reinforcement_opportunity');
    return 'concept_reinforcement_opportunity';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
                    }
                }
            } catch (error) {
    logEntry('catch', 'aniota_ui/biome/AniotaBiome.js');
    try {
                console.warn('Failed to identify learning opportunities from backend:', error.message);
            }
        }
        
        
    logExit('currentFunction', null);
    return null;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }
    
    // ============================================================================
    // UTILITY METHODS
    // ============================================================================
    
    getTimeOfDay() {
    logEntry('getTimeOfDay', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const hour = new Date().getHours();
        if (hour < 6) 
    logExit('currentFunction', 'night');
    return 'night';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        if (hour < 12) 
    logExit('currentFunction', 'morning');
    return 'morning';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        if (hour < 18) 
    logExit('currentFunction', 'afternoon');
    return 'afternoon';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        
    logExit('currentFunction', 'evening');
    return 'evening';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }
    
    getDayOfYear() {
    logEntry('getDayOfYear', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        
    logExit('currentFunction', Math.floor(diff / (1000 * 60 * 60 * 24)));
    return Math.floor(diff / (1000 * 60 * 60 * 24));
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }
    
    getSeason() {
    logEntry('getSeason', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) 
    logExit('currentFunction', 'spring');
    return 'spring';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        if (month >= 5 && month <= 7) 
    logExit('currentFunction', 'summer');
    return 'summer';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        if (month >= 8 && month <= 10) 
    logExit('currentFunction', 'fall');
    return 'fall';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        
    logExit('currentFunction', 'winter');
    return 'winter';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }
    
    isWeekend() {
    logEntry('isWeekend', 'aniota_ui/biome/AniotaBiome.js');
    try {
        const day = new Date().getDay();
        
    logExit('currentFunction', day === 0 || day === 6);
    return day === 0 || day === 6;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
} // Sunday or Saturday
    }
}

module.exports = AniotaBiome;

module.exports = AniotaBiome;# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

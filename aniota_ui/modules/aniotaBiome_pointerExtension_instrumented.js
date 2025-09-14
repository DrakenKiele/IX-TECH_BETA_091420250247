
const { logEntry, logExit, log } = require('..\..\..\execution_tracer');

class AniotaPointerExtension {
    constructor(parentBiome) {
    logEntry('constructor', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        this.biome = parentBiome;
        this.pointer = null;
        this.pointerWindow = null;
        this.isActive = false;
        this.lastSyncedAction = null; // Track last synced action to reduce logging
        
        // Pointer state and behavior
        this.pointerState = {
            x: 0,
            y: 0,
            intent: 'idle', // idle, pointing, drawing_attention, leading, showing
            targetElement: null,
            communicationStrength: 0, // How urgently Aniota wants attention
            gestureHistory: [],
            currentGesture: null
        };
        
        // Communication vocabulary Aniota learns
        this.communicationVocabulary = {
            'come_here': {
                pattern: 'move_back_forth_between_points',
                meaning: 'Follow me to this location',
                confidence: 0
            },
            'look_at_this': {
                pattern: 'point_and_pulse',
                meaning: 'Pay attention to this element',
                confidence: 0
            },
            'help_needed': {
                pattern: 'circular_motion_around_problem',
                meaning: 'I need assistance with this',
                confidence: 0
            },
            'show_excitement': {
                pattern: 'bounce_between_user_and_target',
                meaning: 'I want to share something interesting',
                confidence: 0
            },
            'request_interaction': {
                pattern: 'approach_and_retreat',
                meaning: 'Please interact with me',
                confidence: 0
            }
        };
        
        console.log('🖱️ Aniota Pointer Extension initialized - Ready for embodied communication');
    }

    async createPointerPresence() {
    logEntry('createPointerPresence', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        const { BrowserWindow, screen } = require('electron');
        
        // Create a small, transparent pointer window that follows Aniota's intentions
        this.pointerWindow = new BrowserWindow({
            width: 30,
            height: 30,
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
        
        // Position pointer initially near Aniota
        const primary = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primary.workAreaSize;
        
        this.pointerState.x = screenWidth - 150;
        this.pointerState.y = 60;
        this.pointerWindow.setPosition(this.pointerState.x, this.pointerState.y);
        
        await this.renderPointer();
        this.isActive = true;
        
        console.log('🖱️ Aniota pointer presence created');
    }

    async renderPointer() {
    logEntry('renderPointer', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        const pointerHTML = `
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
                #pointer { 
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #FFD700, #FFA500);
                    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                }
                #pointer.pointing {
                    transform: scale(1.3);
                    box-shadow: 0 0 25px rgba(255, 215, 0, 1.0);
                }
                #pointer.leading {
                    animation: pulse 1s infinite;
                }
                #pointer.excited {
                    animation: bounce 0.5s infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .trail {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: rgba(255, 215, 0, 0.6);
                    border-radius: 50%;
                    pointer-events: none;
                }
            </style>
        </head>
        <body>
            <div id="pointer" class="idle"></div>
            
            <script>
                const { ipcRenderer } = require('electron');
                const pointer = document.getElementById('pointer');
                
                let trailPoints = [];
                let currentBehavior = { action: 'idle' };
                let animationFrame = 0;
                
                // Mirror Aniota's exact behaviors
                ipcRenderer.on('mirror-aniota-behavior', (event, behaviorData) => {
                    currentBehavior = behaviorData;
                    applyAniotaBehaviorToPointer(behaviorData);
                });
                
                function applyAniotaBehaviorToPointer(behavior) {
    logEntry('applyAniotaBehaviorToPointer', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    // Pointer inherits the EXACT same behaviors as Aniota
                    console.log('🎯 Pointer mirroring Aniota behavior:', behavior.action);
                    
                    switch (behavior.action) {
    logEntry('switch', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                        case 'sit':
                            // Pointer sits and stays, just like Aniota
                            executeSitBehavior();
                            break;
                            
                        case 'come':
                            // Pointer moves to target, same as Aniota's come command
                            executeComeBehavior(behavior.data.targetX, behavior.data.targetY);
                            break;
                            
                        case 'jump':
                            // Pointer jumps in direction, copying Aniota's jump
                            executeJumpBehavior(behavior.data.direction, behavior.data.distance);
                            break;
                            
                        case 'circle':
                            // Pointer circles, same as Aniota's play behavior
                            executeCircleBehavior(behavior.data.radius, behavior.data.speed);
                            break;
                            
                        case 'idle':
                            // Pointer does gentle movements, same as Aniota
                            executeIdleBehavior(behavior.moodState);
                            break;
                            
                        default:
                            // Mirror any learned behaviors
                            executeCustomBehavior(behavior);
                    }
                    
                    // Apply same mood visualization
                    applyMoodVisualization(behavior.moodState);
                }
                
                function executeSitBehavior() {
    logEntry('executeSitBehavior', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    pointer.style.animation = 'none';
                    pointer.className = 'focused';
                    // Pointer stops moving, holds position
                    console.log('🎯 Pointer sitting and staying');
                }
                
                function executeComeBehavior(targetX, targetY) {
    logEntry('executeComeBehavior', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    // Move pointer to target location, same as Aniota
                    const duration = 1000; // 1 second movement
                    animatePointerTo(targetX, targetY, duration);
                    pointer.className = 'leading';
                    console.log(\`🎯 Pointer coming to (\${targetX}, \${targetY})\`);
                }
                
                function executeJumpBehavior(direction, distance) {
    logEntry('executeJumpBehavior', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    // Pointer jumps in direction, same as Aniota's jump
                    const currentX = parseInt(pointer.style.left) || 0;
                    const currentY = parseInt(pointer.style.top) || 0;
                    
                    const jumpX = currentX + Math.cos(direction) * distance;
                    const jumpY = currentY + Math.sin(direction) * distance;
                    
                    // Quick jump animation
                    pointer.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    pointer.style.left = jumpX + 'px';
                    pointer.style.top = jumpY + 'px';
                    pointer.className = 'excited';
                    
                    console.log(\`🎯 Pointer jumping to (\${jumpX}, \${jumpY})\`);
                }
                
                function executeCircleBehavior(radius, speed) {
    logEntry('executeCircleBehavior', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    // Pointer circles around current position, same as Aniota's play
                    const centerX = parseInt(pointer.style.left) || window.innerWidth / 2;
                    const centerY = parseInt(pointer.style.top) || window.innerHeight / 2;
                    
                    let angle = 0;
                    const circleInterval = setInterval(() => {
                        const x = centerX + Math.cos(angle) * radius;
                        const y = centerY + Math.sin(angle) * radius;
                        
                        pointer.style.left = x + 'px';
                        pointer.style.top = y + 'px';
                        
                        angle += speed * 0.1;
                        
                        if (angle > Math.PI * 4) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try { // 2 full circles
                            clearInterval(circleInterval);
                            pointer.className = 'idle';
                        }
                    }, 50);
                    
                    pointer.className = 'excited';
                    console.log('🎯 Pointer circling playfully');
                }
                
                function executeIdleBehavior(moodState) {
    logEntry('executeIdleBehavior', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    // Gentle breathing/pulsing like Aniota's idle state
                    pointer.className = 'idle';
                    pointer.style.animation = 'pulse 3s infinite';
                    
                    // Subtle random movements based on mood
                    if (moodState && moodState.playfulness > 0.7) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                        addSubtleRandomMovement();
                    }
                }
                
                function executeCustomBehavior(behavior) {
    logEntry('executeCustomBehavior', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    // Handle any learned behaviors from training
                    console.log('🎯 Pointer executing learned behavior:', behavior.action);
                    
                    // Default to pointing gesture for unknown behaviors
                    pointer.className = 'pointing';
                    pointer.style.animation = 'pulse 1s infinite';
                }
                
                function applyMoodVisualization(moodState) {
    logEntry('applyMoodVisualization', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    if (!moodState || !moodState.colors) return;
                    
                    // Apply same colors as Aniota's rings
                    const primaryColor = moodState.colors.primary || '#FFD700';
                    const secondaryColor = moodState.colors.secondary || '#FFA500';
                    
                    pointer.style.background = \`radial-gradient(circle, \${primaryColor}, \${secondaryColor})\`;
                    pointer.style.boxShadow = \`0 0 15px \${primaryColor}80\`;
                }
                
                function animatePointerTo(targetX, targetY, duration) {
    logEntry('animatePointerTo', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    const startX = parseInt(pointer.style.left) || 0;
                    const startY = parseInt(pointer.style.top) || 0;
                    const startTime = performance.now();
                    
                    function animate(currentTime) {
    logEntry('animate', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Smooth easing
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        
                        const currentX = startX + (targetX - startX) * easeProgress;
                        const currentY = startY + (targetY - startY) * easeProgress;
                        
                        pointer.style.left = currentX + 'px';
                        pointer.style.top = currentY + 'px';
                        
                        // Add trail effect
                        addTrailPoint(currentX, currentY);
                        
                        if (progress < 1) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                            requestAnimationFrame(animate);
                        }
                    }
                    
                    requestAnimationFrame(animate);
                }
                
                function addTrailPoint(x, y) {
    logEntry('addTrailPoint', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    const trail = document.createElement('div');
                    trail.className = 'trail';
                    trail.style.left = x + 'px';
                    trail.style.top = y + 'px';
                    document.body.appendChild(trail);
                    
                    // Fade out trail
                    setTimeout(() => {
                        trail.remove();
                    }, 500);
                }
                
                function addSubtleRandomMovement() {
    logEntry('addSubtleRandomMovement', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    const baseX = parseInt(pointer.style.left) || window.innerWidth / 2;
                    const baseY = parseInt(pointer.style.top) || window.innerHeight / 2;
                    
                    setInterval(() => {
                        if (currentBehavior.action === 'idle') {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                            const randomX = baseX + (Math.random() - 0.5) * 20;
                            const randomY = baseY + (Math.random() - 0.5) * 20;
                            
                            pointer.style.transition = 'all 2s ease';
                            pointer.style.left = randomX + 'px';
                            pointer.style.top = randomY + 'px';
                        }
                    }, 3000);
                }
                
                // Initialize pointer position
                pointer.style.left = window.innerWidth / 2 + 'px';
                pointer.style.top = window.innerHeight / 2 + 'px';
                
                console.log('🎯 Aniota pointer ready - will mirror all behaviors');
            </script>
                
                function executePointerCommand(command) {
    logEntry('executePointerCommand', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    pointer.className = command.intent;
                    
                    switch(command.intent) {
    logEntry('switch', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                        case 'pointing':
                            pointToLocation(command.targetX, command.targetY);
                            break;
                        case 'leading':
                            leadToLocation(command.targetX, command.targetY);
                            break;
                        case 'drawing_attention':
                            drawAttentionGesture(command.targetX, command.targetY);
                            break;
                        case 'showing':
                            showElementGesture(command.element);
                            break;
                    }
                }
                
                function pointToLocation(targetX, targetY) {
    logEntry('pointToLocation', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    // Move pointer toward target with pointing gesture
                    const currentX = parseInt(window.getComputedStyle(document.body).left) || 0;
                    const currentY = parseInt(window.getComputedStyle(document.body).top) || 0;
                    
                    // Animate toward target
                    animateToPosition(targetX, targetY, () => {
                        // Pulse at target location
                        pointer.classList.add('pointing');
                        setTimeout(() => {
                            pointer.classList.remove('pointing');
                        }, 2000);
                    });
                }
                
                function leadToLocation(targetX, targetY) {
    logEntry('leadToLocation', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    // Move back and forth between current position and target (come here gesture)
                    const startX = parseInt(window.getComputedStyle(document.body).left) || 0;
                    const startY = parseInt(window.getComputedStyle(document.body).top) || 0;
                    
                    let iterations = 0;
                    const maxIterations = 6;
                    
                    function backAndForth() {
    logEntry('backAndForth', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                        if (iterations >= maxIterations) return;
                        
                        const isEven = iterations % 2 === 0;
                        const destX = isEven ? targetX : startX;
                        const destY = isEven ? targetY : startY;
                        
                        animateToPosition(destX, destY, () => {
                            iterations++;
                            setTimeout(backAndForth, 300);
                        });
                    }
                    
                    backAndForth();
                }
                
                function drawAttentionGesture(targetX, targetY) {
    logEntry('drawAttentionGesture', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    // Circle around target area to draw attention
                    const centerX = targetX;
                    const centerY = targetY;
                    const radius = 40;
                    let angle = 0;
                    
                    function circleMotion() {
    logEntry('circleMotion', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                        if (angle >= Math.PI * 4) return; // Two full circles
                        
                        const x = centerX + Math.cos(angle) * radius;
                        const y = centerY + Math.sin(angle) * radius;
                        
                        animateToPosition(x, y, () => {
                            angle += Math.PI / 8;
                            setTimeout(circleMotion, 100);
                        });
                    }
                    
                    circleMotion();
                }
                
                function animateToPosition(targetX, targetY, callback) {
    logEntry('animateToPosition', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    // Send position update to main process
                    ipcRenderer.send('pointer-position-update', { x: targetX, y: targetY });
                    
                    // Create trail effect
                    createTrailPoint();
                    
                    if (callback) setTimeout(callback, 500);
                }
                
                function createTrailPoint() {
    logEntry('createTrailPoint', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                    const trail = document.createElement('div');
                    trail.className = 'trail';
                    trail.style.left = '50%';
                    trail.style.top = '50%';
                    document.body.appendChild(trail);
                    
                    setTimeout(() => {
                        trail.style.opacity = '0';
                        setTimeout(() => trail.remove(), 300);
                    }, 100);
                }
                
                // Click interaction - user acknowledges Aniota's communication
                pointer.addEventListener('click', () => {
                    ipcRenderer.send('pointer-acknowledged');
                    pointer.style.transform = 'scale(1.5)';
                    setTimeout(() => {
                        pointer.style.transform = 'scale(1)';
                    }, 300);
                });
                
                console.log('🖱️ Aniota pointer ready for communication');
            </script>
        </body>
        </html>`;
        
        this.pointerWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(pointerHTML));
    }

    // Enable pointer for teacher mode with behavior synchronization
    enableTeacherMode() {
    logEntry('enableTeacherMode', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        // Check if Aniota trusts the user enough for pointer extension
        const trustLevel = this.biome.trustTokenLearning.getTrustLevel();
        const requiredTrust = 0.6; // 60% trust required for pointer extension
        
        if (trustLevel < requiredTrust) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            console.log(`🔒 Pointer not available yet - need ${(requiredTrust * 100).toFixed(0)}% trust, currently at ${(trustLevel * 100).toFixed(0)}%`);
            
    logExit('currentFunction', false);
    return false;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
        
        if (!this.isActive) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            console.log('🎯 Enabling Aniota pointer for teacher mode - trust established');
            this.createPointerPresence();
            this.startBehaviorSync();
            
    logExit('currentFunction', true);
    return true;
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
    
    // Disable pointer when leaving teacher mode
    disableTeacherMode() {
    logEntry('disableTeacherMode', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        if (this.isActive) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            console.log('🎯 Disabling Aniota pointer - leaving teacher mode');
            this.close();
            this.stopBehaviorSync();
        }
    }
    
    // Sync pointer behavior with Aniota's exact movements
    startBehaviorSync() {
    logEntry('startBehaviorSync', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        this.behaviorSyncInterval = setInterval(() => {
            if (this.isActive && this.pointerWindow) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                // Get Aniota's current behavior state
                const aniotaBehavior = this.biome.petBehavior.getCurrentMovement();
                const aniotaMood = this.biome.petMood.getCurrentMoodState();
                
                // Send exact behavior to pointer
                this.syncPointerWithAniota(aniotaBehavior, aniotaMood);
            }
        }, this.biome.petState?.isInTraining ? 1000 : 5000); // 1s during training, 5s normally
        
        console.log('🎯 Behavior sync started - efficient pointer mirroring');
    }
    
    stopBehaviorSync() {
    logEntry('stopBehaviorSync', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        if (this.behaviorSyncInterval) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            clearInterval(this.behaviorSyncInterval);
            this.behaviorSyncInterval = null;
            console.log('🎯 Behavior sync stopped');
        }
    }
    
    syncPointerWithAniota(behavior, moodState) {
    logEntry('syncPointerWithAniota', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        if (!this.pointerWindow) return;
        
        // Send Aniota's exact behavior to pointer window
        this.pointerWindow.webContents.send('mirror-aniota-behavior', {
            action: behavior.action,
            data: behavior.data,
            moodState,
            timestamp: Date.now()
        });
        
        // Update pointer state to match Aniota
        this.pointerState.intent = this.translateBehaviorToIntent(behavior.action);
        
        // Only log significant behavior changes (avoid repetitive logs)
        const lastAction = this.lastSyncedAction;
        if (behavior.action !== 'idle' && behavior.action !== lastAction) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            console.log(`🎯 Pointer mirroring: ${behavior.action} → ${this.pointerState.intent}`);
            this.lastSyncedAction = behavior.action;
        }
    }
    
    translateBehaviorToIntent(action) {
    logEntry('translateBehaviorToIntent', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        const intentMap = {
            'sit': 'holding_position',
            'come': 'leading_to_location', 
            'jump': 'showing_direction',
            'circle': 'expressing_excitement',
            'idle': 'waiting_patiently'
        };
        
        
    logExit('currentFunction', intentMap[action] || 'expressing_learned_behavior');
    return intentMap[action] || 'expressing_learned_behavior';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Aniota initiates communication using learned gestures
    communicateIntent(intent, target = null) {
    logEntry('communicateIntent', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        if (!this.isActive) return;
        
        console.log(`🖱️ Aniota attempting to communicate: ${intent}`);
        
        const vocabulary = this.communicationVocabulary[intent];
        if (!vocabulary) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            console.log(`⚠️ Unknown communication intent: ${intent}`);
            return;
        }
        
        // Check if Aniota has learned this communication pattern
        if (vocabulary.confidence < 0.3) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            console.log(`🎭 Aniota hasn't learned this communication pattern yet: ${intent}`);
            return;
        }
        
        // Execute the learned communication gesture
        this.executeGesture(vocabulary.pattern, target);
        
        // Record this communication attempt
        this.recordCommunicationAttempt(intent, target);
    }

    executeGesture(pattern, target) {
    logEntry('executeGesture', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        const command = {
            intent: this.mapPatternToIntent(pattern),
            targetX: target?.x || Math.random() * 800 + 100,
            targetY: target?.y || Math.random() * 600 + 100,
            element: target?.element || null,
            timestamp: Date.now()
        };
        
        // Send command to pointer
        if (this.pointerWindow) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            this.pointerWindow.webContents.send('pointer-command', command);
        }
        
        this.pointerState.currentGesture = pattern;
        this.pointerState.intent = command.intent;
    }

    mapPatternToIntent(pattern) {
    logEntry('mapPatternToIntent', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        const patternMap = {
            'move_back_forth_between_points': 'leading',
            'point_and_pulse': 'pointing',
            'circular_motion_around_problem': 'drawing_attention',
            'bounce_between_user_and_target': 'excited',
            'approach_and_retreat': 'showing'
        };
        
        
    logExit('currentFunction', patternMap[pattern] || 'pointing');
    return patternMap[pattern] || 'pointing';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // User acknowledges Aniota's communication - this teaches her the gesture worked
    acknowledgeCommunication(success = true) {
    logEntry('acknowledgeCommunication', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        if (!this.pointerState.currentGesture) return;
        
        const pattern = this.pointerState.currentGesture;
        const intent = this.findIntentByPattern(pattern);
        
        if (intent && this.communicationVocabulary[intent]) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            // Strengthen or weaken this communication pattern based on success
            const delta = success ? 0.1 : -0.05;
            this.communicationVocabulary[intent].confidence = Math.max(0, Math.min(1, 
                this.communicationVocabulary[intent].confidence + delta
            ));
            
            console.log(`📈 Communication pattern "${intent}" confidence: ${this.communicationVocabulary[intent].confidence.toFixed(2)}`);
        }
        
        // Send feedback to trust learning system
        if (this.biome.trustLearning) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            const tokenValue = success ? 0.5 : -0.2;
            this.biome.trustLearning.receiveToken(tokenValue, {
                lastAction: 'pointer_communication',
                communicationType: intent,
                userResponse: success ? 'acknowledged' : 'ignored'
            });
        }
    }

    findIntentByPattern(pattern) {
    logEntry('findIntentByPattern', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        for (const [intent, vocabulary] of Object.entries(this.communicationVocabulary)) {
            if (vocabulary.pattern === pattern) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
                
    logExit('currentFunction', intent);
    return intent;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            }
        }
        
    logExit('currentFunction', null);
    return null;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Aniota learns new communication patterns from observing successful interactions
    learnCommunicationPattern(pattern, meaning, context) {
    logEntry('learnCommunicationPattern', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        const intentKey = pattern.toLowerCase().replace(/\s+/g, '_');
        
        if (!this.communicationVocabulary[intentKey]) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            this.communicationVocabulary[intentKey] = {
                pattern,
                meaning,
                confidence: 0.2 // Start with low confidence
            };
            
            console.log(`🎓 Aniota learned new communication pattern: ${pattern} → ${meaning}`);
        } else {
            // Strengthen existing pattern
            this.communicationVocabulary[intentKey].confidence += 0.1;
        }
    }

    // Move pointer to new position
    movePointer(x, y) {
    logEntry('movePointer', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        this.pointerState.x = x;
        this.pointerState.y = y;
        
        if (this.pointerWindow) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            this.pointerWindow.setPosition(x, y);
        }
    }

    // Record communication attempts for analysis
    recordCommunicationAttempt(intent, target) {
    logEntry('recordCommunicationAttempt', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        this.pointerState.gestureHistory.push({
            intent,
            target,
            timestamp: Date.now(),
            confidence: this.communicationVocabulary[intent]?.confidence || 0
        });
        
        // Keep only recent history
        if (this.pointerState.gestureHistory.length > 50) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            this.pointerState.gestureHistory.shift();
        }
    }

    // Aniota can show interest in interface elements
    showInterestInElement(elementType, location) {
    logEntry('showInterestInElement', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        console.log(`👀 Aniota shows interest in ${elementType} at (${location.x}, ${location.y})`);
        
        this.communicateIntent('look_at_this', {
            x: location.x,
            y: location.y,
            element: elementType
        });
    }

    // Export communication learning data
    exportCommunicationData() {
    logEntry('exportCommunicationData', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        
    logExit('currentFunction', {
            vocabulary: this.communicationVocabulary,
            gestureHistory: this.pointerState.gestureHistory,
            currentCapabilities: this.getCurrentCapabilities(),
            learningMetrics: {
                totalPatterns: Object.keys(this.communicationVocabulary).length,
                learnedPatterns: Object.values(this.communicationVocabulary).filter(v => v.confidence > 0.5).length,
                averageConfidence: this.getAverageConfidence(),
                communicationAttempts: this.pointerState.gestureHistory.length
            }
        });
    return {
            vocabulary: this.communicationVocabulary,
            gestureHistory: this.pointerState.gestureHistory,
            currentCapabilities: this.getCurrentCapabilities(),
            learningMetrics: {
                totalPatterns: Object.keys(this.communicationVocabulary).length,
                learnedPatterns: Object.values(this.communicationVocabulary).filter(v => v.confidence > 0.5).length,
                averageConfidence: this.getAverageConfidence(),
                communicationAttempts: this.pointerState.gestureHistory.length
            }
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    getCurrentCapabilities() {
    logEntry('getCurrentCapabilities', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        
    logExit('currentFunction', Object.entries(this.communicationVocabulary)
            .filter(([intent, vocab]) => vocab.confidence > 0.3)
            .map(([intent, vocab]) => ({
                intent,
                meaning: vocab.meaning,
                confidence: vocab.confidence
            })));
    return Object.entries(this.communicationVocabulary)
            .filter(([intent, vocab]) => vocab.confidence > 0.3)
            .map(([intent, vocab]) => ({
                intent,
                meaning: vocab.meaning,
                confidence: vocab.confidence
            }));
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    getAverageConfidence() {
    logEntry('getAverageConfidence', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        const confidences = Object.values(this.communicationVocabulary).map(v => v.confidence);
        
    logExit('currentFunction', confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length);
    return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Close pointer system
    close() {
    logEntry('close', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
        if (this.pointerWindow) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js');
    try {
            this.pointerWindow.close();
            this.pointerWindow = null;
        }
        this.isActive = false;
        console.log('🖱️ Aniota pointer extension closed');
    }
}

module.exports = AniotaPointerExtension;

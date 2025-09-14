
const { logEntry, logExit, log } = require('..\..\..\execution_tracer');

class AniotaPetBehavior {
    constructor(parentBiome) {
    logEntry('constructor', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        this.biome = parentBiome;
        this.petState = {
            currentCommand: 'idle',
            isTraining: false,
            isInTraining: false,        // Active training mode detection
            trainingStartTime: null,    // When training session began
            trainingTimeoutId: null,    // Timeout to exit training mode
            commandHistory: [],         // Track recent commands for training detection
            rewardHistory: [],          // Track rewards/tokens
            targetX: null,
            targetY: null,
            jumpDirection: null,
            excitement: 0,
            attention: 0,
            lastClickTime: 0,
            mouseX: 0,
            mouseY: 0,
            proximityResponse: false,
            following: false,
            playMode: false,
            
            // Natural instincts (untrained but present)
            naturalSitDuration: 3000,      // Will sit for ~3 seconds naturally
            naturalFollowDistance: 150,    // Natural following range
            distractionChance: 0.7,        // 70% chance to get distracted
            wanderImpulse: 0.6,           // Strong urge to wander off
            attentionSpan: 2000,          // Natural attention span in ms
            lastDistraction: 0,
            obedienceLevel: 0.1           // Very low natural discipline (0.0-1.0)
        };
        
        // Natural behavior tendencies (before training)
        this.naturalInstincts = {
            sit: { 
                reliability: 0.3,     // 30% chance to actually sit when asked
                duration: 3000,       // Short natural sit time
                wanderChance: 0.8     // High chance to wander off
            },
            follow: {
                reliability: 0.4,     // 40% chance to follow consistently
                maxDistance: 200,     // Will follow within this range
                distractionRate: 0.6  // Gets distracted easily while following
            },
            stay: {
                reliability: 0.1,     // Only 10% natural reliability
                duration: 1500,       // Very short natural stay
                failureRate: 0.9      // Almost always fails without training
            }
        };
        
        this.behaviorPatterns = {
            idle: { speed: 0.5, randomness: 0.3 },
            excited: { speed: 2.0, randomness: 0.8 },
            focused: { speed: 1.0, randomness: 0.1 },
            playful: { speed: 1.5, randomness: 0.9 },
            following: { speed: 1.2, randomness: 0.2 },
            wandering: { speed: 0.8, randomness: 0.9 },  // Natural wandering
            distracted: { speed: 1.5, randomness: 0.95 } // When distracted
        };
        
        // Initialize behavior tracking
        this.lastLoggedBehavior = null; // Reduce console spam
        
        // Start natural wandering behavior
        this.startNaturalBehaviorLoop();
        
        console.log('🐕 Aniota Pet Behavior initialized with natural instincts (untrained)');
    }

    // Training Mode Detection - enters when commands are repeated within timeframe
    detectTrainingMode(command) {
    logEntry('detectTrainingMode', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        const now = Date.now();
        const recentWindow = 30000; // 30 second window for training detection
        
        // Add command to history
        this.petState.commandHistory.push({ command, timestamp: now });
        
        // Clean old commands outside window
        this.petState.commandHistory = this.petState.commandHistory.filter(
            entry => now - entry.timestamp < recentWindow
        );
        
        // Check for repeated commands (training pattern)
        const sameCommands = this.petState.commandHistory.filter(entry => entry.command === command);
        
        if (sameCommands.length >= 2 && !this.petState.isInTraining) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            this.enterTrainingMode();
        } else if (this.petState.isInTraining) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            // Extend training session
            this.extendTrainingMode();
        }
    }

    enterTrainingMode() {
    logEntry('enterTrainingMode', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        this.petState.isInTraining = true;
        this.petState.trainingStartTime = Date.now();
        
        // Clear any existing timeout
        if (this.petState.trainingTimeoutId) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            clearTimeout(this.petState.trainingTimeoutId);
        }
        
        // Auto-exit training mode after 2 minutes of no commands
        this.petState.trainingTimeoutId = setTimeout(() => {
            this.exitTrainingMode();
        }, 120000); // 2 minutes
        
        console.log('🎓 Training mode activated - increased responsiveness');
        
        // Restart behavior loops with training frequency
        this.restartBehaviorLoops();
    }

    extendTrainingMode() {
    logEntry('extendTrainingMode', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        // Clear existing timeout and set new one
        if (this.petState.trainingTimeoutId) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            clearTimeout(this.petState.trainingTimeoutId);
        }
        
        this.petState.trainingTimeoutId = setTimeout(() => {
            this.exitTrainingMode();
        }, 120000); // 2 minutes from last command
    }

    exitTrainingMode() {
    logEntry('exitTrainingMode', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        this.petState.isInTraining = false;
        this.petState.trainingStartTime = null;
        this.petState.trainingTimeoutId = null;
        this.petState.commandHistory = [];
        
        console.log('🎓 Training mode ended - returning to normal behavior');
        
        // Restart behavior loops with normal frequency
        this.restartBehaviorLoops();
    }

    restartBehaviorLoops() {
    logEntry('restartBehaviorLoops', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        // Restart natural behavior loop with appropriate frequency
        this.stopNaturalBehaviorLoop();
        this.startNaturalBehaviorLoop();
    }

    // Reward/Token system for authentic training
    receiveReward(rewardType = 'treat') {
    logEntry('receiveReward', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        const now = Date.now();
        this.petState.rewardHistory.push({ type: rewardType, timestamp: now });
        
        // Clean old rewards (keep last 10 minutes)
        this.petState.rewardHistory = this.petState.rewardHistory.filter(
            reward => now - reward.timestamp < 600000
        );
        
        // Reward enhances learning of recent commands
        if (this.petState.commandHistory.length > 0) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            const lastCommand = this.petState.commandHistory[this.petState.commandHistory.length - 1];
            this.reinforceCommand(lastCommand.command, true);
        }
        
        console.log(`🏆 Reward received: ${rewardType} - reinforcing recent behavior`);
    }

    reinforceCommand(command, success) {
    logEntry('reinforceCommand', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        // This enhances the natural reliability of commands through training
        if (this.naturalInstincts[command]) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            const currentReliability = this.naturalInstincts[command].reliability;
            
            if (success) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
                // Successful training increases reliability
                this.naturalInstincts[command].reliability = Math.min(
                    currentReliability + 0.1, 
                    0.9 // Cap at 90% reliability
                );
                console.log(`🎓 ${command} training success - reliability now ${this.naturalInstincts[command].reliability.toFixed(2)}`);
            } else {
                // Failed attempts don't decrease as much (realistic learning)
                this.naturalInstincts[command].reliability = Math.max(
                    currentReliability - 0.02,
                    0.05 // Always maintain some base instinct
                );
            }
        }
    }

    // Clicker training response system
    handleClick(clickType = 'single') {
    logEntry('handleClick', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        const now = Date.now();
        const timeSinceLastClick = now - this.petState.lastClickTime;
        
        console.log(`🎯 Pet Behavior: ${clickType} click detected`);
        
        switch (clickType) {
    logEntry('switch', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            case 'single':
                
    logExit('currentFunction', this.executeSitCommand());
    return this.executeSitCommand();
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            case 'double':
                
    logExit('currentFunction', this.executeStayCommand());
    return this.executeStayCommand();
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            default:
                
    logExit('currentFunction', this.executeGenericResponse());
    return this.executeGenericResponse();
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
    }

    executeSitCommand() {
    logEntry('executeSitCommand', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        console.log('🐕 Executing "Sit" command - Aniota will try to sit (natural instincts)');
        
        // Detect training mode based on command repetition
        this.detectTrainingMode('sit');
        
        // Check natural reliability - will Aniota even try to sit?
        if (Math.random() > this.naturalInstincts.sit.reliability) {
            console.log('🐕 Aniota is ignoring the sit command - not trained yet!');
            this.petState.currentCommand = 'wandering';
            this.addBehaviorToQueue({
                action: 'wander',
                duration: 2000,
                distracted: true
            });
            
            // Record failed training attempt
            this.reinforceCommand('sit', false);
            
            
    logExit('currentFunction', {
                command: 'ignored',
                message: 'Aniota heard you but decided to wander off instead. Training needed!',
                obedience: false
            });
    return {
                command: 'ignored',
                message: 'Aniota heard you but decided to wander off instead. Training needed!',
                obedience: false
            };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
        
        // Aniota will try to sit, but with natural limitations
        console.log('🐕 Aniota attempts to sit (natural behavior, will likely wander off)');
        this.petState.currentCommand = 'sit';
        this.petState.following = false;
        this.petState.playMode = false;
        
        // Natural sit duration (short and unreliable)
        const naturalDuration = this.naturalInstincts.sit.duration + (Math.random() * 2000);
        
        this.addBehaviorToQueue({
            action: 'sit',
            duration: naturalDuration,
            position: 'current',
            naturalBehavior: true,
            onComplete: () => {
                // High chance to wander off after natural sit
                if (Math.random() < this.naturalInstincts.sit.wanderChance) {
                    console.log('🐕 Aniota got distracted and wandered off (natural behavior)');
                    this.petState.currentCommand = 'wandering';
                    this.addBehaviorToQueue({
                        action: 'wander',
                        duration: 5000,
                        message: 'Lost interest and wandered away'
                    });
                }
            }
        });
        
        // Record successful attempt (even if natural)
        this.reinforceCommand('sit', true);
        
        // Award user tokens for successful command
        if (this.biome.userTokenEconomy) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            this.biome.userTokenEconomy.recordPositiveLearning('successful_command');
        }
        
        
    logExit('currentFunction', {
            command: 'sit',
            message: 'Aniota sits... but probably won\'t stay long without training.',
            duration: naturalDuration,
            reliability: 'natural_instinct',
            obedience: this.petState.obedienceLevel
        });
    return {
            command: 'sit',
            message: 'Aniota sits... but probably won\'t stay long without training.',
            duration: naturalDuration,
            reliability: 'natural_instinct',
            obedience: this.petState.obedienceLevel
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    executeStayCommand() {
    logEntry('executeStayCommand', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        console.log('🐕 Executing "Stay" command - Long-term position hold');
        this.petState.currentCommand = 'stay';
        this.petState.following = false;
        this.petState.playMode = false;
        
        this.addBehaviorToQueue({
            action: 'stay',
            duration: 15000, // Stay for 15 seconds
            position: 'current'
        });
        
        
    logExit('currentFunction', {
            command: 'stay',
            message: 'Excellent! Aniota will stay here until you call her.',
            duration: 15000
        });
    return {
            command: 'stay',
            message: 'Excellent! Aniota will stay here until you call her.',
            duration: 15000
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    executeGenericResponse() {
    logEntry('executeGenericResponse', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        console.log('🐕 Generic pet response - attention seeking');
        this.petState.excitement += 0.2;
        
        
    logExit('currentFunction', {
            command: 'attention',
            message: 'Aniota noticed your click and is paying attention!',
            excitement: this.petState.excitement
        });
    return {
            command: 'attention',
            message: 'Aniota noticed your click and is paying attention!',
            excitement: this.petState.excitement
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Come command - move to specific location
    executeComeCommand(targetX, targetY) {
    logEntry('executeComeCommand', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        console.log(`🐕 Executing "Come" command to (${targetX}, ${targetY})`);
        this.petState.currentCommand = 'come';
        this.petState.targetX = targetX;
        this.petState.targetY = targetY;
        this.petState.following = false;
        
        this.addBehaviorToQueue({
            action: 'moveTo',
            targetX,
            targetY,
            speed: this.behaviorPatterns.focused.speed,
            onComplete: () => {
                this.petState.currentCommand = 'idle';
                console.log('🐕 "Come" command completed - Aniota arrived!');
            }
        });
        
        
    logExit('currentFunction', {
            command: 'come',
            message: `Aniota is coming to (${targetX}, ${targetY})!`,
            target: { x: targetX, y: targetY }
        });
    return {
            command: 'come',
            message: `Aniota is coming to (${targetX}, ${targetY})!`,
            target: { x: targetX, y: targetY }
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Jump command - leap in specific direction
    executeJumpCommand(startX, startY, endX, endY) {
    logEntry('executeJumpCommand', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        const direction = Math.atan2(endY - startY, endX - startX);
        const distance = Math.min(Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2), 150);
        
        console.log(`🐕 Executing "Jump" command - direction: ${direction}, distance: ${distance}`);
        
        this.petState.currentCommand = 'jump';
        this.petState.jumpDirection = direction;
        
        this.addBehaviorToQueue({
            action: 'jump',
            direction,
            distance,
            duration: 800,
            onComplete: () => {
                this.petState.currentCommand = 'idle';
                console.log('🐕 "Jump" command completed - Aniota landed!');
            }
        });
        
        
    logExit('currentFunction', {
            command: 'jump',
            message: 'Aniota is jumping!',
            direction,
            distance
        });
    return {
            command: 'jump',
            message: 'Aniota is jumping!',
            direction,
            distance
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Mouse proximity response - playful behavior
    handleMouseProximity(mouseX, mouseY, aniotaX, aniotaY) {
    logEntry('handleMouseProximity', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        const distance = Math.sqrt((mouseX - aniotaX) ** 2 + (mouseY - aniotaY) ** 2);
        const proximityThreshold = 100;
        
        this.petState.mouseX = mouseX;
        this.petState.mouseY = mouseY;
        
        if (distance < proximityThreshold && !this.petState.proximityResponse) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            console.log('🐕 Mouse proximity detected - entering play mode!');
            this.petState.proximityResponse = true;
            this.petState.playMode = true;
            this.petState.excitement = Math.min(this.petState.excitement + 0.3, 1.0);
            
            this.startPlayBehavior();
            
            
    logExit('currentFunction', {
                action: 'proximity_play',
                excitement: this.petState.excitement,
                message: 'Aniota wants to play!'
            });
    return {
                action: 'proximity_play',
                excitement: this.petState.excitement,
                message: 'Aniota wants to play!'
            };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        } else if (distance > proximityThreshold && this.petState.proximityResponse) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            console.log('🐕 Mouse moved away - calming down');
            this.petState.proximityResponse = false;
            this.petState.playMode = false;
            this.petState.excitement = Math.max(this.petState.excitement - 0.1, 0);
            
            
    logExit('currentFunction', {
                action: 'proximity_calm',
                excitement: this.petState.excitement,
                message: 'Aniota is calming down'
            });
    return {
                action: 'proximity_calm',
                excitement: this.petState.excitement,
                message: 'Aniota is calming down'
            };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
        
        
    logExit('currentFunction', null);
    return null;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    startPlayBehavior() {
    logEntry('startPlayBehavior', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        // Add circular movement pattern for play mode
        this.addBehaviorToQueue({
            action: 'circle',
            duration: 3000,
            radius: 50,
            speed: this.behaviorPatterns.playful.speed
        });
    }

    // Behavior queue system
    addBehaviorToQueue(behavior) {
    logEntry('addBehaviorToQueue', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        if (!this.behaviorQueue) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            this.behaviorQueue = [];
        }
        this.behaviorQueue.push({
            ...behavior,
            id: Date.now() + Math.random(),
            startTime: Date.now()
        });
        
        // Only log when adding a different behavior than current
        const lastBehavior = this.lastLoggedBehavior;
        if (!lastBehavior || lastBehavior !== behavior.action) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            console.log(`🎭 Added behavior to queue: ${behavior.action}`);
            this.lastLoggedBehavior = behavior.action;
        }
    }

    // Process behavior queue (called from main animation loop)
    processBehaviorQueue() {
    logEntry('processBehaviorQueue', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        if (!this.behaviorQueue || this.behaviorQueue.length === 0) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            
    logExit('currentFunction', null);
    return null;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
        
        const currentBehavior = this.behaviorQueue[0];
        const elapsed = Date.now() - currentBehavior.startTime;
        
        if (currentBehavior.duration && elapsed > currentBehavior.duration) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            // Behavior completed
            const completed = this.behaviorQueue.shift();
            if (completed.onComplete) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
                completed.onComplete();
            }
            // Only log completion of non-idle behaviors
            if (completed.action !== 'idle' && completed.action !== 'wander') {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
                console.log(`🎭 Behavior completed: ${completed.action}`);
            }
            
    logExit('currentFunction', this.processBehaviorQueue());
    return this.processBehaviorQueue();
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
} // Check next behavior
        }
        
        
    logExit('currentFunction', currentBehavior);
    return currentBehavior;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Get current movement instructions for rendering
    getCurrentMovement() {
    logEntry('getCurrentMovement', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        const currentBehavior = this.processBehaviorQueue();
        
        if (!currentBehavior) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            
    logExit('currentFunction', { action: 'idle', data: {} });
    return { action: 'idle', data: {} };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
        
        
    logExit('currentFunction', {
            action: currentBehavior.action,
            data: currentBehavior
        });
    return {
            action: currentBehavior.action,
            data: currentBehavior
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Magical portal entrance animation
    performMagicalEntrance() {
    logEntry('performMagicalEntrance', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        console.log('✨ Aniota making magical entrance through wormhole');
        
        // Trigger wormhole portal
        if (this.biome.visualRenderer) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            this.biome.visualRenderer.openWormhole();
        }
        
        // Add entrance behavior to queue
        this.addToQueue({
            action: 'magical_entrance',
            data: { 
                duration: 3000,
                effect: 'wormhole_entrance'
            },
            priority: 'high',
            timestamp: Date.now()
        });
        
        // Boost mood for magical entrance
        if (this.biome.petMood) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            this.biome.petMood.addMoodBoost('excitement', 0.8, 'magical_entrance');
        }
    }

    // Magical portal exit animation  
    performMagicalExit() {
    logEntry('performMagicalExit', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        console.log('✨ Aniota departing through magical wormhole');
        
        // Trigger wormhole portal
        if (this.biome.visualRenderer) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            this.biome.visualRenderer.closeWormhole();
        }
        
        // Add exit behavior to queue
        this.addToQueue({
            action: 'magical_exit',
            data: { 
                duration: 2000,
                effect: 'wormhole_exit'
            },
            priority: 'high',
            timestamp: Date.now()
        });
        
        // Add anticipation mood
        if (this.biome.petMood) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            this.biome.petMood.addMoodBoost('curiosity', 0.6, 'magical_departure');
        }
    }

    // Enhanced movement with portal effects
    executeCommand(command, data) {
    logEntry('executeCommand', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        console.log(`🌟 Executing faerie command: ${command}`);
        
        // Trigger entrance portal for major movements
        if (['come', 'jump'].includes(command) && Math.random() > 0.7) {
            this.performMagicalEntrance();
        }
        
        switch (command) {
    logEntry('switch', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            case 'sit':
                
    logExit('currentFunction', this.executeSitCommand());
    return this.executeSitCommand();
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            case 'come':
                
    logExit('currentFunction', this.executeComeCommand(data.targetX, data.targetY));
    return this.executeComeCommand(data.targetX, data.targetY);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            case 'jump':
                
    logExit('currentFunction', this.executeJumpCommand(data.direction, data.distance));
    return this.executeJumpCommand(data.direction, data.distance);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            case 'circle':
                
    logExit('currentFunction', this.executeCircleCommand());
    return this.executeCircleCommand();
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            case 'magical_entrance':
                
    logExit('currentFunction', this.processMagicalEntrance(data));
    return this.processMagicalEntrance(data);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            case 'magical_exit':
                
    logExit('currentFunction', this.processMagicalExit(data));
    return this.processMagicalExit(data);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            default:
                
    logExit('currentFunction', this.executeGenericResponse());
    return this.executeGenericResponse();
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
    }

    processMagicalEntrance(data) {
    logEntry('processMagicalEntrance', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        // Handle magical entrance animation
        this.petState.currentCommand = 'magical_entrance';
        
        setTimeout(() => {
            this.petState.currentCommand = 'idle';
            console.log('✨ Magical entrance completed');
        }, data.duration || 3000);
        
        
    logExit('currentFunction', {
            action: 'magical_entrance',
            success: true,
            effect: 'wormhole_portal'
        });
    return {
            action: 'magical_entrance',
            success: true,
            effect: 'wormhole_portal'
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    processMagicalExit(data) {
    logEntry('processMagicalExit', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        // Handle magical exit animation
        this.petState.currentCommand = 'magical_exit';
        
        setTimeout(() => {
            this.petState.currentCommand = 'idle';
            console.log('✨ Magical exit completed');
        }, data.duration || 2000);
        
        
    logExit('currentFunction', {
            action: 'magical_exit',
            success: true,
            effect: 'wormhole_portal'
        });
    return {
            action: 'magical_exit',
            success: true,
            effect: 'wormhole_portal'
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Natural behavior loop - constantly running background instincts
    startNaturalBehaviorLoop() {
    logEntry('startNaturalBehaviorLoop', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        this.naturalBehaviorInterval = setInterval(() => {
            if (this.petState.currentCommand === 'idle' || this.petState.currentCommand === 'wandering') {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
                this.checkForNaturalBehaviors();
            }
        }, this.petState.isInTraining ? 10000 : 60000); // 10s during training, 1min normally
        
        console.log('🐕 Natural behavior loop started - efficient polling (training-responsive)');
    }

    checkForNaturalBehaviors() {
    logEntry('checkForNaturalBehaviors', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        const now = Date.now();
        
        // Natural wandering impulse
        if (Math.random() < this.petState.wanderImpulse && 
            now - this.petState.lastDistraction > 5000) {
            this.executeNaturalWander();
        }
        
        // Natural following instinct (if user is nearby)
        if (Math.random() < this.naturalInstincts.follow.reliability &&
            this.shouldNaturallyFollow()) {
            this.executeNaturalFollow();
        }
    }

    executeNaturalWander() {
    logEntry('executeNaturalWander', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        // Only log if this is a state change
        if (this.petState.currentCommand !== 'wandering') {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            console.log('🐕 Natural wandering instinct triggered');
        }
        this.petState.currentCommand = 'wandering';
        this.petState.lastDistraction = Date.now();
        
        this.addBehaviorToQueue({
            action: 'wander',
            duration: 4000 + (Math.random() * 6000), // 4-10 seconds of wandering
            speed: this.behaviorPatterns.wandering.speed,
            randomness: this.behaviorPatterns.wandering.randomness,
            naturalBehavior: true
        });
    }

    executeNaturalFollow() {
    logEntry('executeNaturalFollow', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        // Only log if this is a state change
        if (this.petState.currentCommand !== 'following') {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            console.log('🐕 Natural following instinct - but will get distracted');
        }
        this.petState.currentCommand = 'following';
        this.petState.following = true;
        
        // Natural follow duration (short attention span)
        const followDuration = 3000 + (Math.random() * 4000); // 3-7 seconds
        
        this.addBehaviorToQueue({
            action: 'follow',
            duration: followDuration,
            distance: this.naturalInstincts.follow.maxDistance,
            naturalBehavior: true,
            onComplete: () => {
                // High chance to get distracted and wander off
                if (Math.random() < this.naturalInstincts.follow.distractionRate) {
                    console.log('🐕 Got distracted while following - wandering off');
                    this.executeNaturalWander();
                } else {
                    this.petState.currentCommand = 'idle';
                    this.petState.following = false;
                }
            }
        });
    }

    shouldNaturallyFollow() {
    logEntry('shouldNaturallyFollow', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        // Check if user interaction suggests they want following
        // (This would be enhanced with actual mouse/cursor tracking)
        
    logExit('currentFunction', this.petState.mouseX !== 0 || this.petState.mouseY !== 0);
    return this.petState.mouseX !== 0 || this.petState.mouseY !== 0;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Increase obedience through successful training
    reinforceObedience(commandType, success) {
    logEntry('reinforceObedience', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        if (success) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            // Successful training increases natural reliability
            if (this.naturalInstincts[commandType]) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
                this.naturalInstincts[commandType].reliability = Math.min(
                    this.naturalInstincts[commandType].reliability + 0.05, 
                    0.95 // Cap at 95% reliability even with perfect training
                );
                
                // Reduce distraction tendencies
                this.petState.distractionChance = Math.max(
                    this.petState.distractionChance - 0.02,
                    0.1 // Always maintain some natural unpredictability
                );
                
                console.log(`🎓 Training improved ${commandType} reliability to ${this.naturalInstincts[commandType].reliability.toFixed(2)}`);
            }
            
            // Overall obedience slowly increases
            this.petState.obedienceLevel = Math.min(this.petState.obedienceLevel + 0.01, 1.0);
        } else {
            // Failed commands can slightly decrease reliability (realistic regression)
            if (this.naturalInstincts[commandType]) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
                this.naturalInstincts[commandType].reliability = Math.max(
                    this.naturalInstincts[commandType].reliability - 0.01,
                    0.05 // Always maintain some base instinct
                );
            }
        }
    }

    // Stop natural behavior loop (for cleanup)
    stopNaturalBehaviorLoop() {
    logEntry('stopNaturalBehaviorLoop', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        if (this.naturalBehaviorInterval) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            clearInterval(this.naturalBehaviorInterval);
            this.naturalBehaviorInterval = null;
            console.log('🐕 Natural behavior loop stopped');
        }
    }

    // Reset pet state
    reset() {
    logEntry('reset', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
        this.stopNaturalBehaviorLoop();
        
        // Clear training mode timeout if active
        if (this.petState.trainingTimeoutId) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petBehavior.js');
    try {
            clearTimeout(this.petState.trainingTimeoutId);
        }
        
        this.petState = {
            currentCommand: 'idle',
            isTraining: false,
            isInTraining: false,
            trainingStartTime: null,
            trainingTimeoutId: null,
            commandHistory: [],
            rewardHistory: [],
            targetX: null,
            targetY: null,
            jumpDirection: null,
            excitement: 0,
            attention: 0,
            lastClickTime: 0,
            mouseX: 0,
            mouseY: 0,
            proximityResponse: false,
            following: false,
            playMode: false,
            
            // Reset natural instincts to baseline
            naturalSitDuration: 3000,
            naturalFollowDistance: 150,
            distractionChance: 0.7,
            wanderImpulse: 0.6,
            attentionSpan: 2000,
            lastDistraction: 0,
            obedienceLevel: 0.1
        };
        this.behaviorQueue = [];
        this.lastLoggedBehavior = null; // Reset behavior logging
        this.startNaturalBehaviorLoop(); // Restart natural behaviors
        console.log('🔄 Pet behavior state reset to natural untrained state');
    }
}

module.exports = AniotaPetBehavior;

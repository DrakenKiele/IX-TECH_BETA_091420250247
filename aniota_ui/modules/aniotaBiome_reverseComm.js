
class AniotaReverseCommunication {
    constructor(parentBiome) {
        this.biome = parentBiome;
        
        // Communication Intent Recognition
        this.communicationIntents = new Map();
        this.gestureVocabulary = new Map(); // Behaviors Aniota can use to "speak"
        this.currentIntent = null;
        this.communicationHistory = [];
        
        // Reverse Behavior Patterns - Aniota's way of communicating
        this.reversePatterns = {
            'look_at_this': {
                behavior: 'move_between_points',
                meaning: 'I want you to pay attention to something',
                gesture: 'back_and_forth_movement',
                strength: 0.0,
                successRate: 0.0
            },
            'come_here': {
                behavior: 'approach_retreat_pattern', 
                meaning: 'I want you to follow me',
                gesture: 'advance_then_backup',
                strength: 0.0,
                successRate: 0.0
            },
            'play_with_me': {
                behavior: 'circle_around_cursor',
                meaning: 'I want to play',
                gesture: 'excited_orbital_movement',
                strength: 0.0,
                successRate: 0.0
            },
            'im_confused': {
                behavior: 'random_small_movements',
                meaning: 'I dont understand what you want',
                gesture: 'uncertain_micro_adjustments',
                strength: 0.0,
                successRate: 0.0
            },
            'reward_me': {
                behavior: 'sit_and_pulse',
                meaning: 'I did something good, please acknowledge',
                gesture: 'stationary_attention_seeking',
                strength: 0.0,
                successRate: 0.0
            }
        };
        
        // Learning thresholds for reverse communication
        this.communicationThreshold = 0.4; // Must have moderate behavior strength to attempt communication
        this.intentRecognitionDelay = 2000; // How long Aniota waits to see if trainer responds
        this.lastCommunicationAttempt = 0;
        this.communicationCooldown = 5000; // Don't overwhelm trainer with constant "talking"
        
        console.log('🔄 Reverse Communication System initialized - Aniota can learn to "speak" back');
    }

    // Aniota decides she wants to communicate something
    initiateReverseCommunication(intent, context = {}) {
        const now = Date.now();
        
        // Check cooldown
        if (now - this.lastCommunicationAttempt < this.communicationCooldown) {
            return null;
        }
        
        // Check if Aniota has learned this communication pattern
        const pattern = this.reversePatterns[intent];
        if (!pattern || pattern.strength < this.communicationThreshold) {
            console.log(`🤔 Aniota wants to communicate "${intent}" but hasn't learned how yet`);
            return null;
        }
        
        console.log(`🗣️ Aniota attempts to communicate: "${intent}" using ${pattern.gesture}`);
        
        this.currentIntent = {
            intent,
            pattern,
            startTime: now,
            context,
            recognized: false,
            trainerResponse: null
        };
        
        this.lastCommunicationAttempt = now;
        
        // Execute the communication behavior
        return this.executeCommunicationBehavior(pattern);
    }

    // Execute the specific behavior pattern Aniota uses to communicate
    executeCommunicationBehavior(pattern) {
        switch (pattern.behavior) {
            case 'move_between_points':
                return this.executeLookAtThis();
            case 'approach_retreat_pattern':
                return this.executeComeHere();
            case 'circle_around_cursor':
                return this.executePlayWithMe();
            case 'random_small_movements':
                return this.executeImConfused();
            case 'sit_and_pulse':
                return this.executeRewardMe();
            default:
                return null;
        }
    }

    // "Look at this" - Aniota moves back and forth between two points
    executeLookAtThis() {
        const behavior = {
            action: 'reverse_communication',
            type: 'look_at_this',
            pattern: {
                movements: [
                    { x: 100, y: 50, duration: 800 },   // Move to point A
                    { x: 150, y: 50, duration: 800 },   // Move to point B
                    { x: 100, y: 50, duration: 800 },   // Back to point A
                    { x: 150, y: 50, duration: 800 },   // Back to point B
                    { x: 125, y: 50, duration: 400 }    // Stop in middle, looking expectant
                ],
                totalDuration: 3600,
                meaning: 'I want you to look at something important'
            },
            expectsResponse: true,
            timeoutDuration: this.intentRecognitionDelay
        };
        
        console.log('🔄 Aniota: "Look at this!" (moving between points)');
        return behavior;
    }

    // "Come here" - Aniota approaches then backs away repeatedly
    executeComeHere() {
        const behavior = {
            action: 'reverse_communication', 
            type: 'come_here',
            pattern: {
                movements: [
                    { approach: 'cursor', distance: 30, duration: 600 },  // Move toward cursor
                    { retreat: 'backward', distance: 20, duration: 400 }, // Back away
                    { approach: 'cursor', distance: 25, duration: 500 },  // Approach again
                    { retreat: 'backward', distance: 15, duration: 300 }, // Back away again
                    { wait: 'expectant', duration: 800 }                  // Wait for response
                ],
                totalDuration: 2600,
                meaning: 'I want you to follow me'
            },
            expectsResponse: true,
            timeoutDuration: this.intentRecognitionDelay
        };
        
        console.log('🔄 Aniota: "Come here!" (approach-retreat pattern)');
        return behavior;
    }

    // "Play with me" - Aniota circles around cursor excitedly
    executePlayWithMe() {
        const behavior = {
            action: 'reverse_communication',
            type: 'play_with_me', 
            pattern: {
                movements: [
                    { orbit: 'cursor', radius: 40, revolutions: 1.5, duration: 1200 },
                    { bounce: 'in_place', intensity: 0.8, duration: 400 },
                    { orbit: 'cursor', radius: 35, revolutions: 1, duration: 800 },
                    { wait: 'playful', duration: 600 }
                ],
                totalDuration: 3000,
                meaning: 'I want to play with you'
            },
            expectsResponse: true,
            timeoutDuration: this.intentRecognitionDelay
        };
        
        console.log('🔄 Aniota: "Play with me!" (excited orbital movement)');
        return behavior;
    }

    // "I'm confused" - Small random movements showing uncertainty
    executeImConfused() {
        const behavior = {
            action: 'reverse_communication',
            type: 'im_confused',
            pattern: {
                movements: [
                    { wiggle: 'small', amplitude: 5, duration: 300 },
                    { pause: 'brief', duration: 200 },
                    { wiggle: 'small', amplitude: 8, duration: 400 },
                    { pause: 'brief', duration: 200 },
                    { wiggle: 'small', amplitude: 3, duration: 200 },
                    { wait: 'uncertain', duration: 700 }
                ],
                totalDuration: 2000,
                meaning: 'I dont understand what you want'
            },
            expectsResponse: true,
            timeoutDuration: this.intentRecognitionDelay
        };
        
        console.log('🔄 Aniota: "I\'m confused" (uncertain micro-movements)');
        return behavior;
    }

    // "Reward me" - Sits still but pulses to get attention
    executeRewardMe() {
        const behavior = {
            action: 'reverse_communication',
            type: 'reward_me',
            pattern: {
                movements: [
                    { sit: 'still', duration: 500 },
                    { pulse: 'gentle', intensity: 1.2, duration: 300 },
                    { sit: 'still', duration: 400 },
                    { pulse: 'gentle', intensity: 1.1, duration: 200 },
                    { wait: 'expectant', duration: 600 }
                ],
                totalDuration: 2000,
                meaning: 'I did something good, please acknowledge me'
            },
            expectsResponse: true,
            timeoutDuration: this.intentRecognitionDelay
        };
        
        console.log('🔄 Aniota: "Reward me!" (sitting and pulsing for attention)');
        return behavior;
    }

    // Process trainer's response to Aniota's communication attempt
    processTrainerResponse(responseType, responseData = {}) {
        if (!this.currentIntent) return null;
        
        const timeSinceAttempt = Date.now() - this.currentIntent.startTime;
        const intent = this.currentIntent.intent;
        const pattern = this.currentIntent.pattern;
        
        // Record the interaction
        const communicationEvent = {
            intent,
            gesture: pattern.gesture,
            meaning: pattern.meaning,
            trainerResponse: responseType,
            responseTime: timeSinceAttempt,
            successful: this.evaluateResponseSuccess(responseType, intent),
            timestamp: Date.now()
        };
        
        this.communicationHistory.push(communicationEvent);
        
        // Update pattern strength based on success
        if (communicationEvent.successful) {
            pattern.strength = Math.min(1.0, pattern.strength + 0.1);
            pattern.successRate = this.calculateSuccessRate(intent);
            console.log(`✅ Communication successful! "${intent}" strength: ${pattern.strength.toFixed(2)}`);
        } else {
            pattern.strength = Math.max(0.0, pattern.strength - 0.05);
            console.log(`❌ Communication failed. "${intent}" strength: ${pattern.strength.toFixed(2)}`);
        }
        
        this.currentIntent = null;
        return communicationEvent;
    }

    // Evaluate if trainer's response matches Aniota's intent
    evaluateResponseSuccess(responseType, intent) {
        const successMapping = {
            'look_at_this': ['cursor_move_to_area', 'click_near_aniota', 'attention_given'],
            'come_here': ['cursor_follows', 'mouse_movement_toward', 'engagement'],
            'play_with_me': ['mouse_proximity', 'playful_interaction', 'positive_token'],
            'im_confused': ['guidance_given', 'clear_command', 'positive_token'],
            'reward_me': ['positive_token', 'praise', 'acknowledgment']
        };
        
        const expectedResponses = successMapping[intent] || [];
        return expectedResponses.includes(responseType);
    }

    // Calculate success rate for a specific intent
    calculateSuccessRate(intent) {
        const intentEvents = this.communicationHistory.filter(event => event.intent === intent);
        if (intentEvents.length === 0) return 0;
        
        const successfulEvents = intentEvents.filter(event => event.successful);
        return successfulEvents.length / intentEvents.length;
    }

    // Learn new communication patterns from trainer behavior
    learnFromTrainerBehavior(trainerAction, context) {
        // If trainer uses a gesture pattern, Aniota can learn to use it too
        const gestureMapping = {
            'back_and_forth_cursor': 'look_at_this',
            'approach_retreat_cursor': 'come_here', 
            'circular_cursor_movement': 'play_with_me',
            'small_random_movements': 'im_confused',
            'stationary_clicking': 'reward_me'
        };
        
        const learnableIntent = gestureMapping[trainerAction];
        if (learnableIntent && this.reversePatterns[learnableIntent]) {
            const pattern = this.reversePatterns[learnableIntent];
            pattern.strength = Math.min(1.0, pattern.strength + 0.05);
            
            console.log(`📚 Aniota learned communication pattern: ${learnableIntent} from observing trainer`);
        }
    }

    // Auto-detect when Aniota should attempt communication
    shouldAttemptCommunication() {
        const now = Date.now();
        
        // Cooldown check
        if (now - this.lastCommunicationAttempt < this.communicationCooldown) {
            return null;
        }
        
        // Context-based communication triggers
        const triggers = [
            { condition: 'no_interaction_recently', intent: 'look_at_this', threshold: 30000 },
            { condition: 'repeated_same_action', intent: 'im_confused', threshold: 3 },
            { condition: 'successful_behavior', intent: 'reward_me', threshold: 1 },
            { condition: 'high_playfulness_mood', intent: 'play_with_me', threshold: 0.7 },
            { condition: 'trainer_nearby', intent: 'come_here', threshold: 50 }
        ];
        
        // Check each trigger condition
        for (const trigger of triggers) {
            if (this.checkTriggerCondition(trigger.condition, trigger.threshold)) {
                return trigger.intent;
            }
        }
        
        return null;
    }

    checkTriggerCondition(condition, threshold) {
        switch (condition) {
            case 'no_interaction_recently':
                const lastInteraction = this.biome.behaviorState?.lastUserActivity || 0;
                return Date.now() - lastInteraction > threshold;
                
            case 'successful_behavior':
                const recentSuccess = this.getRecentSuccessfulBehaviors(5000);
                return recentSuccess >= threshold;
                
            case 'high_playfulness_mood':
                const playfulness = this.biome.petMood?.moodState?.playfulness || 0;
                return playfulness > threshold;
                
            default:
                return false;
        }
    }

    getRecentSuccessfulBehaviors(timeWindow) {
        const now = Date.now();
        return this.communicationHistory.filter(event => 
            event.successful && (now - event.timestamp) < timeWindow
        ).length;
    }

    // Export communication learning data for research
    exportCommunicationData() {
        return {
            communicationPatterns: Object.fromEntries(
                Object.entries(this.reversePatterns).map(([intent, pattern]) => [
                    intent, 
                    {
                        strength: pattern.strength,
                        successRate: pattern.successRate,
                        meaning: pattern.meaning,
                        gesture: pattern.gesture
                    }
                ])
            ),
            communicationHistory: this.communicationHistory,
            mutualLanguageDevelopment: {
                totalCommunicationAttempts: this.communicationHistory.length,
                successfulCommunications: this.communicationHistory.filter(e => e.successful).length,
                averageResponseTime: this.calculateAverageResponseTime(),
                vocabularySize: Object.keys(this.reversePatterns).filter(
                    intent => this.reversePatterns[intent].strength > 0.3
                ).length
            }
        };
    }

    calculateAverageResponseTime() {
        if (this.communicationHistory.length === 0) return 0;
        const total = this.communicationHistory.reduce((sum, event) => sum + event.responseTime, 0);
        return total / this.communicationHistory.length;
    }

    // Reset communication learning
    reset() {
        Object.keys(this.reversePatterns).forEach(intent => {
            this.reversePatterns[intent].strength = 0.0;
            this.reversePatterns[intent].successRate = 0.0;
        });
        
        this.communicationHistory = [];
        this.currentIntent = null;
        this.lastCommunicationAttempt = 0;
        
        console.log('🔄 Reverse communication system reset');
    }
}

module.exports = AniotaReverseCommunication;

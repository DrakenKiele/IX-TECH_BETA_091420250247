
const { logEntry, logExit, log } = require('..\..\..\execution_tracer');

class AniotaTrustTokenLearning {
    constructor(parentBiome) {
    logEntry('constructor', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        this.biome = parentBiome;
        
        // Trust Foundation - starts at zero, must be earned
        this.trustLevel = 0.0; // 0.0 to 1.0
        this.tokenHistory = [];
        this.interactionHistory = [];
        
        // Learned Behaviors - initially empty, built through conditioning
        this.learnedBehaviors = new Map();
        this.behaviorStrengths = new Map();
        this.extinctionTimers = new Map();
        
        // Learning Parameters (scientifically based)
        this.learningRate = 0.15; // How quickly associations form
        this.extinctionRate = 0.05; // How quickly unused behaviors fade
        this.trustDecayRate = 0.01; // Trust slowly decays without positive reinforcement
        this.minimumTrustForLearning = 0.3; // Must have basic trust before complex learning
        
        // Conditioning State
        this.conditioningPhase = 'trust_building'; // trust_building -> pattern_recognition -> behavior_shaping
        this.lastTokenTime = 0;
        this.consecutivePositiveTokens = 0;
        this.behaviorAttempts = new Map(); // Track what Aniota tries to do
        
        console.log('🧠 Trust-Token Learning System initialized - Aniota starts with zero learned behaviors');
    }

    // Phase 1: Trust Building through Token Exchange
    receiveToken(tokenValue, context = {
    logEntry('receiveToken', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {}) {
        const timestamp = Date.now();
        const timeSinceLastToken = timestamp - this.lastTokenTime;
        
        // Record token
        const tokenEvent = {
            value: tokenValue, // -1.0 to +1.0
            timestamp,
            context,
            timingFactor: this.calculateTimingFactor(timeSinceLastToken),
            trustLevelAtTime: this.trustLevel
        };
        
        this.tokenHistory.push(tokenEvent);
        this.lastTokenTime = timestamp;
        
        // Update trust based on token pattern
        this.updateTrustLevel(tokenEvent);
        
        // Log the learning event
        console.log(`🪙 Token received: ${tokenValue.toFixed(2)}, Trust: ${this.trustLevel.toFixed(3)}, Phase: ${this.conditioningPhase}`);
        
        // Check for phase progression
        this.checkPhaseProgression();
        
        
    logExit('currentFunction', this.processTokenLearning(tokenEvent));
    return this.processTokenLearning(tokenEvent);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    updateTrustLevel(tokenEvent) {
    logEntry('updateTrustLevel', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        const { value, timingFactor } = tokenEvent;
        
        // Positive tokens build trust, negative tokens reduce it
        const trustDelta = value * 0.1 * timingFactor;
        this.trustLevel = Math.max(0, Math.min(1, this.trustLevel + trustDelta));
        
        // Track consecutive positive tokens (builds confidence)
        if (value > 0) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            this.consecutivePositiveTokens++;
        } else {
            this.consecutivePositiveTokens = 0;
        }
        
        // Bonus trust for consistency
        if (this.consecutivePositiveTokens > 3) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            this.trustLevel += 0.02; // Consistency bonus
        }
    }

    // Phase 2: Pattern Recognition - Aniota starts to associate actions with rewards
    processTokenLearning(tokenEvent) {
    logEntry('processTokenLearning', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        if (this.conditioningPhase === 'trust_building') {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            
    logExit('currentFunction', this.processTrustBuilding(tokenEvent));
    return this.processTrustBuilding(tokenEvent);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        } else if (this.conditioningPhase === 'pattern_recognition') {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            
    logExit('currentFunction', this.processPatternRecognition(tokenEvent));
    return this.processPatternRecognition(tokenEvent);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        } else if (this.conditioningPhase === 'behavior_shaping') {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            
    logExit('currentFunction', this.processBehaviorShaping(tokenEvent));
    return this.processBehaviorShaping(tokenEvent);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
    }

    processTrustBuilding(tokenEvent) {
    logEntry('processTrustBuilding', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        // In trust building phase, Aniota just responds to positive/negative tokens
        const response = {
            phase: 'trust_building',
            trustLevel: this.trustLevel,
            response: tokenEvent.value > 0 ? 'positive_acknowledgment' : 'uncertainty',
            message: tokenEvent.value > 0 ? 
                'Aniota glows brighter - building trust' : 
                'Aniota dims slightly - learning boundaries'
        };
        
        // Simple mimicry - Aniota tries to repeat what got positive tokens
        if (tokenEvent.value > 0 && tokenEvent.context.lastAction) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            this.attemptMimicry(tokenEvent.context.lastAction);
        }
        
        
    logExit('currentFunction', response);
    return response;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    processPatternRecognition(tokenEvent) {
    logEntry('processPatternRecognition', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        // Aniota starts connecting specific actions to token rewards
        if (tokenEvent.context.lastAction) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            const action = tokenEvent.context.lastAction;
            
            // Strengthen or weaken association based on token
            this.updateBehaviorStrength(action, tokenEvent.value, tokenEvent.timingFactor);
            
            
    logExit('currentFunction', {
                phase: 'pattern_recognition',
                trustLevel: this.trustLevel,
                response: 'learning_association',
                learnedPattern: action,
                strength: this.behaviorStrengths.get(action) || 0,
                message: `Aniota is learning that "${action}" leads to rewards`
            });
    return {
                phase: 'pattern_recognition',
                trustLevel: this.trustLevel,
                response: 'learning_association',
                learnedPattern: action,
                strength: this.behaviorStrengths.get(action) || 0,
                message: `Aniota is learning that "${action}" leads to rewards`
            };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
    }

    processBehaviorShaping(tokenEvent) {
    logEntry('processBehaviorShaping', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        // Advanced phase - Aniota can learn complex sequences and variations
        if (tokenEvent.context.lastAction) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            const action = tokenEvent.context.lastAction;
            
            // Update behavior strength
            this.updateBehaviorStrength(action, tokenEvent.value, tokenEvent.timingFactor);
            
            // Check for behavior sequences
            this.learnBehaviorSequences(tokenEvent);
            
            
    logExit('currentFunction', {
                phase: 'behavior_shaping',
                trustLevel: this.trustLevel,
                response: 'shaped_behavior',
                behaviorCatalog: Array.from(this.behaviorStrengths.keys()),
                dominantBehavior: this.getDominantBehavior(),
                message: `Aniota demonstrates learned behavior: ${this.getDominantBehavior()}`
            });
    return {
                phase: 'behavior_shaping',
                trustLevel: this.trustLevel,
                response: 'shaped_behavior',
                behaviorCatalog: Array.from(this.behaviorStrengths.keys()),
                dominantBehavior: this.getDominantBehavior(),
                message: `Aniota demonstrates learned behavior: ${this.getDominantBehavior()}`
            };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
    }

    // Core Learning Mechanism - Behavior Strength Updates
    updateBehaviorStrength(action, tokenValue, timingFactor) {
    logEntry('updateBehaviorStrength', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        const currentStrength = this.behaviorStrengths.get(action) || 0;
        
        // Calculate learning delta based on multiple factors
        const learningDelta = tokenValue * this.learningRate * timingFactor * this.getTrustMultiplier();
        
        // Update strength
        const newStrength = Math.max(0, Math.min(1, currentStrength + learningDelta));
        this.behaviorStrengths.set(action, newStrength);
        
        // Reset extinction timer for reinforced behaviors
        if (tokenValue > 0) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            this.extinctionTimers.delete(action);
        }
        
        console.log(`📈 Behavior "${action}" strength: ${currentStrength.toFixed(3)} → ${newStrength.toFixed(3)}`);
    }

    // Mimicry System - Aniota tries to repeat rewarded actions
    attemptMimicry(action) {
    logEntry('attemptMimicry', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        const attempt = {
            action,
            timestamp: Date.now(),
            reason: 'mimicry',
            confidence: this.trustLevel * 0.5 // Low confidence initially
        };
        
        this.behaviorAttempts.set(action, attempt);
        console.log(`🎭 Aniota attempts to mimic: ${action} (confidence: ${attempt.confidence.toFixed(2)})`);
        
        
    logExit('currentFunction', attempt);
    return attempt;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Repetition Reinforcement - Repeated patterns get stronger
    learnBehaviorSequences(tokenEvent) {
    logEntry('learnBehaviorSequences', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        const recentActions = this.getRecentActions(3); // Look at last 3 actions
        
        if (recentActions.length >= 2) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            const sequence = recentActions.join(' → ');
            const sequenceStrength = this.behaviorStrengths.get(sequence) || 0;
            
            // Sequences learn slower but become very strong
            const sequenceDelta = tokenEvent.value * (this.learningRate * 0.5) * tokenEvent.timingFactor;
            this.behaviorStrengths.set(sequence, Math.max(0, Math.min(1, sequenceStrength + sequenceDelta)));
            
            console.log(`🔗 Learning sequence: ${sequence}`);
        }
    }

    // Phase Progression Logic
    checkPhaseProgression() {
    logEntry('checkPhaseProgression', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        if (this.conditioningPhase === 'trust_building' && this.trustLevel >= this.minimumTrustForLearning) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            this.conditioningPhase = 'pattern_recognition';
            console.log('🔄 Advancing to Pattern Recognition phase');
        } else if (this.conditioningPhase === 'pattern_recognition' && this.behaviorStrengths.size >= 3 && this.trustLevel >= 0.6) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            this.conditioningPhase = 'behavior_shaping';
            console.log('🔄 Advancing to Behavior Shaping phase');
        }
    }

    // Helper Functions
    calculateTimingFactor(timeSinceLastToken) {
    logEntry('calculateTimingFactor', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        // Immediate rewards (< 2 seconds) have full impact
        // Delayed rewards diminish exponentially
        if (timeSinceLastToken < 2000) 
    logExit('currentFunction', 1.0);
    return 1.0;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        
    logExit('currentFunction', Math.exp(-timeSinceLastToken / 10000));
    return Math.exp(-timeSinceLastToken / 10000);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
} // Exponential decay
    }

    getTrustMultiplier() {
    logEntry('getTrustMultiplier', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        // Higher trust = faster learning
        
    logExit('currentFunction', 0.5 + (this.trustLevel * 0.5));
    return 0.5 + (this.trustLevel * 0.5);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    getDominantBehavior() {
    logEntry('getDominantBehavior', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        let maxStrength = 0;
        let dominantBehavior = 'none';
        
        for (const [behavior, strength] of this.behaviorStrengths) {
    logEntry('for', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            if (strength > maxStrength) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
                maxStrength = strength;
                dominantBehavior = behavior;
            }
        }
        
        
    logExit('currentFunction', dominantBehavior);
    return dominantBehavior;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    getRecentActions(count) {
    logEntry('getRecentActions', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        
    logExit('currentFunction', this.interactionHistory
            .slice(-count)
            .map(interaction => interaction.action)
            .filter(action => action));
    return this.interactionHistory
            .slice(-count)
            .map(interaction => interaction.action)
            .filter(action => action);
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Extinction Process - Unused behaviors fade over time
    processExtinction() {
    logEntry('processExtinction', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        const now = Date.now();
        const extinctionThreshold = 30000; // 30 seconds without reinforcement
        
        for (const [behavior, strength] of this.behaviorStrengths) {
    logEntry('for', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            const lastReinforcement = this.getLastReinforcementTime(behavior);
            
            if (now - lastReinforcement > extinctionThreshold) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
                const newStrength = strength - this.extinctionRate;
                
                if (newStrength <= 0) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
                    this.behaviorStrengths.delete(behavior);
                    console.log(`💀 Behavior "${behavior}" extinguished through lack of reinforcement`);
                } else {
                    this.behaviorStrengths.set(behavior, newStrength);
                }
            }
        }
        
        // Trust also decays slowly without positive interaction
        this.trustLevel = Math.max(0, this.trustLevel - this.trustDecayRate);
    }

    getLastReinforcementTime(behavior) {
    logEntry('getLastReinforcementTime', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        // Find the last time this behavior was positively reinforced
        for (let i = this.tokenHistory.length - 1; i >= 0; i--) {
    logEntry('for', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            const token = this.tokenHistory[i];
            if (token.context.lastAction === behavior && token.value > 0) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
                
    logExit('currentFunction', token.timestamp);
    return token.timestamp;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
            }
        }
        
    logExit('currentFunction', 0);
    return 0;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Research Data Export
    exportLearningData() {
    logEntry('exportLearningData', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        
    logExit('currentFunction', {
            trustLevel: this.trustLevel,
            conditioningPhase: this.conditioningPhase,
            learnedBehaviors: Object.fromEntries(this.behaviorStrengths),
            tokenHistory: this.tokenHistory,
            interactionHistory: this.interactionHistory,
            learningMetrics: {
                totalTokens: this.tokenHistory.length,
                positiveTokens: this.tokenHistory.filter(t => t.value > 0).length,
                behaviorCount: this.behaviorStrengths.size,
                averageBehaviorStrength: this.getAverageBehaviorStrength(),
                learningEfficiency: this.calculateLearningEfficiency()
            }
        });
    return {
            trustLevel: this.trustLevel,
            conditioningPhase: this.conditioningPhase,
            learnedBehaviors: Object.fromEntries(this.behaviorStrengths),
            tokenHistory: this.tokenHistory,
            interactionHistory: this.interactionHistory,
            learningMetrics: {
                totalTokens: this.tokenHistory.length,
                positiveTokens: this.tokenHistory.filter(t => t.value > 0).length,
                behaviorCount: this.behaviorStrengths.size,
                averageBehaviorStrength: this.getAverageBehaviorStrength(),
                learningEfficiency: this.calculateLearningEfficiency()
            }
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    getAverageBehaviorStrength() {
    logEntry('getAverageBehaviorStrength', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        if (this.behaviorStrengths.size === 0) 
    logExit('currentFunction', 0);
    return 0;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        const total = Array.from(this.behaviorStrengths.values()).reduce((sum, strength) => sum + strength, 0);
        
    logExit('currentFunction', total / this.behaviorStrengths.size);
    return total / this.behaviorStrengths.size;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    calculateLearningEfficiency() {
    logEntry('calculateLearningEfficiency', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        // How quickly Aniota learns (behaviors per token)
        if (this.tokenHistory.length === 0) 
    logExit('currentFunction', 0);
    return 0;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        
    logExit('currentFunction', this.behaviorStrengths.size / this.tokenHistory.length);
    return this.behaviorStrengths.size / this.tokenHistory.length;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Record user interaction for learning context
    recordInteraction(action, context = {
    logEntry('recordInteraction', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {}) {
        this.interactionHistory.push({
            action,
            timestamp: Date.now(),
            context,
            trustLevelAtTime: this.trustLevel,
            phase: this.conditioningPhase
        });
        
        // Keep only recent history (last 100 interactions)
        if (this.interactionHistory.length > 100) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
            this.interactionHistory.shift();
        }
    }

    // Update observed action for learning context
    updateObservedAction(action) {
    logEntry('updateObservedAction', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        this.lastObservedAction = {
            action: action,
            timestamp: Date.now(),
            trustLevel: this.trustLevel,
            phase: this.conditioningPhase
        };
        
        // Log the observation for learning context
        console.log(`👁️ Observed action: ${action} (Trust: ${this.trustLevel.toFixed(2)}, Phase: ${this.conditioningPhase})`);
    }

    // Reset learning (for research purposes)
    resetLearning() {
    logEntry('resetLearning', 'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js');
    try {
        this.trustLevel = 0.0;
        this.tokenHistory = [];
        this.interactionHistory = [];
        this.learnedBehaviors.clear();
        this.behaviorStrengths.clear();
        this.extinctionTimers.clear();
        this.conditioningPhase = 'trust_building';
        this.consecutivePositiveTokens = 0;
        
        console.log('🔄 Learning system reset - Aniota starts fresh');
    }
}

module.exports = AniotaTrustTokenLearning;


class AniotaTrustTokenLearning {
    constructor(parentBiome) {
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
    receiveToken(tokenValue, context = {}) {
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
        
        return this.processTokenLearning(tokenEvent);
    }

    updateTrustLevel(tokenEvent) {
        const { value, timingFactor } = tokenEvent;
        
        // Positive tokens build trust, negative tokens reduce it
        const trustDelta = value * 0.1 * timingFactor;
        this.trustLevel = Math.max(0, Math.min(1, this.trustLevel + trustDelta));
        
        // Track consecutive positive tokens (builds confidence)
        if (value > 0) {
            this.consecutivePositiveTokens++;
        } else {
            this.consecutivePositiveTokens = 0;
        }
        
        // Bonus trust for consistency
        if (this.consecutivePositiveTokens > 3) {
            this.trustLevel += 0.02; // Consistency bonus
        }
    }

    // Phase 2: Pattern Recognition - Aniota starts to associate actions with rewards
    processTokenLearning(tokenEvent) {
        if (this.conditioningPhase === 'trust_building') {
            return this.processTrustBuilding(tokenEvent);
        } else if (this.conditioningPhase === 'pattern_recognition') {
            return this.processPatternRecognition(tokenEvent);
        } else if (this.conditioningPhase === 'behavior_shaping') {
            return this.processBehaviorShaping(tokenEvent);
        }
    }

    processTrustBuilding(tokenEvent) {
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
            this.attemptMimicry(tokenEvent.context.lastAction);
        }
        
        return response;
    }

    processPatternRecognition(tokenEvent) {
        // Aniota starts connecting specific actions to token rewards
        if (tokenEvent.context.lastAction) {
            const action = tokenEvent.context.lastAction;
            
            // Strengthen or weaken association based on token
            this.updateBehaviorStrength(action, tokenEvent.value, tokenEvent.timingFactor);
            
            return {
                phase: 'pattern_recognition',
                trustLevel: this.trustLevel,
                response: 'learning_association',
                learnedPattern: action,
                strength: this.behaviorStrengths.get(action) || 0,
                message: `Aniota is learning that "${action}" leads to rewards`
            };
        }
    }

    processBehaviorShaping(tokenEvent) {
        // Advanced phase - Aniota can learn complex sequences and variations
        if (tokenEvent.context.lastAction) {
            const action = tokenEvent.context.lastAction;
            
            // Update behavior strength
            this.updateBehaviorStrength(action, tokenEvent.value, tokenEvent.timingFactor);
            
            // Check for behavior sequences
            this.learnBehaviorSequences(tokenEvent);
            
            return {
                phase: 'behavior_shaping',
                trustLevel: this.trustLevel,
                response: 'shaped_behavior',
                behaviorCatalog: Array.from(this.behaviorStrengths.keys()),
                dominantBehavior: this.getDominantBehavior(),
                message: `Aniota demonstrates learned behavior: ${this.getDominantBehavior()}`
            };
        }
    }

    // Core Learning Mechanism - Behavior Strength Updates
    updateBehaviorStrength(action, tokenValue, timingFactor) {
        const currentStrength = this.behaviorStrengths.get(action) || 0;
        
        // Calculate learning delta based on multiple factors
        const learningDelta = tokenValue * this.learningRate * timingFactor * this.getTrustMultiplier();
        
        // Update strength
        const newStrength = Math.max(0, Math.min(1, currentStrength + learningDelta));
        this.behaviorStrengths.set(action, newStrength);
        
        // Reset extinction timer for reinforced behaviors
        if (tokenValue > 0) {
            this.extinctionTimers.delete(action);
        }
        
        console.log(`📈 Behavior "${action}" strength: ${currentStrength.toFixed(3)} → ${newStrength.toFixed(3)}`);
    }

    // Mimicry System - Aniota tries to repeat rewarded actions
    attemptMimicry(action) {
        const attempt = {
            action,
            timestamp: Date.now(),
            reason: 'mimicry',
            confidence: this.trustLevel * 0.5 // Low confidence initially
        };
        
        this.behaviorAttempts.set(action, attempt);
        console.log(`🎭 Aniota attempts to mimic: ${action} (confidence: ${attempt.confidence.toFixed(2)})`);
        
        return attempt;
    }

    // Repetition Reinforcement - Repeated patterns get stronger
    learnBehaviorSequences(tokenEvent) {
        const recentActions = this.getRecentActions(3); // Look at last 3 actions
        
        if (recentActions.length >= 2) {
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
        if (this.conditioningPhase === 'trust_building' && this.trustLevel >= this.minimumTrustForLearning) {
            this.conditioningPhase = 'pattern_recognition';
            console.log('🔄 Advancing to Pattern Recognition phase');
        } else if (this.conditioningPhase === 'pattern_recognition' && this.behaviorStrengths.size >= 3 && this.trustLevel >= 0.6) {
            this.conditioningPhase = 'behavior_shaping';
            console.log('🔄 Advancing to Behavior Shaping phase');
        }
    }

    // Helper Functions
    calculateTimingFactor(timeSinceLastToken) {
        // Immediate rewards (< 2 seconds) have full impact
        // Delayed rewards diminish exponentially
        if (timeSinceLastToken < 2000) return 1.0;
        return Math.exp(-timeSinceLastToken / 10000); // Exponential decay
    }

    getTrustMultiplier() {
        // Higher trust = faster learning
        return 0.5 + (this.trustLevel * 0.5);
    }

    getDominantBehavior() {
        let maxStrength = 0;
        let dominantBehavior = 'none';
        
        for (const [behavior, strength] of this.behaviorStrengths) {
            if (strength > maxStrength) {
                maxStrength = strength;
                dominantBehavior = behavior;
            }
        }
        
        return dominantBehavior;
    }

    getRecentActions(count) {
        return this.interactionHistory
            .slice(-count)
            .map(interaction => interaction.action)
            .filter(action => action);
    }

    // Extinction Process - Unused behaviors fade over time
    processExtinction() {
        const now = Date.now();
        const extinctionThreshold = 30000; // 30 seconds without reinforcement
        
        for (const [behavior, strength] of this.behaviorStrengths) {
            const lastReinforcement = this.getLastReinforcementTime(behavior);
            
            if (now - lastReinforcement > extinctionThreshold) {
                const newStrength = strength - this.extinctionRate;
                
                if (newStrength <= 0) {
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
        // Find the last time this behavior was positively reinforced
        for (let i = this.tokenHistory.length - 1; i >= 0; i--) {
            const token = this.tokenHistory[i];
            if (token.context.lastAction === behavior && token.value > 0) {
                return token.timestamp;
            }
        }
        return 0;
    }

    // Research Data Export
    exportLearningData() {
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
    }

    getAverageBehaviorStrength() {
        if (this.behaviorStrengths.size === 0) return 0;
        const total = Array.from(this.behaviorStrengths.values()).reduce((sum, strength) => sum + strength, 0);
        return total / this.behaviorStrengths.size;
    }

    calculateLearningEfficiency() {
        // How quickly Aniota learns (behaviors per token)
        if (this.tokenHistory.length === 0) return 0;
        return this.behaviorStrengths.size / this.tokenHistory.length;
    }

    // Record user interaction for learning context
    recordInteraction(action, context = {}) {
        this.interactionHistory.push({
            action,
            timestamp: Date.now(),
            context,
            trustLevelAtTime: this.trustLevel,
            phase: this.conditioningPhase
        });
        
        // Keep only recent history (last 100 interactions)
        if (this.interactionHistory.length > 100) {
            this.interactionHistory.shift();
        }
    }

    // Update observed action for learning context
    updateObservedAction(action) {
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

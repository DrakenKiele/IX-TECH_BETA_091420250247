

class AniotaLearningEngine {
    constructor(parentBiome) {
        this.biome = parentBiome;
        
        // Core learning parameters
        this.learningConfig = {
            learningRate: 0.3,           // How quickly Aniota adapts (0.1 - 0.9)
            extinctionRate: 0.05,        // How quickly unrewarded behaviors fade
            memoryWindow: 20,            // Number of recent interactions to remember
            confidenceThreshold: 0.7,    // Confidence needed for strong response
            timingDecayRate: 0.1,        // How quickly delayed rewards lose impact
            consistencyBonus: 1.5        // Multiplier for repeated patterns
        };
        
        // Behavioral state tracking
        this.behaviorStrengths = {
            'click_response': 0.1,        // Initial weak association
            'proximity_play': 0.2,        // Slightly stronger natural behavior
            'double_click_stay': 0.1,     // Learned behavior
            'come_command': 0.05,         // Complex learned behavior
            'jump_command': 0.05,         // Complex learned behavior
            'ignore_response': 0.8        // Strong default - ignore when no attention
        };
        
        // Reward memory for pattern recognition
        this.rewardMemory = [];
        this.interactionHistory = [];
        
        // Token system
        this.tokenBalance = 0;
        this.rewardTokens = {
            'positive': 1.0,     // Strong positive reinforcement
            'mild_positive': 0.3, // Mild encouragement
            'neutral': 0.0,      // No reinforcement
            'mild_negative': -0.2, // Mild discouragement
            'negative': -0.5     // Strong negative reinforcement
        };
        
        console.log('🧠 Learning Engine initialized with authentic conditioning');
    }

    // Process an interaction and determine Aniota's response based on learned behavior
    processInteraction(interactionType, context = {}) {
        const timestamp = Date.now();
        
        // Record the interaction
        this.recordInteraction(interactionType, context, timestamp);
        
        // Calculate response strength based on learned associations
        const responseStrength = this.calculateResponseStrength(interactionType);
        const confidence = this.calculateConfidence(interactionType);
        
        // Determine actual response based on probability
        const willRespond = Math.random() < responseStrength;
        const responseIntensity = responseStrength * confidence;
        
        console.log(`🧠 Interaction: ${interactionType}, Strength: ${responseStrength.toFixed(3)}, Confidence: ${confidence.toFixed(3)}, Will Respond: ${willRespond}`);
        
        return {
            interactionType,
            willRespond,
            responseStrength,
            confidence,
            responseIntensity,
            suggestedBehavior: this.selectBehavior(interactionType, responseIntensity),
            expectingReward: willRespond // Aniota expects feedback if she responds
        };
    }

    // Calculate how strongly Aniota should respond to a specific interaction
    calculateResponseStrength(interactionType) {
        const baseStrength = this.behaviorStrengths[interactionType] || 0.1;
        
        // Apply recent reward history influence
        const recentRewardInfluence = this.calculateRecentRewardInfluence(interactionType);
        
        // Apply pattern recognition bonus
        const patternBonus = this.calculatePatternBonus(interactionType);
        
        // Calculate final strength with bounds [0, 1]
        const finalStrength = Math.max(0, Math.min(1, 
            baseStrength + recentRewardInfluence + patternBonus
        ));
        
        return finalStrength;
    }

    // Calculate confidence in the response based on consistency of past rewards
    calculateConfidence(interactionType) {
        const recentInteractions = this.getRecentInteractions(interactionType, 5);
        
        if (recentInteractions.length < 2) {
            return 0.5; // Neutral confidence with little data
        }
        
        const rewardVariance = this.calculateRewardVariance(recentInteractions);
        const consistency = Math.max(0, 1 - rewardVariance);
        
        return Math.max(0.1, Math.min(1.0, consistency));
    }

    // Apply token-based reward and update behavior strengths
    applyReward(interactionType, rewardType, timingDelay = 0) {
        const rewardValue = this.rewardTokens[rewardType] || 0;
        const timestamp = Date.now();
        
        // Calculate timing factor (immediate rewards are stronger)
        const timingFactor = Math.exp(-timingDelay * this.learningConfig.timingDecayRate);
        
        // Calculate consistency bonus
        const consistencyBonus = this.calculateConsistencyBonus(interactionType, rewardType);
        
        // Apply learning equation
        const learningDelta = rewardValue * this.learningConfig.learningRate * timingFactor * consistencyBonus;
        
        // Update behavior strength
        const currentStrength = this.behaviorStrengths[interactionType] || 0.1;
        this.behaviorStrengths[interactionType] = Math.max(0, Math.min(1, currentStrength + learningDelta));
        
        // Record reward for future pattern recognition
        this.recordReward(interactionType, rewardType, rewardValue, timingFactor, timestamp);
        
        // Update token balance
        this.tokenBalance += Math.abs(rewardValue);
        
        console.log(`🎯 Reward Applied: ${interactionType} -> ${rewardType} (${rewardValue})`);
        console.log(`📈 New Strength: ${this.behaviorStrengths[interactionType].toFixed(3)}, Tokens: ${this.tokenBalance.toFixed(1)}`);
        
        return {
            interactionType,
            rewardType,
            rewardValue,
            newStrength: this.behaviorStrengths[interactionType],
            learningDelta,
            timingFactor,
            consistencyBonus
        };
    }

    // Calculate recent reward influence on behavior strength
    calculateRecentRewardInfluence(interactionType) {
        const recentRewards = this.getRecentRewards(interactionType, 5);
        
        if (recentRewards.length === 0) return 0;
        
        // Weight recent rewards more heavily
        let influence = 0;
        recentRewards.forEach((reward, index) => {
            const recencyWeight = (recentRewards.length - index) / recentRewards.length;
            influence += reward.value * recencyWeight * 0.1; // Scale down influence
        });
        
        return influence;
    }

    // Calculate pattern recognition bonus
    calculatePatternBonus(interactionType) {
        const recentPattern = this.getRecentInteractionPattern(interactionType, 3);
        
        if (recentPattern.length < 2) return 0;
        
        // Check if there's a consistent pattern
        const isConsistent = recentPattern.every(interaction => 
            interaction.interactionType === interactionType
        );
        
        return isConsistent ? 0.1 : 0;
    }

    // Calculate consistency bonus for rewards
    calculateConsistencyBonus(interactionType, rewardType) {
        const recentRewards = this.getRecentRewards(interactionType, 3);
        
        if (recentRewards.length < 2) return 1.0;
        
        const sameRewardType = recentRewards.filter(r => r.type === rewardType).length;
        const consistencyRatio = sameRewardType / recentRewards.length;
        
        return 1.0 + (consistencyRatio * (this.learningConfig.consistencyBonus - 1.0));
    }

    // Natural extinction - behaviors fade without reinforcement
    applyExtinction() {
        Object.keys(this.behaviorStrengths).forEach(behavior => {
            const timeSinceLastReward = this.getTimeSinceLastReward(behavior);
            
            if (timeSinceLastReward > 30000) { // 30 seconds without reward
                const extinctionAmount = this.learningConfig.extinctionRate * (timeSinceLastReward / 60000);
                this.behaviorStrengths[behavior] = Math.max(0.05, 
                    this.behaviorStrengths[behavior] - extinctionAmount
                );
            }
        });
    }

    // Select appropriate behavior based on response intensity
    selectBehavior(interactionType, intensity) {
        const behaviors = {
            'click_response': [
                { threshold: 0.8, behavior: 'enthusiastic_response', animation: 'excited_pulse' },
                { threshold: 0.5, behavior: 'normal_response', animation: 'gentle_pulse' },
                { threshold: 0.2, behavior: 'weak_response', animation: 'subtle_glow' },
                { threshold: 0.0, behavior: 'no_response', animation: 'ignore' }
            ],
            'proximity_play': [
                { threshold: 0.7, behavior: 'playful_circles', animation: 'spinning_rings' },
                { threshold: 0.4, behavior: 'interested_approach', animation: 'ring_pulse' },
                { threshold: 0.1, behavior: 'cautious_attention', animation: 'dim_glow' },
                { threshold: 0.0, behavior: 'ignore', animation: 'no_change' }
            ]
        };
        
        const behaviorSet = behaviors[interactionType] || behaviors['click_response'];
        
        for (let option of behaviorSet) {
            if (intensity >= option.threshold) {
                return option;
            }
        }
        
        return behaviorSet[behaviorSet.length - 1]; // Default to lowest threshold
    }

    // Helper methods for data management
    recordInteraction(interactionType, context, timestamp) {
        this.interactionHistory.push({
            interactionType,
            context,
            timestamp,
            id: Date.now() + Math.random()
        });
        
        // Keep only recent history
        if (this.interactionHistory.length > this.learningConfig.memoryWindow) {
            this.interactionHistory.shift();
        }
    }

    recordReward(interactionType, rewardType, value, timingFactor, timestamp) {
        this.rewardMemory.push({
            interactionType,
            type: rewardType,
            value,
            timingFactor,
            timestamp,
            id: Date.now() + Math.random()
        });
        
        // Keep only recent rewards
        if (this.rewardMemory.length > this.learningConfig.memoryWindow) {
            this.rewardMemory.shift();
        }
    }

    getRecentInteractions(interactionType, count) {
        return this.interactionHistory
            .filter(interaction => interaction.interactionType === interactionType)
            .slice(-count);
    }

    getRecentRewards(interactionType, count) {
        return this.rewardMemory
            .filter(reward => reward.interactionType === interactionType)
            .slice(-count);
    }

    getRecentInteractionPattern(interactionType, count) {
        return this.interactionHistory.slice(-count);
    }

    calculateRewardVariance(rewards) {
        if (rewards.length < 2) return 0;
        
        const values = rewards.map(r => r.value);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        
        return variance;
    }

    getTimeSinceLastReward(interactionType) {
        const relevantRewards = this.rewardMemory.filter(r => r.interactionType === interactionType);
        
        if (relevantRewards.length === 0) return Infinity;
        
        const lastReward = relevantRewards[relevantRewards.length - 1];
        return Date.now() - lastReward.timestamp;
    }

    // Get current learning state for debugging/visualization
    getLearningState() {
        return {
            behaviorStrengths: { ...this.behaviorStrengths },
            tokenBalance: this.tokenBalance,
            recentInteractions: this.interactionHistory.slice(-5),
            recentRewards: this.rewardMemory.slice(-5),
            extinctionStatus: this.calculateExtinctionStatus()
        };
    }

    calculateExtinctionStatus() {
        const status = {};
        Object.keys(this.behaviorStrengths).forEach(behavior => {
            const timeSinceReward = this.getTimeSinceLastReward(behavior);
            status[behavior] = {
                strength: this.behaviorStrengths[behavior],
                timeSinceReward,
                isExtinguishing: timeSinceReward > 30000
            };
        });
        return status;
    }

    // Reset learning state (for testing or starting fresh)
    reset() {
        this.behaviorStrengths = {
            'click_response': 0.1,
            'proximity_play': 0.2,
            'double_click_stay': 0.1,
            'come_command': 0.05,
            'jump_command': 0.05,
            'ignore_response': 0.8
        };
        
        this.rewardMemory = [];
        this.interactionHistory = [];
        this.tokenBalance = 0;
        
        console.log('🔄 Learning Engine reset to initial state');
    }
}

module.exports = AniotaLearningEngine;

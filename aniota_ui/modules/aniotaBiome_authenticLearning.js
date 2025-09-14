
class AniotaAuthenticLearning {
    constructor(parentBiome) {
        this.biome = parentBiome;
        
        // Core learning parameters (scientifically based)
        this.learningConfig = {
            baseLearningRate: 0.15,        // α - How quickly associations form
            decayRate: 0.02,               // γ - Natural forgetting rate
            extinctionRate: 0.05,          // How quickly unreinforced behaviors fade
            reinforcementThreshold: 0.3,   // Minimum strength to manifest behavior
            consistencyBonus: 0.1,         // Bonus for repeated patterns
            timingWindow: 3000             // ms - Window for immediate reinforcement
        };
        
        // Behavioral association matrix - Core of authentic learning
        this.behaviorMatrix = {
            // Each behavior has strength, confidence, and extinction values
            'click_response': {
                strength: 0.0,           // -1.0 to 1.0 (learned association strength)
                confidence: 0.0,         // How certain Aniota is about this behavior
                lastReinforced: 0,       // Timestamp of last reinforcement
                reinforcementHistory: [], // Pattern of rewards/punishments
                extinctionLevel: 0.0,    // How much behavior has been extinguished
                manifestationCount: 0,   // How many times behavior was expressed
                successRate: 0.0         // Success rate of this behavior
            },
            'proximity_response': {
                strength: 0.0,
                confidence: 0.0,
                lastReinforced: 0,
                reinforcementHistory: [],
                extinctionLevel: 0.0,
                manifestationCount: 0,
                successRate: 0.0
            },
            'movement_following': {
                strength: 0.0,
                confidence: 0.0,
                lastReinforced: 0,
                reinforcementHistory: [],
                extinctionLevel: 0.0,
                manifestationCount: 0,
                successRate: 0.0
            },
            'attention_seeking': {
                strength: 0.0,
                confidence: 0.0,
                lastReinforced: 0,
                reinforcementHistory: [],
                extinctionLevel: 0.0,
                manifestationCount: 0,
                successRate: 0.0
            }
        };
        
        // Research data collection
        this.researchData = {
            sessionStartTime: Date.now(),
            totalInteractions: 0,
            reinforcementEvents: [],
            behaviorManifestations: [],
            learningCurveData: [],
            extinctionEvents: []
        };
        
        // Current learning state
        this.learningState = {
            isLearning: true,
            currentBehavior: null,
            lastAction: null,
            lastActionTime: 0,
            pendingReinforcement: false,
            rewardExpectation: 0.0
        };
        
        console.log('🧠 Authentic Learning Engine initialized - Research mode active');
    }

    // Core learning function - implements authentic behavioral conditioning
    processReinforcement(behaviorKey, rewardValue, timing = 'immediate') {
        if (!this.behaviorMatrix[behaviorKey]) {
            console.error(`Unknown behavior: ${behaviorKey}`);
            return false;
        }
        
        const behavior = this.behaviorMatrix[behaviorKey];
        const now = Date.now();
        
        // Calculate timing factor (crucial for authentic learning)
        let timingFactor = 1.0;
        if (timing !== 'immediate') {
            const delay = now - this.learningState.lastActionTime;
            timingFactor = Math.exp(-delay / this.learningConfig.timingWindow);
        }
        
        // Calculate consistency bonus
        const recentRewards = behavior.reinforcementHistory.slice(-5);
        const consistencyFactor = this.calculateConsistency(recentRewards, rewardValue);
        
        // Core learning equation - scientifically based
        const learningDelta = 
            rewardValue * 
            this.learningConfig.baseLearningRate * 
            timingFactor * 
            (1 + consistencyFactor * this.learningConfig.consistencyBonus);
        
        // Update behavior strength
        const oldStrength = behavior.strength;
        behavior.strength = Math.max(-1.0, Math.min(1.0, behavior.strength + learningDelta));
        
        // Update confidence based on consistency
        behavior.confidence = Math.min(1.0, behavior.confidence + Math.abs(learningDelta) * 0.1);
        
        // Update success rate
        if (rewardValue > 0) {
            behavior.successRate = (behavior.successRate * behavior.manifestationCount + 1) / (behavior.manifestationCount + 1);
        } else if (rewardValue < 0) {
            behavior.successRate = (behavior.successRate * behavior.manifestationCount) / (behavior.manifestationCount + 1);
        }
        
        // Record reinforcement event
        behavior.reinforcementHistory.push({
            timestamp: now,
            rewardValue,
            timingFactor,
            consistencyFactor,
            oldStrength,
            newStrength: behavior.strength,
            learningDelta
        });
        
        behavior.lastReinforced = now;
        
        // Research data collection
        this.recordLearningEvent(behaviorKey, rewardValue, learningDelta, timingFactor);
        
        console.log(`🧠 Learning: ${behaviorKey} | Reward: ${rewardValue} | Strength: ${oldStrength.toFixed(3)} → ${behavior.strength.toFixed(3)} | Δ: ${learningDelta.toFixed(3)}`);
        
        return {
            behaviorKey,
            oldStrength,
            newStrength: behavior.strength,
            learningDelta,
            timingFactor,
            consistencyFactor,
            confidence: behavior.confidence
        };
    }

    // Calculate behavioral probability based on learned associations
    calculateBehaviorProbability(behaviorKey) {
        const behavior = this.behaviorMatrix[behaviorKey];
        
        if (!behavior) return 0.0;
        
        // Apply natural decay over time
        this.applyNaturalDecay(behavior);
        
        // Base probability from strength
        let probability = Math.max(0, behavior.strength);
        
        // Confidence modifier
        probability *= (0.5 + behavior.confidence * 0.5);
        
        // Extinction factor
        probability *= (1.0 - behavior.extinctionLevel);
        
        // Threshold check
        if (probability < this.learningConfig.reinforcementThreshold) {
            probability = 0.0;
        }
        
        return Math.min(1.0, probability);
    }

    // Determine if a behavior should manifest based on learned associations
    shouldManifestBehavior(behaviorKey, contextFactors = {}) {
        const probability = this.calculateBehaviorProbability(behaviorKey);
        const randomFactor = Math.random();
        
        // Add context modifiers
        let contextModifier = 1.0;
        if (contextFactors.userPresent) contextModifier *= 1.2;
        if (contextFactors.recentReward) contextModifier *= 1.3;
        if (contextFactors.stressLevel) contextModifier *= (1.0 - contextFactors.stressLevel * 0.3);
        
        const finalProbability = probability * contextModifier;
        const willManifest = randomFactor < finalProbability;
        
        if (willManifest) {
            this.behaviorMatrix[behaviorKey].manifestationCount++;
            this.recordBehaviorManifestation(behaviorKey, finalProbability);
        }
        
        console.log(`🎭 Behavior Check: ${behaviorKey} | P=${probability.toFixed(3)} | Context=${contextModifier.toFixed(2)} | Final=${finalProbability.toFixed(3)} | Manifest=${willManifest}`);
        
        return {
            willManifest,
            probability: finalProbability,
            baseProbability: probability,
            contextModifier
        };
    }

    // Apply natural forgetting and extinction
    applyNaturalDecay(behavior) {
        const now = Date.now();
        const timeSinceReinforcement = now - behavior.lastReinforced;
        
        if (timeSinceReinforcement > 0) {
            // Natural decay towards neutral (0.0)
            const decayFactor = Math.exp(-timeSinceReinforcement / (60000 * 60)); // 1 hour half-life
            
            if (behavior.strength > 0) {
                behavior.strength *= decayFactor;
            } else if (behavior.strength < 0) {
                behavior.strength *= decayFactor;
            }
            
            // Confidence also decays
            behavior.confidence *= decayFactor;
        }
    }

    // Calculate consistency in reinforcement patterns
    calculateConsistency(recentRewards, currentReward) {
        if (recentRewards.length === 0) return 0.0;
        
        const rewardSigns = recentRewards.map(r => Math.sign(r.rewardValue));
        const currentSign = Math.sign(currentReward);
        
        const consistentRewards = recentRewards.filter(r => Math.sign(r.rewardValue) === currentSign).length;
        return consistentRewards / recentRewards.length;
    }

    // Record learning event for research analysis
    recordLearningEvent(behaviorKey, rewardValue, learningDelta, timingFactor) {
        this.researchData.reinforcementEvents.push({
            timestamp: Date.now(),
            behaviorKey,
            rewardValue,
            learningDelta,
            timingFactor,
            sessionTime: Date.now() - this.researchData.sessionStartTime,
            totalInteractions: this.researchData.totalInteractions++
        });
        
        // Sample learning curve data every 10 events
        if (this.researchData.reinforcementEvents.length % 10 === 0) {
            this.recordLearningCurvePoint();
        }
    }

    recordBehaviorManifestation(behaviorKey, probability) {
        this.researchData.behaviorManifestations.push({
            timestamp: Date.now(),
            behaviorKey,
            probability,
            sessionTime: Date.now() - this.researchData.sessionStartTime
        });
    }

    recordLearningCurvePoint() {
        const dataPoint = {
            timestamp: Date.now(),
            sessionTime: Date.now() - this.researchData.sessionStartTime,
            behaviorStrengths: {},
            averageConfidence: 0,
            totalManifestations: 0
        };
        
        let totalConfidence = 0;
        let behaviorCount = 0;
        
        Object.keys(this.behaviorMatrix).forEach(key => {
            const behavior = this.behaviorMatrix[key];
            dataPoint.behaviorStrengths[key] = behavior.strength;
            totalConfidence += behavior.confidence;
            dataPoint.totalManifestations += behavior.manifestationCount;
            behaviorCount++;
        });
        
        dataPoint.averageConfidence = totalConfidence / behaviorCount;
        this.researchData.learningCurveData.push(dataPoint);
    }

    // Generate scientific research report
    generateResearchReport() {
        const report = {
            metadata: {
                sessionDuration: Date.now() - this.researchData.sessionStartTime,
                totalReinforcements: this.researchData.reinforcementEvents.length,
                totalManifestations: this.researchData.behaviorManifestations.length,
                generatedAt: new Date().toISOString()
            },
            learningParameters: this.learningConfig,
            finalBehaviorState: {},
            learningCurve: this.researchData.learningCurveData,
            behaviorAnalysis: {},
            statisticalSummary: {}
        };
        
        // Analyze each behavior
        Object.keys(this.behaviorMatrix).forEach(key => {
            const behavior = this.behaviorMatrix[key];
            report.finalBehaviorState[key] = {
                finalStrength: behavior.strength,
                confidence: behavior.confidence,
                manifestationCount: behavior.manifestationCount,
                successRate: behavior.successRate,
                extinctionLevel: behavior.extinctionLevel
            };
            
            // Calculate learning statistics
            const reinforcements = behavior.reinforcementHistory;
            if (reinforcements.length > 0) {
                const strengthChanges = reinforcements.map(r => r.learningDelta);
                report.behaviorAnalysis[key] = {
                    totalReinforcements: reinforcements.length,
                    averageLearningDelta: strengthChanges.reduce((a, b) => a + b, 0) / strengthChanges.length,
                    learningVariance: this.calculateVariance(strengthChanges),
                    firstReinforcement: reinforcements[0].timestamp,
                    lastReinforcement: reinforcements[reinforcements.length - 1].timestamp,
                    learningTrajectory: reinforcements.map(r => ({
                        time: r.timestamp - this.researchData.sessionStartTime,
                        strength: r.newStrength
                    }))
                };
            }
        });
        
        console.log('📊 Research Report Generated:', report);
        return report;
    }

    calculateVariance(values) {
        if (values.length === 0) return 0;
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
        return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    }

    // Validate learning authenticity
    validateLearningAuthenticity() {
        const validation = {
            isAuthentic: true,
            reasons: [],
            concerns: [],
            confidence: 0.0
        };
        
        // Check for authentic learning patterns
        const behaviorKeys = Object.keys(this.behaviorMatrix);
        let authenticPatterns = 0;
        
        behaviorKeys.forEach(key => {
            const behavior = this.behaviorMatrix[key];
            
            // Check if behavior shows learning curve
            if (behavior.reinforcementHistory.length > 5) {
                const early = behavior.reinforcementHistory.slice(0, 3).map(r => r.newStrength);
                const late = behavior.reinforcementHistory.slice(-3).map(r => r.newStrength);
                
                const earlyAvg = early.reduce((a, b) => a + b, 0) / early.length;
                const lateAvg = late.reduce((a, b) => a + b, 0) / late.length;
                
                if (Math.abs(lateAvg - earlyAvg) > 0.1) {
                    authenticPatterns++;
                    validation.reasons.push(`${key} shows clear learning progression`);
                }
            }
            
            // Check for extinction patterns
            if (behavior.extinctionLevel > 0.1) {
                validation.reasons.push(`${key} shows authentic extinction`);
            }
        });
        
        validation.confidence = authenticPatterns / behaviorKeys.length;
        validation.isAuthentic = validation.confidence > 0.3;
        
        return validation;
    }

    // Export learning data for external analysis
    exportLearningData() {
        return {
            behaviorMatrix: JSON.parse(JSON.stringify(this.behaviorMatrix)),
            researchData: JSON.parse(JSON.stringify(this.researchData)),
            learningConfig: this.learningConfig,
            exportTimestamp: Date.now()
        };
    }

    // Reset learning system (for new experimental sessions)
    resetLearning() {
        Object.keys(this.behaviorMatrix).forEach(key => {
            this.behaviorMatrix[key] = {
                strength: 0.0,
                confidence: 0.0,
                lastReinforced: 0,
                reinforcementHistory: [],
                extinctionLevel: 0.0,
                manifestationCount: 0,
                successRate: 0.0
            };
        });
        
        this.researchData = {
            sessionStartTime: Date.now(),
            totalInteractions: 0,
            reinforcementEvents: [],
            behaviorManifestations: [],
            learningCurveData: [],
            extinctionEvents: []
        };
        
        console.log('🔄 Learning system reset - New experimental session started');
    }
}

module.exports = AniotaAuthenticLearning;

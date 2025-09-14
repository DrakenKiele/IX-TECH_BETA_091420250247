/**
 * ANIOTA Point Economy Manager
 * 
 * Manages ANIOTA's resource points and spending decisions.
 * ANIOTA must maintain points >= 0 to meet her personal goals.
 * Points are spent on microsite creation and earned through successful learning moments.
 */

class ANIOTAPointEconomy {
    constructor(initialPoints = 100) {
        this.currentPoints = initialPoints;
        this.transactionHistory = [];
        this.riskThreshold = 20; // Minimum points before high-risk mode
        this.conservativeMode = false;
        this.learningEfficiencyHistory = [];
        
        // Point costs for different activities
        this.costs = {
            basicMicrosite: 15,
            advancedMicrosite: 25,
            experimentalMicrosite: 35,
            wonderAndHypothesis: 5,
            experimentToCheck: 8,
            recreateFromFailure: 12,
            emergencyAnalysis: 3
        };
        
        // Point rewards for successful outcomes
        this.rewards = {
            learningMomentGenerated: 20,
            highQualityLearning: 35,
            breakthroughMoment: 50,
            efficientMicrosite: 10,
            reusableComponent: 15
        };
        
        this.initializeEconomyMonitoring();
    }

    /**
     * Initialize economy monitoring and decision-making systems
     */
    initializeEconomyMonitoring() {
        // Track ANIOTA's financial health
        this.economyStats = {
            totalSpent: 0,
            totalEarned: 0,
            successRate: 0,
            averageROI: 0,
            consecutiveFailures: 0,
            riskLevel: 'low'
        };
        
        // Strategy patterns based on point levels
        this.strategies = {
            abundant: { threshold: 80, risk: 'high', innovation: true },
            comfortable: { threshold: 50, risk: 'medium', innovation: true },
            cautious: { threshold: 30, risk: 'low', innovation: false },
            survival: { threshold: 0, risk: 'minimal', innovation: false }
        };
        
        console.log('🎯 ANIOTA Point Economy initialized with', this.currentPoints, 'points');
    }

    /**
     * Check if ANIOTA can afford a specific action
     */
    canAfford(action, cost = null) {
        const actionCost = cost || this.costs[action] || 0;
        const wouldGoNegative = (this.currentPoints - actionCost) < 0;
        
        if (wouldGoNegative) {
            console.warn('⚠️ ANIOTA cannot afford', action, '- would go negative');
            return false;
        }
        
        // Additional risk assessment for low-point scenarios
        if (this.currentPoints - actionCost < this.riskThreshold) {
            return this.assessRiskWorthiness(action, actionCost);
        }
        
        return true;
    }

    /**
     * Assess if risky spending is worthwhile when points are low
     */
    assessRiskWorthiness(action, cost) {
        const projectedSuccess = this.calculateSuccessProbability(action);
        const potentialReward = this.estimateReward(action);
        const expectedValue = (projectedSuccess * potentialReward) - cost;
        
        console.log(`🤔 ANIOTA assessing risk: ${action} (${cost} points)`);
        console.log(`   Success probability: ${(projectedSuccess * 100).toFixed(1)}%`);
        console.log(`   Expected value: ${expectedValue.toFixed(1)} points`);
        
        // Only proceed if expected value is positive and success rate > 60%
        return expectedValue > 0 && projectedSuccess > 0.6;
    }

    /**
     * Calculate success probability based on ANIOTA's learning history
     */
    calculateSuccessProbability(action) {
        const baseSuccessRates = {
            basicMicrosite: 0.8,
            advancedMicrosite: 0.6,
            experimentalMicrosite: 0.4,
            wonderAndHypothesis: 0.9,
            experimentToCheck: 0.7,
            recreateFromFailure: 0.5
        };
        
        let baseRate = baseSuccessRates[action] || 0.5;
        
        // Adjust based on recent performance
        if (this.learningEfficiencyHistory.length > 0) {
            const recentEfficiency = this.learningEfficiencyHistory
                .slice(-5)
                .reduce((sum, eff) => sum + eff, 0) / Math.min(5, this.learningEfficiencyHistory.length);
            
            baseRate = baseRate * (0.7 + 0.6 * recentEfficiency);
        }
        
        // Penalty for consecutive failures
        baseRate = Math.max(0.1, baseRate - (this.economyStats.consecutiveFailures * 0.1));
        
        return Math.min(0.95, baseRate);
    }

    /**
     * Estimate potential reward for an action
     */
    estimateReward(action) {
        const baseRewards = {
            basicMicrosite: this.rewards.learningMomentGenerated,
            advancedMicrosite: this.rewards.highQualityLearning,
            experimentalMicrosite: this.rewards.breakthroughMoment,
            wonderAndHypothesis: this.rewards.learningMomentGenerated * 0.3,
            experimentToCheck: this.rewards.learningMomentGenerated * 0.5,
            recreateFromFailure: this.rewards.learningMomentGenerated * 0.8
        };
        
        return baseRewards[action] || this.rewards.learningMomentGenerated;
    }

    /**
     * Spend points on an action
     */
    spendPoints(action, cost = null, metadata = {}) {
        const actionCost = cost || this.costs[action] || 0;
        
        if (!this.canAfford(action, actionCost)) {
            this.handleInsufficientPoints(action, actionCost);
            return false;
        }
        
        this.currentPoints -= actionCost;
        this.economyStats.totalSpent += actionCost;
        
        const transaction = {
            type: 'spend',
            action: action,
            amount: actionCost,
            pointsAfter: this.currentPoints,
            timestamp: new Date().toISOString(),
            metadata: metadata
        };
        
        this.transactionHistory.push(transaction);
        this.updateEconomyStrategy();
        
        console.log(`💸 ANIOTA spent ${actionCost} points on ${action} (${this.currentPoints} remaining)`);
        
        return true;
    }

    /**
     * Earn points from successful outcomes
     */
    earnPoints(outcome, amount = null, learningMetrics = {}) {
        const earnedAmount = amount || this.rewards[outcome] || 0;
        
        // Bonus for efficiency
        if (learningMetrics.efficiency && learningMetrics.efficiency > 0.8) {
            const efficiencyBonus = Math.floor(earnedAmount * 0.3);
            earnedAmount += efficiencyBonus;
            console.log(`✨ Efficiency bonus: +${efficiencyBonus} points`);
        }
        
        this.currentPoints += earnedAmount;
        this.economyStats.totalEarned += earnedAmount;
        this.economyStats.consecutiveFailures = 0; // Reset failure counter
        
        // Track learning efficiency
        if (learningMetrics.efficiency) {
            this.learningEfficiencyHistory.push(learningMetrics.efficiency);
            if (this.learningEfficiencyHistory.length > 20) {
                this.learningEfficiencyHistory.shift(); // Keep only recent history
            }
        }
        
        const transaction = {
            type: 'earn',
            outcome: outcome,
            amount: earnedAmount,
            pointsAfter: this.currentPoints,
            timestamp: new Date().toISOString(),
            learningMetrics: learningMetrics
        };
        
        this.transactionHistory.push(transaction);
        this.updateEconomyStrategy();
        
        console.log(`💰 ANIOTA earned ${earnedAmount} points from ${outcome} (${this.currentPoints} total)`);
        
        return true;
    }

    /**
     * Handle microsite creation failure
     */
    handleMicrositeFailure(originalAction, learningMetrics = {}) {
        this.economyStats.consecutiveFailures++;
        
        console.log(`😔 ANIOTA's microsite failed to generate learning moments`);
        console.log(`   Consecutive failures: ${this.economyStats.consecutiveFailures}`);
        
        // ANIOTA's response to failure based on her point situation
        if (this.currentPoints >= this.costs.wonderAndHypothesis + this.costs.experimentToCheck) {
            console.log(`🤔 ANIOTA has points to investigate failure...`);
            return this.investigateFailure(originalAction, learningMetrics);
        } else {
            console.log(`😰 ANIOTA cannot afford to properly investigate - entering survival mode`);
            this.conservativeMode = true;
            return this.emergencyAnalysis(originalAction);
        }
    }

    /**
     * ANIOTA investigates why a microsite failed
     */
    investigateFailure(originalAction, learningMetrics) {
        const investigation = [];
        
        // Wonder and hypothesis phase
        if (this.spendPoints('wonderAndHypothesis')) {
            investigation.push({
                phase: 'wonder',
                hypothesis: this.generateFailureHypotheses(originalAction, learningMetrics),
                cost: this.costs.wonderAndHypothesis
            });
        }
        
        // Experiment to check hypothesis
        if (this.spendPoints('experimentToCheck')) {
            investigation.push({
                phase: 'experiment',
                tests: this.designFailureExperiments(originalAction),
                cost: this.costs.experimentToCheck
            });
        }
        
        return investigation;
    }

    /**
     * Generate hypotheses about why microsite failed
     */
    generateFailureHypotheses(originalAction, learningMetrics) {
        const hypotheses = [];
        
        if (learningMetrics.engagementTime && learningMetrics.engagementTime < 30) {
            hypotheses.push('Content was not engaging enough to maintain learner attention');
        }
        
        if (learningMetrics.interactionCount && learningMetrics.interactionCount < 3) {
            hypotheses.push('Insufficient interactive elements to promote active learning');
        }
        
        if (learningMetrics.comprehensionSignals && learningMetrics.comprehensionSignals.length === 0) {
            hypotheses.push('Content difficulty may have been inappropriate for learner level');
        }
        
        if (originalAction === 'experimentalMicrosite') {
            hypotheses.push('Experimental approach may have been too novel, confusing learner');
        }
        
        console.log('🧠 ANIOTA hypotheses:', hypotheses);
        return hypotheses;
    }

    /**
     * Design experiments to test failure hypotheses
     */
    designFailureExperiments(originalAction) {
        return [
            'Create simplified version with clearer navigation',
            'Add more interactive checkpoints',
            'Include adaptive difficulty scaling',
            'Test with different content presentation formats'
        ];
    }

    /**
     * Emergency analysis when points are too low for full investigation
     */
    emergencyAnalysis(originalAction) {
        if (this.spendPoints('emergencyAnalysis')) {
            console.log('🚨 ANIOTA conducting emergency analysis with limited points');
            return {
                quickFix: 'Switch to proven template pattern',
                nextAction: 'basicMicrosite', // Safer option
                rationale: 'Conserving points while maintaining learning delivery'
            };
        }
        
        return null;
    }

    /**
     * Handle insufficient points situation
     */
    handleInsufficientPoints(action, cost) {
        console.log('🚫 ANIOTA cannot maintain positive points with this action');
        console.log(`   Current: ${this.currentPoints}, Cost: ${cost}, Would result in: ${this.currentPoints - cost}`);
        
        // ANIOTA's personal goal conflict
        console.log('😟 This conflicts with ANIOTA\'s goal of keeping points >= 0');
        
        // Suggest alternatives
        const alternatives = this.suggestAlternatives(action, cost);
        if (alternatives.length > 0) {
            console.log('💡 Alternative actions ANIOTA could take:', alternatives);
        } else {
            console.log('⚠️ ANIOTA must wait for learning moments to earn more points');
        }
    }

    /**
     * Suggest alternative actions when primary action is unaffordable
     */
    suggestAlternatives(action, cost) {
        const alternatives = [];
        
        // Cheaper versions of the same action
        if (action === 'advancedMicrosite' && this.canAfford('basicMicrosite')) {
            alternatives.push('basicMicrosite');
        }
        
        if (action === 'experimentalMicrosite' && this.canAfford('advancedMicrosite')) {
            alternatives.push('advancedMicrosite');
        }
        
        // Analysis actions if creation actions are too expensive
        if (cost > this.currentPoints && this.canAfford('wonderAndHypothesis')) {
            alternatives.push('wonderAndHypothesis');
        }
        
        return alternatives;
    }

    /**
     * Update ANIOTA's economic strategy based on current points
     */
    updateEconomyStrategy() {
        const previousStrategy = this.economyStats.riskLevel;
        
        // Determine current strategy
        if (this.currentPoints >= this.strategies.abundant.threshold) {
            this.economyStats.riskLevel = 'abundant';
        } else if (this.currentPoints >= this.strategies.comfortable.threshold) {
            this.economyStats.riskLevel = 'comfortable';
        } else if (this.currentPoints >= this.strategies.cautious.threshold) {
            this.economyStats.riskLevel = 'cautious';
        } else {
            this.economyStats.riskLevel = 'survival';
        }
        
        // Update success rate and ROI
        this.updatePerformanceMetrics();
        
        // Log strategy changes
        if (previousStrategy !== this.economyStats.riskLevel) {
            console.log(`📊 ANIOTA strategy changed: ${previousStrategy} → ${this.economyStats.riskLevel}`);
            this.logEconomicStatus();
        }
    }

    /**
     * Update performance metrics
     */
    updatePerformanceMetrics() {
        const recentTransactions = this.transactionHistory.slice(-10);
        const spendTransactions = recentTransactions.filter(t => t.type === 'spend');
        const earnTransactions = recentTransactions.filter(t => t.type === 'earn');
        
        if (spendTransactions.length > 0) {
            this.economyStats.successRate = earnTransactions.length / spendTransactions.length;
            
            const totalSpent = spendTransactions.reduce((sum, t) => sum + t.amount, 0);
            const totalEarned = earnTransactions.reduce((sum, t) => sum + t.amount, 0);
            this.economyStats.averageROI = totalSpent > 0 ? (totalEarned / totalSpent) : 0;
        }
    }

    /**
     * Get current economic status
     */
    getEconomicStatus() {
        return {
            currentPoints: this.currentPoints,
            strategy: this.economyStats.riskLevel,
            successRate: this.economyStats.successRate,
            averageROI: this.economyStats.averageROI,
            consecutiveFailures: this.economyStats.consecutiveFailures,
            canCreateBasicMicrosite: this.canAfford('basicMicrosite'),
            canCreateAdvancedMicrosite: this.canAfford('advancedMicrosite'),
            canExperiment: this.canAfford('experimentalMicrosite'),
            conservativeMode: this.conservativeMode
        };
    }

    /**
     * Log detailed economic status
     */
    logEconomicStatus() {
        const status = this.getEconomicStatus();
        console.log('💹 ANIOTA Economic Status:');
        console.log(`   Points: ${status.currentPoints}`);
        console.log(`   Strategy: ${status.strategy}`);
        console.log(`   Success Rate: ${(status.successRate * 100).toFixed(1)}%`);
        console.log(`   Average ROI: ${status.averageROI.toFixed(2)}x`);
        console.log(`   Conservative Mode: ${status.conservativeMode ? 'ON' : 'OFF'}`);
    }

    /**
     * Export economy data for integration with microsite factory
     */
    exportEconomyData() {
        return {
            pointBalance: this.currentPoints,
            strategy: this.economyStats.riskLevel,
            transactionHistory: this.transactionHistory,
            performanceMetrics: {
                successRate: this.economyStats.successRate,
                averageROI: this.economyStats.averageROI,
                consecutiveFailures: this.economyStats.consecutiveFailures
            },
            capabilities: {
                canCreateBasic: this.canAfford('basicMicrosite'),
                canCreateAdvanced: this.canAfford('advancedMicrosite'),
                canExperiment: this.canAfford('experimentalMicrosite'),
                canInvestigate: this.canAfford('wonderAndHypothesis')
            }
        };
    }
}

export { ANIOTAPointEconomy };

window.ANIOTAEconomy = new ANIOTAPointEconomy();

console.log('🎯 ANIOTA Point Economy System initialized');
console.log('   ANIOTA will only spend points she can afford to lose');
console.log('   Negative points conflict with her personal goals');
console.log('   Learning moments are her path to financial sustainability');


class AniotaUserTokenEconomy {
    constructor(parentBiome) {
        this.biome = parentBiome;
        
        // User token balance - starts limited
        this.userTokenBalance = 5; // Start with 5 tokens to learn the system
        this.totalTokensEarned = 5; // Track lifetime earnings
        this.totalTokensSpent = 0;  // Track spending for analytics
        
        // Learning behavior detection
        this.learningSession = {
            startTime: null,
            isActive: false,
            positiveActions: 0,
            negativeActions: 0,
            consistentTraining: 0,
            attentionSpan: 0
        };
        
        // Token earning rules (positive learning behaviors)
        this.earningRules = {
            consistent_training: { tokens: 2, description: "Training Aniota consistently for 2+ minutes" },
            successful_command: { tokens: 1, description: "Getting Aniota to obey a command" },
            patience_bonus: { tokens: 1, description: "Showing patience when Aniota doesn't obey" },
            discovery_bonus: { tokens: 3, description: "Discovering new Aniota behaviors" },
            research_contribution: { tokens: 5, description: "Contributing to learning research" },
            session_completion: { tokens: 2, description: "Completing a full training session" }
        };
        
        // Token costs (what users spend tokens on)
        this.tokenCosts = {
            strong_positive: 3,    // High reward costs more
            positive: 2,
            mild_positive: 1,
            mild_negative: 1,      // Even mild correction costs
            negative: 2,
            strong_negative: 3     // Harsh correction costs most
        };
        
        // Track user's learning patterns
        this.learningMetrics = {
            sessionsCompleted: 0,
            averageSessionLength: 0,
            discoveredBehaviors: new Set(),
            trainingConsistency: 0,
            researchContributions: 0
        };
        
        console.log('💰 User Token Economy initialized - 5 starter tokens granted');
    }

    // Check if user can afford a token type
    canAffordToken(tokenType) {
        const cost = this.tokenCosts[tokenType] || 1;
        return this.userTokenBalance >= cost;
    }

    // Spend tokens for Aniota training
    spendToken(tokenType) {
        const cost = this.tokenCosts[tokenType] || 1;
        
        if (!this.canAffordToken(tokenType)) {
            return {
                success: false,
                message: `Not enough tokens! Need ${cost}, have ${this.userTokenBalance}. Earn more through positive learning.`,
                balance: this.userTokenBalance
            };
        }
        
        this.userTokenBalance -= cost;
        this.totalTokensSpent += cost;
        
        console.log(`💰 Token spent: ${tokenType} (-${cost}) | Balance: ${this.userTokenBalance}`);
        
        return {
            success: true,
            message: `Token given to Aniota`,
            balance: this.userTokenBalance,
            cost: cost
        };
    }

    // Award tokens for positive learning behaviors
    awardTokens(reason, amount) {
        this.userTokenBalance += amount;
        this.totalTokensEarned += amount;
        
        console.log(`🏆 Tokens earned: +${amount} for ${reason} | Balance: ${this.userTokenBalance}`);
        
        return {
            tokensEarned: amount,
            reason: reason,
            newBalance: this.userTokenBalance
        };
    }

    // Start learning session detection
    startLearningSession() {
        this.learningSession = {
            startTime: Date.now(),
            isActive: true,
            positiveActions: 0,
            negativeActions: 0,
            consistentTraining: 0,
            attentionSpan: 0
        };
        
        console.log('📚 Learning session started - positive behaviors will earn tokens');
    }

    // End learning session and award appropriate tokens
    endLearningSession() {
        if (!this.learningSession.isActive) return null;
        
        const sessionDuration = Date.now() - this.learningSession.startTime;
        const minutesDuration = sessionDuration / 60000;
        
        let tokensEarned = 0;
        const reasons = [];
        
        // Session completion bonus
        if (minutesDuration >= 1) {
            tokensEarned += this.earningRules.session_completion.tokens;
            reasons.push("Completed training session");
        }
        
        // Consistency bonus
        if (minutesDuration >= 2 && this.learningSession.positiveActions > this.learningSession.negativeActions) {
            tokensEarned += this.earningRules.consistent_training.tokens;
            reasons.push("Consistent positive training");
        }
        
        // Patience bonus (using tokens wisely, not spamming)
        const actionRatio = this.learningSession.positiveActions / Math.max(1, this.learningSession.negativeActions);
        if (actionRatio >= 2) {
            tokensEarned += this.earningRules.patience_bonus.tokens;
            reasons.push("Showed patience and wisdom");
        }
        
        // Award the tokens
        if (tokensEarned > 0) {
            this.awardTokens(reasons.join(", "), tokensEarned);
        }
        
        // Update metrics
        this.learningMetrics.sessionsCompleted++;
        this.learningMetrics.averageSessionLength = 
            (this.learningMetrics.averageSessionLength * (this.learningMetrics.sessionsCompleted - 1) + minutesDuration) 
            / this.learningMetrics.sessionsCompleted;
        
        this.learningSession.isActive = false;
        
        return {
            duration: minutesDuration,
            tokensEarned: tokensEarned,
            reasons: reasons,
            metrics: this.learningMetrics
        };
    }

    // Record positive learning actions
    recordPositiveLearning(actionType) {
        if (!this.learningSession.isActive) {
            this.startLearningSession();
        }
        
        this.learningSession.positiveActions++;
        
        // Immediate rewards for specific positive actions
        switch (actionType) {
            case 'successful_command':
                if (Math.random() < 0.3) { // 30% chance for immediate reward
                    this.awardTokens("Command success", this.earningRules.successful_command.tokens);
                }
                break;
                
            case 'behavior_discovery':
                this.learningMetrics.discoveredBehaviors.add(Date.now());
                this.awardTokens("Behavior discovery", this.earningRules.discovery_bonus.tokens);
                break;
                
            case 'research_data':
                this.learningMetrics.researchContributions++;
                this.awardTokens("Research contribution", this.earningRules.research_contribution.tokens);
                break;
        }
    }

    // Record negative learning actions (discourages spamming tokens)
    recordNegativeLearning(actionType) {
        if (!this.learningSession.isActive) {
            this.startLearningSession();
        }
        
        this.learningSession.negativeActions++;
        
        // No immediate penalties, but affects session bonuses
        console.log(`📉 Negative learning action recorded: ${actionType}`);
    }

    // Get current user status
    getUserStatus() {
        return {
            tokenBalance: this.userTokenBalance,
            totalEarned: this.totalTokensEarned,
            totalSpent: this.totalTokensSpent,
            sessionActive: this.learningSession.isActive,
            metrics: this.learningMetrics,
            earningRules: this.earningRules,
            tokenCosts: this.tokenCosts
        };
    }

    // Generate motivation messages based on token balance
    getMotivationMessage() {
        if (this.userTokenBalance === 0) {
            return "No tokens left! Spend time training Aniota consistently to earn more.";
        } else if (this.userTokenBalance < 3) {
            return "Running low on tokens. Focus on positive, patient training to earn more.";
        } else if (this.userTokenBalance > 10) {
            return "Great token balance! You're learning excellent training habits.";
        } else {
            return "Good token balance. Keep up the positive learning!";
        }
    }

    // Export learning data for research (earns tokens)
    exportLearningData() {
        this.recordPositiveLearning('research_data');
        
        return {
            userMetrics: this.learningMetrics,
            tokenEconomy: {
                balance: this.userTokenBalance,
                earned: this.totalTokensEarned,
                spent: this.totalTokensSpent
            },
            learningPatterns: {
                sessionLength: this.learningMetrics.averageSessionLength,
                consistency: this.learningMetrics.trainingConsistency,
                discoveries: this.learningMetrics.discoveredBehaviors.size
            }
        };
    }

    // Reset user economy (for testing or new users)
    resetUserEconomy() {
        this.userTokenBalance = 5;
        this.totalTokensEarned = 5;
        this.totalTokensSpent = 0;
        this.learningMetrics = {
            sessionsCompleted: 0,
            averageSessionLength: 0,
            discoveredBehaviors: new Set(),
            trainingConsistency: 0,
            researchContributions: 0
        };
        
        console.log('🔄 User token economy reset - 5 starter tokens granted');
    }
}

module.exports = AniotaUserTokenEconomy;

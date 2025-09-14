// LRS Integration for Chrome Extension
// This file provides JavaScript interface to the Python LRS module

export class LearningReadinessScaffolding {
    constructor() {
        this.LEARNING_LEVELS = {
            0: "Primary",
            1: "Middle", 
            2: "Secondary",
            3: "PostSecondary",
            4: "Adult"
        };
        
        this.DEFAULT_LEVEL = 2;
        this.learning_level = this.DEFAULT_LEVEL;
        this.onboarding_responses = {};
        this.behavioral_metrics = {};
        this.progress_history = [];
        this.progress_map_4d = {};
        
        this.onboarding_questions = [
            "What was your favorite class last year?",
            "What's your favorite class this year?", 
            "What classes are you most excited about taking next year?"
        ];
        
        this.scaffolding_strategies = {
            0: {
                "question_complexity": "simple",
                "hint_frequency": "high",
                "interface_mode": "visual_heavy",
                "response_format": "click_or_emoji"
            },
            1: {
                "question_complexity": "moderate",
                "hint_frequency": "medium",
                "interface_mode": "balanced",
                "response_format": "short_text_or_click"
            },
            2: {
                "question_complexity": "standard",
                "hint_frequency": "low",
                "interface_mode": "text_focused",
                "response_format": "text_response"
            },
            3: {
                "question_complexity": "advanced",
                "hint_frequency": "minimal",
                "interface_mode": "academic",
                "response_format": "detailed_text"
            },
            4: {
                "question_complexity": "professional",
                "hint_frequency": "on_demand",
                "interface_mode": "professional",
                "response_format": "comprehensive_text"
            }
        };
        
        this.initialized = false;
    }

    async initialize() {
        try {
            console.log("Initializing LRS JavaScript interface");
            
            // Load existing data from Chrome storage
            await this._loadFromStorage();
            
            // Initialize progress map structure
            this._initializeProgressMap();
            
            this.initialized = true;
            console.log("LRS JavaScript interface initialized successfully");
            return true;
            
        } catch (error) {
            console.error("Failed to initialize LRS:", error);
            return false;
        }
    }

    async conduct_onboarding() {
        try {
            // Check if onboarding already completed
            const storage = await chrome.storage.sync.get(['onboardingCompleted']);
            if (storage.onboardingCompleted) {
                console.log("Onboarding already completed");
                return {
                    "status": "already_completed",
                    "learning_level": this.learning_level,
                    "level_name": this.LEARNING_LEVELS[this.learning_level]
                };
            }
            
            // Start onboarding process
            const onboarding_data = {
                "status": "initiated",
                "questions": this.onboarding_questions,
                "current_question": 0,
                "responses": [],
                "timestamp": new Date().toISOString()
            };
            
            console.log("Onboarding sequence initiated");
            return onboarding_data;
            
        } catch (error) {
            console.error("Error conducting onboarding:", error);
            return {"status": "error", "message": error.message};
        }
    }

    async assess_learning_level(behavioral_data = {}, interaction_history = [], onboarding_responses = {}) {
        try {
            const level_scores = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0};
            
            // Analyze onboarding responses
            if (onboarding_responses.answers) {
                const onboarding_score = this._analyzeOnboardingResponses(onboarding_responses);
                for (const [level, score] of Object.entries(onboarding_score)) {
                    level_scores[parseInt(level)] += score * 0.4; // 40% weight
                }
            }
            
            // Analyze behavioral data
            if (Object.keys(behavioral_data).length > 0) {
                const behavioral_score = this._analyzeBehavioralData(behavioral_data);
                for (const [level, score] of Object.entries(behavioral_score)) {
                    level_scores[parseInt(level)] += score * 0.3; // 30% weight
                }
            }
            
            // Analyze interaction history
            if (interaction_history.length > 0) {
                const interaction_score = this._analyzeInteractionHistory(interaction_history);
                for (const [level, score] of Object.entries(interaction_score)) {
                    level_scores[parseInt(level)] += score * 0.3; // 30% weight
                }
            }
            
            // Determine most likely level
            let assessed_level = 0;
            let max_score = -1;
            for (const [level, score] of Object.entries(level_scores)) {
                if (score > max_score) {
                    max_score = score;
                    assessed_level = parseInt(level);
                }
            }
            
            // Apply confidence threshold - if no clear winner, default to middle
            const scores_array = Object.values(level_scores).sort((a, b) => b - a);
            const second_max = scores_array.length > 1 ? scores_array[1] : 0;
            
            if (max_score - second_max < 0.2) { // Low confidence
                assessed_level = this.DEFAULT_LEVEL;
                console.log(`Low confidence in assessment, defaulting to level ${assessed_level}`);
            }
            
            this.learning_level = assessed_level;
            
            // Store in Chrome storage
            await chrome.storage.sync.set({
                learningLevel: assessed_level,
                learningLevelTimestamp: new Date().toISOString()
            });
            
            console.log(`Learning level assessed as ${assessed_level} (${this.LEARNING_LEVELS[assessed_level]})`);
            
            return assessed_level;
            
        } catch (error) {
            console.error("Error assessing learning level:", error);
            return this.DEFAULT_LEVEL;
        }
    }

    async generate_scaffolding_strategy(current_level, topic, progress_map = {}) {
        try {
            // Get base strategy for level
            const base_strategy = this.scaffolding_strategies[current_level] || 
                                this.scaffolding_strategies[this.DEFAULT_LEVEL];
            
            // Adjust strategy based on topic-specific progress
            const topic_progress = progress_map[topic] || {};
            const strategy = {...base_strategy};
            
            // Modify strategy based on topic mastery
            const mastery_level = topic_progress.mastery || 0.5;
            
            if (mastery_level > 0.8) { // High mastery - increase complexity
                strategy.question_complexity = this._increaseComplexity(strategy.question_complexity);
                strategy.hint_frequency = this._decreaseFrequency(strategy.hint_frequency);
            } else if (mastery_level < 0.3) { // Low mastery - decrease complexity
                strategy.question_complexity = this._decreaseComplexity(strategy.question_complexity);
                strategy.hint_frequency = this._increaseFrequency(strategy.hint_frequency);
            }
            
            // Add backup/advance thresholds
            strategy.backup_threshold = 0.3; // Backup if success rate < 30%
            strategy.advance_threshold = 0.7; // Advance if success rate > 70%
            
            // Add topic-specific parameters
            strategy.topic = topic;
            strategy.current_level = current_level;
            strategy.mastery_level = mastery_level;
            strategy.timestamp = new Date().toISOString();
            
            console.log(`Generated scaffolding strategy for ${topic} at level ${current_level}`);
            return strategy;
            
        } catch (error) {
            console.error("Error generating scaffolding strategy:", error);
            return this.scaffolding_strategies[this.DEFAULT_LEVEL];
        }
    }

    async request_ai_question(learning_level, topic, context = {}) {
        try {
            // Prepare request payload for EAI
            const ai_request = {
                "service": "question_generation",
                "parameters": {
                    "learning_level": learning_level,
                    "level_name": this.LEARNING_LEVELS[learning_level],
                    "topic": topic,
                    "context": context,
                    "scaffolding_strategy": await this.generate_scaffolding_strategy(
                        learning_level, topic, this.progress_map_4d
                    ),
                    "learner_profile": {
                        "current_level": this.learning_level,
                        "behavioral_metrics": this.behavioral_metrics,
                        "recent_performance": this._getRecentPerformance(topic)
                    }
                }
            };
            
            console.log(`Requesting AI question for level ${learning_level}, topic ${topic}`);
            
            // For now, return a structured response that would come from EAI
            const question_data = {
                "status": "success",
                "question": this._generateFallbackQuestion(learning_level, topic),
                "difficulty": learning_level,
                "expected_response_type": this.scaffolding_strategies[learning_level].response_format,
                "hints_available": this.scaffolding_strategies[learning_level].hint_frequency,
                "request_id": `q_${Date.now()}`,
                "timestamp": new Date().toISOString()
            };
            
            return question_data;
            
        } catch (error) {
            console.error("Error requesting AI question:", error);
            return {"status": "error", "message": error.message};
        }
    }

    async process_learner_response(response, expected_level, topic) {
        try {
            // Analyze response quality (simplified for JavaScript implementation)
            const response_analysis = this._analyzeResponseQuality(response, expected_level);
            
            // Update topic progress in 4D map
            this._updateProgressMap(topic, response_analysis, expected_level);
            
            // Check if level adjustment is warranted
            const adjustment_needed = this._checkLevelAdjustmentTrigger(response_analysis, expected_level);
            
            const result = {
                "response_quality": response_analysis.quality_score,
                "vocabulary_level": response_analysis.vocabulary_level,
                "complexity_handled": response_analysis.complexity_handled,
                "topic": topic,
                "expected_level": expected_level,
                "current_level": this.learning_level,
                "adjustment_triggered": adjustment_needed,
                "timestamp": new Date().toISOString()
            };
            
            if (adjustment_needed) {
                result.suggested_adjustment = adjustment_needed.direction;
                result.adjustment_reason = adjustment_needed.reason;
            }
            
            // Record learning moment
            this._recordLearningMoment(result);
            
            // Store in Chrome storage
            await this.store_learning_data('response_evaluation', result);
            
            return result;
            
        } catch (error) {
            console.error("Error processing learner response:", error);
            return {"error": error.message};
        }
    }

    async store_learning_data(data_type, data_payload) {
        try {
            const storage_data = {
                "type": data_type,
                "data": data_payload,
                "timestamp": new Date().toISOString(),
                "module": "LRS",
                "privacy_level": "user_specific"
            };
            
            let storage_key;
            if (["onboarding", "learning_level", "preferences"].includes(data_type)) {
                // Sync storage for cross-device data
                storage_key = `lrs_sync_${data_type}`;
                await chrome.storage.sync.set({[storage_key]: storage_data});
            } else {
                // Local storage for session-specific data
                storage_key = `lrs_local_${data_type}`;
                await chrome.storage.local.set({[storage_key]: storage_data});
            }
            
            console.log(`Stored ${data_type} data with key ${storage_key}`);
            return true;
            
        } catch (error) {
            console.error("Error storing learning data:", error);
            return false;
        }
    }

    async update_readiness_profile(performance_metrics = {}, choice_patterns = {}) {
        try {
            // Analyze performance trends
            const performance_trend = this._analyzePerformanceTrend(performance_metrics);
            
            // Analyze choice patterns (Extend/Expand/Explore)
            const choice_analysis = this._analyzeChoicePatterns(choice_patterns);
            
            // Determine if level adjustment is needed
            const level_adjustment = this._calculateLevelAdjustment(performance_trend, choice_analysis);
            
            if (level_adjustment !== 0) {
                const new_level = Math.max(0, Math.min(4, this.learning_level + level_adjustment));
                if (new_level !== this.learning_level) {
                    const old_level = this.learning_level;
                    this.learning_level = new_level;
                    
                    // Record level change
                    this._recordLevelChange(old_level, new_level, {
                        "performance_trend": performance_trend,
                        "choice_analysis": choice_analysis,
                        "timestamp": new Date().toISOString()
                    });
                    
                    // Update Chrome storage
                    await chrome.storage.sync.set({
                        learningLevel: new_level,
                        learningLevelUpdated: new Date().toISOString()
                    });
                    
                    console.log(`Learning level updated from ${old_level} to ${new_level}`);
                }
            }
            
            // Update behavioral metrics
            this._updateBehavioralMetrics(performance_metrics);
            
            return {
                "learning_level": this.learning_level,
                "level_name": this.LEARNING_LEVELS[this.learning_level],
                "adjustment": level_adjustment,
                "confidence": this._calculateConfidence(),
                "updated": new Date().toISOString()
            };
            
        } catch (error) {
            console.error("Error updating readiness profile:", error);
            return {"error": error.message};
        }
    }

    // Private helper methods

    async _loadFromStorage() {
        try {
            const syncData = await chrome.storage.sync.get([
                'learningLevel', 'onboardingCompleted', 'onboardingResponses'
            ]);
            
            const localData = await chrome.storage.local.get([
                'lrs_local_behavioral_metrics', 'lrs_local_progress_history'
            ]);
            
            this.learning_level = syncData.learningLevel || this.DEFAULT_LEVEL;
            this.onboarding_responses = syncData.onboardingResponses || {};
            
            if (localData.lrs_local_behavioral_metrics) {
                this.behavioral_metrics = localData.lrs_local_behavioral_metrics.data || {};
            }
            
            if (localData.lrs_local_progress_history) {
                this.progress_history = localData.lrs_local_progress_history.data || [];
            }
            
        } catch (error) {
            console.error("Error loading from storage:", error);
        }
    }

    _initializeProgressMap() {
        this.progress_map_4d = {
            "subjects": {},
            "metadata": {
                "created": new Date().toISOString(),
                "dimensions": ["subject_layer", "difficulty_x", "difficulty_y", "timestamp"]
            }
        };
    }

    _analyzeOnboardingResponses(responses) {
        const level_scores = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0};
        
        for (const response of responses.answers || []) {
            const response_lower = response.toLowerCase();
            
            // Primary indicators
            if (['reading', 'math', 'art', 'pe', 'music'].some(word => response_lower.includes(word))) {
                level_scores[0] += 0.3;
                level_scores[1] += 0.2;
            }
            
            // Middle school indicators
            if (['science', 'history', 'social studies', 'language arts'].some(word => response_lower.includes(word))) {
                level_scores[1] += 0.4;
                level_scores[2] += 0.2;
            }
            
            // High school indicators
            if (['biology', 'chemistry', 'physics', 'calculus', 'literature'].some(word => response_lower.includes(word))) {
                level_scores[2] += 0.4;
                level_scores[3] += 0.2;
            }
            
            // College indicators
            if (['major', 'degree', 'university', 'college', 'research'].some(word => response_lower.includes(word))) {
                level_scores[3] += 0.4;
                level_scores[4] += 0.2;
            }
        }
        
        return level_scores;
    }

    _analyzeBehavioralData(behavioral_data) {
        const level_scores = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0};
        
        // Typing speed analysis
        const typing_speed = behavioral_data.typing_speed || 30;
        if (typing_speed < 20) {
            level_scores[0] += 0.3;
            level_scores[1] += 0.2;
        } else if (typing_speed < 40) {
            level_scores[1] += 0.3;
            level_scores[2] += 0.2;
        } else if (typing_speed < 60) {
            level_scores[2] += 0.3;
            level_scores[3] += 0.2;
        } else {
            level_scores[3] += 0.3;
            level_scores[4] += 0.2;
        }
        
        return level_scores;
    }

    _analyzeInteractionHistory(interaction_history) {
        const level_scores = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0};
        
        // Analyze recent 10 interactions
        const recent_interactions = interaction_history.slice(-10);
        for (const interaction of recent_interactions) {
            if (interaction.correct) {
                const difficulty = interaction.difficulty || 2;
                level_scores[difficulty] += 0.1;
            }
        }
        
        return level_scores;
    }

    _generateFallbackQuestion(learning_level, topic) {
        const fallback_questions = {
            0: `What do you like most about ${topic}?`,
            1: `Can you explain what ${topic} means to you?`,
            2: `How would you describe ${topic} to a friend?`,
            3: `What are the key concepts in ${topic}?`,
            4: `How does ${topic} relate to your professional experience?`
        };
        
        return fallback_questions[learning_level] || fallback_questions[2];
    }

    _analyzeResponseQuality(response, expected_level) {
        const word_count = response.split(' ').length;
        let quality_score = 0.5; // Base score
        
        // Adjust based on response length for level
        if (expected_level <= 1 && word_count >= 3) {
            quality_score += 0.2;
        } else if (expected_level <= 2 && word_count >= 10) {
            quality_score += 0.2;
        } else if (expected_level >= 3 && word_count >= 20) {
            quality_score += 0.2;
        }
        
        // Simple vocabulary analysis
        const complex_words = response.split(' ').filter(word => word.length > 7).length;
        if (complex_words > 0) {
            quality_score += Math.min(0.3, complex_words * 0.1);
        }
        
        return {
            quality_score: Math.min(1.0, quality_score),
            vocabulary_level: expected_level,
            complexity_handled: quality_score > 0.6,
            word_count: word_count,
            estimated_level: expected_level
        };
    }

    _recordLearningMoment(moment_data) {
        this.progress_history.push(moment_data);
        
        // Keep only recent moments
        if (this.progress_history.length > 1000) {
            this.progress_history = this.progress_history.slice(-1000);
        }
    }

    _calculateConfidence() {
        // Base confidence on amount of data available
        const data_points = this.progress_history.length + Object.keys(this.behavioral_metrics).length;
        let max_confidence = Math.min(1.0, data_points / 50); // Max confidence with 50+ data points
        
        // Adjust based on recent performance consistency
        if (this.progress_history.length > 5) {
            const recent_changes = this.progress_history.slice(-5)
                .filter(h => h.new_level && h.old_level)
                .map(h => Math.abs(h.new_level - h.old_level));
            
            const stability = 1.0 - (recent_changes.reduce((a, b) => a + b, 0) / 20);
            max_confidence *= Math.max(0.3, stability);
        }
        
        return Math.round(max_confidence * 100) / 100;
    }

    // Additional helper methods for completeness

    _increaseComplexity(current_complexity) {
        const levels = ["simple", "moderate", "standard", "advanced", "professional"];
        const index = levels.indexOf(current_complexity);
        return levels[Math.min(index + 1, levels.length - 1)] || "standard";
    }

    _decreaseComplexity(current_complexity) {
        const levels = ["simple", "moderate", "standard", "advanced", "professional"];
        const index = levels.indexOf(current_complexity);
        return levels[Math.max(index - 1, 0)] || "moderate";
    }

    _increaseFrequency(current_frequency) {
        const levels = ["minimal", "low", "medium", "high", "on_demand"];
        const index = levels.indexOf(current_frequency);
        return levels[Math.min(index + 1, levels.length - 1)] || "medium";
    }

    _decreaseFrequency(current_frequency) {
        const levels = ["minimal", "low", "medium", "high", "on_demand"];
        const index = levels.indexOf(current_frequency);
        return levels[Math.max(index - 1, 0)] || "low";
    }

    _analyzePerformanceTrend(performance_metrics) {
        const recent_scores = performance_metrics.recent_scores || [];
        if (recent_scores.length < 3) {
            return "insufficient_data";
        }
        
        const mid = Math.floor(recent_scores.length / 2);
        const avg_early = recent_scores.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
        const avg_late = recent_scores.slice(mid).reduce((a, b) => a + b, 0) / (recent_scores.length - mid);
        
        if (avg_late > avg_early + 0.1) {
            return "improving";
        } else if (avg_late < avg_early - 0.1) {
            return "declining";
        } else {
            return "stable";
        }
    }

    _analyzeChoicePatterns(choice_patterns) {
        const total_choices = Object.values(choice_patterns).reduce((a, b) => a + b, 0);
        if (total_choices === 0) {
            return {"pattern": "none", "confidence": 0};
        }
        
        const percentages = {};
        let dominant_choice = "";
        let max_percentage = 0;
        
        for (const [choice, count] of Object.entries(choice_patterns)) {
            const percentage = count / total_choices;
            percentages[choice] = percentage;
            if (percentage > max_percentage) {
                max_percentage = percentage;
                dominant_choice = choice;
            }
        }
        
        return {
            "pattern": dominant_choice,
            "percentages": percentages,
            "confidence": max_percentage
        };
    }

    _calculateLevelAdjustment(performance_trend, choice_analysis) {
        let adjustment = 0;
        
        if (performance_trend === "improving" && choice_analysis.confidence > 0.6) {
            if (["extend", "expand"].includes(choice_analysis.pattern)) {
                adjustment = 1;
            }
        } else if (performance_trend === "declining") {
            adjustment = -1;
        }
        
        return adjustment;
    }

    _recordLevelChange(old_level, new_level, context) {
        const change_record = {
            old_level: old_level,
            new_level: new_level,
            context: context,
            timestamp: new Date().toISOString()
        };
        this.progress_history.push(change_record);
    }

    _updateBehavioralMetrics(performance_metrics) {
        for (const [key, value] of Object.entries(performance_metrics)) {
            if (!this.behavioral_metrics[key]) {
                this.behavioral_metrics[key] = [];
            }
            this.behavioral_metrics[key].push({
                value: value,
                timestamp: new Date().toISOString()
            });
            
            // Keep only recent data (last 100 entries)
            if (this.behavioral_metrics[key].length > 100) {
                this.behavioral_metrics[key] = this.behavioral_metrics[key].slice(-100);
            }
        }
    }

    _updateProgressMap(topic, response_analysis, expected_level) {
        if (!this.progress_map_4d.subjects[topic]) {
            this.progress_map_4d.subjects[topic] = {
                difficulty_x: expected_level,
                difficulty_y: expected_level,
                mastery: 0.5,
                attempts: 0,
                successes: 0
            };
        }
        
        const subject_data = this.progress_map_4d.subjects[topic];
        subject_data.attempts += 1;
        
        if (response_analysis.quality_score > 0.6) {
            subject_data.successes += 1;
        }
        
        subject_data.mastery = subject_data.successes / subject_data.attempts;
    }

    _checkLevelAdjustmentTrigger(response_analysis, expected_level) {
        const quality_score = response_analysis.quality_score;
        
        if (quality_score > 0.9 && expected_level >= this.learning_level) {
            return {"direction": "up", "reason": "excellent_performance"};
        } else if (quality_score < 0.3 && expected_level <= this.learning_level) {
            return {"direction": "down", "reason": "struggling_performance"};
        }
        
        return null;
    }

    _getRecentPerformance(topic) {
        const topic_data = this.progress_map_4d.subjects[topic] || {};
        return {
            mastery: topic_data.mastery || 0.5,
            attempts: topic_data.attempts || 0,
            success_rate: topic_data.mastery || 0.5
        };
    }
}

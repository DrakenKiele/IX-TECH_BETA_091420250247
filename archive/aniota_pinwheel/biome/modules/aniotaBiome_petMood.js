

class AniotaPetMood {
    constructor(parentBiome) {
        this.biome = parentBiome;
        this.isUpdatingMood = false; // Prevent recursive calls
        this.raceConditionLogged = false; // Only log race condition once
        this.moodState = {
            happiness: 0.7,
            excitement: 0.5,
            curiosity: 0.6,
            attention: 0.5,
            energy: 0.8,
            satisfaction: 0.6,
            playfulness: 0.5,
            focus: 0.5
        };
        
        this.moodHistory = [];
        this.moodDecayRate = 0.001; // How quickly moods return to baseline
        this.lastMoodUpdate = Date.now();
    }

    // Update mood based on interactions
    updateMoodFromInteraction(interactionType, intensity = 0.1) {
        const now = Date.now();
        
        switch (interactionType) {
            case 'click':
                this.adjustMood('attention', intensity * 2);
                this.adjustMood('happiness', intensity);
                break;
                
            case 'proximity':
                this.adjustMood('excitement', intensity);
                this.adjustMood('playfulness', intensity);
                break;
                
            case 'command_success':
                this.adjustMood('satisfaction', intensity * 1.5);
                this.adjustMood('happiness', intensity);
                break;
                
            case 'play':
                this.adjustMood('playfulness', intensity * 2);
                this.adjustMood('energy', intensity);
                this.adjustMood('happiness', intensity);
                break;
                
            case 'learning':
                this.adjustMood('curiosity', intensity * 1.5);
                this.adjustMood('focus', intensity);
                break;
                
            case 'ignore':
                this.adjustMood('attention', -intensity);
                this.adjustMood('excitement', -intensity * 0.5);
                break;
        }
        
        this.recordMoodChange(interactionType, intensity, now);
        this.lastMoodUpdate = now;
        
        console.log(`🎭 Mood updated from ${interactionType}: ${this.getMoodSummary()}`);
    }

    // Adjust individual mood component
    adjustMood(component, delta) {
        if (this.moodState.hasOwnProperty(component)) {
            this.moodState[component] = Math.max(0, Math.min(1, this.moodState[component] + delta));
        }
    }

    // Natural mood decay over time
    applyMoodDecay() {
        const now = Date.now();
        const timeDelta = now - this.lastMoodUpdate;
        const decayAmount = (timeDelta / 1000) * this.moodDecayRate;
        
        // All moods slowly return to baseline (0.5)
        Object.keys(this.moodState).forEach(mood => {
            const current = this.moodState[mood];
            const baseline = 0.5;
            
            if (current > baseline) {
                this.moodState[mood] = Math.max(baseline, current - decayAmount);
            } else if (current < baseline) {
                this.moodState[mood] = Math.min(baseline, current + decayAmount);
            }
        });
        
        this.lastMoodUpdate = now;
    }

    // Get dominant mood for display
    getDominantMood() {
        let dominantMood = 'neutral';
        let highestValue = 0.5;
        
        Object.entries(this.moodState).forEach(([mood, value]) => {
            if (value > highestValue) {
                dominantMood = mood;
                highestValue = value;
            }
        });
        
        return {
            mood: dominantMood,
            intensity: highestValue,
            description: this.getMoodDescription(dominantMood, highestValue)
        };
    }

    getMoodDescription(mood, intensity) {
        const descriptions = {
            happiness: {
                low: 'content',
                medium: 'happy',
                high: 'joyful'
            },
            excitement: {
                low: 'calm',
                medium: 'eager',
                high: 'thrilled'
            },
            curiosity: {
                low: 'disinterested',
                medium: 'curious',
                high: 'fascinated'
            },
            attention: {
                low: 'distracted',
                medium: 'attentive',
                high: 'focused'
            },
            energy: {
                low: 'tired',
                medium: 'active',
                high: 'energetic'
            },
            playfulness: {
                low: 'serious',
                medium: 'playful',
                high: 'mischievous'
            }
        };
        
        const level = intensity < 0.4 ? 'low' : intensity < 0.7 ? 'medium' : 'high';
        return descriptions[mood]?.[level] || 'neutral';
    }

    // Get ring colors based on mood
    getMoodRingColors() {
        const dominant = this.getDominantMood();
        
        const moodColorMap = {
            happiness: '#FFD700',      // Gold
            excitement: '#FF6347',     // Tomato  
            curiosity: '#32CD32',      // Lime green
            attention: '#FFA500',      // Orange
            energy: '#FF69B4',         // Hot pink
            satisfaction: '#90EE90',   // Light green
            playfulness: '#FF1493',    // Deep pink
            focus: '#4169E1',          // Royal blue
            neutral: '#F4A460'         // Sandy brown
        };
        
        const baseColor = moodColorMap[dominant.mood] || moodColorMap.neutral;
        
        // Create gradient based on intensity
        const alpha = Math.floor(dominant.intensity * 255).toString(16).padStart(2, '0');
        
        return {
            primary: baseColor,
            secondary: baseColor + alpha,
            rings: this.generateRingColors(dominant)
        };
    }

    generateRingColors(dominantMood) {
        // Generate 3-4 ring colors based on current mood state
        const rings = [];
        
        // Get base color from dominant mood directly (not through getMoodRingColors to avoid recursion)
        const moodColorMap = {
            happiness: '#FFD700',      // Gold
            excitement: '#FF6347',     // Tomato  
            curiosity: '#32CD32',      // Lime green
            attention: '#FFA500',      // Orange
            energy: '#FF69B4',         // Hot pink
            satisfaction: '#90EE90',   // Light green
            playfulness: '#FF1493',    // Deep pink
            focus: '#4169E1',          // Royal blue
            neutral: '#F4A460'         // Sandy brown
        };
        
        const baseColor = moodColorMap[dominantMood.mood] || moodColorMap.neutral;
        
        // Primary ring (dominant mood)
        rings.push({
            color: baseColor,
            alpha: dominantMood.intensity,
            speed: dominantMood.intensity * 0.5
        });
        
        // Secondary rings based on other strong moods
        const sortedMoods = Object.entries(this.moodState)
            .sort(([,a], [,b]) => b - a)
            .slice(1, 4); // Get next 3 strongest moods
            
        sortedMoods.forEach(([mood, value], index) => {
            if (value > 0.3) { // Only show if mood is significant
                rings.push({
                    color: moodColorMap[mood] || moodColorMap.neutral,
                    alpha: value * 0.7,
                    speed: value * 0.3,
                    radius: 35 + (index * 10)
                });
            }
        });
        
        return rings;
    }

    // Record mood change for history/learning
    recordMoodChange(trigger, intensity, timestamp) {
        this.moodHistory.push({
            trigger,
            intensity,
            timestamp,
            moodSnapshot: { ...this.moodState }
        });
        
        // Keep only last 100 mood changes
        if (this.moodHistory.length > 100) {
            this.moodHistory.shift();
        }
    }

    // Get mood summary for logging
    getMoodSummary() {
        const dominant = this.getDominantMood();
        return `${dominant.mood}(${dominant.intensity.toFixed(2)}) - ${dominant.description}`;
    }

    // Get current mood for behavior decisions
    getCurrentMoodState() {
        // Prevent recursive calls that cause infinite loops
        if (this.isUpdatingMood) {
            return {
                state: { ...this.moodState },
                dominant: { mood: 'neutral', intensity: 0.5 },
                colors: { primary: '#FFD700', secondary: '#B8860B', rings: [] },
                energy: 0.5,
                playfulness: 0.5,
                attention: 0.5
            };
        }
        
        this.isUpdatingMood = true;
        
        try {
            this.applyMoodDecay();
            const dominant = this.getDominantMood();
            const colors = this.getMoodRingColors();
            
            return {
                state: { ...this.moodState },
                dominant: dominant,
                colors: colors,
                energy: this.moodState.energy,
                playfulness: this.moodState.playfulness,
                attention: this.moodState.attention
            };
        } catch (error) {
            // Only log race condition warning once per session
            if (!this.raceConditionLogged) {
                console.log('⚠️ Race condition in getCurrentMoodState, returning safe defaults:', error.message);
                this.raceConditionLogged = true;
            }
            return {
                state: { ...this.moodState },
                dominant: { mood: 'neutral', intensity: 0.5 },
                colors: { primary: '#FFD700', secondary: '#B8860B', rings: [] },
                energy: 0.5,
                playfulness: 0.5,
                attention: 0.5
            };
        } finally {
            this.isUpdatingMood = false;
        }
    }

    // Update specific mood parameter
    updateMoodParameter(parameter, value) {
        if (this.moodState.hasOwnProperty(parameter)) {
            const oldValue = this.moodState[parameter];
            this.moodState[parameter] = Math.max(0, Math.min(1, value));
            
            // Record the change
            this.recordMoodChange(`parameter_update_${parameter}`, value - oldValue, Date.now());
            
            console.log(`🎭 Mood parameter updated: ${parameter} = ${this.moodState[parameter].toFixed(2)} (was ${oldValue.toFixed(2)})`);
        } else {
            console.warn(`🎭 Unknown mood parameter: ${parameter}`);
        }
    }

    // Reset mood to baseline
    reset() {
        this.moodState = {
            happiness: 0.7,
            excitement: 0.5,
            curiosity: 0.6,
            attention: 0.5,
            energy: 0.8,
            satisfaction: 0.6,
            playfulness: 0.5,
            focus: 0.5
        };
        this.moodHistory = [];
        this.lastMoodUpdate = Date.now();
        console.log('🎭 Mood state reset to baseline');
    }
}

module.exports = AniotaPetMood;

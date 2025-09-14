
const { logEntry, logExit, log } = require('..\..\..\execution_tracer');

class AniotaPetMood {
    constructor(parentBiome) {
    logEntry('constructor', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
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
        this.moodDecayRate = 0.001; // How quickly moods 
    logExit('currentFunction', to baseline
        this.lastMoodUpdate = Date.now());
    return to baseline
        this.lastMoodUpdate = Date.now();
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Update mood based on interactions
    updateMoodFromInteraction(interactionType, intensity = 0.1) {
    logEntry('updateMoodFromInteraction', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
        const now = Date.now();
        
        switch (interactionType) {
    logEntry('switch', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
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
    logEntry('adjustMood', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
        if (this.moodState.hasOwnProperty(component)) {
            this.moodState[component] = Math.max(0, Math.min(1, this.moodState[component] + delta));
        }
    }

    // Natural mood decay over time
    applyMoodDecay() {
    logEntry('applyMoodDecay', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
        const now = Date.now();
        const timeDelta = now - this.lastMoodUpdate;
        const decayAmount = (timeDelta / 1000) * this.moodDecayRate;
        
        // All moods slowly 
    logExit('currentFunction', to baseline (0.5)
        Object.keys(this.moodState).forEach(mood => {
    logEntry('forEach', 'aniota_ui/biome/modules/aniotaBiome_petMood.js'));
    return to baseline (0.5)
        Object.keys(this.moodState).forEach(mood => {
    logEntry('forEach', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    try {
            const current = this.moodState[mood];
            const baseline = 0.5;
            
            if (current > baseline) {
                this.moodState[mood] = Math.max(baseline, current - decayAmount);
            } else if (current < baseline) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
                this.moodState[mood] = Math.min(baseline, current + decayAmount);
            }
        });
        
        this.lastMoodUpdate = now;
    }

    // Get dominant mood for display
    getDominantMood() {
    logEntry('getDominantMood', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
        let dominantMood = 'neutral';
        let highestValue = 0.5;
        
        Object.entries(this.moodState).forEach(([mood, value]) => {
            if (value > highestValue) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
                dominantMood = mood;
                highestValue = value;
            }
        });
        
        
    logExit('currentFunction', {
            mood: dominantMood,
            intensity: highestValue,
            description: this.getMoodDescription(dominantMood, highestValue)
        });
    return {
            mood: dominantMood,
            intensity: highestValue,
            description: this.getMoodDescription(dominantMood, highestValue)
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    getMoodDescription(mood, intensity) {
    logEntry('getMoodDescription', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
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
        
    logExit('currentFunction', descriptions[mood]?.[level] || 'neutral');
    return descriptions[mood]?.[level] || 'neutral';
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Get ring colors based on mood
    getMoodRingColors() {
    logEntry('getMoodRingColors', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
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
        
        
    logExit('currentFunction', {
            primary: baseColor,
            secondary: baseColor + alpha,
            rings: this.generateRingColors(dominant)
        });
    return {
            primary: baseColor,
            secondary: baseColor + alpha,
            rings: this.generateRingColors(dominant)
        };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    generateRingColors(dominantMood) {
    logEntry('generateRingColors', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
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
            if (value > 0.3) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try { // Only show if mood is significant
                rings.push({
                    color: moodColorMap[mood] || moodColorMap.neutral,
                    alpha: value * 0.7,
                    speed: value * 0.3,
                    radius: 35 + (index * 10)
                });
            }
        });
        
        
    logExit('currentFunction', rings);
    return rings;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Record mood change for history/learning
    recordMoodChange(trigger, intensity, timestamp) {
    logEntry('recordMoodChange', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
        this.moodHistory.push({
            trigger,
            intensity,
            timestamp,
            moodSnapshot: { ...this.moodState }
        });
        
        // Keep only last 100 mood changes
        if (this.moodHistory.length > 100) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
            this.moodHistory.shift();
        }
    }

    // Get mood summary for logging
    getMoodSummary() {
    logEntry('getMoodSummary', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
        const dominant = this.getDominantMood();
        
    logExit('currentFunction', `${dominant.mood}(${dominant.intensity.toFixed(2)}) - ${dominant.description}`);
    return `${dominant.mood}(${dominant.intensity.toFixed(2)}) - ${dominant.description}`;
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
    }

    // Get current mood for behavior decisions
    getCurrentMoodState() {
    logEntry('getCurrentMoodState', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
        // Prevent recursive calls that cause infinite loops
        if (this.isUpdatingMood) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
            
    logExit('currentFunction', {
                state: { ...this.moodState },
                dominant: { mood: 'neutral', intensity: 0.5 },
                colors: { primary: '#FFD700', secondary: '#B8860B', rings: [] },
                energy: 0.5,
                playfulness: 0.5,
                attention: 0.5
            });
    return {
                state: { ...this.moodState },
                dominant: { mood: 'neutral', intensity: 0.5 },
                colors: { primary: '#FFD700', secondary: '#B8860B', rings: [] },
                energy: 0.5,
                playfulness: 0.5,
                attention: 0.5
            };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        }
        
        this.isUpdatingMood = true;
        
        try {
            this.applyMoodDecay();
            const dominant = this.getDominantMood();
            const colors = this.getMoodRingColors();
            
            
    logExit('currentFunction', {
                state: { ...this.moodState },
                dominant: dominant,
                colors: colors,
                energy: this.moodState.energy,
                playfulness: this.moodState.playfulness,
                attention: this.moodState.attention
            });
    return {
                state: { ...this.moodState },
                dominant: dominant,
                colors: colors,
                energy: this.moodState.energy,
                playfulness: this.moodState.playfulness,
                attention: this.moodState.attention
            };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        } catch (error) {
    logEntry('catch', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
            // Only log race condition warning once per session
            if (!this.raceConditionLogged) {
    logEntry('if', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
                console.log('⚠️ Race condition in getCurrentMoodState, returning safe defaults:', error.message);
                this.raceConditionLogged = true;
            }
            
    logExit('currentFunction', {
                state: { ...this.moodState },
                dominant: { mood: 'neutral', intensity: 0.5 },
                colors: { primary: '#FFD700', secondary: '#B8860B', rings: [] },
                energy: 0.5,
                playfulness: 0.5,
                attention: 0.5
            });
    return {
                state: { ...this.moodState },
                dominant: { mood: 'neutral', intensity: 0.5 },
                colors: { primary: '#FFD700', secondary: '#B8860B', rings: [] },
                energy: 0.5,
                playfulness: 0.5,
                attention: 0.5
            };
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}
        } finally {
            this.isUpdatingMood = false;
        }
    }

    // Update specific mood parameter
    updateMoodParameter(parameter, value) {
    logEntry('updateMoodParameter', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
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
    logEntry('reset', 'aniota_ui/biome/modules/aniotaBiome_petMood.js');
    try {
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

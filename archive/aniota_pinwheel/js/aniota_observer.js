
class AniotaObserver {
  constructor() {
    this.isActive = false;
    this.observationData = {
      mousePatterns: [],
      keyboardPatterns: [],
      focusPatterns: [],
      webBehaviors: [],
      ironicEvents: [],
      learningOpportunities: []
    };
    this.backgroundMode = true;
    this.lastActivity = Date.now();
    this.idleThreshold = 30000; // 30 seconds
    this.pointsEarned = 0;
    this.observationPoints = 0;
  }

  initialize() {
    if (window.AniotaAPI) {
      this.setupElectronObservation();
    } else {
      this.setupWebObservation();
    }
    
    this.startObservationLoop();
    this.startIdleDetection();
    console.log('🔍 Aniota Observer: Transparent observation active');
  }

  setupElectronObservation() {
    // Mouse tracking with minimal interference
    document.addEventListener('mousemove', (e) => {
      if (this.backgroundMode) {
        this.trackMousePattern(e);
        window.AniotaAPI.trackMouseActivity({
          x: e.clientX,
          y: e.clientY,
          velocity: this.calculateVelocity(e),
          context: 'system'
        });
      }
    }, { passive: true });

    // Keyboard pattern analysis
    document.addEventListener('keydown', (e) => {
      if (this.backgroundMode) {
        this.trackKeyboardPattern(e);
        window.AniotaAPI.trackKeyboardActivity({
          key: e.key,
          timing: this.getTypingTiming(),
          context: 'system'
        });
      }
    }, { passive: true });

    // Window focus tracking
    window.addEventListener('focus', () => {
      this.trackFocusPattern('gained');
      window.AniotaAPI.trackApplicationFocus({
        type: 'focus_gained',
        timestamp: Date.now()
      });
    });

    window.addEventListener('blur', () => {
      this.trackFocusPattern('lost');
      window.AniotaAPI.trackApplicationFocus({
        type: 'focus_lost',
        timestamp: Date.now()
      });
    });
  }

  setupWebObservation() {
    // Web-specific observation patterns
    // Track scroll patterns
    window.addEventListener('scroll', (e) => {
      if (this.backgroundMode) {
        this.trackScrollPattern(e);
      }
    }, { passive: true });

    // Track click patterns
    document.addEventListener('click', (e) => {
      if (this.backgroundMode) {
        this.trackClickPattern(e);
      }
    }, { passive: true });

    // Track form interactions
    document.addEventListener('input', (e) => {
      if (this.backgroundMode) {
        this.trackInputPattern(e);
      }
    }, { passive: true });

    // Track page navigation
    window.addEventListener('beforeunload', () => {
      this.trackNavigationPattern();
    });
  }

  trackMousePattern(event) {
    const pattern = {
      timestamp: Date.now(),
      x: event.clientX,
      y: event.clientY,
      speed: this.calculateMouseSpeed(event),
      direction: this.calculateMouseDirection(event)
    };

    this.observationData.mousePatterns.push(pattern);
    this.detectIronicMouseEvent(pattern);
    this.updateActivity();
  }

  trackKeyboardPattern(event) {
    const pattern = {
      timestamp: Date.now(),
      key: event.key,
      timing: this.getTypingTiming(),
      sequence: this.getKeySequence(),
      rhythm: this.calculateTypingRhythm()
    };

    this.observationData.keyboardPatterns.push(pattern);
    this.detectIronicKeyboardEvent(pattern);
    this.updateActivity();
  }

  detectIronicMouseEvent(pattern) {
    // Detect patterns that suggest confusion, frustration, or discovery
    const recentPatterns = this.observationData.mousePatterns.slice(-10);
    
    // Circular mouse movement (confusion indicator)
    if (this.isCircularMovement(recentPatterns)) {
      this.logIronicEvent('circular_confusion', {
        type: 'mouse_confusion',
        intensity: this.calculateConfusionIntensity(recentPatterns),
        suggestion: 'User may benefit from guidance'
      });
    }

    // Rapid back-and-forth (indecision)
    if (this.isBackAndForthMovement(recentPatterns)) {
      this.logIronicEvent('indecision_pattern', {
        type: 'navigation_uncertainty',
        intensity: this.calculateIndecisionLevel(recentPatterns),
        suggestion: 'Offer simplified choices'
      });
    }

    // Sudden stop (interest or confusion)
    if (this.isSuddenStop(recentPatterns)) {
      this.logIronicEvent('attention_focus', {
        type: 'focus_event',
        duration: this.calculateStopDuration(),
        suggestion: 'Content may be engaging or confusing'
      });
    }
  }

  detectIronicKeyboardEvent(pattern) {
    const recentPatterns = this.observationData.keyboardPatterns.slice(-20);
    
    // Backspace frequency (mistake pattern)
    const backspaceRatio = recentPatterns.filter(p => p.key === 'Backspace').length / recentPatterns.length;
    if (backspaceRatio > 0.3) {
      this.logIronicEvent('high_error_rate', {
        type: 'typing_difficulty',
        errorRate: backspaceRatio,
        suggestion: 'User may be struggling with input'
      });
    }

    // Typing rhythm analysis
    if (this.isErraticTyping(recentPatterns)) {
      this.logIronicEvent('erratic_typing', {
        type: 'cognitive_load',
        rhythmVariance: this.calculateRhythmVariance(recentPatterns),
        suggestion: 'User may be under cognitive stress'
      });
    }
  }

  logIronicEvent(eventType, data) {
    const ironicEvent = {
      timestamp: Date.now(),
      type: eventType,
      data: data,
      context: this.getCurrentContext(),
      pattern_confidence: this.calculatePatternConfidence(eventType)
    };

    this.observationData.ironicEvents.push(ironicEvent);
    
    // Send to backend for pattern analysis
    if (window.AniotaAPI) {
      window.AniotaAPI.sendToBackend('/api/ironic-event', ironicEvent);
    }

    console.log('🎭 Ironic Event Detected:', eventType, data);
  }

  startObservationLoop() {
    setInterval(() => {
      this.analyzePatterns();
      this.earnObservationPoints();
      this.cleanupOldData();
    }, 5000); // Every 5 seconds
  }

  startIdleDetection() {
    setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - this.lastActivity;
      
      if (timeSinceActivity > this.idleThreshold) {
        // User is idle - perfect time for Aniota to "do nothing" and earn points
        this.earnIdlePoints();
        this.performBackgroundLearning();
      }
    }, 10000); // Check every 10 seconds
  }

  analyzePatterns() {
    // Analyze collected patterns for learning opportunities
    const mouseAnalysis = this.analyzeMousePatterns();
    const keyboardAnalysis = this.analyzeKeyboardPatterns();
    const focusAnalysis = this.analyzeFocusPatterns();
    
    // Identify potential learning opportunities
    const learningOpportunities = this.identifyLearningOpportunities({
      mouse: mouseAnalysis,
      keyboard: keyboardAnalysis,
      focus: focusAnalysis
    });

    if (learningOpportunities.length > 0) {
      this.observationData.learningOpportunities.push(...learningOpportunities);
      console.log('📚 Learning opportunities identified:', learningOpportunities.length);
    }
  }

  earnObservationPoints() {
    // Earn points for successful observation and pattern detection
    this.observationPoints += 1;
    this.pointsEarned += 1;
    
    // Every 100 observation points, prepare research topics
    if (this.observationPoints % 100 === 0) {
      this.prepareResearchTopics();
    }
  }

  earnIdlePoints() {
    // Earn points for "doing nothing" - allowing exploration time
    this.pointsEarned += 2;
    console.log('😴 Aniota earned idle points. Total:', this.pointsEarned);
  }

  performBackgroundLearning() {
    // Quietly update modules and learning during idle time
    if (window.AniotaAPI) {
      window.AniotaAPI.sendToBackend('/api/background-learning', {
        patterns: this.observationData,
        points: this.pointsEarned,
        timestamp: Date.now()
      });
    }
  }

  prepareResearchTopics() {
    // Analyze patterns to prepare 6 research topics for when user activates Aniota
    const topics = this.generateResearchTopics();
    
    if (window.AniotaAPI) {
      window.AniotaAPI.sendToBackend('/api/prepare-topics', {
        topics: topics,
        confidence: this.calculateTopicConfidence(topics),
        userPatterns: this.observationData
      });
    }
  }

  // Utility methods for pattern analysis
  calculateMouseSpeed(event) {
    // Implementation for mouse speed calculation
    return Math.sqrt(Math.pow(event.movementX, 2) + Math.pow(event.movementY, 2));
  }

  calculateMouseDirection(event) {
    // Implementation for mouse direction calculation
    return Math.atan2(event.movementY, event.movementX);
  }

  isCircularMovement(patterns) {
    // Detect circular mouse movement patterns
    if (patterns.length < 5) return false;
    // Implementation for circular movement detection
    return false; // Placeholder
  }

  updateActivity() {
    this.lastActivity = Date.now();
  }

  getCurrentContext() {
    return {
      url: window.location.href,
      title: document.title,
      activeElement: document.activeElement.tagName,
      timestamp: Date.now()
    };
  }

  // Make observer globally accessible
  activate() {
    this.backgroundMode = false;
    console.log('🎯 Aniota Observer: Switched to active mode');
  }

  deactivate() {
    this.backgroundMode = true;
    console.log('🔍 Aniota Observer: Switched to background mode');
  }
}

const aniotaObserver = new AniotaObserver();
window.aniotaObserver = aniotaObserver;

if (window.AniotaAPI || document.readyState === 'complete') {
  aniotaObserver.initialize();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    aniotaObserver.initialize();
  });
}

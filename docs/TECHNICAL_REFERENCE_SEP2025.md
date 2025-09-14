# IX-TECH Technical Reference - September 2025

## 🔧 Key Implementation Details

### Token Economy Integration Points

**User Token Balance (aniotaBiome_userTokenEconomy.js):**
```javascript
spendToken(amount, action) {
    if (this.tokenBalance >= amount) {
        this.tokenBalance -= amount;
        this.recordSpending(amount, action);
        return true; // Token spent successfully
    }
    return false; // Insufficient tokens
}

awardTokens(amount, reason) {
    this.tokenBalance += amount;
    this.recordEarning(amount, reason);
}
```

**Integration with Token Interface:**
```javascript
// In aniotaBiome_tokenInterface.js
giveStrongPositive() {
    const userEconomy = window.biomeModules?.userTokenEconomy;
    const cost = 3; // Strong positive reinforcement costs 3 tokens
    
    if (userEconomy && !userEconomy.spendToken(cost, 'strong_positive')) {
        this.showInsufficientTokensMessage();
        return false;
    }
    // Proceed with reinforcement...
}
```

### Behavior Polling Optimization

**Training Mode Detection:**
```javascript
// In aniotaBiome_petBehavior.js
detectTrainingMode() {
    const now = Date.now();
    const recentCommands = this.commandHistory.filter(cmd => 
        now - cmd.timestamp < 30000 // 30 seconds
    );
    return recentCommands.length >= 2;
}

startBehaviorLoop() {
    const isTraining = this.detectTrainingMode();
    const interval = isTraining ? 500 : 60000; // 500ms vs 1 minute
    
    setTimeout(() => this.startBehaviorLoop(), interval);
}
```

### Three-Layer Visual Rendering

**Layer Structure (AniotaBiome.js):**
```javascript
drawAniota() {
    // Layer 1: Nebula background
    this.drawNebulaBackground();
    
    // Layer 2: Activity rings (color changes based on state)
    this.drawActivityRings();
    
    // Layer 3: Pixie sprite with hovering animation
    this.drawPixieSprite();
}

drawPixieSprite() {
    const time = Date.now() * 0.001;
    const hoverY = Math.sin(time * 0.4) * 3; // 3px vertical bob
    const swayX = Math.sin(time * 0.3) * 1;  // 1px horizontal sway
    
    // Render pixie at calculated position with wing animation
}
```

### Natural Pet Instincts

**Reliability Progression:**
```javascript
// Commands start with natural reliability rates
this.commandReliability = {
    sit: 0.3,    // 30% natural success rate
    follow: 0.4, // 40% natural success rate  
    stay: 0.2    // 20% natural success rate
};

// Improve with successful training
reinforceCommand(command) {
    if (this.commandReliability[command] < 0.95) {
        this.commandReliability[command] += 0.05; // 5% improvement per success
    }
}
```

## 📋 Module Dependencies

```
AniotaBiome.js (Main Controller)
├── aniotaBiome_petBehavior.js (Natural instincts + training)
├── aniotaBiome_petMood.js (Mood state management)
├── aniotaBiome_trustTokenLearning.js (Learning phases)
├── aniotaBiome_tokenInterface.js (User interaction)
├── aniotaBiome_userTokenEconomy.js (Token balance system)
└── aniotaBiome_pointerExtension.js (Mouse interaction)
```

## 🎯 Configuration Constants

```javascript
// Timing Configuration
const NORMAL_POLLING_INTERVAL = 60000;  // 1 minute
const TRAINING_POLLING_INTERVAL = 500;  // 500ms
const TRAINING_DETECTION_WINDOW = 30000; // 30 seconds

// Token Economy
const STARTING_TOKEN_BALANCE = 5;
const STRONG_POSITIVE_COST = 3;
const MEDIUM_POSITIVE_COST = 2;
const LIGHT_POSITIVE_COST = 1;

// Learning Rates
const COMMAND_IMPROVEMENT_RATE = 0.05; // 5% per success
const MAX_COMMAND_RELIABILITY = 0.95;  // 95% maximum

// Visual Animation
const HOVER_AMPLITUDE = 3;    // 3px vertical movement
const SWAY_AMPLITUDE = 1;     // 1px horizontal movement
const HOVER_FREQUENCY = 0.4;  // Hover speed
const SWAY_FREQUENCY = 0.3;   // Sway speed
```

## 🔍 Debug Commands

**Browser Console Commands for Testing:**
```javascript
// Check token balance
window.biomeModules.userTokenEconomy.getBalance()

// Award test tokens
window.biomeModules.userTokenEconomy.awardTokens(10, 'testing')

// Check command reliability
window.biomeModules.petBehavior.commandReliability

// Force training mode
window.biomeModules.petBehavior.commandHistory.push({
    command: 'sit',
    timestamp: Date.now()
}, {
    command: 'sit', 
    timestamp: Date.now() - 5000
})
```

## 🚀 Performance Benchmarks

- **Memory Usage**: ~15MB (down from ~45MB with constant polling)
- **CPU Usage**: <1% during normal operation, <5% during training
- **Battery Impact**: Minimal (60-second intervals vs 100ms)
- **Render Performance**: 60fps with three-layer system

---

**File Location**: h:\DK_Softworks_LLC_Application_Projects\DK_SOFTWORKS_LLC\IX-TECH\TECHNICAL_REFERENCE_SEP2025.md

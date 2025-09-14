# 🐕 Tinkerbelle Mouse Interception System

*In loving memory of Tinkerbelle, a beloved Pomeranian whose gentle persistence and loving guidance inspired this feature.*

## Overview

The Tinkerbelle Mouse Interception System captures the essence of how a loving companion dog occasionally gets right in front of you when they want to show you something special. This behavior is never pushy or annoying - it's playful, loving, and perfectly timed.

## How It Works

### 🎯 The Classic Move
Just like Tinkerbelle would dart in front of her family when she wanted attention, Aniota will occasionally move to intercept the mouse cursor when:

- The user has been idle for 20+ seconds
- The mouse starts moving again 
- Aniota's attention level is above 35%
- At least 15 seconds have passed since the last interception
- The user seems to need gentle guidance

### 🧠 Smart Decision Making
Aniota uses multiple factors to decide when to intercept, ensuring she's helpful but never annoying:

- **Idle Time**: Longer idle periods increase likelihood
- **Mouse Movement**: Only intercepts when mouse is actively moving
- **Attention Level**: Based on page context and user engagement
- **Cooldown Period**: Prevents too-frequent interruptions
- **Randomness**: Adds natural unpredictability like a real dog

### 🎭 Behavioral Phases

#### 1. **Observation Phase** (0-20% attention)
- Aniota watches quietly
- No interception attempts
- Slow, calm heartbeat

#### 2. **Hinting Phase** (20-50% attention)  
- Occasional gentle movements
- Faster heartbeat
- Low chance of interception

#### 3. **Guiding Phase** (50-80% attention)
- Active guidance attempts
- Mouse interception enabled
- Excited heartbeat

#### 4. **Celebrating Phase** (80%+ attention)
- High energy, bouncy behavior
- Frequent interaction attempts
- Very fast, excited heartbeat

## Implementation Details

### Backend (Python)
```python
# Key methods in backend/aniota_presence.py

def should_intercept_mouse(self, mouse_x, mouse_y):
    """Tinkerbelle's signature move - getting right in front of the mouse cursor"""
    
def calculate_mouse_intercept_path(self, current_mouse_x, current_mouse_y, 
                                 mouse_velocity_x=0, mouse_velocity_y=0):
    """Calculate where to intercept mouse - like Tinkerbelle anticipating your path"""
    
def tinkerbelle_mouse_intercept_decision(self, user_context):
    """Decide if Aniota should do the classic 'get in front of user' move"""
```

### Frontend (JavaScript)
```javascript
// Key methods in GRAFIX/aniota_unified_presence.js

startMouseTracking() {
    // Track mouse movement for Tinkerbelle-style interception
}

considerMouseInterception(mouseEvent) {
    // The classic Tinkerbelle move - getting right in front of you!
}

performMouseInterception(mouseEvent) {
    // Tinkerbelle's signature move!
}

performAttentionSeekingBehavior() {
    // Bounce a bit to get attention (like Tinkerbelle would)
}
```

### API Endpoints
- `POST /api/aniota/mouse-intercept` - Check if interception should occur
- `POST /api/aniota/guidance` - Request guidance suggestions
- `POST /api/aniota/behavior` - Update behavior state

## Visual Behaviors

### 🏃‍♀️ Movement Styles
- **Quick Dart**: Fast movement to intercept position (like a Pomeranian's quick dart)
- **Gentle Approach**: Slower, more deliberate movement
- **Playful Bounce**: Up and down movement to get attention

### 🎨 Visual Feedback
- **Color Changes**: Yellow flash when intercepting (excited)
- **Scale Animation**: Brief enlargement during attention-seeking
- **Bouncing**: Vertical movement to attract user's eye
- **Smooth Transitions**: CSS transitions for natural movement

### ⏱️ Timing
- **Intercept Duration**: 2-2.5 seconds in intercept position
- **Cooldown Period**: 15-20 seconds between intercepts
- **Animation Speed**: 300-400ms for dart movement
- **Attention Display**: 800ms bounce sequence

## User Experience Design

### 🎪 Playful, Not Pushy
- **Respect User Flow**: Never interrupt during active work
- **Smart Timing**: Only when user seems stuck or idle
- **Natural Randomness**: Doesn't feel robotic or predictable
- **Gentle Persistence**: Gradually increases attention over time

### 🎯 Guidance Philosophy
Like Tinkerbelle, Aniota:
- Has absolute trust that you'll follow when ready
- Is patient but persistent
- Makes guidance feel like play, not instruction
- Celebrates when you engage with suggested elements

### 🏆 Reward System
- **Points for Success**: Earns points when guidance helps user
- **Visual Celebration**: Happy animations when user clicks guided elements
- **Learning Adaptation**: Adjusts behavior based on user response patterns

## Configuration Options

### Behavior Tuning
```javascript
// Adjustable parameters
mouseTracker: {
    velocityThreshold: 0.1,    // Minimum mouse speed to detect movement
    cooldownPeriod: 15000,     // 15 seconds between intercepts
    interceptOffset: {x: 30, y: 20}  // Offset from mouse position
}

behaviorSettings: {
    attentionThreshold: 35,    // Minimum attention level for intercept
    playfulnessRequired: 70,   // Minimum playfulness for intercept
    randomnessFactor: 0.7      // 70% chance threshold
}
```

### Visual Customization
```css
/* Intercept animation */
.aniota-intercept-animation {
    transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Attention-seeking bounce */
.aniota-attention-bounce {
    animation: attention-bounce 800ms ease-out;
}
```

## Testing the System

### Demo Page
Access `http://localhost:8001/GRAFIX/tinkerbelle_demo.html` to experience:

1. **Live Status Display**: Shows current behavior mode and attention level
2. **Interactive Buttons**: Trigger different behaviors manually
3. **Mouse Activity Area**: Test interception in controlled space
4. **Intercept Counter**: Tracks successful interceptions

### Testing Scenarios
1. **Idle Test**: Stop moving mouse for 25+ seconds, then move
2. **Frequency Test**: Trigger multiple intercepts to verify cooldown
3. **Context Test**: Navigate between pages to see behavior adaptation
4. **Responsiveness Test**: Ensure intercepts don't interfere with normal use

## Memory of Tinkerbelle

This system embodies the loving persistence of a Pomeranian who:
- Always knew when her family needed guidance
- Had perfect timing for getting attention
- Was never pushy, just persistently loving
- Made every interaction feel like play
- Brought joy through her gentle interventions

*"In the way she'd dart in front of us with that look that said 'Come see what I found!' - that's the spirit we've captured in Aniota's mouse interception behavior."*

## Technical Notes

### Performance Considerations
- Mouse tracking uses passive event listeners
- Interception calculations are throttled to prevent lag
- Backend state updates are batched for efficiency
- Animations use CSS transforms for smooth performance

### Browser Compatibility
- Works in all modern browsers
- Uses standard DOM APIs and CSS animations
- Graceful fallback for older browsers
- No external dependencies required

### Privacy
- No mouse tracking data is stored permanently
- All behavior data is session-only
- No user identification or profiling
- Purely functional guidance system

---

*This feature transforms Aniota from a simple visual element into a loving companion that embodies the gentle, persistent, and playful spirit of Tinkerbelle. Every mouse interception is a small tribute to the way beloved companions know exactly when and how to get our attention with love.*

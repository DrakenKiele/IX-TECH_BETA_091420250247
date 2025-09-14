# Multiple Beat Percussion System

## Overview
The center circle in the Aniota Field pinwheel now features dynamic multiple beat percussion, adding rhythmic complexity and organic variation to the musical heartbeat system.

## Features

### Multi-Beat Configuration
- **Chance**: 25% probability for any center beat to become a multiple beat
- **Types**:
  - Double beats: 70% of multi-beats (2 rapid hits)
  - Triple beats: 30% of multi-beats (3 rapid hits)
- **Timing**: 80ms delay between successive beats
- **Volume**: Additional beats play at 70% volume for natural dynamics

### Audio Implementation
- **Primary Beat**: Full volume, all sound characteristics intact
- **Additional Beats**: Reduced volume to create natural roll effect
- **Sound Types**: All percussion types support multi-beats:
  - Heartbeat Thump (kick)
  - Nature Snap (snare)
  - Wind Whistle (hihat)
  - Earth Pulse (tom)

### Integration with Existing Systems
- **Bee Choir**: Continues to harmonize on center beats regardless of multi-beat status
- **Visual Animation**: Center circle animation remains synchronized to the primary beat
- **Pattern Cycle**: Multi-beats don't affect the 8-beat percussion pattern cycle

## Code Structure

### New Configuration
```javascript
multiBeatChance: 0.25,      // 25% chance for multiple beats
multiBeatTypes: {
    double: 0.7,            // 70% of multi-beats are double
    triple: 0.3             // 30% of multi-beats are triple
},
multiBeatDelay: 80,         // Milliseconds between rapid beats
multiBeatVolume: 0.7        // Volume multiplier for additional beats
```

### Key Functions
- `createMultiplePercussionBeats(soundType)`: Main function that determines and executes multi-beats
- `createPercussionSound(soundType, volumeMultiplier)`: Enhanced to accept volume adjustment
- Random probability system for natural, unpredictable rhythm variation

## Musical Effect
The multiple beats create:
- **Organic Rhythm**: Unpredictable but musical variation
- **Natural Dynamics**: Volume tapering creates realistic drum roll effects
- **Rhythmic Complexity**: Maintains 4/4 time while adding syncopation
- **Interactive Feel**: Each session has unique rhythmic personality

## Console Logging
Multi-beats are logged with special emoji indicators:
- `🥁💥 Multi-beat: 2x kick rapid succession!`
- `🥁💥 Multi-beat: 3x snare rapid succession!`

This creates an engaging, dynamic percussion system that enhances the musical and visual experience of the Aniota Field without disrupting the core heartbeat synchronization.

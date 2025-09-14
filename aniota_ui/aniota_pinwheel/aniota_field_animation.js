if (window.DEV_MODE) {
    document.addEventListener('DOMContentLoaded', () => {
        const panel = document.getElementById('dev-recorder-panel');
        if (panel) panel.style.display = 'block';
        let recording = false;
        let playback = false;
        let buffer = [];
        let playbackIdx = 0;
        let playbackTimer = null;
        const logDiv = document.getElementById('dev-event-log');
        const recordBtn = document.getElementById('dev-record-btn');
        const stopBtn = document.getElementById('dev-stop-btn');
        const saveBtn = document.getElementById('dev-save-btn');
        const loadBtn = document.getElementById('dev-load-btn');
        const playBtn = document.getElementById('dev-play-btn');
        const labelInput = document.getElementById('dev-label-input');

        function updateLog() {
            logDiv.textContent = buffer.map(e => JSON.stringify(e)).join('\n');
        }

        function setButtons(state) {
            recordBtn.disabled = state === 'recording';
            stopBtn.disabled = !recording;
            saveBtn.disabled = buffer.length === 0;
            playBtn.disabled = buffer.length === 0 || recording;
        }

        recordBtn.onclick = () => {
            recording = true;
            buffer = [];
            updateLog();
            setButtons('recording');
        };
        stopBtn.onclick = () => {
            recording = false;
            setButtons('stopped');
        };
        saveBtn.onclick = () => {
            const label = labelInput.value.trim() || 'event_data';
            const blob = new Blob([JSON.stringify(buffer, null, 2)], {type:'application/json'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = label + '.json';
            a.click();
        };
        loadBtn.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,application/json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = evt => {
                    try {
                        buffer = JSON.parse(evt.target.result);
                        updateLog();
                        setButtons('stopped');
                    } catch (err) { alert('Invalid JSON file.'); }
                };
                reader.readAsText(file);
            };
            input.click();
        };
        playBtn.onclick = () => {
            if (playback) return;
            playback = true;
            playbackIdx = 0;
            setButtons('recording');
            function step() {
                if (playbackIdx >= buffer.length) {
                    playback = false;
                    setButtons('stopped');
                    return;
                }
                // Optionally, highlight or visualize the event here
                logDiv.scrollTop = logDiv.scrollHeight;
                playbackIdx++;
                playbackTimer = setTimeout(step, 80);
            }
            step();
        };

        // Listen for mouse and keyboard events
        document.addEventListener('mousemove', e => {
            if (recording) {
                buffer.push({
                    type: 'mouse',
                    timestamp: Date.now(),
                    x: e.clientX,
                    y: e.clientY,
                    button: null,
                    action: 'move'
                });
                updateLog();
            }
        });
        document.addEventListener('mousedown', e => {
            if (recording) {
                buffer.push({
                    type: 'mouse',
                    timestamp: Date.now(),
                    x: e.clientX,
                    y: e.clientY,
                    button: e.button,
                    action: 'down'
                });
                updateLog();
            }
        });
        document.addEventListener('mouseup', e => {
            if (recording) {
                buffer.push({
                    type: 'mouse',
                    timestamp: Date.now(),
                    x: e.clientX,
                    y: e.clientY,
                    button: e.button,
                    action: 'up'
                });
                updateLog();
            }
        });
        document.addEventListener('keydown', e => {
            if (recording) {
                buffer.push({
                    type: 'keyboard',
                    timestamp: Date.now(),
                    key: e.key,
                    action: 'down',
                    repeat: e.repeat
                });
                updateLog();
            }
        });
        document.addEventListener('keyup', e => {
            if (recording) {
                buffer.push({
                    type: 'keyboard',
                    timestamp: Date.now(),
                    key: e.key,
                    action: 'up',
                    repeat: e.repeat
                });
                updateLog();
            }
        });
        // Optionally, add clipboard and browser events here
        setButtons('stopped');
    });
}

const LEARNING_TRACKER = {
    sessionId: null,
    totalInteractions: 0,
    uniquePetalsClicked: new Set(),
    timeSpentOnPage: 0,
    startTime: Date.now(),
    lastInteractionTime: 0,
    explorationScore: 0,
    musicPatternDetected: false,
    creativityScore: 0
};

function initializeLearningSession() {
    LEARNING_TRACKER.sessionId = 'field_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    console.log('🌟 Aniota Field Learning Session Started:', LEARNING_TRACKER.sessionId);
    
    // Track time spent
    setInterval(() => {
        LEARNING_TRACKER.timeSpentOnPage = Date.now() - LEARNING_TRACKER.startTime;
    }, 1000);
}

// Record a Learning Moment (L+)
function recordLearningMoment(type, data = {}) {
    const moment = {
        sessionId: LEARNING_TRACKER.sessionId,
        timestamp: Date.now(),
        type: type,
        data: data,
        timeOnPage: Date.now() - LEARNING_TRACKER.startTime
    };
    
    console.log('📚 L+ Learning Moment:', moment);
    
    // Store in session storage for Aniota to access
    const learningMoments = JSON.parse(sessionStorage.getItem('aniota_learning_moments') || '[]');
    learningMoments.push(moment);
    sessionStorage.setItem('aniota_learning_moments', JSON.stringify(learningMoments));
    
    // Update tracker stats
    updateLearningStats(type, data);
}

// Update learning statistics
function updateLearningStats(type, data) {
    LEARNING_TRACKER.totalInteractions++;
    LEARNING_TRACKER.lastInteractionTime = Date.now();
    
    if (type === 'petal_click' && data.petalId !== undefined) {
        LEARNING_TRACKER.uniquePetalsClicked.add(data.petalId);
        
        // Calculate exploration score (percentage of petals discovered)
        LEARNING_TRACKER.explorationScore = (LEARNING_TRACKER.uniquePetalsClicked.size / 9) * 100;
        
        // Detect musical patterns
        if (LEARNING_TRACKER.uniquePetalsClicked.size >= 5) {
            LEARNING_TRACKER.musicPatternDetected = true;
        }
    }
    
    // Calculate creativity score based on varied interactions
    if (LEARNING_TRACKER.totalInteractions > 10) {
        LEARNING_TRACKER.creativityScore = Math.min(100, 
            (LEARNING_TRACKER.uniquePetalsClicked.size * 15) + 
            (LEARNING_TRACKER.totalInteractions * 2)
        );
    }
    
    // Send periodic updates to Aniota
    if (LEARNING_TRACKER.totalInteractions % 5 === 0) {
        sendLearningUpdateToAniota();
    }
}

// Send learning progress to Aniota presence system
function sendLearningUpdateToAniota() {
    const learningUpdate = {
        sessionId: LEARNING_TRACKER.sessionId,
        stats: {
            totalInteractions: LEARNING_TRACKER.totalInteractions,
            explorationScore: LEARNING_TRACKER.explorationScore,
            creativityScore: LEARNING_TRACKER.creativityScore,
            timeSpent: LEARNING_TRACKER.timeSpentOnPage,
            engagement: calculateEngagementLevel()
        }
    };
    
    // Try to notify Aniota presence system
    if (typeof window.aniotaPresence !== 'undefined' && window.aniotaPresence.recordInteraction) {
        window.aniotaPresence.recordInteraction('field_learning', learningUpdate);
    }
    
    console.log('🎯 Learning Update sent to Aniota:', learningUpdate);
}

// Calculate engagement level
function calculateEngagementLevel() {
    const timeMinutes = LEARNING_TRACKER.timeSpentOnPage / (1000 * 60);
    const interactionRate = LEARNING_TRACKER.totalInteractions / Math.max(timeMinutes, 0.1);
    
    if (interactionRate > 5) return 'high';
    if (interactionRate > 2) return 'medium';
    return 'low';
}

// Heartbeat timing configuration
const HEARTBEAT_CONFIG = {
    beatDuration: 500,    // Each beat gets 500ms
    pulseDuration: 250,   // Pulse animation within first 250ms
};

// 🌪️ PINWHEEL SPINNING CONFIGURATION 🌪️
const PINWHEEL_CONFIG = {
    baseSpinSpeed: 0.5,        // Base rotation speed (degrees per frame)
    maxSpinSpeed: 3.0,         // Maximum spin speed during interactions
    spinAcceleration: 0.1,     // How fast it speeds up
    spinDeceleration: 0.98,    // How fast it slows down (friction)
    windVariation: 0.2,        // Random wind effect variation
    interactionBoost: 2.0      // Speed boost when kids interact
};

let currentSpinSpeed = PINWHEEL_CONFIG.baseSpinSpeed;
let totalRotation = 0;
let lastInteractionTime = 0;

// Musical notes for do-re-mi scale (C major scale frequencies in Hz)
const MUSICAL_NOTES = {
    do: 261.63,   // C4
    re: 293.66,   // D4
    mi: 329.63,   // E4
    fa: 349.23,   // F4
    sol: 392.00,  // G4
    la: 440.00,   // A4
    ti: 493.88,   // B4
    do_high: 523.25 // C5
};

// Note sequence for each petal
const NOTE_SEQUENCE = [
    'do',      // Petal 0
    're',      // Petal 1
    'mi',      // Petal 2
    'fa',      // Petal 3
    'sol',     // Petal 4
    'la',      // Petal 5
    'ti',      // Petal 6
    'do_high', // Petal 7
    'do'       // Center (back to do)
];

// Audio context for generating tones
let audioContext;
let isAudioInitialized = false;

// 🎵 ON/OFF SWITCH SYSTEM 🎵
let isMusicOn = true;
let surpriseAudio = null; // For the child laughter surprise

// Bee Choir configuration - 5 individual bee personalities
const BEE_CHOIR_CONFIG = {
    bees: [
        {
            name: 'Bass Bee',
            role: 'bass',
            baseFreq: 80,
            tempo: 0.7,        // Slow and steady
            buzzPattern: [400, 100, 300, 200], // Long buzz, short rest
            volume: 0.08,
            wobble: 0.005,     // Very stable
            personality: 'steady and deep'
        },
        {
            name: 'Baritone Bee',
            role: 'baritone',
            baseFreq: 120,
            tempo: 0.9,        // Moderate pace
            buzzPattern: [300, 150, 250, 100], // Medium buzz
            volume: 0.06,
            wobble: 0.01,      // Slight variation
            personality: 'warm and supportive'
        },
        {
            name: 'Tenor Bee',
            role: 'tenor',
            baseFreq: 180,
            tempo: 1.1,        // Slightly faster
            buzzPattern: [250, 100, 200, 150], // Quick bursts
            volume: 0.05,
            wobble: 0.015,     // More expressive
            personality: 'bright and energetic'
        },
        {
            name: 'Alto Bee',
            role: 'alto',
            baseFreq: 240,
            tempo: 1.3,        // Faster, more active
            buzzPattern: [200, 80, 180, 120], // Rapid patterns
            volume: 0.04,
            wobble: 0.02,      // Very expressive
            personality: 'agile and melodic'
        },
        {
            name: 'Soprano Bee',
            role: 'soprano',
            baseFreq: 320,
            tempo: 1.5,        // Fastest, most active
            buzzPattern: [150, 60, 120, 80], // Quick, delicate
            volume: 0.03,
            wobble: 0.025,     // Most expressive
            personality: 'light and dancing'
        }
    ],
    choirGain: 0.8,           // Overall choir volume
    harmonicRatios: [1, 1.5, 2, 3], // More complex harmonics for bee-like sound
    reverbTime: 0.3,          // Natural outdoor reverb
};

let beeChoirNodes = []; // Store active bee choir oscillators
let beeStates = []; // Track each bee's current state
let choirStartTime = 0; // When the choir started

// Percussion configuration for center circle
const PERCUSSION_CONFIG = {
    sounds: [
        {
            name: 'Heartbeat Thump',
            type: 'kick',
            frequency: 60,
            decay: 0.3,
            volume: 0.15,
            filter: 'lowpass',
            cutoff: 120
        },
        {
            name: 'Nature Snap',
            type: 'snare',
            frequency: 200,
            decay: 0.15,
            volume: 0.08,
            filter: 'bandpass',
            cutoff: 800
        },
        {
            name: 'Wind Whistle',
            type: 'hihat',
            frequency: 8000,
            decay: 0.1,
            volume: 0.05,
            filter: 'highpass',
            cutoff: 6000
        },
        {
            name: 'Earth Pulse',
            type: 'tom',
            frequency: 100,
            decay: 0.4,
            volume: 0.1,
            filter: 'bandpass',
            cutoff: 300
        }
    ],
    patterns: [
        'kick',      // Beat 1: Strong heartbeat
        'snare',     // Beat 2: Natural snap
        'kick',      // Beat 3: Heartbeat again
        'hihat',     // Beat 4: Wind whistle
        'tom',       // Beat 5: Earth pulse
        'snare',     // Beat 6: Nature snap
        'kick',      // Beat 7: Heartbeat
        'hihat'      // Beat 8: Wind whistle
    ],
    // Multiple beat configuration
    multiBeatChance: 0.25,  // 25% chance for multiple beats
    multiBeatTypes: {
        double: 0.7,        // 70% of multi-beats are double
        triple: 0.3         // 30% of multi-beats are triple
    },
    multiBeatDelay: 80,     // Milliseconds between rapid beats
    multiBeatVolume: 0.7    // Volume multiplier for additional beats
};

function initializeAudio() {
    if (!isAudioInitialized) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Resume audio context in case it's suspended
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    console.log('Audio context resumed');
                });
            }

            isAudioInitialized = true;
            console.log('🎵 Audio system initialized with 5-Bee Harmonic Choir!');
            console.log('🐝 Click anywhere to hear the bee choir harmonize!');

            // Show visual feedback that audio is ready
            document.body.style.cursor = 'pointer';

            // Initialize surprise audio (child laughter)
            initializeSurpriseAudio();

        } catch (error) {
            console.error('Audio initialization failed:', error);
        }
    }
}

function initializeSurpriseAudio() {
    try {
        surpriseAudio = new Audio('audio/child-laugh-tickles.mp3');
        surpriseAudio.volume = 0.7; // Nice volume level
        surpriseAudio.preload = 'auto';
        console.log('🎈 Surprise audio loaded! Ready for giggles!');
    } catch (error) {
        console.log('⚠️ Could not load surprise audio:', error);
    }
}

function playSurpriseAudio() {
    if (surpriseAudio) {
        try {
            // Reset to beginning in case it was played before
            surpriseAudio.currentTime = 0;
            surpriseAudio.play().then(() => {
                console.log('🎈😄 SURPRISE! Child laughter playing!');
                showKidEncouragement("Hee hee! Music off means giggles on! 😄🎈");
            }).catch(error => {
                console.log('Could not play surprise audio:', error);
            });
        } catch (error) {
            console.log('Surprise audio error:', error);
        }
    }
}

function playNote(frequency, duration = 200) {
    if (!isAudioInitialized || !isMusicOn) {
        if (!isMusicOn) {
            console.log('🔇 Music is turned off - quiet mode active!');
        } else {
            console.log('🔇 Audio not initialized - click anywhere to enable sound!');
        }
        return;
    }

    try {
        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine'; // Pure sine wave for clean musical tones

        // Envelope for smooth attack and decay
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01); // Slightly louder
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
        console.log('🚫 Audio playback error:', error);
    }
}

function createPercussionSound(soundType, volumeMultiplier = 1.0) {
    if (!isAudioInitialized || !isMusicOn) return;

    try {
        // Find the percussion sound configuration
        const soundConfig = PERCUSSION_CONFIG.sounds.find(s => s.type === soundType);
        if (!soundConfig) return;

        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filterNode = audioContext.createBiquadFilter();

        // Setup filter based on percussion type
        filterNode.type = soundConfig.filter;
        filterNode.frequency.setValueAtTime(soundConfig.cutoff, audioContext.currentTime);
        filterNode.Q.setValueAtTime(1, audioContext.currentTime);

        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configure oscillator for percussion sound
        if (soundType === 'kick' || soundType === 'tom') {
            // Low frequency thump with pitch sweep
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(soundConfig.frequency * 2, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(soundConfig.frequency, audioContext.currentTime + 0.1);
        } else if (soundType === 'snare') {
            // Mid-frequency snap with noise-like quality
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(soundConfig.frequency, audioContext.currentTime);
            // Add frequency modulation for snare-like rattle
            const lfo = audioContext.createOscillator();
            const lfoGain = audioContext.createGain();
            lfo.frequency.setValueAtTime(50, audioContext.currentTime);
            lfoGain.gain.setValueAtTime(soundConfig.frequency * 0.3, audioContext.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            lfo.start(audioContext.currentTime);
            lfo.stop(audioContext.currentTime + soundConfig.decay);
        } else if (soundType === 'hihat') {
            // High frequency whistle/wind sound
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(soundConfig.frequency, audioContext.currentTime);
        }

        // Percussion envelope - quick attack, exponential decay with volume multiplier
        const adjustedVolume = soundConfig.volume * volumeMultiplier;
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(adjustedVolume, audioContext.currentTime + 0.005); // Very quick attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + soundConfig.decay);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + soundConfig.decay);

        console.log(`🥁 Center percussion: ${soundConfig.name} (${soundType}) - vol: ${adjustedVolume.toFixed(3)}`);

        // Cleanup
        setTimeout(() => {
            try {
                oscillator.disconnect();
                gainNode.disconnect();
                filterNode.disconnect();
            } catch (e) {
                // Already cleaned up
            }
        }, soundConfig.decay * 1000 + 50);

    } catch (error) {
        console.log('🚫 Percussion error:', error);
    }
}

function createMultiplePercussionBeats(soundType) {
    if (!isAudioInitialized || !isMusicOn) return;

    // Determine if this should be a multiple beat
    const shouldMultiBeat = Math.random() < PERCUSSION_CONFIG.multiBeatChance;

    if (!shouldMultiBeat) {
        // Single beat
        createPercussionSound(soundType);
        return;
    }

    // Determine double or triple beat
    const isTriple = Math.random() < PERCUSSION_CONFIG.multiBeatTypes.triple;
    const beatCount = isTriple ? 3 : 2;

    console.log(`🥁💥 Multi-beat: ${beatCount}x ${soundType} rapid succession!`);

    // Play the first beat at full volume
    createPercussionSound(soundType, 1.0);

    // Schedule additional beats with reduced volume
    for (let i = 1; i < beatCount; i++) {
        setTimeout(() => {
            createPercussionSound(soundType, PERCUSSION_CONFIG.multiBeatVolume);
        }, i * PERCUSSION_CONFIG.multiBeatDelay);
    }
}

function initializeBeeChoir() {
    choirStartTime = Date.now();
    beeStates = BEE_CHOIR_CONFIG.bees.map((bee, index) => ({
        ...bee,
        id: index,
        currentFreq: bee.baseFreq,
        lastBuzzTime: 0,
        patternIndex: 0,
        isActive: false,
        phase: Math.random() * Math.PI * 2, // Random starting phase
    }));

    console.log('🐝 Initialized Bee Choir with 5 personalities:');
    beeStates.forEach(bee => {
        console.log(`  ${bee.name} (${bee.role}): ${bee.baseFreq}Hz, tempo ${bee.tempo}x - ${bee.personality}`);
    });
}

function updateBeeForPetal(petalNote) {
    // Get the fundamental frequency from the current petal's musical note
    const fundamentalFreq = MUSICAL_NOTES[petalNote];
    if (!fundamentalFreq) return;

    // Update each bee's frequency to harmonize with the current petal
    beeStates.forEach((bee, index) => {
        const harmonicRatio = BEE_CHOIR_CONFIG.harmonicRatios[index % BEE_CHOIR_CONFIG.harmonicRatios.length];
        bee.currentFreq = (fundamentalFreq * harmonicRatio * bee.baseFreq) / 200; // Scale to bee range

        // Keep in bee frequency range (60-400 Hz)
        while (bee.currentFreq > 400) bee.currentFreq /= 2;
        while (bee.currentFreq < 60) bee.currentFreq *= 2;
    });
}

function createIndividualBee(bee, duration) {
    if (!isAudioInitialized || !isMusicOn) return null;

    try {
        const beeNodes = [];

        // Create multiple harmonics for more bee-like sound
        BEE_CHOIR_CONFIG.harmonicRatios.forEach((harmonic, harmonicIndex) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filterNode = audioContext.createBiquadFilter();

            // Bee-specific filter settings
            filterNode.type = 'bandpass';
            const centerFreq = bee.currentFreq * harmonic;
            filterNode.frequency.setValueAtTime(centerFreq, audioContext.currentTime);
            filterNode.Q.setValueAtTime(4 + harmonicIndex, audioContext.currentTime); // Higher Q for upper harmonics

            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Individual bee characteristics
            const wobble = 1 + (Math.random() - 0.5) * bee.wobble;
            const freq = centerFreq * wobble;
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

            // More bee-like waveform (sawtooth for buzzier sound)
            oscillator.type = Math.random() > 0.5 ? 'sawtooth' : 'triangle';

            // Individual bee volume based on harmonic and bee role
            const harmonicGain = bee.volume / (harmonicIndex + 1);
            const finalGain = harmonicGain * BEE_CHOIR_CONFIG.choirGain;

            // Natural bee envelope with personality
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(finalGain, audioContext.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(finalGain * 0.7, audioContext.currentTime + duration * 0.7 / 1000);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);

            // Bee-specific vibrato
            const lfo = audioContext.createOscillator();
            const lfoGain = audioContext.createGain();
            lfo.frequency.setValueAtTime(3 + Math.random() * 4, audioContext.currentTime); // 3-7 Hz flutter
            lfoGain.gain.setValueAtTime(freq * bee.wobble * 2, audioContext.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
            lfo.start(audioContext.currentTime);
            lfo.stop(audioContext.currentTime + duration / 1000);

            beeNodes.push({ oscillator, gainNode, filterNode, lfo, lfoGain });
        });

        return beeNodes;

    } catch (error) {
        console.log(`🚫 Error creating ${bee.name}:`, error);
        return null;
    }
}

function updateBeeChoir() {
    if (!isAudioInitialized || beeStates.length === 0 || !isMusicOn) return;

    const currentTime = Date.now();
    const choirTime = currentTime - choirStartTime;

    beeStates.forEach(bee => {
        // Calculate when this bee should buzz based on its tempo and pattern
        const adjustedTime = choirTime * bee.tempo;
        const patternDuration = bee.buzzPattern.reduce((a, b) => a + b, 0);
        const positionInPattern = adjustedTime % patternDuration;

        let cumulativeTime = 0;
        let shouldBuzz = false;

        // Check if we're in a buzz period (not a rest)
        for (let i = 0; i < bee.buzzPattern.length; i += 2) {
            const buzzDuration = bee.buzzPattern[i];
            const restDuration = bee.buzzPattern[i + 1] || 0;

            if (positionInPattern >= cumulativeTime && positionInPattern < cumulativeTime + buzzDuration) {
                shouldBuzz = true;
                break;
            }
            cumulativeTime += buzzDuration + restDuration;
        }

        // Start new buzz if needed
        if (shouldBuzz && !bee.isActive && (currentTime - bee.lastBuzzTime > 50)) {
            const buzzDuration = bee.buzzPattern[bee.patternIndex];
            const beeNodes = createIndividualBee(bee, buzzDuration);

            if (beeNodes) {
                beeChoirNodes.push(...beeNodes);
                bee.isActive = true;
                bee.lastBuzzTime = currentTime;

                // Clean up after buzz finishes
                setTimeout(() => {
                    bee.isActive = false;
                    bee.patternIndex = (bee.patternIndex + 2) % bee.buzzPattern.length;

                    // Clean up nodes
                    beeNodes.forEach(nodeSet => {
                        try {
                            nodeSet.oscillator.disconnect();
                            nodeSet.gainNode.disconnect();
                            nodeSet.filterNode.disconnect();
                            nodeSet.lfo.disconnect();
                            nodeSet.lfoGain.disconnect();
                        } catch (e) {
                            // Already cleaned up
                        }
                    });
                }, buzzDuration + 10);
            }
        }
    });
}

function createBeeChoir(petalId) {
    if (!isAudioInitialized) {
        console.log('� Bee choir silent - click to wake the bees!');
        return;
    }

    try {
        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // Get the note for this petal to update harmonies
        const noteIndex = petalId === 8 ? 0 : petalId;
        const noteName = NOTE_SEQUENCE[noteIndex];

        // Initialize choir if not already done
        if (beeStates.length === 0) {
            initializeBeeChoir();
        }

        // Update bee frequencies to harmonize with current note
        updateBeeForPetal(noteName);

        // 🐝 Trigger visual bees to sync with audio
        syncBeesWithAudio(petalId);

        console.log(`🎵 Petal ${petalId} (${noteName}) triggers bee choir harmony update`);
        console.log(`🐝 Current bee frequencies: ${beeStates.map(b => `${b.name}: ${Math.round(b.currentFreq)}Hz`).join(', ')}`);

    } catch (error) {
        console.log('🚫 Bee choir error:', error);
    }
}

// Petal class definition
class Petal {
    constructor(id, type = 'outer') {
        this.id = id;
        this.type = type;
        this.element = document.getElementById(`petal-${id}`);
        this.baseScale = 1.0;
        this.minScale = 0.6;
        this.baseSize = type === 'center' ? 120 : null;
        this.minSize = type === 'center' ? 80 : null;

        // Debug logging for center circle
        if (type === 'center') {
            console.log(`🟡 Center circle (petal-${id}):`, this.element ? 'FOUND' : 'NOT FOUND');
            if (this.element) {
                console.log('Center element classes:', this.element.className);
                console.log('Center element style:', this.element.style.cssText);
            }
        }

        // Color properties for neon effect
        if (type === 'center') {
            this.normalColor = '#B8860B'; // Dark goldenrod
            this.neonColor = '#FFD700';   // Bright gold
            this.normalBorder = '#8B6914'; // Darker border
            this.neonBorder = '#FFFF00';   // Bright yellow border
        } else {
            // Get neon color from CSS custom property
            this.neonColor = this.element?.style.getPropertyValue('--neon-color') || '#ff0066';
            this.pathElement = this.element?.querySelector('path');
            if (this.pathElement) {
                this.normalFill = this.pathElement.getAttribute('fill');
                this.normalStroke = this.pathElement.getAttribute('stroke');
            }
        }
    }

    isActive() {
        return this.element !== null;
    }

    reset() {
        if (!this.isActive()) return;

        if (this.type === 'center') {
            this.element.style.width = this.baseSize + 'px';
            this.element.style.height = this.baseSize + 'px';
            // Reset to normal colors
            this.element.style.background = this.normalColor;
            this.element.style.borderColor = this.normalBorder;
        } else {
            const currentTransform = this.element.style.transform;
            // Remove any scale transforms and reset to base
            const baseTransform = currentTransform.replace(/scale\([^)]*\)/g, '').replace(/scaleX\([^)]*\)/g, '').replace(/scaleY\([^)]*\)/g, '');
            const newTransform = baseTransform + ` scaleX(${this.baseScale}) scaleY(${this.baseScale})`;
            this.element.style.transform = newTransform;

            // Reset to normal colors
            if (this.pathElement) {
                this.pathElement.setAttribute('fill', this.normalFill);
                this.pathElement.setAttribute('stroke', this.normalStroke);
            }
        }
    }

    animate(beatTime) {
        if (!this.isActive()) return;

        const pulseProgress = beatTime / HEARTBEAT_CONFIG.pulseDuration;

        if (this.type === 'center') {
            this.animateCenter(pulseProgress);
        } else {
            this.animateOuter(pulseProgress);
        }

        // Play musical note at the start of each beat
        if (beatTime < 10) { // Only trigger once at the beginning of each beat
            this.playPetalNote();
        }
    }

    playPetalNote() {
        // Get the note for this petal
        const noteIndex = this.type === 'center' ? 8 : this.id;
        const noteName = NOTE_SEQUENCE[noteIndex];
        const frequency = MUSICAL_NOTES[noteName];

        if (frequency) {
            if (this.type === 'center') {
                // Center circle plays percussion with possible multiple beats
                const percussionIndex = Math.floor(Date.now() / 1000) % PERCUSSION_CONFIG.patterns.length;
                const percussionType = PERCUSSION_CONFIG.patterns[percussionIndex];
                createMultiplePercussionBeats(percussionType); // Use new multiple beat function
                createBeeChoir(noteIndex); // Still harmonize with bee choir
                console.log(`🥁 Center circle multi-percussion: ${percussionType} + bee choir harmony`);
            } else {
                // Outer petals play musical notes and bee choir
                playNote(frequency, 150); // Musical note for 150ms
                createBeeChoir(noteIndex); // Bee choir buzz
                console.log(`🎵 Petal ${this.id} (${this.type}) plays: ${noteName} (${frequency}Hz) + bee buzz`);
            }
        }
    }

    animateOuter(pulseProgress) {
        // Create transform for width (scaleX) and length (scaleY) independently
        let scaleX = this.baseScale; // Width scaling
        let scaleY = this.baseScale; // Length scaling

        if (pulseProgress < 0.5) {
            // Phase 1: Shrink width, grow length
            scaleX = this.baseScale - (pulseProgress * 2) * (this.baseScale - 0.6); // Shrink width to 60%
            scaleY = this.baseScale + (pulseProgress * 2) * (1.4 - this.baseScale); // Grow length to 140%
        } else {
            // Phase 2: Return to normal
            scaleX = 0.6 + ((pulseProgress - 0.5) * 2) * (this.baseScale - 0.6); // Return width to normal
            scaleY = 1.4 - ((pulseProgress - 0.5) * 2) * (1.4 - this.baseScale); // Return length to normal
        }

        // Apply transform with separate X and Y scaling
        const currentTransform = this.element.style.transform;
        // Remove any existing scale transforms
        const baseTransform = currentTransform.replace(/scale\([^)]*\)/g, '').replace(/scaleX\([^)]*\)/g, '').replace(/scaleY\([^)]*\)/g, '');
        const newTransform = baseTransform + ` scaleX(${scaleX}) scaleY(${scaleY})`;
        this.element.style.transform = newTransform;

        // Animate color to neon and back
        this.animateColor(pulseProgress);
    }

    animateColor(pulseProgress) {
        if (!this.pathElement) return;

        // Calculate color interpolation
        let colorIntensity;
        if (pulseProgress < 0.5) {
            // Phase 1: Normal to neon
            colorIntensity = pulseProgress * 2;
        } else {
            // Phase 2: Neon back to normal
            colorIntensity = 1 - ((pulseProgress - 0.5) * 2);
        }

        // Interpolate between normal and neon colors
        const fillColor = this.interpolateColor(this.normalFill, this.neonColor, colorIntensity);
        const strokeColor = this.interpolateColor(this.normalStroke, this.neonColor, colorIntensity);

        this.pathElement.setAttribute('fill', fillColor);
        this.pathElement.setAttribute('stroke', strokeColor);
    }

    interpolateColor(color1, color2, factor) {
        // Simple hex color interpolation
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');

        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);

        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);

        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    animateCenter(pulseProgress) {
        console.log(`🟡 Animating center circle - progress: ${pulseProgress.toFixed(2)}`);

        // Create wave motion with offset width and height changes
        const widthPhase = pulseProgress;
        const heightPhase = (pulseProgress + 0.25) % 1; // 90-degree phase offset

        // Calculate width pulse (shrinking)
        let width = this.baseSize;
        if (widthPhase < 0.5) {
            width = this.baseSize - (widthPhase * 2) * (this.baseSize - this.minSize);
        } else {
            width = this.minSize + ((widthPhase - 0.5) * 2) * (this.baseSize - this.minSize);
        }

        // Calculate height pulse (offset from width, shrinking)
        let height = this.baseSize;
        if (heightPhase < 0.5) {
            height = this.baseSize - (heightPhase * 2) * (this.baseSize - this.minSize);
        } else {
            height = this.minSize + ((heightPhase - 0.5) * 2) * (this.baseSize - this.minSize);
        }

        // Apply the animation with important styles to override CSS
        this.element.style.setProperty('width', width + 'px', 'important');
        this.element.style.setProperty('height', height + 'px', 'important');
        this.element.style.setProperty('transition', 'none', 'important');

        console.log(`🟡 Center size: ${width}x${height}px`);

        // Animate color for center circle
        this.animateCenterColor(pulseProgress);
    }

    animateCenterColor(pulseProgress) {
        // Calculate color interpolation
        let colorIntensity;
        if (pulseProgress < 0.5) {
            // Phase 1: Normal to neon
            colorIntensity = pulseProgress * 2;
        } else {
            // Phase 2: Neon back to normal
            colorIntensity = 1 - ((pulseProgress - 0.5) * 2);
        }

        // Interpolate between normal and neon colors
        const bgColor = this.interpolateColor(this.normalColor, this.neonColor, colorIntensity);
        const borderColor = this.interpolateColor(this.normalBorder, this.neonBorder, colorIntensity);

        this.element.style.background = bgColor;
        this.element.style.borderColor = borderColor;
    }
}

// Create petal objects
const petals = [
    new Petal(0), new Petal(1), new Petal(2), new Petal(3),
    new Petal(4), new Petal(5), new Petal(6), new Petal(7),
    new Petal(8, 'center')
];

let animationStartTime = 0;
const totalBeats = 16; // 8 outer petals + 8 center beats = 16 total beats
const totalCycleDuration = totalBeats * HEARTBEAT_CONFIG.beatDuration;

// Heartbeat controller using petal objects
function heartbeatController() {
    const currentTime = Date.now();
    if (animationStartTime === 0) {
        animationStartTime = currentTime;
    }

    // Calculate current beat and timing
    const cycleTime = (currentTime - animationStartTime) % totalCycleDuration;
    const currentBeatIndex = Math.floor(cycleTime / HEARTBEAT_CONFIG.beatDuration);
    const beatTime = cycleTime % HEARTBEAT_CONFIG.beatDuration;

    // Determine which petal should be active
    const isOuterPetalBeat = currentBeatIndex % 2 === 0;
    const isCenterBeat = currentBeatIndex % 2 === 1;
    const outerPetalIndex = Math.floor(currentBeatIndex / 2);

    // 🌪️ UPDATE PINWHEEL SPINNING 🌪️
    updatePinwheelSpin(currentTime);

    // Reset all petals
    petals.forEach(petal => petal.reset());

    // Animate the active petal if within pulse duration
    if (beatTime < HEARTBEAT_CONFIG.pulseDuration) {
        if (isOuterPetalBeat && outerPetalIndex < 8) {
            // Animate outer petal
            petals[outerPetalIndex].animate(beatTime);
        } else if (isCenterBeat) {
            // Animate center petal
            petals[8].animate(beatTime);
        }
    }

    // Update the continuous bee choir (independent of petal beats)
    updateBeeChoir();

    // 🐝 Update visual bees flying around
    updateBeeVisuals();

    // Continue heartbeat
    requestAnimationFrame(heartbeatController);
}

function updatePinwheelSpin(currentTime) {
    // Calculate time since last interaction for natural slowdown
    const timeSinceInteraction = currentTime - lastInteractionTime;

    // Apply natural deceleration (friction)
    if (timeSinceInteraction > 1000) { // 1 second after interaction
        currentSpinSpeed *= PINWHEEL_CONFIG.spinDeceleration;
    }

    // Ensure minimum spin speed (gentle breeze effect)
    if (currentSpinSpeed < PINWHEEL_CONFIG.baseSpinSpeed) {
        currentSpinSpeed = PINWHEEL_CONFIG.baseSpinSpeed;
    }

    // Add subtle wind variation for natural movement
    const windEffect = (Math.sin(currentTime * 0.001) * PINWHEEL_CONFIG.windVariation);
    const frameSpinSpeed = currentSpinSpeed + windEffect;

    // Update total rotation
    totalRotation += frameSpinSpeed;

    // Apply rotation to the entire pinwheel container
    const pinwheelContainer = document.querySelector('[style*="position: relative; width: 200px; height: 200px"]');
    if (pinwheelContainer) {
        pinwheelContainer.style.transform = `rotate(${totalRotation}deg)`;
    }

    // Apply counter-rotation to center circle to keep it stable
    const centerCircle = document.getElementById('petal-8');
    if (centerCircle) {
        centerCircle.style.transform = `translate(-50%, -50%) rotate(${-totalRotation}deg)`;
    }
}

function boostPinwheelSpin() {
    lastInteractionTime = Date.now();
    currentSpinSpeed = Math.min(
        currentSpinSpeed + PINWHEEL_CONFIG.interactionBoost,
        PINWHEEL_CONFIG.maxSpinSpeed
    );
    console.log(`🌪️ Pinwheel spin boosted! Speed: ${currentSpinSpeed.toFixed(2)}`);
}

// Musical note frequencies for each petal (C4 to C5 range)
const PETAL_NOTES = [
    261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25
];

// Initialize petals and set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    // The HTML already contains all petal elements (SVG petals 0-7 and center circle petal-8)
    // Just ensure petal objects are linked to existing elements
    petals.forEach((petal) => {
        petal.element = document.getElementById(`petal-${petal.id}`);
        if (petal.element) {
            console.log(`✅ Found ${petal.type} petal-${petal.id}:`, petal.element.tagName);
        } else {
            console.error(`❌ Missing petal-${petal.id}`);
        }
    });

    // Special setup for center circle (petal 8) - just enhance the existing element
    const centerElement = document.getElementById('petal-8');
    if (centerElement) {
        console.log('🟡 Enhancing existing center circle element');
        // Keep existing positioning and styling from HTML/CSS, just add glow effect
        centerElement.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.7), 0 0 40px rgba(255, 215, 0, 0.5)';
    }

    // Initialize audio and start heartbeat controller
    initializeAudio();

    // 🐝 Initialize visual bee system
    setTimeout(createBeeVisualSystem, 500);

    heartbeatController();

    // Fun kid-friendly messages
    const kidMessages = [
        "Awesome! 🌟", "Great job! 🎉", "Music magic! ✨", "You're a natural! 🎵",
        "Beautiful! 🌸", "Keep playing! 🎶", "Amazing sounds! 🐝", "So cool! 💫",
        "Perfect! 🎯", "You rock! 🤘", "Fantastic! 🌈", "Wonderful! 🎪"
    ];

    // Click counter for encouraging kids
    let clickCount = 0;

    // Add click handlers to all petals (0-7) and center (8)
    petals.forEach((petal, index) => {
        if (petal.element) {
            // Make elements clearly clickable
            petal.element.style.cursor = 'pointer';
            petal.element.style.transition = 'transform 0.1s ease';

            // Add hover effect for better feedback
            petal.element.addEventListener('mouseenter', () => {
                petal.element.style.transform = (petal.element.style.transform || '') + ' scale(1.05)';
            });

            petal.element.addEventListener('mouseleave', () => {
                petal.element.style.transform = petal.element.style.transform.replace(' scale(1.05)', '');
            });

            // Main click handler
            petal.element.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent triggering parent handlers

                clickCount++;
                const randomMessage = kidMessages[Math.floor(Math.random() * kidMessages.length)];
                
                // 🌟 RECORD LEARNING MOMENT (L+) 🌟
                recordLearningMoment('petal_click', {
                    petalId: index,
                    petalType: petal.type,
                    clickNumber: clickCount,
                    timeFromStart: Date.now() - LEARNING_TRACKER.startTime,
                    note: petal.type === 'center' ? NOTE_SEQUENCE[8] : NOTE_SEQUENCE[index],
                    explorationProgress: LEARNING_TRACKER.explorationScore
                });

                console.log(`🎯 Kid clicked on ${petal.type === 'center' ? 'Center Circle' : `Petal ${index}`}! ${randomMessage}`);

                // Show encouraging message every few clicks
                if (clickCount % 5 === 0) {
                    showKidEncouragement(`${randomMessage} You've clicked ${clickCount} times!`);
                    
                    // Record milestone learning moment
                    recordLearningMoment('milestone_reached', {
                        milestone: 'clicks_' + clickCount,
                        totalClicks: clickCount,
                        uniquePetals: LEARNING_TRACKER.uniquePetalsClicked.size,
                        explorationScore: LEARNING_TRACKER.explorationScore
                    });
                }

                // Ensure audio is initialized
                initializeAudio();

                // Immediate visual feedback - quick bounce
                petal.element.style.transform = (petal.element.style.transform || '') + ' scale(0.95)';
                setTimeout(() => {
                    petal.element.style.transform = petal.element.style.transform.replace(' scale(0.95)', '');
                }, 100);

                // Trigger the petal's animation and sound
                if (petal.type === 'center') {
                    // Center circle: trigger multi-percussion + bee choir
                    const percussionIndex = Math.floor(Math.random() * PERCUSSION_CONFIG.patterns.length);
                    const percussionType = PERCUSSION_CONFIG.patterns[percussionIndex];
                    createMultiplePercussionBeats(percussionType);
                    createBeeChoir(8);

                    // Animate center circle
                    const startTime = Date.now();
                    const animateCenter = () => {
                        const elapsed = Date.now() - startTime;
                        if (elapsed < HEARTBEAT_CONFIG.pulseDuration) {
                            const progress = elapsed / HEARTBEAT_CONFIG.pulseDuration;
                            petal.animateCenter(progress);
                            requestAnimationFrame(animateCenter);
                        } else {
                            petal.reset(); // Return to normal
                        }
                    };
                    animateCenter();

                    console.log(`🥁🎯 Center circle: ${percussionType} percussion + bee choir!`);
                } else {
                    // Outer petal: trigger musical note + bee choir
                    const noteName = NOTE_SEQUENCE[index];
                    const frequency = MUSICAL_NOTES[noteName];

                    playNote(frequency, 300); // Longer note for satisfying sound
                    createBeeChoir(index);

                    // Animate the petal
                    const startTime = Date.now();
                    const animatePetal = () => {
                        const elapsed = Date.now() - startTime;
                        if (elapsed < HEARTBEAT_CONFIG.pulseDuration) {
                            const progress = elapsed / HEARTBEAT_CONFIG.pulseDuration;
                            petal.animateOuter(progress);
                            requestAnimationFrame(animatePetal);
                        } else {
                            petal.reset(); // Return to normal
                        }
                    };
                    animatePetal();

                    console.log(`🎵🎯 Petal ${index}: ${noteName} note + bee choir buzz!`);
                }
            });

            // Touch support for mobile devices
            petal.element.addEventListener('touchstart', (event) => {
                event.preventDefault(); // Prevent scroll
                petal.element.click(); // Trigger click handler
            });

            console.log(`✅ Interactive setup complete for ${petal.type === 'center' ? 'Center Circle' : `Petal ${index}`}`);
        } else {
            console.warn(`⚠️ Element not found for ${petal.type === 'center' ? 'Center Circle' : `Petal ${index}`}`);
        }
    });

    console.log('🎮✨ All elements are now interactive! Kids can click any petal or the center!');
    console.log('🎵 Each click triggers immediate animation + sound + bee choir harmony');
    console.log('🥁 Center circle plays random percussion with possible multiple beats');

    // Add global keydown listener for musical typing and nudging
    document.addEventListener('keydown', (event) => {
    if (!isAudioInitialized) return;

    // Special "N" key for nudging/blowing on the pinwheel! 🌪️💨
    if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        boostPinwheelSpin();
        console.log('💨 Kid nudged the pinwheel with "N" key! Whoosh! 🌪️');

        // Visual feedback - make the whole pinwheel glow briefly
        const pinwheelContainer = document.querySelector('[style*="position: relative; width: 200px; height: 200px"]');
        if (pinwheelContainer) {
            const originalFilter = pinwheelContainer.style.filter;
            pinwheelContainer.style.filter = 'brightness(1.3) drop-shadow(0 0 20px rgba(255,255,255,0.8))';
            setTimeout(() => {
                pinwheelContainer.style.filter = originalFilter;
            }, 300);
        }

        // Show encouraging nudge message
        const nudgeMessages = [
            "Whoosh! Great nudge! 💨", "Wind power! 🌪️", "Perfect blow! 💨✨",
            "Spinning faster! 🌀", "Like real wind! 💨🌸", "Super spin! 🌪️⭐"
        ];
        const randomNudgeMessage = nudgeMessages[Math.floor(Math.random() * nudgeMessages.length)];
        showKidEncouragement(randomNudgeMessage);
        return;
    }

    // Musical controls only work when music is on
    if (!isMusicOn) return;

    // Map ASDF to petals 0-3 and JKL; to petals 4-7
    const keyToPetal = {
        'a': 0, 's': 1, 'd': 2, 'f': 3,
        'j': 4, 'k': 5, 'l': 6, ';': 7,
        '1': 0, '2': 1, '3': 2, '4': 3,
        '5': 4, '6': 5, '7': 6, '8': 7,
        ' ': 8 // Spacebar for center
    };

    const petalIndex = keyToPetal[event.key.toLowerCase()];
    if (petalIndex !== undefined) {
        event.preventDefault(); // Prevent default action (e.g., scrolling)

        // Boost pinwheel spin on any musical interaction too!
        boostPinwheelSpin();

        const petal = petals[petalIndex];
        if (petal) {
            // Trigger click handler for the petal
            petal.element.click();
        }
    }
    });

    // Fun encouragement function for kids
    function showKidEncouragement(message) {
    const encouragement = document.createElement('div');
    encouragement.innerHTML = message;
    encouragement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4);
        color: white;
        padding: 20px 30px;
        border-radius: 25px;
        font-family: 'Comic Sans MS', cursive, sans-serif;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: celebrationPop 2s ease-out forwards;
        border: 4px solid white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    `;

    document.body.appendChild(encouragement);

    // Remove after animation
    setTimeout(() => {
        if (encouragement.parentNode) {
            encouragement.parentNode.removeChild(encouragement);
        }
    }, 2000);
}

// Add celebration animation CSS
const celebrationStyle = document.createElement('style');
celebrationStyle.textContent = `
    @keyframes celebrationPop {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(-180deg);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(celebrationStyle);

// Create tabbed side panel instructions
createTabbedInstructions();

// Create music toggle switch
createMusicToggleSwitch();

// 🎮 TABBED SIDE PANEL INSTRUCTIONS 🎮
function createTabbedInstructions() {
    // Create the side panel container
    const sidePanel = document.createElement('div');
    sidePanel.id = 'instructionsPanel';
    sidePanel.innerHTML = `
        <div class="panel-header">
            <h3>🌸 Aniota Field Guide 🌸</h3>
            <button id="panelToggle" class="toggle-btn">📖</button>
        </div>

        <div class="panel-tabs">
            <button class="tab-btn active" data-tab="controls">🎮 Controls</button>
            <button class="tab-btn" data-tab="music">� Music</button>
            <button class="tab-btn" data-tab="bees">🐝 Bees</button>
            <button class="tab-btn" data-tab="tips">✨ Tips</button>
        </div>

        <div class="panel-content">
            <div class="tab-content active" id="controls">
                <h4>🎮 How to Play</h4>
                <div class="control-group">
                    <p><strong>🖱️ CLICK</strong> any petal or center!</p>
                    <p><strong>⌨️ TYPE</strong> ASDF or JKL; keys</p>
                    <p><strong>🔢 PRESS</strong> number keys 1-8</p>
                    <p><strong>⭕ SPACEBAR</strong> for center circle</p>
                    <p><strong>💨 PRESS "N"</strong> to nudge & spin!</p>
                </div>
            </div>

            <div class="tab-content" id="music">
                <h4>🎵 Musical Magic</h4>
                <div class="control-group">
                    <p>🎼 Each petal plays a note</p>
                    <p>🥁 Center plays percussion</p>
                    <p>🎵 Toggle music ON/OFF</p>
                    <p>🎈 Surprise when music is off!</p>
                </div>
            </div>

            <div class="tab-content" id="bees">
                <h4>🐝 The Bee Choir</h4>
                <div class="control-group">
                    <p>🐝 5 bees with personalities</p>
                    <p>🎶 They harmonize with petals</p>
                    <p>🌸 Bass, Alto, Tenor & more</p>
                    <p>💫 Natural bee-like sounds</p>
                </div>
            </div>

            <div class="tab-content" id="tips">
                <h4>✨ Fun Tips</h4>
                <div class="control-group">
                    <p>🌪️ Nudge to make wind!</p>
                    <p>🎨 Watch the colors pulse</p>
                    <p>🎵 Try different rhythms</p>
                    <p>🌟 Each click is magical!</p>
                </div>
            </div>
        </div>
    `;

    // Apply styles directly to avoid CSS dependency
    sidePanel.style.cssText = `
        position: fixed;
        right: -280px;
        top: 20px;
        width: 280px;
        height: calc(100vh - 40px);
        background: rgba(26, 26, 46, 0.95);
        backdrop-filter: blur(15px);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 15px 0 0 15px;
        box-shadow: -5px 0 20px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        font-family: 'Comic Sans MS', cursive, sans-serif;
        color: white;
        transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    `;

    document.body.appendChild(sidePanel);

    // Create a visible tab button that stays visible even when panel is closed
    const visibleTab = document.createElement('div');
    visibleTab.innerHTML = `📖`;
    visibleTab.style.cssText = `
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 50px;
        height: 80px;
        background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        z-index: 1999;
        border-radius: 10px 0 0 10px;
        box-shadow: -3px 0 10px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        font-family: 'Comic Sans MS', cursive, sans-serif;
        user-select: none;
    `;

    visibleTab.addEventListener('click', () => {
        isOpen = !isOpen;
        sidePanel.classList.toggle('open', isOpen);
        panelToggle.textContent = isOpen ? '✖️' : '📖';
        visibleTab.style.transform = `translateY(-50%) ${isOpen ? 'translateX(-280px)' : 'translateX(0)'}`;

        if (isOpen) {
            showKidEncouragement("Check out the guide! 📖✨");
        }
    });

    document.body.appendChild(visibleTab);

    // Add panel styles
    const panelStyles = document.createElement('style');
    panelStyles.textContent = `
        #instructionsPanel.open {
            right: 0 !important;
        }

        .panel-header {
            padding: 15px 20px;
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 15px 0 0 0;
        }

        .panel-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
        }

        .toggle-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .toggle-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .panel-tabs {
            display: flex;
            background: rgba(0, 0, 0, 0.2);
            padding: 0;
        }

        .tab-btn {
            flex: 1;
            padding: 12px 8px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
        }

        .tab-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }

        .tab-btn.active {
            background: rgba(255, 255, 255, 0.15);
            color: white;
            border-bottom-color: #FFD700;
        }

        .panel-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }

        .tab-content {
            display: none;
            animation: fadeIn 0.3s ease;
        }

        .tab-content.active {
            display: block;
        }

        .tab-content h4 {
            margin: 0 0 15px 0;
            color: #FFD700;
            font-size: 16px;
        }

        .control-group p {
            margin: 8px 0;
            font-size: 14px;
            line-height: 1.4;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            border-left: 4px solid #4ECDC4;
        }

        .control-group p strong {
            color: #FFD700;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
            #instructionsPanel {
                width: 280px;
                right: -300px;
            }

            .control-group p {
                font-size: 13px;
                padding: 6px 10px;
            }

            .tab-btn {
                font-size: 11px;
                padding: 10px 6px;
            }
        }
    `;
    document.head.appendChild(panelStyles);

    // Panel functionality
    const panelToggle = document.getElementById('panelToggle');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    let isOpen = false;

    // Toggle panel open/close
    panelToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        sidePanel.classList.toggle('open', isOpen);
        panelToggle.textContent = isOpen ? '✖️' : '📖';
        visibleTab.style.transform = `translateY(-50%) ${isOpen ? 'translateX(-280px)' : 'translateX(0)'}`;

        if (isOpen) {
            showKidEncouragement("Check out the guide! 📖✨");
        }
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });

            // Fun feedback for tab switching
            const tabMessages = {
                controls: "Time to learn the controls! 🎮",
                music: "Musical magic awaits! 🎵",
                bees: "Meet the bee choir! 🐝",
                tips: "Pro tips coming up! ✨"
            };

            if (tabMessages[targetTab]) {
                showKidEncouragement(tabMessages[targetTab]);
            }
        });
    });

    // Auto-open panel briefly to show it exists
    setTimeout(() => {
        sidePanel.classList.add('open');
        isOpen = true;
        panelToggle.textContent = '✖️';
        visibleTab.style.transform = 'translateY(-50%) translateX(-280px)';
        showKidEncouragement("Welcome! Check the guide → 📖");

        // Auto-close after 3 seconds
        setTimeout(() => {
            sidePanel.classList.remove('open');
            isOpen = false;
            panelToggle.textContent = '📖';
            visibleTab.style.transform = 'translateY(-50%) translateX(0)';
        }, 3000);
    }, 1000);

    console.log('📖 Tabbed instruction panel created! Click the book icon to open.');
}

// 🎵 CREATE MUSIC TOGGLE SWITCH 🎵
function createMusicToggleSwitch() {
    // Create toggle container
    const toggleContainer = document.createElement('div');
    toggleContainer.innerHTML = `
        <div id="musicToggle" style="
            position: fixed;
            bottom: 20px;
            left: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.95);
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            font-weight: bold;
            font-size: 16px;
            user-select: none;
        ">
            <div id="toggleSwitch" style="
                width: 60px;
                height: 30px;
                background: linear-gradient(45deg, #4CAF50, #8BC34A);
                border-radius: 15px;
                position: relative;
                transition: all 0.3s ease;
            ">
                <div id="toggleSlider" style="
                    width: 26px;
                    height: 26px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 2px;
                    left: 32px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                "></div>
            </div>
            <span id="toggleText" style="color: #2E7D32;">🎵 Music ON</span>
        </div>
    `;

    document.body.appendChild(toggleContainer);

    // Toggle functionality
    const toggle = document.getElementById('musicToggle');
    const toggleSwitch = document.getElementById('toggleSwitch');
    const toggleSlider = document.getElementById('toggleSlider');
    const toggleText = document.getElementById('toggleText');

    toggle.addEventListener('click', () => {
        isMusicOn = !isMusicOn;

        if (isMusicOn) {
            // Turn music ON
            toggleSwitch.style.background = 'linear-gradient(45deg, #4CAF50, #8BC34A)';
            toggleSlider.style.left = '32px';
            toggleText.textContent = '🎵 Music ON';
            toggleText.style.color = '#2E7D32';
            console.log('🎵 Music turned ON! Ready to play!');
            showKidEncouragement("Music is back! 🎵✨");
        } else {
            // Turn music OFF (and play surprise!)
            toggleSwitch.style.background = 'linear-gradient(45deg, #FF5722, #F44336)';
            toggleSlider.style.left = '2px';
            toggleText.textContent = '🔇 Music OFF';
            toggleText.style.color = '#D32F2F';
            console.log('🔇 Music turned OFF! Quiet mode activated.');

            // SURPRISE! Play child laughter
            setTimeout(() => {
                playSurpriseAudio();
            }, 300);
        }

        // Visual feedback
        toggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            toggle.style.transform = 'scale(1)';
        }, 100);
    });

    console.log('🎵 Music toggle switch created! Click to turn music on/off.');
    console.log('🎈 Secret: Turning music off triggers a surprise! 😄');
}

}); // End of DOMContentLoaded event listener

// 🐝 VISUAL BEE ANIMATION SYSTEM 🐝
// Animated bees that fly around the pinwheel and sync with the bee choir

const BEE_VISUAL_CONFIG = {
    beeCount: 5, // Match the 5-bee audio choir
    beeAssets: ['top_bee.png', 'side_bee.png'],
    flightRadius: 150, // How far from center they fly
    minRadius: 80,     // Closest they get to center
    baseSpeed: 0.02,   // Base flight speed
    speedVariation: 0.01, // Random speed variation
    buzzAmplitude: 8,  // How much they "buzz" up and down
    buzzFrequency: 0.1, // Buzz frequency
    size: 60,          // Bee image size
    fadeInDuration: 1000, // How long to fade in when appearing
    fadeOutDuration: 500  // How long to fade out when disappearing
};

let visualBees = [];
let beeContainer = null;

// Bee class for visual bee entities
class VisualBee {
    constructor(id, personality) {
        this.id = id;
        this.personality = personality; // From BEE_CHOIR_CONFIG
        this.angle = (Math.PI * 2 / BEE_VISUAL_CONFIG.beeCount) * id; // Start evenly spaced
        this.radius = BEE_VISUAL_CONFIG.minRadius + Math.random() * (BEE_VISUAL_CONFIG.flightRadius - BEE_VISUAL_CONFIG.minRadius);
        this.speed = BEE_VISUAL_CONFIG.baseSpeed + (Math.random() - 0.5) * BEE_VISUAL_CONFIG.speedVariation;
        this.buzzPhase = Math.random() * Math.PI * 2;
        this.element = null;
        this.isActive = false;
        this.opacity = 0;
        this.targetOpacity = 0;

        // Use different bee images for variety
        this.imageIndex = Math.floor(Math.random() * BEE_VISUAL_CONFIG.beeAssets.length);

        this.createBeeElement();
    }

    createBeeElement() {
        this.element = document.createElement('img');
        this.element.src = BEE_VISUAL_CONFIG.beeAssets[this.imageIndex];
        this.element.className = `visual-bee bee-${this.id}`;
        this.element.style.cssText = `
            position: absolute;
            width: ${BEE_VISUAL_CONFIG.size}px;
            height: ${BEE_VISUAL_CONFIG.size}px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 500;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
        `;

        // Bee-specific visual characteristics based on personality
        if (this.personality.role === 'bass') {
            this.element.style.filter += ' hue-rotate(30deg) brightness(0.9)'; // Slightly warmer/darker
        } else if (this.personality.role === 'soprano') {
            this.element.style.filter += ' hue-rotate(-30deg) brightness(1.1)'; // Cooler/brighter
        }

        if (beeContainer) {
            beeContainer.appendChild(this.element);
        }
    }

    update(deltaTime) {
        if (!this.element || !beeContainer) return;

        // Update flight path (circular motion with variation)
        this.angle += this.speed * this.personality.tempo;

        // Add radius variation for more natural flight
        const radiusVariation = Math.sin(this.angle * 3) * 20;
        const currentRadius = this.radius + radiusVariation;

        // Calculate position relative to pinwheel center
        const centerX = beeContainer.offsetWidth / 2;
        const centerY = beeContainer.offsetHeight / 2;

        // Add buzzing motion (vertical oscillation)
        this.buzzPhase += BEE_VISUAL_CONFIG.buzzFrequency * this.personality.tempo;
        const buzzOffset = Math.sin(this.buzzPhase) * BEE_VISUAL_CONFIG.buzzAmplitude;

        const x = centerX + Math.cos(this.angle) * currentRadius;
        const y = centerY + Math.sin(this.angle) * currentRadius + buzzOffset;

        // Apply position
        this.element.style.left = `${x - BEE_VISUAL_CONFIG.size / 2}px`;
        this.element.style.top = `${y - BEE_VISUAL_CONFIG.size / 2}px`;

        // Update opacity based on activity
        if (this.isActive && this.targetOpacity > this.opacity) {
            this.opacity = Math.min(this.opacity + deltaTime / BEE_VISUAL_CONFIG.fadeInDuration, this.targetOpacity);
        } else if (!this.isActive && this.opacity > 0) {
            this.opacity = Math.max(this.opacity - deltaTime / BEE_VISUAL_CONFIG.fadeOutDuration, 0);
        }

        this.element.style.opacity = this.opacity;

        // Rotate bee based on flight direction for more realism
        const rotation = (this.angle * 180 / Math.PI) + 90; // +90 to align with flight direction
        this.element.style.transform = `rotate(${rotation}deg)`;
    }

    activate() {
        this.isActive = true;
        this.targetOpacity = 0.8;
        console.log(`🐝 ${this.personality.name} is now buzzing visibly!`);
    }

    deactivate() {
        this.isActive = false;
        this.targetOpacity = 0;
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Initialize the visual bee system
function createBeeVisualSystem() {
    // Create container for bees
    beeContainer = document.createElement('div');
    beeContainer.id = 'beeContainer';
    beeContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 40;
    `;

    // Find the graphics area and add bee container
    const graphicsArea = document.querySelector('.graphics-area');
    if (graphicsArea) {
        graphicsArea.appendChild(beeContainer);
    } else {
        document.body.appendChild(beeContainer);
    }

    // Create visual bees to match the audio choir
    visualBees = [];
    BEE_CHOIR_CONFIG.bees.forEach((beePersonality, index) => {
        const visualBee = new VisualBee(index, beePersonality);
        visualBees.push(visualBee);
    });

    console.log('🐝 Visual bee system created with 5 flying bees!');
    console.log('🌸 Bees will appear when the audio choir activates');
}

// Update all visual bees
function updateBeeVisuals() {
    if (!beeContainer || visualBees.length === 0) return;

    const currentTime = Date.now();
    const deltaTime = currentTime - (updateBeeVisuals.lastTime || currentTime);
    updateBeeVisuals.lastTime = currentTime;

    // Update each visual bee
    visualBees.forEach((bee, index) => {
        // Sync with audio bee states
        if (beeStates[index] && beeStates[index].isActive) {
            bee.activate();
        } else {
            // Keep bees slightly visible even when not actively buzzing
            bee.targetOpacity = 0.3;
        }

        bee.update(deltaTime);
    });
}

// Sync visual bees with audio when a petal is played
function syncBeesWithAudio(petalId) {
    // Activate visual bees when audio choir is triggered
    if (visualBees.length > 0) {
        // Activate a few random bees for visual variety
        const activeCount = Math.min(3, visualBees.length);
        const activeBees = [];

        for (let i = 0; i < activeCount; i++) {
            const randomIndex = Math.floor(Math.random() * visualBees.length);
            if (!activeBees.includes(randomIndex)) {
                activeBees.push(randomIndex);
                visualBees[randomIndex].activate();

                // Deactivate after a delay
                setTimeout(() => {
                    visualBees[randomIndex].deactivate();
                }, 1000 + Math.random() * 2000); // 1-3 seconds
            }
        }

        console.log(`🐝 Petal ${petalId} activated visual bees: ${activeBees.join(', ')}`);
    }
}

// Initialize learning session when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Start the learning session
    initializeLearningSession();
    
    // Record page entry learning moment
    recordLearningMoment('page_entered', {
        url: window.location.href,
        referrer: document.referrer,
        timestamp: Date.now()
    });
});

// Record when user leaves the page
window.addEventListener('beforeunload', () => {
    recordLearningMoment('page_exit', {
        totalTimeSpent: Date.now() - LEARNING_TRACKER.startTime,
        totalInteractions: LEARNING_TRACKER.totalInteractions,
        explorationScore: LEARNING_TRACKER.explorationScore,
        creativityScore: LEARNING_TRACKER.creativityScore,
        uniquePetalsExplored: LEARNING_TRACKER.uniquePetalsClicked.size
    });
});
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------


class MicrovibrationAnalyzer {
    constructor() {
        this.trackingData = [];
        this.baselineEstablished = false;
        this.userSignature = null;
        this.samplingRate = 1000 / 60; // 60fps sampling
        this.minDataPoints = 1000; // Minimum points for analysis
        this.analysisWindow = 5000; // 5 second sliding window
    }

    // Capture mouse movement during natural gameplay
    captureMovement(x, y, timestamp, eventType = 'move') {
        const dataPoint = {
            x: x,
            y: y,
            timestamp: timestamp,
            eventType: eventType,
            deltaTime: this.trackingData.length > 0 ? 
                timestamp - this.trackingData[this.trackingData.length - 1].timestamp : 0
        };

        // Calculate velocity and acceleration if we have previous points
        if (this.trackingData.length > 0) {
            const prev = this.trackingData[this.trackingData.length - 1];
            const deltaX = x - prev.x;
            const deltaY = y - prev.y;
            const deltaT = dataPoint.deltaTime || 16.67; // Default to 60fps

            dataPoint.velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaT;
            dataPoint.direction = Math.atan2(deltaY, deltaX);
        }

        if (this.trackingData.length > 1) {
            const prev = this.trackingData[this.trackingData.length - 1];
            dataPoint.acceleration = (dataPoint.velocity - prev.velocity) / (dataPoint.deltaTime || 16.67);
        }

        this.trackingData.push(dataPoint);

        // Keep only recent data (sliding window)
        const cutoffTime = timestamp - this.analysisWindow;
        this.trackingData = this.trackingData.filter(point => point.timestamp >= cutoffTime);

        // Perform analysis if we have enough data
        if (this.trackingData.length >= this.minDataPoints) {
            this.performMicrovibrationAnalysis();
        }
    }

    // Core mathematical analysis of movement patterns
    performMicrovibrationAnalysis() {
        const data = this.trackingData;
        if (data.length < this.minDataPoints) return;

        // Calculate mathematical signatures
        const signatures = {
            velocityPattern: this.analyzeVelocityCorrelation(data),
            accelerationPattern: this.analyzeAccelerationCorrelation(data),
            directionPattern: this.analyzeDirectionCorrelation(data),
            tremorFrequency: this.analyzeTremorFrequency(data),
            correctionBehavior: this.analyzeCorrectionBehavior(data)
        };

        // Create composite mathematical signature (0-1 scale)
        const compositeSignature = this.createCompositeSignature(signatures);

        if (!this.baselineEstablished) {
            this.userSignature = compositeSignature;
            this.baselineEstablished = true;
            console.log('Microvibration baseline established:', compositeSignature);
        } else {
            // Compare current pattern to established signature
            const correlationMatch = this.compareSignatures(this.userSignature, compositeSignature);
            console.log('Signature correlation:', correlationMatch);
            
            // Trigger authentication event if correlation is strong enough
            if (correlationMatch > 0.75) {
                this.triggerAuthenticationSuccess(correlationMatch);
            }
        }
    }

    // Analyze velocity correlation patterns
    analyzeVelocityCorrelation(data) {
        const velocities = data.filter(d => d.velocity !== undefined).map(d => d.velocity);
        if (velocities.length < 50) return 0;

        // Calculate autocorrelation of velocity patterns
        return this.calculateAutocorrelation(velocities);
    }

    // Analyze acceleration correlation patterns
    analyzeAccelerationCorrelation(data) {
        const accelerations = data.filter(d => d.acceleration !== undefined).map(d => d.acceleration);
        if (accelerations.length < 50) return 0;

        return this.calculateAutocorrelation(accelerations);
    }

    // Analyze direction change correlation patterns
    analyzeDirectionCorrelation(data) {
        const directions = data.filter(d => d.direction !== undefined).map(d => d.direction);
        if (directions.length < 50) return 0;

        // Calculate direction change patterns
        const directionChanges = [];
        for (let i = 1; i < directions.length; i++) {
            let change = directions[i] - directions[i-1];
            // Normalize angle difference to -π to π
            while (change > Math.PI) change -= 2 * Math.PI;
            while (change < -Math.PI) change += 2 * Math.PI;
            directionChanges.push(change);
        }

        return this.calculateAutocorrelation(directionChanges);
    }

    // Analyze tremor frequency patterns
    analyzeTremorFrequency(data) {
        if (data.length < 100) return 0;

        // Extract high-frequency components (tremor)
        const positions = data.map(d => ({ x: d.x, y: d.y }));
        const tremorComponents = this.extractTremorComponents(positions);
        
        return this.calculateAutocorrelation(tremorComponents);
    }

    // Analyze correction behavior patterns
    analyzeCorrectionBehavior(data) {
        if (data.length < 100) return 0;

        // Look for sudden direction changes (corrections)
        const corrections = [];
        for (let i = 2; i < data.length; i++) {
            const prev2 = data[i-2];
            const prev1 = data[i-1];
            const curr = data[i];

            if (prev2.direction !== undefined && prev1.direction !== undefined && curr.direction !== undefined) {
                const change1 = Math.abs(prev1.direction - prev2.direction);
                const change2 = Math.abs(curr.direction - prev1.direction);
                
                // Detect sharp corrections
                if (change1 > Math.PI/4 && change2 > Math.PI/4) {
                    corrections.push(change1 + change2);
                }
            }
        }

        if (corrections.length < 10) return 0;
        return this.calculateAutocorrelation(corrections);
    }

    // Extract tremor components from position data
    extractTremorComponents(positions) {
        const tremor = [];
        for (let i = 1; i < positions.length; i++) {
            const dx = positions[i].x - positions[i-1].x;
            const dy = positions[i].y - positions[i-1].y;
            const magnitude = Math.sqrt(dx*dx + dy*dy);
            tremor.push(magnitude);
        }
        return tremor;
    }

    // Calculate autocorrelation coefficient
    calculateAutocorrelation(series) {
        if (series.length < 10) return 0;

        const mean = series.reduce((sum, val) => sum + val, 0) / series.length;
        const variance = series.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / series.length;
        
        if (variance === 0) return 0;

        let correlation = 0;
        const lag = Math.min(10, Math.floor(series.length / 4));
        
        for (let i = 0; i < series.length - lag; i++) {
            correlation += (series[i] - mean) * (series[i + lag] - mean);
        }
        
        correlation = correlation / ((series.length - lag) * variance);
        return Math.abs(correlation); // Return absolute value (0-1 scale)
    }

    // Create composite signature from individual patterns
    createCompositeSignature(signatures) {
        const weights = {
            velocityPattern: 0.25,
            accelerationPattern: 0.25,
            directionPattern: 0.20,
            tremorFrequency: 0.15,
            correctionBehavior: 0.15
        };

        let composite = 0;
        for (const [pattern, value] of Object.entries(signatures)) {
            composite += (value * weights[pattern]);
        }

        return Math.max(0, Math.min(1, composite)); // Clamp to 0-1
    }

    // Compare two signatures for correlation
    compareSignatures(signature1, signature2) {
        if (!signature1 || !signature2) return 0;

        // Simple correlation - could be enhanced with more sophisticated comparison
        const difference = Math.abs(signature1 - signature2);
        return Math.max(0, 1 - difference);
    }

    // Trigger authentication success event
    triggerAuthenticationSuccess(correlation) {
        const event = new CustomEvent('microvibrationAuth', {
            detail: {
                authenticated: true,
                confidence: correlation,
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);
    }

    // Get current signature strength
    getSignatureStrength() {
        return this.baselineEstablished ? 
            (this.trackingData.length >= this.minDataPoints ? 1 : this.trackingData.length / this.minDataPoints) : 0;
    }

    // Reset analysis (for new user)
    reset() {
        this.trackingData = [];
        this.baselineEstablished = false;
        this.userSignature = null;
    }
}

const microvibrationAnalyzer = new MicrovibrationAnalyzer();

function attachMicrovibrationTracking() {
    let isTracking = false;

    document.addEventListener('mousedown', (e) => {
        isTracking = true;
        microvibrationAnalyzer.captureMovement(e.clientX, e.clientY, Date.now(), 'down');
    });

    document.addEventListener('mousemove', (e) => {
        if (isTracking) {
            microvibrationAnalyzer.captureMovement(e.clientX, e.clientY, Date.now(), 'move');
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (isTracking) {
            microvibrationAnalyzer.captureMovement(e.clientX, e.clientY, Date.now(), 'up');
        }
        isTracking = false;
    });

    // High-precision tracking during drag operations
    document.addEventListener('dragstart', (e) => {
        isTracking = true;
    });

    document.addEventListener('dragend', (e) => {
        isTracking = false;
    });
}

function setupAuthenticationMonitoring() {
    window.addEventListener('microvibrationAuth', (e) => {
        console.log('Microvibration Authentication:', e.detail);
        // Here you could trigger UI updates, send to backend, etc.
    });
}

export {
    MicrovibrationAnalyzer,
    microvibrationAnalyzer,
    attachMicrovibrationTracking,
    setupAuthenticationMonitoring
};
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

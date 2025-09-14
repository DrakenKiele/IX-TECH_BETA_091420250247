
class AniotaVisualRenderer {
    constructor(parentBiome) {
        this.biome = parentBiome;
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = 0;
        
        this.visualConfig = {
            faerie: {
                // Constellation points for faerie shape
                constellation: {
                    head: { x: 0, y: -25, size: 8 },
                    leftWing: { x: -20, y: -10, size: 6 },
                    rightWing: { x: 20, y: -10, size: 6 },
                    body: { x: 0, y: 0, size: 10 },
                    leftArm: { x: -12, y: -5, size: 4 },
                    rightArm: { x: 12, y: -5, size: 4 },
                    leftLeg: { x: -8, y: 15, size: 5 },
                    rightLeg: { x: 8, y: 15, size: 5 },
                    // Wing details
                    leftWingTip: { x: -30, y: -15, size: 4 },
                    rightWingTip: { x: 30, y: -15, size: 4 },
                    leftWingMid: { x: -25, y: -5, size: 3 },
                    rightWingMid: { x: 25, y: -5, size: 3 }
                },
                breathingAmount: 0.3,
                breathingSpeed: 0.02,
                starConnections: [
                    ['head', 'body'],
                    ['body', 'leftArm'],
                    ['body', 'rightArm'],
                    ['body', 'leftLeg'],
                    ['body', 'rightLeg'],
                    ['leftWing', 'leftWingMid'],
                    ['leftWingMid', 'leftWingTip'],
                    ['rightWing', 'rightWingMid'],
                    ['rightWingMid', 'rightWingTip'],
                    ['leftWing', 'body'],
                    ['rightWing', 'body']
                ]
            },
            wormhole: {
                enabled: false,
                radius: 50,
                depth: 8,
                rotation: 0,
                pulseSpeed: 0.05,
                spiralSpeed: 0.03
            },
            rings: {
                count: 4,
                baseRadius: 40,
                spacing: 12,
                thickness: 2,
                rotationSpeeds: [0.01, 0.015, 0.02, 0.025]
            },
            colors: {
                primary: '#FFD700',
                secondary: '#B8860B',
                glow: '#FFA500',
                constellation: '#E6E6FA',
                wormhole: '#4B0082'
            }
        };
    }

    // Initialize rendering canvas
    initializeCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        console.log('🎨 Visual renderer initialized');
    }

    // Main render function
    render(frame, moodState, behaviorState) {
        if (!this.ctx || !this.canvas) return;
        
        this.animationFrame = frame;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const time = frame * 0.1;
        
        // Render wormhole portal (if active)
        if (this.visualConfig.wormhole.enabled) {
            this.renderWormhole(centerX, centerY, time, moodState);
        }
        
        // Render Saturn rings first (behind faerie)
        this.renderSaturnRings(centerX, centerY, time, moodState);
        
        // Render celestial faerie constellation
        this.renderFaerieConstellation(centerX, centerY, time, moodState, behaviorState);
        
        // Render mood indicators
        this.renderMoodIndicators(centerX, centerY, moodState);
    }

    renderSaturnRings(centerX, centerY, time, moodState) {
        if (!moodState || !moodState.colors) {
            this.renderDefaultRings(centerX, centerY, time);
            return;
        }
        
        const rings = moodState.colors.rings || this.getDefaultRings();
        
        rings.forEach((ring, index) => {
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            
            const rotationSpeed = this.visualConfig.rings.rotationSpeeds[index] || 0.02;
            const rotation = time * rotationSpeed * (ring.speed || 1);
            this.ctx.rotate(rotation);
            
            const radius = ring.radius || (this.visualConfig.rings.baseRadius + (index * this.visualConfig.rings.spacing));
            const alpha = ring.alpha || 0.6;
            
            this.ctx.globalAlpha = alpha;
            
            // Create ring gradient
            const gradient = this.ctx.createLinearGradient(-radius, 0, radius, 0);
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.3, ring.color);
            gradient.addColorStop(0.7, ring.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = this.visualConfig.rings.thickness;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, radius, radius * 0.3, 0, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }

    renderDefaultRings(centerX, centerY, time) {
        const defaultRings = this.getDefaultRings();
        
        defaultRings.forEach((ring, index) => {
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            
            const rotationSpeed = this.visualConfig.rings.rotationSpeeds[index];
            this.ctx.rotate(time * rotationSpeed);
            
            this.ctx.globalAlpha = ring.alpha;
            
            const gradient = this.ctx.createLinearGradient(-ring.radius, 0, ring.radius, 0);
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.3, ring.color);
            gradient.addColorStop(0.7, ring.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = ring.thickness;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, ring.radius, ring.radius * 0.3, 0, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }

    renderFaerieConstellation(centerX, centerY, time, moodState, behaviorState) {
        // Breathing/pulsing animation for the entire constellation
        const breathe = Math.sin(time * this.visualConfig.faerie.breathingSpeed) * this.visualConfig.faerie.breathingAmount;
        const scale = 1 + breathe;
        
        // Get current mood colors
        const primaryColor = moodState?.colors?.primary || this.visualConfig.colors.primary;
        const glowColor = moodState?.colors?.secondary || this.visualConfig.colors.glow;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.scale(scale, scale);
        
        // First, draw constellation lines (connecting stars)
        this.renderConstellationLines(primaryColor);
        
        // Then, render the multi-sun stars at each point
        this.renderConstellationStars(time, primaryColor, glowColor);
        
        this.ctx.restore();
    }

    renderConstellationLines(color) {
        this.ctx.strokeStyle = color + '60'; // Semi-transparent
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 3]); // Dotted constellation lines
        
        this.visualConfig.faerie.starConnections.forEach(([from, to]) => {
            const fromStar = this.visualConfig.faerie.constellation[from];
            const toStar = this.visualConfig.faerie.constellation[to];
            
            if (fromStar && toStar) {
                this.ctx.beginPath();
                this.ctx.moveTo(fromStar.x, fromStar.y);
                this.ctx.lineTo(toStar.x, toStar.y);
                this.ctx.stroke();
            }
        });
        
        this.ctx.setLineDash([]); // Reset line dash
    }

    renderConstellationStars(time, primaryColor, glowColor) {
        Object.entries(this.visualConfig.faerie.constellation).forEach(([name, star], index) => {
            // Each star pulses at slightly different rates
            const pulseOffset = index * 0.5;
            const pulse = Math.sin(time * 0.03 + pulseOffset) * 0.3 + 0.7;
            const starSize = star.size * pulse;
            
            // Create multi-layered sun effect
            this.renderMultiSun(star.x, star.y, starSize, primaryColor, glowColor, time + pulseOffset);
        });
    }

    renderMultiSun(x, y, size, primaryColor, glowColor, time) {
        // Outer glow
        this.ctx.save();
        this.ctx.shadowColor = glowColor;
        this.ctx.shadowBlur = size * 2;
        
        // Core bright star
        const coreGradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
        coreGradient.addColorStop(0, '#FFFFFF');
        coreGradient.addColorStop(0.3, primaryColor);
        coreGradient.addColorStop(0.7, glowColor);
        coreGradient.addColorStop(1, primaryColor + '40');
        
        this.ctx.fillStyle = coreGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add star rays
        this.renderStarRays(x, y, size, primaryColor, time);
        
        this.ctx.restore();
    }

    renderStarRays(x, y, size, color, time) {
        const rayCount = 6;
        const rayLength = size * 2.5;
        const rotation = time * 0.01;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        this.ctx.strokeStyle = color + '80';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2;
            const rayX = Math.cos(angle) * rayLength;
            const rayY = Math.sin(angle) * rayLength;
            
            // Create gradient for ray
            const rayGradient = this.ctx.createLinearGradient(0, 0, rayX, rayY);
            rayGradient.addColorStop(0, color);
            rayGradient.addColorStop(1, 'transparent');
            
            this.ctx.strokeStyle = rayGradient;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(rayX, rayY);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    // Wormhole portal animation for entrances/exits
    renderWormhole(centerX, centerY, time, moodState) {
        const wormhole = this.visualConfig.wormhole;
        const pulse = Math.sin(time * wormhole.pulseSpeed) * 0.2 + 0.8;
        const spiralRotation = time * wormhole.spiralSpeed;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        
        // Create multiple spiral layers
        for (let layer = 0; layer < wormhole.depth; layer++) {
            const layerRadius = (wormhole.radius * pulse) * (1 - layer / wormhole.depth);
            const layerAlpha = (1 - layer / wormhole.depth) * 0.6;
            
            this.ctx.save();
            this.ctx.rotate(spiralRotation + layer * 0.3);
            this.ctx.globalAlpha = layerAlpha;
            
            // Create spiral gradient
            const spiralGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, layerRadius);
            spiralGradient.addColorStop(0, 'transparent');
            spiralGradient.addColorStop(0.5, this.visualConfig.colors.wormhole);
            spiralGradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = spiralGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, layerRadius, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
        
        this.ctx.restore();
    }

    // Portal entrance animation
    openWormhole() {
        this.visualConfig.wormhole.enabled = true;
        console.log('🌀 Wormhole portal opening for Aniota\'s arrival');
        
        // Auto-close after entrance animation
        setTimeout(() => {
            this.visualConfig.wormhole.enabled = false;
        }, 3000);
    }

    // Portal exit animation
    closeWormhole() {
        this.visualConfig.wormhole.enabled = true;
        console.log('🌀 Wormhole portal opening for Aniota\'s departure');
        
        // Auto-close after exit animation
        setTimeout(() => {
            this.visualConfig.wormhole.enabled = false;
        }, 2000);
    }

    renderMoodIndicators(centerX, centerY, moodState) {
        if (!moodState || !moodState.dominant) return;
        
        // Celestial mood aura around the faerie constellation
        const indicator = moodState.dominant;
        const auraRadius = 60;
        const intensity = indicator.intensity || 0.5;
        
        // Create pulsing mood aura
        this.ctx.save();
        this.ctx.globalAlpha = intensity * 0.3;
        
        const auraGradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, auraRadius
        );
        auraGradient.addColorStop(0, moodState.colors?.primary + '40' || '#FFD70040');
        auraGradient.addColorStop(0.5, moodState.colors?.secondary + '20' || '#B8860B20');
        auraGradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = auraGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
        
        // Add sparkles around faerie for magical effect
        this.renderMagicalSparkles(centerX, centerY, moodState);
    }

    renderMagicalSparkles(centerX, centerY, moodState) {
        const sparkleCount = 8;
        const time = this.animationFrame * 0.1;
        
        for (let i = 0; i < sparkleCount; i++) {
            const angle = (time * 0.02 + i * (Math.PI * 2 / sparkleCount)) % (Math.PI * 2);
            const distance = 50 + Math.sin(time * 0.05 + i) * 15;
            const sparkleX = centerX + Math.cos(angle) * distance;
            const sparkleY = centerY + Math.sin(angle) * distance;
            
            const sparkleSize = 1 + Math.sin(time * 0.1 + i * 0.5) * 0.5;
            const alpha = 0.3 + Math.sin(time * 0.08 + i * 0.7) * 0.3;
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = moodState.colors?.primary || '#FFD700';
            
            // Draw small diamond sparkle
            this.ctx.translate(sparkleX, sparkleY);
            this.ctx.rotate(time * 0.03 + i);
            this.ctx.fillRect(-sparkleSize, -sparkleSize, sparkleSize * 2, sparkleSize * 2);
            
            this.ctx.restore();
        }
    }

    getDefaultRings() {
        return [
            { 
                radius: 35, 
                thickness: 3, 
                color: '#DAA520', // Goldenrod
                alpha: 0.7 
            },
            { 
                radius: 45, 
                thickness: 2, 
                color: '#CD853F', // Peru
                alpha: 0.6 
            },
            { 
                radius: 55, 
                thickness: 4, 
                color: '#FFD700', // Gold
                alpha: 0.5 
            },
            { 
                radius: 65, 
                thickness: 2, 
                color: '#FFA500', // Orange
                alpha: 0.4 
            }
        ];
    }

    // Update visual configuration
    updateConfig(newConfig) {
        this.visualConfig = { ...this.visualConfig, ...newConfig };
        console.log('🎨 Visual configuration updated');
    }

    // Get current animation frame
    getCurrentFrame() {
        return this.animationFrame;
    }

    // Reset renderer
    reset() {
        this.animationFrame = 0;
        console.log('🎨 Visual renderer reset');
    }
}

module.exports = AniotaVisualRenderer;

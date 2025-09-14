
class AniotaSpriteRenderer {
    constructor(parentBiome) {
        this.biome = parentBiome;
        this.spriteCache = new Map();
        this.currentSprite = null;
        this.spriteConfig = {
            basePath: 'assets/sprites/pixie/', // Where your sprites are stored
            angles: {
                'front': 'pixie_front.svg',
                'back': 'pixie_back.svg',
                'left': 'pixie_left.svg',
                'right': 'pixie_right.svg',
                'front_left': 'pixie_front_left.svg',
                'front_right': 'pixie_front_right.svg',
                'back_left': 'pixie_back_left.svg',
                'back_right': 'pixie_back_right.svg'
            },
            animations: {
                idle: {
                    frames: ['front'],
                    duration: 1000
                },
                walking: {
                    frames: ['front', 'front_left', 'left', 'back_left', 'back', 'back_right', 'right', 'front_right'],
                    duration: 800
                },
                sitting: {
                    frames: ['front'],
                    duration: 500
                },
                following: {
                    frames: ['front_right', 'right', 'front_right'],
                    duration: 600
                }
            }
        };
        
        this.animationState = {
            currentAnimation: 'idle',
            frameIndex: 0,
            lastFrameTime: 0,
            direction: 'front'
        };
        
        console.log('🧚 Sprite renderer initialized - ready for pixie animations');
    }

    // Load sprite files into cache
    async loadSprites() {
        const path = require('path');
        const fs = require('fs').promises;
        
        try {
            for (const [angle, filename] of Object.entries(this.spriteConfig.angles)) {
                const spritePath = path.join(__dirname, '..', this.spriteConfig.basePath, filename);
                
                try {
                    const svgContent = await fs.readFile(spritePath, 'utf8');
                    this.spriteCache.set(angle, {
                        content: svgContent,
                        loaded: true,
                        element: null // Will be created when needed
                    });
                    console.log(`🧚 Loaded sprite: ${angle}`);
                } catch (fileError) {
                    console.log(`⚠️ Sprite not found: ${filename} - using fallback`);
                    this.spriteCache.set(angle, {
                        content: this.generateFallbackSprite(angle),
                        loaded: false,
                        element: null
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error loading sprites:', error);
            this.generateAllFallbacks();
        }
    }

    // Generate fallback sprite if file doesn't exist
    generateFallbackSprite(angle) {
        // Simple SVG pixie shape as fallback
        const colors = {
            body: '#FFB6C1',
            wings: '#E6E6FA',
            hair: '#DDA0DD'
        };
        
        return `
        <svg width="60" height="80" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
            <!-- Pixie body -->
            <ellipse cx="30" cy="45" rx="8" ry="12" fill="${colors.body}"/>
            <!-- Head -->
            <circle cx="30" cy="25" r="10" fill="${colors.body}"/>
            <!-- Hair -->
            <path d="M20 20 Q30 10 40 20 Q35 15 30 15 Q25 15 20 20" fill="${colors.hair}"/>
            <!-- Wings -->
            <ellipse cx="22" cy="35" rx="6" ry="15" fill="${colors.wings}" opacity="0.7" 
                     transform="rotate(-20 22 35)"/>
            <ellipse cx="38" cy="35" rx="6" ry="15" fill="${colors.wings}" opacity="0.7" 
                     transform="rotate(20 38 35)"/>
            <!-- Direction indicator for ${angle} -->
            <text x="30" y="70" text-anchor="middle" font-size="8" fill="#666">${angle}</text>
        </svg>`;
    }

    generateAllFallbacks() {
        Object.keys(this.spriteConfig.angles).forEach(angle => {
            this.spriteCache.set(angle, {
                content: this.generateFallbackSprite(angle),
                loaded: false,
                element: null
            });
        });
    }

    // Render sprite at given position
    renderSprite(ctx, x, y, scale = 1) {
        const currentFrame = this.getCurrentFrame();
        const sprite = this.spriteCache.get(currentFrame);
        
        if (!sprite) {
            // Fall back to constellation rendering
            console.log(`⚠️ Sprite ${currentFrame} not available, using constellation fallback`);
            return false;
        }
        
        // Convert SVG to image and draw
        this.drawSVGSprite(ctx, sprite.content, x, y, scale);
        return true;
    }

    // Draw SVG sprite on canvas
    drawSVGSprite(ctx, svgContent, x, y, scale) {
        if (!svgContent) return;
        
        // Create image from SVG
        const img = new Image();
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);
            ctx.drawImage(img, -30, -40); // Center the sprite
            ctx.restore();
            URL.revokeObjectURL(url);
        };
        
        img.src = url;
    }

    // Update animation based on behavior
    updateAnimation(behaviorState, deltaTime) {
        const now = Date.now();
        
        // Determine animation based on behavior
        let targetAnimation = 'idle';
        
        if (behaviorState) {
            switch (behaviorState.action) {
                case 'sit':
                    targetAnimation = 'sitting';
                    break;
                case 'follow':
                    targetAnimation = 'following';
                    break;
                case 'wander':
                    targetAnimation = 'walking';
                    break;
                case 'come':
                    targetAnimation = 'walking';
                    break;
                default:
                    targetAnimation = 'idle';
            }
        }
        
        // Change animation if needed
        if (this.animationState.currentAnimation !== targetAnimation) {
            this.animationState.currentAnimation = targetAnimation;
            this.animationState.frameIndex = 0;
            this.animationState.lastFrameTime = now;
        }
        
        // Update frame timing
        const animation = this.spriteConfig.animations[targetAnimation];
        const frameDuration = animation.duration / animation.frames.length;
        
        if (now - this.animationState.lastFrameTime > frameDuration) {
            this.animationState.frameIndex = (this.animationState.frameIndex + 1) % animation.frames.length;
            this.animationState.lastFrameTime = now;
        }
    }

    // Get current frame sprite name
    getCurrentFrame() {
        const animation = this.spriteConfig.animations[this.animationState.currentAnimation];
        return animation.frames[this.animationState.frameIndex];
    }

    // Set sprite direction based on movement
    setDirection(direction) {
        this.animationState.direction = direction;
    }

    // Hybrid rendering: choose between sprite and constellation
    shouldUseSprites() {
        // Use sprites if they're loaded and behavior is suitable
        const currentFrame = this.getCurrentFrame();
        const sprite = this.spriteCache.get(currentFrame);
        return sprite && sprite.loaded;
    }

    // Get sprite info for debugging
    getSpriteStatus() {
        return {
            loadedSprites: Array.from(this.spriteCache.keys()).filter(
                key => this.spriteCache.get(key).loaded
            ),
            currentAnimation: this.animationState.currentAnimation,
            currentFrame: this.getCurrentFrame(),
            usingSprites: this.shouldUseSprites()
        };
    }

    // Configure sprite paths (if you want to change location)
    configurePaths(newBasePath, newAngles = null) {
        this.spriteConfig.basePath = newBasePath;
        if (newAngles) {
            this.spriteConfig.angles = { ...this.spriteConfig.angles, ...newAngles };
        }
        
        // Reload sprites with new paths
        this.spriteCache.clear();
        this.loadSprites();
    }
}

module.exports = AniotaSpriteRenderer;


class AniotaSpriteOverlay {
    constructor(parentBiome) {
        this.biome = parentBiome;
        this.isActive = false;
        this.currentSprite = null;
        this.spriteCache = new Map();
        this.overlayCanvas = null;
        this.overlayContext = null;
        
        // Sprite configuration
        this.spriteConfig = {
            baseSize: 64,          // Base sprite size
            scaleFactor: 1.0,      // Scale multiplier
            opacity: 0.8,          // Blend with constellation
            blendMode: 'overlay',  // CSS blend mode
            offsetX: 0,            // Position offset from constellation center
            offsetY: -10           // Slightly above constellation center
        };
        
        // Animation states for pixie
        this.animationStates = {
            idle: {
                sprites: ['pixie_idle_1.svg', 'pixie_idle_2.svg'],
                duration: 2000,
                loop: true
            },
            flying: {
                sprites: ['pixie_fly_1.svg', 'pixie_fly_2.svg', 'pixie_fly_3.svg'],
                duration: 600,
                loop: true
            },
            sitting: {
                sprites: ['pixie_sit.svg'],
                duration: 0,
                loop: false
            },
            excited: {
                sprites: ['pixie_excited_1.svg', 'pixie_excited_2.svg'],
                duration: 400,
                loop: true
            },
            wandering: {
                sprites: ['pixie_walk_1.svg', 'pixie_walk_2.svg', 'pixie_walk_3.svg'],
                duration: 800,
                loop: true
            }
        };
        
        this.currentAnimation = 'idle';
        this.animationFrame = 0;
        this.lastFrameTime = 0;
        
        console.log('🧚 Sprite Overlay System initialized - ready for pixie sprites');
    }

    // Initialize overlay canvas on top of constellation
    async initializeOverlay() {
        if (!this.biome.characterWindow) {
            console.log('⚠️ Character window not available for sprite overlay');
            return false;
        }

        // Inject overlay canvas into character window
        await this.biome.characterWindow.webContents.executeJavaScript(`
            // Create overlay canvas
            const overlayCanvas = document.createElement('canvas');
            overlayCanvas.id = 'pixie-overlay';
            overlayCanvas.style.position = 'absolute';
            overlayCanvas.style.top = '0';
            overlayCanvas.style.left = '0';
            overlayCanvas.style.width = '100%';
            overlayCanvas.style.height = '100%';
            overlayCanvas.style.pointerEvents = 'none';
            overlayCanvas.style.zIndex = '1000';
            overlayCanvas.style.mixBlendMode = 'overlay';
            overlayCanvas.style.opacity = '0.8';
            
            // Set canvas size to window size
            const rect = document.body.getBoundingClientRect();
            overlayCanvas.width = rect.width;
            overlayCanvas.height = rect.height;
            
            // Add to document
            document.body.appendChild(overlayCanvas);
            
            // Store reference for later use
            window.pixieOverlay = overlayCanvas;
            window.pixieContext = overlayCanvas.getContext('2d');
            
            console.log('🧚 Pixie overlay canvas created');
            true;
        `);

        this.isActive = true;
        console.log('🧚 Sprite overlay initialized successfully');
        return true;
    }

    // Preload sprite images
    async preloadSprites() {
        const spritePath = path.join(__dirname, '../sprites');
        
        // Get all sprite files from animation states
        const allSprites = new Set();
        Object.values(this.animationStates).forEach(state => {
            state.sprites.forEach(sprite => allSprites.add(sprite));
        });

        for (const spriteName of allSprites) {
            try {
                const spriteFile = path.join(spritePath, spriteName);
                if (fs.existsSync(spriteFile)) {
                    // Load as data URL for easy injection
                    const spriteData = fs.readFileSync(spriteFile);
                    const dataUrl = `data:image/svg+xml;base64,${spriteData.toString('base64')}`;
                    this.spriteCache.set(spriteName, dataUrl);
                    console.log(`🧚 Loaded sprite: ${spriteName}`);
                } else {
                    console.log(`⚠️ Sprite not found: ${spriteFile}`);
                }
            } catch (error) {
                console.log(`❌ Error loading sprite ${spriteName}:`, error.message);
            }
        }

        console.log(`🧚 Preloaded ${this.spriteCache.size} sprite files`);
    }

    // Change pixie animation state
    setAnimationState(state) {
        if (!this.animationStates[state]) {
            console.log(`⚠️ Unknown animation state: ${state}`);
            return;
        }

        if (this.currentAnimation !== state) {
            this.currentAnimation = state;
            this.animationFrame = 0;
            this.lastFrameTime = Date.now();
            console.log(`🧚 Pixie animation changed to: ${state}`);
        }
    }

    // Render current sprite frame
    async renderSprite() {
        if (!this.isActive || !this.biome.characterWindow) return;

        const now = Date.now();
        const animState = this.animationStates[this.currentAnimation];
        
        // Calculate animation frame
        if (animState.loop && animState.duration > 0) {
            const elapsed = now - this.lastFrameTime;
            const frameTime = animState.duration / animState.sprites.length;
            
            if (elapsed >= frameTime) {
                this.animationFrame = (this.animationFrame + 1) % animState.sprites.length;
                this.lastFrameTime = now;
            }
        }

        const currentSpriteName = animState.sprites[this.animationFrame];
        const spriteDataUrl = this.spriteCache.get(currentSpriteName);
        
        if (!spriteDataUrl) {
            // Use placeholder if sprite not loaded
            await this.renderPlaceholder();
            return;
        }

        // Get constellation position for overlay positioning
        const constellationPos = await this.getConstellationPosition();
        
        // Render sprite on overlay
        await this.biome.characterWindow.webContents.executeJavaScript(`
            (function() {
                if (!window.pixieContext || !window.pixieOverlay) return;
                
                const ctx = window.pixieContext;
                const canvas = window.pixieOverlay;
                
                // Clear previous frame
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Create image and draw when loaded
                const img = new Image();
                img.onload = function() {
                    const centerX = ${constellationPos.x} + ${this.spriteConfig.offsetX};
                    const centerY = ${constellationPos.y} + ${this.spriteConfig.offsetY};
                    const size = ${this.spriteConfig.baseSize} * ${this.spriteConfig.scaleFactor};
                    
                    // Save context for opacity
                    ctx.save();
                    ctx.globalAlpha = ${this.spriteConfig.opacity};
                    
                    // Draw sprite centered on constellation
                    ctx.drawImage(img, 
                        centerX - size/2, 
                        centerY - size/2, 
                        size, 
                        size
                    );
                    
                    ctx.restore();
                };
                img.src = '${spriteDataUrl}';
            })();
        `);
    }

    // Get current constellation center position
    async getConstellationPosition() {
        try {
            const position = await this.biome.characterWindow.webContents.executeJavaScript(`
                // Try to get constellation center from existing rendering
                if (window.aniotaPosition) {
                    window.aniotaPosition;
                } else {
                    // Default to window center
                    ({
                        x: window.innerWidth / 2,
                        y: window.innerHeight / 2
                    });
                }
            `);
            return position;
        } catch (error) {
            // Fallback to center of window
            const bounds = this.biome.characterWindow.getBounds();
            return {
                x: bounds.width / 2,
                y: bounds.height / 2
            };
        }
    }

    // Render placeholder when sprite is missing
    async renderPlaceholder() {
        const constellationPos = await this.getConstellationPosition();
        
        await this.biome.characterWindow.webContents.executeJavaScript(`
            (function() {
                if (!window.pixieContext) return;
                
                const ctx = window.pixieContext;
                const centerX = ${constellationPos.x};
                const centerY = ${constellationPos.y};
                
                // Draw simple placeholder fairy
                ctx.save();
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(centerX, centerY - 10, 8, 0, Math.PI * 2);
                ctx.fill();
                
                // Simple wings
                ctx.strokeStyle = '#E6E6FA';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(centerX - 6, centerY - 12, 4, 8, -0.3, 0, Math.PI * 2);
                ctx.ellipse(centerX + 6, centerY - 12, 4, 8, 0.3, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.restore();
            })();
        `);
    }

    // Sync with pet behavior
    syncWithBehavior(behaviorState) {
        if (!behaviorState) return;
        
        // Map behavior to animation states
        switch (behaviorState.currentCommand) {
            case 'sitting':
                this.setAnimationState('sitting');
                break;
            case 'following':
            case 'wandering':
                this.setAnimationState('flying');
                break;
            case 'excited':
                this.setAnimationState('excited');
                break;
            default:
                this.setAnimationState('idle');
        }
    }

    // Start rendering loop
    startRenderLoop() {
        if (this.renderInterval) {
            clearInterval(this.renderInterval);
        }
        
        this.renderInterval = setInterval(() => {
            this.renderSprite();
        }, 100); // 10 FPS for sprite animation
        
        console.log('🧚 Sprite render loop started');
    }

    // Stop rendering loop
    stopRenderLoop() {
        if (this.renderInterval) {
            clearInterval(this.renderInterval);
            this.renderInterval = null;
        }
        
        console.log('🧚 Sprite render loop stopped');
    }

    // Enable/disable overlay
    async setOverlayVisibility(visible) {
        if (!this.biome.characterWindow) return;
        
        await this.biome.characterWindow.webContents.executeJavaScript(`
            if (window.pixieOverlay) {
                window.pixieOverlay.style.display = '${visible ? 'block' : 'none'}';
            }
        `);
        
        console.log(`🧚 Sprite overlay ${visible ? 'enabled' : 'disabled'}`);
    }

    // Cleanup
    async destroy() {
        this.stopRenderLoop();
        
        if (this.biome.characterWindow) {
            await this.biome.characterWindow.webContents.executeJavaScript(`
                if (window.pixieOverlay) {
                    window.pixieOverlay.remove();
                    window.pixieOverlay = null;
                    window.pixieContext = null;
                }
            `);
        }
        
        this.spriteCache.clear();
        this.isActive = false;
        console.log('🧚 Sprite overlay system destroyed');
    }
}

module.exports = AniotaSpriteOverlay;

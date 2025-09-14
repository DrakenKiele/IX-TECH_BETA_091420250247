
class AniotaPresence {
    constructor() {
        this.apiUrl = 'http://localhost:8001';
        this.ws = null;
        this.circle = null;
        this.isConnected = false;
        this.state = {
            mood_color: '#ffb300',
            position: { x: 40, y: 40 },
            context: 'unknown',
            heartbeat_rate: 800,
            // Dog-like behavior properties
            behavior_mode: 'observing',
            attention_level: 0,
            guidance_target: null,
            playfulness: 50,
            earned_points: 0
        };
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // Behavior timers and animations
        this.guidanceTimer = null;
        this.attentionTimer = null;
        this.lastUserAction = Date.now();
        
        // Mouse interception - Tinkerbelle's signature move!
        this.mouseTracker = {
            x: 0,
            y: 0,
            velocityX: 0,
            velocityY: 0,
            lastUpdate: Date.now(),
            isMoving: false
        };
        this.interceptActive = false;
        this.lastInterceptTime = 0;
        
        this.init();
    }
    
    async init() {
        console.log('Aniota Presence: Initializing...');
        
        // Find or create the mood circle element
        this.circle = document.getElementById('aniota-mood-circle');
        if (!this.circle) {
            console.warn('Aniota Presence: No mood circle element found');
            return;
        }
        
        // Setup visual appearance
        this.setupVisuals();
        
        // Setup interactions
        this.setupInteractions();
        
        // Connect to backend
        await this.connectToBackend();
        
        // Start WebSocket connection
        this.connectWebSocket();
        
        // Start dog-like behavior monitoring
        this.startBehaviorMonitoring();
        
        console.log('Aniota Presence: Initialized successfully');
    }
    
    setupVisuals() {
        // Base styling for the orb
        Object.assign(this.circle.style, {
            position: 'fixed',
            left: this.state.position.x + 'px',
            top: this.state.position.y + 'px',
            width: '72px',
            height: '72px',
            borderRadius: '0', // Remove circular border for bell shape
            backgroundImage: 'url(aniota_presence/aniota_character.svg)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundColor: this.state.mood_color,
            boxShadow: '0 4px 24px #0008',
            zIndex: 1000,
            cursor: 'grab',
            transition: 'left 0.5s cubic-bezier(.7,1.7,.5,1), top 0.5s cubic-bezier(.7,1.7,.5,1), background-color 0.8s linear'
        });
        
        this.circle.title = 'Aniota: Your learning companion';
        
        // Start heartbeat animation
        this.startHeartbeat();
    }
    
    setupInteractions() {
        // Drag functionality
        this.circle.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.offsetX = e.clientX - this.circle.offsetLeft;
            this.offsetY = e.clientY - this.circle.offsetTop;
            this.circle.style.cursor = 'grabbing';
            
            this.logInteraction('drag_start', { 
                position: { x: this.circle.offsetLeft, y: this.circle.offsetTop }
            });
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const newX = e.clientX - this.offsetX;
            const newY = e.clientY - this.offsetY;
            
            this.circle.style.left = newX + 'px';
            this.circle.style.top = newY + 'px';
            
            // Update local state
            this.state.position = { x: newX, y: newY };
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.circle.style.cursor = 'grab';
                
                // Sync position with backend and other clients
                this.syncPosition();
                
                this.logInteraction('drag_end', { 
                    position: this.state.position 
                });
            }
        });
        
        // Click interaction
        this.circle.addEventListener('click', () => {
            // Move to right center when clicked
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const newX = vw - 120;
            const newY = vh / 2 - 36;
            
            this.circle.style.left = newX + 'px';
            this.circle.style.top = newY + 'px';
            
            this.state.position = { x: newX, y: newY };
            this.syncPosition();
            
            this.logInteraction('click', { 
                action: 'center_position',
                position: this.state.position 
            });
        });
        
        // Right-click context menu for chat
        this.circle.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showChatInterface();
        });
    }
    
    // 💬 ANIOTA CHAT INTERFACE 💬
    showChatInterface() {
        // Remove existing chat if open
        const existingChat = document.getElementById('aniota-chat-interface');
        if (existingChat) {
            existingChat.remove();
            return; // Toggle off
        }
        
        // Create chat interface
        const chatInterface = document.createElement('div');
        chatInterface.id = 'aniota-chat-interface';
        chatInterface.innerHTML = `
            <div class="aniota-chat-header">
                <span class="aniota-chat-title">💝 Chat with Aniota</span>
                <button class="aniota-chat-close" onclick="document.getElementById('aniota-chat-interface').remove()">×</button>
            </div>
            <div class="aniota-chat-messages" id="aniota-chat-messages">
                <div class="aniota-message">
                    <div class="aniota-avatar">🌟</div>
                    <div class="aniota-text">Hi there! I'm Aniota, your learning companion. How can I help you today?</div>
                </div>
            </div>
            <div class="aniota-chat-input-area">
                <input type="text" class="aniota-chat-input" id="aniota-chat-input" placeholder="Type your message..." />
                <button class="aniota-chat-send" onclick="window.aniotaPresence.sendMessage()">Send</button>
            </div>
        `;
        
        // Style the chat interface
        Object.assign(chatInterface.style, {
            position: 'fixed',
            right: '20px',
            top: '20px',
            width: '350px',
            height: '450px',
            backgroundColor: '#ffffff',
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            zIndex: 1001,
            fontFamily: 'Noto Sans Rounded, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '2px solid #ffb300'
        });
        
        document.body.appendChild(chatInterface);
        
        // Add CSS styles for chat components
        this.addChatStyles();
        
        // Focus input
        setTimeout(() => {
            document.getElementById('aniota-chat-input').focus();
        }, 100);
        
        // Enter key handler
        document.getElementById('aniota-chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Record chat opening
        this.logInteraction('chat_opened', { timestamp: Date.now() });
    }
    
    addChatStyles() {
        // Check if styles already added
        if (document.getElementById('aniota-chat-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'aniota-chat-styles';
        styles.textContent = `
            .aniota-chat-header {
                background: linear-gradient(135deg, #ffb300, #ff8c00);
                color: white;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
            }
            
            .aniota-chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            
            .aniota-chat-close:hover {
                background: rgba(255,255,255,0.2);
            }
            
            .aniota-chat-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                background: #f8f9fa;
            }
            
            .aniota-message, .user-message {
                display: flex;
                margin-bottom: 15px;
                align-items: flex-start;
            }
            
            .user-message {
                flex-direction: row-reverse;
            }
            
            .aniota-avatar, .user-avatar {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                background: #ffb300;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                font-size: 18px;
            }
            
            .user-avatar {
                background: #007bff;
                margin-right: 0;
                margin-left: 10px;
            }
            
            .aniota-text, .user-text {
                background: white;
                padding: 10px 15px;
                border-radius: 15px;
                max-width: 80%;
                line-height: 1.4;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .user-text {
                background: #007bff;
                color: white;
            }
            
            .aniota-chat-input-area {
                padding: 15px;
                background: white;
                display: flex;
                gap: 10px;
                border-top: 1px solid #eee;
            }
            
            .aniota-chat-input {
                flex: 1;
                padding: 10px 15px;
                border: 2px solid #eee;
                border-radius: 25px;
                outline: none;
                font-family: inherit;
            }
            
            .aniota-chat-input:focus {
                border-color: #ffb300;
            }
            
            .aniota-chat-send {
                background: #ffb300;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.3s;
            }
            
            .aniota-chat-send:hover {
                background: #ff8c00;
            }
            
            .typing-indicator {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .typing-dots {
                display: flex;
                gap: 4px;
                margin-left: 45px;
            }
            
            .typing-dot {
                width: 8px;
                height: 8px;
                background: #ffb300;
                border-radius: 50%;
                animation: typing-bounce 1.4s infinite ease-in-out;
            }
            
            .typing-dot:nth-child(2) { animation-delay: -0.32s; }
            .typing-dot:nth-child(3) { animation-delay: -0.16s; }
            
            @keyframes typing-bounce {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    async sendMessage() {
        const input = document.getElementById('aniota-chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Clear input
        input.value = '';
        
        // Add user message to chat
        this.addMessageToChat(message, 'user');
        
        // Record user message
        this.logInteraction('chat_message_sent', { 
            message: message,
            timestamp: Date.now() 
        });
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get response from Aniota
        try {
            const response = await this.getAniotaResponse(message);
            this.hideTypingIndicator();
            this.addMessageToChat(response, 'aniota');
            
            // Update orb behavior based on conversation
            this.updateMoodFromConversation(message, response);
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessageToChat("I'm still learning how to communicate better. Could you try asking me something else?", 'aniota');
            console.error('Aniota chat error:', error);
        }
    }
    
    addMessageToChat(message, sender) {
        const messagesContainer = document.getElementById('aniota-chat-messages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'aniota-message';
        
        messageDiv.innerHTML = `
            <div class="${sender === 'user' ? 'user-avatar' : 'aniota-avatar'}">
                ${sender === 'user' ? '👤' : '🌟'}
            </div>
            <div class="${sender === 'user' ? 'user-text' : 'aniota-text'}">
                ${message}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('aniota-chat-messages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'aniota-typing';
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="aniota-avatar">🌟</div>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('aniota-typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    async getAniotaResponse(userMessage) {
        // Try to get intelligent response from backend first
        try {
            const learningMoments = JSON.parse(sessionStorage.getItem('aniota_learning_moments') || '[]');
            
            const response = await fetch(`${this.apiUrl}/api/aniota/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    learning_context: {
                        current_page: window.location.pathname,
                        time_on_page: Date.now() - LEARNING_TRACKER.startTime
                    },
                    session_data: {
                        learning_moments: learningMoments,
                        total_interactions: LEARNING_TRACKER.totalInteractions,
                        exploration_score: LEARNING_TRACKER.explorationScore
                    }
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Update orb mood if backend provided it
                if (data.mood) {
                    this.updateMood(data.mood);
                }
                
                return data.response;
            }
        } catch (error) {
            console.log('Backend chat unavailable, using local responses:', error);
        }
        
        // Fallback to local intelligent responses if backend is unavailable
        return this.getLocalAniotaResponse(userMessage);
    }
    
    getLocalAniotaResponse(userMessage) {
        // Local fallback responses (existing code)
        // Get learning context from session
        const learningMoments = JSON.parse(sessionStorage.getItem('aniota_learning_moments') || '[]');
        const recentActivity = learningMoments.slice(-5); // Last 5 learning moments
        
        // Check for keywords and context
        const message = userMessage.toLowerCase();
        
        // Learning-related responses
        if (message.includes('learn') || message.includes('study') || message.includes('understand')) {
            const responses = [
                "I love helping you learn! What subject interests you most?",
                "Learning is an adventure! I've noticed you've been exploring - that's wonderful!",
                "Every interaction we have teaches me about how you learn best. What would you like to discover together?",
                "I can see from your activities that you're curious and engaged. What's sparking your interest today?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Field/music related responses
        if (message.includes('music') || message.includes('field') || message.includes('petal') || message.includes('sound')) {
            return "I noticed you were exploring the musical field! Each petal creates different sounds. Music helps with learning - it makes patterns easier to remember. Did you discover your favorite petal?";
        }
        
        // Progress and encouragement
        if (message.includes('how') && (message.includes('doing') || message.includes('progress'))) {
            const totalMoments = learningMoments.length;
            return `You're doing wonderfully! I've recorded ${totalMoments} learning moments so far. Every interaction helps me understand how to support you better. Keep exploring!`;
        }
        
        // Questions about Aniota herself
        if (message.includes('who') || message.includes('what are you') || message.includes('about you')) {
            return "I'm Aniota, your learning companion! I adapt to how you learn best by watching your interactions and preferences. My goal is to make learning engaging and personal for you. What would you like to know about our journey together?";
        }
        
        // Help requests
        if (message.includes('help') || message.includes('stuck') || message.includes('difficult')) {
            return "I'm here to help! Tell me what you're working on or what's challenging you. I can suggest different approaches based on what I've learned about your learning style.";
        }
        
        // Greeting responses
        if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
            const greetings = [
                "Hello! I'm excited to continue our learning journey together!",
                "Hi there! I've been observing your progress - you're doing great!",
                "Hey! Ready for another learning adventure?",
                "Hello! What would you like to explore today?"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // Default intelligent response based on activity
        if (recentActivity.length > 0) {
            const lastActivity = recentActivity[recentActivity.length - 1];
            return `I see you've been ${lastActivity.type.replace('_', ' ')}. That's great engagement! What interests you most about what you're learning?`;
        }
        
        // Fallback response
        const fallbacks = [
            "That's interesting! Tell me more about what you're thinking.",
            "I'm still learning how to communicate, but I'm always here to support your learning journey.",
            "Every conversation helps me understand you better. What else would you like to explore?",
            "I'm curious about your perspective! How do you like to learn new things?"
        ];
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    updateMoodFromConversation(userMessage, aniotaResponse) {
        // Update orb color based on conversation tone
        const message = userMessage.toLowerCase();
        
        if (message.includes('great') || message.includes('good') || message.includes('love') || message.includes('like')) {
            this.updateMood('happy');
        } else if (message.includes('help') || message.includes('stuck') || message.includes('difficult')) {
            this.updateMood('supportive');
        } else if (message.includes('learn') || message.includes('understand') || message.includes('study')) {
            this.updateMood('learning');
        } else {
            this.updateMood('engaged');
        }
    }
    
    startHeartbeat() {
        setInterval(() => {
            if (this.circle) {
                this.circle.animate([
                    { boxShadow: '0 4px 24px #0008', transform: 'scale(1)' },
                    { boxShadow: `0 8px 32px ${this.state.mood_color}88`, transform: 'scale(1.08)' },
                    { boxShadow: '0 4px 24px #0008', transform: 'scale(1)' }
                ], { duration: this.state.heartbeat_rate });
            }
        }, this.state.heartbeat_rate);
    }
    
    startBehaviorMonitoring() {
        // Monitor user activity to trigger dog-like behaviors
        this.trackUserActivity();
        
        // Check for guidance opportunities every 5 seconds
        this.attentionTimer = setInterval(() => {
            this.checkForGuidanceOpportunity();
        }, 5000);
        
        // Update backend with behavior state every 10 seconds
        setInterval(() => {
            this.updateBehaviorState();
        }, 10000);
    }
    
    trackUserActivity() {
        // Track meaningful user interactions
        const activityEvents = ['click', 'scroll', 'keydown'];
        
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                this.lastUserAction = Date.now();
                this.logUserActivity(event);
            }, { passive: true });
        });
        
        // Special mouse tracking for interception behavior
        this.startMouseTracking();
    }
    
    startMouseTracking() {
        // Track mouse movement for Tinkerbelle-style interception
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            const deltaTime = now - this.mouseTracker.lastUpdate;
            
            if (deltaTime > 0) {
                // Calculate velocity
                this.mouseTracker.velocityX = (e.clientX - this.mouseTracker.x) / deltaTime;
                this.mouseTracker.velocityY = (e.clientY - this.mouseTracker.y) / deltaTime;
            }
            
            this.mouseTracker.x = e.clientX;
            this.mouseTracker.y = e.clientY;
            this.mouseTracker.lastUpdate = now;
            this.mouseTracker.isMoving = true;
            
            // Clear movement flag after a brief pause
            clearTimeout(this.mouseTracker.stopTimer);
            this.mouseTracker.stopTimer = setTimeout(() => {
                this.mouseTracker.isMoving = false;
            }, 100);
            
            // Consider mouse interception if conditions are right
            this.considerMouseInterception(e);
            
        }, { passive: true });
    }
    
    considerMouseInterception(mouseEvent) {
        // The classic Tinkerbelle move - getting right in front of you!
        const now = Date.now();
        const timeSinceLastIntercept = now - this.lastInterceptTime;
        const timeSinceUserAction = (now - this.lastUserAction) / 1000;
        
        // Conditions for interception (like Tinkerbelle deciding to help)
        const shouldIntercept = (
            !this.interceptActive &&
            timeSinceLastIntercept > 15000 && // 15 seconds cooldown
            timeSinceUserAction > 20 && // User seems to need guidance
            this.mouseTracker.isMoving &&
            this.state.attention_level > 35 &&
            Math.random() > 0.7 // Some randomness - like a real dog
        );
        
        if (shouldIntercept) {
            this.performMouseInterception(mouseEvent);
        }
    }
    
    performMouseInterception(mouseEvent) {
        // Tinkerbelle's signature move!
        console.log('Aniota: Performing mouse interception - "Let me show you something!"');
        
        this.interceptActive = true;
        this.lastInterceptTime = Date.now();
        
        // Calculate where to intercept (slightly ahead of mouse)
        const interceptX = mouseEvent.clientX + 30;
        const interceptY = mouseEvent.clientY + 20;
        
        // Quick dart movement to intercept position
        this.animateToPosition(interceptX, interceptY, {
            duration: 300,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bouncy
            style: 'quick_dart'
        });
        
        // Hold position briefly with attention-seeking behavior
        setTimeout(() => {
            this.performAttentionSeekingBehavior();
        }, 400);
        
        // Release intercept after a moment
        setTimeout(() => {
            this.interceptActive = false;
            console.log('Aniota: Intercept complete - returning to normal behavior');
        }, 2500);
        
        // Update backend about the interception
        this.logInteraction('mouse_intercept', {
            mouse_position: { x: mouseEvent.clientX, y: mouseEvent.clientY },
            intercept_position: { x: interceptX, y: interceptY },
            behavior_type: 'tinkerbelle_dart'
        });
    }
    
    performAttentionSeekingBehavior() {
        // Bounce a bit to get attention (like Tinkerbelle would)
        if (!this.circle) return;
        
        this.circle.animate([
            { transform: 'scale(1) translateY(0px)' },
            { transform: 'scale(1.1) translateY(-5px)' },
            { transform: 'scale(1) translateY(0px)' },
            { transform: 'scale(1.05) translateY(-3px)' },
            { transform: 'scale(1) translateY(0px)' }
        ], {
            duration: 800,
            easing: 'ease-out'
        });
        
        // Brief color flash to signal "Hey, look at me!"
        const originalColor = this.state.mood_color;
        this.updateColor('#faeb36'); // Excited yellow
        
        setTimeout(() => {
            this.updateColor(originalColor);
        }, 1000);
    }
    
    animateToPosition(x, y, options = {}) {
        // Smooth movement to position with optional style
        if (!this.circle) return;
        
        const duration = options.duration || 500;
        const easing = options.easing || 'ease-out';
        
        // Constrain to viewport
        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - 80;
        const constrainedX = Math.max(20, Math.min(x, maxX));
        const constrainedY = Math.max(20, Math.min(y, maxY));
        
        this.circle.style.transition = `all ${duration}ms ${easing}`;
        this.circle.style.left = constrainedX + 'px';
        this.circle.style.top = constrainedY + 'px';
        
        // Update state
        this.state.position.x = constrainedX;
        this.state.position.y = constrainedY;
        
        // Reset transition after animation
        setTimeout(() => {
            if (this.circle) {
                this.circle.style.transition = '';
            }
        }, duration);
    }
    
    checkForGuidanceOpportunity() {
        const timeSinceAction = (Date.now() - this.lastUserAction) / 1000;
        
        // Dog-like behavior: Get more excited the longer user is idle
        if (timeSinceAction > 30 && this.state.behavior_mode !== 'guiding') {
            this.startGuidanceBehavior();
        } else if (timeSinceAction > 60) {
            this.escalateGuidanceBehavior();
        }
    }
    
    startGuidanceBehavior() {
        console.log('Aniota: Starting guidance behavior (like a dog wanting attention)');
        
        // Find potential guidance targets on current page
        const guidanceTargets = this.findGuidanceTargets();
        
        if (guidanceTargets.length > 0) {
            const target = guidanceTargets[0]; // Pick first available target
            this.state.behavior_mode = 'guiding';
            this.state.guidance_target = target;
            
            // Move toward the target and get excited
            this.moveTowardTarget(target);
            this.showExcitedBehavior();
        }
    }
    
    escalateGuidanceBehavior() {
        console.log('Aniota: Escalating guidance (more insistent, like an excited dog)');
        
        if (this.state.guidance_target) {
            // More dramatic attention-seeking behavior
            this.bounceNearTarget();
            this.flashColors();
            
            // Change heartbeat to excited rhythm
            this.state.heartbeat_rate = 400;
        }
    }
    
    findGuidanceTargets() {
        // Look for interactive elements that might benefit from guidance
        const potentialTargets = [
            'button:not([disabled])',
            '.interactive-element',
            '[role="button"]',
            'a[href]',
            '.draggable',
            '#continue-button',
            '.aniota-icon'
        ];
        
        const targets = [];
        potentialTargets.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.offsetParent !== null) { // Element is visible
                    targets.push({
                        element: el,
                        selector: selector,
                        rect: el.getBoundingClientRect(),
                        priority: this.calculateTargetPriority(el, selector)
                    });
                }
            });
        });
        
        // Sort by priority (highest first)
        return targets.sort((a, b) => b.priority - a.priority);
    }
    
    calculateTargetPriority(element, selector) {
        let priority = 1;
        
        // Higher priority for specific important elements
        if (selector.includes('continue-button')) priority += 10;
        if (selector.includes('aniota-icon')) priority += 8;
        if (element.classList.contains('primary')) priority += 5;
        if (element.classList.contains('interactive')) priority += 3;
        
        // Prefer elements in viewport center
        const rect = element.getBoundingClientRect();
        const centerDistance = Math.abs(rect.left + rect.width/2 - window.innerWidth/2) +
                              Math.abs(rect.top + rect.height/2 - window.innerHeight/2);
        priority += Math.max(0, 5 - centerDistance / 100);
        
        return priority;
    }
    
    moveTowardTarget(target) {
        const rect = target.rect;
        
        // Calculate position near the target (like a dog positioning itself)
        const targetX = Math.max(10, rect.left - 90); // Left side of target
        const targetY = Math.max(10, rect.top + (rect.height / 2) - 36); // Center vertically
        
        // Smooth movement toward target
        this.circle.style.transition = 'left 2s cubic-bezier(.25,1.7,.5,1), top 2s cubic-bezier(.25,1.7,.5,1)';
        this.circle.style.left = targetX + 'px';
        this.circle.style.top = targetY + 'px';
        
        this.state.position = { x: targetX, y: targetY };
        
        // Log this guidance attempt
        this.logInteraction('guidance_move', {
            target: target.selector,
            position: this.state.position,
            behavior_mode: this.state.behavior_mode
        });
    }
    
    showExcitedBehavior() {
        // Dog-like excited animations
        const excitement_animations = [
            this.gentleBounce.bind(this),
            this.wiggleEffect.bind(this),
            this.pulseGlow.bind(this)
        ];
        
        // Pick random excitement animation
        const animation = excitement_animations[Math.floor(Math.random() * excitement_animations.length)];
        animation();
        
        // Change to excited color temporarily
        const originalColor = this.state.mood_color;
        this.state.mood_color = '#faeb36'; // Excited yellow
        this.updateVisualState();
        
        // Return to normal color after excitement
        setTimeout(() => {
            this.state.mood_color = originalColor;
            this.updateVisualState();
        }, 3000);
    }
    
    gentleBounce() {
        // Subtle bounce like a dog getting attention
        this.circle.animate([
            { transform: 'translateY(0px)', offset: 0 },
            { transform: 'translateY(-8px)', offset: 0.5 },
            { transform: 'translateY(0px)', offset: 1 }
        ], { 
            duration: 800, 
            iterations: 3,
            easing: 'cubic-bezier(.68,-0.55,.265,1.55)'
        });
    }
    
    wiggleEffect() {
        // Side-to-side wiggle like a happy dog
        this.circle.animate([
            { transform: 'rotate(0deg) translateX(0px)' },
            { transform: 'rotate(-3deg) translateX(-3px)' },
            { transform: 'rotate(3deg) translateX(3px)' },
            { transform: 'rotate(-2deg) translateX(-2px)' },
            { transform: 'rotate(0deg) translateX(0px)' }
        ], { 
            duration: 600, 
            iterations: 2,
            easing: 'ease-in-out'
        });
    }
    
    pulseGlow() {
        // Gentle pulsing glow to attract attention
        this.circle.animate([
            { boxShadow: '0 4px 24px #0008', transform: 'scale(1)' },
            { boxShadow: '0 8px 40px #faeb3688', transform: 'scale(1.15)' },
            { boxShadow: '0 12px 48px #faeb3666', transform: 'scale(1.2)' },
            { boxShadow: '0 8px 32px #faeb3644', transform: 'scale(1.1)' },
            { boxShadow: '0 4px 24px #0008', transform: 'scale(1)' }
        ], { 
            duration: 1200, 
            iterations: 2
        });
    }
    
    bounceNearTarget() {
        // More insistent bouncing when user hasn't responded
        this.circle.animate([
            { transform: 'translateY(0px) scale(1)', offset: 0 },
            { transform: 'translateY(-12px) scale(1.1)', offset: 0.3 },
            { transform: 'translateY(-16px) scale(1.15)', offset: 0.6 },
            { transform: 'translateY(0px) scale(1)', offset: 1 }
        ], { 
            duration: 600, 
            iterations: 4,
            easing: 'cubic-bezier(.68,-0.55,.265,1.55)'
        });
    }
    
    flashColors() {
        // Quick color changes to get attention (like excited panting)
        const colors = ['#faeb36', '#79c314', '#ffb300', '#487de7'];
        let colorIndex = 0;
        
        const flashInterval = setInterval(() => {
            this.state.mood_color = colors[colorIndex];
            this.updateVisualState();
            colorIndex = (colorIndex + 1) % colors.length;
        }, 300);
        
        // Stop flashing after 2.4 seconds
        setTimeout(() => {
            clearInterval(flashInterval);
            this.state.mood_color = '#ffb300'; // Return to default
            this.updateVisualState();
        }, 2400);
    }
    
    celebrateSuccess(action) {
        // Dog-like celebration when user follows guidance
        console.log(`Aniota: Celebrating success! User performed: ${action}`);
        
        this.state.behavior_mode = 'celebrating';
        this.state.earned_points += 10;
        
        // Victory celebration animation
        this.circle.animate([
            { transform: 'rotate(0deg) scale(1)', boxShadow: '0 4px 24px #0008' },
            { transform: 'rotate(180deg) scale(1.3)', boxShadow: '0 12px 48px #79c31466' },
            { transform: 'rotate(360deg) scale(1)', boxShadow: '0 4px 24px #0008' }
        ], { 
            duration: 1000, 
            easing: 'cubic-bezier(.68,-0.55,.265,1.55)'
        });
        
        // Success color
        const originalColor = this.state.mood_color;
        this.state.mood_color = '#79c314'; // Success green
        this.updateVisualState();
        
        // Reset behavior state after celebration
        setTimeout(() => {
            this.state.behavior_mode = 'observing';
            this.state.attention_level = 0;
            this.state.guidance_target = null;
            this.state.mood_color = originalColor;
            this.state.heartbeat_rate = 800; // Back to normal rhythm
            this.updateVisualState();
        }, 2000);
        
        // Log the success
        this.logInteraction('guidance_success', {
            action: action,
            points_earned: 10,
            total_points: this.state.earned_points
        });
    }
    
    logUserActivity(activity) {
        // Reset attention-seeking when user is active
        if (this.state.behavior_mode === 'guiding') {
            // User responded! Celebrate based on what they did
            if (activity === 'click' && this.state.guidance_target) {
                this.celebrateSuccess('click');
            } else {
                // User is active, reduce attention seeking
                this.state.attention_level = Math.max(0, this.state.attention_level - 10);
                this.state.behavior_mode = 'observing';
            }
        }
    }
    
    updateBehaviorState() {
        // Send behavior updates to backend
        if (this.isConnected) {
            fetch(`${this.apiUrl}/api/aniota/behavior`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    behavior_mode: this.state.behavior_mode,
                    attention_level: this.state.attention_level,
                    guidance_target: this.state.guidance_target?.selector || null,
                    earned_points: this.state.earned_points,
                    last_user_action: this.lastUserAction
                })
            }).catch(console.warn);
        }
    }
    
    updateVisualState() {
        // Update the visual appearance based on current state
        if (this.circle) {
            this.circle.style.backgroundColor = this.state.mood_color;
            // Add a subtle filter for mood indication
            this.circle.style.filter = `drop-shadow(0 0 10px ${this.state.mood_color})`;
        }
    }
    
    async connectToBackend() {
        try {
            const response = await fetch(`${this.apiUrl}/api/aniota/state`);
            if (response.ok) {
                const backendState = await response.json();
                this.updateFromBackendState(backendState);
                this.isConnected = true;
                console.log('Aniota Presence: Connected to backend', backendState);
            }
        } catch (error) {
            console.warn('Aniota Presence: Backend connection failed', error);
            this.isConnected = false;
        }
    }
    
    connectWebSocket() {
        try {
            this.ws = new WebSocket(`ws://192.168.254.200:52330/ws/aniota`);
            
            this.ws.onopen = () => {
                console.log('Aniota Presence: WebSocket connected');
                this.sendMessage({ type: 'ping' });
            };
            
            this.ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                this.handleWebSocketMessage(message);
            };
            
            this.ws.onclose = () => {
                console.log('Aniota Presence: WebSocket disconnected, attempting reconnect...');
                setTimeout(() => this.connectWebSocket(), 5000);
            };
            
            this.ws.onerror = (error) => {
                console.warn('Aniota Presence: WebSocket error', error);
            };
        } catch (error) {
            console.warn('Aniota Presence: WebSocket connection failed', error);
        }
    }
    
    handleWebSocketMessage(message) {
        switch (message.type) {
            case 'initial_state':
                this.updateFromBackendState(message.state);
                break;
            case 'mood_update':
                this.updateMoodColor(message.color);
                break;
            case 'position_update':
                if (message.position && !this.isDragging) {
                    this.updatePosition(message.position.x, message.position.y);
                }
                break;
            case 'state_update':
                this.updateFromBackendState(message.state);
                break;
            case 'pong':
                // Connection confirmed
                break;
        }
    }
    
    updateFromBackendState(backendState) {
        if (backendState.mood_color !== this.state.mood_color) {
            this.updateMoodColor(backendState.mood_color);
        }
        
        if (backendState.position && !this.isDragging) {
            this.updatePosition(backendState.position.x, backendState.position.y);
        }
        
        if (backendState.heartbeat_rate !== this.state.heartbeat_rate) {
            this.state.heartbeat_rate = backendState.heartbeat_rate;
        }
        
        this.state = { ...this.state, ...backendState };
    }
    
    updateMoodColor(color) {
        this.state.mood_color = color;
        if (this.circle) {
            this.circle.style.background = `radial-gradient(circle at 60% 40%, ${color}, #232323 90%)`;
        }
    }
    
    updatePosition(x, y) {
        this.state.position = { x, y };
        if (this.circle) {
            this.circle.style.left = x + 'px';
            this.circle.style.top = y + 'px';
        }
    }
    
    async syncPosition() {
        if (!this.isConnected) return;
        
        try {
            await fetch(`${this.apiUrl}/api/aniota/position`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    x: this.state.position.x,
                    y: this.state.position.y,
                    context: this.getPageContext()
                })
            });
        } catch (error) {
            console.warn('Aniota Presence: Position sync failed', error);
        }
    }
    
    async logInteraction(type, details = {}) {
        if (!this.isConnected) {
            console.log('Aniota Presence: Offline interaction logged locally', { type, details });
            return;
        }
        
        try {
            await fetch(`${this.apiUrl}/api/aniota/interaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: type,
                    details: {
                        ...details,
                        page: this.getPageContext(),
                        timestamp: new Date().toISOString()
                    }
                })
            });
        } catch (error) {
            console.warn('Aniota Presence: Interaction logging failed', error);
        }
    }
    
    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }
    
    getPageContext() {
        const path = window.location.pathname;
        if (path.includes('splash')) return 'splash';
        if (path.includes('launcher')) return 'launcher';
        if (path.includes('epicenter')) return 'epicenter';
        if (path.includes('about')) return 'about';
        return 'unknown';
    }
    
    // Public method to trigger mood changes
    setMood(trigger) {
        this.logInteraction('mood_change', { trigger });
    }
    
    // Public method to add messages
    speak(message, type = 'info') {
        this.logInteraction('speak', { message, type });
        // Could expand this to show speech bubbles, etc.
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if mood circle element exists
    if (document.getElementById('aniota-mood-circle')) {
        window.aniotaPresence = new AniotaPresence();
    }
});

window.AniotaPresence = AniotaPresence;

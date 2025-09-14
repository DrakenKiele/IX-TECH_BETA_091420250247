
class AniotaBehavior {
    constructor(name) {
        this.name = name;
    }
    init(persona) {}
    activate() {}
    deactivate() {}
    test() {}
}

class AniotaPersona {
    constructor(container, options = {}) {
        this.container = container;
        this.options = options;
        this.state = {
            mood: 'calm',
            moodColor: '#77dd77',
            position: { x: 100, y: 100 },
            activity: 'idle',
            behaviorMode: 'observing',
            attentionLevel: 0,
            guidanceTarget: null,
            playfulness: 85,
            heartbeatRate: 800,
            learningMoments: [],
            morphState: 'ball', // 'ball', 'flat', 'morphing'
        };
        this.svg = null;
        this.behaviors = {};
        this.initSVG();
        this.initBehaviors();
        this.initCommunication();
    }

    // Initialize SVG visual
    initSVG() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', 120);
        this.svg.setAttribute('height', 120);
        this.svg.style.position = 'absolute';
        this.svg.style.left = `${this.state.position.x}px`;
        this.svg.style.top = `${this.state.position.y}px`;
        this.svg.style.cursor = 'pointer';
        this.container.appendChild(this.svg);
        this.drawBall();
    }

    // Draw ball shape (default)
    drawBall() {
        this.svg.innerHTML = '';
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', 60);
        circle.setAttribute('cy', 60);
        circle.setAttribute('r', 50);
        circle.setAttribute('fill', this.state.moodColor);
        circle.setAttribute('id', 'aniota-ball');
        this.svg.appendChild(circle);
    }

    // Morph to flat shape (placeholder for future animation)
    morphToFlat() {
        this.state.morphState = 'flat';
        this.svg.innerHTML = '';
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', 10);
        rect.setAttribute('y', 50);
        rect.setAttribute('width', 100);
        rect.setAttribute('height', 20);
        rect.setAttribute('fill', this.state.moodColor);
        rect.setAttribute('id', 'aniota-flat');
        this.svg.appendChild(rect);
    }

    // Morph back to ball
    morphToBall() {
        this.state.morphState = 'ball';
        this.drawBall();
    }

    // Placeholder for inchworm movement
    moveInchwormStyle(targetX, targetY) {
        // Future: animate morphing and movement
        this.state.position = { x: targetX, y: targetY };
        this.svg.style.left = `${targetX}px`;
        this.svg.style.top = `${targetY}px`;
    }

    // Initialize behaviors (drag, click, etc.)
    initBehaviors() {
        this.svg.addEventListener('mousedown', (e) => {
            this.onDragStart(e);
        });
        document.addEventListener('mousemove', (e) => {
            this.onDragMove(e);
        });
        document.addEventListener('mouseup', (e) => {
            this.onDragEnd(e);
        });
        this.svg.addEventListener('dblclick', () => {
            this.morphToFlat();
            setTimeout(() => this.morphToBall(), 600);
        });
    }

    onDragStart(e) {
        this.isDragging = true;
        this.dragOffset = {
            x: e.clientX - this.state.position.x,
            y: e.clientY - this.state.position.y
        };
    }

    onDragMove(e) {
        if (this.isDragging) {
            const x = e.clientX - this.dragOffset.x;
            const y = e.clientY - this.dragOffset.y;
            this.moveInchwormStyle(x, y);
        }
    }

    onDragEnd(e) {
        this.isDragging = false;
    }

    // Initialize backend communication (placeholder)
    initCommunication() {
        // Future: WebSocket/REST integration
    }

    // Register a behavior module
    addBehavior(behavior) {
        this.behaviors[behavior.name] = behavior;
        behavior.init(this);
    }
    // Remove a behavior module
    removeBehavior(name) {
        if (this.behaviors[name]) {
            this.behaviors[name].deactivate();
            delete this.behaviors[name];
        }
    }
    // Activate a behavior
    activateBehavior(name) {
        if (this.behaviors[name]) {
            this.behaviors[name].activate();
        }
    }

    // Update mood and color
    setMood(mood, color) {
        this.state.mood = mood;
        this.state.moodColor = color;
        if (this.state.morphState === 'ball') {
            this.drawBall();
        } else {
            this.morphToFlat();
        }
    }
}

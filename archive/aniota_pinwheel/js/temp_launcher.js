
document.addEventListener('DOMContentLoaded', initializeSplash);

let currentStep = 1;
let animationInterval;

function initializeSplash() {
    console.log('Aniota Splash initialized');

    // Setup event listeners
    setupEventListeners();

    // Start background animation
    startBackgroundAnimation();

    // Auto-advance progress simulation
    simulateProgressSteps();

    // Log splash view
    logUserAction('splash_view');
const navButtonContent = {
    "About Aniota": {
        title: "About Aniota",
        content: `Aniota is an intelligent learning companion that observes, learns, and adapts to your unique behavioral patterns to enhance your digital learning experience.\n\nKey Features:\n- Adaptive Learning: Learns from your interactions and adapts to your learning style\n- Privacy-First: All data processing happens locally with session-bound storage\n- Real-time Analysis: Instant behavioral pattern recognition and feedback\n- Learning Insights: Visualize your learning progress and patterns\n\nAniota implements a sophisticated cortex-based architecture that mirrors cognitive processes: Senses, Perceives, Reasons, Learns, Communicates.\n\nPhilosophy: Ethical AI, non-punitive, emotionally safe learning, symbolic feedback, user control over data.`
    },
    "About DK Softworks": {
        title: "About DK Softworks",
        content: `Innovative software development company specializing in intelligent learning systems and behavioral analysis technologies.\n\nMission: To create ethical AI solutions that enhance human learning and development while respecting privacy and individual agency.\n\nTechnologies: Behavioral Pattern Recognition, Adaptive Learning Systems, Privacy-Preserving Analytics, Real-time Data Processing.`
    },
    "About IX-Tech": {
        title: "About IX-Tech",
        content: `IX-Tech is an advanced interaction technology framework powering Aniota's behavioral analysis capabilities.\n\nCore Technologies: Real-time Interaction Monitoring, Pattern Recognition Algorithms, Adaptive Learning Protocols, High-Performance Data Processing.`
    },
    "Instructions": {
        title: "Instructions",
        content: `How to use Aniota and get started quickly. (See the Instructions page for details.)`
    },
    "Subscriptions": {
        title: "Subscriptions",
        content: `Manage your Aniota subscription and access levels. (See the Subscriptions page for details.)`
    },
    "Maqnetix UI Core": {
        title: "Maqnetix UI Core",
        content: `Access the visual web-space builder and grid tools. (See the Maqnetix UI Core page for details.)`
    },
    "Tutorial": {
        title: "Tutorial",
        content: `Begin the guided Aniota tutorial experience. (See the Tutorial page for details.)`
    }
};

/**
 * Optionally show dynamic content or tooltip for nav buttons.
 * @param {string} label - The label of the nav button.
 */
function showNavButtonContent(label) {
    const info = navButtonContent[label];
    if (!info) return;
    // Example: display info.content in a tooltip or side panel
    // (Implementation depends on UI/UX requirements)
    console.log(`Show content for ${label}:`, info);
}
}

function setupEventListeners() {
    // Main action buttons
    document.getElementById('continue-to-epicenter')?.addEventListener('click', continueToEpicenter);
    document.getElementById('learn-more')?.addEventListener('click', learnMore);
    document.getElementById('skip-intro')?.addEventListener('click', skipIntroduction);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Window events
    window.addEventListener('beforeunload', () => logUserAction('splash_exit'));
}

function continueToEpicenter() {
    console.log('Continuing to Aniota Epicenter');

    // Log user action
    logUserAction('continue_to_epicenter');

    // Navigate to epicenter
    window.location.href = 'aniota_epicenter.html';
}

function learnMore() {
    console.log('Learning more about Aniota');

    // Log user action
    logUserAction('learn_more_clicked');

    // Navigate to about page
    window.location.href = 'about_aniota.html';
}

function skipIntroduction() {
    console.log('Skipping introduction');

    // Log user action
    logUserAction('skip_introduction');

    // Go directly to epicenter
    window.location.href = 'aniota_epicenter.html';
}

function startBackgroundAnimation() {
    const background = document.querySelector('.background-animation');
    if (!background) return;

    // Create floating particles
    for (let i = 0; i < 20; i++) {
        createFloatingParticle(background);
    }
}

function createFloatingParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';

    // Random position and animation duration
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = 3 + Math.random() * 4; // 3-7 seconds
    const delay = Math.random() * 2; // 0-2 seconds delay

    particle.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: 4px;
        height: 4px;
        background: rgba(46, 139, 87, 0.6);
        border-radius: 50%;
        animation: float ${duration}s ${delay}s infinite ease-in-out;
        pointer-events: none;
    `;

    container.appendChild(particle);

    // Remove and recreate particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createFloatingParticle(container);
        }
    }, (duration + delay) * 1000);
}

function simulateProgressSteps() {
    // Simulate automatic progression through steps
    setTimeout(() => updateStep(2), 2000);
    setTimeout(() => updateStep(3), 4000);
}

function updateStep(stepNumber) {
    if (stepNumber > 3) return;

    currentStep = stepNumber;

    // Update visual progress
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index + 1 <= stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Enable continue button when ready
    if (stepNumber === 3) {
        const continueBtn = document.getElementById('continue-to-epicenter');
        if (continueBtn) {
            continueBtn.classList.add('ready');
            continueBtn.style.animation = 'pulse 2s infinite';
        }
    }

    // Log progress
    logUserAction('progress_step', { step: stepNumber });
}

function handleKeyboardShortcuts(event) {
    switch (event.key) {
        case 'Enter':
            if (currentStep >= 3) {
                continueToEpicenter();
            }
            break;
        case 'Escape':
            skipIntroduction();
            break;
        case ' ':
            event.preventDefault();
            if (currentStep < 3) {
                updateStep(currentStep + 1);
            } else {
                continueToEpicenter();
            }
            break;
    }
}

function logUserAction(action, data = {}) {
    const actionData = {
        action,
        timestamp: Date.now(),
        context: 'splash',
        currentStep,
        ...data
    };

    // Send to background script if available
    if (chrome?.runtime?.sendMessage) {
        chrome.runtime.sendMessage({
            action: 'logUserEvent',
            data: actionData
        });
    }

    console.log('User action logged:', actionData);
}

document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            logUserAction('feature_card_hover', {
                feature: card.querySelector('h3')?.textContent
            });
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Accessibility improvements
function enhanceAccessibility() {
    // Add ARIA labels
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });

    // Add keyboard navigation
    const focusableElements = document.querySelectorAll('button, [tabindex]');
    focusableElements.forEach((element, index) => {
        element.setAttribute('tabindex', index + 1);
    });

    // Add progress announcements for screen readers
    const progressSteps = document.querySelectorAll('.step');
    progressSteps.forEach((step, index) => {
        step.setAttribute('aria-label', `Step ${index + 1}: ${step.querySelector('span')?.textContent}`);
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', enhanceAccessibility);
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

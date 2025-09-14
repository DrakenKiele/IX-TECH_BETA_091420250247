
document.addEventListener('DOMContentLoaded', initializeLauncher);

let monitoringEnabled = false;
let extensionSettings = {};
let onboardingData = null;
let currentOnboardingQuestion = 0;
let onboardingResponses = [];

async function initializeLauncher() {
    console.log('Aniota Launcher initialized');

    // Load extension settings
    await loadExtensionSettings();

    // Check onboarding status
    await checkOnboardingStatus();

    // Setup event listeners
    setupEventListeners();

    // Update UI with current state
    updateMonitoringStatus();
    updateLearningLevelDisplay();

    // Start heartbeat animation
    startHeartbeatAnimation();
}

// Load settings from localStorage/sessionStorage
async function loadExtensionSettings() {
    try {
        extensionSettings = {
            aniotaEnabled: localStorage.getItem('aniotaEnabled') === 'true',
            learningLevel: localStorage.getItem('learningLevel'),
            onboardingCompleted: localStorage.getItem('onboardingCompleted') === 'true',
            onboardingResponses: JSON.parse(localStorage.getItem('onboardingResponses') || '[]'),
            userMonitoring: localStorage.getItem('userMonitoring') === 'true',
            sessionId: sessionStorage.getItem('sessionId'),
            learningMoments: JSON.parse(sessionStorage.getItem('learningMoments') || '[]'),
            behavioralMetrics: JSON.parse(sessionStorage.getItem('behavioralMetrics') || '{}')
        };
        monitoringEnabled = extensionSettings.userMonitoring || false;
        console.log('Settings loaded:', extensionSettings);
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Check if onboarding is needed
async function checkOnboardingStatus() {
    try {
        if (!extensionSettings.onboardingCompleted) {
            showOnboardingSection();
        } else {
            showLearningLevelDisplay();
        }
    } catch (error) {
        console.error('Error checking onboarding status:', error);
    }
}

// Show onboarding section for new users
function showOnboardingSection() {
    const onboardingSection = document.getElementById('onboarding-section');
    const learningLevelDisplay = document.getElementById('learning-level-display');
    
    if (onboardingSection) {
        onboardingSection.style.display = 'block';
    }
    if (learningLevelDisplay) {
        learningLevelDisplay.style.display = 'none';
    }
}

// Show learning level display for existing users
function showLearningLevelDisplay() {
    const onboardingSection = document.getElementById('onboarding-section');
    const learningLevelDisplay = document.getElementById('learning-level-display');
    
    if (onboardingSection) {
        onboardingSection.style.display = 'none';
    }
    if (learningLevelDisplay) {
        learningLevelDisplay.style.display = 'block';
    }
}

// Update learning level display
async function updateLearningLevelDisplay() {
    try {
        // For PWA, just use stored values
        const levelNameElem = document.getElementById('level-name');
        const levelConfidenceElem = document.getElementById('level-confidence');
        const level = extensionSettings.learningLevel || 2;
        const confidence = 80; // Placeholder, as no backend
        const levelNames = {
            0: "Primary School",
            1: "Middle School", 
            2: "High School",
            3: "College",
            4: "Adult Professional"
        };
        if (levelNameElem) {
            levelNameElem.textContent = levelNames[level] || "High School";
        }
        if (levelConfidenceElem) {
            levelConfidenceElem.textContent = `Confidence: ${confidence}%`;
        }
    } catch (error) {
        console.error('Error updating learning level display:', error);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Main action buttons
    document.getElementById('launch-epicenter')?.addEventListener('click', launchEpicenter);
    document.getElementById('open-splash')?.addEventListener('click', openSplash);

    // Onboarding buttons
    document.getElementById('start-onboarding')?.addEventListener('click', startOnboarding);
    document.getElementById('close-onboarding')?.addEventListener('click', closeOnboardingModal);
    document.getElementById('onboarding-next')?.addEventListener('click', nextOnboardingQuestion);
    document.getElementById('onboarding-prev')?.addEventListener('click', prevOnboardingQuestion);

    // Navigation buttons
    document.getElementById('about-aniota')?.addEventListener('click', () => openPage('about_aniota.html'));
    document.getElementById('about-dk-softworks')?.addEventListener('click', () => openPage('about_dk_softworks.html'));
    document.getElementById('about-ix-tech')?.addEventListener('click', () => openPage('about_ix-tech.html'));

    // Quick access buttons
    document.getElementById('instructions')?.addEventListener('click', () => openPage('instructions.html'));
    document.getElementById('subscriptions')?.addEventListener('click', () => openPage('subscriptions.html'));
    document.getElementById('license')?.addEventListener('click', () => openPage('license.html'));
    document.getElementById('settings')?.addEventListener('click', () => openPage('settings.html'));

    // Monitoring toggle
    document.getElementById('toggle-monitoring')?.addEventListener('click', toggleMonitoring);

    // Footer links
    document.getElementById('privacy-link')?.addEventListener('click', () => openPage('privacy.html'));
    document.getElementById('terms-link')?.addEventListener('click', () => openPage('terms.html'));
    document.getElementById('support-link')?.addEventListener('click', () => openPage('support.html'));

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Quick Learning Actions
    document.getElementById('ask-question')?.addEventListener('click', () => {
        logUserAction('ask_question');
        launchEpicenter(); // For now, redirect to epicenter
    });
    
    document.getElementById('practice-mode')?.addEventListener('click', () => {
        logUserAction('practice_mode');
        launchEpicenter(); // For now, redirect to epicenter
    });
    
    document.getElementById('explore-topic')?.addEventListener('click', () => {
        logUserAction('explore_topic');
        launchEpicenter(); // For now, redirect to epicenter
    });
    // Monitoring toggle
    document.getElementById('toggle-monitoring')?.addEventListener('click', toggleMonitoring);

    // Footer links
    document.getElementById('privacy-link')?.addEventListener('click', () => openPage('privacy.html'));
    document.getElementById('terms-link')?.addEventListener('click', () => openPage('terms.html'));
    document.getElementById('support-link')?.addEventListener('click', () => openPage('support.html'));

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Quick Learning Actions
    document.getElementById('ask-question')?.addEventListener('click', () => {
        logUserAction('ask_question');
        launchEpicenter(); // For now, redirect to epicenter
    });
    
    document.getElementById('practice-mode')?.addEventListener('click', () => {
        logUserAction('practice_mode');
        launchEpicenter(); // For now, redirect to epicenter
    });
    
    document.getElementById('explore-topic')?.addEventListener('click', () => {
        logUserAction('explore_topic');
        launchEpicenter(); // For now, redirect to epicenter
    });
}
// Launch Aniota Epicenter in new tab
function launchEpicenter() {
    console.log('Launching Aniota Epicenter');
    window.open('aniota_epicenter.html', '_blank');
    logUserAction('launch_epicenter');
}

// Open splash/introduction page
function openSplash() {
    console.log('Opening Aniota Splash');
    window.open('aniota_splash.html', '_blank');
    logUserAction('open_splash');
}

// Open specific page in new tab
function openPage(pageName) {
    console.log(`Opening page: ${pageName}`);
    window.open(pageName, '_blank');
    logUserAction(`open_page_${pageName.replace('.html', '')}`);
}

// Toggle user monitoring on/off
async function toggleMonitoring() {
    try {
        monitoringEnabled = !monitoringEnabled;
        // Update storage
        localStorage.setItem('userMonitoring', monitoringEnabled);
        // Update UI
        updateMonitoringStatus();
        // Log user action
        logUserAction('toggle_monitoring', { enabled: monitoringEnabled });
        console.log(`Monitoring ${monitoringEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
        console.error('Error toggling monitoring:', error);
    }
}

// Update monitoring status display
function updateMonitoringStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    const toggleBtn = document.getElementById('toggle-monitoring');

    if (statusDot && statusText && toggleBtn) {
        if (monitoringEnabled) {
            statusDot.className = 'status-dot active';
            statusText.textContent = 'Monitoring: On';
            toggleBtn.textContent = 'Pause';
            toggleBtn.className = 'toggle-btn active';
        } else {
            statusDot.className = 'status-dot inactive';
            statusText.textContent = 'Monitoring: Off';
            toggleBtn.textContent = 'Start';
            toggleBtn.className = 'toggle-btn inactive';
        }
    }
}

// Start EKG heartbeat animation
function startHeartbeatAnimation() {
    const ekgLine = document.querySelector('.ekg-line');
    if (ekgLine) {
        // EKG animation is handled by CSS, but we can control timing here
        setInterval(() => {
            ekgLine.style.animationDelay = '0s';
        }, 800); // 800ms cycle as per requirements
    }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Ctrl+E: Launch Epicenter
    if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        launchEpicenter();
    }

    // Ctrl+S: Open Splash
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        openSplash();
    }

    // Ctrl+M: Toggle Monitoring
    if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        toggleMonitoring();
    }

    // Escape: Close popup
    if (event.key === 'Escape') {
        window.close();
    }
}

// Log user action for behavioral analysis
function logUserAction(action, data = {}) {
    const actionData = {
        action,
        timestamp: Date.now(),
        sessionId: extensionSettings.sessionId,
        context: 'launcher',
        ...data
    };
    // Log to sessionStorage (append to a session log array)
    let log = [];
    try {
        log = JSON.parse(sessionStorage.getItem('aniotaLauncherLog')) || [];
    } catch (e) {}
    log.push(actionData);
    sessionStorage.setItem('aniotaLauncherLog', JSON.stringify(log));
}

// Handle window focus/blur events
window.addEventListener('focus', () => {
    logUserAction('launcher_focus');
});

window.addEventListener('blur', () => {
    logUserAction('launcher_blur');
});

// Handle popup close
window.addEventListener('beforeunload', () => {
    logUserAction('launcher_close');
});

// Accessibility improvements
function enhanceAccessibility() {
    // Add ARIA labels and descriptions
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });

    // Add keyboard navigation hints
    const focusableElements = document.querySelectorAll('button, a, [tabindex]');
    focusableElements.forEach((element, index) => {
        element.setAttribute('tabindex', index + 1);
    });
}

// Call accessibility enhancements after DOM is ready
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Onboarding Modal and Flow Functions

// Define onboarding questions
const SUBJECT_OPTIONS = [
    'Math', 'Science', 'English', 'History', 'Art', 'Music', 'Physical Education',
    'Computer Science', 'Biology', 'Chemistry', 'Physics', 'Social Studies',
    'Economics', 'Foreign Language', 'Geography', 'Civics', 'Health', 'Other'
];
const ADULT_OPTION = 'I am an adult and not currently in school (or never was)';

const ONBOARDING_QUESTIONS = [
    {
        id: 'favorite_last_year',
        question: 'What was your favorite class last year?',
        type: 'multi',
        options: [...SUBJECT_OPTIONS, ADULT_OPTION]
    },
    {
        id: 'favorite_this_year',
        question: "What's your favorite class this year?",
        type: 'multi',
        options: [...SUBJECT_OPTIONS, ADULT_OPTION]
    },
    {
        id: 'excited_next_year',
        question: 'What classes are you most excited about taking next year?',
        type: 'multi',
        options: [...SUBJECT_OPTIONS, ADULT_OPTION]
    }
];

// Start onboarding flow
function startOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) {
        modal.style.display = 'block';
        currentOnboardingQuestion = 0;
        onboardingResponses = [];
        showOnboardingQuestion();
    }
}

// Show current onboarding question
function showOnboardingQuestion() {
    const question = ONBOARDING_QUESTIONS[currentOnboardingQuestion];
    const content = document.getElementById('onboarding-content');
    const progress = document.getElementById('progress-fill');
    const nextBtn = document.getElementById('onboarding-next');
    const prevBtn = document.getElementById('onboarding-prev');
    if (!question || !content) return;
    // Update progress bar
    const progressPercent = ((currentOnboardingQuestion + 1) / ONBOARDING_QUESTIONS.length) * 100;
    if (progress) {
        progress.style.width = `${progressPercent}%`;
    }
    // Create question content (multi-select checkboxes)
    content.innerHTML = `
        <div class="onboarding-question">
            <h3>Question ${currentOnboardingQuestion + 1} of ${ONBOARDING_QUESTIONS.length}</h3>
            <p class="question-text">${question.question}</p>
            <div class="multi-select-group">
                ${question.options.map(opt => `
                    <label class="multi-select-option">
                        <input type="checkbox" name="onboarding-response" value="${opt}">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
            <div class="response-hint">
                Select all that apply. If you are an adult, you may select only the adult option.
            </div>
        </div>
    `;
    // Restore previous selections if going back
    if (onboardingResponses[currentOnboardingQuestion]) {
        const prev = onboardingResponses[currentOnboardingQuestion].response || [];
        document.querySelectorAll('input[name="onboarding-response"]').forEach(cb => {
            if (prev.includes(cb.value)) cb.checked = true;
        });
    }
    // Update button states
    if (prevBtn) {
        prevBtn.style.display = currentOnboardingQuestion > 0 ? 'inline-block' : 'none';
    }
    if (nextBtn) {
        nextBtn.textContent = currentOnboardingQuestion === ONBOARDING_QUESTIONS.length - 1 
            ? 'Complete Assessment' 
            : 'Next';
    }
}

// Go to next onboarding question
async function nextOnboardingQuestion() {
    const checked = Array.from(document.querySelectorAll('input[name="onboarding-response"]:checked'));
    const response = checked.map(cb => cb.value);
    if (response.length === 0) {
        showOnboardingError('Please select at least one option before continuing.');
        return;
    }
    // Save current response (replace if going back)
    onboardingResponses[currentOnboardingQuestion] = {
        questionId: ONBOARDING_QUESTIONS[currentOnboardingQuestion].id,
        question: ONBOARDING_QUESTIONS[currentOnboardingQuestion].question,
        response: response,
        timestamp: Date.now()
    };
    // If first question and adult option selected, skip to completion
    if (currentOnboardingQuestion === 0 && response.includes(ADULT_OPTION)) {
        // Only keep the first response, discard any others
        onboardingResponses.length = 1;
        currentOnboardingQuestion = ONBOARDING_QUESTIONS.length;
        await completeOnboarding();
        return;
    }
    currentOnboardingQuestion++;
    if (currentOnboardingQuestion >= ONBOARDING_QUESTIONS.length) {
        // Complete onboarding
        await completeOnboarding();
    } else {
        // Show next question
        showOnboardingQuestion();
    }
}

// Go to previous onboarding question
function prevOnboardingQuestion() {
    if (currentOnboardingQuestion > 0) {
        currentOnboardingQuestion--;
        showOnboardingQuestion();
    }
}

// Complete the onboarding process
async function completeOnboarding() {
    try {
        // Show processing state
        const content = document.getElementById('onboarding-content');
        if (content) {
            content.innerHTML = `
                <div class="onboarding-processing">
                    <div class="processing-spinner"></div>
                    <h3>Analyzing Your Responses...</h3>
                    <p>We're determining your optimal learning level.</p>
                </div>
            `;
        }
        // Prepare onboarding data
        const filteredResponses = onboardingResponses.filter(r => r && r.response && r.response.length > 0);
        const onboardingData = {
            answers: filteredResponses.map(r => r.response).flat(),
            responses: filteredResponses,
            completedAt: Date.now()
        };
        // Simulate onboarding processing and set learning level
        let learningLevel = 2; // Default to High School
        if (onboardingData.answers.includes('I am an adult and not currently in school (or never was)')) {
            learningLevel = 4;
        } else if (onboardingData.answers.includes('Primary School')) {
            learningLevel = 0;
        } else if (onboardingData.answers.includes('Middle School')) {
            learningLevel = 1;
        } else if (onboardingData.answers.includes('College')) {
            learningLevel = 3;
        }
        // Save completion status
        localStorage.setItem('onboardingCompleted', 'true');
        localStorage.setItem('onboardingResponses', JSON.stringify(onboardingData));
        localStorage.setItem('learningLevel', learningLevel);
        // Show completion message
        showOnboardingCompletion(learningLevel);
        // Update extension settings
        extensionSettings.onboardingCompleted = true;
        extensionSettings.learningLevel = learningLevel;
    } catch (error) {
        console.error('Error completing onboarding:', error);
        showOnboardingError('There was an error processing your responses. Please try again.');
    }
}

// Show onboarding completion message
function showOnboardingCompletion(learningLevel) {
    const content = document.getElementById('onboarding-content');
    const nextBtn = document.getElementById('onboarding-next');
    const prevBtn = document.getElementById('onboarding-prev');
    
    const levelNames = {
        0: "Primary School",
        1: "Middle School", 
        2: "High School",
        3: "College",
        4: "Adult Professional"
    };
    
    const levelName = levelNames[learningLevel] || "High School";
    
    if (content) {
        content.innerHTML = `
            <div class="onboarding-completion">
                <div class="completion-icon">✨</div>
                <h3>Assessment Complete!</h3>
                <div class="level-result">
                    <p>Your learning level has been set to:</p>
                    <div class="level-badge">${levelName}</div>
                </div>
                <p class="completion-message">
                    Aniota will now provide content and questions appropriate for your level. 
                    You can always adjust this in settings later.
                </p>
            </div>
        `;
    }
    
    // Update buttons
    if (nextBtn) {
        nextBtn.textContent = 'Get Started';
        nextBtn.onclick = () => closeOnboardingModal();
    }
    
    if (prevBtn) {
        prevBtn.style.display = 'none';
    }
}

// Show onboarding error message
function showOnboardingError(message) {
    const existingError = document.querySelector('.onboarding-error');
    if (existingError) {
        existingError.remove();
    }
    
    const content = document.getElementById('onboarding-content');
    if (content) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'onboarding-error';
        errorDiv.innerHTML = `
            <div class="error-message">
                <span class="error-icon">⚠️</span>
                ${message}
            </div>
        `;
        content.appendChild(errorDiv);
        
        // Remove error after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// Close onboarding modal
function closeOnboardingModal() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Update UI to show learning level or main interface
    if (extensionSettings.onboardingCompleted) {
        showLearningLevelDisplay();
        updateLearningLevelDisplay();
    } else {
        showOnboardingSection();
    }
}

// Setup all event listeners - this was moved to after the onboarding functions
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

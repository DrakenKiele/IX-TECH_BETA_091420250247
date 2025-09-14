

let aniotaSystem = {
    caf: null,
    lrs: null,
    pdm: null,
    eai: null,
    initialized: false,
    learningLevel: 2, // Default to Middle level
    onboardingCompleted: false,
    monitoringEnabled: false
};

chrome.runtime.onInstalled.addListener(async () => {
    console.log('Aniota Extension installed');
    
    // Initialize extension settings
    await initializeExtension();
    
    // Initialize Aniota cognitive modules
    await initializeAniotaSystem();
});

// Initialize extension settings and storage
async function initializeExtension() {
    // Set up initial storage structure
    await chrome.storage.sync.set({
        aniotaEnabled: true,
        learningLevel: 2,
        onboardingCompleted: false,
        userProfile: {
            created: new Date().toISOString(),
            sessionCount: 0
        }
    });
    
    await chrome.storage.local.set({
        sessionId: generateSessionId(),
        learningMoments: [],
        behavioralMetrics: {
            typingSpeed: 0,
            clickAccuracy: 0,
            responseTime: 0
        },
        currentSession: {
            startTime: new Date().toISOString(),
            interactions: []
        }
    });
    
    console.log('Aniota extension storage initialized');
}

// Simplified LRS implementation for service worker context
class SimpleLRS {
    constructor() {
        this.LEARNING_LEVELS = {
            0: "Primary",
            1: "Middle", 
            2: "Secondary",
            3: "PostSecondary",
            4: "Adult"
        };
        this.DEFAULT_LEVEL = 2;
    }
    
    async initialize() {
        console.log('LRS module initialized (simplified)');
        return true;
    }
    
    async assess_learning_level(behavioralData, interactionHistory, onboardingResponses) {
        try {
            let levelScores = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0};
            
            // Simple analysis based on onboarding responses
            if (onboardingResponses && onboardingResponses.answers) {
                for (const response of onboardingResponses.answers) {
                    const responseLower = response.toLowerCase();
                    
                    // Primary indicators
                    if (/reading|math|art|pe|music/.test(responseLower)) {
                        levelScores[0] += 0.3;
                        levelScores[1] += 0.2;
                    }
                    
                    // Middle school indicators
                    if (/science|history|social studies|language arts/.test(responseLower)) {
                        levelScores[1] += 0.4;
                        levelScores[2] += 0.2;
                    }
                    
                    // High school indicators
                    if (/biology|chemistry|physics|calculus|literature/.test(responseLower)) {
                        levelScores[2] += 0.4;
                        levelScores[3] += 0.2;
                    }
                    
                    // College indicators
                    if (/major|degree|university|college|research/.test(responseLower)) {
                        levelScores[3] += 0.4;
                        levelScores[4] += 0.2;
                    }
                }
            }
            
            // Find the level with highest score
            const assessedLevel = Object.keys(levelScores).reduce((a, b) => 
                levelScores[a] > levelScores[b] ? a : b
            );
            
            // Convert to number and apply confidence check
            const level = parseInt(assessedLevel);
            return level >= 0 && level <= 4 ? level : this.DEFAULT_LEVEL;
            
        } catch (error) {
            console.error('Error in learning level assessment:', error);
            return this.DEFAULT_LEVEL;
        }
    }
    
    async store_learning_data(type, data) {
        try {
            const timestamp = new Date().toISOString();
            const storage = await chrome.storage.local.get(['learningData']);
            const learningData = storage.learningData || [];
            
            learningData.push({
                type,
                data,
                timestamp
            });
            
            await chrome.storage.local.set({ learningData });
            console.log(`Stored learning data: ${type}`);
            return true;
        } catch (error) {
            console.error('Error storing learning data:', error);
            return false;
        }
    }
}

// Simple CAF initialization
async function initializeCAF() {
    console.log('CAF module initialized (simplified)');
    return {
        initialized: true,
        version: '1.0.0'
    };
}

// Initialize the Aniota cognitive system
async function initializeAniotaSystem() {
    try {
        console.log('Initializing Aniota cognitive system...');
        
        // Initialize core modules in dependency order
        aniotaSystem.caf = await initializeCAF();
        aniotaSystem.lrs = new SimpleLRS();
        
        // Initialize LRS module
        const lrsInitialized = await aniotaSystem.lrs.initialize();
        if (!lrsInitialized) {
            throw new Error('Failed to initialize LRS module');
        }
        
        // Check if onboarding is needed
        const storage = await chrome.storage.sync.get(['onboardingCompleted', 'learningLevel', 'userMonitoring']);
        
        if (!storage.onboardingCompleted) {
            console.log('Onboarding required - scheduling onboarding flow');
            scheduleOnboarding();
        } else {
            aniotaSystem.learningLevel = storage.learningLevel || 2;
            aniotaSystem.onboardingCompleted = true;
        }
        
        // Initialize monitoring state
        aniotaSystem.monitoringEnabled = storage.userMonitoring || false;
        
        aniotaSystem.initialized = true;
        console.log('Aniota cognitive system initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize Aniota system:', error);
        // Fall back to basic functionality
        aniotaSystem.initialized = false;
    }
}

// Schedule onboarding for new users
function scheduleOnboarding() {
    // Create notification for onboarding
    chrome.action.setBadgeText({text: '!'});
    chrome.action.setBadgeBackgroundColor({color: '#4CAF50'});
    
    // Set up onboarding state
    chrome.storage.sync.set({
        onboardingPending: true,
        onboardingStarted: false
    });
}

// Generate unique session ID
function generateSessionId() {
    return 'aniota_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'openLauncher':
            openAniotaLauncher();
            sendResponse({success: true});
            break;
            
        case 'startOnboarding':
            handleStartOnboarding(sendResponse);
            return true; // Keep message channel open for async response
            
        case 'submitOnboardingResponse':
            handleOnboardingResponse(request.data, sendResponse);
            return true;
            
        case 'completeOnboarding':
            handleCompleteOnboarding(request.data, sendResponse);
            return true;
            
        case 'logUserEvent':
            handleUserEventLog(request.data);
            sendResponse({success: true});
            break;
            
        case 'logBehavioralMetric':
            handleBehavioralMetricLog(request.data);
            sendResponse({success: true});
            break;
            
        case 'requestQuestion':
            handleQuestionRequest(request.data, sendResponse);
            return true;
            
        case 'submitAnswer':
            handleAnswerSubmission(request.data, sendResponse);
            return true;
            
        case 'requestHint':
            handleHintRequest(request.data, sendResponse);
            return true;
            
        case 'getLearningProfile':
            handleGetLearningProfile(sendResponse);
            return true;
            
        case 'updateLearningChoice':
            handleLearningChoice(request.data, sendResponse);
            return true;
            
        case 'getLearningMoments':
            getLearningMoments(sendResponse);
            return true;
            
        case 'toggleMonitoring':
            handleToggleMonitoring(request.enabled);
            sendResponse({success: true});
            break;
            
        default:
            console.log('Unknown action:', request.action);
            sendResponse({error: 'Unknown action'});
    }
});

// Handle onboarding start
async function handleStartOnboarding(sendResponse) {
    try {
        if (!aniotaSystem.initialized || !aniotaSystem.lrs) {
            throw new Error('Aniota system not initialized');
        }
        
        const onboardingData = await aniotaSystem.lrs.conduct_onboarding();
        
        // Update badge to show onboarding in progress
        chrome.action.setBadgeText({text: '1'});
        chrome.action.setBadgeBackgroundColor({color: '#2196F3'});
        
        sendResponse({
            success: true,
            data: onboardingData
        });
        
    } catch (error) {
        console.error('Error starting onboarding:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Handle onboarding response submission
async function handleOnboardingResponse(responseData, sendResponse) {
    try {
        const { questionIndex, response, allResponses } = responseData;
        
        // Store response in local storage
        const currentOnboarding = await chrome.storage.local.get(['onboardingResponses']) || {};
        const responses = currentOnboarding.onboardingResponses || [];
        responses[questionIndex] = response;
        
        await chrome.storage.local.set({
            onboardingResponses: responses
        });
        
        // Update badge to show progress
        chrome.action.setBadgeText({text: (questionIndex + 2).toString()});
        
        sendResponse({
            success: true,
            nextQuestion: questionIndex + 1 < 3 ? questionIndex + 1 : null
        });
        
    } catch (error) {
        console.error('Error handling onboarding response:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Handle onboarding completion
async function handleCompleteOnboarding(onboardingData, sendResponse) {
    try {
        if (!aniotaSystem.lrs) {
            throw new Error('LRS module not available');
        }
        
        // Use the onboarding data passed from the launcher
        const responses = onboardingData.answers || [];
        const fullResponses = onboardingData.responses || [];
        
        // Assess learning level based on responses
        const assessmentData = {
            answers: responses,
            completed: true,
            timestamp: onboardingData.completedAt || new Date().toISOString()
        };
        
        const learningLevel = await aniotaSystem.lrs.assess_learning_level(
            {}, // No behavioral data yet
            [], // No interaction history yet
            assessmentData
        );
        
        // Store results
        await chrome.storage.sync.set({
            onboardingCompleted: true,
            learningLevel: learningLevel,
            onboardingResponses: onboardingData,
            onboardingTimestamp: new Date().toISOString()
        });
        
        // Update system state
        aniotaSystem.learningLevel = learningLevel;
        aniotaSystem.onboardingCompleted = true;
        
        // Clear badge
        chrome.action.setBadgeText({text: ''});
        
        // Store learning level data
        await aniotaSystem.lrs.store_learning_data('onboarding_completion', {
            learningLevel: learningLevel,
            responses: fullResponses,
            timestamp: new Date().toISOString()
        });
        
        sendResponse({
            success: true,
            learningLevel: learningLevel,
            levelName: aniotaSystem.lrs.LEARNING_LEVELS[learningLevel]
        });
        
    } catch (error) {
        console.error('Error completing onboarding:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Handle user event logging for behavioral analysis
async function handleUserEventLog(eventData) {
    try {
        // Store event in local storage
        const storage = await chrome.storage.local.get(['learningMoments']);
        const learningMoments = storage.learningMoments || [];
        
        const event = {
            ...eventData,
            timestamp: new Date().toISOString(),
            sessionId: await getSessionId()
        };
        
        learningMoments.push(event);
        
        // Keep only recent events (last 1000)
        if (learningMoments.length > 1000) {
            learningMoments.splice(0, learningMoments.length - 1000);
        }
        
        await chrome.storage.local.set({learningMoments});
        
        // If LRS is available, process for learning insights
        if (aniotaSystem.lrs && aniotaSystem.initialized) {
            aniotaSystem.lrs._record_learning_moment(event);
        }
        
    } catch (error) {
        console.error('Error logging user event:', error);
    }
}

// Handle behavioral metric logging
async function handleBehavioralMetricLog(metricData) {
    try {
        const storage = await chrome.storage.local.get(['behavioralMetrics']);
        const currentMetrics = storage.behavioralMetrics || {};
        
        // Update metrics with new data
        Object.assign(currentMetrics, {
            ...metricData,
            lastUpdated: new Date().toISOString()
        });
        
        await chrome.storage.local.set({behavioralMetrics: currentMetrics});
        
        // If LRS is available, update readiness profile
        if (aniotaSystem.lrs && aniotaSystem.onboardingCompleted) {
            await aniotaSystem.lrs.update_readiness_profile(metricData, {});
        }
        
    } catch (error) {
        console.error('Error logging behavioral metric:', error);
    }
}

// Handle question requests
async function handleQuestionRequest(requestData, sendResponse) {
    try {
        if (!aniotaSystem.lrs) {
            throw new Error('LRS module not available');
        }
        
        const { topic, context } = requestData;
        
        // Get current learning level and progress map
        const learningLevel = aniotaSystem.learningLevel;
        const progressMap = aniotaSystem.lrs.progress_map_4d;
        
        // Request AI-generated question through LRS
        const questionData = await aniotaSystem.lrs.request_ai_question(
            learningLevel,
            topic,
            { ...context, progressMap }
        );
        
        sendResponse({
            success: true,
            data: questionData
        });
        
    } catch (error) {
        console.error('Error requesting question:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Handle answer submissions
async function handleAnswerSubmission(submissionData, sendResponse) {
    try {
        if (!aniotaSystem.lrs) {
            throw new Error('LRS module not available');
        }
        
        const { answer, questionData, responseTime } = submissionData;
        
        // Process learner response through LRS
        const responseEvaluation = await aniotaSystem.lrs.process_learner_response(
            answer,
            questionData.difficulty || aniotaSystem.learningLevel,
            questionData.topic || 'general'
        );
        
        // Log behavioral metrics
        await handleBehavioralMetricLog({
            responseTime: responseTime,
            questionDifficulty: questionData.difficulty,
            answerLength: answer.length,
            timestamp: new Date().toISOString()
        });
        
        sendResponse({
            success: true,
            evaluation: responseEvaluation
        });
        
    } catch (error) {
        console.error('Error processing answer submission:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Handle hint requests
async function handleHintRequest(requestData, sendResponse) {
    try {
        if (!aniotaSystem.lrs) {
            throw new Error('LRS module not available');
        }
        
        const { questionData, strugglingIndicators } = requestData;
        
        // Generate scaffolding strategy
        const scaffoldingStrategy = await aniotaSystem.lrs.generate_scaffolding_strategy(
            aniotaSystem.learningLevel,
            questionData.topic || 'general',
            aniotaSystem.lrs.progress_map_4d
        );
        
        // Create hint based on scaffolding strategy
        const hint = {
            text: scaffoldingStrategy.hint_frequency === 'high' 
                ? "Let's break this down step by step. What do you know about this topic already?"
                : "Think about the main concepts we've discussed. How might they apply here?",
            type: scaffoldingStrategy.hint_frequency,
            level: aniotaSystem.learningLevel
        };
        
        sendResponse({
            success: true,
            hint: hint,
            scaffolding: scaffoldingStrategy
        });
        
    } catch (error) {
        console.error('Error generating hint:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Handle learning profile requests
async function handleGetLearningProfile(sendResponse) {
    try {
        const syncStorage = await chrome.storage.sync.get([
            'learningLevel', 'onboardingCompleted', 'onboardingResponses'
        ]);
        
        const localStorage = await chrome.storage.local.get([
            'behavioralMetrics', 'learningMoments'
        ]);
        
        let progressData = {};
        if (aniotaSystem.lrs) {
            progressData = {
                readinessProfile: await aniotaSystem.lrs._calculate_confidence(),
                progressHistory: aniotaSystem.lrs.progress_history,
                currentLevel: aniotaSystem.lrs.learning_level,
                levelName: aniotaSystem.lrs.LEARNING_LEVELS[aniotaSystem.lrs.learning_level]
            };
        }
        
        sendResponse({
            success: true,
            profile: {
                ...syncStorage,
                ...localStorage,
                ...progressData,
                systemStatus: {
                    initialized: aniotaSystem.initialized,
                    timestamp: new Date().toISOString()
                }
            }
        });
        
    } catch (error) {
        console.error('Error getting learning profile:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Handle learning choice updates (Extend/Expand/Explore)
async function handleLearningChoice(choiceData, sendResponse) {
    try {
        if (!aniotaSystem.lrs) {
            throw new Error('LRS module not available');
        }
        
        // Track choice pattern
        const storage = await chrome.storage.local.get(['learningChoices']);
        const choices = storage.learningChoices || {extend: 0, expand: 0, explore: 0};
        
        choices[choiceData.choice] = (choices[choiceData.choice] || 0) + 1;
        await chrome.storage.local.set({learningChoices: choices});
        
        // Update readiness profile based on choice patterns
        await aniotaSystem.lrs.update_readiness_profile(
            choiceData.performanceMetrics || {},
            choices
        );
        
        sendResponse({
            success: true,
            choicePattern: choices
        });
        
    } catch (error) {
        console.error('Error handling learning choice:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}
    // Implements privacy-compliant session-bound logging
// Open Aniota launcher popup
function openAniotaLauncher() {
    chrome.action.openPopup();
}

// Get learning moments for display
async function getLearningMoments(sendResponse) {
    try {
        const storage = await chrome.storage.local.get(['learningMoments']);
        sendResponse({
            success: true,
            data: storage.learningMoments || []
        });
    } catch (error) {
        console.error('Error getting learning moments:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Helper function to get session ID
async function getSessionId() {
    try {
        const storage = await chrome.storage.local.get(['sessionId']);
        return storage.sessionId || generateSessionId();
    } catch (error) {
        return generateSessionId();
    }
}

// Keyboard shortcuts handler (only if commands API is available)
if (chrome.commands && chrome.commands.onCommand) {
    chrome.commands.onCommand.addListener((command) => {
        switch (command) {
            case 'toggle-aniota':
                chrome.action.openPopup();
                break;
            case 'toggle-monitoring':
                toggleUserMonitoring();
                break;
        }
    });
}

// Toggle user monitoring on/off
async function toggleUserMonitoring() {
    try {
        const storage = await chrome.storage.local.get(['userMonitoring']);
        const newState = !storage.userMonitoring;
        
        await chrome.storage.local.set({ userMonitoring: newState });

        // Notify all tabs about monitoring state change
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
            try {
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'monitoringStateChanged',
                    enabled: newState
                });
            } catch (error) {
                // Tab may not be ready for messages, continue with others
                console.log(`Could not notify tab ${tab.id}:`, error.message);
            }
        }
    } catch (error) {
        console.error('Error toggling user monitoring:', error);
    }
}

// Handle monitoring toggle
async function handleToggleMonitoring(enabled) {
    try {
        // Update storage
        await chrome.storage.local.set({ userMonitoring: enabled });
        
        // Update system state
        aniotaSystem.monitoringEnabled = enabled;
        
        // Update badge to reflect monitoring state
        if (enabled) {
            chrome.action.setBadgeText({text: '●'});
            chrome.action.setBadgeBackgroundColor({color: '#4CAF50'});
        } else {
            chrome.action.setBadgeText({text: ''});
        }
        
        console.log(`User monitoring ${enabled ? 'enabled' : 'disabled'}`);
        
    } catch (error) {
        console.error('Error toggling monitoring:', error);
    }
}

// Error handling for unhandled promise rejections
self.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection in Aniota background:', event.reason);
    event.preventDefault();
});

// Cleanup on extension shutdown
chrome.runtime.onSuspend?.addListener(() => {
    console.log('Aniota background script suspending...');
    // Perform any necessary cleanup
});

console.log('Aniota background script loaded successfully');
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

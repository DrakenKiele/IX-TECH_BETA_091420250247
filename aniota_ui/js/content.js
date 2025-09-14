
let aniotaMonitoring = false;
let sessionEvents = [];
let currentCursor = null;

(function initializeAniota() {
    console.log('Aniota content script loaded');

    // Check monitoring state
    chrome.runtime.sendMessage({ action: 'getMonitoringState' });

    // Setup event listeners
    setupEventListeners();

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(handleMessage);
})();

function handleMessage(request, sender, sendResponse) {
    switch (request.action) {
        case 'monitoringStateChanged':
            aniotaMonitoring = request.enabled;
            updateMonitoringIndicator(request.enabled);
            break;
        case 'getPageContent':
            sendResponse(getPageContent());
            break;
        case 'enableTeacherCursor':
            setAniotaCursor();
            break;
        case 'disableTeacherCursor':
            restoreDefaultCursor();
            break;
    }
}

// Set custom Aniota cursor
function setAniotaCursor() {
    const cursorUrl = chrome.runtime.getURL('assets/aniota-cursor.svg');
    document.body.style.cursor = `url(${cursorUrl}), auto`;
    currentCursor = cursorUrl;
}

// Restore default cursor
function restoreDefaultCursor() {
    document.body.style.cursor = 'auto';
    currentCursor = null;
}

// Setup event listeners for user interaction monitoring
function setupEventListeners() {
    // Mouse events
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });

    // Keyboard events
    document.addEventListener('keydown', handleKeyDown, { passive: true });
    document.addEventListener('keyup', handleKeyUp, { passive: true });

    // Clipboard events
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);

    // Input events
    document.addEventListener('input', handleInput, { passive: true });

    // Focus events
    window.addEventListener('focus', handleWindowFocus, { passive: true });
    window.addEventListener('blur', handleWindowBlur, { passive: true });
}

// Mouse movement handler
function handleMouseMove(event) {
    if (!aniotaMonitoring) return;

    logUserEvent({
        type: 'mousemove',
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now()
    });
}

// Click handler
function handleClick(event) {
    if (!aniotaMonitoring) return;

    const elementInfo = getElementInfo(event.target);
    logUserEvent({
        type: 'click',
        x: event.clientX,
        y: event.clientY,
        element: elementInfo,
        timestamp: Date.now()
    });
}

// Scroll handler
function handleScroll(event) {
    if (!aniotaMonitoring) return;

    logUserEvent({
        type: 'scroll',
        scrollY: window.scrollY,
        scrollX: window.scrollX,
        timestamp: Date.now()
    });
}

// Keyboard handlers
function handleKeyDown(event) {
    if (!aniotaMonitoring) return;

    logUserEvent({
        type: 'keydown',
        key: event.key,
        code: event.code,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        timestamp: Date.now()
    });
}

function handleKeyUp(event) {
    if (!aniotaMonitoring) return;

    logUserEvent({
        type: 'keyup',
        key: event.key,
        code: event.code,
        timestamp: Date.now()
    });
}

// Clipboard event handlers
function handleCopy(event) {
    if (!aniotaMonitoring) return;

    const selectedText = window.getSelection().toString();
    const topicInference = inferTopicFromText(selectedText);

    logUserEvent({
        type: 'copy',
        textLength: selectedText.length,
        inferredTopic: topicInference,
        timestamp: Date.now()
    });
}

function handlePaste(event) {
    if (!aniotaMonitoring) return;

    logUserEvent({
        type: 'paste',
        target: getElementInfo(event.target),
        timestamp: Date.now()
    });
}

function handleCut(event) {
    if (!aniotaMonitoring) return;

    logUserEvent({
        type: 'cut',
        target: getElementInfo(event.target),
        timestamp: Date.now()
    });
}

// Input handler
function handleInput(event) {
    if (!aniotaMonitoring) return;

    logUserEvent({
        type: 'input',
        inputType: event.inputType,
        target: getElementInfo(event.target),
        timestamp: Date.now()
    });
}

// Window focus handlers
function handleWindowFocus(event) {
    if (!aniotaMonitoring) return;

    logUserEvent({
        type: 'window_focus',
        url: window.location.href,
        timestamp: Date.now()
    });
}

function handleWindowBlur(event) {
    if (!aniotaMonitoring) return;

    logUserEvent({
        type: 'window_blur',
        url: window.location.href,
        timestamp: Date.now()
    });
}

// Get element information for logging
function getElementInfo(element) {
    return {
        tagName: element.tagName,
        className: element.className,
        id: element.id,
        textContent: element.textContent?.substring(0, 100) // Limit text for privacy
    };
}

// Infer topic from copied text
function inferTopicFromText(text) {
    if (!text || text.length < 10) return 'short_text';

    // Simple topic inference based on keywords
    const lowerText = text.toLowerCase();

    if (lowerText.includes('question') || lowerText.includes('?')) return 'question';
    if (lowerText.includes('code') || lowerText.includes('function')) return 'programming';
    if (lowerText.includes('learn') || lowerText.includes('study')) return 'learning';
    if (lowerText.includes('error') || lowerText.includes('problem')) return 'troubleshooting';

    return 'general';
}

// Log user event to background script
function logUserEvent(eventData) {
    // Add to session events (temporary storage)
    sessionEvents.push(eventData);

    // Send to background for processing
    chrome.runtime.sendMessage({
        action: 'logUserEvent',
        data: eventData
    });

    // Maintain event buffer (keep only recent events)
    if (sessionEvents.length > 1000) {
        sessionEvents = sessionEvents.slice(-500); // Keep last 500 events
    }
}

// Update monitoring indicator
function updateMonitoringIndicator(enabled) {
    const indicator = document.getElementById('aniota-monitoring-indicator');
    if (indicator) {
        indicator.textContent = enabled ? '● Monitoring' : '○ Paused';
        indicator.style.color = enabled ? '#2E8B57' : '#888';
    } else if (enabled) {
        createMonitoringIndicator();
    }
}

// Create monitoring indicator
function createMonitoringIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'aniota-monitoring-indicator';
    indicator.textContent = '● Monitoring';
    indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: #2E8B57;
        padding: 5px 10px;
        border-radius: 5px;
        font-family: 'Noto Sans Rounded', sans-serif;
        font-size: 12px;
        z-index: 10000;
        pointer-events: none;
    `;
    document.body.appendChild(indicator);
}

// Get page content for analysis
function getPageContent() {
    return {
        url: window.location.href,
        title: document.title,
        textContent: document.body.textContent?.substring(0, 5000), // Limit for privacy
        timestamp: Date.now()
    };
}
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

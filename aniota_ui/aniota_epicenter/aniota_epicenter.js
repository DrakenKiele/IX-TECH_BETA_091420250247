
document.addEventListener('DOMContentLoaded', initializeEpicenter);

let currentTab = 'dashboard';
let monitoringEnabled = false;
let sessionData = {
    startTime: Date.now(),
    eventsCount: 0,
    patternsDetected: 0,
    learningMoments: []
};

function initializeEpicenter() {
    console.log('Aniota Epicenter initialized');

    // Setup event listeners
    setupEventListeners();

    // Load initial data
    loadInitialData();

    // Update UI
    updateSessionDisplay();

    // Start session timer
    startSessionTimer();

    // Log epicenter access
    logUserAction('epicenter_access');
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => switchTab(e.target.id.replace('-tab', '')));
    });

    // Monitoring toggle
    document.getElementById('toggle-monitoring')?.addEventListener('click', toggleMonitoring);

    // Quick actions
    document.getElementById('start-learning')?.addEventListener('click', startLearningSession);
    document.getElementById('view-insights')?.addEventListener('click', () => switchTab('insights'));
    document.getElementById('export-data')?.addEventListener('click', exportData);
    document.getElementById('clear-session')?.addEventListener('click', clearSession);

    // Learning controls
    document.getElementById('new-session')?.addEventListener('click', newLearningSession);
    document.getElementById('pause-session')?.addEventListener('click', pauseLearningSession);
    document.getElementById('end-session')?.addEventListener('click', endLearningSession);

    // Settings controls
    document.getElementById('save-settings')?.addEventListener('click', saveSettings);
    document.getElementById('reset-settings')?.addEventListener('click', resetSettings);

    // Settings inputs
    document.getElementById('heartbeat-rate')?.addEventListener('input', updateHeartbeatRate);
    document.getElementById('pattern-sensitivity')?.addEventListener('input', updatePatternSensitivity);
    document.getElementById('enable-monitoring')?.addEventListener('change', toggleMonitoringFromSettings);
}

async function loadInitialData() {
    try {
        // Load settings from localStorage/sessionStorage
        const monitoring = localStorage.getItem('userMonitoring');
        const sessionId = sessionStorage.getItem('sessionId');
        const learningMoments = sessionStorage.getItem('learningMoments');
        const heartbeatRate = localStorage.getItem('heartbeatRate');
        const patternSensitivity = localStorage.getItem('patternSensitivity');

        monitoringEnabled = monitoring === 'true';
        sessionData.learningMoments = learningMoments ? JSON.parse(learningMoments) : [];

        // Update session ID display
        document.getElementById('session-id').textContent = sessionId || 'N/A';

        // Update settings UI
        document.getElementById('enable-monitoring').checked = monitoringEnabled;
        document.getElementById('heartbeat-rate').value = heartbeatRate || 800;
        document.getElementById('pattern-sensitivity').value = patternSensitivity || 5;

        updateMonitoringDisplay();
        updateLearningMomentsDisplay();

    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.id === `${tabName}-tab`);
    });

    // Update content sections
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-content`);
    });

    currentTab = tabName;
    logUserAction('tab_switch', { tab: tabName });

    // Initialize tab-specific features
    if (tabName === 'insights') {
        initializeInsightsCharts();
    }
}

async function toggleMonitoring() {
    try {
        monitoringEnabled = !monitoringEnabled;

        // Update storage
        localStorage.setItem('userMonitoring', monitoringEnabled);

        updateMonitoringDisplay();
        logUserAction('monitoring_toggled', { enabled: monitoringEnabled });

    } catch (error) {
        console.error('Error toggling monitoring:', error);
    }
}

function updateMonitoringDisplay() {
    const indicator = document.getElementById('monitoring-indicator');
    const toggleBtn = document.getElementById('toggle-monitoring');

    if (indicator && toggleBtn) {
        if (monitoringEnabled) {
            indicator.className = 'monitoring-indicator on';
            indicator.querySelector('.indicator-text').textContent = 'Monitoring On';
            toggleBtn.textContent = 'Pause';
            toggleBtn.className = 'toggle-btn active';
        } else {
            indicator.className = 'monitoring-indicator off';
            indicator.querySelector('.indicator-text').textContent = 'Monitoring Off';
            toggleBtn.textContent = 'Start';
            toggleBtn.className = 'toggle-btn inactive';
        }
    }
}

function startLearningSession() {
    console.log('Starting learning session');
    logUserAction('learning_session_start');

    // Switch to learning tab
    switchTab('learning');

    // Enable monitoring if not already enabled
    if (!monitoringEnabled) {
        toggleMonitoring();
    }
}

function newLearningSession() {
    logUserAction('new_learning_session');
    // Implementation for new learning session
}

function pauseLearningSession() {
    logUserAction('pause_learning_session');
    // Implementation for pausing session
}

function endLearningSession() {
    logUserAction('end_learning_session');
    // Implementation for ending session
}

function exportData() {
    console.log('Exporting session data');

    const exportData = {
        sessionId: document.getElementById('session-id').textContent,
        timestamp: new Date().toISOString(),
        sessionData: sessionData,
        learningMoments: sessionData.learningMoments
    };

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aniota-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    logUserAction('data_exported');
}

function clearSession() {
    if (confirm('Are you sure you want to clear all session data? This cannot be undone.')) {
        sessionData = {
            startTime: Date.now(),
            eventsCount: 0,
            patternsDetected: 0,
            learningMoments: []
        };

        // Clear storage
        sessionStorage.clear();
        localStorage.setItem('learningMoments', JSON.stringify([]));

        updateSessionDisplay();
        updateLearningMomentsDisplay();

        logUserAction('session_cleared');
        console.log('Session data cleared');
    }
}

function updateSessionDisplay() {
    // Update statistics
    document.getElementById('events-count').textContent = sessionData.eventsCount;
    document.getElementById('patterns-detected').textContent = sessionData.patternsDetected;

    // Update session timer (this will be called periodically)
    const sessionTime = Math.floor((Date.now() - sessionData.startTime) / 1000);
    const minutes = Math.floor(sessionTime / 60);
    const seconds = sessionTime % 60;
    document.getElementById('session-time').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateLearningMomentsDisplay() {
    const momentsList = document.getElementById('learning-moments-list');
    if (!momentsList) return;

    if (sessionData.learningMoments.length === 0) {
        momentsList.innerHTML = '<p class="placeholder">No learning moments recorded yet.</p>';
    } else {
        momentsList.innerHTML = sessionData.learningMoments
            .map(moment => `
                <div class="moment-item">
                    <span class="moment-time">${new Date(moment.timestamp).toLocaleTimeString()}</span>
                    <span class="moment-description">${moment.description}</span>
                </div>
            `).join('');
    }
}

function startSessionTimer() {
    setInterval(updateSessionDisplay, 1000);
}

function initializeInsightsCharts() {
    // Initialize pattern recognition chart
    const patternCanvas = document.getElementById('patterns-canvas');
    if (patternCanvas) {
        const ctx = patternCanvas.getContext('2d');

        // Simple visualization of pattern data
        ctx.clearRect(0, 0, 300, 200);
        ctx.strokeStyle = '#2E8B57';
        ctx.lineWidth = 2;

        // Draw sample pattern line
        ctx.beginPath();
        ctx.moveTo(0, 100);
        for (let i = 0; i < 300; i += 10) {
            const y = 100 + Math.sin(i / 30) * 30 + Math.random() * 20 - 10;
            ctx.lineTo(i, y);
        }
        ctx.stroke();
    }
}

function saveSettings() {
    const heartbeatRate = document.getElementById('heartbeat-rate').value;
    const patternSensitivity = document.getElementById('pattern-sensitivity').value;
    const userMonitoring = document.getElementById('enable-monitoring').checked;

    localStorage.setItem('heartbeatRate', heartbeatRate);
    localStorage.setItem('patternSensitivity', patternSensitivity);
    localStorage.setItem('userMonitoring', userMonitoring);
    logUserAction('settings_saved', { heartbeatRate, patternSensitivity, userMonitoring });

    // Show confirmation
    const saveBtn = document.getElementById('save-settings');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    setTimeout(() => {
        saveBtn.textContent = originalText;
    }, 2000);
}

function resetSettings() {
    document.getElementById('heartbeat-rate').value = 800;
    document.getElementById('pattern-sensitivity').value = 5;
    document.getElementById('enable-monitoring').checked = false;

    updateHeartbeatRate();
    updatePatternSensitivity();

    logUserAction('settings_reset');
}

function updateHeartbeatRate() {
    const value = document.getElementById('heartbeat-rate').value;
    document.getElementById('heartbeat-value').textContent = `${value}ms`;
}

function updatePatternSensitivity() {
    const value = document.getElementById('pattern-sensitivity').value;
    document.getElementById('sensitivity-value').textContent = value;
}

function toggleMonitoringFromSettings() {
    const enabled = document.getElementById('enable-monitoring').checked;
    if (enabled !== monitoringEnabled) {
        toggleMonitoring();
    }
}

function logUserAction(action, data = {}) {
    const actionData = {
        action,
        timestamp: Date.now(),
        context: 'epicenter',
        currentTab,
        ...data
    };

    // Log to sessionStorage (append to a session log array)
    let log = [];
    try {
        log = JSON.parse(sessionStorage.getItem('aniotaSessionLog')) || [];
    } catch (e) {}
    log.push(actionData);
    sessionStorage.setItem('aniotaSessionLog', JSON.stringify(log));

    // Update local session data
    sessionData.eventsCount++;

    console.log('User action logged:', actionData);
}

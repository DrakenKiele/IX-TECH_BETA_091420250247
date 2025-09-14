
document.addEventListener('DOMContentLoaded', initializePage);

function initializePage() {
    console.log('License page initialized');
    setupEventListeners();
    logUserAction('license_view');
}

function setupEventListeners() {
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            logUserAction('back_button_clicked');
        });
    }
}

function logUserAction(action, data = {}) {
    const actionData = {
        action,
        timestamp: Date.now(),
        context: 'license',
        ...data
    };

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({
            action: 'logUserEvent',
            data: actionData
        });
    }

    console.log('User action logged:', actionData);
}

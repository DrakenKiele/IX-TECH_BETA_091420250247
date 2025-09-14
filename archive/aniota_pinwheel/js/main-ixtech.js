
console.log('ANIOTA IX-TECH: Main script loading...');

let deferredPrompt;
let installButton;
let installPrompt;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('ANIOTA Service Worker: Registered successfully', registration.scope);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('ANIOTA Service Worker: New version available');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateAvailable();
          }
        });
      });
      
    } catch (error) {
      console.error('ANIOTA Service Worker: Registration failed', error);
    }
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('ANIOTA PWA: Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  showInstallPrompt();
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('ANIOTA IX-TECH: DOM ready, initializing...');
  
  initializePWA();
  initializeNavigation();
  initializeUserSession();
  initializeLearningTracking();
});

// PWA Initialization
function initializePWA() {
  installButton = document.getElementById('installButton');
  installPrompt = document.getElementById('installPrompt');
  
  if (installButton) {
    installButton.addEventListener('click', handleInstallClick);
  }
  
  const dismissButton = document.getElementById('dismissInstall');
  if (dismissButton) {
    dismissButton.addEventListener('click', hideInstallPrompt);
  }
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    console.log('ANIOTA PWA: Running as installed app');
    hideInstallPrompt();
  }
}

// Show install prompt
function showInstallPrompt() {
  if (installPrompt && !isAppInstalled()) {
    installPrompt.style.display = 'block';
  }
}

// Hide install prompt
function hideInstallPrompt() {
  if (installPrompt) {
    installPrompt.style.display = 'none';
  }
}

// Handle install button click
async function handleInstallClick() {
  if (!deferredPrompt) {
    console.log('ANIOTA PWA: No install prompt available');
    return;
  }
  
  try {
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    
    console.log('ANIOTA PWA: Install prompt result:', result.outcome);
    
    if (result.outcome === 'accepted') {
      console.log('ANIOTA PWA: User accepted install');
      hideInstallPrompt();
    }
    
    deferredPrompt = null;
  } catch (error) {
    console.error('ANIOTA PWA: Install error:', error);
  }
}

// Check if app is installed
function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true ||
         localStorage.getItem('aniota-install-dismissed') === 'true';
}

// Show update available notification
function showUpdateAvailable() {
  const updateBanner = document.createElement('div');
  updateBanner.className = 'update-banner';
  updateBanner.innerHTML = `
    <div class="update-content">
      <span>🔄 New version available!</span>
      <button onclick="reloadForUpdate()" class="update-button">Reload</button>
      <button onclick="dismissUpdate(this)" class="dismiss-button">Later</button>
    </div>
  `;
  
  document.body.insertBefore(updateBanner, document.body.firstChild);
}

// Reload for update
function reloadForUpdate() {
  window.location.reload();
}

// Dismiss update
function dismissUpdate(button) {
  button.closest('.update-banner').remove();
}

// Navigation System
function initializeNavigation() {
  // Handle back/forward navigation
  window.addEventListener('popstate', handleNavigation);
  
  // Enhance navigation links
  const navLinks = document.querySelectorAll('a[href^="CHRYSALIX/"], a[href^="/CHRYSALIX/"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      console.log('ANIOTA Navigation: Navigating to', href);
      
      // Track navigation for learning analytics
      trackLearningMoment('navigation', {
        from: window.location.pathname,
        to: href,
        timestamp: Date.now()
      });
    });
  });
}

// Handle navigation events
function handleNavigation(event) {
  console.log('ANIOTA Navigation: State changed', event.state);
  // Handle navigation state changes if needed
}

// User Session Management
function initializeUserSession() {
  // Check for existing session
  const sessionId = getSessionId();
  console.log('ANIOTA Session: ID', sessionId);
  
  // Initialize user preferences
  loadUserPreferences();
  
  // Set up session heartbeat
  setInterval(updateSessionHeartbeat, 30000); // 30 seconds
}

// Get or create session ID
function getSessionId() {
  let sessionId = sessionStorage.getItem('aniota-session-id');
  if (!sessionId) {
    sessionId = 'aniota-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('aniota-session-id', sessionId);
    sessionStorage.setItem('aniota-session-start', Date.now());
  }
  return sessionId;
}

// Load user preferences
function loadUserPreferences() {
  const preferences = localStorage.getItem('aniota-preferences');
  if (preferences) {
    try {
      const prefs = JSON.parse(preferences);
      console.log('ANIOTA Preferences: Loaded', prefs);
      applyUserPreferences(prefs);
    } catch (error) {
      console.error('ANIOTA Preferences: Load error', error);
    }
  }
}

// Apply user preferences
function applyUserPreferences(preferences) {
  // Apply theme, accessibility settings, etc.
  if (preferences.theme) {
    document.body.classList.add(`theme-${preferences.theme}`);
  }
  
  if (preferences.accessibility) {
    document.body.classList.add('accessibility-mode');
  }
}

// Update session heartbeat
function updateSessionHeartbeat() {
  sessionStorage.setItem('aniota-session-heartbeat', Date.now());
}

// Learning Tracking System
function initializeLearningTracking() {
  console.log('ANIOTA Learning: Tracking initialized');
  
  // Track page view
  trackLearningMoment('page_view', {
    url: window.location.pathname,
    timestamp: Date.now(),
    session_id: getSessionId()
  });
  
  // Track user interactions
  document.addEventListener('click', trackUserInteraction);
  document.addEventListener('keydown', trackKeyboardInteraction);
}

// Track learning moments (privacy-first, session-only)
function trackLearningMoment(type, data) {
  const moment = {
    type,
    data,
    timestamp: Date.now(),
    session_id: getSessionId()
  };
  
  // Store in session storage (ephemeral)
  const moments = JSON.parse(sessionStorage.getItem('aniota-learning-moments') || '[]');
  moments.push(moment);
  
  // Keep only last 100 moments to prevent storage bloat
  if (moments.length > 100) {
    moments.shift();
  }
  
  sessionStorage.setItem('aniota-learning-moments', JSON.stringify(moments));
  
  console.log('ANIOTA Learning: Moment tracked', type, data);
}

// Track user interactions
function trackUserInteraction(event) {
  const target = event.target;
  
  // Only track meaningful interactions
  if (target.tagName === 'BUTTON' || target.tagName === 'A' || 
      target.classList.contains('interactive') || target.hasAttribute('data-track')) {
    
    trackLearningMoment('interaction', {
      element: target.tagName.toLowerCase(),
      className: target.className,
      text: target.textContent?.slice(0, 50),
      x: event.clientX,
      y: event.clientY
    });
  }
}

// Track keyboard interactions
function trackKeyboardInteraction(event) {
  // Only track navigation and accessibility keys
  if (['Enter', 'Space', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    trackLearningMoment('keyboard', {
      key: event.key,
      target: event.target.tagName.toLowerCase()
    });
  }
}

// Utility Functions
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function debugInfo() {
  console.log('ANIOTA Debug Info:', {
    sessionId: getSessionId(),
    isInstalled: isAppInstalled(),
    serviceWorker: 'serviceWorker' in navigator,
    learningMoments: JSON.parse(sessionStorage.getItem('aniota-learning-moments') || '[]').length,
    preferences: localStorage.getItem('aniota-preferences')
  });
}

// Global error handling
window.addEventListener('error', (event) => {
  console.error('ANIOTA Error:', event.error);
  trackLearningMoment('error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno
  });
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('ANIOTA Unhandled Promise:', event.reason);
  trackLearningMoment('promise_error', {
    reason: event.reason?.toString()
  });
});

console.log('ANIOTA IX-TECH: Main script loaded successfully');
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

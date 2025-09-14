
console.log('ANIOTA Splash: Script loading...');

const API_BASE_URL = 'http://192.168.254.200:52330';
let apiConnected = false;

class AniotaPresence {
  constructor() {
    this.apiUrl = API_BASE_URL;
    this.state = {
      mood_color: '#ffb300',
      position: { x: 60, y: 60 },
      heartbeat_rate: 800,
      behavior_mode: 'observing',
      attention_level: 0,
      guidance_target: null,
      earned_points: 0
    };
    this.isConnected = false;
    this.isDragging = false;
    this.lastUserAction = Date.now();
    this.lastInterceptTime = 0;
    this.interceptActive = false;
    this.mouseTracker = { x: 0, y: 0, velocityX: 0, velocityY: 0, lastUpdate: 0, isMoving: false, stopTimer: null };
    this.circle = document.getElementById('aniota-mood-circle');
    if (this.circle) {
      this.init();
    }
  }
  async init() {
    this.setupVisuals(); // Re-enabled with custom implementation
    this.setupInteractions();
    await this.connectToBackend();
    this.connectWebSocket();
    this.startBehaviorMonitoring();
    console.log('Aniota Presence: Initialized successfully');
  }
  
  setupVisuals() {
    // Electron-native graphics approach using standard DOM methods
    this.circle.innerHTML = ''; // Clear any existing content
    
    // Create a simple pink half-circle using standard graphics
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '60');
    svg.setAttribute('height', '30');
    svg.setAttribute('viewBox', '0 0 60 30');
    
    // Create the half-circle path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 0 30 A 30 30 0 0 1 60 30 Z');
    path.setAttribute('fill', '#FF69B4');
    path.setAttribute('stroke', '#FF1493');
    path.setAttribute('stroke-width', '2');
    
    svg.appendChild(path);
    this.circle.appendChild(svg);
    
    // Set standard positioning and interaction properties
    Object.assign(this.circle.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '60px',
      height: '30px',
      cursor: 'pointer',
      zIndex: '1000',
      transition: 'transform 0.3s ease',
      filter: 'drop-shadow(0 2px 8px rgba(255, 105, 180, 0.4))'
    });
    
    this.circle.title = 'Aniota: Your learning companion';
  }
  
  setupInteractions() {
    // Electron-native interaction handling
    this.circle.addEventListener('click', () => {
      console.log('Aniota clicked - Hello!');
      
      // Standard scale animation
      this.circle.style.transform = 'scale(1.2)';
      setTimeout(() => {
        this.circle.style.transform = 'scale(1)';
      }, 200);
      
      this.logInteraction('click', { action: 'greeting' });
    });
    
    // Hover effects using standard DOM methods
    this.circle.addEventListener('mouseenter', () => {
      this.circle.style.transform = 'scale(1.1)';
      this.circle.style.filter = 'drop-shadow(0 4px 12px rgba(255, 105, 180, 0.6))';
    });
    
    this.circle.addEventListener('mouseleave', () => {
      this.circle.style.transform = 'scale(1)';
      this.circle.style.filter = 'drop-shadow(0 2px 8px rgba(255, 105, 180, 0.4))';
    });
  }
  
  async connectToBackend() {
    // Minimal backend connection
    console.log('Connecting to backend...');
  }
  
  connectWebSocket() {
    // Minimal websocket setup
    console.log('Setting up websocket...');
  }
  
  startBehaviorMonitoring() {
    // Minimal behavior monitoring
    console.log('Starting behavior monitoring...');
  }
  
  logInteraction(type, data) {
    console.log('Interaction logged:', type, data);
  }
  // ...[rest of AniotaPresence methods from aniota_unified_presence.js]...
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('aniota-mood-circle')) {
    window.aniotaPresence = new AniotaPresence();
  }
});

window.AniotaPresence = AniotaPresence;

// Test API connection on page load
async function testAPIConnection() {
  try {
    console.log('ANIOTA Splash: Testing API connection...');
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    
    if (response.ok) {
      apiConnected = true;
      console.log('ANIOTA Splash: API connected successfully', data);
      showConnectionStatus('✅ Backend Connected', 'success');
      return true;
    } else {
      throw new Error('API health check failed');
    }
  } catch (error) {
    console.error('ANIOTA Splash: API connection failed', error);
    apiConnected = false;
    showConnectionStatus('⚠️ Backend Offline (Development Mode)', 'warning');
    return false;
  }
}

// [Insert all AniotaPresence methods here from aniota_unified_presence.js]

// Show connection status to user
function showConnectionStatus(message, type) {
  const statusElement = document.createElement('div');
  statusElement.className = `connection-status ${type}`;
  statusElement.textContent = message;
  statusElement.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    z-index: 1000;
    ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
    ${type === 'warning' ? 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;' : ''}
    ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
  `;
  
  document.body.appendChild(statusElement);
  
  // Remove after 5 seconds
  setTimeout(() => {
    if (statusElement.parentNode) {
      statusElement.parentNode.removeChild(statusElement);
    }
  }, 5000);
}

// Enhanced hope button functionality
function initializeHopeButton() {
  const hopeBtn = document.getElementById('hope-btn');
  if (!hopeBtn) {
    console.error('ANIOTA Splash: Hope button not found');
    return;
  }
  
  hopeBtn.addEventListener('click', async function() {
    console.log('ANIOTA Splash: Hope button clicked');
    
    // Add visual feedback
    hopeBtn.textContent = 'Loading...';
    hopeBtn.disabled = true;
    
    try {
      // Test API if not already connected
      if (!apiConnected) {
        await testAPIConnection();
      }
      
      // Log the interaction (session-only)
      if (apiConnected) {
        await logInteraction('hope_button_click', {
          timestamp: Date.now(),
          page: 'splash',
          user_agent: navigator.userAgent
        });
      }
      
  // Navigate to launcher
  console.log('ANIOTA Splash: Navigating to launcher...');
  window.location.href = '../aniota_launcher/aniota_launcher.html';

    } catch (error) {
      console.error('ANIOTA Splash: Error during hope button click', error);
      
      // Reset button and show error
      hopeBtn.textContent = 'HOPE';
      hopeBtn.disabled = false;
      showConnectionStatus('❌ Navigation Error', 'error');
      
      // Still navigate after a delay (offline mode)
      setTimeout(() => {
        window.location.href = '../aniota_launcher/aniota_launcher.html';
      }, 2000);
    }
  });
}

// Log interaction with backend (privacy-first)
async function logInteraction(action, data) {
  if (!apiConnected) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/learning/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // In production, add proper authentication
        'Authorization': 'Bearer development-token'
      },
      body: JSON.stringify({
        module: 'splash',
        activity: action,
        data: data
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('ANIOTA Splash: Interaction logged', result);
    } else {
      console.warn('ANIOTA Splash: Failed to log interaction', response.status);
    }
  } catch (error) {
    console.error('ANIOTA Splash: Error logging interaction', error);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
  console.log('ANIOTA Splash: DOM ready, initializing...');
  
  // Test API connection
  try {
    await testAPIConnection();
  } catch (error) {
    console.warn('ANIOTA Splash: API test failed during initialization', error);
  }
  
  // Initialize hope button
  initializeHopeButton();
  
  // Log page view
  if (apiConnected) {
    await logInteraction('page_view', {
      timestamp: Date.now(),
      page: 'splash',
      referrer: document.referrer
    });
  }
  
  console.log('ANIOTA Splash: Initialization complete');
});

// Global error handling
window.addEventListener('error', function(event) {
  console.error('ANIOTA Splash: JavaScript error', event.error);
  showConnectionStatus('⚠️ Script Error - Check Console', 'warning');
});

console.log('ANIOTA Splash: Script loaded successfully');
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

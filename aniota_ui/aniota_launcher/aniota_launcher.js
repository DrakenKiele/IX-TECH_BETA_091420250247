

console.log('ANIOTA Launcher: Script loading...');

const API_BASE_URL = 'http://192.168.254.200:52330';
let apiConnected = false;
let userToken = null;

async function testAPIConnection() {
  try {
    console.log('ANIOTA Launcher: Testing API connection...');
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    
    if (response.ok) {
      apiConnected = true;
      console.log('ANIOTA Launcher: API connected', data);
      showConnectionStatus('✅ Backend Online', 'success');
      return true;
    } else {
      throw new Error('API health check failed');
    }
  } catch (error) {
    console.error('ANIOTA Launcher: API connection failed', error);
    apiConnected = false;
    showConnectionStatus('⚠️ Backend Offline', 'warning');
    return false;
  }
}

// Show connection status
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
  
  setTimeout(() => {
    if (statusElement.parentNode) {
      statusElement.parentNode.removeChild(statusElement);
    }
  }, 5000);
}

// Get module information from API
async function getModuleInfo(moduleName) {
  if (!apiConnected) {
    return getFallbackModuleInfo(moduleName);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/modules/${moduleName.toLowerCase()}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`ANIOTA Launcher: Got module info for ${moduleName}`, data);
      return data;
    } else {
      console.warn(`ANIOTA Launcher: Module ${moduleName} not found, using fallback`);
      return getFallbackModuleInfo(moduleName);
    }
  } catch (error) {
    console.error(`ANIOTA Launcher: Error fetching module ${moduleName}`, error);
    return getFallbackModuleInfo(moduleName);
  }
}

// Log user interaction
async function logUserInteraction(action, data = {}) {
  if (!apiConnected) {
    console.log('ANIOTA Launcher: Offline interaction logged locally', { action, data });
    return;
  }
  
  try {
    const sessionId = sessionStorage.getItem('aniota_session_id') || 'anonymous';
    const response = await fetch(`${API_BASE_URL}/api/learning/interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session_id: sessionId,
        page: 'launcher',
        action: action,
        details: data,
        timestamp: new Date().toISOString()
      })
    });
    
    if (response.ok) {
      console.log(`ANIOTA Launcher: Interaction logged - ${action}`, data);
    }
  } catch (error) {
    console.warn('ANIOTA Launcher: Failed to log interaction', error);
  }
}

// Fallback module information
function getFallbackModuleInfo(moduleName) {
  const fallbackInfo = {
    "RADIX": { name: "RADIX", description: "Foundational learning patterns and core educational structures" },
    "PHONEMIX": { name: "PHONEMIX", description: "Sound processing, language learning, and audio-based education" },
    "MAQNETIX": { name: "MAQNETIX", description: "Interactive visual learning with magnetic field simulations" },
    "SECURIX": { name: "SECURIX", description: "Safety, security, and digital citizenship education" },
    "GRAFIX": { name: "GRAFIX", description: "Visual design, creativity, and artistic expression tools" },
    "CHRYSALIX": { name: "CHRYSALIX", description: "User interface and experience management system" },
    "ANIOTA": { name: "ANIOTA", description: "AI-powered learning companion and tutoring system" }
  };
  
  return fallbackInfo[moduleName.toUpperCase()] || { name: moduleName, description: "Educational module" };
}

// Map nav label to modules and static content
const moduleMap = {
  "DK Softworks": { file: "RADIX/descriptions_dksoftworks.json", key: "DK Softworks" },
  "IX-Tech": { file: "RADIX/descriptions_ixtech.json", key: "IX-Tech" },
  "CHRYSALIX": { file: "RADIX/descriptions_chrysalix.json", key: "CHRYSALIX" },
  "ANIOTA": { file: "RADIX/descriptions_aniota.json", key: "ANIOTA" },
  "RADIX": { file: "RADIX/descriptions_radix.json", key: "RADIX" },
  "GRAPHIX": { file: "RADIX/descriptions_graphix.json", key: "GRAPHIX" },
  "PHONEMIX": { file: "RADIX/descriptions_phonemix.json", key: "PHONEMIX" },
  "MAQNETIX": { file: "RADIX/descriptions_maqnetix.json", key: "MAQNETIX" },
  "SUBSCRIBIX": { file: "RADIX/descriptions_subscribix.json", key: "SUBSCRIBIX" },
  "SECURIX": { file: "RADIX/descriptions_securix.json", key: "SECURIX" }
};

// Fallback static text for non-module buttons
const launcherText = {
  "The Basics": "Welcome to Aniota! This is your starting point for learning about the IX-TECH suite and its modular tools.",
  "Walkthrough Tutorial": "Follow the step-by-step tutorial to get hands-on with Aniota’s features and navigation."
};

// Default learning level (can be set dynamically)
let currentLevel = "middle";

// Optionally, detect or set learning level here
// Example: currentLevel = getLearningLevelFromSession() || "middle";

function getDescriptionForLevel(descriptions, level) {
  if (!Array.isArray(descriptions)) return "";
  const found = descriptions.find(d => d.level === level);
  if (found) return found.text;
  // fallback: try middle, then first
  const mid = descriptions.find(d => d.level === "middle");
  if (mid) return mid.text;
  return descriptions[0]?.text || "";
}

async function fetchModuleDescription(label) {
  // For non-module buttons (static content)
  if (launcherText[label]) {
    return launcherText[label];
  }
  
  // Try API first if connected
  if (apiConnected && moduleMap[label]) {
    try {
      const moduleInfo = await getModuleInfo(label);
      if (moduleInfo && moduleInfo.description) {
        console.log(`ANIOTA Launcher: Using API description for ${label}`);
        return moduleInfo.description;
      }
    } catch (error) {
      console.warn(`ANIOTA Launcher: API failed for ${label}, falling back to static`, error);
    }
  }
  
  // Fall back to static file system
  const map = moduleMap[label];
  if (!map) return "Description unavailable.";
  
  try {
    console.log(`ANIOTA Launcher: Fetching static description for ${label}`);
    const resp = await fetch(`../RADIX/${map.file}`);
    if (!resp.ok) throw new Error("Static file not found");
    const data = await resp.json();
    const mod = data[map.key];
    if (!mod || !mod.descriptions) {
      throw new Error("Invalid static data format");
    }
    return getDescriptionForLevel(mod.descriptions, currentLevel);
  } catch (e) {
    console.error(`ANIOTA Launcher: Both API and static failed for ${label}`, e);
    // Final fallback to hardcoded info
    const fallback = getFallbackModuleInfo(label);
    return fallback.description || "Description unavailable.";
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  console.log('ANIOTA Launcher: DOM loaded, initializing...');
  
  // Test API connection on page load
  await testAPIConnection();
  
  const overlay = document.getElementById('launcher-nav-overlay');
  const content = document.getElementById('launcher-content');
  const title = document.getElementById('launcher-title');
  overlay.addEventListener('click', async function(e) {
    const btn = e.target.closest('.nav-btn');
    if (!btn) return;
    
    const label = btn.getAttribute('data-label') || btn.textContent;
    
    // Log the interaction
    await logUserInteraction('button_click', { button: label });
    
    // Special case: Launch Aniota button
    if (btn.id === 'aniota-launch-btn') {
      await logUserInteraction('navigation', { destination: 'aniota_epicenter_dev.html' });
      window.location.href = '../aniota_epicenter/aniota_epicenter_dev.html';
      return;
    }
    
    // Allow default navigation for About IX-TECH and ANIOTA button
    if (label === 'About IX-TECH and ANIOTA') {
      await logUserInteraction('navigation', { destination: 'about_page' });
      // Let the anchor's default behavior occur (navigate)
      return;
    }
    
    e.preventDefault();
    if (!label) return;
    
    // Set the title to the button label
    if (title) title.textContent = label;
    
    // Show loading state
    content.innerHTML = '<div class="launcher-text">Loading module information...</div>';
    
    // Fetch description (async for modules, static for others)
    const desc = await fetchModuleDescription(label);
    content.innerHTML = `<div class="launcher-text">${desc}</div>`;
    
    overlay.style.display = 'none';
  });
});
// Drag logic for nav bar
(function() {
    const navBar = document.getElementById('draggable-nav-bar');
    const container = document.getElementById('draggable-nav-bar-container');
    let isDragging = false;
    let startX, startLeft;
    let defaultLeft = 0;

    navBar.addEventListener('mousedown', function(e) {
        isDragging = true;
        navBar.style.cursor = 'grabbing';
        startX = e.clientX;
        startLeft = navBar.offsetLeft;
        document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        let dx = e.clientX - startX;
        let newLeft = startLeft + dx;
        // Clamp so it can't go too far off either side
        let minLeft = -container.offsetWidth * 0.6;
        let maxLeft = container.offsetWidth * 0.6;
        newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
        navBar.style.position = 'relative';
        navBar.style.left = newLeft + 'px';
    });
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            navBar.style.cursor = 'grab';
            document.body.style.userSelect = '';
        }
    });
})();
// Glow effect for draggable nav bar and nav-btns
const navBar = document.getElementById('draggable-nav-bar');
navBar.addEventListener('mouseenter', function() {
    navBar.classList.add('glow-drag');
});
navBar.addEventListener('mouseleave', function() {
    navBar.classList.remove('glow-drag');
});
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.classList.add('glow-drag'));
    btn.addEventListener('mouseleave', () => btn.classList.remove('glow-drag'));
});
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

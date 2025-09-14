# IX-TECH ANIOTA Unified Presence System

## Overview

The IX-TECH ANIOTA system now features a **unified presence architecture** where Aniota exists as a persistent entity that appears to live "outside" the browser, synchronizing seamlessly across all pages and browser tabs.

## 🌟 Key Features

### Unified Aniota Presence
- **Single Identity**: One Aniota that persists across all pages
- **Real-time Synchronization**: WebSocket-powered state sharing
- **Cross-tab Communication**: Drag Aniota on one tab, see it move on all tabs
- **Persistent State**: Mood, position, and context maintained by backend

### Architecture Components
- **Python Backend**: FastAPI with WebSocket support for real-time sync
- **JavaScript Frontend**: Modular presence system with automatic initialization
- **WebSocket Bridge**: Real-time communication between all clients
- **State Management**: Centralized Aniota state with automatic persistence

## 🚀 Quick Start

### 1. Setup System
```bash
python setup_system.py
```

### 2. Start the Stack (Multiple Options)

**Option A: Auto-start with Docker (Recommended)**
```bash
python start_stack.py --auto-yes
# OR double-click: start_aniota.bat
```

**Option B: Python Backend Only**
```bash
python start_stack.py --no-docker
# OR double-click: start_aniota_python.bat  
```

**Option C: Interactive Mode**
```bash
python start_stack.py
# Will prompt for Docker choice
```

### 3. Access ANIOTA
- **Main Entry**: <http://localhost:5500/index.html> (redirects to splash)
- **Development**: <http://localhost:8001>
- **API Docs**: <http://localhost:8000/docs>

## 🔧 System Architecture

### Backend (Python FastAPI)
```
backend/
├── main.py                 # Enhanced FastAPI app with WebSockets
├── aniota_presence.py      # Centralized presence state manager
├── requirements.txt        # Updated with WebSocket dependencies
└── Dockerfile             # Container configuration
```

### Frontend (JavaScript Modules)
```
GRAFIX/
├── aniota_unified_presence.js  # Modular presence system
└── aniota_heartbeat.js         # Legacy (replaced)
```

### Pages with Aniota Presence
- `CHRYSALIX/aniota_splash.html` - Welcome page
- `CHRYSALIX/aniota_launcher.html` - Module launcher
- Any page with `<div id="aniota-mood-circle"></div>`

## 🎯 How It Works

### 1. Page Initialization
```html
<!-- Add to any page for Aniota presence -->
<div id="aniota-mood-circle"></div>
<script src="../GRAFIX/aniota_unified_presence.js"></script>
```

### 2. Automatic Presence
- Script auto-detects the mood circle div
- Connects to backend WebSocket
- Synchronizes with global Aniota state
- Enables drag, click, and mood interactions

### 3. Cross-Page Synchronization
- Move Aniota on one page → Updates on all pages
- Mood changes broadcast to all clients
- Interaction logging centralized
- State persists across page navigation

## 📡 API Endpoints

### Aniota Presence
- `GET /api/aniota/state` - Get current Aniota state
- `POST /api/aniota/interaction` - Log user interaction
- `POST /api/aniota/position` - Update position
- `WS /ws/aniota` - Real-time WebSocket connection

### Health & Testing
- `GET /health` - System health check
- `GET /` - System information

## 🧪 Testing

### Run All Tests
```bash
python test_stack.py
```

### Manual Testing
1. Open multiple browser tabs to ANIOTA
2. Drag the Aniota orb on one tab
3. Watch it move on all other tabs
4. Check WebSocket connection in DevTools

## 🛠️ Development Workflow

### Adding Aniota to New Pages
1. Add mood circle div: `<div id="aniota-mood-circle"></div>`
2. Include script: `<script src="../GRAFIX/aniota_unified_presence.js"></script>`
3. Aniota will automatically initialize and sync

### Customizing Aniota Behavior
```javascript
// Access the global presence instance
window.aniotaPresence.setMood('learning');
window.aniotaPresence.speak('Hello!', 'greeting');
```

## 🔍 Troubleshooting

### Common Issues
1. **WebSocket Connection Failed**
   - Check backend is running on port 8000
   - Verify CORS settings include your frontend port

2. **Aniota Not Appearing**
   - Ensure `<div id="aniota-mood-circle"></div>` exists
   - Check browser console for JavaScript errors

3. **Cross-tab Sync Not Working**
   - Confirm WebSocket connection is established
   - Check browser DevTools Network tab for WS connection

### Debug Mode
Open browser DevTools and check console for:
- `Aniota Presence: Initialized successfully`
- `Aniota Presence: WebSocket connected`
- `Aniota Presence: Connected to backend`

## 📊 System Benefits

### For Users
- **Consistent Experience**: Aniota feels like a living companion
- **Seamless Navigation**: Presence persists across all pages
- **Interactive**: Drag, click, and engage with Aniota

### For Developers
- **Modular**: One script enables presence on any page
- **Scalable**: WebSocket architecture supports many concurrent users
- **Maintainable**: Centralized state management
- **Testable**: Comprehensive test suite included

## 🎨 Visual Features

### Aniota Orb Characteristics
- **Size**: 72px circular orb
- **Position**: Draggable, remembers position across pages
- **Mood Colors**: Cycles through 6 emotional states
- **Heartbeat**: Subtle pulse animation every 800ms
- **Interactive**: Click to center, drag to move

### Mood Colors
- `#ffb300` - Warm gold (default/content)
- `#487de7` - Calm blue (thinking)
- `#e81416` - Alert red (attention needed)
- `#79c314` - Success green (achievement)
- `#faeb36` - Excited yellow (discovery)
- `#70369d` - Deep purple (focused learning)

This unified system creates the illusion that Aniota exists as a single, persistent entity across your entire IX-TECH experience!

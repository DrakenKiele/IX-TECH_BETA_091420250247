# ANIOTA Installation Guide

## What Is ANIOTA?

**ANIOTA is a Progressive Web App (PWA)** - a modern web application that:
- ✅ **Installs like a native app** on any device (phone, tablet, desktop)
- ✅ **Works offline** with cached content
- ✅ **Sends notifications** for learning reminders
- ✅ **Stays private** - no Chrome extension permissions needed
- ✅ **Updates automatically** when you're online

## Installation Methods

### 🌐 Method 1: Direct Web Access (Easiest)
1. **Visit**: `http://localhost:8080` (when running locally)
2. **Or**: Deploy to any web server and visit the URL
3. **Navigate**: Use the full user journey starting from the homepage

### 📱 Method 2: Install as PWA (Recommended)
1. **Open** your browser (Chrome, Edge, Firefox, Safari)
2. **Visit** the ANIOTA URL
3. **Look for** the install prompt or address bar install icon
4. **Click "Install App"** or the install icon
5. **ANIOTA will install** like a native app with its own icon

### 💻 Method 3: Add to Home Screen (Mobile)
1. **Open** ANIOTA in your mobile browser
2. **Tap** the browser menu (⋮ or share icon)
3. **Select** "Add to Home Screen" or "Install App"
4. **ANIOTA icon** appears on your home screen

## Running ANIOTA Locally

### Start the Development Server
```powershell
# Navigate to IX-TECH directory
cd "h:\DK Softworks LLC Application Projects\DK_SOFTWORKS_LLC\IX-TECH"

# Start Python web server
python start_stack.py

# Or use simple HTTP server
python -m http.server 8080
```

### Access the Application
- **Homepage**: http://localhost:8080/index_pwa.html
- **Direct Journey**: http://localhost:8080/CHRYSALIX/aniota_splash.html
- **Epicenter**: http://localhost:8080/CHRYSALIX/aniota_epicenter.html

## User Journey Flow

```
🏠 Homepage (index_pwa.html)
    ↓
🚀 Splash (aniota_splash.html) - Hope introduction
    ↓
🎯 Launcher (aniota_launcher.html) - Gateway
    ↓
📚 About (aniota_about.html) - Module discovery
    ↓
⭐ Subscribe (aniota_subscribix.html) - Tier selection + Symbie
    ↓
🏫 Epicenter (aniota_epicenter.html) - Learning dashboard
    ↓
📖 Modules (RADIX, PHONEMIX, MAQNETIX, etc.)
```

## Architecture Explanation

### What We Built: 3 Implementation Layers

1. **📱 PWA (Progressive Web App)** - *Primary Implementation*
   - `manifest.webmanifest` - App configuration
   - `service-worker.js` - Offline support & caching
   - `index_pwa.html` - Modern landing page
   - **This is what users should install and use**

2. **🌐 Web Application** - *Core Experience*
   - CHRYSALIX user journey (splash → launcher → about → subscribe → epicenter)
   - Module stubs (RADIX, PHONEMIX, MAQNETIX)
   - Privacy-first learning tracking
   - **This is the complete learning experience**

3. **⚙️ Chrome Extension** - *Legacy/Development*
   - `manifest.json` - Extension configuration
   - `extension/popup.html` - Basic popup
   - **Not recommended for production use**

### Why PWA Instead of Chrome Extension?

✅ **PWA Advantages:**
- Works on **all browsers** (Chrome, Firefox, Safari, Edge)
- Works on **all devices** (desktop, mobile, tablet)
- **No browser-specific permissions** needed
- **Privacy-first** by design
- **Offline functionality** with service worker
- **Push notifications** without extension APIs
- **Easier deployment** - just host on any web server

❌ **Chrome Extension Limitations:**
- Only works in **Chrome/Chromium browsers**
- Needs **explicit permissions** from users
- More **complex privacy concerns**
- **Browser-specific** development and maintenance
- Limited **offline capabilities**

## Features Available

### 🎓 Core Learning System
- **Hope AI Companion** - Personalized learning guide
- **Recursive Tutoring** - AI adapts to your learning style
- **Progress Tracking** - Session-based, privacy-preserving
- **Module Navigation** - Seamless educational flow

### 🧸 Symbie Physical Companion
- **Pet Training Features** - Real companion that learns
- **Educational Mission** - Physical learning reinforcement
- **Subscription Integration** - Available with higher tiers
- **Emotional Bonding** - Grows with the learner

### 📱 PWA Benefits
- **Offline Access** - Cached content available without internet
- **Push Notifications** - Learning reminders and updates
- **App-like Experience** - Full-screen, native feel
- **Auto-updates** - Always get the latest features

### 🔒 Privacy Features
- **Session-only Data** - No persistent personal information
- **Local Storage** - All data stays on your device
- **No Tracking** - Only learning moments for session improvement
- **COPPA Compliant** - Safe for all ages

## Troubleshooting

### PWA Not Installing?
- **Clear browser cache** and try again
- **Enable JavaScript** in browser settings
- **Try incognito/private mode** first
- **Check console** for any error messages

### Service Worker Issues?
- **Refresh the page** completely (Ctrl+Shift+R)
- **Check DevTools** → Application → Service Workers
- **Unregister** old service worker if present
- **Clear all site data** and reload

### Offline Not Working?
- **Visit online first** to cache resources
- **Check service worker** is registered successfully
- **Verify network connectivity** indicator
- **Clear cache** if persistent issues

## Development Notes

### File Structure
```
IX-TECH/
├── index_pwa.html          # PWA homepage
├── manifest.webmanifest    # PWA configuration
├── service-worker.js       # PWA offline support
├── main-ixtech.js         # PWA core logic
├── CHRYSALIX/             # User journey pages
│   ├── aniota_splash.*    # Hope introduction
│   ├── aniota_launcher.*  # Module gateway
│   ├── aniota_about.*     # Module discovery
│   ├── aniota_subscribix.* # Subscription system
│   └── aniota_epicenter.* # Learning dashboard
└── [MODULE]IX/            # Educational modules
    └── *_dashboard.*      # Module entry points
```

### Deployment Options
1. **Static Hosting**: Upload to any web server
2. **GitHub Pages**: Host directly from repository
3. **Netlify/Vercel**: Deploy with automatic HTTPS
4. **Local Development**: Python server for testing

## Next Steps

1. **Test the Installation**: Visit your local server and try installing the PWA
2. **Explore the Journey**: Walk through splash → launcher → about → subscribe → epicenter
3. **Check Offline Mode**: Disconnect internet and verify cached content works
4. **Deploy for Production**: Choose hosting method and deploy with HTTPS

The PWA is now your **complete, installable ANIOTA educational suite**! 🎉

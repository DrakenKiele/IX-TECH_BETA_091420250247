
const SHAPES = [
  { name: 'RECTANGLOVAL', src: 'assets/shapes/rectangloval.svg' },
  { name: 'RHOMBUSOVAL', src: 'assets/shapes/rhombusoval.svg' },
  { name: 'TRAPEZOVAL', src: 'assets/shapes/trapezoval.svg' },
  { name: 'CIRCLE', src: 'assets/shapes/circle.svg' },
  { name: 'LINE', src: 'assets/shapes/line.svg' }
];

const LABELS = [
  'Concept', 'Process', 'Input', 'Output', 'Agent', 'Goal', 'Constraint', 'Dummy (free label)'
];

const GRID_SIZE = 48;
const SNAP_RADIUS = 24;

const palette = document.getElementById('shape-palette');
const placedShapes = document.getElementById('placed-shapes');
const canvas = document.getElementById('epicenter-canvas');

let draggingShape = null;
let dragOffset = { x: 0, y: 0 };
let activeShape = null;
let placed = [];

function createPalette() {
  SHAPES.forEach(shape => {
    const div = document.createElement('div');
    div.className = 'palette-shape';
    div.innerHTML = `<img src="${shape.src}" alt="${shape.name}" draggable="false" style="width:100%;height:100%;">`;
    div.title = shape.name;
    div.addEventListener('mousedown', e => {
      draggingShape = shape;
      dragOffset = { x: e.offsetX, y: e.offsetY };
      document.body.style.cursor = 'grabbing';
    });
    palette.appendChild(div);
  });
}

function drawGrid() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#e0e6f0';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  // Draw sensor points
  ctx.fillStyle = '#bfcfff';
  for (let x = 0; x < canvas.width; x += GRID_SIZE) {
    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

function snapToGrid(x, y) {
  return {
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE
  };
}

function onMouseMove(e) {
  if (draggingShape) {
    // Show ghost shape following mouse
    // (Implementation for ghost shape is left as a TODO for brevity)
  }
}

function onMouseUp(e) {
  if (draggingShape) {
    // Snap to nearest grid point
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { x: sx, y: sy } = snapToGrid(x, y);
    // Place shape
    placed.push({
      shape: draggingShape,
      x: sx,
      y: sy,
      label: null
    });
    renderPlacedShapes();
    draggingShape = null;
    document.body.style.cursor = '';
  }
}

function renderPlacedShapes() {
  placedShapes.innerHTML = '';
  placed.forEach((item, idx) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${item.x},${item.y})`);
    g.innerHTML = `<image href="${item.shape.src}" width="48" height="48" />`;
    if (item.label) {
      g.innerHTML += `<text x="24" y="60" text-anchor="middle" font-size="14" fill="#333">${item.label}</text>`;
    }
    placedShapes.appendChild(g);
  });
}

document.getElementById('reset-epicenter').onclick = () => {
  placed = [];
  renderPlacedShapes();
  // Optionally, reset other UI state as needed
};

let currentUser = {
  sessionId: null,
  role: 'learner'
};

const ROLE_PERMISSIONS = {
  learner: ['view'],
  editor: ['view', 'edit'],
  admin: ['view', 'edit', 'manage']
};

let analyticsLog = {
  accessAttempts: [],
  roleChanges: []
};

function setUserRole(newRole) {
  const oldRole = currentUser.role;
  currentUser.role = newRole;
  analyticsLog.roleChanges.push({
    sessionId: currentUser.sessionId,
    from: oldRole,
    to: newRole,
    timestamp: Date.now()
  });
}

function checkAccess(action) {
  const allowed = ROLE_PERMISSIONS[currentUser.role]?.includes(action);
  analyticsLog.accessAttempts.push({
    sessionId: currentUser.sessionId,
    action,
    allowed,
    timestamp: Date.now()
  });
  return allowed;
}

canvas.addEventListener('touchstart', function(e) {
  if (!checkAccess('view')) return;
  const touches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
  logUserEvent('touch', { type: 'touchstart', touches });
});
canvas.addEventListener('touchmove', function(e) {
  if (!checkAccess('view')) return;
  const touches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
  logUserEvent('touch', { type: 'touchmove', touches });
});
canvas.addEventListener('touchend', function(e) {
  if (!checkAccess('view')) return;
  logUserEvent('touch', { type: 'touchend' });
});

// Voice event logging (scaffold, requires Web Speech API)
function startVoiceLogging() {
  if (!('webkitSpeechRecognition' in window)) return;
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    logUserEvent('voice', { transcript, confidence });
  };
  recognition.start();
}
// Call startVoiceLogging() on a button or UI event as needed

// --- Visual Monitoring Status Indicator ---
let monitoringStatus = true;
const statusIndicator = document.createElement('div');
statusIndicator.id = 'monitoring-status-indicator';
statusIndicator.style.position = 'fixed';
statusIndicator.style.top = '10px';
statusIndicator.style.right = '10px';
statusIndicator.style.width = '18px';
statusIndicator.style.height = '18px';
statusIndicator.style.borderRadius = '50%';
statusIndicator.style.background = monitoringStatus ? '#4caf50' : '#f44336';
statusIndicator.style.border = '2px solid #222';
document.body.appendChild(statusIndicator);
function setMonitoringStatus(on) {
  monitoringStatus = on;
  statusIndicator.style.background = on ? '#4caf50' : '#f44336';
}

// --- User Event Logging ---
function logUserEvent(eventType, metadata) {
  // Scaffold: send to backend or store locally
  console.log('User event:', eventType, metadata);
}

// --- Adaptive Feedback & Analytics Scaffolding ---
const FEEDBACK_TYPES = [
  'hint', 'encouragement', 'challenge', 'reflection', 'explanation', 'reminder'
];
let feedbackHistory = [];
let feedbackAcceptanceLog = [];

function giveFeedback(type, content) {
  if (!FEEDBACK_TYPES.includes(type)) {
    console.warn('Unsupported feedback type:', type);
    return;
  }
  const entry = {
    timestamp: Date.now(),
    type,
    content,
    userState: { ...currentUser }
  };
  feedbackHistory.push(entry);
  renderFeedback(entry);
}

function logFeedbackAcceptance(entry, accepted) {
  feedbackAcceptanceLog.push({
    feedback: entry,
    accepted,
    timestamp: Date.now()
  });
  renderFeedbackAnalytics();
}

function renderFeedback(entry) {
  // Scaffold: show feedback in a UI element (e.g., modal, toast, sidebar)
  alert(`[${entry.type}] ${entry.content}`);
}

function renderFeedbackAnalytics() {
  // Scaffold: show acceptance rate and feedback history in UI
  const accepted = feedbackAcceptanceLog.filter(f => f.accepted).length;
  const rate = feedbackAcceptanceLog.length ? (accepted / feedbackAcceptanceLog.length) : 0;
  console.log('Feedback acceptance rate:', rate);
  // Optionally, update a UI element
}

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawGrid();
  renderPlacedShapes();
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
drawGrid();
createPalette();
renderPlacedShapes();
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------


console.log('Aniota Epicenter Development Interface Loading...');

const API_BASE_URL = 'http://192.168.254.200:52330';

let epicenterState = {
    currentLayer: 0,
    maxLayers: 4, // Room limitation
    selectionPath: [],
    coordinates: { x: 0, y: 0 },
    topics: [],
    roomLeft: true,
    isActivated: false
};

const mockTopics = {
    layer0: [
        { id: 'science', label: 'Science', coord: { x: 0, y: 0 } },
        { id: 'math', label: 'Mathematics', coord: { x: 0, y: 1 } },
        { id: 'history', label: 'History', coord: { x: 0, y: -1 } },
        { id: 'art', label: 'Art & Design', coord: { x: -1, y: 0 } },
        { id: 'language', label: 'Language', coord: { x: -1, y: -1 } }
    ],
    layer1: {
        science: [
            { id: 'physics', label: 'Physics', coord: { x: 1, y: 0 } },
            { id: 'chemistry', label: 'Chemistry', coord: { x: 1, y: 1 } },
            { id: 'biology', label: 'Biology', coord: { x: 1, y: -1 } },
            { id: 'earth', label: 'Earth Science', coord: { x: 0, y: 0 } },
            { id: 'space', label: 'Space Science', coord: { x: 0, y: -1 } }
        ],
        math: [
            { id: 'algebra', label: 'Algebra', coord: { x: 1, y: 0 } },
            { id: 'geometry', label: 'Geometry', coord: { x: 1, y: 1 } },
            { id: 'calculus', label: 'Calculus', coord: { x: 1, y: -1 } },
            { id: 'statistics', label: 'Statistics', coord: { x: 0, y: 0 } },
            { id: 'logic', label: 'Logic', coord: { x: 0, y: -1 } }
        ],
        // Add more as needed...
    },
    layer2: {
        physics: [
            { id: 'mechanics', label: 'Mechanics', coord: { x: 2, y: 0 } },
            { id: 'thermodynamics', label: 'Thermo', coord: { x: 2, y: 1 } },
            { id: 'electromagnetism', label: 'EM Fields', coord: { x: 2, y: -1 } },
            { id: 'quantum', label: 'Quantum', coord: { x: 1, y: 0 } },
            { id: 'relativity', label: 'Relativity', coord: { x: 1, y: -1 } }
        ]
        // Add more as needed...
    }
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Aniota Epicenter Development Interface...');
    initializeEpicenterDev();
});

function initializeEpicenterDev() {
    setupEventListeners();
    renderInitialLayer();
    updateStatusDisplay();
    
    // Connect to backend if available
    connectToBackend();
    
    console.log('✅ Epicenter Development Interface Ready');
}

function setupEventListeners() {
    // Control buttons
    document.getElementById('activate-btn').addEventListener('click', handleActivate);
    document.getElementById('back-btn').addEventListener('click', handleBack);
    document.getElementById('reset-btn').addEventListener('click', handleReset);
    
    // Aniota mood circle
    document.getElementById('aniota-mood-circle').addEventListener('click', toggleAniotaMode);
}

function renderInitialLayer() {
    const container = document.getElementById('choice-interface');
    const topics = mockTopics.layer0;
    
    renderChoiceLayer(container, topics, 0);
    updateCurrentPath('Choose your learning area');
}

function renderChoiceLayer(container, topics, layerIndex) {
    // Clear previous content or add new layer
    if (layerIndex === 0) {
        container.innerHTML = '';
    }
    
    // Create layer container
    const layer = document.createElement('div');
    layer.className = `choice-layer layer-${layerIndex}`;
    layer.id = `layer-${layerIndex}`;
    
    // Add room indicator if getting full
    if (layerIndex >= epicenterState.maxLayers - 1) {
        const roomIndicator = document.createElement('div');
        roomIndicator.className = 'room-indicator';
        roomIndicator.textContent = 'No more room!';
        layer.appendChild(roomIndicator);
        epicenterState.roomLeft = false;
    }
    
    // Create squares for each topic
    topics.forEach((topic, index) => {
        const square = createChoiceSquare(topic, layerIndex, index);
        layer.appendChild(square);
    });
    
    // Add animation class for new layers
    if (layerIndex > 0) {
        layer.classList.add('new');
    }
    
    container.appendChild(layer);
    
    // Update debug info
    updateDebugDisplay();
}

function createChoiceSquare(topic, layerIndex, position) {
    const square = document.createElement('div');
    square.className = `choice-square pos-${getPositionClass(position)}`;
    square.dataset.topicId = topic.id;
    square.dataset.layer = layerIndex;
    square.dataset.coordinateX = topic.coord.x;
    square.dataset.coordinateY = topic.coord.y;
    
    // Create label
    const label = document.createElement('div');
    label.className = 'square-label';
    label.textContent = topic.label;
    
    // Create coordinate display
    const coordinate = document.createElement('div');
    coordinate.className = 'square-coordinate';
    coordinate.textContent = `(${topic.coord.x},${topic.coord.y})`;
    
    square.appendChild(label);
    square.appendChild(coordinate);
    
    // Add click handler
    square.addEventListener('click', function() {
        handleSquareClick(topic, layerIndex, square);
    });
    
    return square;
}

function getPositionClass(index) {
    const positions = ['center', 'top', 'bottom', 'diagonal-top', 'diagonal-bottom'];
    return positions[index] || 'center';
}

function handleSquareClick(topic, layerIndex, squareElement) {
    console.log(`Selected: ${topic.label} at layer ${layerIndex}`);
    
    // Clear previous selections in this layer
    clearLayerSelections(layerIndex);
    
    // Mark this square as selected
    squareElement.classList.add('selected');
    
    // Update selection path
    if (epicenterState.selectionPath.length <= layerIndex) {
        epicenterState.selectionPath.push(topic);
    } else {
        epicenterState.selectionPath[layerIndex] = topic;
        // Remove any selections beyond this layer
        epicenterState.selectionPath = epicenterState.selectionPath.slice(0, layerIndex + 1);
    }
    
    // Update coordinates
    epicenterState.coordinates = { ...topic.coord };
    
    // Update current layer
    epicenterState.currentLayer = layerIndex;
    
    // Check if we can add more layers
    if (epicenterState.roomLeft && layerIndex < epicenterState.maxLayers - 1) {
        // Add next layer if topics exist
        const nextLayerTopics = getNextLayerTopics(topic.id, layerIndex + 1);
        if (nextLayerTopics && nextLayerTopics.length > 0) {
            renderChoiceLayer(document.getElementById('choice-interface'), nextLayerTopics, layerIndex + 1);
        }
    }
    
    // Update displays
    updateCurrentPath();
    updateStatusDisplay();
    updateDebugDisplay();
    
    // Enable activate button if we have a complete path
    updateActivateButton();
}

function clearLayerSelections(layerIndex) {
    const layer = document.getElementById(`layer-${layerIndex}`);
    if (layer) {
        const squares = layer.querySelectorAll('.choice-square');
        squares.forEach(square => square.classList.remove('selected'));
    }
}

function getNextLayerTopics(parentTopicId, layerIndex) {
    if (layerIndex === 1 && mockTopics.layer1[parentTopicId]) {
        return mockTopics.layer1[parentTopicId];
    } else if (layerIndex === 2 && mockTopics.layer2[parentTopicId]) {
        return mockTopics.layer2[parentTopicId];
    }
    
    // Generate mock topics if not defined
    return generateMockTopics(parentTopicId, layerIndex);
}

function generateMockTopics(parentId, layer) {
    const mockSubtopics = [
        { suffix: 'Basics', label: 'Fundamentals' },
        { suffix: 'Advanced', label: 'Advanced' },
        { suffix: 'Applied', label: 'Applications' },
        { suffix: 'Theory', label: 'Theory' },
        { suffix: 'Practice', label: 'Practice' }
    ];
    
    return mockSubtopics.map((subtopic, index) => ({
        id: `${parentId}_${subtopic.suffix.toLowerCase()}`,
        label: `${subtopic.label}`,
        coord: { x: layer, y: index - 2 }
    }));
}

function updateCurrentPath() {
    const pathElement = document.getElementById('current-path');
    const breadcrumbElement = document.getElementById('selection-breadcrumb');
    
    if (epicenterState.selectionPath.length === 0) {
        pathElement.textContent = 'Ready to explore';
        breadcrumbElement.textContent = '';
    } else {
        const current = epicenterState.selectionPath[epicenterState.selectionPath.length - 1];
        pathElement.textContent = current.label;
        
        const breadcrumb = epicenterState.selectionPath.map(item => item.label).join(' → ');
        breadcrumbElement.textContent = breadcrumb;
    }
}

function updateStatusDisplay() {
    document.getElementById('current-depth').textContent = epicenterState.selectionPath.length;
    document.getElementById('choices-count').textContent = epicenterState.selectionPath.length;
    document.getElementById('room-left').textContent = epicenterState.roomLeft ? 'Yes' : 'No more room';
}

function updateDebugDisplay() {
    document.getElementById('debug-coordinates').textContent = 
        `Coordinates: (${epicenterState.coordinates.x}, ${epicenterState.coordinates.y})`;
    
    const lastSelection = epicenterState.selectionPath[epicenterState.selectionPath.length - 1];
    document.getElementById('debug-selection').textContent = 
        `Selection: ${lastSelection ? lastSelection.label : 'None'}`;
    
    document.getElementById('debug-layer').textContent = 
        `Layer: ${epicenterState.currentLayer}`;
}

function updateActivateButton() {
    const activateBtn = document.getElementById('activate-btn');
    
    // Enable if we have selections and either no room left or user wants to activate
    if (epicenterState.selectionPath.length > 0) {
        if (!epicenterState.roomLeft || epicenterState.selectionPath.length >= 2) {
            activateBtn.disabled = false;
        }
    } else {
        activateBtn.disabled = true;
    }
}

function handleActivate() {
    console.log('🚀 ACTIVATE pressed - Starting learning session');
    
    if (epicenterState.selectionPath.length === 0) {
        alert('Please make at least one selection first');
        return;
    }
    
    epicenterState.isActivated = true;
    
    // Send to backend for processing
    const learningRequest = {
        selectionPath: epicenterState.selectionPath,
        coordinates: epicenterState.coordinates,
        timestamp: Date.now(),
        mode: 'development'
    };
    
    sendToBackend('/api/aniota/start-learning', learningRequest);
    
    // Update UI to show activation
    updateCurrentPath();
    document.getElementById('current-path').textContent = 'Learning Session Started!';
    
    // For development, show what would happen
    showActivationResult(learningRequest);
}

function showActivationResult(request) {
    const result = document.createElement('div');
    result.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 2000;
        max-width: 400px;
        text-align: center;
    `;
    
    result.innerHTML = `
        <h3>🎓 Learning Session Activated!</h3>
        <p><strong>Topic Path:</strong><br>
        ${request.selectionPath.map(item => item.label).join(' → ')}</p>
        <p><strong>Final Coordinates:</strong> (${request.coordinates.x}, ${request.coordinates.y})</p>
        <p><strong>Depth:</strong> ${request.selectionPath.length} layers</p>
        <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
    `;
    
    document.body.appendChild(result);
}

function handleBack() {
    if (epicenterState.selectionPath.length > 0) {
        // Remove last selection
        epicenterState.selectionPath.pop();
        
        // Remove last layer
        const lastLayer = document.getElementById(`layer-${epicenterState.currentLayer + 1}`);
        if (lastLayer) {
            lastLayer.remove();
        }
        
        epicenterState.currentLayer = Math.max(0, epicenterState.currentLayer - 1);
        epicenterState.roomLeft = true;
        
        updateCurrentPath();
        updateStatusDisplay();
        updateDebugDisplay();
        updateActivateButton();
    }
}

function handleReset() {
    epicenterState = {
        currentLayer: 0,
        maxLayers: 4,
        selectionPath: [],
        coordinates: { x: 0, y: 0 },
        topics: [],
        roomLeft: true,
        isActivated: false
    };
    
    renderInitialLayer();
    updateStatusDisplay();
    updateDebugDisplay();
    updateActivateButton();
    
    console.log('🔄 Interface reset');
}

function toggleAniotaMode() {
    console.log('🤖 Aniota mode toggle - switching to mentor interface');
    // This would switch to the full mentor interface when implemented
    alert('Aniota mentor mode - Coming soon!');
}

// Backend communication
async function connectToBackend() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/aniota/state`);
        if (response.ok) {
            console.log('✅ Connected to Aniota backend');
            document.getElementById('connection-status').textContent = '● Connected';
        }
    } catch (error) {
        console.log('⚠️ Backend not available - using development mode');
        document.getElementById('connection-status').textContent = '● Dev Mode';
    }
}

async function sendToBackend(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('📤 Sent to backend:', result);
            return result;
        }
    } catch (error) {
        console.log('⚠️ Backend communication failed:', error);
    }
    return null;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        epicenterState,
        handleSquareClick,
        getNextLayerTopics
    };
}
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

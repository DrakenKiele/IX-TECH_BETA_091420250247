
import { packInterface, packCurrentPage, compareShapeArrays, calculateFidelity } from './packer.js';
import { generateInterface, saveGeneratedInterface } from './interfaceGenerator.js';

let originalShapes = [];
let currentTestResults = null;

/**
 * Initialize the packer UI system
 */
export function initPackerUI() {
  createPackerPanel();
  attachPackerEvents();
}

/**
 * Create the packer control panel
 */
function createPackerPanel() {
  if (document.getElementById('packer-ui')) return;
  
  const panel = document.createElement('div');
  panel.id = 'packer-ui';
  panel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 10003;
    min-width: 350px;
    max-width: 500px;
    font-family: 'Noto Sans Rounded', monospace;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;
  
  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <h3 style="margin: 0; color: #4CAF50;">🔄 Zero-Loss Converter</h3>
      <button id="packer-close" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">✕</button>
    </div>
    
    <div style="border-bottom: 1px solid #444; margin-bottom: 10px; padding-bottom: 10px;">
      <h4 style="color: #2196F3; margin: 5px 0;">1. Load Original Shapes</h4>
      <button id="load-shapes-file" style="margin: 5px; padding: 5px 10px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Load shapes_now.json</button>
      <button id="load-shapes-current" style="margin: 5px; padding: 5px 10px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Use Current Shapes</button>
      <div id="shapes-status" style="font-size: 12px; color: #888; margin-top: 5px;">No shapes loaded</div>
    </div>
    
    <div style="border-bottom: 1px solid #444; margin-bottom: 10px; padding-bottom: 10px;">
      <h4 style="color: #FF9800; margin: 5px 0;">2. Generate Interface</h4>
      <button id="generate-interface" style="margin: 5px; padding: 5px 10px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;" disabled>Generate Web Page</button>
      <button id="preview-interface" style="margin: 5px; padding: 5px 10px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;" disabled>Preview</button>
      <div id="generation-status" style="font-size: 12px; color: #888; margin-top: 5px;">Load shapes first</div>
    </div>
    
    <div style="border-bottom: 1px solid #444; margin-bottom: 10px; padding-bottom: 10px;">
      <h4 style="color: #9C27B0; margin: 5px 0;">3. Pack Back to Shapes</h4>
      <button id="pack-current-page" style="margin: 5px; padding: 5px 10px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer;">Pack Current Page</button>
      <button id="pack-generated" style="margin: 5px; padding: 5px 10px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer;" disabled>Pack Generated Interface</button>
      <div id="packing-status" style="font-size: 12px; color: #888; margin-top: 5px;">Generate interface first</div>
    </div>
    
    <div style="margin-bottom: 10px;">
      <h4 style="color: #4CAF50; margin: 5px 0;">4. Verify Zero-Loss</h4>
      <button id="verify-fidelity" style="margin: 5px; padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;" disabled>Calculate Fidelity</button>
      <div id="fidelity-results" style="font-size: 12px; margin-top: 5px;"></div>
    </div>
    
    <div id="test-results" style="background: #1a1a1a; padding: 10px; border-radius: 4px; max-height: 200px; overflow-y: auto; font-size: 11px; font-family: monospace;"></div>
    
    <input type="file" id="shapes-file-input" accept=".json" style="display: none;">
  `;
  
  document.body.appendChild(panel);
}

/**
 * Attach event listeners to packer UI elements
 */
function attachPackerEvents() {
  // Close button
  document.getElementById('packer-close').addEventListener('click', () => {
    document.getElementById('packer-ui').remove();
  });
  
  // Load shapes from file
  document.getElementById('load-shapes-file').addEventListener('click', () => {
    document.getElementById('shapes-file-input').click();
  });
  
  document.getElementById('shapes-file-input').addEventListener('change', handleShapesFileLoad);
  
  // Load current shapes
  document.getElementById('load-shapes-current').addEventListener('click', loadCurrentShapes);
  
  // Generate interface
  document.getElementById('generate-interface').addEventListener('click', generateInterfaceFromShapes);
  document.getElementById('preview-interface').addEventListener('click', previewGeneratedInterface);
  
  // Pack interface
  document.getElementById('pack-current-page').addEventListener('click', packCurrentPageToShapes);
  document.getElementById('pack-generated').addEventListener('click', packGeneratedInterface);
  
  // Verify fidelity
  document.getElementById('verify-fidelity').addEventListener('click', verifyRoundTripFidelity);
}

/**
 * Handle loading shapes from file
 */
function handleShapesFileLoad(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      originalShapes = JSON.parse(e.target.result);
      updateShapesStatus(`Loaded ${originalShapes.length} shapes from ${file.name}`);
      enableGenerationButtons();
      logToResults(`✅ Loaded ${originalShapes.length} shapes from file`);
    } catch (error) {
      updateShapesStatus(`Error loading file: ${error.message}`);
      logToResults(`❌ Error loading shapes: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

/**
 * Load shapes from current MAQNETIX session
 */
function loadCurrentShapes() {
  try {
    // Try to get shapes from global MAQNETIX variables
    if (window._aniotaAllShapes && Array.isArray(window._aniotaAllShapes)) {
      originalShapes = [...window._aniotaAllShapes];
      updateShapesStatus(`Loaded ${originalShapes.length} shapes from current session`);
      enableGenerationButtons();
      logToResults(`✅ Loaded ${originalShapes.length} shapes from current MAQNETIX session`);
    } else {
      throw new Error('No shapes found in current session');
    }
  } catch (error) {
    updateShapesStatus(`Error: ${error.message}`);
    logToResults(`❌ Error loading current shapes: ${error.message}`);
  }
}

/**
 * Generate web interface from loaded shapes
 */
function generateInterfaceFromShapes() {
  if (originalShapes.length === 0) {
    logToResults('❌ No shapes loaded');
    return;
  }
  
  try {
    const generatedInterface = generateInterface(originalShapes, {
      title: "MAQNETIX Generated Interface",
      theme: "default",
      responsive: true,
      pwa: true
    });
    
    // Store for later use
    window._packerGeneratedInterface = generatedInterface;
    
    updateGenerationStatus('Interface generated successfully');
    enablePackingButtons();
    logToResults(`✅ Generated interface with ${originalShapes.length} components`);
    logToResults(`📊 Layout: ${generatedInterface.layout.header.length} header, ${generatedInterface.layout.navigation.length} nav, ${generatedInterface.layout.sidebar.length} sidebar, ${generatedInterface.layout.main.length} main`);
    
  } catch (error) {
    updateGenerationStatus(`Error: ${error.message}`);
    logToResults(`❌ Generation error: ${error.message}`);
  }
}

/**
 * Preview generated interface in new window
 */
function previewGeneratedInterface() {
  if (!window._packerGeneratedInterface) {
    logToResults('❌ Generate interface first');
    return;
  }
  
  const { html, css, js } = window._packerGeneratedInterface;
  
  // Create complete HTML with embedded CSS and JS
  const completeHTML = html.replace(
    '<link rel="stylesheet" href="generated-styles.css">',
    `<style>${css}</style>`
  ).replace(
    '<script src="generated-interface.js"></script>',
    `<script>${js}</script>`
  );
  
  const previewWindow = window.open('', '_blank', 'width=1200,height=800');
  previewWindow.document.write(completeHTML);
  previewWindow.document.close();
  
  logToResults('👁️ Opened preview in new window');
}

/**
 * Pack current page back to shapes
 */
function packCurrentPageToShapes() {
  try {
    const packedShapes = packCurrentPage({
      viewport: { width: 1920, height: 1080 },
      preserveIds: true,
      inferFunctions: true
    });
    
    window._packerPackedShapes = packedShapes;
    updatePackingStatus(`Packed ${packedShapes.length} shapes from current page`);
    enableFidelityButton();
    logToResults(`✅ Packed current page into ${packedShapes.length} shapes`);
    
  } catch (error) {
    updatePackingStatus(`Error: ${error.message}`);
    logToResults(`❌ Packing error: ${error.message}`);
  }
}

/**
 * Pack generated interface back to shapes
 */
function packGeneratedInterface() {
  if (!window._packerGeneratedInterface) {
    logToResults('❌ Generate interface first');
    return;
  }
  
  try {
    // Create temporary DOM from generated HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = window._packerGeneratedInterface.html;
    
    const packedShapes = packInterface(tempDiv, {
      viewport: { width: 1920, height: 1080 },
      preserveIds: true,
      inferFunctions: true
    });
    
    window._packerPackedShapes = packedShapes;
    updatePackingStatus(`Packed ${packedShapes.length} shapes from generated interface`);
    enableFidelityButton();
    logToResults(`✅ Packed generated interface into ${packedShapes.length} shapes`);
    
  } catch (error) {
    updatePackingStatus(`Error: ${error.message}`);
    logToResults(`❌ Packing error: ${error.message}`);
  }
}

/**
 * Verify round-trip fidelity
 */
function verifyRoundTripFidelity() {
  if (!window._packerPackedShapes || originalShapes.length === 0) {
    logToResults('❌ Need both original and packed shapes');
    return;
  }
  
  try {
    const comparison = compareShapeArrays(originalShapes, window._packerPackedShapes);
    const fidelity = calculateFidelity(originalShapes, window._packerPackedShapes);
    
    currentTestResults = { comparison, fidelity };
    
    const fidelityPercent = Math.round(fidelity * 100);
    const fidelityColor = fidelity > 0.9 ? '#4CAF50' : fidelity > 0.7 ? '#FF9800' : '#F44336';
    
    updateFidelityResults(`
      <div style="color: ${fidelityColor}; font-weight: bold;">
        Fidelity Score: ${fidelityPercent}% ${fidelity === 1.0 ? '🎯 PERFECT!' : fidelity > 0.9 ? '🟢 EXCELLENT' : fidelity > 0.7 ? '🟡 GOOD' : '🔴 NEEDS WORK'}
      </div>
      <div style="margin-top: 5px; font-size: 11px;">
        Unchanged: ${comparison.unchanged.length} | 
        Modified: ${comparison.modified.length} | 
        Added: ${comparison.added.length} | 
        Removed: ${comparison.removed.length}
      </div>
    `);
    
    logToResults(`🎯 FIDELITY ANALYSIS:`);
    logToResults(`   Score: ${fidelityPercent}%`);
    logToResults(`   Unchanged: ${comparison.unchanged.length}`);
    logToResults(`   Modified: ${comparison.modified.length}`);
    logToResults(`   Added: ${comparison.added.length}`);
    logToResults(`   Removed: ${comparison.removed.length}`);
    
    if (fidelity === 1.0) {
      logToResults('🏆 ZERO-LOSS CONVERSION ACHIEVED!');
    }
    
  } catch (error) {
    updateFidelityResults(`Error: ${error.message}`);
    logToResults(`❌ Fidelity calculation error: ${error.message}`);
  }
}

/**
 * UI Helper Functions
 */
function updateShapesStatus(message) {
  document.getElementById('shapes-status').textContent = message;
}

function updateGenerationStatus(message) {
  document.getElementById('generation-status').textContent = message;
}

function updatePackingStatus(message) {
  document.getElementById('packing-status').textContent = message;
}

function updateFidelityResults(html) {
  document.getElementById('fidelity-results').innerHTML = html;
}

function enableGenerationButtons() {
  document.getElementById('generate-interface').disabled = false;
  document.getElementById('preview-interface').disabled = false;
}

function enablePackingButtons() {
  document.getElementById('pack-generated').disabled = false;
}

function enableFidelityButton() {
  document.getElementById('verify-fidelity').disabled = false;
}

function logToResults(message) {
  const resultsDiv = document.getElementById('test-results');
  const timestamp = new Date().toLocaleTimeString();
  resultsDiv.innerHTML += `<div>[${timestamp}] ${message}</div>`;
  resultsDiv.scrollTop = resultsDiv.scrollHeight;
}

/**
 * Export functionality for external use
 */
export function showPackerUI() {
  if (!document.getElementById('packer-ui')) {
    initPackerUI();
  }
}

export function hidePackerUI() {
  const panel = document.getElementById('packer-ui');
  if (panel) panel.remove();
}

/**
 * Get current test results
 */
export function getTestResults() {
  return currentTestResults;
}

/**
 * Download shapes as JSON file
 */
export function downloadShapes(shapes, filename = 'packed_shapes.json') {
  const dataStr = JSON.stringify(shapes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

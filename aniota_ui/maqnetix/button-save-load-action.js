
import { createToggleButton } from './button-maker.js';
import { getCurrentSaveTarget, detectPlatform } from './button-save-load-target.js';

async function getTargetLabel() {
  const target = await getCurrentSaveTarget();
  return target && target.label ? target.label : undefined;
}

function getOSLabel() {
  return detectPlatform();
}

import { addDotConnectLinesToShapes, renderDotConnectLinesFromShapes } from './button-toggle-grid-marks.js';

async function doSave() {
  const target = await getCurrentSaveTarget();
  if (typeof addDotConnectLinesToShapes === 'function') addDotConnectLinesToShapes();
  const shapes = window._aniotaAllShapes || [];
  // Helper for File System Access API
  async function saveWithFileSystemAccess(suggestedName) {
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName,
          types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(shapes, null, 2));
        await writable.close();
        // Immediately load back what we just saved
        window._aniotaAllShapes = shapes;
        if (typeof window.renderAllShapes === 'function') {
          window.renderAllShapes(window._aniotaAllShapes);
        }
        // Removed popup - shapes staying visible is confirmation enough
      } catch (e) {
        console.error('Save cancelled or failed:', e);
      }
    } else {
      console.error('File System Access API not supported in this browser.');
    }
  }
  // Helper for Chrome sync
  function saveWithChromeSync() {
    if (window.chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ aniotaShapes: shapes }, () => {
        // Immediately load back what we just saved
        window._aniotaAllShapes = shapes;
        if (typeof window.renderAllShapes === 'function') {
          window.renderAllShapes(window._aniotaAllShapes);
        }
        // Removed popup - shapes staying visible is confirmation enough
      });
    } else {
      console.error('chrome.storage.sync not available.');
    }
  }
  if (target.id === 'remote' || target.id === 'cloud') {
    try {
      const response = await fetch('/save-shapes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shapes),
      });
      if (response.ok) {
        alert('Saved to remote/cloud (shapes.json on server).');
      } else {
        alert('Failed to save to remote/cloud.');
      }
    } catch (e) {
      alert('Error saving to remote/cloud: ' + e);
    }
  } else if (target.id === 'local' || target.id === 'internal') {
    if (typeof window.saveShapesToLocalStorage === 'function') {
      window.saveShapesToLocalStorage();
      // Immediately load back what we just saved
      if (typeof window.loadShapesFromLocalStorage === 'function') {
        window.loadShapesFromLocalStorage();
        if (typeof window.renderAllShapes === 'function') {
          window.renderAllShapes(window._aniotaAllShapes);
        }
      }
      // Removed popup - shapes staying visible is confirmation enough
    } else {
      console.error('Local save function not available.');
    }
  } else if (target.id === 'documents' || target.id === 'config' || target.id === 'custom' || target.id === 'fs') {
    // Use File System Access API for these
    await saveWithFileSystemAccess('shapes.json');
  } else if (target.id === 'sync') {
    saveWithChromeSync();
  } else if (target.id === 'external') {
    alert('Saving to Android external storage is not supported in browser.');
  } else {
    alert('Saving to this target is not yet implemented.');
  }
}

async function doLoad() {
  const target = await getCurrentSaveTarget();
  // Helper for File System Access API
  async function loadWithFileSystemAccess() {
    if ('showOpenFilePicker' in window) {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
          multiple: false,
        });
        const file = await handle.getFile();
        const text = await file.text();
        const shapes = JSON.parse(text);
        window._aniotaAllShapes = shapes;
        // Render all loaded shapes from all areas (no area filtering)
        if (typeof window.renderAllShapes === 'function') {
          window.renderAllShapes(window._aniotaAllShapes);
        }
        // Try to refresh the UI after loading shapes (grid only, not shape filtering)
        if (typeof window.renderForTheme === 'function') {
          window.renderForTheme(window.currentTheme || 1);
        } else if (typeof window.refreshShapes === 'function') {
          window.refreshShapes();
        } else if (typeof window.drawAllShapes === 'function') {
          window.drawAllShapes();
        }
        // Re-initialize all buttons (including minimap) if available
        if (window.createAllButtons) {
          window.createAllButtons(window.currentTheme || 1, (themeNum) => {
            window.currentTheme = themeNum;
            if (typeof window.renderForTheme === 'function') {
              window.renderForTheme(themeNum);
            }
          });
        }
        // Removed popup - shapes appearing is confirmation enough
      } catch (e) {
        console.error('Load cancelled or failed:', e);
      }
    } else {
      console.error('File System Access API not supported in this browser.');
    }
  }
  // Helper for Chrome sync
  function loadWithChromeSync() {
    if (window.chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['aniotaShapes'], (result) => {
        if (result.aniotaShapes) {
          window._aniotaAllShapes = result.aniotaShapes;
          if (typeof window.renderForTheme === 'function')
            window.renderForTheme(window.currentTheme || 1);
          alert('Loaded from Chrome sync storage.');
        } else {
          alert('No shapes found in Chrome sync storage.');
        }
      });
    } else {
      alert('chrome.storage.sync not available.');
    }
  }
  if (target.id === 'remote' || target.id === 'cloud') {
    try {
      const response = await fetch('shapes.json');
      if (response.ok) {
        const shapes = await response.json();
        window._aniotaAllShapes = shapes;
        if (
          window.localSaveEnabled &&
          typeof window.saveShapesToLocalStorage === 'function'
        )
          window.saveShapesToLocalStorage();
        if (typeof window.renderForTheme === 'function')
          window.renderForTheme(window.currentTheme || 1);
        if (typeof renderDotConnectLinesFromShapes === 'function') renderDotConnectLinesFromShapes();
        alert('Loaded from remote/cloud (shapes.json).');
      } else {
        alert('Failed to load from remote/cloud.');
      }
    } catch (e) {
      alert('Error loading from remote/cloud: ' + e);
    }
  } else if (target.id === 'local' || target.id === 'internal') {
    if (typeof window.loadShapesFromLocalStorage === 'function') {
      window.loadShapesFromLocalStorage();
      // Render all shapes from all areas (no area filtering)
      if (typeof window.renderAllShapes === 'function') {
        window.renderAllShapes(window._aniotaAllShapes);
      }
      if (typeof window.renderForTheme === 'function')
        window.renderForTheme(window.currentTheme || 1);
      if (typeof renderDotConnectLinesFromShapes === 'function') renderDotConnectLinesFromShapes();
      // Removed popup - shapes appearing is confirmation enough
    } else {
      console.error('Local load function not available.');
    }
  } else if (target.id === 'documents' || target.id === 'config' || target.id === 'custom' || target.id === 'fs') {
    await loadWithFileSystemAccess();
    if (typeof renderDotConnectLinesFromShapes === 'function') renderDotConnectLinesFromShapes();
  } else if (target.id === 'sync') {
    loadWithChromeSync();
    if (typeof renderDotConnectLinesFromShapes === 'function') renderDotConnectLinesFromShapes();
  } else if (target.id === 'external') {
    alert('Loading from Android external storage is not supported in browser.');
  } else {
    alert('Loading from this target is not yet implemented.');
  }
}

export function createSaveButton(config = {}) {
  let saveBtn = null;
  async function updateSaveButton() {
    if (!saveBtn) return;
    const label = await getTargetLabel();
    const osLabel = getOSLabel();
    if (!label) {
      saveBtn.textContent = osLabel + ': Save';
      saveBtn.style.background = '#888';
      saveBtn.disabled = true;
    } else {
      saveBtn.textContent = osLabel + ': Save';
      saveBtn.style.background = '#4caf50';
      saveBtn.disabled = false;
    }
  }
  saveBtn = createToggleButton({
    id: 'save-action-btn',
    label: 'Save',
    right: '10px',
    onEnable: async () => {
      if (!(await getTargetLabel())) return;
      saveBtn.setState && saveBtn.setState('on');
      await doSave();
      await updateSaveButton();
    },
    onDisable: async () => {
      saveBtn.setState && saveBtn.setState('off');
      await updateSaveButton();
    },
    defaultActiveState: 'off',
    isSelectable: false,
    isDeletable: false,
    ...config,
  });
  updateSaveButton();
  return saveBtn;
}


export function createLoadButton(config = {}) {
  let loadBtn = null;
  async function updateLoadButton() {
    if (!loadBtn) return;
    const label = await getTargetLabel();
    const osLabel = getOSLabel();
    if (!label) {
      loadBtn.textContent = osLabel + ': Load';
      loadBtn.style.background = '#888';
      loadBtn.disabled = true;
    } else {
      loadBtn.textContent = osLabel + ': Load';
      loadBtn.style.background = '#ff9800';
      loadBtn.disabled = false;
    }
  }
  loadBtn = createToggleButton({
    id: 'load-action-btn',
    label: 'Load',
    right: '10px',
    onEnable: async () => {
      if (!(await getTargetLabel())) return;
      loadBtn.setState && loadBtn.setState('on');
      await doLoad();
      await updateLoadButton();
    },
    onDisable: async () => {
      loadBtn.setState && loadBtn.setState('off');
      await updateLoadButton();
    },
    defaultActiveState: 'off',
    isSelectable: false,
    isDeletable: false,
    ...config,
  });
  updateLoadButton();
  return loadBtn;
}

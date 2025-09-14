import { createToggleButton } from './button-maker.js';

let SAVE_TARGETS = [];
let currentSaveTargetIndex = 0;
let targetsLoaded = false;
let targetsLoadPromise = null;

export function detectPlatform() {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'Android';
  if (/CrOS/.test(ua) || /Chromebook/i.test(ua)) return 'Chrome';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac';
  return 'Chrome'; // fallback
}

export async function getCurrentSaveTarget() {
  await loadTargets();
  return SAVE_TARGETS[currentSaveTargetIndex];
}

export function createSaveTargetSelectionButton(config = {}) {
  let btn = null;
  let updateButton = async () => {
    await loadTargets();
    if (!btn) return;
    if (!SAVE_TARGETS.length) {
      btn.textContent = 'Target: None';
      btn.style.background = '#888';
      btn.disabled = true;
      btn.title = 'No targets available.';
      return;
    }
    btn.textContent = 'Target: ' + SAVE_TARGETS[currentSaveTargetIndex]?.label;
    btn.style.background = '#2196f3'; // Always blue for active
    btn.disabled = false;
    btn.title = SAVE_TARGETS[currentSaveTargetIndex]?.description || '';
    // Persist currentSaveTargetIndex
    localStorage.setItem('maqnetix_save_target_index', currentSaveTargetIndex);
  };

  // Set default to 'Custom' if available, or restore from localStorage
  const setDefaultTarget = async () => {
    await loadTargets();
    const savedIndex = localStorage.getItem('maqnetix_save_target_index');
    if (savedIndex !== null && !isNaN(savedIndex) && SAVE_TARGETS[savedIndex]) {
      currentSaveTargetIndex = parseInt(savedIndex);
    } else {
      const customIndex = SAVE_TARGETS.findIndex(t => t.label && t.label.toLowerCase().includes('custom'));
      currentSaveTargetIndex = customIndex !== -1 ? customIndex : 0;
    }
    updateButton();
  };

  btn = createToggleButton({
    id: 'save-target-selection-btn',
    label: 'Loading Target...',
    right: '10px',
    onEnable: async () => {
      await loadTargets();
      if (!SAVE_TARGETS.length) return;
      // Only cycle through valid targets (no 'off' states)
      currentSaveTargetIndex = (currentSaveTargetIndex + 1) % SAVE_TARGETS.length;
      updateButton();
    },
    onDisable: () => {},
    defaultActiveState: 'on',
    isSelectable: false,
    isDeletable: false,
    ...config,
  });
  setDefaultTarget();
  return btn;
}

export { SAVE_TARGETS, currentSaveTargetIndex };

async function loadTargets() {
  if (targetsLoaded) return SAVE_TARGETS;
  if (targetsLoadPromise) return targetsLoadPromise;
  targetsLoadPromise = fetch('./save-and-load-info.json')
    .then(r => r.json())
    .then(targetsInfo => {
      const platform = detectPlatform().toLowerCase();
      let platformKey = platform;
      if (platform === 'mac' && !targetsInfo.targets['mac']) platformKey = 'chrome';
      const arr = (targetsInfo.targets[platformKey] || targetsInfo.targets['chrome'])
        .map(t => ({
          label: t.label,
          color: '#2196f3', // Always blue for active
          id: t.id,
          description: t.description,
          ...t
        }));
      SAVE_TARGETS = arr;
      targetsLoaded = true;
      return SAVE_TARGETS;
    });
  return targetsLoadPromise;
}


export function saveShapesToLocalStorage() {
  try {
    if (window._aniotaAllShapes) {
      console.log('[local_UICA_storage.js] Saving shapes to localStorage:', JSON.stringify(window._aniotaAllShapes, null, 2));
      localStorage.setItem('aniota_shapes', JSON.stringify(window._aniotaAllShapes));
      console.log('[local_UICA_storage.js] Shapes saved to localStorage');
    }
  } catch (e) {
    console.error('[local_UICA_storage.js] Error saving shapes to localStorage:', e);
  }
}

export function loadShapesFromLocalStorage() {
  try {
    const data = localStorage.getItem('aniota_shapes');
    if (data) {
      const shapes = JSON.parse(data);
      if (Array.isArray(shapes)) {
        window._aniotaAllShapes = shapes;
        console.log('[local_UICA_storage.js] Shapes loaded from localStorage:', JSON.stringify(window._aniotaAllShapes, null, 2));
        return true;
      }
    }
  } catch (e) {
    console.error('[local_UICA_storage.js] Error loading shapes from localStorage:', e);
  }
  return false;
}

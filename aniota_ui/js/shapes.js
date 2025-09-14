import { reloadUICAForArea } from './shapesLoader.js';

export function autoFitBlueprintToWorkspace() {
  // Auto-fit all shapes in all areas using reloadUICAForArea with scaling
  if (!window._aniotaAllShapes || !Array.isArray(window._aniotaAllShapes)) {
    console.log("No shapes loaded to auto-fit.");
    return;
  }
  
  // Get all unique area numbers from shapes
  const areas = [...new Set(window._aniotaAllShapes.map(s => s.area))];
  
  // Process all areas first (fine-tuning)
  areas.forEach(areaNum => {
    // Only auto-fit shapes in this area
    const shapesInArea = window._aniotaAllShapes.filter(s => s.area === areaNum);
    // Fine-tune expansion for each area
    fineTuneShapeExpansion(shapesInArea, areaNum);
  });
  
  // Now re-render everything at once to avoid clearing issue
  // Use the current theme/area for rendering
  const currentArea = window.currentTheme || 1;
  reloadUICAForArea(currentArea, window._aniotaAllShapes, { preserveExactPositions: true });
  
  console.log("Auto-fit and fine-tune complete for all areas.");
}

function fineTuneShapeExpansion(shapes, areaNum) {
  if (!Array.isArray(shapes) || shapes.length === 0) return;
  // Sort by 'created' timestamp (ascending)
  shapes.sort((a, b) => new Date(a.created) - new Date(b.created));
  // Track current increment for each shape
  const increments = shapes.map(() => 100);
  const minIncrement = 1;
  let anyExpanded = true;
  // Helper: clone shape for overlap test
  function cloneShape(s) {
    return { ...s };
  }
  // Helper: check overlap between two shapes (allow touching)
  function overlap(a, b) {
    const ax = parseInt(a.x), ay = parseInt(a.y), aw = parseInt(a.width), ah = parseInt(a.height);
    const bx = parseInt(b.x), by = parseInt(b.y), bw = parseInt(b.width), bh = parseInt(b.height);
    // If they only touch at edge/corner, not overlap
    if (ax + aw <= bx || bx + bw <= ax || ay + ah <= by || by + bh <= ay) return false;
    // Otherwise, overlap
    return true;
  }
  // Expand all shapes incrementally
  while (anyExpanded) {
    anyExpanded = false;
    for (let i = 0; i < shapes.length; i++) {
      if (increments[i] < minIncrement) continue;
      const s = shapes[i];
      // Expand equally in all directions from center
      const origW = parseInt(s.width), origH = parseInt(s.height);
      const origX = parseInt(s.x), origY = parseInt(s.y);
      const inc = increments[i];
      // New size
      const newW = origW + inc;
      const newH = origH + inc;
      // Keep center
      const centerX = origX + origW / 2;
      const centerY = origY + origH / 2;
      const newX = Math.round(centerX - newW / 2);
      const newY = Math.round(centerY - newH / 2);
      // Create test shape
      const testShape = { ...s, x: newX, y: newY, width: newW, height: newH };
      // Check for overlap with all other shapes
      let hasOverlap = false;
      for (let j = 0; j < shapes.length; j++) {
        if (i === j) continue;
        if (overlap(testShape, shapes[j])) {
          hasOverlap = true;
          break;
        }
      }
      if (!hasOverlap) {
        // Accept new size/position
        s.x = newX;
        s.y = newY;
        s.width = newW;
        s.height = newH;
        anyExpanded = true;
      } else {
        // Halve increment for next try
        increments[i] = Math.floor(inc / 2);
      }
    }
  }
}

export function moveSquareToArea(squares, areaNum) {
  // Implement logic to move squares to a specified area
}

export function findPossibleDuplicateShapes(shapes) {
  if (!Array.isArray(shapes)) return [];
  const dups = [];
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      const a = shapes[i], b = shapes[j];
      if (
        (a.x == b.x &&
          a.y == b.y &&
          a.width == b.width &&
          a.height == b.height) ||
        rectsOverlap(a, b)
      ) {
        dups.push([a, b]);
      }
    }
  }
  return dups;
}

export function rectsOverlap(a, b) {
  const ax = parseInt(a.x), ay = parseInt(a.y), aw = parseInt(a.width), ah = parseInt(a.height);
  const bx = parseInt(b.x), by = parseInt(b.y), bw = parseInt(b.width), bh = parseInt(b.height);
  const overlapX = Math.max(0, Math.min(ax + aw, bx + bw) - Math.max(ax, bx));
  const overlapY = Math.max(0, Math.min(ay + ah, by + bh) - Math.max(ay, by));
  const overlapArea = overlapX * overlapY;
  if (overlapX === 0 || overlapY === 0) return false;
  return overlapArea >= 64;
}

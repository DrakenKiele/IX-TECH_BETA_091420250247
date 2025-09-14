

const THEME_COLORS = [
  '#F44336', // Red
  '#FF9800', // Orange
  '#FFEB3B', // Yellow
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#3F51B5', // Indigo
  '#9C27B0', // Violet
  '#000000', // Black
  '#FFFFFF', // White
];

/**
 * Generate a grid layout for shapes
 * @param {number} rows - Number of grid rows
 * @param {number} cols - Number of grid columns
 * @param {number} cellSize - Size of each cell
 * @returns {object[]} Array of grid cell objects with position and theme color
 */
function generateGrid(rows, cols, cellSize) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const areaIndex = (r * cols + c) % THEME_COLORS.length;
      grid.push({
        row: r,
        col: c,
        x: c * cellSize,
        y: r * cellSize,
        size: cellSize,
        themeColor: THEME_COLORS[areaIndex],
      });
    }
  }
  return grid;
}


/**
 * Snap a shape to the nearest grid cell
 * @param {object} shape - Shape data object
 * @param {object[]} grid - Array of grid cell objects
 * @returns {object} Updated shape data object
 */
function snapShapeToGrid(shape, grid) {
  if (!shape || !Array.isArray(grid)) throw new Error('Invalid inputs');
  // Find nearest cell by Euclidean distance
  let minDist = Infinity;
  let nearestCell = null;
  grid.forEach(cell => {
    const dx = shape.position.x - cell.x;
    const dy = shape.position.y - cell.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < minDist) {
      minDist = dist;
      nearestCell = cell;
    }
  });
  if (!nearestCell) return shape;
  return {
    ...shape,
    position: { x: nearestCell.x, y: nearestCell.y },
    themeColor: nearestCell.themeColor,
  };
}

// Exported API
export { generateGrid, snapShapeToGrid, THEME_COLORS };

// End of gridFormationModule.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

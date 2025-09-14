
/**
 * Get the four corner coordinates of a block given its shape object.
 * @param {Object} shape - Shape object from shapes.json
 * @returns {Object} { topLeft, topRight, bottomLeft, bottomRight }
 */
export function getBlockCorners(shape) {
  const x = Number(shape.x);
  const y = Number(shape.y);
  const w = parseInt(shape.width);
  const h = parseInt(shape.height);
  return {
    topLeft: { x, y },
    topRight: { x: x + w, y },
    bottomLeft: { x, y: y + h },
    bottomRight: { x: x + w, y: y + h }
  };
}

/**
 * Generalize the block's logical location on the page and relative to other blocks.
 * @param {Object} shape - Shape object
 * @param {Array} allShapes - Array of all shape objects
 * @param {Object} [pageDims] - { width, height } of the page
 * @returns {Object} { area: 'upper left', isEdge: true/false, ... }
 */
export function generalizeBlockLocation(shape, allShapes, pageDims = { width: 1920, height: 1080 }) {
  const { x, y, width, height } = shape;
  const w = parseInt(width);
  const h = parseInt(height);
  // Simple logic: divide page into 3x3 grid
  const col = x < pageDims.width / 3 ? 0 : x < 2 * pageDims.width / 3 ? 1 : 2;
  const row = y < pageDims.height / 3 ? 0 : y < 2 * pageDims.height / 3 ? 1 : 2;
  const areaNames = [
    ['upper left', 'upper center', 'upper right'],
    ['middle left', 'center', 'middle right'],
    ['lower left', 'lower center', 'lower right']
  ];
  const area = areaNames[row][col];
  // Is this block at the edge?
  const isEdge = col === 0 || col === 2 || row === 0 || row === 2;
  // Find neighbors (blocks that share row or col)
  const neighbors = allShapes.filter(s => s.id !== shape.id && (
    Math.abs(Number(s.x) - Number(x)) < w || Math.abs(Number(s.y) - Number(y)) < h
  ));
  return {
    area,
    isEdge,
    neighbors: neighbors.map(n => n.id),
    label: shape.label,
    type: shape.type
  };
}

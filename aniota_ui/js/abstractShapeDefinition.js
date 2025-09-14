
const SHAPE_TYPES = ['Square', 'Circle', 'Rhombus', 'Trapezoid', 'Symbie'];

const DEFAULT_PROPERTIES = {
  size: 100,
  position: { x: 0, y: 0 },
  color: '#2196F3', // DK Softworks brand blue
  border: { color: '#222', width: 2 },
  opacity: 1.0,
  label: '',
};


/**
 * Create a new abstract shape object
 * @param {string} type - Shape type (Square, Circle, etc.)
 * @param {object} props - Optional properties to override defaults
 * @returns {object} Shape data object
 */
function createShape(type, props = {}) {
  if (!SHAPE_TYPES.includes(type)) throw new Error('Invalid shape type');
  return {
    type,
    ...JSON.parse(JSON.stringify(DEFAULT_PROPERTIES)),
    ...props,
    id: 'shape_' + Math.random().toString(36).substr(2, 9),
  };
}

//
// Example usage:
// const myCircle = createShape('Circle', { size: 120, color: '#FF9800', label: 'NavButton' });
//

/**
 * Validate a shape object
 * @param {object} shape - Shape data object
 * @returns {boolean} True if valid, false otherwise
 */
function validateShape(shape) {
  return shape && SHAPE_TYPES.includes(shape.type) && typeof shape.size === 'number';
}

//
// Example usage:
// validateShape(myCircle);
//

/**
 * List all supported shape types
 * @returns {string[]} Array of shape type names
 */
function getSupportedShapeTypes() {
  return [...SHAPE_TYPES];
}

// Exported API
export { createShape, validateShape, getSupportedShapeTypes };

// End of abstractShapeDefinition.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

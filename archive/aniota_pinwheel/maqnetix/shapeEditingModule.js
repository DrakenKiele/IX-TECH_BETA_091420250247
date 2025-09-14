

/**
 * Edit properties of a shape object
 * @param {object} shape - Shape data object
 * @param {object} newProps - Properties to update
 * @returns {object} Updated shape data object
 */
function editShape(shape, newProps = {}) {
  if (!shape || typeof shape !== 'object') throw new Error('Invalid shape object');
  return {
    ...shape,
    ...newProps,
  };
}


/**
 * Move a shape to a new position
 * @param {object} shape - Shape data object
 * @param {number} x - New x position
 * @param {number} y - New y position
 * @returns {object} Updated shape data object
 */
function moveShape(shape, x, y) {
  if (!shape || typeof shape !== 'object') throw new Error('Invalid shape object');
  return {
    ...shape,
    position: { x, y },
  };
}


/**
 * Resize a shape
 * @param {object} shape - Shape data object
 * @param {number} newSize - New size value
 * @returns {object} Updated shape data object
 */
function resizeShape(shape, newSize) {
  if (!shape || typeof shape !== 'object') throw new Error('Invalid shape object');
  return {
    ...shape,
    size: newSize,
  };
}

//
// Example usage:
// const resizedShape = resizeShape(myCircle, 180);
//

// Exported API
export { editShape, moveShape, resizeShape };

// End of shapeEditingModule.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

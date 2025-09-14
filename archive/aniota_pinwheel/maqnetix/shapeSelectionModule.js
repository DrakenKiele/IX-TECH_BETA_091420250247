

/**
 * Select a shape by ID
 * @param {string} shapeId - ID of the shape to select
 * @param {object[]} shapes - Array of shape data objects
 * @returns {object|null} Selected shape object or null if not found
 */
function selectShapeById(shapeId, shapes) {
  if (!Array.isArray(shapes)) throw new Error('Shapes must be an array');
  return shapes.find(shape => shape.id === shapeId) || null;
}


/**
 * Select multiple shapes by IDs
 * @param {string[]} shapeIds - Array of shape IDs to select
 * @param {object[]} shapes - Array of shape data objects
 * @returns {object[]} Array of selected shape objects
 */
function selectShapesByIds(shapeIds, shapes) {
  if (!Array.isArray(shapes)) throw new Error('Shapes must be an array');
  return shapes.filter(shape => shapeIds.includes(shape.id));
}


/**
 * Get all selected shapes from a selection state
 * @param {object} selectionState - Object with selected shape IDs
 * @param {object[]} shapes - Array of shape data objects
 * @returns {object[]} Array of selected shape objects
 */
function getSelectedShapes(selectionState, shapes) {
  if (!selectionState || !Array.isArray(selectionState.selectedIds)) return [];
  return selectShapesByIds(selectionState.selectedIds, shapes);
}

// Exported API
export { selectShapeById, selectShapesByIds, getSelectedShapes };

// End of shapeSelectionModule.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

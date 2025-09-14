

/**
 * Merge multiple shapes into a single shape
 * @param {object[]} shapes - Array of shape data objects to merge
 * @param {object} mergeProps - Properties for the merged shape
 * @returns {object} Merged shape data object
 */
function mergeShapes(shapes, mergeProps = {}) {
  if (!Array.isArray(shapes) || shapes.length < 2) throw new Error('At least two shapes required to merge');
  // Example: merged shape inherits type from first, combines labels, averages position/size
  const type = shapes[0].type;
  const label = shapes.map(s => s.label).join('+');
  const avgSize = Math.round(shapes.reduce((sum, s) => sum + s.size, 0) / shapes.length);
  const avgX = Math.round(shapes.reduce((sum, s) => sum + s.position.x, 0) / shapes.length);
  const avgY = Math.round(shapes.reduce((sum, s) => sum + s.position.y, 0) / shapes.length);
  return {
    type,
    size: avgSize,
    position: { x: avgX, y: avgY },
    color: mergeProps.color || '#673AB7', // DK Softworks brand purple
    border: mergeProps.border || { color: '#222', width: 2 },
    opacity: mergeProps.opacity || 1.0,
    label,
    id: 'merged_' + Math.random().toString(36).substr(2, 9),
    mergedFrom: shapes.map(s => s.id),
  };
}


/**
 * Group multiple shapes into a group object
 * @param {object[]} shapes - Array of shape data objects to group
 * @param {string} groupLabel - Label for the group
 * @returns {object} Grouped shape object
 */
function groupShapes(shapes, groupLabel = 'Group') {
  if (!Array.isArray(shapes) || shapes.length < 2) throw new Error('At least two shapes required to group');
  return {
    type: 'Group',
    shapes: shapes.map(s => ({ ...s })),
    label: groupLabel,
    id: 'group_' + Math.random().toString(36).substr(2, 9),
  };
}


/**
 * Apply blueprint logic to a shape or group
 * @param {object} shapeOrGroup - Shape or group object
 * @param {object} blueprint - Blueprint properties to apply
 * @returns {object} Updated shape or group object
 */
function applyBlueprint(shapeOrGroup, blueprint = {}) {
  return {
    ...shapeOrGroup,
    blueprint: { ...blueprint },
  };
}

// Exported API
export { mergeShapes, groupShapes, applyBlueprint };

// End of shapeTransformationModule.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

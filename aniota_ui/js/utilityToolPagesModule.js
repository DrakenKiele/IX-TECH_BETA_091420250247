

/**
 * Generate a color picker utility page from shape data
 * @param {object[]} shapes - Array of shape data objects
 * @returns {string} HTML markup for color picker page
 */
function generateColorPickerPage(shapes) {
  const colorOptions = shapes.map(s => s.color).filter((v, i, a) => a.indexOf(v) === i);
  return `
    <div class="color-picker">
      ${colorOptions.map(color => `<button style="background:${color};width:32px;height:32px;border-radius:8px;margin:4px;" title="${color}"></button>`).join('')}
    </div>
  `;
}


/**
 * Generate a blueprint editor utility page from blueprint data
 * @param {object[]} blueprints - Array of blueprint objects
 * @returns {string} HTML markup for blueprint editor page
 */
function generateBlueprintEditorPage(blueprints) {
  return `
    <div class="blueprint-editor">
      ${blueprints.map(bp => `<div class="blueprint-item">${JSON.stringify(bp)}</div>`).join('')}
    </div>
  `;
}


/**
 * Generate a snapshot manager utility page from snapshot data
 * @param {object[]} snapshots - Array of snapshot objects
 * @returns {string} HTML markup for snapshot manager page
 */
function generateSnapshotManagerPage(snapshots) {
  return `
    <div class="snapshot-manager">
      ${snapshots.map(snap => `<div class="snapshot-item">${snap.label || 'Snapshot'} - ${new Date(snap.timestamp).toLocaleString()}</div>`).join('')}
    </div>
  `;
}

// Exported API
export { generateColorPickerPage, generateBlueprintEditorPage, generateSnapshotManagerPage };

// End of utilityToolPagesModule.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

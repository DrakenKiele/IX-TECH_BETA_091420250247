

/**
 * Export data to JSON string
 * @param {object} data - Data object to export
 * @returns {string} JSON string
 */
function exportToJSON(data) {
  return JSON.stringify(data, null, 2);
}


/**
 * Import data from JSON string
 * @param {string} jsonStr - JSON string to import
 * @returns {object} Parsed data object
 */
function importFromJSON(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Invalid JSON string');
  }
}


/**
 * Save JSON data to a file (browser only)
 * @param {string} filename - Name of the file to save
 * @param {string} jsonStr - JSON string to save
 */
function saveJSONToFile(filename, jsonStr) {
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Exported API
export { exportToJSON, importFromJSON, saveJSONToFile };

// End of dataExportImportModule.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

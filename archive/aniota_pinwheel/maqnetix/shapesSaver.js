
async function saveShapesToChromeLocal(shapes) {
  return new Promise((resolve, reject) => {
    if (!chrome?.storage?.local) {
      console.error("[shapesSaver] chrome.storage.local not available");
      return reject("chrome.storage.local not available");
    }
    chrome.storage.local.set({ shapes }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "[shapesSaver] Error saving to chrome.storage.local:",
          chrome.runtime.lastError
        );
        return reject(chrome.runtime.lastError);
      }
      console.log("[shapesSaver] Saved shapes to chrome.storage.local");
      resolve();
    });
  });
}

async function saveShapesToAppData(shapes, appName = "Aniota") {
  try {
    const fs = require("fs");
    const path = require("path");
    const appDataPath = path.join(process.env.APPDATA, appName, "shapes.json");
    fs.mkdirSync(path.dirname(appDataPath), { recursive: true });
    fs.writeFileSync(appDataPath, JSON.stringify(shapes, null, 2));
    console.log("[shapesSaver] Saved shapes to AppData:", appDataPath);
  } catch (e) {
    console.error("[shapesSaver] Error saving to AppData:", e);
    throw e;
  }
}

async function saveShapesToCustomFile(shapes) {
  if ("showSaveFilePicker" in window) {
    const handle = await window.showSaveFilePicker({
      suggestedName: "shapes.json",
      types: [
        {
          description: "JSON Files",
          accept: { "application/json": [".json"] },
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(shapes, null, 2));
    await writable.close();
    console.log("[shapesSaver] Saved shapes to custom file");
  } else {
    // Fallback: download as file
    const blob = new Blob([JSON.stringify(shapes, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shapes.json";
    a.click();
    URL.revokeObjectURL(url);
    console.log("[shapesSaver] Downloaded shapes as file");
  }
}

// Validation utility for required fields
function validateShape(shape) {
  const requiredFields = {
    id: "string",
    label: "string",
    type: "string",
    background: "string",
    width: "number",
    height: "number",
    x: "number",
    y: "number",
    zIndex: "number",
    shape: "string",
    area: "number",
    state: "string",
  };
  const missing = [];
  for (const [key, type] of Object.entries(requiredFields)) {
    if (
      !(key in shape) ||
      typeof shape[key] !== type ||
      (type === "string" && !shape[key])
    ) {
      missing.push(key);
    }
  }
  return missing;
}

// Dispatcher function to select save method by targetId, with validation
async function saveShapes(targetId, shapes) {
  let anyInvalid = false;
  shapes.forEach((shape, idx) => {
    const missing = validateShape(shape);
    if (missing.length > 0) {
      anyInvalid = true;
      alert(
        `Shape at index ${idx} (id: ${
          shape.id || "N/A"
        }) is missing required fields:\n` +
          missing.map((f) => `- ${f}`).join("\n")
      );
    }
  });
  if (anyInvalid) {
    throw new Error(
      "One or more shapes are missing required fields. Save aborted."
    );
  }
  switch (targetId) {
    case "local":
      return saveShapesToChromeLocal(shapes);
    case "config":
      return saveShapesToAppData(shapes);
    case "custom":
      return saveShapesToCustomFile(shapes);
    default:
      throw new Error("Unknown save target: " + targetId);
  }
}

// Export for use in other modules
window.saveShapesToChromeLocal = saveShapesToChromeLocal;
window.saveShapesToAppData = saveShapesToAppData;
window.saveShapesToCustomFile = saveShapesToCustomFile;
window.saveShapes = saveShapes;

export {
  saveShapesToChromeLocal,
  saveShapesToAppData,
  saveShapesToCustomFile,
  saveShapes,
};
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------


function validateShape(shape) {
  // List of required fields and their expected types
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

function validateShapesAndAlert(shapes) {
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
  return !anyInvalid;
}

window.validateShape = validateShape;
window.validateShapesAndAlert = validateShapesAndAlert;

export { validateShape, validateShapesAndAlert };


function createRadixJson({
  id,
  title,
  description = "",
  category = "",
  version = "1.0",
  author = "DK Softworks LLC",
  icon = "",
  items = []
}) {
  const now = new Date().toISOString().slice(0, 10);
  return {
    id,
    title,
    description,
    category,
    version,
    author,
    created: now,
    updated: now,
    icon,
    items,
    arrowLogic: {
      up: "expand",
      down: "review",
      left: "extend"
    }
  };
}


if (typeof module !== 'undefined') {
  module.exports = { createRadixJson };
}

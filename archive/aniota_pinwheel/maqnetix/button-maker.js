

export const customButtons = [];

export const selectedCustomButtons = new Set();



export function createToggleButton({
  id,
  label,
  right = "10px",
  initialTop = null,
  onEnable = () => {},
  onDisable = () => {},
  styleOverrides = {},
  theme = {}, // Accept theme overrides here
  defaultActiveState = "on", // or "off", determines which state is first after inactive
  isSelectable = false,
  isDeletable = false,
}) {
  const topPos = initialTop !== null ? initialTop : 10;

  let btn = document.getElementById(id);
  if (!btn) {
    btn = document.createElement("button");
    btn.id = id;
    document.body.appendChild(btn);
  }

  btn.textContent = label;

  // Apply CSS variables for theming, with sensible defaults
  btn.style.setProperty("--btn-bg", theme.background || "#111");
  btn.style.setProperty("--btn-color", theme.color || "#fff");
  btn.style.setProperty("--btn-bg-enabled-on", theme.backgroundEnabledOn || "#4caf50");
  btn.style.setProperty("--btn-bg-enabled-off", theme.backgroundEnabledOff || "#f44336");
  btn.style.setProperty("--btn-bg-inactive", theme.backgroundInactive || "#444");
  btn.style.setProperty("--btn-font-family", theme.fontFamily || "'Noto Sans', sans-serif");

  Object.assign(btn.style, {
    position: "fixed",
    top: topPos + "px",
    right: right,
    zIndex: 10001,
    background: "var(--btn-bg-inactive)",
    color: "var(--btn-color)",
    cursor: "pointer",
    fontFamily: "var(--btn-font-family)",
    border: "none",
    padding: "0 14px",
    height: "20px",
    lineHeight: "20px",
    borderRadius: "4px",
    transition: "background 0.3s ease",
    ...styleOverrides,
  });

  // Three states: inactive, on, off
  let state = "inactive"; // "inactive", "on", "off"
  btn.isSelectable = isSelectable;
  btn.isDeletable = isDeletable;
  btn.isSelected = false;

  function updateButtonStyle() {
    if (btn.isSelected) {
      btn.style.outline = '3px solid #2196f3';
    } else {
      btn.style.outline = '';
    }
    if (state === "inactive") {
      btn.style.background = "var(--btn-bg-inactive)";
      btn.style.opacity = 0.7;
    } else if (state === "on") {
      btn.style.background = "var(--btn-bg-enabled-on)";
      btn.style.opacity = 1;
    } else if (state === "off") {
      btn.style.background = "var(--btn-bg-enabled-off)";
      btn.style.opacity = 1;
    }
  }

  btn.onclick = (e) => {
    // If selectable, allow selection with ctrl/cmd or click
    if (btn.isSelectable && (e.ctrlKey || e.metaKey)) {
      btn.isSelected = !btn.isSelected;
      // Find the custom button for this button
      const customBtn = findCustomButtonByDom(btn);
      if (btn.isSelected && customBtn) selectedCustomButtons.add(customBtn);
      else if (customBtn) selectedCustomButtons.delete(customBtn);
      updateButtonStyle();
      return;
    }
    if (state === "inactive") {
      state = defaultActiveState;
      if (state === "on") onEnable();
      else onDisable();
    } else if (state === "on") {
      state = "off";
      onDisable();
    } else if (state === "off") {
      state = "on";
      onEnable();
    }
    updateButtonStyle();
  };

  // Keyboard delete support
  btn.addEventListener('keydown', (e) => {
    if (btn.isSelectable && btn.isDeletable && (e.key === 'Delete' || e.key === 'Backspace')) {
      // Find the custom button for this button
      const customBtn = findCustomButtonByDom(btn);
      if (customBtn) {
        btn.remove();
        selectedCustomButtons.delete(customBtn);
        const idx = customButtons.indexOf(customBtn);
        if (idx !== -1) customButtons.splice(idx, 1);
      }
    }
  });

  // Make button focusable for keyboard events
  if (btn.isSelectable) btn.tabIndex = 0;

  // Start inactive
  updateButtonStyle();

  // Optionally expose state for external control
  btn.getState = () => state;
  btn.setState = (newState) => {
    if (["inactive", "on", "off"].includes(newState)) {
      state = newState;
      updateButtonStyle();
    }
  };

  return btn;
}

function findCustomButtonByDom(dom) {
  return customButtons.find(b => b.domElement === dom);
}
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

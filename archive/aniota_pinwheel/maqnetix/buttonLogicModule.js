

/**
 * Create a modular button object
 * @param {string} label - Button label
 * @param {function} onClick - Click event handler
 * @param {object} options - Additional button options (color, size, etc.)
 * @returns {object} Button object
 */
function createButton(label, onClick, options = {}) {
  return {
    label,
    onClick,
    ...options,
    id: 'btn_' + Math.random().toString(36).substr(2, 9),
  };
}


/**
 * Render a button as HTML
 * @param {object} button - Button object
 * @returns {string} HTML markup for the button
 */
function renderButtonHTML(button) {
  const color = button.color || '#2196F3';
  const size = button.size === 'large' ? '48px' : '32px';
  return `<button id="${button.id}" style="background:${color};font-family:Noto Sans Rounded;font-size:${size};border-radius:8px;padding:8px 16px;">${button.label}</button>`;
}


/**
 * Attach button event listeners (browser only)
 * @param {object[]} buttons - Array of button objects
 */
function attachButtonEvents(buttons) {
  buttons.forEach(btn => {
    const el = document.getElementById(btn.id);
    if (el && typeof btn.onClick === 'function') {
      el.onclick = btn.onClick;
    }
  });
}

// Exported API
export { createButton, renderButtonHTML, attachButtonEvents };

// End of buttonLogicModule.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

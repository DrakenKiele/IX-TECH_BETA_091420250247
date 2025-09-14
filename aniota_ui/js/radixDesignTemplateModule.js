

const RADIX_COLORS = {
  primary: '#00B8D9',
  accent: '#FFB300',
  background: '#F4F7FA',
  surface: '#FFFFFF',
  border: '#222',
  text: '#222',
};

const RADIX_FONT = 'Noto Sans Rounded, Arial, sans-serif';

/**
 * Generate RADIX-style container HTML
 * @param {string} content - Inner HTML content
 * @returns {string} RADIX container markup
 */
function renderRadixContainer(content) {
  return `
    <div style="background:${RADIX_COLORS.background};border-radius:24px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.08);font-family:${RADIX_FONT};">
      ${content}
    </div>
  `;
}

/**
 * Generate a RADIX-style navigation bar
 * @param {object[]} navItems - Array of navigation item objects { label, href }
 * @returns {string} RADIX nav bar markup
 */
function renderRadixNavBar(navItems) {
  return `
    <nav style="display:flex;gap:24px;background:${RADIX_COLORS.surface};border-bottom:2px solid ${RADIX_COLORS.border};padding:16px 32px;font-family:${RADIX_FONT};">
      ${navItems.map(item => `<a href="${item.href}" style="color:${RADIX_COLORS.primary};text-decoration:none;font-weight:600;font-size:18px;">${item.label}</a>`).join('')}
    </nav>
  `;
}

/**
 * Generate a RADIX-style button
 * @param {string} label - Button label
 * @param {string} color - Button color
 * @returns {string} RADIX button markup
 */
function renderRadixButton(label, color = RADIX_COLORS.primary) {
  return `<button style="background:${color};color:${RADIX_COLORS.surface};border:none;border-radius:12px;padding:12px 24px;font-family:${RADIX_FONT};font-size:16px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.06);cursor:pointer;">${label}</button>`;
}

export { RADIX_COLORS, RADIX_FONT, renderRadixContainer, renderRadixNavBar, renderRadixButton };

// End of radixDesignTemplateModule.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

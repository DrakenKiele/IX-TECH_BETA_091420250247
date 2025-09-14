
const BUBBLE_SIZES = {
  small: 60,
  medium: 120,
  large: 220,
};

const BUBBLE_TYPES = ['small', 'medium', 'large'];


/**
 * Create a bubble object
 * @param {string} type - 'small', 'medium', or 'large'
 * @param {object} content - Content for the bubble
 * @param {object} position - { x, y } coordinates
 * @returns {object} Bubble object
 */
function createBubble(type, content, position) {
  if (!BUBBLE_TYPES.includes(type)) throw new Error('Invalid bubble type');
  return {
    type,
    size: BUBBLE_SIZES[type],
    content,
    position,
    id: 'bubble_' + Math.random().toString(36).substr(2, 9),
    selected: false,
  };
}

/**
 * Render a bubble as HTML
 * @param {object} bubble - Bubble object
 * @returns {string} HTML markup for the bubble
 */
function renderBubbleHTML(bubble) {
  const { type, size, content, position, selected } = bubble;
  let inner = '';
  if (type === 'small') {
    inner = `<img src="${content.image || ''}" alt="" style="width:32px;height:32px;">`;
  } else if (type === 'medium') {
    inner = `<div>${content.icon ? `<img src='${content.icon}' style='width:32px;height:32px;'>` : ''}</div>` +
            `<div>${content.term || ''}</div><div>${content.definition || ''}</div>`;
  } else if (type === 'large') {
    inner = `<div>${content.icon ? `<img src='${content.icon}' style='width:48px;height:48px;'>` : ''}</div>` +
            `<div style='font-size:1.2em;font-weight:bold;'>${content.term || ''}</div>` +
            `<div>${content.definition || ''}</div>` +
            `<div>${content.extra || ''}</div>`;
  }
  return `<div class="bubble ${type}${selected ? ' selected' : ''}" style="position:absolute;left:${position.x}px;top:${position.y}px;width:${size}px;height:${size}px;background:${selected ? '#00B8D9' : '#FFB300'};border-radius:50%;box-shadow:0 0 24px #0008;display:flex;align-items:center;justify-content:center;flex-direction:column;cursor:pointer;">
    ${inner}
  </div>`;
}

/**
 * Select a bubble by ID
 * @param {string} bubbleId - Bubble ID
 * @param {object[]} bubbles - Array of bubble objects
 * @returns {object[]} Updated bubbles array
 */
function selectBubble(bubbleId, bubbles) {
  return bubbles.map(b => ({ ...b, selected: b.id === bubbleId }));
}

// Exported API
export { BUBBLE_SIZES, BUBBLE_TYPES, createBubble, renderBubbleHTML, selectBubble };

// End of bubbleLearningMapModule.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

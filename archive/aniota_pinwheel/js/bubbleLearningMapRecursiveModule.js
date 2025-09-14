

/**
 * Generate bubbles recursively from a seed pattern
 * @param {object[]} seed - Array of initial bubble objects
 * @param {number} depth - Recursion depth
 * @returns {object[]} Array of bubble objects
 */
function generateRecursiveBubbles(seed, depth = 1) {
  let bubbles = [...seed];
  for (let d = 0; d < depth; d++) {
    const newBubbles = [];
    bubbles.forEach(b => {
      // For each bubble, create 2 child bubbles (smaller, offset)
      if (b.size > 60) {
        newBubbles.push({
          ...b,
          size: b.size * 0.6,
          position: { x: b.position.x + b.size, y: b.position.y },
          type: b.type === 'large' ? 'medium' : 'small',
          id: b.id + '_r' + d + 'a',
        });
        newBubbles.push({
          ...b,
          size: b.size * 0.6,
          position: { x: b.position.x - b.size, y: b.position.y },
          type: b.type === 'large' ? 'medium' : 'small',
          id: b.id + '_r' + d + 'b',
        });
      }
    });
    bubbles = bubbles.concat(newBubbles);
  }
  return bubbles;
}

/**
 * Find the largest bubble and center it
 * @param {object[]} bubbles - Array of bubble objects
 * @param {object} center - { x, y } coordinates for center
 * @returns {object[]} Updated bubbles array
 */
function centerLargestBubble(bubbles, center) {
  const largest = bubbles.reduce((max, b) => b.size > max.size ? b : max, bubbles[0]);
  return bubbles.map(b => b.id === largest.id ? { ...b, position: { ...center } } : b);
}

/**
 * Set guided or user-driven content in the center bubble
 * @param {object[]} bubbles - Array of bubble objects
 * @param {object} content - Content to set in center bubble
 * @returns {object[]} Updated bubbles array
 */
function setCenterContent(bubbles, content) {
  const largest = bubbles.reduce((max, b) => b.size > max.size ? b : max, bubbles[0]);
  return bubbles.map(b => b.id === largest.id ? { ...b, content: { ...content } } : b);
}

export { generateRecursiveBubbles, centerLargestBubble, setCenterContent };

// End of bubbleLearningMapRecursiveModule.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

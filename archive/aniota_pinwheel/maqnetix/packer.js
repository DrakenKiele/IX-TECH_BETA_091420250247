
/**
 * Extract MAQNETIX-compatible shape data from a DOM element or HTML string
 * @param {HTMLElement|string} source - DOM element or HTML string to analyze
 * @param {Object} options - Extraction options
 * @returns {Array} - Array of shape objects compatible with shapes_now.json
 */
export function packInterface(source, options = {}) {
  const {
    viewport = { width: 1920, height: 1080 },
    preserveIds = true,
    inferFunctions = true
  } = options;

  let dom;
  if (typeof source === 'string') {
    // Parse HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(source, 'text/html');
    dom = doc.body;
  } else {
    // Use provided DOM element
    dom = source;
  }

  const shapes = [];
  let shapeIdCounter = 1;

  // Extract components from different layout areas
  extractFromElements(dom, shapes, viewport, preserveIds, inferFunctions, shapeIdCounter);

  return shapes;
}

/**
 * Recursively extract shape data from DOM elements
 */
function extractFromElements(parent, shapes, viewport, preserveIds, inferFunctions, idCounter) {
  const elements = Array.from(parent.querySelectorAll('*')).filter(el => 
    isSignificantElement(el) && !isChildOfSignificant(el)
  );

  elements.forEach(element => {
    const shape = extractShapeFromElement(element, viewport, preserveIds, inferFunctions, idCounter++);
    if (shape) {
      shapes.push(shape);
    }
  });
}

/**
 * Determine if an element is significant enough to become a shape
 */
function isSignificantElement(element) {
  // Skip script, style, meta tags
  if (['SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE'].includes(element.tagName)) {
    return false;
  }

  // Skip elements with no visible content
  const rect = element.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) {
    return false;
  }

  // Include elements with text content, interactive elements, or structural elements
  return (
    element.textContent.trim().length > 0 ||
    element.tagName.match(/^(BUTTON|A|INPUT|SELECT|TEXTAREA|NAV|HEADER|FOOTER|ASIDE|MAIN|SECTION|DIV)$/) ||
    element.hasAttribute('data-function') ||
    element.classList.contains('component')
  );
}

/**
 * Check if element is a child of another significant element to avoid duplication
 */
function isChildOfSignificant(element) {
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    if (parent.classList.contains('component') || parent.hasAttribute('data-function')) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}

/**
 * Extract shape properties from a DOM element
 */
function extractShapeFromElement(element, viewport, preserveIds, inferFunctions, idCounter) {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);
  
  // Get element position relative to page
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  const x = Math.round(rect.left + scrollLeft);
  const y = Math.round(rect.top + scrollTop);
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  // Determine shape type based on element characteristics
  const type = inferShapeType(element);
  
  // Extract text content
  const text = element.textContent.trim() || element.getAttribute('aria-label') || element.tagName;
  
  // Extract colors
  const fill = rgbaToHex(computedStyle.backgroundColor) || '#ffffff';
  const border = rgbaToHex(computedStyle.borderColor) || '#000000';
  
  // Determine ID
  const id = preserveIds && element.id ? element.id : `shape-${idCounter}`;
  
  // Infer function from data attributes or element behavior
  const functionName = inferFunctions ? inferFunction(element) : null;
  
  // Calculate vector from center (for MAQNETIX polar coordinate system)
  const centerX = viewport.width / 2;
  const centerY = viewport.height / 2;
  const elementCenterX = x + width / 2;
  const elementCenterY = y + height / 2;
  
  const deltaX = elementCenterX - centerX;
  const deltaY = elementCenterY - centerY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  
  const shape = {
    id: id,
    type: type,
    label: text.substring(0, 50), // Limit label length
    text: text,
    x: x.toString(),
    y: y.toString(),
    width: width.toString(),
    height: height.toString(),
    fill: fill,
    border: border,
    area: 1, // Default area
    state: "active",
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    zIndex: parseInt(computedStyle.zIndex) || 1,
    vectorFromCenter: {
      angle: Math.round(angle * 100) / 100,
      distance: Math.round(distance * 100) / 100
    }
  };

  // Add function if inferred
  if (functionName) {
    shape.function = functionName;
  }

  return shape;
}

/**
 * Infer MAQNETIX shape type from DOM element
 */
function inferShapeType(element) {
  const tagName = element.tagName.toLowerCase();
  const className = element.className.toLowerCase();
  const role = element.getAttribute('role');

  // Check for explicit component types
  if (className.includes('navigation') || tagName === 'nav') {
    return 'NAVIGATION_HORIZONTAL';
  }
  
  if (className.includes('sidebar') || className.includes('panel')) {
    return 'FUNCTION_SIDEPANEL';
  }
  
  if (tagName === 'button' || role === 'button') {
    return 'BUTTON';
  }
  
  if (tagName.match(/^h[1-6]$/) || className.includes('title') || className.includes('header')) {
    return 'TEXT';
  }
  
  // Default type based on layout position
  const rect = element.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.2) {
    return 'TEXT'; // Top area likely headers
  } else if (rect.left < window.innerWidth * 0.3 || rect.right > window.innerWidth * 0.7) {
    return 'FUNCTION_SIDEPANEL'; // Side areas
  }
  
  return 'RECTANGLE'; // Default shape
}

/**
 * Infer function name from element characteristics
 */
function inferFunction(element) {
  // Check for explicit data-function attribute
  const dataFunction = element.getAttribute('data-function');
  if (dataFunction) {
    return dataFunction;
  }
  
  // Infer from element behavior and content
  const text = element.textContent.toLowerCase();
  const className = element.className.toLowerCase();
  
  if (text.includes('properties') || className.includes('properties')) {
    return 'function:renderProperties';
  }
  
  if (text.includes('status') || className.includes('status')) {
    return 'function:getmauicaStatus';
  }
  
  if (text.includes('save') || className.includes('save')) {
    return 'function:saveData';
  }
  
  if (text.includes('load') || className.includes('load')) {
    return 'function:loadData';
  }
  
  // Return null if no function can be inferred
  return null;
}

/**
 * Convert RGBA color to hex format
 */
function rgbaToHex(rgba) {
  if (!rgba || rgba === 'transparent' || rgba === 'rgba(0, 0, 0, 0)') {
    return null;
  }
  
  // Handle rgb() format
  const rgbMatch = rgba.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  
  // Handle rgba() format
  const rgbaMatch = rgba.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const a = Math.round(parseFloat(rgbaMatch[4]) * 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${a.toString(16).padStart(2, '0')}`;
  }
  
  // If already hex, return as-is
  if (rgba.startsWith('#')) {
    return rgba;
  }
  
  return null;
}

/**
 * Pack an existing webpage by URL (requires CORS or same-origin)
 */
export async function packFromURL(url, options = {}) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    return packInterface(html, options);
  } catch (error) {
    console.error('Error packing from URL:', error);
    throw error;
  }
}

/**
 * Pack the current page
 */
export function packCurrentPage(options = {}) {
  return packInterface(document.body, options);
}

/**
 * Compare two shape arrays and identify differences
 */
export function compareShapeArrays(original, packed) {
  const differences = {
    added: [],
    removed: [],
    modified: [],
    unchanged: []
  };
  
  const originalIds = new Set(original.map(s => s.id));
  const packedIds = new Set(packed.map(s => s.id));
  
  // Find added shapes
  packed.forEach(shape => {
    if (!originalIds.has(shape.id)) {
      differences.added.push(shape);
    }
  });
  
  // Find removed shapes
  original.forEach(shape => {
    if (!packedIds.has(shape.id)) {
      differences.removed.push(shape);
    }
  });
  
  // Find modified shapes
  original.forEach(originalShape => {
    const packedShape = packed.find(s => s.id === originalShape.id);
    if (packedShape) {
      if (JSON.stringify(originalShape) !== JSON.stringify(packedShape)) {
        differences.modified.push({
          original: originalShape,
          packed: packedShape
        });
      } else {
        differences.unchanged.push(originalShape);
      }
    }
  });
  
  return differences;
}

/**
 * Calculate fidelity score for round-trip conversion
 */
export function calculateFidelity(original, packed) {
  if (original.length === 0 && packed.length === 0) {
    return 1.0; // Perfect fidelity for empty arrays
  }
  
  const comparison = compareShapeArrays(original, packed);
  const totalOriginal = original.length;
  const unchanged = comparison.unchanged.length;
  
  // Simple fidelity metric: percentage of unchanged shapes
  return totalOriginal > 0 ? unchanged / totalOriginal : 0;
}



/**
 * Render a shape as an SVG string
 * @param {object} shape - Shape data object
 * @returns {string} SVG markup for the shape
 */
function renderShapeSVG(shape) {
  if (!shape || typeof shape !== 'object') throw new Error('Invalid shape object');
  const { type, size, position, color, border, opacity, label } = shape;
  const x = position.x;
  const y = position.y;
  const stroke = border?.color || '#222';
  const strokeWidth = border?.width || 2;
  const fill = color || '#2196F3';
  const svgProps = `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"`;
  let shapeSVG = '';
  switch (type) {
    case 'Square':
      shapeSVG = `<rect x="${x}" y="${y}" width="${size}" height="${size}" ${svgProps}/>`;
      break;
    case 'Circle':
      shapeSVG = `<circle cx="${x + size/2}" cy="${y + size/2}" r="${size/2}" ${svgProps}/>`;
      break;
    case 'Rhombus':
      shapeSVG = `<polygon points="${x+size/2},${y} ${x+size},${y+size/2} ${x+size/2},${y+size} ${x},${y+size/2}" ${svgProps}/>`;
      break;
    case 'Trapezoid':
      shapeSVG = `<polygon points="${x+size*0.2},${y} ${x+size*0.8},${y} ${x+size},${y+size} ${x},${y+size}" ${svgProps}/>`;
      break;
    case 'Symbie':
      shapeSVG = `<ellipse cx="${x + size/2}" cy="${y + size/2}" rx="${size/2}" ry="${size/3}" ${svgProps}/>`;
      break;
    default:
      shapeSVG = '';
  }
  // Optionally add label
  let labelSVG = '';
  if (label) {
    labelSVG = `<text x="${x + size/2}" y="${y + size + 16}" text-anchor="middle" font-family="Noto Sans Rounded" font-size="16" fill="#222">${label}</text>`;
  }
  return shapeSVG + labelSVG;
}


/**
 * Render multiple shapes as a single SVG group
 * @param {object[]} shapes - Array of shape data objects
 * @returns {string} SVG markup for the group
 */
function renderShapesGroupSVG(shapes) {
  if (!Array.isArray(shapes)) throw new Error('Shapes must be an array');
  const groupSVG = shapes.map(renderShapeSVG).join('\n');
  return `<g>${groupSVG}</g>`;
}

export { renderShapeSVG, renderShapesGroupSVG };

// End of shapeRenderingModule.js
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

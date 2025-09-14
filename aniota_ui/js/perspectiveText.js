
export function perspectiveTextBlock(text, opts = {}) {
  const {
    maxLines = 10,
    minScale = 0.5,
    maxScale = 1.2,
    container = null,
    font = '16px sans-serif',
    color = '#fff',
    lineHeight = 1.2
  } = opts;
  const lines = text.split(/\r?\n/).slice(-maxLines);
  const n = lines.length;
  // Remove previous content
  let el = container;
  if (!el) {
    el = document.createElement('div');
    el.style.display = 'flex';
    el.style.flexDirection = 'column';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'flex-end';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.overflow = 'hidden';
    el.style.background = 'transparent';
  } else {
    el.innerHTML = '';
  }
  lines.forEach((line, i) => {
    const t = n <= 1 ? 1 : i / (n - 1); // 0 (top) to 1 (bottom)
    const scale = minScale + (maxScale - minScale) * t;
    const span = document.createElement('span');
    span.textContent = line;
    span.style.display = 'block';
    span.style.transform = `scale(${scale})`;
    span.style.transformOrigin = 'center top';
    span.style.font = font;
    span.style.color = color;
    span.style.lineHeight = lineHeight;
    span.style.textAlign = 'center';
    span.style.margin = '0 auto';
    span.style.width = '100%';
    span.style.opacity = 0.7 + 0.3 * t;
    el.appendChild(span);
  });
  return el;
}

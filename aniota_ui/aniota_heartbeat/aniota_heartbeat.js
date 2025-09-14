const circle = document.getElementById('aniota-mood-circle');
circle.style.position = 'fixed';
circle.style.left = '40px';
circle.style.top = '40px';
circle.style.width = '72px';
circle.style.height = '72px';
circle.style.borderRadius = '50%';
circle.style.background = 'linear-gradient(135deg,#ffb300,#487de7,#e81416)';
circle.style.boxShadow = '0 4px 24px #0008';
circle.style.zIndex = 1000;
circle.style.cursor = 'grab';
circle.style.transition = 'left 0.5s cubic-bezier(.7,1.7,.5,1), top 0.5s cubic-bezier(.7,1.7,.5,1), background 0.8s linear';
circle.title = 'Aniota: Click to open RADIX';

const colors = ['#ffb300','#487de7','#e81416','#79c314','#faeb36','#70369d'];
let colorIdx = 0;
setInterval(() => {
  colorIdx = (colorIdx + 1) % colors.length;
  circle.style.background = `radial-gradient(circle at 60% 40%, ${colors[colorIdx]}, #232323 90%)`;
}, 800);

setInterval(() => {
  circle.animate([
    { boxShadow: '0 4px 24px #0008', transform: 'scale(1)' },
    { boxShadow: '0 8px 32px #ffb30088', transform: 'scale(1.08)' },
    { boxShadow: '0 4px 24px #0008', transform: 'scale(1)' }
  ], { duration: 800 });
}, 800);

let isDragging = false, offsetX = 0, offsetY = 0;
circle.addEventListener('mousedown', e => {
  isDragging = true;
  offsetX = e.clientX - circle.offsetLeft;
  offsetY = e.clientY - circle.offsetTop;
  circle.style.cursor = 'grabbing';
});
document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  circle.style.left = (e.clientX - offsetX) + 'px';
  circle.style.top = (e.clientY - offsetY) + 'px';
});
document.addEventListener('mouseup', () => {
  isDragging = false;
  circle.style.cursor = 'grab';
});

// On click, move to right center
circle.addEventListener('click', () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  circle.style.left = (vw - 120) + 'px';
  circle.style.top = (vh / 2 - 36) + 'px';
});
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------


const canvas = document.getElementById('bubbleTestCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;

let bubble = {
  x: width/2,
  y: height/2,
  r: 80,
  label: 'Test Bubble',
  state: 'unlearned',
  color: '#77dd77'
};

function drawBubble() {
  ctx.clearRect(0,0,width,height);
  ctx.save();
  ctx.globalAlpha = bubble.state === 'learned' ? 1 : 0.7;
  ctx.beginPath();
  ctx.arc(bubble.x, bubble.y, bubble.r, 0, 2*Math.PI);
  ctx.fillStyle = bubble.color;
  ctx.shadowColor = bubble.color;
  ctx.shadowBlur = bubble.state === 'learned' ? 25 : 8;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#222';
  ctx.fillText(bubble.label, bubble.x, bubble.y);
  ctx.restore();
}

drawBubble();

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  if (Math.hypot(bubble.x - mx, bubble.y - my) < bubble.r) {
    bubble.state = bubble.state === 'learned' ? 'unlearned' : 'learned';
    drawBubble();
  }
});

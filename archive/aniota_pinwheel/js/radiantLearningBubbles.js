
const DATA_URL = 'problem_solving_tools.json';
const canvas = document.getElementById('viz');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let bubbles = [];

function randomColor() {
  const colors = ['#ffb347','#ff6961','#77dd77','#aec6cf','#f49ac2','#b39eb5','#fffacd','#cfcfc4'];
  return colors[Math.floor(Math.random()*colors.length)];
}

// Bubble class
class Bubble {
  constructor(x, y, r, label, type) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.label = label;
    this.type = type;
    this.state = 'unlearned';
    this.color = randomColor();
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.state === 'learned' ? 1 : 0.6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.state === 'learned' ? 30 : 10;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#222';
    ctx.fillText(this.label, this.x, this.y);
    ctx.restore();
  }
  contains(mx, my) {
    return Math.hypot(this.x - mx, this.y - my) < this.r;
  }
}

// Layout bubbles in a circle
function layoutBubbles(tools) {
  const n = tools.length;
  const cx = width/2, cy = height/2, R = Math.min(width, height)/3;
  bubbles = tools.map((tool, i) => {
    const angle = (2*Math.PI*i)/n;
    const x = cx + R*Math.cos(angle);
    const y = cy + R*Math.sin(angle);
    return new Bubble(x, y, 60, tool.title, 'tool');
  });
}

// Draw all
function draw() {
  ctx.clearRect(0,0,width,height);
  for (const b of bubbles) b.draw(ctx);
}

// Handle click
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  for (const b of bubbles) {
    if (b.contains(mx, my)) {
      b.state = b.state === 'learned' ? 'unlearned' : 'learned';
      draw();
      break;
    }
  }
});

// Responsive
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  layoutBubbles(bubbles.map(b => ({title: b.label})));
  draw();
});

// Load data and start
fetch(DATA_URL)
  .then(res => res.json())
  .then(data => {
    layoutBubbles(data.tools);
    draw();
  });
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

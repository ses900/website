/* Simple bouncing-ball canvas demo */
export function startBouncing(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx     = canvas.getContext('2d');

  // Resize canvas to its displayed width/height
  canvas.width  = canvas.clientWidth;
  canvas.height = 400;

  let x = 100, y = 100, vx = 2, vy = 2, radius = 20;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();

    x += vx;  y += vy;
    if (x + radius > canvas.width || x - radius < 0)  vx *= -1;
    if (y + radius > canvas.height || y - radius < 0) vy *= -1;

    requestAnimationFrame(draw);
  }
  draw();
}

/* js/demos/bouncingBall.js */
export function startBouncing(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx    = canvas.getContext("2d");

  // Ensure canvas fits the visible width
  const setSize = () => { canvas.width = canvas.clientWidth; canvas.height = 400; };
  setSize();  // initial
  window.addEventListener("resize", setSize);

  let x = 100, y = 100, vx = 2, vy = 2, r = 20;

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    x += vx; y += vy;
    if (x + r > canvas.width || x - r < 0)  vx *= -1;
    if (y + r > canvas.height || y - r < 0) vy *= -1;
    requestAnimationFrame(loop);
  }
  loop();
}

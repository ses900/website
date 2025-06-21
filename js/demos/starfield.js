/* Starfield animation – minimal canvas demo */
export function startStarfield(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx    = canvas.getContext("2d");

  const STAR_COUNT = 200;
  const stars = [];

  // Resize helper
  const resize = () => {
    canvas.width  = canvas.clientWidth;
    canvas.height = 400;
    stars.length  = 0;            // reset stars on resize
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
      });
    }
  };
  resize();
  window.addEventListener("resize", resize);

  function loop() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    for (const s of stars) {
      // simple perspective zoom
      s.z -= 4;
      if (s.z <= 0) s.z = canvas.width;

      const k  = 128.0 / s.z;               // perspective scale factor
      const px = (s.x - canvas.width * 0.5) * k + canvas.width * 0.5;
      const py = (s.y - canvas.height * 0.5) * k + canvas.height * 0.5;

      if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
        const size = (1 - s.z / canvas.width) * 3;  // nearest stars look bigger
        ctx.fillRect(px, py, size, size);
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/* Entropy Bio-Simulator — minimalist cellular automaton */
export function startEntropySim(canvasId) {
  const CELL     = 6;               // pixel size of each cell
  const RESOURCE_RATE = 0.002;      // chance a new resource appears per cell per tick
  const START_ENERGY   = 8;         // energy given by one resource
  const REPRO_MIN      = 12;        // organism reproduces if energy ≥ this
  const ENERGY_DECAY   = 1;         // energy lost each tick

  const canvas = document.getElementById(canvasId);
  const ctx    = canvas.getContext("2d");

  // Fit grid to canvas
  const resize = () => {
    canvas.width  = canvas.clientWidth;
    canvas.height = 400;
    cols = Math.floor(canvas.width  / CELL);
    rows = Math.floor(canvas.height / CELL);
    grid  = new Array(rows * cols).fill(0);
    energy= new Array(rows * cols).fill(0);
  };
  let cols, rows, grid, energy;
  resize();
  window.addEventListener("resize", resize);

  // Helper: index & neighbors
  const idx = (x, y) => y * cols + x;
  const dirs = [ [1,0], [-1,0], [0,1], [0,-1] ];

  function step() {
    // 1. resource spawn
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] === 0 && Math.random() < RESOURCE_RATE) grid[i] = 1;
    }

    // 2. organisms act
    const newGrid   = grid.slice();
    const newEnergy = energy.slice();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = idx(x, y);
        if (grid[i] !== 2) continue;

        // consume resource at same cell
        if (Math.random() < 0.5) {          // 50 % chance to spend a turn eating
          const j = i;
          if (grid[j] === 2 && energy[j] < REPRO_MIN && Math.random() < 0.5) {
            // try eat adjacent resource
            for (const [dx,dy] of dirs) {
              const nx = x+dx, ny = y+dy;
              if (nx<0||nx>=cols||ny<0||ny>=rows) continue;
              const k = idx(nx,ny);
              if (grid[k]===1) { grid[k]=0; energy[j]+=START_ENERGY; break; }
            }
          }
        }

        // natural decay
        newEnergy[i] = (energy[i] || START_ENERGY) - ENERGY_DECAY;

        // reproduction
        if (newEnergy[i] >= REPRO_MIN) {
          for (const [dx,dy] of dirs.sort(()=>Math.random()-0.5)) {
            const nx = x+dx, ny = y+dy;
            if (nx<0||nx>=cols||ny<0||ny>=rows) continue;
            const k = idx(nx,ny);
            if (grid[k] === 0) {
              newGrid[k]   = 2;
              newEnergy[k] = Math.floor(newEnergy[i] / 2);
              newEnergy[i] = Math.floor(newEnergy[i] / 2);
              break;
            }
          }
        }

        // death
        if (newEnergy[i] <= 0) {
          newGrid[i]   = 0;   // becomes empty (entropy dissipates)
          newEnergy[i] = 0;
        }
      }
    }
    grid   = newGrid;
    energy = newEnergy;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const val = grid[idx(x,y)];
        if (val === 0) continue;
        ctx.fillStyle = val === 1 ? "green" : "cyan";
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
  }

  (function loop() {
    step();
    draw();
    requestAnimationFrame(loop);
  })();
}

/* Nitrogen-Cycle Visualizer
   ------------------------------------------
   Animated canvas showing major nitrogen flows:
   • N2 in atmosphere
   • Fixation  → soil ammonium
   • Nitrification → nitrate
   • Assimilation → plants
   • Consumption  → animals
   • Decomposition / mineralisation → soil
   • Denitrification → N2 back to atmosphere
*/
export function startNitrogenCycle(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx    = canvas.getContext("2d");
  const DPR    = window.devicePixelRatio || 1;

  /* ---------- Nodes & Paths ---------- */
  const nodes = [
    { id: "atm",   label: "Atmosphere\nN₂",      x: 0.5, y: 0.10,  color: "#1e90ff" },
    { id: "soil",  label: "Soil\nNH₄⁺ / NO₃⁻",  x: 0.50, y: 0.80, color: "#8b4513" },
    { id: "plant", label: "Plants",             x: 0.25, y: 0.45, color: "#2e8b57" },
    { id: "animal",label: "Animals",            x: 0.75, y: 0.45, color: "#c07020" },
    { id: "decomp",label: "Decomposers",        x: 0.15, y: 0.75, color: "#996600" },
  ];
  /* edges: from,to,label,color */
  const edges = [
    ["atm","soil","Fixation","gold"],
    ["soil","plant","Assimilation","lime"],
    ["plant","animal","Consumption","#ffb347"],
    ["animal","soil","Waste/Death","#c07020"],
    ["decomp","soil","Mineralisation","#996600"],
    ["soil","atm","Denitrification","#1e90ff"],
    ["soil","decomp","Organic Matter","#996600"],
  ];

  /* ----------- Molecule animation ---------- */
  class Molecule {
    constructor(path, speed) {
      this.path = path;
      this.t    = Math.random();      // 0–1 progress
      this.speed= speed;
    }
    step(dt) {
      this.t = (this.t + dt * this.speed) % 1;
    }
    draw(ctx) {
      const {x,y} = posOnPath(this.path, this.t);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI*2);
      ctx.fillStyle = "#ffffaa";
      ctx.fill();
    }
  }

  /* ---------- Helpers ---------- */
  const resize = () => {
    canvas.width  = canvas.clientWidth  * DPR;
    canvas.height = canvas.clientHeight * DPR;
    ctx.scale(DPR, DPR);
  };
  resize();  window.addEventListener("resize", resize);

  const abs = ({x,y}) => ({x: x*canvas.clientWidth, y: y*canvas.clientHeight});
  const posOnPath = (p, t) => ({
    x: p.ax + (p.bx-p.ax)*t,
    y: p.ay + (p.by-p.ay)*t,
  });

  /* convert edges to pixel-paths */
  const paths = edges.map(([from,to,label,color])=>{
    const a = abs(nodes.find(n=>n.id===from));
    const b = abs(nodes.find(n=>n.id===to));
    return {from,to,label,color, ax:a.x, ay:a.y, bx:b.x, by:b.y};
  });

  /* spawn molecules on each path */
  const molecules = [];
  paths.forEach(p=>{
    const count = 8;
    for(let i=0;i<count;i++) molecules.push(new Molecule(p, 0.0005+Math.random()*0.0008));
  });

  /* -------------- Draw Loop --------------- */
  function drawNodes() {
    ctx.textAlign="center";
    ctx.font="12px monospace";
    nodes.forEach(n=>{
      const {x,y}=abs(n);
      ctx.fillStyle=n.color;
      ctx.beginPath();
      ctx.arc(x,y,28,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle="#fff";
      n.label.split("\\n").forEach((l,i)=>{
        ctx.fillText(l,x,y-4+12*i);
      });
    });
  }
  function drawEdges() {
    ctx.font="10px sans-serif";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    paths.forEach(p=>{
      ctx.strokeStyle=p.color;
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(p.ax,p.ay);
      ctx.lineTo(p.bx,p.by);
      ctx.stroke();
      const mx=(p.ax+p.bx)/2, my=(p.ay+p.by)/2;
      ctx.fillStyle=p.color;
      ctx.fillText(p.label,mx,my-6);
    });
  }

  let last=performance.now();
  function loop(now){
    const dt = now-last; last=now;
    ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
    drawEdges();
    drawNodes();
    molecules.forEach(m=>{m.step(dt); m.draw(ctx);});
    requestAnimationFrame(loop);
  }
  loop();
}

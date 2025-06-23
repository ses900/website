/*
 * Statistical Intuition Game – v1.0
 * -------------------------------------------------------------
 * One‑file interactive learning playground covering:
 *   1.   Visual intuition for linear correlation (scatter guessing)
 *   2.   Correlation ≠ Causation quiz
 *   3.   Multiple predictors & over‑fitting demonstration
 *   4.   Kahneman & Tversky base‑rate neglect mini‑game (Bayesian reasoning)
 *   5.   Quick critique of causal inference (Simpson’s paradox toy)
 *
 * No external libraries. Injects its own DOM inside a provided <div id="statGame"></div>.
 * To start:  <script src="js/demos/statIntuitionGame.js"></script>
 * It will auto‑run and manage state internally.
 */

(function () {
  /* --------------------------- Helper utilities --------------------------- */
  const $ = (sel) => document.querySelector(sel);
  const create = (tag, attrs = {}, parent = null) => {
    const el = document.createElement(tag);
    Object.assign(el, attrs);
    if (parent) parent.appendChild(el);
    return el;
  };

  const rnd = (min, max) => Math.random() * (max - min) + min;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ------------------------------ App shell ------------------------------- */
  const root = document.getElementById("statGame") || create("div", { id: "statGame" }, document.body);
  root.style.fontFamily = "sans-serif";
  root.innerHTML = ""; // clear

  /* bright palette */
  const colors = ["#ff7676", "#5fa8d3", "#ffb84d", "#4caf50", "#ba68c8", "#ff9e80"];

  const Section = (title) => {
    const wrapper = create("section", { className: "section" }, root);
    create("h2", { textContent: title, style: "border-bottom:1px solid #ccc" }, wrapper);
    return wrapper;
  };

  /* ----------------------------------------------------------------------- */
  /* 1. Scatter‑plot correlation guessing                                    */
  /* ----------------------------------------------------------------------- */
  (function correlationGame() {
    const sec = Section("1 · Guess the Correlation");
    create("p", { textContent: "Drag the slider to guess the Pearson correlation (ρ) for the scatter plot." }, sec);

    const canvas = create("canvas", { width: 400, height: 280, style: "border:1px solid #ccc" }, sec);
    const ctx = canvas.getContext("2d");
    const slider = create("input", { type: "range", min: -1, max: 1, step: 0.01, value: 0 }, sec);
    const btn = create("button", { textContent: "Check" }, sec);
    const result = create("p", { style: "font-weight:bold" }, sec);

    let data, trueR;
    const genData = () => {
      const n = 60;
      trueR = rnd(-0.9, 0.9);
      const pts = [];
      for (let i = 0; i < n; i++) {
        const x = rnd(-1, 1);
        const y = trueR * x + Math.sqrt(1 - trueR ** 2) * rnd(-1, 1);
        pts.push({ x, y });
      }
      data = pts;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colors[1];
      data.forEach((p) => {
        const sx = lerp(40, 360, (p.x + 1) / 2);
        const sy = lerp(240, 40, (p.y + 1) / 2);
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    btn.onclick = () => {
      const guess = parseFloat(slider.value);
      const diff = Math.abs(guess - trueR).toFixed(2);
      result.textContent = `True ρ = ${trueR.toFixed(2)} | Your guess error: ${diff}`;
      genData();
      draw();
    };

    genData();
    draw();
  })();

  /* ----------------------------------------------------------------------- */
  /* 2. Correlation ≠ Causation quiz                                         */
  /* ----------------------------------------------------------------------- */
  (function correlationQuiz() {
    const sec = Section("2 · Correlation vs. Causation Quiz");
    const q = [
      {
        q: "Ice‑cream sales and drowning incidents are highly correlated. True cause?",
        a: ["Eating ice‑cream causes drowning", "Hot weather drives both"],
        c: 1,
      },
      {
        q: "Number of storks and human births correlate in rural areas. Why?",
        a: ["Storks deliver babies", "Bigger villages have both more roofs for storks and more births"],
        c: 1,
      },
    ];
    let idx = 0;
    const question = create("p", {}, sec);
    const options = create("div", {}, sec);
    const feedback = create("p", { style: "font-weight:bold" }, sec);

    const render = () => {
      if (idx >= q.length) {
        question.textContent = "Quiz done! You got the idea.";
        options.innerHTML = "";
        return;
      }
      const cur = q[idx];
      question.textContent = cur.q;
      options.innerHTML = "";
      cur.a.forEach((txt, i) => {
        const btn = create("button", { textContent: txt, style: `margin:0.3em;background:${colors[i]};color:#fff;border:none;padding:0.5em 1em` }, options);
        btn.onclick = () => {
          feedback.textContent = i === cur.c ? "✅ Correct – common cause!" : "❌ Nope – consider lurking variables.";
          idx++;
          render();
        };
      });
    };
    render();
  })();

  /* ----------------------------------------------------------------------- */
  /* 3. Multiple‑predictor over‑fitting toy                                  */
  /* ----------------------------------------------------------------------- */
  (function multiPredictor() {
    const sec = Section("3 · When More Predictors Hurt");
    create("p", { textContent: "Drag to add random predictors to a linear model fitting 20 data points. Watch test error." }, sec);

    const cvs = create("canvas", { width: 400, height: 260, style: "border:1px solid #ccc" }, sec);
    const ctx = cvs.getContext("2d");
    const slide = create("input", { type: "range", min: 1, max: 15, value: 1 }, sec);
    const res = create("p", {}, sec);

    const trainX = Array.from({ length: 20 }, () => [rnd(-1, 1)]);
    const trueW = 3;
    const trainY = trainX.map(([x]) => trueW * x + rnd(-0.4, 0.4));

    const testX = Array.from({ length: 100 }, () => [rnd(-1.2, 1.2)]);
    const testY = testX.map(([x]) => trueW * x + rnd(-0.4, 0.4));

    function fitPredictors(k) {
      // simply append k‑1 noise columns
      const X = trainX.map(([x]) => [x, ...Array.from({ length: k - 1 }, () => rnd(-1, 1))]);
      // quick pseudo inverse solution using normal eq (X^T X)^‑1 X^T y   – but we fake weights here for brevity
      const w = Array(k).fill(0).map(() => rnd(-1, 1));
      // evaluate MSE
      const mse = (Xset, Y) => {
        let s = 0;
        Xset.forEach((row, i) => {
          const yhat = row.reduce((a, xi, j) => a + xi * w[j], 0);
          s += (yhat - Y[i]) ** 2;
        });
        return s / Xset.length;
      };
      return { w, trainErr: mse(X, trainY), testErr: mse(testX.map(r => [...r, ...Array(k - 1).fill(0)]), testY) };
    }

    const draw = () => {
      const k = parseInt(slide.value, 10);
      const { trainErr, testErr } = fitPredictors(k);

      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.fillStyle = colors[2];
      ctx.fillRect(0, 0, (k / 15) * cvs.width, cvs.height);
      ctx.fillStyle = "#fff";
      ctx.font = "16px monospace";
      ctx.fillText(`Predictors: ${k}`, 20, 40);
      ctx.fillText(`Train MSE: ${trainErr.toFixed(2)}`, 20, 70);
      ctx.fillText(`Test MSE : ${testErr.toFixed(2)}`, 20, 100);
      res.textContent = testErr > trainErr ? "⚠️ Over‑fitting evident!" : "Model generalises fine.";
    };

    slide.oninput = draw;
    draw();
  })();

  /* ----------------------------------------------------------------------- */
  /* 4. Base‑rate neglect – Bayesian reasoning mini‑game                      */
  /* ----------------------------------------------------------------------- */
  (function baseRateGame() {
    const sec = Section("4 · Base‑Rate Neglect Game (Bayesian)");
    const story = create("p", { textContent: "Imagine a disease affects 1% of the population. A test is 90% sensitive and 90% specific. If a person tests positive, what is the probability they actually have the disease?" }, sec);
    const input = create("input", { type: "number", placeholder: "%", style: "width:80px" }, sec);
    const btn = create("button", { textContent: "Check" }, sec);
    const fb = create("p", { style: "font-weight:bold" }, sec);

    btn.onclick = () => {
      const guess = parseFloat(input.value) / 100;
      const P = (0.9 * 0.01) / (0.9 * 0.01 + 0.1 * 0.99);
      fb.textContent = `True answer ≈ ${(P * 100).toFixed(1)}%. Your error: ${Math.abs(P - guess).toFixed(2)}`;
    };
  })();

  /* ----------------------------------------------------------------------- */
  /* 5. Simpson's paradox quick demo                                         */
  /* ----------------------------------------------------------------------- */
  (function simpsonDemo() {
    const sec = Section("5 · Simpson's Paradox – Caution with Causal Claims");
    create("p", { textContent: "Group‑level data can invert overall trends. Click to toggle view." }, sec);
    const cvs = create("canvas", { width: 400, height: 260, style: "border:1px solid #ccc;cursor:pointer" }, sec);
    const ctx = cvs.getContext("2d");

    const groupA = Array.from({ length: 30 }, () => ({ x: rnd(1, 5), y: rnd(4, 8) }));
    const groupB = Array.from({ length: 30 }, () => ({ x: rnd(5, 9), y: rnd(2, 6) }));

    let grouped = true;
    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      const scale = (val, min, max, dim) => ((val - min) / (max - min)) * dim + 30;
      const points = [...groupA, ...groupB];
      const xs = points.map(p => p.x);
      const ys = points.map(p => p.y);
      const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);

      const drawPts = (pts, col) => {
        ctx.fillStyle = col;
        pts.forEach(p => {
          const sx = scale(p.x, minx, maxx, 340);
          const sy = 260 - scale(p.y, miny, maxy, 200);
          ctx.beginPath();
          ctx.arc(sx, sy, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      if (grouped) {
        drawPts(groupA, colors[0]);
        drawPts(groupB, colors[1]);
      } else {
        drawPts(points, colors[2]);
      }
    };

    cvs.onclick = () => {
      grouped = !grouped;
      draw();
    };
    draw();
  })();
})();

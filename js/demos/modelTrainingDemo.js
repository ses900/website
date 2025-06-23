/*
 * AI Training & Inference Visualizer – v1.0
 * --------------------------------------------------------
 * A didactic demo showing:
 *   1. How a tiny linear model ( y = w x + b ) learns via gradient descent
 *      to minimise mean‑squared error on a toy dataset.
 *   2. How, at inference, an LLM basically samples tokens from a
 *      multinomial distribution – here simplified to a toy bigram model –
 *      using the cumulative distribution function (CDF).
 *
 * The module draws two canvases:
 *   • trainingCanvas – dataset + model line + live loss text
 *   • probCanvas     – bar chart of next‑token probabilities during sampling
 * AA text element shows the generated sentence growing token by token.
 *
 * API:
 *   import { startAIViz } from "../js/demos/modelTrainingDemo.js";
 *   startAIViz({
 *     trainCanvas: "trainCanvas",
 *     probCanvas:  "probCanvas",
 *     textElem:    "generatedText"
 *   });
 */

export function startAIViz({ trainCanvas, probCanvas, textElem }) {
  /* -------------------------- Training phase --------------------------- */
  const tCanvas = document.getElementById(trainCanvas);
  const tCtx    = tCanvas.getContext("2d");
  const pCanvas = document.getElementById(probCanvas);
  const pCtx    = pCanvas.getContext("2d");
  const txtEl   = document.getElementById(textElem);
  const DPR     = window.devicePixelRatio || 1;

  /* responsive sizing */
  const resize = () => {
    tCanvas.width  = tCanvas.clientWidth  * DPR;
    tCanvas.height = tCanvas.clientHeight * DPR;
    pCanvas.width  = pCanvas.clientWidth  * DPR;
    pCanvas.height = pCanvas.clientHeight * DPR;
    tCtx.scale(DPR, DPR);
    pCtx.scale(DPR, DPR);
  };
  resize(); window.addEventListener("resize", resize);

  /* Toy dataset: y = 2x + 1 + noise */
  const points = Array.from({ length: 30 }, () => {
    const x = Math.random() * 10;
    return { x, y: 2 * x + 1 + (Math.random() * 2 - 1) };
  });

  /* Model params */
  let w = Math.random() * 4 - 2; // random in [-2,2]
  let b = Math.random() * 2 - 1;
  const lr = 0.01;
  let epoch = 0;
  let training = true;

  function mse() {
    return (
      points.reduce((s, p) => s + Math.pow(p.y - (w * p.x + b), 2), 0) /
      points.length
    );
  }

  function stepGD() {
    let dw = 0, db = 0;
    points.forEach(p => {
      const err = (w * p.x + b) - p.y;
      dw += err * p.x;
      db += err;
    });
    dw /= points.length;
    db /= points.length;
    w -= lr * dw;
    b -= lr * db;
  }

  /* Draw dataset and current model line */
  const PAD = 30;
  function worldToScreen({ x, y }) {
    const maxX = 10, maxY = 25;
    return {
      sx: PAD + (x / maxX) * (tCanvas.clientWidth - PAD * 2),
      sy: tCanvas.clientHeight - PAD - (y / maxY) * (tCanvas.clientHeight - PAD * 2),
    };
  }

  function drawTraining(loss) {
    tCtx.clearRect(0, 0, tCanvas.clientWidth, tCanvas.clientHeight);
    // axes
    tCtx.strokeStyle = "#aaa";
    tCtx.beginPath();
    tCtx.moveTo(PAD, PAD);
    tCtx.lineTo(PAD, tCanvas.clientHeight - PAD);
    tCtx.lineTo(tCanvas.clientWidth - PAD, tCanvas.clientHeight - PAD);
    tCtx.stroke();

    // points
    tCtx.fillStyle = "#ff6666";
    points.forEach(p => {
      const { sx, sy } = worldToScreen(p);
      tCtx.beginPath();
      tCtx.arc(sx, sy, 3, 0, Math.PI * 2);
      tCtx.fill();
    });

    // model line
    const p1 = { x: 0, y: b }, p2 = { x: 10, y: w * 10 + b };
    const s1 = worldToScreen(p1), s2 = worldToScreen(p2);
    tCtx.strokeStyle = "#00bfff";
    tCtx.lineWidth = 2;
    tCtx.beginPath(); tCtx.moveTo(s1.sx, s1.sy); tCtx.lineTo(s2.sx, s2.sy); tCtx.stroke();

    // text
    tCtx.fillStyle = "#000";
    tCtx.font = "12px monospace";
    tCtx.fillText(`epoch: ${epoch}  loss: ${loss.toFixed(3)}  w: ${w.toFixed(2)}  b: ${b.toFixed(2)}`,
      PAD, PAD - 10);
  }

  /* ---------------------- Inference / sampling phase ---------------------- */
  const vocab = ["the", "cat", "sat", "on", "mat", "."];
  // Toy bigram transition matrix (rows orig token, cols next token)
  const T = [
    //  the   cat   sat    on    mat   .
    [ 0,     0.7,  0,    0,    0,    0.3 ], // <start> (use row 0)
    [ 0,     0,    0.8,  0.1,  0,    0.1 ], // the
    [ 0,     0,    0,    0.9,  0.05, 0.05], // cat
    [ 0,     0.2,  0,    0,    0.7,  0.1 ], // sat
    [ 0.6,   0,    0,    0,    0,    0.4 ], // on
    [ 0,     0,    0,    0,    0,    1   ], // mat
  ];

  let currentTok = 0; // start row
  let genStep = 0;

  function multinomialSample(probs) {
    const cdf = [];
    let sum = 0;
    for (const p of probs) { sum += p; cdf.push(sum); }
    const r = Math.random() * sum;
    return cdf.findIndex(c => r <= c);
  }

  function drawProbs(probs) {
    pCtx.clearRect(0, 0, pCanvas.clientWidth, pCanvas.clientHeight);
    const barW = pCanvas.clientWidth / probs.length;
    probs.forEach((p, i) => {
      const barH = p * pCanvas.clientHeight;
      pCtx.fillStyle = "#888";
      pCtx.fillRect(i * barW, pCanvas.clientHeight - barH, barW * 0.8, barH);
      pCtx.fillStyle = "#000";
      pCtx.font = "10px monospace";
      pCtx.textAlign = "center";
      pCtx.fillText(vocab[i] || "end", i * barW + barW * 0.4, pCanvas.clientHeight - barH - 5);
      pCtx.fillText(p.toFixed(2), i * barW + barW * 0.4, pCanvas.clientHeight - 2);
    });
  }

  txtEl.textContent = "";

  /* ------------------------------ Main loop ------------------------------ */
  function loop() {
    if (training) {
      epoch++;
      stepGD();
      const loss = mse();
      drawTraining(loss);
      if (loss < 0.05 || epoch > 500) {
        training = false; // switch to inference
        txtEl.textContent = "";
      }
    } else {
      // Inference phase (one token every ~30 frames)
      if (genStep % 30 === 0) {
        const probs = T[currentTok];
        drawProbs(probs);
        const nextTok = multinomialSample(probs);
        if (nextTok === vocab.length) {
          // reached end token (.)
          txtEl.textContent += ".";
          currentTok = 0;
        } else {
          txtEl.textContent += (genStep === 0 ? "" : " ") + vocab[nextTok];
          currentTok = nextTok + 1; // shift row (toy mapping)
        }
      }
      genStep++;
    }
    requestAnimationFrame(loop);
  }
  loop();
}

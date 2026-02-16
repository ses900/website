/* Simple Caesar-cipher helper + UI glue
   ----------------------------------------------------------------- */
import { trackEvent } from "../analytics.js";

function shiftChar(ch, shift) {
  const A = 65, a = 97;
  if (ch >= "A" && ch <= "Z") {
    return String.fromCharCode(((ch.charCodeAt(0) - A + shift + 26) % 26) + A);
  }
  if (ch >= "a" && ch <= "z") {
    return String.fromCharCode(((ch.charCodeAt(0) - a + shift + 26) % 26) + a);
  }
  return ch;
}

export function caesar(text, key) {
  return [...text].map(ch => shiftChar(ch, key)).join("");
}

/* Glue UI elements together */
export function setupCaesar({ keyInput, inArea, outArea, encBtn, decBtn }) {
  const keyEl = document.getElementById(keyInput);
  const inEl  = document.getElementById(inArea);
  const outEl = document.getElementById(outArea);

  function getKey() {
    const k = parseInt(keyEl.value, 10);
    if (isNaN(k)) return 0;
    return ((k % 26) + 26) % 26;   // normalise [-inf,inf] → [0,25]
  }

  let started = false;
  let completed = false;

  const trackInteraction = (action) => {
    if (!started) {
      trackEvent("demo_interaction_start", { demo_id: "caesar-cipher", action });
      started = true;
    }
    trackEvent("demo_interaction", { demo_id: "caesar-cipher", action });
  };

  const trackCompletion = () => {
    if (!completed && outEl.value.trim()) {
      trackEvent("demo_interaction_complete", { demo_id: "caesar-cipher", completion_type: "first_output_generated" });
      completed = true;
    }
  };

  document.getElementById(encBtn).addEventListener("click", () => {
    trackInteraction("encrypt");
    outEl.value = caesar(inEl.value,  getKey());
    trackCompletion();
  });
  document.getElementById(decBtn).addEventListener("click", () => {
    trackInteraction("decrypt");
    outEl.value = caesar(inEl.value, -getKey());
    trackCompletion();
  });
}

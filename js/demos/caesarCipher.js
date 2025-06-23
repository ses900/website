/* Simple Caesar-cipher helper + UI glue
   ----------------------------------------------------------------- */
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

  document.getElementById(encBtn).addEventListener("click", () => {
    outEl.value = caesar(inEl.value,  getKey());
  });
  document.getElementById(decBtn).addEventListener("click", () => {
    outEl.value = caesar(inEl.value, -getKey());
  });
}

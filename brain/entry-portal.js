// EntryPortal — DOM pixel object + "click to enter".
// Audio extension point: onEnter() is the single place a sound cue would fire.

const CELLS = [
  [3, 0, 1], [4, 0, 0],
  [2, 1, 0], [3, 1, 1], [5, 1, 1],
  [3, 2, 1], [4, 2, 1], [6, 2, 0],
  [1, 3, 0], [3, 3, 1], [4, 3, 0], [5, 3, 1],
  [2, 4, 1], [4, 4, 1], [5, 4, 0],
  [3, 5, 0], [4, 5, 1], [6, 5, 1],
  [2, 6, 1], [4, 6, 0],
  [3, 7, 1],
];

export function createEntryPortal(root, { onEnter } = {}) {
  const glyph = root.querySelector(".ep-glyph");
  const CELL = 15, GRID = 8;
  CELLS.forEach(([c, r, filled], i) => {
    const el = document.createElement("i");
    el.className = "ep-px" + (filled ? " is-fill" : "");
    el.style.left = c * CELL + "px";
    el.style.top = r * CELL + "px";
    const cx = (GRID - 1) / 2;
    const dx = (c - cx) / cx, dy = (r - cx) / cx;
    const n = Math.hypot(dx, dy) || 1;
    el.style.setProperty("--dx", ((dx / n) * (1 + (i % 3))).toFixed(2) + "px");
    el.style.setProperty("--dy", ((dy / n) * (1 + (i % 3))).toFixed(2) + "px");
    el.style.setProperty("--sx", (dx * 26).toFixed(1) + "px");
    el.style.setProperty("--sy", (dy * 26).toFixed(1) + "px");
    el.style.setProperty("--d", (i % 7) * 12 + "ms");
    glyph.appendChild(el);
  });

  function onMove(e) {
    const b = glyph.getBoundingClientRect();
    const x = (e.clientX - (b.left + b.width / 2)) / b.width;
    const y = (e.clientY - (b.top + b.height / 2)) / b.height;
    glyph.style.setProperty("--tx", (x * 7).toFixed(2) + "px");
    glyph.style.setProperty("--ty", (y * 7).toFixed(2) + "px");
  }
  root.addEventListener("pointermove", onMove);

  let done = false;
  function enter() {
    if (done) return;
    done = true;
    root.classList.add("is-leaving");
    if (onEnter) onEnter();
    setTimeout(() => { root.hidden = true; root.removeEventListener("pointermove", onMove); }, 950);
  }
  root.addEventListener("click", enter);
  root.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(); } });
  return { enter };
}

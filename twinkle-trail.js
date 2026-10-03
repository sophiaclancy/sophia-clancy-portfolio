(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
  const cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999";
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, dpr = 1, raf = 0, last = 0, lx = -1, ly = -1;
  const P = [];
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; };
  const COLS = ["255,214,90", "255,232,140", "255,196,60"];
  const star = (x, y, r, c, a) => {
    ctx.fillStyle = "rgba(" + c + "," + a + ")"; ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
  };
  function tick() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i]; p.life++; p.x += p.vx; p.y += p.vy; p.vy += .015;
      if (p.life > p.max) { P.splice(i, 1); continue; }
      const k = p.life / p.max, a = (k < .15 ? k / .15 : 1) * (1 - k);
      const tw = .6 + .4 * Math.sin(p.life * .45 + p.ph);
      if (p.t) star(p.x, p.y, p.s * tw, p.c, a);
      else { ctx.fillStyle = "rgba(" + p.c + "," + a * .9 + ")"; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * .5, 0, 6.283); ctx.fill(); }
    }
    raf = P.length ? requestAnimationFrame(tick) : 0;
  }
  addEventListener("pointermove", (e) => {
    const now = performance.now(), x = e.clientX, y = e.clientY;
    const d = Math.hypot(x - lx, y - ly);
    if (now - last < 30 || d < 6) return;
    last = now; lx = x; ly = y;
    const n = d > 30 ? 2 : 1;
    for (let j = 0; j < n; j++) P.push({ x: x + (Math.random() - .5) * 16, y: y + (Math.random() - .5) * 16, vx: (Math.random() - .5) * .3, vy: -.15 - Math.random() * .25,
      life: 0, max: 28 + Math.random() * 26, s: Math.random() < .55 ? 2.5 + Math.random() * 2.5 : 2 + Math.random() * 1.5, t: Math.random() < .55, ph: Math.random() * 6.28, c: COLS[(Math.random() * 3) | 0] });
    if (P.length > 40) P.shift();
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  const boot = () => { size(); document.body.appendChild(cv); addEventListener("resize", size); };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();

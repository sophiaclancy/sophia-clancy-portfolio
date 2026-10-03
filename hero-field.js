// hero-field.js — ASCII field behind the hero (bulge, ripples, glitch bands, hidden tiger/eye/flower) + glitch cursor trail
(function () {
  const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia && matchMedia("(hover:none),(pointer:coarse)").matches;
  const RAMP = " .,:;+*?%S#@";
  const GL = "=-/\\|#";
  const INK = "37,50,79";
  const LV = 8;
  const SAGE = "112,140,100";
  const PLANT = "^A|Y*',v";

  function atlas(chars, cw, ch, dpr, font, col) {
    const c = document.createElement("canvas");
    c.width = chars.length * cw * dpr; c.height = LV * ch * dpr;
    const x = c.getContext("2d");
    x.scale(dpr, dpr); x.font = font; x.textAlign = "center"; x.textBaseline = "middle";
    for (let l = 0; l < LV; l++) {
      x.fillStyle = "rgba(" + (col || INK) + "," + (0.1 + (l / (LV - 1)) * 0.8).toFixed(3) + ")";
      for (let i = 0; i < chars.length; i++) x.fillText(chars[i], i * cw + cw / 2, l * ch + ch / 2);
    }
    return c;
  }

  function buildMask(W, H, R) {
    const mw = Math.ceil(W / R), mh = Math.ceil(H / R), m = new Float32Array(mw * mh);
    const put = (px, py, v) => { const i = ((py / R) | 0) * mw + ((px / R) | 0); if (px >= 0 && py >= 0 && px < W && py < H && v > m[i]) m[i] = v; };
    const field = (cx, cy, rw, rh, fn) => {
      for (let py = Math.max(0, cy - rh); py < Math.min(H, cy + rh); py += R)
        for (let px = Math.max(0, cx - rw); px < Math.min(W, cx + rw); px += R) {
          const v = fn((px - cx) / rw, (py - cy) / rh); if (v > 0) put(px, py, v);
        }
    };
    const s = Math.min(1, W / 1440) * Math.max(.45, Math.min(1, H / 700));
    // tiger (from the site's ascii tiger)
    const T = window.TIGER_ASCII && window.TIGER_ASCII.walk;
    if (T) {
      const lines = T.split("\n"), gw = 4 * s, gh = 6.2 * s, ox = W * .05, oy = H * .5;
      lines.forEach((ln, r) => { for (let c = 0; c < ln.length; c++) { const k = RAMP.indexOf(ln[c]); if (k > 0) for (let yy = 0; yy < gh; yy += R) for (let xx = 0; xx < gw; xx += R) put(ox + c * gw + xx, oy + r * gh + yy, .25 + .75 * k / (RAMP.length - 1)); } });
    }
    const star = (cx, cy, rr, k) => field(cx, cy, rr, rr, (u, v) => { const q = Math.sqrt(Math.abs(u)) + Math.sqrt(Math.abs(v)); return q < 1 ? k * (1 - q * .65) : Math.max(0, .35 - Math.hypot(u, v) * .3) * k; });
    star(W * .24, H * .2, 110 * s, 1); star(W * .64, H * .12, 42 * s, .8); star(W * .93, H * .64, 36 * s, .8); star(W * .42, H * .86, 30 * s, .7);
    // flower
    const fr = 120 * s;
    field(W * .87, H * .83, fr, fr, (u, v) => {
      const r = Math.hypot(u, v), a = Math.atan2(v, u), p = .45 + .45 * Math.abs(Math.cos(a * 2.5));
      if (r < .16) return 1; if (r < .2) return .3;
      if (r < p) return .35 + .5 * (1 - r / p) + .15 * Math.abs(Math.sin(a * 20));
      if (Math.abs(r - p) < .04) return .8;
      return 0;
    });
    return { m, mw, mh, R };
  }

  function initField(hero) {
    if (hero.querySelector(".hf-canvas")) return;
    const cv = document.createElement("canvas"); cv.className = "hf-canvas"; cv.setAttribute("aria-hidden", "true");
    const vg = document.createElement("div"); vg.className = "hf-vig"; vg.setAttribute("aria-hidden", "true");
    hero.prepend(vg); hero.prepend(cv);
    const ctx = cv.getContext("2d");
    const CW = 5.5, CH = 8.5, FONT = '7px ui-monospace,"JetBrains Mono",Menlo,monospace';
    let W, H, dpr, cols, rows, reveal, mask, glyphs, atl, gAtl;
    const chars = RAMP + GL + PLANT, PL0 = RAMP.length + GL.length;
    let forest, fch, fsw;
    function buildForest() {
      forest = new Float32Array(cols * rows); fch = new Uint8Array(cols * rows); fsw = new Float32Array(cols * rows);
      const trees = [[.03,.62,.11],[.09,.8,.13],[.16,.55,.09],[.21,.4,.07],[.8,.45,.08],[.86,.72,.12],[.93,.6,.1],[.975,.85,.12]];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const px = c * CW, py = r * CH, i = r * cols + c, u = px / W, base = H * .97;
        let v = 0, ch = 0, sw = 0;
        for (const [tx, th, tw] of trees) {
          const cx = tx * W, h = th * H, w = tw * W * .55, top = base - h;
          if (py >= top && py <= base - h * .1) {
            const t = (py - top) / (h * .9), tier = (t * 4) % 1, half = w / 2 * (.3 + .7 * tier) * (.35 + .65 * t);
            if (Math.abs(px - cx) < half) { const e = 1 - Math.abs(px - cx) / half; v = Math.max(v, .45 + .5 * e); ch = t < .08 ? 4 : (tier > .8 ? 1 : 0); sw = 1 - t; }
          } else if (py > base - h * .1 && py <= base && Math.abs(px - cx) < w * .05) { v = Math.max(v, .8); ch = 2; sw = 0; }
        }
        const side = u < .27 || u > .73;
        if (!v && side && py > H * .86) { const g = Math.sin(px * .31) * Math.sin(px * .07 + 1) ; if (g > .1) { v = .35 + g * .4; ch = g > .6 ? 3 : (g > .35 ? 5 : 7); sw = .6; } }
        if (!v && side && Math.sin(px * .9 + py * 1.7) * Math.sin(px * .13 - py * .21) > .93) { v = .7; ch = [4, 3, 6][(px + py) % 3 | 0]; sw = .8; }
        forest[i] = v; fch[i] = ch; fsw[i] = sw;
      }
    }
    function resize() {
      const r = cv.getBoundingClientRect(); W = r.width; H = r.height; dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = W * dpr; cv.height = H * dpr;
      cols = Math.ceil(W / CW) + 1; rows = Math.ceil(H / CH) + 1;
      reveal = new Float32Array(cols * rows);
      mask = buildMask(W, H, 4);
      atl = atlas(chars, CW, CH, dpr, FONT);
      gAtl = atlas(chars, CW, CH, dpr, FONT, SAGE);
      buildForest();
    }
    const ms = { x: -9999, y: -9999, sx: -9999, sy: -9999, v: 0, on: 0 };
    const ripples = [], bands = [];
    let lastRip = 0, lx = 0, ly = 0;
    addEventListener("pointermove", (e) => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = x > -40 && y > -40 && x < W + 40 && y < H + 40;
      ms.x = x; ms.y = y; ms.on = inside ? 1 : 0;
      const sp = Math.hypot(x - lx, y - ly); lx = x; ly = y; ms.v = Math.min(80, ms.v * .7 + sp * .3);
      const now = performance.now();
      if (inside && sp > 6 && now - lastRip > 140) { ripples.push({ x, y, t: now, a: Math.min(1, sp / 30) }); if (ripples.length > 6) ripples.shift(); lastRip = now; }
    }, { passive: true });
    document.addEventListener("pointerleave", () => { ms.on = 0; });
    const sampleMask = (x, y) => { const i = (y / mask.R) | 0, j = (x / mask.R) | 0; return (i < 0 || j < 0 || i >= mask.mh || j >= mask.mw) ? 0 : mask.m[i * mask.mw + j]; };
    let running = false, visible = true, t0 = performance.now();
    function frame(now) {
      if (!running) return;
      const t = (now - t0) / 1000;
      ms.sx += (ms.x - ms.sx) * .16; ms.sy += (ms.y - ms.sy) * .16; ms.v *= .94;
      if (ms.sx < -5000) { ms.sx = ms.x; ms.sy = ms.y; }
      if (Math.random() < .003 + ms.v * .0006 * ms.on) bands.push({ r: (Math.random() * rows) | 0, h: 1 + (Math.random() * 3) | 0, s: ((Math.random() - .5) * 6) | 0, ttl: 2 + (Math.random() * 4) | 0 });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      for (let b = bands.length - 1; b >= 0; b--) { const B = bands[b]; ctx.fillStyle = "rgba(" + INK + ",.02)"; ctx.fillRect(0, B.r * CH, W, B.h * CH); if (--B.ttl <= 0) bands.splice(b, 1); }
      const Rb = 130, sig2 = 2 * 110 * 110, mx = ms.sx, my = ms.sy, act = ms.on;
      for (let q = ripples.length - 1; q >= 0; q--) if (now - ripples[q].t > 2200) ripples.splice(q, 1);
      const cwd = CW * dpr, chd = CH * dpr;
      for (let r = 0; r < rows; r++) {
        let shift = 0, glitch = false;
        for (let b = 0; b < bands.length; b++) if (r >= bands[b].r && r < bands[b].r + bands[b].h) { shift = bands[b].s; glitch = true; }
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c, px = c * CW, py = r * CH;
          const dx = px - mx, dy = py - my, d2 = dx * dx + dy * dy, dist = Math.sqrt(d2) || 1;
          const g = act ? Math.exp(-d2 / sig2) : 0;
          const rv = reveal[i] = Math.max(reveal[i] * .988, g);
          let ox = 0, oy = 0, sx = px + shift * CW, sy = py, boost = 0;
          if (act && dist < Rb) { const f = dist / Rb, k = (1 - f) * (1 - f); sx = mx + (sx - mx) * (1 - .42 * k); sy = my + (sy - my) * (1 - .42 * k); const push = 9 * k * f * 4; ox += dx / dist * push; oy += dy / dist * push; }
          for (let q = 0; q < ripples.length; q++) {
            const R0 = ripples[q], age = (now - R0.t) / 1000, rx = px - R0.x, ry = py - R0.y, rd = Math.sqrt(rx * rx + ry * ry) || 1;
            const w = Math.sin((rd - age * 420) / 26) * Math.exp(-age * 1.8) * Math.exp(-Math.abs(rd - age * 420) / 90) * R0.a;
            ox += rx / rd * w * 4; oy += ry / rd * w * 4; boost += Math.max(0, w) * .22;
          }
          oy += Math.sin(px * .012 + t * 1.3) * 1.6 * rv;
          const fv = forest[i];
          if (fv && rv > .05) { const a = Math.min(1, fv * rv * 1.15); if (a > .1) { const sw = Math.sin(t * 1.4 + px * .02) * 2.2 * rv * fsw[i]; ctx.drawImage(gAtl, (PL0 + fch[i]) * cwd, Math.min(LV - 1, (a * LV) | 0) * chd, cwd, chd, px + ox + sw, py + oy, CW, CH); continue; } }
          const n = .5 + .25 * Math.sin(sx * .009 + t * .25 + Math.sin(sy * .011 - t * .18) * 1.6) + .25 * Math.sin(sy * .013 - t * .21 + Math.sin(sx * .007 + t * .15) * 1.8);
          const cloud = n < .42 ? 0 : (n - .42) / .58;
          let d = .03 + cloud * cloud * .34 + g * .18 * cloud + boost + sampleMask(sx, sy) * rv * .95;
          if (d < .084) continue;
          if (d > 1) d = 1;
          let ci = Math.min(RAMP.length - 1, (d * RAMP.length) | 0);
          if (glitch && Math.random() < .1) ci = RAMP.length + ((Math.random() * GL.length) | 0);
          const lv = Math.min(LV - 1, (d * 1.05 * LV) | 0);
          ctx.drawImage(atl, ci * cwd, lv * chd, cwd, chd, px + ox, py + oy, CW, CH);
        }
      }
      requestAnimationFrame(frame);
    }
    function start() { if (running || reduced) return; running = true; requestAnimationFrame(frame); }
    function stop() { running = false; }
    window.__hfFrame = () => { const r = running; running = true; frame(performance.now()); running = r; };
    resize();
    new ResizeObserver(() => { resize(); if (reduced) { running = true; frame(performance.now()); running = false; } }).observe(cv);
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible && !document.hidden ? start() : stop(); }).observe(cv);
    document.addEventListener("visibilitychange", () => { visible && !document.hidden ? start() : stop(); });
    if (reduced) { running = true; frame(performance.now()); running = false; }
  }

  function initTrail() {
    if (coarse || reduced || document.querySelector(".gt-canvas")) return;
    const cv = document.createElement("canvas"); cv.className = "gt-canvas"; cv.setAttribute("aria-hidden", "true");
    document.body.appendChild(cv);
    const ctx = cv.getContext("2d"), P = [], S = [];
    const CH = "*+#%@x×/\\:;=", SPROUT = "Y^*',v|A";
    let dpr = 1, W = 0, H = 0, lx = null, ly = null, raf = 0;
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; };
    size(); addEventListener("resize", size);
    addEventListener("pointermove", (e) => {
      const x = e.clientX, y = e.clientY;
      const hero = document.querySelector(".v12-hero"), hr = hero && hero.getBoundingClientRect();
      if (!hr || y < hr.top || y > hr.bottom) { lx = null; return; }
      if (lx === null) { lx = x; ly = y; }
      const dx = x - lx, dy = y - ly, dist = Math.hypot(dx, dy), steps = Math.min(3, Math.floor(dist / 34));
      for (let s = 1; s <= steps; s++) {
        const px = lx + dx * s / steps, py = ly + dy * s / steps;
        P.push({ x: px + (Math.random() - .5) * 6, y: py + (Math.random() - .5) * 6, vx: (Math.random() - .5) * .25, vy: .15 + Math.random() * .2, life: 0, max: 40 + Math.random() * 30, ch: CH[(Math.random() * CH.length) | 0], sz: 10 + Math.random() * 7 });
        if (Math.random() < .03) S.push({ x: px + (Math.random() - .5) * 30, y: py + (Math.random() - .5) * 14, w: 8 + Math.random() * 46, h: Math.random() < .7 ? 1 : 2 + (Math.random() * 3 | 0), life: 0, max: 8 + Math.random() * 16 });
      }
      if (steps) {
        lx = x; ly = y;
        const side = x < hr.left + hr.width * .28 || x > hr.right - hr.width * .28;
        if (side && Math.random() < .55) for (let k = 0; k < 2 + (Math.random() * 3 | 0); k++) P.push({ x: x + (Math.random() - .5) * 46, y: y + (Math.random() - .3) * 24, vx: (Math.random() - .5) * .3, vy: -.2 - Math.random() * .35, life: 0, max: 55 + Math.random() * 35, ch: SPROUT[(Math.random() * SPROUT.length) | 0], sz: 8 + Math.random() * 7, g: 1 });
      }
      if (P.length > 80) P.splice(0, P.length - 80);
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    function tick() {
      raf = 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#7f9c74";
      for (let i = S.length - 1; i >= 0; i--) {
        const s = S[i]; s.life++;
        if (s.life > s.max) { S.splice(i, 1); continue; }
        
        ctx.globalAlpha = 1 - s.life / s.max;
        const jx = Math.random() < .08 ? (Math.random() - .5) * 8 : 0;
        ctx.fillRect(Math.round((s.x + jx) / 2) * 2, Math.round(s.y), s.w * (1 - s.life / s.max * .5), s.h);
      }
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i]; p.life++; p.x += p.vx; p.y += p.vy;
        if (p.life > p.max) { P.splice(i, 1); continue; }
        const k = p.life / p.max;
        
        if (false) p.ch = CH[(Math.random() * CH.length) | 0];
        const e = 1 - k; ctx.globalAlpha = e * e * (k < .12 ? k / .12 : 1);
        ctx.fillStyle = p.g ? "#557e4c" : "#7f9c74";
        ctx.font = "600 " + p.sz.toFixed(0) + 'px ui-monospace,"JetBrains Mono",Menlo,monospace';
        const gx = 0;
        ctx.fillText(p.ch, p.x + gx, p.y);
      }
      ctx.globalAlpha = 1;
      if (P.length || S.length) raf = requestAnimationFrame(tick);
    }
  }

  function initForest(hero) {
    if (hero.querySelector(".hf-forest")) return;
    const box = document.createElement("div"); box.className = "hf-forest"; box.setAttribute("aria-hidden", "true");
    const img = new Image(); img.src = "assets/forest-frame3.png"; img.alt = ""; img.decoding = "async";
    const bg = document.createElement("canvas"), cv = document.createElement("canvas");
    box.append(img, bg, cv); hero.prepend(box);
    if (reduced) return;
    const ctx = cv.getContext("2d"), bctx = bg.getContext("2d");
    let W = 0, H = 0, dpr = 1, alpha = null, AW = 216, AH = 144, base = null, spr = null;
    const IW = 1536, IH = 1024, TB = { x: 1010, y: 370, w: 360, h: 190 }, TS = .8, G = 2200;
    const geo = () => { const sc = Math.min(W / IW, H / IH) * 1.12; return { sc, ox: W - IW * sc, oy: 0 }; };
    const tiger = { x: 0, y: 0, tx: 0, ty: 0, dir: 1, ph: 0, walking: false, placed: false, z: 0, vz: 0, cool: 0, moving: 0 };
    const placeTiger = () => { const g = geo(); tiger.x = tiger.tx = g.ox + (TB.x + TB.w / 2) * g.sc; tiger.y = tiger.ty = g.oy + (TB.y + TB.h) * g.sc; tiger.placed = true; };
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = AW; c.height = AH;
      const x = c.getContext("2d"); x.drawImage(img, 0, 0, AW, AH);
      try { alpha = x.getImageData(0, 0, AW, AH).data; } catch (e) { alpha = null; }
      try {
        const b = document.createElement("canvas"); b.width = IW; b.height = IH; const bx = b.getContext("2d"); bx.drawImage(img, 0, 0, IW, IH);
        const id = bx.getImageData(TB.x, TB.y, TB.w, TB.h), d = id.data, w = TB.w, h = TB.h, m = new Uint8Array(w * h);
        for (let i = 0; i < w * h; i++) { const k = i * 4, r = d[k], gg = d[k + 1], bb = d[k + 2], l = .3 * r + .59 * gg + .11 * bb, sat = Math.max(r, gg, bb) - Math.min(r, gg, bb); if (d[k + 3] > 40 && (l < 130 || (sat < 22 && l < 238))) m[i] = 1; }
        const md = new Uint8Array(m); for (let y = 2; y < h - 2; y++) for (let X = 2; X < w - 2; X++) { const i = y * w + X; if (m[i - 1] || m[i + 1] || m[i - w] || m[i + w] || m[i - 2] || m[i + 2] || m[i - 2 * w] || m[i + 2 * w]) md[i] = 1; }
        const s = document.createElement("canvas"); s.width = w; s.height = h; const sx = s.getContext("2d"), sd = sx.createImageData(w, h);
        const orig = new Uint8ClampedArray(d), gw = 150, gnd = bx.getImageData(TB.x - 160, TB.y, gw, TB.h).data;
        for (let y = 0; y < h; y++) for (let X = 0; X < w; X++) {
          const i = y * w + X, k = i * 4; if (!md[i]) continue;
          if (m[i]) { sd.data[k] = orig[k]; sd.data[k + 1] = orig[k + 1]; sd.data[k + 2] = orig[k + 2]; sd.data[k + 3] = orig[k + 3]; }
          if (y > h * .7) { const sk = ((y * gw) + (X % 150)) * 4, fa = Math.min(1, (y - h * .7) / (h * .12)); for (let j = 0; j < 3; j++) d[k + j] = gnd[sk + j]; d[k + 3] = gnd[sk + 3] * fa; } else d[k + 3] = 0;
        }
        sx.putImageData(sd, 0, 0); bx.putImageData(id, TB.x, TB.y);
        base = b; spr = s; img.style.opacity = "0"; drawBg(); placeTiger(); start();
      } catch (e) { base = null; }
    };
    const shakes = [];
    function drawBg(t) {
      if (!base) return;
      const g = geo(); bctx.setTransform(dpr, 0, 0, dpr, 0, 0); bctx.clearRect(0, 0, W, H);
      const live = shakes.filter(s => t - s.t0 < 1.6);
      if (!live.length) { bctx.drawImage(base, g.ox, g.oy, IW * g.sc, IH * g.sc); return; }
      const T = 24, ts = T * g.sc;
      for (let ty = 0; ty < IH; ty += T) for (let tx = 0; tx < IW; tx += T) {
        const cx = g.ox + (tx + T / 2) * g.sc, cy = g.oy + (ty + T / 2) * g.sc; let dx = 0, dy = 0;
        for (const s of live) { const dd = Math.hypot(cx - s.x, cy - s.y); if (dd < s.R) { const age = t - s.t0, amp = 5 * (1 - dd / s.R) * Math.exp(-age * 2.6); dx += amp * Math.sin(age * 26 + cx * .05); dy += amp * .5 * Math.cos(age * 21 + cy * .06); } }
        bctx.drawImage(base, tx, ty, T, T, cx - ts / 2 + dx, cy - ts / 2 + dy, ts + .6, ts + .6);
      }
    }
    const size = () => { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; dpr = Math.min(2, devicePixelRatio || 1); for (const c of [cv, bg]) { c.width = W * dpr; c.height = H * dpr; } if (tiger.placed && !tiger.walking && !prints.length) placeTiger(); drawBg(0); };
    const prints = [];
    size(); new ResizeObserver(size).observe(cv);
    const IVORY = "255,246,222", SAGE = "176,200,150", MOSS = "120,150,100";
    const P = [], amb = [];
    const nAmb = 0;
    for (let i = 0; i < nAmb; i++) amb.push({ u: .55 + Math.random() * .4, v: .2 + Math.random() * .6, ph: Math.random() * 6.28, sp: .15 + Math.random() * .2, c: i % 2 ? IVORY : SAGE });
    const lead = { x: 0, y: 0, tx: 0, ty: 0, on: 0, a: 0, vx: 0, vy: 0 }, trail = [], LIME = "236,226,140", CORE = "255,252,232";
    const onImage = (cx, cy) => {
      const r = img.getBoundingClientRect(); const u = (cx - r.left) / r.width, v = (cy - r.top) / r.height;
      if (u < 0 || v < 0 || u > 1 || v > 1) return false;
      if (!alpha) return v < .3 || u > .85;
      const iw = IW, ih = IH, sc = Math.min(r.width / iw, r.height / ih) * 1.12, dw = iw * sc, ox = r.width - dw, oy = 0;
      const iu = ((cx - r.left) - ox) / dw, iv = ((cy - r.top) - oy) / (ih * sc);
      if (iu < 0 || iv < 0 || iu > 1 || iv > 1) return false;
      const ax = (iu * AW) | 0, ay = (iv * AH) | 0; let m = 0;
      for (let dy = -3; dy <= 3; dy += 3) for (let dx = -3; dx <= 3; dx += 3) { const X = ax + dx, Y = ay + dy; if (X >= 0 && Y >= 0 && X < AW && Y < AH) { const k = (Y * AW + X) * 4; m = Math.max(m, alpha[k + 3]); } }
      return m > 40;
    };
    hero.addEventListener("click", (e) => {
      if (!spr || (e.target.closest && e.target.closest("a,button,input,textarea"))) return;
      if (getSelection && String(getSelection()).length) return;
      const r = cv.getBoundingClientRect(), g = geo();
      let minX = 40; hero.querySelectorAll(".hero-left > *").forEach(el => { const b = el.getBoundingClientRect(); if (b.width) minX = Math.max(minX, b.right - r.left + TB.w * g.sc * .55); });
      if (e.clientX - r.left < minX - TB.w * g.sc * .55) return;
      const x = Math.max(minX, Math.min(W - 40, e.clientX - r.left)), y = Math.max(g.oy + IH * g.sc * .5, TB.h * g.sc * .8, Math.min(H - 8, e.clientY - r.top));
      const pr = { x, y, rot: (Math.random() - .5) * .5, t0: performance.now() / 1000, arrived: 0 };
      prints.push(pr); if (prints.length > 3) prints.shift();
      tiger.tx = x; tiger.ty = y + 6; tiger.walking = true; tiger.target = pr;
      start();
    });
    let lastEmit = 0;
    if (!coarse) addEventListener("pointermove", (e) => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= W && y <= H && !(e.target.closest && e.target.closest("a,button"));
      lead.tx = x; lead.ty = y;
      if (inside && !lead.on) { lead.x = x; lead.y = lead.ty; lead.vx = lead.vy = 0; trail.length = 0; }
      lead.on = inside ? 1 : 0;
      if (inside) start();
      const now = performance.now();
      if (false) {
        lastEmit = now;
        const k = Math.random();
        P.push({ x: x + (Math.random() - .5) * 14, y: y + 6 + (Math.random() - .5) * 14, vx: (Math.random() - .5) * .35, vy: -.1 - Math.random() * .35, life: 0, max: 50 + Math.random() * 50,
          t: k < .5 ? "px" : (k < .9 ? "glow" : "spark"), s: k < .5 ? (Math.random() < .6 ? 2 : 3) : 1 + Math.random() * 1.6, c: [IVORY, SAGE, MOSS][(Math.random() * 3) | 0] });
        if (P.length > 70) P.shift();
      }
    }, { passive: true });
    const glow = (x, y, r, c, a) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
      g.addColorStop(0, "rgba(" + c + "," + a + ")"); g.addColorStop(.25, "rgba(" + c + "," + a * .35 + ")"); g.addColorStop(1, "rgba(" + c + ",0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 6, 0, 6.283); ctx.fill();
      ctx.fillStyle = "rgba(255,252,240," + a + ")"; ctx.beginPath(); ctx.arc(x, y, r * .7, 0, 6.283); ctx.fill();
    };
    const spark = (x, y, r, c, a) => {
      ctx.fillStyle = "rgba(" + c + "," + a + ")"; ctx.beginPath();
      ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
    };
    const paw = (x, y, rot, a, s) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = "rgba(79,107,58," + a + ")";
      const q = Math.max(2, Math.round(s / 5));
      const blob = (cx, cy, rx, ry) => { for (let yy = -ry; yy <= ry; yy += q) for (let xx = -rx; xx <= rx; xx += q) if ((xx * xx) / (rx * rx) + (yy * yy) / (ry * ry) <= 1.05) ctx.fillRect(Math.round(cx + xx - q / 2), Math.round(cy + yy - q / 2), q - .5, q - .5); };
      blob(0, s * .35, s * .42, s * .34); blob(-s * .5, -s * .12, s * .16, s * .2); blob(-s * .18, -s * .42, s * .16, s * .2); blob(s * .18, -s * .42, s * .16, s * .2); blob(s * .5, -s * .12, s * .16, s * .2);
      ctx.restore();
    };
    const drawTiger = (t) => {
      if (!spr) return;
      const g = geo(), sw = TB.w * g.sc * TS, sh = TB.h * g.sc * TS, walk = (tiger.walking || tiger.moving) ? 1 : 0;
      const bob = walk ? -Math.abs(Math.sin(tiger.ph)) * 3 : Math.sin(t * 1.6) * .6;
      ctx.save(); ctx.translate(tiger.x, tiger.y + bob - tiger.z); ctx.scale(tiger.dir, 1);
      const rows = 5, step = TB.h / rows * 0 + 4;
      for (let sy = 0; sy < TB.h; sy += step) {
        const off = walk ? Math.sin(tiger.ph * 2 + sy * .09) * 2.2 : 0;
        ctx.drawImage(spr, 0, sy, TB.w, step, -sw / 2 + off, -sh + sy * g.sc * TS, sw, step * g.sc * TS + .4);
      }
      ctx.restore();
    };
    let running = false, t0 = performance.now(), lastT = 0;
    function frame(now) {
      if (!running) return;
      const t = (now - t0) / 1000, dt = Math.min(.05, t - lastT); lastT = t;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      const ts = now / 1000;
      if (shakes.length) { drawBg(ts); for (let i = shakes.length - 1; i >= 0; i--) if (ts - shakes[i].t0 > 1.6) { shakes.splice(i, 1); if (!shakes.length) drawBg(ts); } }
      for (let i = prints.length - 1; i >= 0; i--) {
        const p = prints[i], age = ts - p.t0, inA = Math.min(1, age / .15);
        const fa = p.arrived ? Math.max(0, 1 - (ts - p.arrived) / 1.4) : 1;
        if (fa <= 0) { prints.splice(i, 1); continue; }
        paw(p.x, p.y, p.rot, .85 * inA * fa, 16 * (1.25 - .25 * inA));
      }
      if (tiger.walking) {
        const dx = tiger.tx - tiger.x, dy = tiger.ty - tiger.y, d = Math.hypot(dx, dy), sp = 240 * dt;
        if (Math.abs(dx) > 2) tiger.dir = dx < 0 ? 1 : -1;
        if (d <= sp) {
          tiger.x = tiger.tx; tiger.y = tiger.ty; tiger.walking = false;
          const pr = tiger.target; if (pr) { pr.arrived = ts; shakes.push({ x: pr.x, y: pr.y - 40, R: 220, t0: ts });
            for (let j = 0; j < 14; j++) P.push({ x: pr.x + (Math.random() - .5) * 180, y: pr.y - 60 - Math.random() * 120, vx: (Math.random() - .5) * .6, vy: .3 + Math.random() * .5, life: 0, max: 60 + Math.random() * 50, t: "glow", s: .8 + Math.random() * .6, c: LIME }); }
        } else { tiger.x += dx / d * sp; tiger.y += dy / d * sp; tiger.ph += dt * 11; }
      }
      { const g = geo(), sw = TB.w * g.sc * TS, sh = TB.h * g.sc * TS;
        tiger.moving = 0;
        { const cd = Math.hypot(lead.x - tiger.x, lead.y - (tiger.y - sh * .5)); if (lead.a > .5 && cd < 230) tiger.chasing = true; else if (lead.a < .3 || cd > 520) tiger.chasing = false; }
        if (!tiger.walking && spr && lead.a > .5 && tiger.chasing) {
          const dx = lead.x - tiger.x, ad = Math.abs(dx);
          if (ad > 44) { const sp = Math.min(280, ad * 2.4) * dt; tiger.x += Math.sign(dx) * sp; tiger.dir = dx < 0 ? 1 : -1; tiger.ph += dt * 11; tiger.moving = 1; }
          const above = (tiger.y - tiger.z - sh * .6) - lead.y;
          if (tiger.z === 0 && ad < 90 && above > 30 && ts > tiger.cool) { tiger.vz = Math.min(Math.sqrt(2 * G * Math.min(above, 120)), 740); tiger.cool = ts + 1; }
          tiger.x = Math.max(g.ox + sw * .6, Math.min(W - sw * .5, tiger.x));
        }
        if (tiger.z > 0 || tiger.vz > 0) { tiger.vz -= G * dt; tiger.z += tiger.vz * dt; if (tiger.z <= 0) { tiger.z = 0; tiger.vz = 0; } }
      }
      drawTiger(t);
      for (const f of amb) {
        const x = (f.u + Math.sin(t * f.sp + f.ph) * .04) * W, y = (f.v + Math.sin(t * f.sp * 1.3 + f.ph * 2) * .05) * H;
        const b = .25 + .45 * Math.pow(.5 + .5 * Math.sin(t * .9 + f.ph * 3), 3);
        glow(x, y, 1.4, f.c, b);
      }
      lead.a += ((lead.on ? 1 : 0) - lead.a) * .08;
      { const dm = Math.exp(-5.5 * dt); lead.vx = (lead.vx + (lead.tx + 14 - lead.x) * 30 * dt) * dm; lead.vy = (lead.vy + (lead.ty - lead.y) * 30 * dt) * dm; lead.x += lead.vx * dt; lead.y += lead.vy * dt; }
      if (lead.a > .02) {
        const a = lead.a, fx = lead.x + Math.sin(t * 1.7) * 3, fy = lead.y + Math.sin(t * 2.6) * 3, pulse = .72 + .28 * Math.sin(t * 2.8), flap = Math.abs(Math.sin(t * 40));
        trail.push({ x: fx, y: fy + 4, t: ts }); while (trail.length && ts - trail[0].t > 1.1) trail.shift();
        if (trail.length > 2) {
          ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.shadowColor = "rgba(" + LIME + ",.9)"; ctx.shadowBlur = 12;
          for (let k = 2; k < trail.length; k++) { const q = k / trail.length, p0 = trail[k - 2], p1 = trail[k - 1], p2 = trail[k], wob = Math.sin(k * .7 + t * 3) * 2.2 * (1 - q);
            ctx.strokeStyle = "rgba(" + CORE + "," + (q * q * .32 * a * (.6 + .4 * Math.sin(k * 1.3 + t * 5))).toFixed(3) + ")"; ctx.lineWidth = .5 + q * 1.6;
            ctx.beginPath(); ctx.moveTo((p0.x + p1.x) / 2 + wob, (p0.y + p1.y) / 2 + wob * .6); ctx.quadraticCurveTo(p1.x + wob, p1.y + wob * .6, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2); ctx.stroke(); }
          ctx.restore();
        }
        { const lp = trail.length > 1 ? trail[trail.length - 2] : null, dist = lp ? Math.hypot(fx - lp.x, fy + 4 - lp.y) : 0, n = Math.min(5, Math.floor(dist / 6) + (Math.random() < .35 ? 1 : 0));
          for (let k = 0; k < n; k++) { const u = Math.random(), r = Math.random(); P.push({ x: (lp ? lp.x + (fx - lp.x) * u : fx) + (Math.random() - .5) * 7, y: (lp ? lp.y + (fy + 4 - lp.y) * u : fy + 4) + (Math.random() - .5) * 7, vx: (Math.random() - .5) * .35 - lead.vx * .0015, vy: (Math.random() - .5) * .3 + .06, gv: -.004, life: 0, max: 40 + Math.random() * 55, t: "wisp", sh: r < .55 ? 0 : r < .8 ? 1 : 2, s: r < .55 ? 1 + Math.random() * 1.4 : 2.4 + Math.random() * 2.6, rot: Math.random() * 3.14, vr: (Math.random() - .5) * .06 }); }
          if (P.length > 160) P.splice(0, P.length - 160); }
        const ang = Math.max(-.5, Math.min(.5, lead.vx * .0014));
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        for (const [R2, al] of [[60, .16], [30, .32], [14, .55]]) { const og = ctx.createRadialGradient(fx, fy + 4, 0, fx, fy + 4, R2); og.addColorStop(0, "rgba(" + LIME + "," + al * a * pulse + ")"); og.addColorStop(1, "rgba(" + LIME + ",0)"); ctx.fillStyle = og; ctx.beginPath(); ctx.arc(fx, fy + 4, R2, 0, 6.283); ctx.fill(); }
        ctx.restore();
        ctx.save(); ctx.translate(fx, fy); ctx.rotate(ang);
        { const fl = Math.sin(t * 22), lift = .5 + .5 * fl;
          for (const sd of [-1, 1]) {
            ctx.save(); ctx.translate(sd * 2.4, -.6); ctx.rotate(sd * (-.55 - lift * .35)); ctx.scale(sd, 1);
            const wg = ctx.createLinearGradient(0, -6, 0, 2); wg.addColorStop(0, "rgba(255,255,255," + .55 * a + ")"); wg.addColorStop(1, "rgba(220,236,255," + .14 * a + ")");
            ctx.fillStyle = wg; ctx.strokeStyle = "rgba(255,255,255," + .75 * a + ")"; ctx.lineWidth = .55;
            ctx.beginPath(); ctx.ellipse(3.6, -3, 4, 2.6, -.35, 0, 6.283); ctx.fill(); ctx.stroke();
            ctx.fillStyle = "rgba(255,255,255," + .25 * a + ")"; ctx.beginPath(); ctx.ellipse(2.6, 1.2, 2.3, 1.5, .4, 0, 6.283); ctx.fill(); ctx.stroke();
            ctx.fillStyle = "rgba(255,255,255," + .8 * a + ")"; ctx.beginPath(); ctx.arc(2.8, -4.1, .7, 0, 6.283); ctx.fill();
            ctx.restore();
          } }
        ctx.shadowColor = "rgba(" + LIME + ",1)"; ctx.shadowBlur = 14 * pulse;
        const ab = ctx.createRadialGradient(-1, 2, 0, 0, 3, 5); ab.addColorStop(0, "rgba(255,255,245," + a + ")"); ab.addColorStop(.55, "rgba(" + CORE + "," + a * .9 + ")"); ab.addColorStop(1, "rgba(" + LIME + ",0)");
        ctx.fillStyle = ab; ctx.beginPath(); ctx.arc(0, 3, 5, 0, 6.283); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      } else trail.length = 0;
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i]; p.life++; if (p.gv) p.vy += p.gv; p.x += p.vx + Math.sin(p.life * .08 + i) * .12; p.y += p.vy;
        if (p.life > p.max) { P.splice(i, 1); continue; }
        const k = p.life / p.max, a = (k < .15 ? k / .15 : 1) * (1 - k) * (1 - k);
        if (p.t === "wisp") {
          p.rot += p.vr; const al = a * .85; ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.shadowColor = "rgba(" + LIME + ",1)"; ctx.shadowBlur = 8;
          ctx.fillStyle = ctx.strokeStyle = "rgba(" + CORE + "," + al.toFixed(3) + ")"; const z = p.s * (1 - k * .4);
          if (p.sh === 0) { ctx.beginPath(); ctx.arc(0, 0, z, 0, 6.283); ctx.fill(); }
          else if (p.sh === 1) { ctx.lineWidth = .8; ctx.lineCap = "round"; ctx.beginPath(); for (let m = 0; m < 3; m++) { const an = m * 1.047; ctx.moveTo(-Math.cos(an) * z, -Math.sin(an) * z); ctx.lineTo(Math.cos(an) * z, Math.sin(an) * z); } ctx.stroke(); }
          else { ctx.beginPath(); ctx.moveTo(0, -z); ctx.quadraticCurveTo(0, 0, z * .5, 0); ctx.quadraticCurveTo(0, 0, 0, z); ctx.quadraticCurveTo(0, 0, -z * .5, 0); ctx.quadraticCurveTo(0, 0, 0, -z); ctx.fill(); }
          ctx.restore(); continue;
        }
        if (p.t === "px") { ctx.fillStyle = "rgba(" + p.c + "," + a * .9 + ")"; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s); }
        else if (p.t === "glow") glow(p.x, p.y, p.s, p.c, a * (.6 + .4 * Math.sin(p.life * .3)));
        else glow(p.x, p.y, 1, LIME, a * .6);
      }
      requestAnimationFrame(frame);
    }
    let visible = true;
    const start = () => { if (!running && visible) { running = true; requestAnimationFrame(frame); } };
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? start() : (running = false); }).observe(box);
  }

  function boot() {
    const tryHero = () => { const h = document.querySelector(".v12-hero"); if (h) { initForest(h); return true; } return false; };
    if (!tryHero()) { const mo = new MutationObserver(() => { if (tryHero()) mo.disconnect(); }); mo.observe(document.body, { childList: true, subtree: true }); }
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();

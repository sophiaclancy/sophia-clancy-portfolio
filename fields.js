// fields.js: Terrarium covers. A photo is cropped, color-pushed, smeared and blurred into an
// almost-abstract "field" behind the work (canvas.da-field[data-field]). At rest the field shows
// through a soft blob mask; on hover the mask grows past the card so the field fills it (see CSS 15.0).
// Photos live in assets/fields/ (Sophia's own photos, from clancystuff).
(function () {
  var FIELDS = {
    asus:       { file: "assets/fields/water.png",       crop: [0, 0, 688, 470],      sat: 1.1,  con: 1.1 },
    // Notability: real clouds, kept legible (less blur, almost no smear)
    notability: { file: "assets/fields/clouds.png",      crop: [0, 0, 675, 1200],   sat: .82,  con: .94,  blur: .42, smear: .2,  fit: "squash" },
    contexto:   { file: "assets/fields/leaf-shadow.png", crop: [50, 90, 1030, 1820],  sat: 1.15, con: 1.08 },
    partake:    { file: "assets/fields/flowers-pop.png", crop: [0, 0, 990, 900],      sat: 1.12, con: 1.06 },
    // Play page
    sand:       { file: "assets/fields/peach-blue.png",   crop: [20, 20, 1400, 190],   sat: 1.05, con: 1.05 },
    baro:       { file: "assets/fields/flowers-soft.png", crop: [0, 0, 735, 986],      sat: 1.05, con: 1.0 },
    circuit:    { file: "assets/fields/green-grain.png",  crop: [0, 0, 820, 978],      sat: 1.1,  con: 1.0 },
    brain:      { file: "assets/fields/mitosis.png",      crop: [140, 160, 880, 300],  sat: 1.0,  con: 1.0 }
  };

  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }
  function noise1(R, n) { var v = []; for (var i = 0; i <= n; i++) v.push(R()); return function (t) { t = Math.max(0, Math.min(.9999, t)) * n; var i = Math.floor(t), f = t - i; f = f * f * (3 - 2 * f); return v[i] * (1 - f) + v[i + 1] * f; }; }

  var GRAIN = (function () { var g = document.createElement("canvas"); g.width = g.height = 256; var c = g.getContext("2d"), im = c.createImageData(256, 256), d = im.data; for (var i = 0; i < d.length; i += 4) { var v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 46; } c.putImageData(im, 0, 0); return g; })();

  // soft, slightly uneven blob used as the resting mask
  var BLOB = (function () {
    var W = 400, H = 300, m = document.createElement("canvas"); m.width = W; m.height = H; var mc = m.getContext("2d");
    var pad = .045, x0 = W * pad, y0 = H * pad, w = W * (1 - 2 * pad), h = H * (1 - 2 * pad), rr = Math.min(w, h) * .14, e = noise1(rng(9), 8);
    mc.filter = "blur(" + Math.round(W * .022) + "px)"; mc.fillStyle = "#000"; mc.beginPath();
    mc.moveTo(x0 + rr, y0 + (e(.1) - .5) * h * .08);
    mc.bezierCurveTo(x0 + w * .35, y0 - h * .04 * e(.3), x0 + w * .65, y0 + h * .06 * e(.5), x0 + w - rr, y0);
    mc.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + rr); mc.lineTo(x0 + w, y0 + h - rr); mc.quadraticCurveTo(x0 + w, y0 + h, x0 + w - rr, y0 + h);
    mc.bezierCurveTo(x0 + w * .6, y0 + h + h * .03 * e(.8), x0 + w * .3, y0 + h - h * .04 * e(.9), x0 + rr, y0 + h);
    mc.quadraticCurveTo(x0, y0 + h, x0, y0 + h - rr); mc.lineTo(x0, y0 + rr); mc.quadraticCurveTo(x0, y0, x0 + rr, y0); mc.fill();
    return "url(" + m.toDataURL() + ")";
  })();

  var IMGS = {};
  function load(f) { return IMGS[f] || (IMGS[f] = new Promise(function (ok) { var i = new Image(); i.onload = function () { ok(i); }; i.src = f; })); }

  function paint(cv) {
    var spec = FIELDS[cv.dataset.field]; if (!spec) return;
    var r = cv.getBoundingClientRect(); if (!r.width) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1), W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    if (cv.width === W && cv.dataset.done) return;
    cv.dataset.done = "1"; cv.style.setProperty("--blob", BLOB);
    load(spec.file).then(function (img) {
      // 1. small, color-pushed crop
      var q = 1 / Math.max(.5, spec.blur || 1), sw = Math.round(240 * q), sh = Math.round(180 * q), a = document.createElement("canvas"); a.width = sw; a.height = sh; var ac = a.getContext("2d"), cr = spec.crop, k = Math.max(sw / cr[2], sh / cr[3]);
      ac.filter = "saturate(" + spec.sat + ") contrast(" + spec.con + ") blur(" + (2 * (spec.blur || 1)) + "px)";
      if (spec.fit === "squash") ac.drawImage(img, cr[0], cr[1], cr[2], cr[3], 0, 0, sw, sh); // fit the whole photo: more clouds in frame
      else ac.drawImage(img, cr[0], cr[1], cr[2], cr[3], (sw - cr[2] * k) / 2, (sh - cr[3] * k) / 2, cr[2] * k, cr[3] * k);
      // 2. vertical smear
      var b = document.createElement("canvas"); b.width = sw; b.height = sh; var bc = b.getContext("2d"), R = rng(21), n = noise1(R, 16), n2 = noise1(R, 50);
      for (var x = 0; x < sw; x++) { var t = x / sw; bc.drawImage(a, x, 0, 1, sh, x, ((n(t) - .5) * .14 + (n2(t) - .5) * .02) * sh * (spec.smear == null ? 1 : spec.smear) - sh * .04, 1, sh * 1.08); }
      // 3. blur full-bleed, then grain
      cv.width = W; cv.height = H; var c = cv.getContext("2d");
      c.filter = "blur(" + Math.round(W * .02 * (spec.blur || 1)) + "px)"; c.drawImage(b, -W * .06, -H * .06, W * 1.12, H * 1.12); c.filter = "none";
      c.globalCompositeOperation = "source-atop"; c.globalAlpha = .55; c.fillStyle = c.createPattern(GRAIN, "repeat"); c.fillRect(0, 0, W, H);
    });
  }

  // Runtime: show the pre-baked field (assets/fields/baked/<name>.webp, made by tools/bake-fields.mjs).
  // Painting from the full photo only happens on the bake page (?bake), so visitors download ~60KB, not ~1.5MB, per field.
  var BAKE = /[?&]bake\b/.test(location.search);
  function show(cv) {
    if (cv.dataset.done || !FIELDS[cv.dataset.field]) return; cv.dataset.done = "1";
    cv.style.setProperty("--blob", BLOB);
    cv.style.background = "url(assets/fields/baked/" + cv.dataset.field + ".webp) center/cover no-repeat";
  }
  function run() { document.querySelectorAll("canvas.da-field").forEach(BAKE ? paint : show); }
  var tries = 0; (function wait() { run(); if (++tries < 40 && !document.querySelector("canvas.da-field[data-done]")) setTimeout(wait, 150); })();
  if (!BAKE) return;
  var t; addEventListener("resize", function () { clearTimeout(t); t = setTimeout(function () { document.querySelectorAll("canvas.da-field").forEach(function (c) { delete c.dataset.done; }); run(); }, 200); });
})();

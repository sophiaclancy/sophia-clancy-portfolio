// footer.js: the ant farm footer. Soil (her strata photo, blurred + grained) with stippled tunnels,
// black ants commuting through them, grass on the ground line. Quote of the day sits in one chamber,
// the links in another. Quote changes once per day (same for everyone that day).
(function () {
  // Wise or a little funny, all well-documented attributions (verify before adding more).
  var QUOTES = [
    [
        "Imagination is more important than knowledge.",
        "Albert Einstein"
    ],
    [
        "Life is like riding a bicycle. To keep your balance you must keep moving.",
        "Albert Einstein"
    ],
    [
        "Everything I'm not made me everything I am.",
        "Kanye West"
    ],
    [
        "We are all in the gutter, but some of us are looking at the stars.",
        "Oscar Wilde"
    ],
    [
        "When you come to a fork in the road, take it.",
        "Yogi Berra"
    ],
    [
        "“You miss 100% of the shots you don't take.” — Wayne Gretzky",
        "Michael Scott"
    ],
    [
        "Life moves pretty fast. If you don't stop and look around once in a while, you could miss it.",
        "Ferris Bueller"
    ],
    [
        "Travel isn't always pretty. It isn't always comfortable. Sometimes it hurts, it even breaks your heart. But that's okay.",
        "Anthony Bourdain"
    ],
    [
        "If you want the rainbow, you gotta put up with the rain.",
        "Dolly Parton"
    ],
    [
        "You can't use up creativity. The more you use, the more you have.",
        "Maya Angelou"
    ],
    [
        "We don't make mistakes, just happy little accidents.",
        "Bob Ross"
    ],
    [
        "Without music, life would be a mistake.",
        "Friedrich Nietzsche"
    ],
    [
        "Hard work beats talent when talent doesn't work hard.",
        "Tim Notke"
    ],
    [
        "The marathon continues.",
        "Nipsey Hussle"
    ],
    [
        "Started from the bottom, now we're here.",
        "Drake"
    ],
    [
        "Speak yourself.",
        "RM of BTS"
    ],
    [
        "Is it me, or is everything a little blurry?",
        "Casper, resident mantis"
    ]
  ];
  var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
  var m = /[?&]sf=(\d+)/.exec(location.search), pick = m ? +m[1] : day; // ?sf=N previews day N
  var q = QUOTES[pick % QUOTES.length];
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Layouts in 0..1 of the footer box. tunnels: points (smoothed); chambers: [cx, cy, rx, ry]; slots: where content sits.
  var LAYOUT = {
    wide: { h: 480, ground: 0,
      tunnels: [[[.04,0],[.1,.24],[.07,.5],[.18,.68]], [[.18,.68],[.32,.6],[.44,.7],[.58,.62]], [[.58,.62],[.66,.36],[.78,.22],[.86,0]], [[.44,.7],[.5,.88],[.66,.9],[.8,.82]]],
      chambers: [[.24,.42,.13,.16], [.79,.6,.1,.19], [.6,.9,.035,.035], [.93,.86,.025,.03], [.1,.86,.03,.03]],
      quote: [12.2, 26, 19], links: [68.9, 41] },
    narrow: { h: 740, ground: 0,
      tunnels: [[[.08,0],[.06,.14],[.14,.26]], [[.86,.32],[.93,.46],[.8,.55],[.5,.56],[.25,.6],[.09,.7]], [[.09,.7],[.08,.87],[.5,.95],[.86,.9]]],
      chambers: [[.5,.3,.44,.14], [.56,.74,.4,.12], [.12,.93,.06,.03]],
      quote: [17, 19, 66], links: [27, 65] }
  };
  var SOIL = "assets/fields/small/soil.webp", soilImg = null;

  function rng(s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function smooth(pts, W, H) {
    var p = pts.map(function (v) { return [v[0] * W, v[1] * H]; }), d = "M" + p[0][0] + " " + p[0][1];
    for (var i = 0; i < p.length - 1; i++) { var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      d += " C" + (p1[0] + (p2[0] - p0[0]) / 6) + " " + (p1[1] + (p2[1] - p0[1]) / 6) + " " + (p2[0] - (p3[0] - p1[0]) / 6) + " " + (p2[1] - (p3[1] - p1[1]) / 6) + " " + p2[0] + " " + p2[1]; }
    return d;
  }

  // Paint soil + stippled tunnels once per size (about 40ms at desktop width; skipped until the footer is near view).
  function paint(f, lay) {
    var W = f.clientWidth, H = f.clientHeight, S = Math.min(1, 1400 / W), w = Math.round(W * S), h = Math.round(H * S), gy = lay.ground * h;
    var cv = f.querySelector(".sf-soil"); cv.width = w; cv.height = h; var c = cv.getContext("2d");
    var soil = document.createElement("canvas"); soil.width = w; soil.height = h; var sc = soil.getContext("2d");
    sc.filter = "blur(" + Math.round(w * .006) + "px) saturate(1.15) contrast(1.05)";
    sc.drawImage(soilImg, 0, 0, soilImg.width, soilImg.height * .82, -w * .02, gy - h * .02, w * 1.04, (h - gy) * 1.05);
    function mask(blur, grow) {
      var mk = document.createElement("canvas"); mk.width = w; mk.height = h; var mc = mk.getContext("2d");
      mc.filter = "blur(" + blur + "px)"; mc.strokeStyle = mc.fillStyle = "#fff"; mc.lineCap = mc.lineJoin = "round"; mc.lineWidth = 32 * S + grow;
      lay.tunnels.forEach(function (t) { mc.stroke(new Path2D(smooth(t, w, h))); });
      lay.chambers.forEach(function (k, ci) { var Rn = rng(31 + ci * 7), ph = [Rn() * 6, Rn() * 6, Rn() * 6]; mc.beginPath();
        for (var a = 0; a <= 64; a++) { var th = a / 64 * Math.PI * 2, j = 1 + .07 * Math.sin(th * 2 + ph[0]) + .05 * Math.sin(th * 3 + ph[1]) + .03 * Math.sin(th * 5 + ph[2]);
          var px = k[0] * w + Math.cos(th) * (k[2] * w * j + grow / 2), py = k[1] * h + Math.sin(th) * (k[3] * h * j + grow / 2); a ? mc.lineTo(px, py) : mc.moveTo(px, py); }
        mc.closePath(); mc.fill(); });
      mc.filter = "none"; mc.fillRect(0, 0, w, Math.max(0, gy - 2));
      return mc.getImageData(0, 0, w, h).data;
    }
    var tight = mask(9 * S + 2, 0), wide = mask(16 * S + 4, 22 * S);
    var sd = sc.getImageData(0, 0, w, h).data, out = c.createImageData(w, h), o = out.data, R = rng(7);
    for (var i = 0; i < o.length; i += 4) {
      var t = tight[i + 3] / 255, rim = wide[i + 3] / 255, y = (i / 4 / w) | 0;
      var open = Math.min(1, Math.max(0, (t - .08) * 1.6)); if (y < gy + 10) open = Math.max(open, 1 - Math.max(0, Math.min(1, (y - gy) / 10)));
      if (R() < open) { o[i + 3] = 0; continue; } // open air: the page shows through
      var dark = 1 - .3 * rim * (1 - t), n = (R() - .5) * 34;
      o[i] = sd[i] * dark + n; o[i + 1] = sd[i + 1] * dark + n; o[i + 2] = sd[i + 2] * dark + n; o[i + 3] = 255;
    }
    c.putImageData(out, 0, 0);
  }

  // Grass, flowers and ants live in an SVG on top. Ants pause when the footer is off screen.
  var NS = "http://www.w3.org/2000/svg";
  var ANT = '<ellipse cx="-5" cy="0" rx="3.4" ry="2.3"/><ellipse cx="0" cy="0" rx="1.9" ry="1.5"/><ellipse cx="4.2" cy="0" rx="2.3" ry="2"/>' +
    '<g class="lg l1"><path d="M-1 0 l-3 -4 M1 0 l3 4 M-1 0 l-3 4"/></g><g class="lg l2"><path d="M1 0 l3 -4 M0 0 l0 5 M0 0 l0 -5"/></g><path class="lg" d="M6 -1 l3 -3 M6 1 l3 3"/>';
  function life(f, lay, st) {
    var W = f.clientWidth, H = f.clientHeight, svg = f.querySelector(".sf-life"), G = lay.ground * H - 3, R2 = rng(3), html = '<g class="sf-grass">';
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    for (var x = 0; x < W; x += 5 + R2() * 9) { var hh = 6 + R2() * (R2() < .1 ? 26 : 12), lean = (R2() - .5) * 8; html += '<path d="M' + x.toFixed(1) + " " + (G + 3) + " q" + (lean / 2).toFixed(1) + " " + (-hh / 2).toFixed(1) + " " + lean.toFixed(1) + " " + (-hh).toFixed(1) + '"/>'; }
    for (var k = 0, nf = Math.round(W / 160); k < nf; k++) { var fx = 40 + R2() * (W - 80), fh = 22 + R2() * 18; html += '<path d="M' + fx.toFixed(1) + " " + (G + 3) + " l0 " + (-fh).toFixed(1) + '"/><circle class="fl' + (k % 3 ? "" : " b") + '" cx="' + fx.toFixed(1) + '" cy="' + (G - fh).toFixed(1) + '" r="3.2"/>'; }
    svg.innerHTML = html + "</g>";
    var R3 = rng(11); st.ants = [];
    lay.tunnels.forEach(function (t) {
      var p = document.createElementNS(NS, "path"); p.setAttribute("d", smooth(t, W, H)); p.setAttribute("fill", "none"); svg.appendChild(p);
      var len = p.getTotalLength();
      for (var j = 0, n = Math.max(1, Math.round(len / 140)); j < n; j++) {
        var a = document.createElementNS(NS, "g"); a.setAttribute("class", "sf-ant"); a.innerHTML = ANT; svg.appendChild(a);
        st.ants.push({ el: a, p: p, len: len, s: R3() * len, d: R3() < .5 ? 1 : -1, v: 14 + R3() * 10, off: (R3() - .5) * 5 });
      }
    });
    step(st, 0);
  }
  function step(st, dt) {
    st.ants.forEach(function (a) {
      a.s += a.d * a.v * dt; if (a.s > a.len) { a.s = a.len; a.d = -1; } if (a.s < 0) { a.s = 0; a.d = 1; }
      var q1 = a.p.getPointAtLength(a.s), q2 = a.p.getPointAtLength(Math.min(a.len, Math.max(0, a.s + a.d * 2)));
      var ang = Math.atan2(q2.y - q1.y, q2.x - q1.x) * 57.3, nx = -(q2.y - q1.y), ny = q2.x - q1.x, l = Math.hypot(nx, ny) || 1;
      a.el.setAttribute("transform", "translate(" + (q1.x + nx / l * a.off).toFixed(1) + " " + (q1.y + ny / l * a.off).toFixed(1) + ") rotate(" + ang.toFixed(1) + ") scale(1.25)");
    });
  }


  // Size the two content chambers around the text that's actually there, so nothing sits on the dirt at any width.
  function fitChambers(f, lay) {
    var fr = f.getBoundingClientRect(), W = fr.width, H = fr.height, out = JSON.parse(JSON.stringify(lay));
    [f.querySelector(".sf-q"), f.querySelector(".sf-links")].forEach(function (el, k) {
      if (!el) return; var r = el.getBoundingClientRect(), a = r.width / 2, b = r.height / 2;
      out.chambers[k] = [(r.left - fr.left + a) / W, (r.top - fr.top + b) / H, (a * 1.35 + 44) / W, (b * 1.3 + 40) / H];
    });
    return out;
  }

  function fill(f) {
    if (f.dataset.on) return; f.dataset.on = "1";
    f.classList.add("sf-farm");
    f.querySelector(".sf-quote").textContent = q[0];
    f.querySelector(".sf-by").textContent = "— " + q[1];
    var old = f.querySelector(".sf-dots"); if (old) old.remove();
    f.insertAdjacentHTML("afterbegin", '<canvas class="sf-soil" aria-hidden="true"></canvas><svg class="sf-life" aria-hidden="true"></svg>');
    var links = document.createElement("div"); links.className = "sf-links"; f.querySelectorAll(".sf-col").forEach(function (n) { links.appendChild(n); }); f.appendChild(links); var top = f.querySelector(".sf-top"); if (top) { var tr = document.createElement("div"); tr.className = "sf-toprow"; tr.appendChild(top); links.appendChild(tr); }
    var st = { ants: [], vis: false, lay: null, w: 0 };
    function layout() {
      var lay = f.clientWidth < 760 ? LAYOUT.narrow : LAYOUT.wide; st.lay = lay;
      f.style.height = lay.h + "px";
      f.style.setProperty("--q-x", lay.quote[0] + "%"); f.style.setProperty("--q-y", lay.quote[1] + "%"); f.style.setProperty("--q-w", lay.quote[2] + "%");
      f.style.setProperty("--l-x", lay.links[0] + "%"); f.style.setProperty("--l-y", lay.links[1] + "%");
      if (soilImg) { var fit = fitChambers(f, lay); paint(f, fit); life(f, fit, st); } st.w = f.clientWidth;
    }
    layout();
    // Load the soil after the page is done (idle), or sooner if the footer comes close. Ants only run while it's visible.
    var asked = false;
    function load() { if (asked) return; asked = true; var im = new Image(); im.onload = function () { soilImg = im; layout(); }; im.src = SOIL; }
    if (document.readyState === "complete") (window.requestIdleCallback || setTimeout)(load, { timeout: 2500 });
    else addEventListener("load", function () { (window.requestIdleCallback || setTimeout)(load, { timeout: 2500 }); });
    new IntersectionObserver(function (es) { st.vis = es[0].isIntersecting; if (st.vis) load(); }, { rootMargin: "400px 0px" }).observe(f);
    var last = performance.now();
    (function tick(now) { var dt = Math.min(64, now - last) / 1000; last = now; if (st.vis && !reduce && st.ants.length && !document.hidden) step(st, dt); requestAnimationFrame(tick); })(last);
    var rt; addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (Math.abs(f.clientWidth - st.w) > 2) layout(); }, 200); });
  }
  var tries = 0;
  (function go() { var fs = document.querySelectorAll("footer.sf"); fs.forEach(fill); if (!fs.length && ++tries < 40) setTimeout(go, 150); })();
})();

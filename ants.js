// ants.js: tiny Bao-style ants that live on the homepage cards (.card-plate[data-ants]).
// Modes: "edge" walks the screen's sides and top, "logo" circles the logo, "keys" presses
// keycaps, "cookie" is a team carrying a cookie. Top-down ants with an alternating tripod gait.
(function () {
  if (!window.matchMedia) return;
  var REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  // heading "up" is -y. Tripod A = L1 R2 L3, tripod B = R1 L2 R3.
  var ANT =
    '<svg viewBox="-10 -10 20 20" aria-hidden="true">' +
    '<g class="ant-legs" fill="none" stroke="currentColor" stroke-width=".55" stroke-linecap="round" stroke-linejoin="round">' +
    '<g class="ta"><path d="M-.9 -3.6 L-3.3 -5.2 L-4.7 -7.6"/><path d="M1 -2.6 L3.7 -2.3 L5.5 -.8"/><path d="M-.9 -1.6 L-3 .4 L-4.3 3.6"/></g>' +
    '<g class="tb"><path d="M.9 -3.6 L3.3 -5.2 L4.7 -7.6"/><path d="M-1 -2.6 L-3.7 -2.3 L-5.5 -.8"/><path d="M.9 -1.6 L3 .4 L4.3 3.6"/></g>' +
    '</g>' +
    '<g class="ant-ant" fill="none" stroke="currentColor" stroke-width=".45" stroke-linecap="round"><path d="M-.6 -7.2 L-1.7 -8.8 L-2.9 -8.4"/><path d="M.6 -7.2 L1.7 -8.8 L2.9 -8.4"/></g>' +
    '<g fill="currentColor"><ellipse cx="0" cy="3.5" rx="2.25" ry="3.1"/><circle cx="0" cy=".1" r=".65"/><ellipse cx="0" cy="-2.6" rx="1.25" ry="1.95"/><ellipse cx="0" cy="-6" rx="1.55" ry="1.45"/></g>' +
    '<ellipse cx="-.6" cy="2.4" rx=".7" ry="1.2" fill="#fff" opacity=".12"/>' +
    '</svg>';

  var SCALE = window.ANT_SCALE || .7;
  function makeAnt(host, size) {
    size = (size || 20) * SCALE;
    var el = document.createElement("span"); el.className = "ant"; el.innerHTML = ANT;
    el.style.width = el.style.height = size + "px"; host.appendChild(el); return el;
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  // polyline helpers
  function build(pts, closed) {
    var segs = [], L = 0, P = closed ? pts.concat([pts[0]]) : pts;
    for (var i = 0; i < P.length - 1; i++) { var a = P[i], b = P[i + 1], d = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push({ a: a, b: b, d: d, s: L, stop: b[2] }); L += d; }
    return { segs: segs, L: L, closed: closed };
  }
  function at(path, s) {
    for (var i = 0; i < path.segs.length; i++) { var g = path.segs[i]; if (s <= g.s + g.d || i === path.segs.length - 1) { var t = g.d ? (s - g.s) / g.d : 0; return { x: g.a[0] + (g.b[0] - g.a[0]) * t, y: g.a[1] + (g.b[1] - g.a[1]) * t, ang: Math.atan2(g.b[1] - g.a[1], g.b[0] - g.a[0]), seg: i }; } }
  }
  function rel(host, el, pad) {
    var h = host.getBoundingClientRect(), r = el.getBoundingClientRect(); pad = pad || 0;
    return { x: r.left - h.left - pad, y: r.top - h.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 };
  }

  function walker(host, getPath, o) {
    var ant = makeAnt(host, o.size); if (o.cls) ant.classList.add(o.cls); var path = null, s = o.start || 0, dir = 1, pause = rnd(300, 1800), ang = 0, wob = rnd(0, 6), stopped = 0;
    return {
      reset: function () { var old = path && path.L; path = getPath(); if (!path) return; if (o.frac != null && path.L > 50) s = old ? s / old * path.L : o.frac * path.L; else s = Math.min(s, path.L); },
      step: function (dt, now) {
        if (!path || !path.L) return;
        var moving = true;
        if (stopped > 0) { stopped -= dt; moving = false; }
        else if (!o.steady && (pause -= dt) <= 0) { stopped = rnd(500, 1500); pause = rnd(2500, 6500); moving = false; }
        if (moving) {
          var prev = s; s += dir * o.speed * dt / 1000;
          if (path.closed) s = (s + path.L) % path.L;
          else if (s > path.L || s < 0) { dir = -dir; s = Math.max(0, Math.min(path.L, s)); }
          if (o.onStop) path.segs.forEach(function (g) { var e = g.s + g.d; if (g.stop != null && ((prev < e && s >= e) || (prev > e && s <= e))) { stopped = 1100; o.onStop(g.stop); } });
        }
        var p = at(path, s), target = p.ang + (dir < 0 ? Math.PI : 0) + Math.PI / 2;
        var da = Math.atan2(Math.sin(target - ang), Math.cos(target - ang)); ang += da * Math.min(1, dt / (o.steady ? 45 : 120));
        var lat = moving && !o.steady ? Math.sin(now / 180 + wob) * .8 : 0;
        ant.style.transform = "translate(" + (p.x + Math.cos(ang) * lat) + "px," + (p.y + Math.sin(ang) * lat) + "px) rotate(" + ang * 180 / Math.PI + "deg)";
        ant.classList.toggle("is-still", !moving);
      }
    };
  }

  var MODES = {
    // Notability, Sand, Baro: up one side, along the top, down the other (ping-pong)
    edge: function (host) {
      var tgt = host.querySelector(host.dataset.antsTarget || ".device, img");
      function path() { var r = rel(host, tgt, 1); return build([[r.x, r.y + r.h * .9], [r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h * .9]], false); }
      return [walker(host, path, { speed: 22, start: 40, size: 18 }), walker(host, path, { speed: 19, start: 260, size: 16 }), walker(host, path, { speed: 24, start: 520, size: 17 })];
    },
    // ASUS: a loose loop around the lockup
    logo: function (host) {
      var tgt = host.querySelector(host.dataset.antsTarget || ".cb-asus-logo");
      function path() { var b = rel(host, tgt, 0), r = { x: b.x + b.w * .033 - 16, y: b.y + b.h * .28 - 16, w: b.w * .933 + 32, h: b.h * .414 + 32 }, k = 18; /* the PNG has transparent padding: hug the visible letters */ return build([[r.x + k, r.y], [r.x + r.w - k, r.y], [r.x + r.w, r.y + k], [r.x + r.w, r.y + r.h - k], [r.x + r.w - k, r.y + r.h], [r.x + k, r.y + r.h], [r.x, r.y + r.h - k], [r.x, r.y + k]], true); }
      return [walker(host, path, { speed: 26, start: 0, size: 22 }), walker(host, path, { speed: 26, start: 52, size: 20 }), walker(host, path, { speed: 23, start: 420, size: 21 })];
    },
    // ASUS (productive friction): a disciplined single file. Evenly spaced, same speed, no pauses,
    // marching a closed square-wave (zigzag) loop around the logo with crisp 90-degree turns.
    march: function (host) {
      var tgt = host.querySelector(host.dataset.antsTarget || ".cb-asus-logo"), N = 6, L0 = 0;
      function path() {
        var b = rel(host, tgt, 0), x0 = b.x + b.w * .033 - 18, x1 = b.x + b.w * .966 + 18, yt = b.y + b.h * .28 - 18, yb = b.y + b.h * .694 + 18;
        var teeth = 6, step = (x1 - x0) / teeth, d = 12, pts = [];
        for (var i = 0; i < teeth; i++) { var xa = x0 + i * step, xb = xa + step / 2, up = yt - d; pts.push([xa, yt], [xa, up], [xb, up], [xb, yt]); }
        pts.push([x1, yt]);
        for (var j = teeth; j > 0; j--) { var xc = x0 + j * step, xd = xc - step / 2, dn = yb + d; pts.push([xc, yb], [xc, dn], [xd, dn], [xd, yb]); }
        pts.push([x0, yb]);
        var p = build(pts, true); L0 = p.L; return p;
      }
      var ws = [];
      for (var k = 0; k < N; k++) ws.push(walker(host, path, { speed: 16, frac: k / N, size: 15, steady: true, cls: "ant-quiet" }));
      return ws;
    },
    // Contexto: walk onto each keycap and press it
    keys: function (host) {
      var wrap = document.createElement("div"); wrap.className = "ant-keys";
      wrap.innerHTML = "<kbd>⌘</kbd><kbd>F</kbd><kbd>↵</kbd>"; host.appendChild(wrap);
      var keys = wrap.querySelectorAll("kbd");
      function press(i) { var k = keys[i]; if (!k) return; var n = 0; (function tap() { k.classList.add("down"); setTimeout(function () { k.classList.remove("down"); if (++n < 3) setTimeout(tap, 160); }, 120); })(); }
      function path() {
        var pts = [], b = rel(host, wrap, 0);
        pts.push([b.x - 70, b.y + b.h + 10]);
        keys.forEach(function (k, i) { var r = rel(host, k, 0); pts.push([r.x + r.w / 2, r.y + r.h / 2 - 2, i]); });
        pts.push([b.x + b.w + 40, b.y - 14]);
        return build(pts, false);
      }
      return [walker(host, path, { speed: 20, start: 0, size: 17, onStop: press }), walker(host, path, { speed: 17, start: 120, size: 15, onStop: press })];
    },
    // Partake: five ants carrying one cookie together, slowly across the bottom
    cookie: function (host) {
      var team = document.createElement("div"); team.className = "ant-team";
      team.innerHTML = '<svg class="ant-cookie" viewBox="-12 -12 24 24" aria-hidden="true"><circle r="10.4" fill="#E9C99A"/><circle r="10.4" fill="none" stroke="#D4AE78" stroke-width=".9"/><circle r="8.3" fill="#F7EEE4"/><circle r="8.3" fill="none" stroke="#EADBCB" stroke-width=".6"/><g stroke-width="1.5" stroke-linecap="round"><path d="M-4.6 -3.4 l1.6 -.9" stroke="#E86A8E"/><path d="M1.6 -5.4 l1.4 1" stroke="#5DB0E6"/><path d="M4.4 -1 l.3 1.7" stroke="#F2C94C"/><path d="M-1.2 .2 l1.6 .6" stroke="#8FD18A"/><path d="M-5.2 2.4 l.8 1.5" stroke="#B58BE0"/><path d="M2.4 3.8 l1.6 -.5" stroke="#E86A8E"/><path d="M-1.6 5.4 l1.5 .5" stroke="#5DB0E6"/><path d="M-2.4 -6 l1.3 -.6" stroke="#F2C94C"/><path d="M5.6 -4 l.9 1.2" stroke="#8FD18A"/><path d="M-6.4 -.4 l.4 1.6" stroke="#5DB0E6"/><path d="M.4 -2.6 l1.4 -.7" stroke="#B58BE0"/><path d="M5.2 2 l.4 1.6" stroke="#F2C94C"/></g><path d="M-6.6 -5.8 A9 9 0 0 1 -.6 -8.4" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8"/></svg>';
      host.appendChild(team);
      var SPOTS = [[-8, -15], [8, -15], [-17, 0], [17, 0], [0, 17]], ants = SPOTS.map(function (p) { var a = makeAnt(team, 16); var h = 8 * SCALE, k = SCALE * .92; a.style.left = (p[0] * k - h) + "px"; a.style.top = (p[1] * k - h) + "px"; return a; });
      var s = -1, path = null;
      return [{
        reset: function () { var w = host.clientWidth, h = host.clientHeight, y = h - Math.max(26, h * .06); path = build([[-60, y], [w * .3, y - 8], [w * .6, y + 4], [w + 60, y - 6]], false); s = s < 0 ? path.L * .3 : Math.min(s, path.L); },
        step: function (dt, now) {
          if (!path) return;
          s += 11 * dt / 1000; if (s > path.L) s = 0;
          var p = at(path, s), bob = Math.sin(now / 240) * .6;
          team.style.transform = "translate(" + p.x + "px," + (p.y + bob) + "px) rotate(" + (p.ang * 180 / Math.PI + 90) + "deg)";
        }
      }];
    }
  };

  function init(host) {
    var mode = MODES[host.dataset.ants]; if (!mode) return;
    var actors = mode(host);
    function reset() { actors.forEach(function (a) { a.reset(); }); }
    reset(); if (window.ResizeObserver) { var ro = new ResizeObserver(reset); ro.observe(host); host.querySelectorAll("img,iframe,.device,kbd").forEach(function (e) { ro.observe(e); }); }
    host.querySelectorAll("img").forEach(function (i) { if (!i.complete) i.addEventListener("load", reset); });
    addEventListener("load", reset);
    if (REDUCE) { actors.forEach(function (a) { a.step(0, 0); }); host.classList.add("ants-still"); return; }
    var last = performance.now(), visible = true;
    if (window.IntersectionObserver) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(host);
    (function frame(now) { var dt = Math.min(64, now - last); last = now; if (visible) actors.forEach(function (a) { a.step(dt, now); }); requestAnimationFrame(frame); })(last);
  }
  var tries = 0;
  function go() { var n = document.querySelectorAll("[data-ants]:not([data-ants-on])"); n.forEach(function (h) { h.dataset.antsOn = "1"; init(h); }); if (!document.querySelector("[data-ants-on]") && ++tries < 40) setTimeout(go, 150); }
  window.initAnts = go;
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", go); else go();
})();

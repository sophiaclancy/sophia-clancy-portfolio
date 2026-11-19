// footer.js: daily footer. One of the field photos, blurred and grained (like the cards),
// a quote of the day, and the links. Quote and scene change once per day (same for everyone that day).
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
  // Her pick: the pink flower, every day. Other options stay listed for previewing with ?sfimg=name.
  var SCENES = [
    { name: "flowers-soft", file: "assets/fields/flowers-soft.png", bg: "#B05F78" },
    { name: "flowers-pop",  file: "assets/fields/flowers-pop.png",  bg: "#A8473C" },
    { name: "water",        file: "assets/fields/water.png",        bg: "#3F6D90" },
    { name: "leaf-shadow",  file: "assets/fields/leaf-shadow.png",  bg: "#5E7A3C" },
    { name: "clouds",       file: "assets/fields/clouds.png",       bg: "#4F7FA8" },
    { name: "peach-blue",   file: "assets/fields/peach-blue.png",   bg: "#5A5F96" },
    { name: "bokeh",        file: "assets/fields/bokeh.png",        bg: "#5D7230" },
    { name: "green-grain",  file: "assets/fields/green-grain.png",  bg: "#2F5A2C" },
    { name: "mitosis",      file: "assets/fields/mitosis.png",      bg: "#2C5BB8" }
  ];
  var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
  var m = /[?&]sf=(\d+)/.exec(location.search), pick = m ? +m[1] : day; // ?sf=N previews day N
  var q = QUOTES[pick % QUOTES.length], mi = /[?&]sfimg=([\w-]+)/.exec(location.search);
  var scene = SCENES.filter(function (x) { return mi && x.name === mi[1]; })[0] || SCENES[0];

  // Blur + grain field (same treatment as the card fields): photo, smeared, heavily blurred, grained,
  // with a light wash of the day's color so the white text stays readable.
  var GRAIN = (function () { var g = document.createElement("canvas"); g.width = g.height = 256; var c = g.getContext("2d"), im = c.createImageData(256, 256), d = im.data; for (var i = 0; i < d.length; i += 4) { var v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 46; } c.putImageData(im, 0, 0); return g; })();
  function noise1(n) { var v = []; for (var i = 0; i <= n; i++) v.push(Math.random()); return function (t) { t = Math.max(0, Math.min(.9999, t)) * n; var i = Math.floor(t), f = t - i; f = f * f * (3 - 2 * f); return v[i] * (1 - f) + v[i + 1] * f; }; }
  function dots(cv, img) {
    var r = cv.getBoundingClientRect(); if (!r.width) return;
    var dpr = Math.min(2, devicePixelRatio || 1), W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    cv.width = W; cv.height = H; var c = cv.getContext("2d");
    var sw = 320, sh = Math.max(60, Math.round(sw * H / W)), a = document.createElement("canvas"); a.width = sw; a.height = sh;
    var ac = a.getContext("2d"), k = Math.max(sw / img.naturalWidth, sh / img.naturalHeight);
    ac.filter = "saturate(1.1) blur(2px)"; ac.drawImage(img, (sw - img.naturalWidth * k) / 2, (sh - img.naturalHeight * k) / 2, img.naturalWidth * k, img.naturalHeight * k);
    var b = document.createElement("canvas"); b.width = sw; b.height = sh; var bc = b.getContext("2d"), n = noise1(18);
    for (var x = 0; x < sw; x++) bc.drawImage(a, x, 0, 1, sh, x, (n(x / sw) - .5) * sh * .18 - sh * .05, 1, sh * 1.1);
    c.filter = "blur(" + Math.round(W * .02) + "px)"; c.drawImage(b, -W * .05, -H * .1, W * 1.1, H * 1.2); c.filter = "none";
    c.fillStyle = scene.bg; c.globalAlpha = .38; c.fillRect(0, 0, W, H); c.globalAlpha = 1;
    c.globalAlpha = .55; c.fillStyle = c.createPattern(GRAIN, "repeat"); c.fillRect(0, 0, W, H); c.globalAlpha = 1;
  }

  function fill(f) {
    if (f.dataset.on) return; f.dataset.on = "1";
    f.style.setProperty("--sf-bg", scene.bg);
    f.querySelector(".sf-quote").textContent = q[0];
    f.querySelector(".sf-by").textContent = "— " + q[1];
    var cv = f.querySelector(".sf-dots"), img = new Image();
    img.onload = function () { dots(cv, img); var t; addEventListener("resize", function () { clearTimeout(t); t = setTimeout(function () { dots(cv, img); }, 200); }); };
    img.src = scene.file;
  }
  var tries = 0;
  (function go() { var fs = document.querySelectorAll("footer.sf"); fs.forEach(fill); if (!fs.length && ++tries < 40) setTimeout(go, 150); })();
})();

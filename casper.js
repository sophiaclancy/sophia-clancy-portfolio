// casper.js: Casper, Sophia's praying mantis. Lives along the bottom of the sidebar,
// walks back and forth, stops now and then to say something. Click him for the next line.
// Usage: Casper.mount(containerElement)  (container needs position:relative)
(function () {
  var LINES = [
    "hi, I'm Casper. yes, like the friendly ghost.",
    "I'm praying you hire her.",
    "patience is a hunting strategy.",
    "observe first, pounce later. same as good research.",
    "the ants unionized. I'm management now.",
    "don't mind the ants. productive friction.",
    "I've been standing here for hours. call it user research.",
    "these arms aren't for hugging. I'd still try.",
    "resume's in the menu ↑ I'd hand it to you, but, arms.",
    "lost a file? there's a whole case study for that.",
    "I can turn my head 180°. great for reading both columns.",
    "legs: six. opinions: many.",
    "I don't automate. I wait.",
    "sorry, I'm mid-prayer.",
    "pacing is how I think.",
    "click me again. I'm not going anywhere. I'm very slow.",
    "careful, she might start psychoanalyzing you.",
    "there's levels to this. keep scrolling.",
    "don't worry, she only psychoanalyzes on the second visit.",
    "she started with bugs. now it's people. you're next.",
    "is it me, or is everything a little blurry?"
  ];

  // Casper: her mantis doodle (08-mantis-doodle.png). Black thick-marker stick mantis, facing right, no face.
  var SVG =
    '<svg viewBox="95 140 330 320" aria-hidden="true">' +
    '<g class="cp-body" fill="none" stroke="#1F1A16" stroke-width="26" stroke-linecap="round" stroke-linejoin="round">' +
      '<g class="cp-leg cp-l2b"><path d="M240 384 L190 310 L122 430"/></g>' +
      '<path d="M178 384 L250 386"/>' +
      '<path d="M180 380 L333 246"/>' +
      '<g class="cp-leg cp-l2"><path d="M268 336 L286 438"/></g>' +
      '<g class="cp-leg cp-l3"><path d="M300 346 L346 346 L346 414"/></g>' +
      '<g class="cp-arm"><path d="M318 282 L338 330 L348 300 L380 300 L376 336"/></g>' +
      '<g class="cp-head"><path d="M318 236 Q332 222 348 236 Q340 252 326 250 Z" fill="#1F1A16" stroke-width="14"/>' +
      '<path d="M322 232 Q306 202 296 182"/><path d="M340 232 Q360 190 392 162"/></g>' +
    '</g>' +
    '<ellipse class="cp-shadow" cx="240" cy="445" rx="140" ry="8" fill="rgba(42,37,32,.12)"/>' +
    '</svg>';

  function mount(host) {
    var stage = document.createElement("div"); stage.className = "casper";
    stage.innerHTML = '<div class="cp-bubble" role="status" aria-live="polite"></div><button class="cp-bug" type="button" aria-label="Casper the praying mantis. Click to chat.">' + SVG + "</button>";
    host.appendChild(stage);
    var bug = stage.querySelector(".cp-bug"), bubble = stage.querySelector(".cp-bubble");
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var W = 60, x = 10, dir = 1, state = "walk", timer = rnd(3000, 6000), li = 0, last = performance.now(), hideAt = 0;
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function say(text) {
      bubble.textContent = text; bubble.classList.add("is-on");
      hideAt = performance.now() + 3200 + text.length * 40;
    }
    var order = [];
    function nextLine() { if (li === 0) { li++; return say(LINES[0]); } if (!order.length) { order = LINES.slice(1); for (var k = order.length - 1; k > 0; k--) { var r = Math.floor(Math.random() * (k + 1)); var t = order[k]; order[k] = order[r]; order[r] = t; } } say(order.pop()); li++; }
    bug.addEventListener("click", function () { state = "talk"; timer = 3600; nextLine(); });
    setTimeout(nextLine, 1200);

    function frame(now) {
      var dt = Math.min(64, now - last); last = now;
      var max = Math.max(0, stage.clientWidth - W);
      if (state === "walk" && !reduce) {
        x += dir * 14 * dt / 1000;
        if (x >= max) { x = max; dir = -1; }
        if (x <= 0) { x = 0; dir = 1; }
        if ((timer -= dt) <= 0) { state = Math.random() < .55 ? "talk" : "pause"; timer = state === "talk" ? 4200 : rnd(1500, 3000); if (state === "talk") nextLine(); }
      } else if ((timer -= dt) <= 0) { state = "walk"; timer = rnd(5000, 9000); }
      if (hideAt && now > hideAt) { bubble.classList.remove("is-on"); hideAt = 0; }
      stage.classList.toggle("is-walking", state === "walk" && !reduce);
      bug.style.transform = "translateX(" + x + "px)"; bug.firstChild.style.transform = "scaleX(" + dir + ")";
      var bw = bubble.offsetWidth, bx = Math.max(0, Math.min(stage.clientWidth - bw, x + W / 2 - bw / 2));
      bubble.style.transform = "translateX(" + bx + "px)";
      bubble.style.setProperty("--tail", (x + W / 2 - bx) + "px");
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  window.Casper = { mount: mount, lines: LINES };
})();

// Site: mount once into the sidebar (React renders it, so wait for it).
(function () {
  var tries = 0;
  (function go() {
    var sb = document.querySelector("aside.sb");
    if (sb && !sb.querySelector(".casper")) { window.Casper.mount(sb); return; }
    if (++tries < 40) setTimeout(go, 150);
  })();
})();

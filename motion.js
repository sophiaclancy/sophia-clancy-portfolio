// motion.js — scroll-reveal layer for the portfolio motion system.
// Tags content blocks with [data-reveal] and flips them to .is-in via IntersectionObserver.
// No scroll listeners, no per-frame work, transform + opacity only.
(function () {
  var TARGETS = [
    ".sec-label", ".wcard", ".exp-body", ".hero-tl",
    ".cb-head", ".cb-step", ".cb-journey", ".cb-media", ".cb-img",
    ".cb-imgrow", ".cb-gallery", ".cb-collage", ".cb-versus",
    ".cb-quotes", ".cb-bigquote", ".cb-big", ".cb-points",
    ".cb-stats", ".cb-contrast", ".cb-table", ".cb-matrix",
    ".cb-spectrum", ".cb-callout"
  ];

  var io = null, guard = 0, tagged = [];

  function run() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    var root = document.querySelector(".cs-scroll") || null;
    if (!io) io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add("is-in");
          io.unobserve(entries[i].target);
        }
      }
    }, { root: root, rootMargin: "0px 0px -8% 0px", threshold: 0.08 });


    var nodes = document.querySelectorAll(TARGETS.join(","));
    for (var j = 0; j < nodes.length; j++) {
      var el = nodes[j];
      if (el.hasAttribute("data-reveal")) continue;
      el.setAttribute("data-reveal", "");
      // stagger siblings lightly, capped so nothing ever feels slow
      var d = Math.min(3, j % 4) * 45;
      if (d) el.style.setProperty("--reveal-delay", d + "ms");
      io.observe(el);
      tagged.push(el);
    }
    if (tagged.length && !guard) {
      guard = setTimeout(function () {
        if (document.visibilityState !== "visible") return;
        for (var k = 0; k < tagged.length; k++) {
          if (!tagged[k].classList.contains("is-in")) {
            var b = tagged[k].getBoundingClientRect();
            if (b.bottom > 0 && b.top < (window.innerHeight || 0)) tagged[k].classList.add("is-in");
          }
        }
      }, 1500);
    }
  }

  // Babel-transpiled React trees mount after load, so sweep a few times.
  // run() skips nodes it already tagged, so repeats are cheap.
  function schedule() { [60, 350, 900, 1800].forEach(function (t) { setTimeout(run, t); }); }
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule);
})();

/* cursor inverts over the footer for contrast */
(function(){function bind(){var f=document.querySelector(".v12-foot");if(!f){return setTimeout(bind,300);}f.addEventListener("pointerenter",function(){document.documentElement.classList.add("cc-on-foot");});f.addEventListener("pointerleave",function(){document.documentElement.classList.remove("cc-on-foot");});}bind();})();

/* nav active state: current page stays lit */
(function(){function mark(){var nav=document.querySelector(".v12-nav");if(!nav){return setTimeout(mark,300);}var p=(location.pathname.split("/").pop()||"Portfolio.html").toLowerCase();var w=nav.querySelector("#nav-work"),ab=nav.querySelector('a[href="About.html"]'),r=nav.querySelector("#nav-resume");if(p===""||p==="portfolio.html"){w&&w.classList.add("is-active");}if(p==="about.html"){ab&&ab.classList.add("is-active");}}mark();})();

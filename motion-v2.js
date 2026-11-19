// motion-v2.js: entrance choreography, nav pill, case-study reveals, shared field names for page transitions.
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function when(sel, fn, n) { var el = document.querySelector(sel); if (el) return fn(el); if ((n || 0) < 60) setTimeout(function () { when(sel, fn, (n || 0) + 1); }, 80); }
  function on(els, gap, start) { els.forEach(function (el, i) { el.style.setProperty("--m-d", (start + Math.min(i, 5) * gap) + "ms"); requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("m-on"); }); }); }); }

  // Same-origin page change from a card: name the clicked card's field so it morphs into the hero.
  addEventListener("pagereveal", function () { nameFields(); });
  function nameFields() {
    document.querySelectorAll("canvas.da-field[data-field]").forEach(function (c) {
      var host = c.closest(".cb-hero") || c.closest(".pl-art") || c.closest(".card-plate");
      if (host && !host.style.viewTransitionName) host.dataset.mField = c.dataset.field;
    });
  }
  addEventListener("pageswap", function (e) {
    var to = e.activation && e.activation.entry && e.activation.entry.url; if (!to) return;
    var a = Array.prototype.find.call(document.querySelectorAll("a.wcard, a.pl-item"), function (x) { return x.href === to; });
    var host = a && (a.querySelector(".card-plate") || a.querySelector(".pl-art"));
    if (host) host.style.viewTransitionName = "m-field";
  });
  addEventListener("pagereveal", function () {
    var hero = document.querySelector(".cb-hero.has-field"); if (hero) hero.style.viewTransitionName = "m-field";
    setTimeout(function () { if (hero) hero.style.viewTransitionName = ""; }, 900);
  });


  // Collapsible sidebar (≤1100px): tab on the left edge opens it, the page dims behind it.
  when(".sb.fh", function (sb) {
    var root = document.documentElement, mq = matchMedia("(max-width:1100px)");
    var tab = document.createElement("button"); tab.className = "sb-tab"; tab.type = "button"; tab.setAttribute("aria-label", "Open menu"); tab.setAttribute("aria-expanded", "false");
    tab.innerHTML = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var scrim = document.createElement("div"); scrim.className = "sb-scrim";
    var close = document.createElement("button"); close.className = "sb-close"; close.type = "button"; close.setAttribute("aria-label", "Close menu");
    close.innerHTML = '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    document.body.appendChild(tab); document.body.appendChild(scrim); sb.appendChild(close); sb.setAttribute("tabindex", "-1");
    if (!sb.id) sb.id = "sidebar"; tab.setAttribute("aria-controls", sb.id);
    // name + tagline at the top of the page while the sidebar is tucked away
    when(".sb-main", function (main) {
      var name = sb.querySelector(".hero-left"), h = document.createElement("div"); h.className = "sb-mhead";
      var wm = sb.querySelector(".sb-wm"); h.innerHTML = (wm ? '<a class="sb-mwm" href="./"><span class="sb-wm">' + wm.innerHTML + '</span><span class="sb-wm-txt">Sophia Clancy</span></a>' : "<b>Sophia Clancy</b>") + "<span>CogSci &amp; Data Science @ UC Berkeley. A product builder who decides what AI should do, and what stays human.</span>";
      main.insertBefore(h, main.firstChild);
    });
    function set(open) {
      root.classList.toggle("sb-open", open); tab.setAttribute("aria-expanded", open ? "true" : "false");
      if (mq.matches) { sb.setAttribute("role", "dialog"); sb.setAttribute("aria-modal", open ? "true" : "false"); }
      if (open) setTimeout(function () { sb.focus({ preventScroll: true }); }, 60);
      else if (document.activeElement && sb.contains(document.activeElement)) tab.focus({ preventScroll: true });
    }
    tab.addEventListener("click", function () { set(true); });
    close.addEventListener("click", function () { set(false); });
    scrim.addEventListener("click", function () { set(false); });
    addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("sb-open")) set(false); });
    sb.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    (mq.addEventListener ? mq.addEventListener("change", function () { if (!mq.matches) { set(false); sb.removeAttribute("role"); sb.removeAttribute("aria-modal"); } }) : 0);
  });

  if (reduce) return;
  var arrived = !!(document.referrer && new URL(document.referrer).origin === location.origin);

  // First load only (page changes already have their own transition): sidebar settles, then the main column.
  if (!arrived) {
    when(".sb .hero-left", function () {
      var side = [].concat([].slice.call(document.querySelectorAll(".sb .hero-left > *")), [].slice.call(document.querySelectorAll(".sb-nav a")), [document.querySelector(".sb-out")]).filter(Boolean);
      side.forEach(function (el) { el.classList.add("m-enter"); });
      on(side, 40, 60);
    });
    when(".cb main", function (main) {
      var head = [].slice.call(main.querySelectorAll("#overview > *")).slice(0, 5);
      head.forEach(function (el) { el.classList.add("m-enter"); });
      on(head, 70, 80);
    });
  }

  // Nav pill: sits on the current page, slides to whatever you hover.
  when(".sb-nav a", function () {
    var nav = document.querySelector(".sb-nav"), pill = document.createElement("span");
    pill.className = "m-pill m-first"; nav.insertBefore(pill, nav.firstChild);
    function go(t) {
      t = t || nav.querySelector("a.is-active");
      if (!t) { pill.style.opacity = 0; return; }
      pill.style.opacity = 1; pill.style.width = t.offsetWidth + "px"; pill.style.height = t.offsetHeight + "px";
      pill.style.transform = "translate(" + t.offsetLeft + "px," + t.offsetTop + "px)";
    }
    go(); requestAnimationFrame(function () { pill.classList.remove("m-first"); });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("pointerenter", function () { go(a); }); a.addEventListener("focus", function () { go(a); }); });
    nav.addEventListener("pointerleave", function () { go(); });
    addEventListener("resize", function () { pill.classList.add("m-first"); go(); requestAnimationFrame(function () { pill.classList.remove("m-first"); }); });
  });

  // Case studies: each section's blocks rise in as they scroll into view (max 4 staggered, 60ms apart).
  when(".cb main > section:not(#overview)", function () {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("m-on"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px", threshold: .05 });
    document.querySelectorAll(".cb main > section:not(#overview)").forEach(function (sec) {
      [].slice.call(sec.children).forEach(function (el, i) {
        if (el.getBoundingClientRect().top < innerHeight * .9) return; // already on screen: leave it alone
        el.classList.add("m-rev"); el.style.setProperty("--m-d", Math.min(i, 3) * 60 + "ms"); io.observe(el);
      });
    });
  });
})();

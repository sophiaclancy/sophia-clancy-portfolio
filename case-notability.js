/* case-notability.js — TOC scroll-spy, lazy live demos, core-loop strip, tabs, AI↔list demo, reveal. */
(function () {
  "use strict";
  // home link works from file:// too
  document.querySelectorAll("[data-home]").forEach((a) => (a.href = location.protocol === "file:" ? "index.html" : "./"));

  // TOC scroll-spy
  const links = [...document.querySelectorAll(".toc a")];
  const secs = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const spy = () => {
    let cur = secs[0];
    for (const s of secs) if (s.getBoundingClientRect().top < innerHeight * 0.35) cur = s;
    links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + cur.id));
  };
  addEventListener("scroll", spy, { passive: true }); spy();

  // live demos load only when they come into view (each is the real prototype on a self-playing tour)
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting && !e.target.src) { e.target.src = e.target.dataset.src; io.unobserve(e.target); }
  }), { rootMargin: "300px" });
  document.querySelectorAll("iframe[data-src]").forEach((f) => io.observe(f));

  // core loop strip
  const loop = document.querySelector(".loop");
  if (loop) {
    const btns = [...loop.querySelectorAll(".steps button")], frame = loop.querySelector("iframe"), panes = [...loop.querySelectorAll("[data-pane]")];
    const show = (i) => {
      btns.forEach((b, k) => b.classList.toggle("on", k === i));
      panes.forEach((p, k) => (p.hidden = k !== i));
      const src = "prototypes/notability/index.html?embed&tour=" + btns[i].dataset.tour;
      if (frame.src || frame.dataset.loaded) frame.src = src; else frame.dataset.src = src;
      frame.dataset.loaded = 1;
    };
    btns.forEach((b, i) => b.addEventListener("click", () => show(i)));
    show(0);
  }

  // tabs
  document.querySelectorAll(".tabs").forEach((t) => {
    const bs = [...t.querySelectorAll(".tb button")], ps = [...t.querySelectorAll(".pn")];
    bs.forEach((b, i) => b.addEventListener("click", () => { bs.forEach((x, k) => x.classList.toggle("on", k === i)); ps.forEach((p, k) => (p.hidden = k !== i)); }));
  });

  // AI goals ↔ to-do list demo (same intent, two levels of help)
  const sd = document.querySelector(".segdemo");
  if (sd) {
    const DATA = {
      ai: [["Use flashcards to review key characteristics of dwarf planets", "From your highlights · 64% flashcard accuracy"], ["Complete a quiz on Chapter 6: Is Pluto a Planet with at least 80% accuracy", "Quiz is Thursday"], ["Explain in your own words why Pluto was reclassified in 2006", "You highlighted this twice"]],
      list: [["understand what a dwarf planet is", ""], ["review notes about pluto", ""]],
    };
    const FT = { ai: "Specific, measurable tasks pulled from your notes and quiz results. Tap ☰ My list to keep your own words.", list: "Your words, untouched. Same session, timer, and progress, with no AI-written steps." };
    const rows = sd.querySelector(".rows"), ft = sd.querySelector(".ft"), bs = [...sd.querySelectorAll(".seg button")];
    const draw = (m) => {
      bs.forEach((b) => b.classList.toggle("on", b.dataset.m === m));
      rows.innerHTML = DATA[m].map(([t, w]) => '<div class="row"><i></i><span>' + t + (w ? "<small>✦ " + w + "</small>" : "") + "</span></div>").join("");
      ft.textContent = FT[m];
      const o = document.getElementById("sdOut"); if (o) o.textContent = m === "ai" ? "Learn turns it into" : "Learn keeps it as";
    };
    bs.forEach((b) => b.addEventListener("click", () => draw(b.dataset.m)));
    draw("ai");
  }

  // count-up on hover demo
  document.querySelectorAll(".d-num").forEach((n) => {
    const card = n.closest(".ixc"); const to = +n.dataset.to;
    card.addEventListener("mouseenter", () => {
      const t0 = performance.now();
      const f = (t) => { const k = Math.min(1, (t - t0) / 700); n.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); };
      requestAnimationFrame(f);
    });
  });

  // reveal on scroll
  const rv = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rv.unobserve(e.target); } }), { rootMargin: "-8% 0px" });
  document.querySelectorAll(".rv").forEach((el) => rv.observe(el));
})();

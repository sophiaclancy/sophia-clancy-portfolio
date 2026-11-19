/* Contexto v4 — ambient, Grammarly-style.
   No panel to open. As you write or reach an upload field, Contexto notices references to files
   ("my final project from CS 61A", "the supply and demand graphs from ECON 1") and quietly underlines them.
   Click the underline (or press Tab) → one card → one button. Works anywhere you write or upload.
   ?scene=mail|notes|form · ?embed · ?tour=1 · ?still */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const Q = new URLSearchParams(location.search);
  const EMBED = Q.has("embed"), TOUR = Q.get("tour"), STILL = Q.has("still");
  if (EMBED) document.body.classList.add("embed");
  if (STILL) document.body.classList.add("still");
  const T = (ms) => new Promise((r) => setTimeout(r, STILL ? 0 : ms));

  /* ── stage ── */
  const mac = $("#mac");
  let scale = 1;
  const fit = () => {
    const st = $("#stage").getBoundingClientRect(), pad = EMBED ? 0 : 14;
    scale = Math.min((st.width - pad * 2) / 1512, (st.height - pad * 2) / 982);
    mac.style.transform = `scale(${scale})`;
    mac.style.left = (st.width - 1512 * scale) / 2 + "px";
    mac.style.top = (st.height - 982 * scale) / 2 + "px";
  };
  addEventListener("resize", fit); fit();
  const DOCK = ["finder", "launchpad", "safari", "messages", "mail", "maps", "photos", "facetime", "calendar", "contacts", "reminders", "notes", "freeform", "tv", "music", "news", "appstore", "|", "folder", "trash"];
  $("#dock").innerHTML = DOCK.map((n) => n === "|" ? '<span class="sepr"></span>' : `<span class="ic${["finder", "safari", "mail", "notes"].includes(n) ? " run" : ""}"><img src="img/dock/${n}.png" alt=""></span>`).join("");
  const rel = (el) => { const r = el.getBoundingClientRect(), m = mac.getBoundingClientRect(); return { x: (r.left - m.left) / scale, y: (r.top - m.top) / scale, w: r.width / scale, h: r.height / scale }; };
  const hintEl = $("#hint");
  const hint = (sel, delay = 350) => {
    clearTimeout(hint.t); hintEl.hidden = true;
    if (TOUR || EMBED || !sel) return;
    hint.t = setTimeout(() => { const el = typeof sel === "function" ? sel() : $(sel); if (!el || !el.isConnected) return; const b = rel(el);
      Object.assign(hintEl.style, { left: b.x - 4 + "px", top: b.y - 2 + "px", width: b.w + 8 + "px", height: b.h + 4 + "px", borderRadius: "8px" }); hintEl.hidden = false; }, delay);
  };
  const fi = (c = "") => `<span class="fi ${c}"><i></i><b></b><b></b><b></b></span>`;
  const mark = '<span class="ctx-mark"></span>';

  /* ── what Contexto finds (each one is grounded in signals it can name) ── */
  const FOUND = {
    cs61a: { head: "You mentioned an attachment", file: "CS61A_Ants_Project_Writeup.pdf", meta: "CS 61A · Spring 2024 · submitted to Gradescope on Apr 26, 2024",
      chips: [["Matches", "final project · CS 61A"], ["From", "Spring 2024"], ["Also", "Prof. Rivera taught it"]], act: "Attach", pv: ["CS 61A · Project 3", "Ants vs. SomeBees", "text"],
      others: [["CS61A_Hog_Project.zip", "Project 1 · Feb 2024"], ["CS61A_Final_Notes.pdf", "Study notes · May 2024"]] },
    econ1: { head: "From a class you took in 2023", file: "ECON1_Lecture07_Supply_Demand.pdf", meta: "ECON 1 · Fall 2023 · from bCourses · opened 9 times before your midterm",
      chips: [["Matches", "supply and demand · ECON 1"], ["From", "Fall 2023"]], act: "Insert Link", pv: ["Lecture 7", "Supply & Demand", "graph"],
      others: [["ECON1_Problem_Set_4.pdf", "Graphs practice · Oct 2023"], ["ECON1_Midterm_Review.key", "Oct 2023"]] },
  };

  /* ── scenes ── */
  const SCENES = {
    mail: { app: "Mail", win: "#w-mail", ed: "#ed-mail", badge: "#bd-mail",
      text: ["Hi Professor Rivera,\n\nI'm applying to the Undergraduate Research Apprentice Program and wanted to ask whether you'd be willing to write me a recommendation. I've attached ", ["cs61a", "my final project from CS 61A"], " so you can see the work I did in your class.\n\nThank you,\nMaya"] },
    notes: { app: "Notes", win: "#w-notes", ed: "#ed-notes", badge: "#bd-notes", pre: "<h2>ECON 100B · Midterm review</h2>",
      text: ["•  Price elasticity = % change in quantity ÷ % change in price\n•  Consumer surplus is the area under demand, above price\n•  Revisit ", ["econ1", "the supply and demand graphs from ECON 1"], " before Thursday\n"] },
    form: { app: "Safari", win: "#w-form" },
    views: { app: "Finder", win: "#w-views" },
    search: { app: "Finder", win: "#w-search" },
  };
  const ORDER = ["views", "search", "mail", "notes", "form"], LABEL = { views: "Day one: organized", search: "Find any file", mail: "Email a professor", notes: "Study notes", form: "Upload a file" };
  const done = new Set();
  let scene = null, run = 0;

  async function show(name) {
    const my = ++run; scene = name; closeCard(); hint(null);
    $$("#scSeg button").forEach((b) => b.classList.toggle("on", b.dataset.s === name));
    $("#scNext").innerHTML = "";
    ORDER.forEach((n) => ($(SCENES[n].win).hidden = n !== name));
    $("#cpanel").hidden = true;
    const S = SCENES[name], w = $(S.win); w.classList.add("active"); w.classList.remove("enter"); void w.offsetWidth; w.classList.add("enter");
    $("#mbApp").textContent = S.app;
    if (name === "form") return formScene(my);
    if (name === "views") return viewsScene(my);
    if (name === "search") return searchScene(my);
    // type it out, like she's writing
    const ed = $(S.ed); ed.innerHTML = S.pre || ""; $(S.badge).innerHTML = ""; $("#att-mail").innerHTML = "";
    const caret = document.createElement("span"); caret.className = "caret2"; ed.append(caret);
    for (const seg of S.text) {
      const isRef = Array.isArray(seg), str = isRef ? seg[1] : seg;
      const node = isRef ? Object.assign(document.createElement("span"), { className: "ul" }) : document.createTextNode("");
      if (isRef) node.dataset.f = seg[0];
      ed.insertBefore(node, caret);
      for (let i = 0; i < str.length; i += STILL ? str.length : 2) {
        if (my !== run) return;
        if (isRef) node.textContent = str.slice(0, i + 2); else node.data = str.slice(0, i + 2);
        await T(14);
      }
      if (isRef) node.textContent = str; else node.data = str;
      if (isRef) setTimeout(() => surface(node, S), STILL ? 0 : 450);   // noticed a beat after she finishes the phrase
    }
    caret.remove();
  }
  function surface(node, S) {
    if (!node.isConnected) return;
    node.classList.add("on");
    $(S.badge).innerHTML = `${mark}<i>1</i>`;
    node.onclick = (e) => { e.stopPropagation(); openCard(node); };
    node.onmouseenter = () => { clearTimeout(hoverT); hoverT = setTimeout(() => openCard(node), 180); };
    node.onmouseleave = () => { clearTimeout(hoverT); hoverT = setTimeout(maybeClose, 380); };
    hint(() => (node.classList.contains("ok") ? null : node), 600);
  }
  let hoverT;
  const maybeClose = () => { if (!$("#sug").matches(":hover") && !(openFor && openFor.matches(":hover"))) closeCard(); };
  $("#sug").addEventListener("mouseenter", () => clearTimeout(hoverT));
  $("#sug").addEventListener("mouseleave", () => { clearTimeout(hoverT); hoverT = setTimeout(maybeClose, 380); });

  /* ── the card ── */
  let openFor = null;
  function openCard(node) {
    const f = FOUND[node.dataset.f], card = $("#sug");
    if (openFor === node && !card.hidden) return;
    openFor = node; node.classList.add("open"); hint(null);
    const render = (others) => {
      card.innerHTML = `<div class="sh2">${mark}<span>${f.head}</span><span class="x" id="sx">✕</span></div>
        <div class="file"><div class="pv"><p>${f.pv[0]}</p><span>${f.pv[1]}</span>${f.pv[2] === "graph" ? '<svg viewBox="0 0 60 34"><path d="M6 4 L54 30 M6 30 L54 4" stroke="#007aff" stroke-width="2" fill="none"/><path d="M4 32 H58 M4 2 V32" stroke="#c7c7cc" stroke-width="1"/></svg>' : "<b></b><b></b><b></b><b></b>"}</div><div><b>${f.file}</b><small>${f.meta}</small></div></div>
        <div class="srcs">${f.chips.map(([i, t]) => `<span class="src"><i>${i}</i>${t}</span>`).join("")}</div>
        <div class="acts"><button class="btn blue" id="sAcc">${f.act}</button><button class="btn" id="sOpen">Open</button><span class="key"><kbd>Tab</kbd> to ${f.act.toLowerCase()}</span></div>
        ${others ? `<div class="others">${f.others.map(([n, m]) => `<div class="oth" data-n="${n}">${fi()}<span>${n}</span><em>${m}</em></div>`).join("")}</div>` : ""}
        <div class="more"><span id="sOth">${others ? "Hide other matches" : `Other matches (${f.others.length})`}</span><span id="sNo">Not this</span></div>`;
      $("#sx").onclick = closeCard;
      $("#sAcc").onclick = () => accept(node, f.file);
      $("#sOth").onclick = () => render(!others);
      $("#sNo").onclick = () => dismiss(node);
      $$("#sug .oth").forEach((o) => (o.onclick = () => accept(node, o.dataset.n)));
      $("#sOpen").onclick = closeCard;
    };
    render(false);
    card.hidden = false;
    const b = rel(node);
    card.style.left = Math.min(b.x, 1512 - 370) + "px";
    card.style.top = b.y + b.h + 8 + "px";
    hint("#sAcc", 500);
  }
  function closeCard() { $("#sug").hidden = true; if (openFor) openFor.classList.remove("open"); openFor = null; }
  function accept(node, file) {
    closeCard(); node.classList.add("ok"); node.onclick = null;
    const S = SCENES[scene];
    if (scene === "mail") {
      $("#att-mail").innerHTML = `<div class="att">${fi()}<div><b>${file}</b><small>PDF · 2.1 MB</small></div></div>`;
    } else {
      const chip = document.createElement("span"); chip.className = "flink"; chip.innerHTML = `${fi()}${file.replace(/\.(pdf|key|zip)$/, "")}`;
      node.after(" ", chip);
    }
    $(S.badge).innerHTML = `${mark}<i>✓</i>`; $(S.badge).classList.add("ok");
    finish();
  }
  function dismiss(node) {
    closeCard(); node.classList.add("ok"); node.onclick = null;
    $(SCENES[scene].badge).innerHTML = "";
  }
  addEventListener("keydown", (e) => {
    if (e.key === "Tab" && openFor) { e.preventDefault(); $("#sAcc").click(); }
    else if (e.key === "Tab" && !openFor) { const u = $(`${SCENES[scene].ed || "#x"} .ul.on:not(.ok)`); if (u) { e.preventDefault(); openCard(u); } }
    if (e.key === "Escape") closeCard();
  });
  document.addEventListener("click", (e) => { if (openFor && !e.target.closest("#sug") && !e.target.closest(".ul")) closeCard(); });

  /* ── upload field: the suggestion is simply there, under the field ── */
  async function formScene(my) {
    $("#drop-form").hidden = false; $("#ok-form").hidden = true; $("#sub-form").disabled = true;
    const old = $("#inl-form"); if (old) old.remove();
    await T(900); if (my !== run) return;
    const inl = document.createElement("div"); inl.className = "inl"; inl.id = "inl-form";
    inl.innerHTML = `${mark}${fi()}<div class="t"><b>Unofficial_Transcript_Spring2026.pdf</b><small>Your newest transcript · downloaded from CalCentral on Jun 2</small></div><button class="btn blue sm" id="inlAcc">Attach</button>`;
    $("#drop-form").after(inl);
    hint("#inlAcc", 500);
    $("#inlAcc").onclick = () => {
      inl.remove(); $("#drop-form").hidden = true;
      const ok = $("#ok-form"); ok.hidden = false; ok.innerHTML = `<span class="pdf">PDF</span>Unofficial_Transcript_Spring2026.pdf<small>188 KB</small>`;
      $("#sub-form").disabled = false; finish();
    };
  }


  /* ── Day one: Organized views. Virtual, read-only folders built from the graph. Nothing moves. ── */
  const DL = [["Screenshot 2024-03-02 at 11.42.png", "PNG image", "Mar 2, 2024", "img"], ["Resume_final_v3 (2).pdf", "PDF document", "Aug 2, 2025"], ["ECON1_Lecture07_Supply_Demand.pdf", "PDF document", "Oct 14, 2023"],
    ["lab01.py", "Python script", "Jan 24, 2024"], ["IMG_4471.heic", "HEIC image", "Oct 30, 2023", "img"], ["invoice_8812.pdf", "PDF document", "Jun 3, 2025"], ["CS61A_Ants_Project_Writeup.pdf", "PDF document", "Apr 26, 2024"],
    ["Untitled 3.pages", "Pages document", "Feb 9, 2025", "pages"], ["Resume_PM_Fall26.pdf", "PDF document", "Oct 30, 2026"], ["ECON1_Syllabus.pdf", "PDF document", "Aug 24, 2023"], ["download (1).pdf", "PDF document", "Nov 2, 2024"],
    ["Lecture13_Slides.pdf", "PDF document", "Nov 14, 2026"], ["resume_PM_new (2).pdf", "PDF document", "Sep 18, 2026"], ["Unofficial_Transcript_Spring2026.pdf", "PDF document", "Jun 2, 2026"]];
  const VIEWS = {
    econ1: { title: "ECON 1", sub: "Class · 7 files from 4 places", secs: [
      ["Fall 2023", "freshman year", [["ECON1_Syllabus.pdf", "Syllabus", "Downloads", "Aug 24, 2023", ["Fall 2023", "Syllabus"]], ["Econ notes week 3.pages", "Notes", "Documents", "Sep 12, 2023", ["Fall 2023", "Notes"], "pages"],
        ["ECON1_Lecture07_Supply_Demand.pdf", "Slides", "Downloads", "Oct 14, 2023", ["Fall 2023", "Slides", "Midterm prep"]], ["ECON1_Problem_Set_4.pdf", "Problem set", "Desktop", "Oct 20, 2023", ["Fall 2023", "Problem set"]],
        ["ECON1_Midterm_Review.key", "Slides", "iCloud Drive › School", "Oct 25, 2023", ["Fall 2023", "Slides", "Midterm prep"]], ["IMG_4471.heic", "Whiteboard photo", "Downloads", "Oct 30, 2023", ["Fall 2023", "Read by OCR: “elasticity”"], "img"],
        ["Midterm_ECON1_graded.pdf", "Exam", "Downloads", "Nov 3, 2023", ["Fall 2023", "Exam"]]]],
      ["Mentions ECON 1", "", [["ECON 100B · Midterm review", "Note", "Notes app", "Today", ["Links to Lecture07"]]]]] },
    cs61a: { title: "CS 61A", sub: "Class · 14 files from 3 places", secs: [["Spring 2024", "freshman year", [["lab01.py", "Lab", "Downloads", "Jan 24, 2024", ["Spring 2024", "Lab"]], ["CS61A_Hog_Project.zip", "Project", "Documents", "Feb 16, 2024", ["Spring 2024", "Project"]], ["CS61A_Ants_Project_Writeup.pdf", "Project", "Downloads", "Apr 26, 2024", ["Spring 2024", "Project", "Sent to Prof. Rivera"]], ["CS61A_Final_Notes.pdf", "Notes", "iCloud Drive › School", "May 6, 2024", ["Spring 2024", "Notes"]]]]] },
    latest: { title: "Latest versions", sub: "Only the newest copy of each document", note: 1, secs: [["Résumés & records", "", [["Resume_PM_Fall26.pdf", "Résumé · product", "Downloads", "Oct 30, 2026", ["Current", "Sent to 3"]], ["Resume_UX_Fall26.pdf", "Résumé · design", "Documents", "Oct 12, 2026", ["Current", "Sent to 1"]], ["Resume_PM_Fall26_Notion.pdf", "Résumé · tailored", "Documents", "Oct 21, 2026", ["Tailored for Notion"]], ["Unofficial_Transcript_Spring2026.pdf", "Transcript", "Downloads", "Jun 2, 2026", ["Current"]]]],
      ["Hidden older versions", "still on disk", [["Resume_final_v3 (2).pdf", "Résumé · older", "Downloads", "Aug 2, 2025", ["Older version"], "", 1], ["resume_PM_new (2).pdf", "Résumé · older", "Downloads", "Sep 18, 2026", ["Older version"], "", 1], ["Resume_Design_2025.pdf", "Résumé · older", "Documents", "Nov 4, 2025", ["Older version"], "", 1]]]] },
  };
  const SIDE = [["Classes", [["econ1", "ECON 1", 8], ["cs61a", "CS 61A", 14], ["", "DATA 8", 9], ["", "ECON 100B", 6]]], ["Terms", [["", "Fall 2023", 31], ["", "Spring 2024", 44], ["", "Fall 2026 · now", 18]]], ["", [["latest", "Latest versions", ""]]]];
  let vMode = "folders", vView = "econ1", organized = false, showOld = false;
  const vrow = (r, i) => `<div class="vrow${r[6] ? " old" : ""}" data-i="${i}" style="animation-delay:${i * 35}ms"><span class="nm">${fi(r[5] === "img" ? "img" : r[5] === "pages" ? "pages" : "")}${r[0]}</span><span class="k">${r[1]}</span><span class="wh">${r[2]}</span><span class="d">${r[3]}</span></div>`;
  function renderViews() {
    const L = $("#vList"), B = $("#vBanner"), Fo = $("#vFoot");
    $$("#vSeg button").forEach((b) => b.classList.toggle("on", b.dataset.m === vMode));
    $$("#w-views .it").forEach((x) => x.classList.toggle("sel", vMode === "folders" ? x.dataset.v === "dl" : x.dataset.view === vView));
    Fo.innerHTML = "";
    if (vMode === "folders") {
      $("#vTitle").textContent = "Downloads"; $("#vSub").textContent = "47 items · 14 shown";
      L.innerHTML = DL.map((r, i) => vrow([r[0], r[1], "Downloads", r[2], [], r[3]], i)).join("");
      if (!organized) B.hidden = true;
      else { B.hidden = false; B.className = "vbanner"; B.innerHTML = `<span>This is your real Downloads folder, <b>unchanged</b>.</span><button class="btn sm" id="toOrg">See it organized</button>`; $("#toOrg").onclick = () => { vMode = "org"; renderViews(); }; }
      return;
    }
    const V = VIEWS[vView]; $("#vTitle").textContent = V.title; $("#vSub").textContent = V.sub;
    B.hidden = false; B.className = "vbanner";
    B.innerHTML = V.note ? `<span><b>View only.</b> The newest version of each document. ${showOld ? "" : "3 older versions are hidden here, still on disk."}</span><button class="btn sm" id="tOld">${showOld ? "Hide older" : "Show older"}</button>`
      : `<span><b>View only.</b> Gathered from Downloads, Desktop, Documents, and iCloud. <b>Nothing was moved.</b></span>`;
    const t = $("#tOld"); if (t) t.onclick = () => { showOld = !showOld; renderViews(); };
    let rows = [], h = "";
    V.secs.forEach(([s, sm, rs]) => { if (V.note && rs[0][6] && !showOld) return; h += `<div class="vsec">${s}${sm ? `<small>${sm}</small>` : ""}</div>`; rs.forEach((r) => { h += vrow(r, rows.length); rows.push(r); }); });
    L.innerHTML = h;
    $$("#vList .vrow").forEach((el) => (el.onclick = () => {
      $$("#vList .vrow").forEach((x) => x.classList.remove("sel")); el.classList.add("sel");
      const r = rows[+el.dataset.i];
      Fo.innerHTML = `Also appears in ${r[4].map((c) => `<span class="src">${c}</span>`).join("")}<span style="margin-left:auto">Really in <b>${r[2]}</b> · <span class="lnk">Show in Finder</span></span>`;
    }));
  }
  function renderSide() {
    $("#orgSide").innerHTML = SIDE.map(([g, items]) => `<div class="og">${g ? `<div class="it grp-t">${g}</div>` : ""}${items.map(([id, n, c]) => `<div class="it sub" ${id ? `data-view="${id}"` : ""}>${n}<span class="n">${c}</span></div>`).join("")}</div>`).join("");
    $$("#orgSide [data-view]").forEach((x) => (x.onclick = () => { vMode = "org"; vView = x.dataset.view; renderViews(); hint(null); }));
  }
  async function viewsScene(my) {
    vMode = "folders"; vView = "econ1"; organized = false; showOld = false;
    $("#orgSide").innerHTML = ""; $("#orgPct").textContent = ""; renderViews();
    $$("#w-views .it[data-v]").forEach((x) => (x.onclick = () => { vMode = "folders"; renderViews(); }));
    $("#vSeg").onclick = (e) => { const b = e.target.closest("button"); if (!b || !organized) return; vMode = b.dataset.m; renderViews(); };
    for (let p = 0; p <= 100; p += 4) { if (my !== run) return; $("#orgPct").textContent = p < 100 ? `${p}%` : ""; await T(45); }
    if (my !== run) return;
    organized = true; renderSide();
    const B = $("#vBanner"); B.hidden = false; B.className = "vbanner found";
    B.innerHTML = `<div><b>Your files, organized. Nothing moved.</b><div class="stats"><span>4 classes</span><span>6 terms</span><span>11 résumés</span><span>3 projects</span></div></div><button class="btn blue" id="seeOrg">See Organized</button>`;
    $("#seeOrg").onclick = () => { vMode = "org"; vView = "econ1"; renderViews(); finish(); hint(() => $('#orgSide [data-view="latest"]'), 900); };
    hint("#seeOrg", 400);
  }


  /* ── Find any file: Finder's search misses the middle of names; ⌥Space doesn't ── */
  const RES = [
    ["Resume_PM_Fall26.pdf", "pdf", ["Résumé", "Current"], "Downloads", "Oct 30, 2026"],
    ["Resume_UX_Fall26.pdf", "pdf", ["Résumé", "Current"], "Documents", "Oct 12, 2026"],
    ["Resume_PM_Fall26_Notion.pdf", "pdf", ["Résumé", "Tailored · Notion"], "Documents", "Oct 21, 2026"],
    ["resume_PM_new (2).pdf", "pdf", ["Résumé", "Older version"], "Downloads", "Sep 18, 2026"],
    ["CV_template_2024.docx", "docx", ["Template", "Someone else's"], "Downloads", "Mar 9, 2024"],
  ];
  const hlq = (name, q) => { const i = name.toLowerCase().indexOf(q); return i < 0 ? name : `${name.slice(0, i)}<mark>${name.slice(i, i + q.length)}</mark>${name.slice(i + q.length)}`; };
  async function typeInto(el, text, my, speed = 85) { el.textContent = ""; for (let i = 1; i <= text.length; i++) { if (my !== run) return false; el.textContent = text.slice(0, i); await T(speed); } return true; }
  async function searchScene(my) {
    const fq = $("#fq"), cp = $("#cpanel"), cq = $("#cq"), list = $("#cres");
    $("#w-search").classList.remove("dim"); $("#fbody").innerHTML = ""; fq.textContent = ""; cp.hidden = true; cq.textContent = ""; list.innerHTML = "";
    await T(600); if (my !== run) return;
    $("#fsearch").classList.add("focus");
    if (!(await typeInto(fq, "sume", my))) return;
    await T(450); if (my !== run) return;
    $("#fbody").innerHTML = `<div class="nores"><b>No Results</b><span>Searching “This Mac” for “sume”</span></div>`;
    await T(1400); if (my !== run) return;
    $("#fsearch").classList.remove("focus");
    $("#w-search").classList.add("dim"); cp.hidden = false; cp.classList.remove("in"); void cp.offsetWidth; cp.classList.add("in");
    $("#mbApp").textContent = "Contexto";
    if (!(await typeInto(cq, "sume", my, 110))) return;
    const draw = (q, items) => {
      list.innerHTML = items.map((r, i) => `<div class="cr${i === 0 ? " sel" : ""}"><span class="fi ${r[1] === "docx" ? "pages" : ""}"><i></i><b></b><b></b><b></b></span>
        <div class="t"><b>${hlq(r[0], q)}</b><small>${r[2].map((c) => `<em class="${/Older|else/.test(c) ? "o" : c === "Current" ? "c" : ""}">${c}</em>`).join("")}</small></div>
        <span class="loc">${r[3]}</span><span class="dt">${r[4]}</span></div>`).join("");
      $("#cmeta").textContent = `${items.length} results · 9 ms`;
    };
    draw("sume", RES);
    await T(1300); if (my !== run) return;
    if (!(await typeInto(cq, "sume pm", my, 110))) return;
    draw("sume", RES.filter((r) => /PM/.test(r[0])));
    finish(); hint(() => $("#cres .cr.sel"), 500);
  }

  function finish() {
    done.add(scene); hint(null);
    $$("#scSeg button").forEach((b) => b.classList.toggle("done", done.has(b.dataset.s)));
    const nxt = ORDER.find((n) => !done.has(n));
    const DONE_LINE = { views: "Organized, and nothing moved.", search: "Any part of a name, typos too." };
    $("#scNext").innerHTML = nxt ? `${DONE_LINE[scene] || "That's it. No panel, no searching."}<button id="goNext">Next: ${LABEL[nxt]} ›</button>` : "All five done. Same layer everywhere.";
    const g = $("#goNext"); if (g) g.onclick = () => show(nxt);
  }

  $("#scSeg").onclick = (e) => { const b = e.target.closest("button"); if (b) show(b.dataset.s); };
  $("#replay").onclick = () => show(scene);
  show(ORDER.includes(Q.get("scene")) ? Q.get("scene") : ORDER[0]);

  /* ── stills: ?still&scene=X&open (card open) / &done ── */
  if (STILL) setTimeout(() => {
    const u = $(`${SCENES[scene].ed || "#x"} .ul`);
    if (Q.has("open") && u) openCard(u);
    if (scene === "search" && Q.has("done")) { $("#cpanel").hidden = false; return; }
    if (scene === "views" && Q.has("done")) { const go = () => { const s = $("#seeOrg"); if (!s) return setTimeout(go, 30); s.click(); if (Q.has("latest")) $('#orgSide [data-view="latest"]').click(); else { const r = $('#vList .vrow[data-i="2"]'); r && r.click(); } }; go(); return; }
    if (Q.has("done")) { if (u) accept(u, FOUND[u.dataset.f].file); else { const a = $("#inlAcc"); a && a.click(); } }
  }, 80);

  /* ── self-playing tour ── */
  if (TOUR) {
    const c = $("#cursor"); c.hidden = false; c.style.left = "900px"; c.style.top = "700px";
    const W = (ms) => new Promise((r) => setTimeout(r, ms));
    const click = async (get) => { for (let k = 0; k < 40 && !get(); k++) await W(150); const el = get(); if (!el) return; const b = rel(el); c.style.left = b.x + b.w * 0.5 + "px"; c.style.top = b.y + b.h * 0.6 + "px"; await W(850); c.classList.add("click"); await W(120); c.classList.remove("click"); el.click(); };
    (async () => {
      for (const s of TOUR === "scene" ? [scene] : ORDER) {
        if (scene !== s) show(s);
        if (s === "form") { await click(() => $("#inlAcc")); await W(2200); continue; }
        if (s === "search") { await W(9000); continue; }
        if (s === "views") { await click(() => $("#seeOrg")); await W(2200); await click(() => $('#vList .vrow[data-i="2"]')); await W(1800); await click(() => $('#orgSide [data-view="latest"]')); await W(2400); continue; }
        await click(() => $(`${SCENES[s].ed} .ul.on`)); await W(1800);
        await click(() => $("#sAcc")); await W(2200);
      }
      await W(TOUR === "scene" ? 1500 : 0);
      if (TOUR !== "once") location.reload();
    })();
  }
})();

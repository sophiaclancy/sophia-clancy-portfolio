/* Study Session + Profile Personalization — clickable rebuild of the team's Figma (Final Hi-fi › Combined).
   Flows: Onboarding survey → Learn profile → Entry → Selecting Content → Goals → Timer → In Progress → Ending.
   Motion matches the team's flow videos (dissolve + lift, progress fills, check pops, confetti) and only plays on change. */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const F = "img/fig/";
  const img = (n, cls) => '<img src="' + F + n + '" alt=""' + (cls ? ' class="' + cls + '"' : "") + " />";
  const sv = (p, sw) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  const IC = {
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z"/>',
    alarm: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M5 3 2 6M22 6l-3-3"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    belloff: '<path d="M13.7 21a2 2 0 0 1-3.4 0M18.6 13A18 18 0 0 1 18 8M6.3 6.3A6 6 0 0 0 6 8c0 7-3 9-3 9h14M18 8a6 6 0 0 0-9.3-5M2 2l20 20"/>',
    folder: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    filewarn: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M12 11v4M12 18h.01"/>',
    audio: '<path d="M2 10v3M6 6v11M10 3v18M14 8v7M18 5v13M22 10v3"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2ZM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7Z"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    battery: '<rect x="2" y="7" width="16" height="10" rx="2"/><path d="M22 11v2M6 11v2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    sparkle: '<path d="M12 3c.5 4.5 4.5 8.5 9 9-4.5.5-8.5 4.5-9 9-.5-4.5-4.5-8.5-9-9 4.5-.5 8.5-4.5 9-9Z"/>',
    brain: '<path d="M12 5a3 3 0 1 0-6 .1 4 4 0 0 0-2.5 5.8 4 4 0 0 0 .6 6.6A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 6 .1 4 4 0 0 1 2.5 5.8 4 4 0 0 1-.6 6.6A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/>',
    msgs: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    ear: '<path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 0 0 4"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    pencil: '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    user: '<circle cx="12" cy="8" r="5" fill="currentColor"/><path d="M20 21a8 8 0 0 0-16 0Z" fill="currentColor"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    chevd: '<path d="m6 9 6 6 6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
  };
  const STAT = {
    bulb: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" fill="#ffa629"/><rect x="9" y="18.5" width="6" height="3" rx="1.2" fill="#ffa629"/></svg>',
    watch: '<svg viewBox="0 0 24 24"><circle cx="12" cy="14" r="8" fill="#4278ff"/><rect x="10" y="2" width="4" height="3" rx="1" fill="#4278ff"/><path d="M12 14l3.2-3.2" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
    note: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="15" height="16" rx="2" fill="none" stroke="#4278ff" stroke-width="2.4"/><path d="M10 14.5 19.5 5l2 2-9.5 9.5H10z" fill="#4278ff"/></svg>',
    bars: '<svg viewBox="0 0 24 24"><rect x="3" y="12" width="4.5" height="9" rx="1" fill="#ffa629"/><rect x="9.75" y="7" width="4.5" height="14" rx="1" fill="#ffa629"/><rect x="16.5" y="3" width="4.5" height="18" rx="1" fill="#ffa629"/></svg>',
  };

  /* ---------- content ---------- */
  const CHAPTERS = [
    ["Chapter 1: Introduction", "What the solar system is and how gravity binds it."],
    ["Chapter 2: Planets", "The eight planets and the ecliptic plane."],
    ["Chapter 3: The Sun", "A G-type main-sequence star at the center."],
    ["Chapter 4: Jupiter’s Moons", "Io, Europa, Ganymede, and Callisto."],
    ["Chapter 5: Planets", "Terrestrial vs. Jovian planets."],
    ["Chapter 6: Is Pluto a Planet?", "Dwarf planets and the 2006 reclassification."],
    ["Chapter 7: Formation", "How the solar system formed, and the patterns in it."],
  ];
  const AI_TOPICS = [4, 5];
  const AI_GOALS = [
    "Use flashcards to review key characteristics of dwarf planets",
    "Complete a quiz on Chapter 6: Is Pluto a Planet with at least 80% accuracy",
    "Explain in your own words why Pluto was reclassified in 2006",
    "Sort the eight planets into terrestrial and Jovian",
  ];
  const SUGGESTED = ["Review Chapter 5 using flashcards at 80% accuracy", "Review Chapter 6 using flashcards at 80% accuracy"];
  const OPTIONS = ["Memorize Planets", "Remember Planet Order", "Calculate Planet Sizes", "Pluto conspiracy", "Gas Planets"];
  // Survey (Figma copy; fixed the duplicate "Visual diagrams" chip and made "Other" work)
  const Q1 = ["Visual diagrams", "Step-by-step", "Big-picture", "Detailed", "Concept maps", "Real-world examples", "Bullet points", "Concise", "Simpler explanations", "Short summary", "Audio walkthroughs"];
  const Q2 = [
    ["focus", "Focus struggles", "target"], ["memory", "Memory difficulty", "cloud"], ["time", "Time management", "alarm"], ["simplify", "Prefers simplifying", "layers"],
    ["distract", "Distraction sensitivity", "belloff"], ["org", "Organization trouble", "folder"], ["test", "Test anxiety", "filewarn"], ["audio", "Auditory support", "audio"],
    ["reading", "Reading difficulty", "book"], ["goals", "Difficulty goal setting", "flag"], ["burnout", "Overwhelm / burnout", "battery"], ["other", "Other", "plus"],
  ];
  const Q3 = [["quick", "Quick memorization", "Flashcards and rapid recall", "sparkle"], ["long", "Long term memorization", "Spaced review over weeks", "brain"], ["apply", "Concept application practice", "Practice problems and explaining", "msgs"]];
  const ADAPT = {
    focus: "Shorter sessions with built-in breaks", memory: "Spaced review of what you’ve studied", time: "Time estimates on every goal", simplify: "Plain-language explanations first",
    distract: "Focus mode on by default", org: "Auto-organized outlines of your notes", test: "Low-stakes practice before quizzes", audio: "Audio summaries of each chapter",
    reading: "Shorter passages, read-aloud available", goals: "AI-suggested goals to start from", burnout: "Smaller daily plans", other: "Your notes are used to tailor suggestions",
  };
  const NOTE =
    "<p>The main points of this lecture cover the basic structure and components of our solar system, including the Sun, planets, asteroids, comets, and moons. It would also discuss the solar system's formation and some of the patterns observed within it. </p><p>&#8203;</p>" +
    "<p><b>I. Overview of the Solar System:</b></p><ul><li>Definition:</li>" +
    "<li>The solar system is a gravitationally bound system consisting of the Sun and all the objects that orbit it, <a>according to Wikipedia</a>. </li>" +
    "<li><b>Central Star:</b></li><li>The Sun is the central star, a G-type main-sequence star, and its gravity holds the solar system together, <a>according to NASA Science (.gov)</a>. </li>" +
    "<li><b>Planets:</b></li><li>The eight planets orbit the Sun in a roughly flat disk called the ecliptic plane, according to NASA Science (.gov). </li>" +
    "<li><b>Terrestrial vs. Jovian Planets:</b></li><li>The inner four planets (Mercury, Venus, Earth, Mars) are terrestrial, rocky and relatively small, while the outer four (Jupiter, Saturn, Uranus, Neptune) are Jovian, gas giants. </li></ul>";

  /* ---------- state ---------- */
  const S = {
    screen: "home", path: "typed", topics: new Set(AI_TOPICS),
    mode: "list", typed: "", enhancing: false,
    goals: AI_GOALS.map((t, i) => ({ id: "g" + i, t, done: false })),
    menu: null, editing: null,
    mgoals: SUGGESTED.map((t, i) => ({ id: "s" + i, t, on: true })), draft: "", draftCh: new Set([5]), draftOpt: null,
    mins: 30, left: 30 * 60, total: 30 * 60, running: false, page: 0, sessMode: "ai",
    overlay: null, studied: 0, congrats: false,
    onboarded: false,
    ob: { step: 0, q1: new Set(), q2: new Set(), q3: new Set(), other1: "", other2: "", otherOpen1: false, otherOpen2: false, after: "hello", load: 0 },
    showStruggles: true, feedback: null, sessions: 6, minutesTotal: 1202, concepts: 42,
  };
  const goalList = () => (S.path === "manual" ? S.mgoals.filter((g) => g.on) : S.goals);
  let flash = null; // id of the element that should play its "pop" once

  /* ---------- timer ---------- */
  let tick = null;
  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  function start() {
    S.running = true; if (tick) return;
    tick = setInterval(() => {
      if (!S.running) return;
      if (S.left > 0) { S.left--; S.studied++; paint(); }
      if (S.left === 0) { stop(); finishSession(); }
    }, 1000);
  }
  function stop() { clearInterval(tick); tick = null; S.running = false; }
  function paint() {
    document.querySelectorAll("[data-time]").forEach((e) => (e.textContent = fmt(S.left)));
    const d = (1 - S.left / S.total) * 360;
    document.querySelectorAll("[data-ring]").forEach((e) => (e.style.background = "conic-gradient(var(--accent) " + d + "deg,#f1f2f5 " + d + "deg)"));
  }
  function finishSession() { S.overlay = null; S.congrats = true; S.page = 0; S.sessions++; S.minutesTotal += Math.round(S.studied / 60); S.concepts += goalList().filter((g) => g.done).length; render(); }

  /* ---------- chrome ---------- */
  const tbi = (n) => '<span class="tb tb-' + n + '"><img src="' + F + "tb-" + n + '@2x.png" alt="" /></span>';
  function chrome(showRight) {
    return '<img class="sb-left" src="' + F + 'status-left.svg" alt="" /><img class="sb-mid" src="' + F + 'status-mid.svg" alt="" /><img class="sb-right" src="' + F + 'status-right.svg" alt="" />' +
      '<div class="note">' + NOTE + "</div>" + tbi("back") + tbi("tools") +
      (showRight ? tbi("timer") + tbi("page") + '<button class="hit hit-timer" data-act="toTimer" aria-label="Timer"></button><button class="hit hit-learn" data-act="home" aria-label="Notability Learn"></button>' : "");
  }
  const head = (title) => '<div class="ss-head"><button class="ss-back" data-act="back" aria-label="Back">' + img("panel-back.svg") + '</button><div class="ss-title">' + (title || "Study Session") + "</div></div>";
  const next = (label, act, dis) => '<div class="ss-foot"><button class="ss-next" data-act="' + act + '"' + (dis ? " disabled" : "") + ">" + label + img("chev-right-reg.svg") + "</button></div>";
  const dots = (n) => '<div class="ss-foot"><div class="dots">' + [0, 1, 2].map((i) => '<i class="' + (i === n ? "on" : "") + '"></i>').join("") + "</div></div>";
  const emptyFoot = '<div class="ss-foot"></div>';
  const panel = (inner, cls) => '<aside class="ss' + (cls ? " " + cls : "") + '"><div class="handle"></div>' + inner + "</aside>";
  const toggle = (on, act) => '<div class="toggle" role="tablist" aria-label="Goal view"><button class="' + (on === "list" ? "on" : "") + '" data-act="' + act + '" data-v="list" aria-label="My list">' + img(on === "list" ? "toggle-list-on.svg" : "toggle-list.svg") + '</button><button class="' + (on === "ai" ? "on" : "") + '" data-act="' + act + '" data-v="ai" aria-label="AI suggestions">' + img(on === "ai" ? "sparkle-sm.svg" : "sparkle-gray.svg") + "</button></div>";
  const ai = '<div class="ai-label">' + img("sparkle.svg") + "AI Suggestion</div>";

  /* ---------- 384px Study Session panel ---------- */
  const V = {
    hello: () => panel('<div class="band hi"></div>' + head() +
      '<div class="stack" style="left:35.21px;top:319.67px;width:323.6px;gap:52px"><div class="stack" style="position:relative;gap:40px;width:100%"><p class="disp">Hello Alison!</p>' +
      '<div class="stack" style="position:relative;gap:52px;width:100%">' + img("mascot-think.svg") + '<p class="h26">Let’s goal set for today.</p></div></div>' +
      '<button class="btn btn-lg" data-act="toContent">Start Session</button></div>' + emptyFoot),

    content: () => panel('<div class="band lo"></div>' + head() +
      '<div class="stack" style="left:30px;top:247px;width:323.6px;gap:50px"><p class="h32">What content would you like to review?</p>' +
      '<div style="display:flex;flex-direction:column;gap:30px;width:323.6px"><div style="display:flex;flex-direction:column;gap:11px">' + ai +
      '<p style="font:400 17px/17px var(--ui);color:var(--fg2)">Based off your previous sessions, you may want to revisit these topics:</p></div>' +
      AI_TOPICS.map((i) => '<button class="chipbtn' + (S.topics.has(i) ? "" : " off") + '" data-act="topic" data-i="' + i + '">' + CHAPTERS[i][0] + "</button>").join("") +
      '<button class="plusrow" data-act="toOutline"><span class="pl">+</span><span>Review a Different Topic</span></button></div>' +
      '<button class="btn btn-md" data-act="toAwesome"' + (S.topics.size ? "" : ' disabled style="opacity:.35"') + ">Continue</button></div>" + emptyFoot),

    outline: () => panel(head() +
      '<div class="stack" style="left:9px;top:208.29px;width:366px;gap:40px;align-items:flex-start"><div style="display:flex;flex-direction:column;gap:10px;align-items:flex-start"><span class="otag">OUTLINE</span><p class="h32" style="text-align:left">Our Solar System</p></div>' +
      '<div class="chapters" style="height:604px;overflow:auto;display:flex;flex-direction:column;gap:20px;padding:1px 13px">' +
      CHAPTERS.map(([t, d], i) => { const on = S.topics.has(i); return '<div class="ch' + (on ? " on" : "") + '"><div class="tw"><p class="t">' + t + '</p><p class="d">' + d + '</p></div><button class="add' + (flash === "ch" + i ? " pop" : "") + '" data-act="topic" data-i="' + i + '" aria-label="' + (on ? "Remove" : "Add") + '">' + (on ? img("done.svg") : "+") + "</button></div>"; }).join("") +
      "</div></div>" + next("Next", "toAwesome", !S.topics.size)),

    awesome: () => {
      const names = [...S.topics].sort().map((i) => CHAPTERS[i][0].split(":")[0]);
      const list = names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names.slice(-1) : names[0] || "your notes";
      return panel('<div class="band hi"></div>' + head() +
        '<div class="stack" style="left:30px;top:250px;width:323.6px;gap:40px"><p class="disp">Awesome!</p>' + img("mascot-cheer.svg") +
        '<p class="h22">You’ll be focusing on ' + list + ".</p>" +
        '<button class="btn btn-md" data-act="toGoals">Continue</button></div>' + emptyFoot);
    },

    goals: () => {
      const list = S.mode === "list";
      let body;
      if (S.enhancing) body = '<div style="display:flex;flex-direction:column;gap:24px;width:100%">' + ai + '<div class="skel"><i style="width:75%"></i><i style="width:60%"></i><i style="width:68%"></i></div></div>';
      else if (list) body = '<div style="display:flex;flex-direction:column;gap:24px;align-items:flex-end;width:100%">' + toggle("list", "mode") +
        '<textarea id="typed" style="width:100%;height:470px;font:400 20px/25px var(--ui);color:#000" placeholder="Write goals here...">' + esc(S.typed) + "</textarea></div>";
      else body = '<div class="cards" style="display:flex;flex-direction:column;gap:25px;width:100%"><div style="display:flex;justify-content:space-between;align-items:center">' + ai + toggle("ai", "mode") + "</div>" +
        S.goals.map((g) => '<div class="gcard"><span class="cb">' + img("checkbox.svg") + '</span><div class="tx"' + (S.editing === g.id ? ' contenteditable="true" data-edit="' + g.id + '"' : "") + ">" + esc(g.t) + '</div><button class="more" data-act="menu" data-id="' + g.id + '" aria-label="More">...</button>' +
          (S.menu === g.id ? '<div class="menu"><button data-act="edit" data-id="' + g.id + '">Edit</button><button data-act="swap" data-id="' + g.id + '">Suggest another</button><button class="del" data-act="del" data-id="' + g.id + '">Delete</button></div>' : "") + "</div>").join("") + "</div>";
      const enhance = list && !S.enhancing ? '<button class="btn btn-lg" data-act="enhance" style="position:absolute;left:43.82px;top:839.49px;width:303px;font-size:15px;line-height:20px' + (S.typed.trim() ? "" : ";opacity:.35;pointer-events:none") + '">' + img("sparkle.svg", "wh") + "Enhance To-Do List</button>" : "";
      return panel(head() + '<div class="stack" style="left:29.2px;top:187.54px;width:323.6px;gap:' + (list ? 40 : 25) + 'px;max-height:740px;overflow:auto"><p class="h32">Goals for Today’s Study Session</p>' + body + "</div>" + enhance +
        next("Next", "toCount", S.enhancing || (list ? !S.typed.trim() : !S.goals.length)));
    },

    mgoals: () => panel(head() + '<div class="band lo"></div>' +
      '<div class="stack" style="left:30px;top:270px;width:323.6px;gap:40px"><p class="h32">What are your goals for this session?</p><div style="display:flex;flex-direction:column;gap:20px;width:100%"><div style="display:flex;flex-direction:column;gap:11px">' + ai +
      '<p style="font:400 17px/17px var(--ui);color:var(--fg2)">Based off your previous sessions, you may want to work on these tasks:</p></div>' +
      S.mgoals.map((g) => '<button class="chipbtn' + (g.on ? "" : " off") + '" data-act="mtoggle" data-id="' + g.id + '">' + esc(g.t) + "</button>").join("") +
      '<button class="plusrow" data-act="toCreate"><span class="pl">+</span><span>Create a Goal</span></button></div>' +
      '<button class="btn btn-md" data-act="toCount"' + (S.mgoals.some((g) => g.on) ? "" : ' disabled style="opacity:.35"') + ">Continue</button></div>" + emptyFoot),

    create: () => panel(head() +
      '<div class="stack" style="left:39.5px;top:194.94px;width:303px;gap:35px;align-items:stretch"><div style="display:flex;flex-direction:column;gap:22px"><p class="h32">Create a Goal</p>' +
      '<input class="goalin" id="draft" placeholder="What’s your Goal?" value="' + esc(S.draft) + '" />' +
      '<div class="pills">' + [4, 5].map((i) => '<button class="pill' + (S.draftCh.has(i) ? " on" : "") + '" data-act="dch" data-i="' + i + '">' + CHAPTERS[i][0].split(":")[0] + "</button>").join("") + "</div>" +
      '<div style="display:flex;flex-direction:column;gap:12px">' + ai + '<div style="display:flex;flex-direction:column;gap:8px">' +
      OPTIONS.map((o, i) => '<button class="opt' + (S.draftOpt === i ? " on" : "") + '" data-act="dopt" data-i="' + i + '">' + o + "</button>").join("") + "</div></div></div>" +
      '<button class="btn btn-line" data-act="createGoal"' + (S.draft.trim() || S.draftOpt != null ? "" : ' style="opacity:.35;pointer-events:none"') + ">Create Goals</button></div>", "tint"),

    count: () => { const n = goalList().length; return panel(head() +
      '<div class="stack" style="left:0;right:0;top:300px;gap:60px"><div class="circ"><p class="h22">You’ve set</p><b data-count="' + n + '">' + n + '</b><p class="h22">goal' + (n === 1 ? "" : "s") + "!</p></div>" +
      '<button class="btn btn-md" data-act="toAmazing">Continue</button></div>' + dots(0)); },

    amazing: () => panel('<div class="band hi"></div>' + head() +
      '<div class="stack" style="left:30px;top:270px;width:323.6px;gap:40px"><p class="disp">Amazing!</p>' + img("mascot-cheer.svg") +
      '<p class="h22">Now, let’s set a goal for how long you’d like to work.</p><button class="btn btn-md" data-act="toTimer">Continue</button></div>' + dots(0)),

    timer: () => panel('<div class="band lo"></div>' + head() +
      '<div class="stack" style="left:0;right:0;top:300px;gap:40px"><p class="h32" style="width:260px">Today, I want to work for...</p><p class="big-time" style="font-size:80px">' + fmt(S.mins * 60) + "</p>" +
      '<button class="btn btn-md" data-act="toAdjust">Edit Time</button></div>' + next("Skip", "toLast")),

    adjust: () => panel('<div class="band lo"></div>' + head() +
      '<div class="stack" style="left:-2px;top:367px;width:385.5px;gap:100px"><div class="stack" style="position:relative;gap:50px;width:100%"><p class="big-time" id="adjTime">' + fmt(S.mins * 60) + "</p>" +
      '<div class="stack" style="position:relative;gap:20px;width:100%"><div class="ruler" id="ruler"><div class="track" id="track"></div><div class="mid"></div></div>' + img("pointer.svg") + "</div></div>" +
      '<button class="btn btn-md" data-act="toLast">Continue</button></div>' + emptyFoot),

    last: () => panel(head() +
      '<div class="stack" style="left:0;right:0;top:300px;gap:60px"><div class="circ"><p class="h22">Your Session<br>will last</p><b data-count="' + S.mins + '">' + S.mins + '</b><p class="h22">minutes.</p></div>' +
      '<button class="btn btn-md" data-act="toGreat">Continue</button></div>' + emptyFoot),

    great: () => panel('<div class="band hi"></div>' + head() +
      '<div class="stack" style="left:35.21px;top:300px;width:323.6px;gap:52px"><div class="stack" style="position:relative;gap:40px;width:100%"><p class="disp">Great Goals!</p>' +
      '<div class="stack" style="position:relative;gap:52px;width:100%">' + img("mascot-think.svg") + '<p class="h22">Are you ready for a productive work session?</p></div></div>' +
      '<button class="btn btn-lg" data-act="startSession">Start Session</button></div>' + dots(0)),
  };

  /* ---------- 520px Learn panel ---------- */
  function learn() {
    const inSession = S.screen === "session";
    const welcome = '<div class="card' + (inSession ? "" : " tight") + '"><div class="welcome">Welcome back, Alison.' + (inSession ? "" : '<button data-act="profile" aria-label="Open Learning Profile" title="Learning Profile">' + img("ic-user.svg") + "</button>") + "</div>" +
      '<button class="row-cta" data-act="startFlow">' + img(inSession ? "ic-recents.svg" : "ic-bookmarked.svg") + "<span>Start a <b>Study Session</b></span></button>" +
      (inSession ? '<button class="row-cta" data-act="toTimer">' + img("ic-recents.svg") + "<span>Start a <b>Timer</b></span></button>" : "") + "</div>";
    if (!inSession) {
      return '<aside class="lp"><div class="handle"></div><div class="lp-col" style="left:19px">' + welcome +
        '<div class="qcard"><div class="qhead"><span class="otag">SUMMARY</span></div><div class="qbody"><button class="seeall">See all</button><div class="sum"><h4>Our Solar System:</h4><ul><li>A gravitationally bound system: the Sun and everything that orbits it</li><li>The eight planets orbit in a roughly flat disk, the ecliptic plane</li><li>Inner four are terrestrial; outer four are Jovian gas giants</li></ul><h4>Pluto:</h4><ul><li>Reclassified as a dwarf planet in 2006...</li></ul></div></div></div>' +
        '<div class="qcard"><div class="qhead"><span class="otag">STUDY OPTIONS</span></div><div class="qbody"><div class="grid">' +
        [["ic-audio.svg", "Audio"], ["ic-mixmatch.svg", "Mix and Match"], ["ic-bookcheck.svg", "Quiz"], ["ic-play.svg", "Video"], ["ic-copy.svg", "Flashcards"], ["ic-mindmap.svg", "Mind Map"]]
          .map(([i, l]) => '<button class="so">' + img(i) + l + "</button>").join("") + "</div></div></div>" +
        '<button class="chatbtn" aria-label="Chat">' + img("ic-chatdot.svg") + "</button></div></aside>";
    }
    let card;
    const G = goalList(), d = (1 - S.left / S.total) * 360;
    if (S.congrats) {
      card = '<div class="card sess"><div class="top"><div class="lbl"><span class="otag">STUDY SESSION</span><div class="ttl">Pomodoro Timer</div></div></div><div class="body"><div class="congrats"><p class="disp">Congratulations,<br>Alison!</p>' + img("mascot-think.svg") + "<p>You’ve completed a<br>Study Session.</p></div>" +
        '<button class="btn btn-md" data-act="progress">View Progress</button></div>' + pager() + "</div>";
    } else if (S.page === 0) {
      card = '<div class="card sess"><div class="top"><div class="lbl"><span class="otag">STUDY SESSION</span><div class="ttl">Pomodoro Timer</div></div></div><div class="body"><div class="ring" data-ring style="background:conic-gradient(var(--accent) ' + d + "deg,#f1f2f5 " + d + 'deg)"><b data-time>' + fmt(S.left) + "</b></div>" +
        '<button class="btn btn-md" data-act="endSession">End Session</button></div>' + pager() + "</div>";
    } else {
      const aiView = S.sessMode === "ai";
      card = '<div class="card sess" style="gap:16px"><div class="top"><div class="lbl"><span class="otag">STUDY SESSION</span><div class="ttl">Today’s Goals</div></div>' + toggle(S.sessMode, "smode") + "</div>" +
        '<div style="display:flex;flex-direction:column;gap:16px;width:408px">' +
        (aiView || S.path === "manual" || !S.typed.trim()
          ? G.map((g) => '<button class="goal-row' + (g.done ? " done" : "") + (flash === g.id ? " flash" : "") + '" data-act="sgoal" data-id="' + g.id + '"><div class="r"><span class="cbx' + (g.done ? " on" : "") + (flash === g.id ? " pop" : "") + '">' + img("checkbox-sm.svg") + "</span><span>" + esc(g.t) + "</span></div>" +
              (aiView && g.done ? '<div class="gnote">' + img("sparkle.svg") + "Based off your session, you have achieved this goal.</div>" : "") + "</button>").join("")
          : '<div class="plain">' + esc(S.typed).split("\n").filter(Boolean).map((l) => "• " + l).join("<br>") + "</div>") +
        "</div>" + pager() + "</div>";
    }
    return '<aside class="lp"><div class="handle"></div><div class="lp-col">' + welcome + card + "</div></aside>";
  }
  const pager = () => '<div class="pager"><button class="' + (S.page === 0 ? "on" : "") + '" data-act="page" data-v="0" aria-label="Timer"></button><button class="' + (S.page === 1 ? "on" : "") + '" data-act="page" data-v="1" aria-label="Goals"></button></div>';
  const tailorPanel = () => '<aside class="tp"><div class="h">' + sv(IC.back) + "Tailoring Preferences " + sv(IC.chevd) + '</div><div class="sk"><i style="width:100%"></i><i style="width:80%"></i><i style="width:90%"></i></div></aside>';

  /* ---------- onboarding survey (improved) ---------- */
  function survey() {
    const o = S.ob, st = o.step;
    const prog = (n) => '<div class="prog">' + [1, 2, 3].map((i) => '<i class="' + (i === n && o.fillNew ? "new" : "") + '">' + (i <= n ? "<b></b>" : "") + "</i>").join("") + '</div><div class="stepn">' + n + " of 3</div>";
    const foot = (nextLbl, dis, back) => '<div class="obf">' + (back ? '<button class="btn-out" data-act="obBack">Back</button>' : "") + '<button class="btn btn-md" data-act="obNext"' + (dis ? " disabled" : "") + ">" + nextLbl + "</button></div>";
    let inner;
    if (st === 0) {
      inner = '<div class="ob-band"></div><div class="ob-center" style="top:96px"><p class="disp">Let’s tailor your learning</p><p>Your answers shape how Learn explains, practices, and personalizes everything for you.</p>' + img("mascot-think.svg") + '<p class="ob-meta">3 quick questions · about a minute · change anytime</p></div>' +
        '<div class="obf"><button class="lk" data-act="obSkip">Skip for now</button><button class="btn btn-md" data-act="obNext">Next</button></div>';
    } else if (st === 1) {
      const n = o.q1.size;
      inner = '<div class="pad' + (o.stepIn ? " step-in" : "") + '">' + prog(1) + '<p class="qt">How should Learn present new material to you?</p>' +
        '<div class="hintrow"><span class="hintpill' + (o.shake ? " shake" : "") + '">Select up to 3</span><span class="cnt">' + n + " of 3 selected</span></div>" +
        '<div class="grp">' + Q1.map((q) => { const on = o.q1.has(q); return '<button class="ochip' + (on ? " on" : "") + '" data-act="q1" data-v="' + esc(q) + '" aria-pressed="' + on + '">' + q + (on ? '<span class="ck' + (flash === "q1" + q ? " pop" : "") + '"></span>' : "") + "</button>"; }).join("") +
        '<button class="ochip other' + (o.q1.has("__other") ? " on" : "") + '" data-act="q1other">' + (o.q1.has("__other") && o.other1 ? esc(o.other1) : "Other") + (o.q1.has("__other") ? '<span class="ck"></span>' : "") + "</button>" +
        (o.otherOpen1 ? '<div class="othin"><input id="other1" placeholder="Describe how you like to learn" value="' + esc(o.other1) + '" /><button class="btn btn-md" data-act="q1otherSave" style="height:44px;border-radius:6px">Add</button></div>' : "") +
        "</div></div>" + foot("Next", false, true);
    } else if (st === 2) {
      inner = '<div class="pad' + (o.stepIn ? " step-in" : "") + '">' + prog(2) + '<p class="qt">Do you have any current learning struggles?</p>' +
        '<div class="hintrow"><span class="hintpill">Select all that apply</span><span class="cnt">Optional</span></div>' +
        '<div class="tiles">' + Q2.map(([k, l, ic]) => { const on = o.q2.has(k); return '<button class="tile' + (on ? " on" : "") + '" data-act="q2" data-v="' + k + '" aria-pressed="' + on + '">' + sv(IC[ic]) + "<span>" + (k === "other" && o.other2 ? esc(o.other2) : l) + "</span>" + (on ? '<span class="ck' + (flash === "q2" + k ? " pop" : "") + '"></span>' : "") + "</button>"; }).join("") + "</div>" +
        (o.otherOpen2 ? '<div class="othin" style="margin-top:10px"><input id="other2" placeholder="Tell Learn what makes studying hard" value="' + esc(o.other2) + '" /><button class="btn btn-md" data-act="q2otherSave" style="height:44px;border-radius:6px">Add</button></div>'
          : '<div class="priv">' + sv(IC.lock) + "Private to you. Only used to tailor Learn, and you can hide it from your profile.</div>") +
        "</div>" + foot("Next", false, true);
    } else if (st === 3) {
      inner = '<div class="pad' + (o.stepIn ? " step-in" : "") + '">' + prog(3) + '<p class="qt" style="margin-top:36px">How are you planning on using Learn?</p>' +
        '<div class="ucards">' + Q3.map(([k, l, d, ic]) => { const on = o.q3.has(k); return '<button class="ucard' + (on ? " on" : "") + '" data-act="q3" data-v="' + k + '" aria-pressed="' + on + '">' + sv(IC[ic], 1.6) + "<b>" + l + "</b><small>" + d + "</small>" + (on ? '<span class="ck' + (flash === "q3" + k ? " pop" : "") + '"></span>' : "") + "</button>"; }).join("") + "</div>" +
        "</div>" + foot("Done", !o.q3.size, true);
    } else if (st === 4) {
      const steps = ["Reading your preferences", "Matching study tools to you", "Building your study plan"];
      inner = '<div class="load"><div class="spin"></div><h4>Preparing your study plan...</h4><div class="lsteps">' + steps.map((t, i) => '<div class="' + (i < o.load ? "ok" : "") + '"><i></i>' + t + "</div>").join("") + "</div></div>";
    } else {
      const ad = adaptations().slice(0, 4);
      inner = '<div class="ob-band" style="bottom:330px"></div>' + img("confetti.svg", "ob-conf r") + img("confetti.svg", "ob-conf l") +
        '<div class="ob-center" style="top:52px;gap:10px"><p class="disp">Let’s get studying</p>' + img("mascot-cheer.svg") + '<p style="font-size:18px;line-height:23px">We’ll keep your learning preferences in mind while you study. Here’s what changes:</p>' +
        '<div class="adapts">' + ad.map((t) => "<div>" + sv(IC.check, 2.6) + t + "</div>").join("") + "</div></div>" +
        '<div class="obf"><button class="btn-out" data-act="obProfile">View my profile</button><button class="btn btn-md" data-act="obFinish">Start studying</button></div>';
    }
    return '<div class="scrim' + (ovIn ? " in" : "") + '"></div><div class="obm' + (ovIn ? " in" : "") + '" role="dialog" aria-label="Tailor your learning">' + inner + "</div>";
  }
  function adaptations() {
    const o = S.ob, out = [];
    const q1 = [...o.q1].filter((x) => x !== "__other").map((x) => x.toLowerCase());
    if (q1.length) out.push("Explanations lead with " + q1.slice(0, 2).join(" and "));
    [...o.q2].forEach((k) => out.push(ADAPT[k]));
    if (o.q3.has("quick")) out.push("Flashcards and rapid-recall quizzes first");
    if (o.q3.has("long")) out.push("Spaced review scheduled across the week");
    if (o.q3.has("apply")) out.push("Practice problems that apply each concept");
    if (!out.length) out.push("Suggestions based on your notes and quiz scores");
    return out;
  }
  function applyPrefs() {
    const q2 = S.ob.q2;
    if (q2.has("goals")) S.mode = "ai";
    if (q2.has("burnout")) S.mins = 20; else if (q2.has("focus")) S.mins = 25;
    S.left = S.total = S.mins * 60;
  }

  const andList = (a) => (a.length > 1 ? a.slice(0, -1).join(", ") + " and " + a[a.length - 1] : a[0] || "");
  /* ---------- Learning Profile (improved) ---------- */
  function profile() {
    const o = S.ob, q1 = [...o.q1].filter((x) => x !== "__other");
    const learner = q1.some((x) => /Visual|Concept maps/.test(x)) ? ["Visual Learner", IC.eye] : q1.includes("Audio walkthroughs") ? ["Auditory Learner", IC.ear] : q1.some((x) => /Step|Detailed|Bullet/.test(x)) ? ["Step-by-step Learner", IC.list] : ["Reading Learner", IC.book];
    const goal = o.q3.has("quick") ? ["Quick Memorization", IC.target] : o.q3.has("long") ? ["Long-term Memory", IC.brain] : o.q3.has("apply") ? ["Concept Practice", IC.msgs] : null;
    const struggles = [...o.q2].filter((k) => k !== "other").map((k) => Q2.find((x) => x[0] === k)[1].toLowerCase());
    let ov = "You learn best through " + (q1.length ? andList(q1.slice(0, 3).map((x) => x.toLowerCase())) : "your own notes and highlights") + ". ";
    if (S.showStruggles && struggles.length) ov += "You mentioned " + andList(struggles.slice(0, 3)) + ", so Learn uses " + [...o.q2].slice(0, 2).map((k) => ADAPT[k].toLowerCase()).join(" and ") + ". ";
    if (goal) ov += "Since your goal is " + goal[0].toLowerCase() + ", Learn will emphasize " + (o.q3.has("quick") ? "concise explanations, visuals, and rapid-recall tools" : o.q3.has("long") ? "spaced review and cumulative quizzes" : "worked examples and practice problems") + ".";
    const ad = adaptations();
    return '<div class="scrim' + (ovIn ? " in" : "") + '" data-act="closeProfile"></div><div class="prof' + (ovIn ? " in" : "") + '" role="dialog" aria-label="Learning Profile"><button class="x" data-act="closeProfile" aria-label="Close">' + sv(IC.x, 2.4) + '</button><div class="body">' +
      '<div class="ph"><div class="avatar">' + sv(IC.user, 0) + '<span class="ed">' + sv(IC.pencil, 2.4) + '</span></div><div><h2>Alison’s Learning Profile</h2><p class="since">Started Learn September 2025</p></div></div>' +
      '<div class="pchips"><span class="pchip v">' + sv(learner[1]) + learner[0] + '</span><span class="pchip l">' + sv(IC.globe) + "English</span>" + (goal ? '<span class="pchip g">' + sv(goal[1]) + goal[0] + "</span>" : "") +
      (o.q2.has("audio") ? '<span class="pchip s">' + sv(IC.audio) + "Audio support</span>" : "") + '<button class="hist" data-act="retake" aria-label="Retake survey" title="Retake survey">' + sv(IC.history) + "</button></div>" +
      '<h3>AI Overview <small>Based on your survey + ' + S.sessions + ' sessions</small></h3><div class="aio">' + ov +
      '<div class="meta"><span>AI Overview may contain information that is inaccurate</span><span class="fb"><button class="' + (S.feedback === "y" ? "on" : "") + '" data-act="fb" data-v="y">Sounds like me</button><button class="' + (S.feedback === "n" ? "on" : "") + '" data-act="fb" data-v="n">Not quite</button></span></div></div>' +
      (S.feedback === "n" ? '<div class="privrow"><span>Want to change it?<small>Retake the 3 questions. Your stats stay the same.</small></span><button class="btn btn-md" data-act="retake" style="height:38px;border-radius:6px;font-size:15px">Update answers</button></div>' : "") +
      '<div class="privrow"><span>Use learning struggles in my overview<small>Private to you. Turning this off hides them here; Learn still adapts quietly.</small></span><button class="sw' + (S.showStruggles ? " on" : "") + '" data-act="privacy" role="switch" aria-checked="' + S.showStruggles + '" aria-label="Use learning struggles in my overview"></button></div>' +
      '<h3>How Learn adapts to you</h3><div class="adapt">' + ad.map((t) => "<span>" + sv(IC.check, 2.6) + t + "</span>").join("") + "</div>" +
      "<h3>Statistics</h3>" +
      '<div class="pstats"><div class="pstat">' + STAT.bulb + "<div><b>" + S.concepts + "</b><span>Concepts reviewed</span></div></div><div class=\"pstat\">" + STAT.watch + "<div><b>" + S.minutesTotal + "</b><span>Minutes total</span></div></div>" +
      '<div class="pstat">' + STAT.note + '<div><b>18</b><span>Notes created</span></div></div><div class="pstat">' + STAT.bars + "<div><b>" + S.sessions + "</b><span>Sessions finished</span></div></div></div>" +
      '<h3>Evidence of progress <small>No streaks, just what improved</small></h3><div class="evi">' +
      [["Chapter 6: Is Pluto a Planet? quiz", 64, 85], ["Chapter 5 flashcards", 52, 80], ["Dwarf planet definitions", 40, 72]].map(([l, a, b]) => '<div class="ev"><span>' + l + '</span><div class="bar"><i class="b" style="width:' + b + '%"></i><i class="a" style="width:' + a + '%"></i></div><em>' + a + "% → " + b + "%</em></div>").join("") +
      "</div></div></div>";
  }

  /* ---------- end / progress overlays ---------- */
  function overlay() {
    if (S.overlay === "survey") return survey();
    if (S.overlay === "profile") return profile();
    if (S.overlay === "end") return '<div class="scrim' + (ovIn ? " in" : "") + '" data-act="cancelEnd"></div><div class="confirm' + (ovIn ? " in" : "") + '" style="left:968.96px;top:640px"><h5>End session early?</h5><div class="row"><button class="btn btn-md" data-act="confirmEnd" style="height:40px">Confirm</button><button class="btn btn-dark" data-act="cancelEnd" style="height:40px;padding:0 20px">Cancel</button></div></div>';
    if (S.overlay === "progress") {
      const G = goalList(), n = G.filter((g) => g.done).length, m = Math.floor(S.studied / 60), s = S.studied % 60;
      return '<div class="scrim' + (ovIn ? " in" : "") + '" data-act="closeProgress"></div><div class="modal' + (ovIn ? " in" : "") + '" role="dialog" aria-label="Session progress"><div class="mband"></div>' + img("confetti.svg", "conf r") + img("confetti.svg", "conf l") +
        '<button class="close" data-act="closeProgress" aria-label="Close">×</button>' +
        '<div class="hero">' + img("mascot-cheer-sm.svg") + '<div><p class="t">Awesome Work!</p><p class="s">You’re a superstar.</p></div></div>' +
        '<div class="badges"><div class="badge" style="background:#4178ff"><div class="k">TIME STUDIED</div><div class="v">' + img("ic-clock.svg") + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0") + "</div></div>" +
        '<div class="badge" style="background:var(--berry)"><div class="k">TOPICS READ</div><div class="v">' + img("ic-book.svg") + S.topics.size + " Chapter" + (S.topics.size === 1 ? "" : "s") + "</div></div>" +
        '<div class="badge" style="background:var(--mango)"><div class="k">GOALS COMPLETED</div><div class="v">' + img("ic-checkcircle.svg") + n + " Goal" + (n === 1 ? "" : "s") + "</div></div></div></div>";
    }
    return "";
  }

  /* ---------- render (motion plays only on change) ---------- */
  const SHOW_RIGHT = { home: 1, session: 1, content: 1, outline: 1 };
  const SIDE = (s) => (s === "home" || s === "session" ? "lp" : "ss");
  let last = { screen: null, overlay: null, step: null }, ovIn = false;
  function render() {
    const sc = S.screen, entered = sc !== last.screen, sideChange = last.screen && SIDE(sc) !== SIDE(last.screen);
    ovIn = !!S.overlay && S.overlay !== last.overlay;
    if (S.overlay === "survey") { S.ob.stepIn = !ovIn && S.ob.step !== last.step; S.ob.fillNew = S.ob.step !== last.step; }
    const p = S.overlay === "survey" && sc === "home" ? tailorPanel() : sc === "home" || sc === "session" ? learn() : V[sc]();
    $("screen").innerHTML = chrome(!!SHOW_RIGHT[sc] && S.overlay !== "survey") + p + overlay() +
      (sc === "home" && !S.overlay ? '<div class="tip" style="left:906px;top:222px">Tap to start ↓</div>' : "");
    const pn = document.querySelector(".ss,.lp");
    if (pn && entered) { pn.classList.add("enter"); if (sideChange) pn.classList.add("side"); }
    if (sc === "adjust") buildRuler();
    if (entered && (sc === "count" || sc === "last")) countUp();
    const e = document.querySelector("[data-edit]"); if (e) { e.focus(); const r = document.createRange(); r.selectNodeContents(e); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    last = { screen: sc, overlay: S.overlay, step: S.overlay === "survey" ? S.ob.step : null };
    flash = null; S.ob.shake = false;
  }
  function countUp() {
    const b = document.querySelector("[data-count]"); if (!b || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const n = +b.dataset.count, t0 = performance.now(), D = 650;
    const f = (t) => { const k = Math.min(1, (t - t0) / D); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }

  /* ---------- ruler ---------- */
  function buildRuler() {
    const tr = $("track"), ru = $("ruler"); if (!tr) return;
    let h = ""; for (let m = 0; m <= 120; m++) h += '<i class="' + (m % 5 === 0 ? "M" : "") + '"></i>';
    tr.innerHTML = h;
    const pos = (m) => { let x = 0; for (let k = 0; k < m; k++) x += (k % 5 === 0 ? 10 : 7) + 5; return x + (m % 5 === 0 ? 5 : 3.5); };
    const place = () => { tr.style.transform = "translateX(" + (192.75 - pos(S.mins)) + "px)"; $("adjTime").textContent = fmt(S.mins * 60); };
    place();
    let sx = null, sm = 0;
    ru.onpointerdown = (e) => { sx = e.clientX; sm = S.mins; ru.setPointerCapture(e.pointerId); };
    ru.onpointermove = (e) => { if (sx == null) return; const z = parseFloat($("ipad").style.zoom) || 1; S.mins = Math.max(5, Math.min(120, Math.round(sm - (e.clientX - sx) / z / 13.6))); place(); };
    ru.onpointerup = () => (sx = null);
    ru.onwheel = (e) => { e.preventDefault(); S.mins = Math.max(5, Math.min(120, S.mins + (e.deltaY > 0 || e.deltaX > 0 ? 1 : -1))); place(); };
  }

  function enhance(lines) {
    const out = [];
    lines.forEach((l) => {
      const s = l.toLowerCase();
      if (/dwarf/.test(s)) out.push("Use flashcards to review key characteristics of dwarf planets");
      else if (/pluto/.test(s)) out.push("Complete a quiz on Chapter 6: Is Pluto a Planet with at least 80% accuracy");
      else if (/planet/.test(s)) out.push("Sort the eight planets into terrestrial and Jovian");
      else out.push(l.charAt(0).toUpperCase() + l.slice(1) + ", then answer 3 practice questions");
    });
    out.push("Explain in your own words why Pluto was reclassified in 2006");
    return [...new Set(out)].map((t, i) => ({ id: "e" + Date.now() + i, t, done: false }));
  }

  /* ---------- survey loading sequence ---------- */
  function runLoading() {
    S.ob.load = 0; render();
    const step = () => { if (S.overlay !== "survey" || S.ob.step !== 4) return; S.ob.load++; if (S.ob.load <= 3) { renderQuiet(); setTimeout(step, 520); } else { S.ob.step = 5; render(); } };
    setTimeout(step, 600);
  }
  function renderQuiet() { const box = document.querySelector(".lsteps"); if (!box) return; box.querySelectorAll("div").forEach((d, i) => d.classList.toggle("ok", i < S.ob.load)); }

  /* ---------- actions ---------- */
  const BACK = { hello: "home", content: "hello", outline: "content", awesome: "content", goals: "awesome", mgoals: "awesome", create: "mgoals", count: "goals", amazing: "count", timer: "amazing", adjust: "timer", last: "timer", great: "last" };
  function go(s) { S.menu = null; S.editing = null; S.screen = s; render(); }
  const A = {
    back: () => { if (S.screen === "count" && S.path === "manual") return go("mgoals"); go(BACK[S.screen] || "home"); },
    home: () => { if (S.screen !== "session") go("home"); },
    startFlow: () => {
      stop(); S.congrats = false;
      if (!S.onboarded) { S.ob.step = 0; S.ob.after = "hello"; S.overlay = "survey"; return go("home"); }
      S.overlay = null; go("hello");
    },
    profile: () => { S.overlay = "profile"; render(); },
    closeProfile: () => { S.overlay = null; render(); },
    retake: () => { S.ob.step = 1; S.ob.after = "profile"; S.overlay = "survey"; render(); },
    fb: (el) => { S.feedback = S.feedback === el.dataset.v ? null : el.dataset.v; render(); },
    privacy: () => { S.showStruggles = !S.showStruggles; render(); },
    // survey
    obSkip: () => { S.overlay = null; S.onboarded = true; go(S.ob.after === "profile" ? "home" : "hello"); },
    obNext: () => { if (S.ob.step === 3) { S.ob.step = 4; return runLoading(); } S.ob.step++; render(); },
    obBack: () => { S.ob.step = Math.max(S.ob.after === "profile" ? 1 : 0, S.ob.step - 1); render(); },
    q1: (el) => {
      const v = el.dataset.v, s = S.ob.q1, real = [...s].length;
      if (s.has(v)) s.delete(v); else if (real >= 3) { S.ob.shake = true; } else { s.add(v); flash = "q1" + v; }
      render();
    },
    q1other: () => { if (S.ob.q1.has("__other")) { S.ob.q1.delete("__other"); S.ob.otherOpen1 = false; } else if (S.ob.q1.size >= 3) S.ob.shake = true; else S.ob.otherOpen1 = !S.ob.otherOpen1; render(); const i = $("other1"); if (i) i.focus(); },
    q1otherSave: () => { const v = ($("other1") || {}).value || ""; S.ob.other1 = v.trim(); if (S.ob.other1) S.ob.q1.add("__other"); S.ob.otherOpen1 = false; render(); },
    q2: (el) => {
      const v = el.dataset.v, s = S.ob.q2;
      if (v === "other" && !s.has("other")) { S.ob.otherOpen2 = true; render(); const i = $("other2"); if (i) i.focus(); return; }
      if (s.has(v)) { s.delete(v); if (v === "other") S.ob.other2 = ""; } else { s.add(v); flash = "q2" + v; }
      render();
    },
    q2otherSave: () => { const v = ($("other2") || {}).value || ""; S.ob.other2 = v.trim(); if (S.ob.other2) { S.ob.q2.add("other"); flash = "q2other"; } S.ob.otherOpen2 = false; render(); },
    q3: (el) => { const v = el.dataset.v, s = S.ob.q3; if (s.has(v)) s.delete(v); else { s.add(v); flash = "q3" + v; } render(); },
    obProfile: () => { S.onboarded = true; applyPrefs(); S.overlay = "profile"; go("home"); },
    obFinish: () => { S.onboarded = true; applyPrefs(); S.overlay = null; go(S.ob.after === "profile" ? "home" : "hello"); },
    // study session
    toContent: () => go("content"),
    toOutline: () => go("outline"),
    topic: (el) => { const i = +el.dataset.i; if (S.topics.has(i)) S.topics.delete(i); else { S.topics.add(i); flash = "ch" + i; } render(); },
    toAwesome: () => go("awesome"),
    toGoals: () => { S.path = "typed"; go("goals"); },
    mode: (el) => { S.mode = el.dataset.v; S.menu = null; render(); },
    enhance: () => {
      const lines = S.typed.split("\n").map((l) => l.replace(/^[-•*\s]+/, "").trim()).filter(Boolean); if (!lines.length) return;
      S.enhancing = true; S.mode = "ai"; render();
      setTimeout(() => { S.goals = enhance(lines); S.enhancing = false; last.screen = null; render(); }, 1400);
    },
    menu: (el) => { S.menu = S.menu === el.dataset.id ? null : el.dataset.id; render(); },
    edit: (el) => { S.menu = null; S.editing = el.dataset.id; render(); },
    del: (el) => { S.goals = S.goals.filter((g) => g.id !== el.dataset.id); S.menu = null; render(); },
    swap: (el) => { const g = S.goals.find((x) => x.id === el.dataset.id); if (g) g.t = "Write a 3-sentence summary of Chapter 5: Planets"; S.menu = null; render(); },
    toCount: () => go("count"),
    mtoggle: (el) => { const g = S.mgoals.find((x) => x.id === el.dataset.id); g.on = !g.on; render(); },
    toCreate: () => { S.draft = ""; S.draftOpt = null; go("create"); },
    dch: (el) => { const i = +el.dataset.i; S.draftCh.has(i) ? S.draftCh.delete(i) : S.draftCh.add(i); render(); },
    dopt: (el) => { const i = +el.dataset.i; S.draftOpt = S.draftOpt === i ? null : i; if (S.draftOpt != null && !S.draft.trim()) S.draft = OPTIONS[i]; render(); },
    createGoal: () => { const t = S.draft.trim() || OPTIONS[S.draftOpt]; S.mgoals.push({ id: "m" + Date.now(), t, on: true }); go("mgoals"); },
    toAmazing: () => go("amazing"),
    toTimer: () => go("timer"),
    toAdjust: () => go("adjust"),
    toLast: () => go("last"),
    toGreat: () => go("great"),
    startSession: () => { S.total = S.left = S.mins * 60; S.studied = 0; S.page = 0; S.congrats = false; goalList().forEach((g) => (g.done = false)); go("session"); start(); },
    page: (el) => { S.page = +el.dataset.v; render(); },
    smode: (el) => { S.sessMode = el.dataset.v; render(); },
    sgoal: (el) => { const g = goalList().find((x) => x.id === el.dataset.id); if (g) { g.done = !g.done; if (g.done) flash = g.id; } render(); },
    endSession: () => { if (S.left > 0) { S.overlay = "end"; render(); } else A.confirmEnd(); },
    cancelEnd: () => { S.overlay = null; render(); },
    confirmEnd: () => { stop(); finishSession(); },
    progress: () => { S.overlay = "progress"; render(); },
    closeProgress: () => { S.overlay = null; S.congrats = false; go("home"); },
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) { if (S.menu) { S.menu = null; render(); } return; }
    if (el.disabled) return;
    const f = A[el.dataset.act]; if (f) { e.preventDefault(); f(el); }
  });
  document.addEventListener("input", (e) => {
    const id = e.target.id;
    if (id === "typed" || id === "draft") {
      const key = id === "typed" ? "typed" : "draft", was = !!S[key].trim(); S[key] = e.target.value;
      if (was !== !!S[key].trim()) { const pos = e.target.selectionStart; render(); const t = $(id); t.focus(); t.setSelectionRange(pos, pos); }
    }
  });
  document.addEventListener("focusout", (e) => {
    const id = e.target.dataset && e.target.dataset.edit; if (!id) return;
    const g = S.goals.find((x) => x.id === id); if (g) g.t = e.target.textContent.trim() || g.t;
    S.editing = null; setTimeout(render, 0);
  });
  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (t.isContentEditable) { if (e.key === "Enter") { e.preventDefault(); t.blur(); } return; }
    if (t.tagName === "TEXTAREA" || t.tagName === "INPUT") {
      if (e.key === "Escape") t.blur();
      if (e.key === "Enter" && t.id === "draft") A.createGoal();
      if (e.key === "Enter" && t.id === "other1") A.q1otherSave();
      if (e.key === "Enter" && t.id === "other2") A.q2otherSave();
      return;
    }
    if (e.key === "Escape") {
      const j = $("jumper"); if (!j.hidden) { j.hidden = true; return; }
      if (S.overlay === "survey") return A.obSkip();
      if (S.overlay) { S.overlay = null; return render(); }
      A.back();
    }
    if (e.key === "?") jumper();
  });

  /* ---------- screen jumper ---------- */
  const JUMP = [
    ["Profile Personalization", [["ob0", "Survey: Let’s tailor your learning"], ["ob1", "Survey 1/3: How should Learn present material?"], ["ob2", "Survey 2/3: Learning struggles"], ["ob3", "Survey 3/3: How will you use Learn?"], ["ob4", "Preparing your study plan…"], ["ob5", "Let’s get studying"], ["profile", "Alison’s Learning Profile"]]],
    ["Entry Point", [["home", "Learn panel"], ["hello", "Hello Alison!"]]],
    ["Selecting Content", [["content", "What content would you like to review?"], ["outline", "Outline: Our Solar System"], ["awesome", "Awesome!"]]],
    ["AI Assisted Goal Setting", [["goals", "Typing in your goals + AI enhancement"], ["goals-ai", "AI goals (enhanced)"], ["mgoals", "Manually inputting goals + AI suggestions"], ["create", "Create a Goal"], ["count", "You’ve set N goals!"]]],
    ["Setting a Timer", [["amazing", "Amazing!"], ["timer", "Today, I want to work for…"], ["adjust", "Adjust time (drag the ruler)"], ["last", "Your session will last…"], ["great", "Great Goals!"]]],
    ["Study Session in Progress", [["session", "Timer"], ["session-goals", "Session goals: AI ↔ notes"]]],
    ["Ending a Study Session", [["end", "End session early?"], ["congrats", "Congratulations, Alison!"], ["progress", "Awesome Work! (progress)"]]],
  ];
  function jumper() {
    const j = $("jumper"); if (!j.hidden) { j.hidden = true; return; }
    let n = 0;
    j.innerHTML = '<div class="box">' + JUMP.map(([h, items]) => "<h3>" + h + "</h3>" + items.map(([k, l]) => '<button data-jump="' + k + '"><span>' + ++n + "</span>" + l + "</button>").join("")).join("") + "</div>";
    j.hidden = false;
  }
  $("jumper").addEventListener("click", (e) => { const b = e.target.closest("[data-jump]"); $("jumper").hidden = true; if (b) jumpTo(b.dataset.jump); });
  function sampleAnswers() {
    const o = S.ob;
    if (!o.q1.size) ["Visual diagrams", "Step-by-step", "Short summary"].forEach((x) => o.q1.add(x));
    if (!o.q2.size) ["focus", "test", "reading"].forEach((x) => o.q2.add(x));
    if (!o.q3.size) o.q3.add("quick");
  }
  function jumpTo(k) {
    stop(); S.congrats = false; S.overlay = null; last = { screen: null, overlay: null, step: null };
    if (k.startsWith("ob")) {
      const st = +k.slice(2); if (st >= 4) sampleAnswers(); else if (st === 3) { sampleAnswers(); S.ob.q3.clear(); }
      S.ob.step = st; S.ob.after = "hello"; S.overlay = "survey"; S.screen = "home";
      if (st === 4) return runLoading();
      return render();
    }
    if (k === "profile") { sampleAnswers(); S.onboarded = true; S.overlay = "profile"; S.screen = "home"; return render(); }
    S.onboarded = true;
    if (k === "goals") { S.path = "typed"; S.mode = "list"; S.typed = S.typed || "understand what a dwarf planet is\nreview notes about pluto"; return go("goals"); }
    if (k === "goals-ai") { S.path = "typed"; S.mode = "ai"; return go("goals"); }
    if (k === "mgoals" || k === "create") S.path = "manual";
    if (k.startsWith("session") || ["end", "congrats", "progress"].includes(k)) {
      S.total = S.mins * 60; S.left = Math.round(S.total * 0.4); S.studied = S.total - S.left;
      S.screen = "session"; S.page = k === "session-goals" ? 1 : 0;
      if (k === "session-goals") goalList()[0].done = true;
      if (k === "end") S.overlay = "end";
      if (k === "congrats" || k === "progress") { S.congrats = true; goalList().slice(0, 2).forEach((g) => (g.done = true)); }
      if (k === "progress") S.overlay = "progress";
      render(); if (k === "session" || k === "session-goals") start(); return;
    }
    go(k);
  }

  /* ---------- embed + self-playing tours (used by the case study) ---------- */
  const QS = new URLSearchParams(location.search), EMBED = QS.has("embed"), TOUR = QS.get("tour");
  if (EMBED) document.documentElement.classList.add("embed");
  const fake = (v) => ({ dataset: { v: v, i: v, id: v } });
  let tt = [], touring = false;
  function resetAll() {
    stop(); S.overlay = null; S.congrats = false; S.menu = null;
    S.ob.q1.clear(); S.ob.q2.clear(); S.ob.q3.clear(); S.ob.other1 = S.ob.other2 = "";
    S.topics = new Set(AI_TOPICS); S.typed = ""; S.mode = "list"; S.mins = 30; S.feedback = null; S.showStruggles = true;
    S.goals = AI_GOALS.map((t, i) => ({ id: "g" + i, t, done: false }));
  }
  const TOURS = {
    survey: [[0, () => { resetAll(); jumpTo("ob0"); }], [1800, () => A.obNext()],
      [900, () => A.q1(fake("Visual diagrams"))], [500, () => A.q1(fake("Step-by-step"))], [500, () => A.q1(fake("Short summary"))], [500, () => A.q1(fake("Concise"))],
      [1100, () => A.obNext()], [900, () => A.q2(fake("focus"))], [450, () => A.q2(fake("test"))], [450, () => A.q2(fake("reading"))],
      [1100, () => A.obNext()], [900, () => A.q3(fake("quick"))], [900, () => A.obNext()], [5200, () => {}]],
    profile: [[0, () => { resetAll(); jumpTo("profile"); }], [2600, () => { const b = document.querySelector(".prof .body"); if (b) b.scrollTo({ top: 260, behavior: "smooth" }); }],
      [1500, () => A.fb(fake("y"))], [1400, () => { A.privacy(); }], [1600, () => { A.privacy(); }], [1200, () => { const b = document.querySelector(".prof .body"); if (b) b.scrollTo({ top: 900, behavior: "smooth" }); }], [3200, () => {}]],
    content: [[0, () => { resetAll(); S.onboarded = true; jumpTo("hello"); }], [1700, () => A.toContent()], [1500, () => A.topic(fake(5))], [600, () => A.topic(fake(5))],
      [900, () => A.toOutline()], [1100, () => A.topic(fake(1))], [700, () => A.topic(fake(3))], [1100, () => A.toAwesome()], [2600, () => {}]],
    goals: [[0, () => { resetAll(); S.onboarded = true; S.path = "typed"; S.mode = "list"; go("goals"); }],
      [900, () => typeIn("understand what a dwarf planet is\nreview notes about pluto")], [2600, () => A.enhance()], [2400, () => A.mode(fake("list"))], [1500, () => A.mode(fake("ai"))], [1400, () => A.toCount()], [2200, () => {}]],
    timer: [[0, () => { resetAll(); S.onboarded = true; jumpTo("amazing"); }], [1600, () => A.toTimer()], [1500, () => A.toAdjust()],
      [700, () => slideMins(45)], [1600, () => slideMins(25)], [1500, () => A.toLast()], [1700, () => A.toGreat()], [2200, () => {}]],
    session: [[0, () => { resetAll(); S.onboarded = true; S.path = "typed"; S.mins = 30; A.startSession(); S.left = 12 * 60; paint(); }], [2200, () => A.page(fake(1))],
      [1100, () => A.sgoal(fake("g0"))], [900, () => A.sgoal(fake("g1"))], [1300, () => A.smode(fake("list"))], [1100, () => A.smode(fake("ai"))], [1100, () => A.page(fake(0))],
      [1200, () => A.endSession()], [1300, () => A.confirmEnd()], [1800, () => A.progress()], [3600, () => {}]],
  };
  TOURS.all = [].concat(TOURS.survey.slice(0, -1), [[3800, () => {}]], TOURS.content.slice(0, -1), [[1800, () => {}]], TOURS.goals.slice(0, -1), [[1600, () => {}]], TOURS.timer.slice(1, -1), [[1400, () => A.startSession()]], TOURS.session.slice(1));
  function typeIn(txt) { let i = 0; const f = () => { if (!touring) return; S.typed = txt.slice(0, ++i); render(); if (i < txt.length) tt.push(setTimeout(f, 28)); }; f(); }
  function slideMins(to) { const st = S.mins, n = 18; let k = 0; const f = () => { if (!touring) return; k++; S.mins = Math.round(st + (to - st) * (k / n)); const t = $("track"); if (t) { buildRuler(); } if (k < n) tt.push(setTimeout(f, 40)); }; f(); }
  function runTour(name) {
    const steps = TOURS[name]; if (!steps) return; touring = true;
    let t = 0; steps.forEach(([d, fn]) => { t += d; tt.push(setTimeout(() => touring && fn(), t)); });
    tt.push(setTimeout(() => touring && (tt = [], runTour(name)), t + 400));
  }
  function stopTour() { if (!touring) return; touring = false; tt.forEach(clearTimeout); tt = []; document.documentElement.classList.add("live"); }
  addEventListener("pointerdown", stopTour, true);
  // parent page control (home card: still frame at rest, plays on hover)
  const REST = QS.get("rest");
  function rest() { touring = false; tt.forEach(clearTimeout); tt = []; resetAll(); if (REST) jumpTo(REST); }
  addEventListener("message", (e) => {
    const c = e.data && e.data.nbCmd; if (!c) return;
    if (c === "play" && !touring) { tt.forEach(clearTimeout); tt = []; runTour(e.data.tour || "all"); }
    if (c === "rest") rest();
  });
  addEventListener("keydown", stopTour, true);

  function fit() { $("ipad").style.zoom = EMBED ? Math.min(innerWidth / 1390, innerHeight / 1048) : Math.min((innerWidth - 40) / 1390, (innerHeight - 64) / 1048, 1); }
  addEventListener("resize", fit); fit();
  render();
  const h = location.hash.slice(1);
  if (TOUR) runTour(TOUR); else if (REST) rest(); else if (h) jumpTo(h);
})();

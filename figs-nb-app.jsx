// figs-nb-app.jsx — Notability Study Sessions prototype pieces
(function () {
  const { useState, useEffect, useRef } = React;
  const GOALS_AI = [
    ["Review 5 questions on dwarf planets", "From last quiz \u2014 64% accuracy"],
    ["Summarize the Kuiper Belt in 3 bullets", "Builds on today\u2019s lecture"],
    ["Revisit definitions from Chapter 6", "Not reviewed yet"],
  ];
  const GOALS_TODO = ["Review dwarf planet questions", "Summarize the Kuiper Belt", "Reread Chapter 6 definitions"];
  const d = (s) => ({ "--d": s + "s" });

  function Top() {
    return <div className="nbp-top"><span className="nbp-back">&lsaquo;</span><span className="nbp-title">Study Session</span><span className="nb-pill">{"\u2726"} Learn</span></div>;
  }
  function Foot({ a, b, tap }) {
    return <div className="nbp-foot">{a ? <span className="nb-btn is-sec">{a}</span> : null}<span className={"nb-btn is-pri" + (tap ? " is-tap" : "")} style={tap ? { "--tap": tap + "s" } : null}>{b}</span></div>;
  }
  function StepSelect({ tap }) {
    const items = [["Lecture 6 \u00b7 The Solar System", "Open now", 0.5], ["Chapter 6 reading", "Linked to this lecture", 1.0], ["Quiz 3 \u00b7 Dwarf planets", "64% accuracy", 1.5]];
    return (
      <div className="nbp"><Top />
        <div className="nbp-body">
          <p className="nb-eye">Step 1 {"\u00b7"} Your material</p>
          <h4>What are we studying?</h4>
          <p className="nbp-sub">Learn found three sources from this week.</p>
          {items.map((it, i) => <div className="nb-card nb-in" style={d(0.1 + i * 0.1)} key={i}><span className="nb-box is-on" style={d(it[2])}></span><div><b>{it[0]}</b><small className="is-mute">{it[1]}</small></div></div>)}
        </div>
        <Foot b={"Build my plan \u2192"} tap={tap} />
      </div>
    );
  }
  function StepGoals({ tap, mode = "ai", setMode, toggle = true }) {
    const ai = mode === "ai";
    return (
      <div className="nbp"><Top />
        <div className="nbp-body">
          <p className="nb-eye">Step 2 {"\u00b7"} Today{"\u2019"}s plan</p>
          <h4>Your 10-minute plan</h4>
          <p className="nbp-sub">{ai ? "Three small tasks, drawn from what you studied." : "Your own list. Learn keeps the timer and summary."}</p>
          {toggle ? <div className="nb-seg" role="group" aria-label="Goal type"><button className={ai ? "is-on" : ""} onClick={() => setMode && setMode("ai")}>{"\u2726"} AI goals</button><button className={!ai ? "is-on" : ""} onClick={() => setMode && setMode("todo")}>To-do list</button></div> : null}
          {ai
            ? GOALS_AI.map((g, i) => <div className="nb-card nb-in" style={d(0.15 + i * 0.14)} key={"a" + i}><span className="nb-box"></span><div><b>{g[0]}</b><small><span className="nb-spark">{"\u2726"}</span> {g[1]}</small></div></div>)
            : <React.Fragment>{GOALS_TODO.map((g, i) => <div className="nb-card nb-in" style={d(0.08 + i * 0.08)} key={"t" + i}><span className="nb-box"></span><div><b>{g}</b></div></div>)}<div className="nb-add nb-in" style={d(0.34)}>+ Add a task</div></React.Fragment>}
        </div>
        <Foot a={toggle ? null : "Switch to Tutor"} b={"Start plan \u2192"} tap={tap} />
      </div>
    );
  }
  function StepFocus({ tap, still }) {
    const [sec, setSec] = useState(still ? 372 : 600);
    useEffect(() => { if (still) return; const t = setInterval(() => setSec((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);
    const C = 2 * Math.PI * 86;
    const frac = still ? 0.62 : 1;
    return (
      <div className="nbp"><Top />
        <div className="nbp-body">
          <p className="nb-eye">Step 3 {"\u00b7"} Focus</p>
          <span className="nb-chip-s"><span className="nb-spark">{"\u2726"}</span> Dwarf planets</span>
          <div className="nb-ring">
            <svg viewBox="0 0 196 196"><circle cx="98" cy="98" r="86" fill="none" stroke="#e6ebf6" strokeWidth="14"></circle><circle cx="98" cy="98" r="86" fill="none" stroke="#3d6ff5" strokeWidth="14" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} style={still ? null : { animation: "nbRing 600s linear forwards" }}></circle></svg>
            <div className="nb-ring-t"><b>{String(Math.floor(sec / 60)).padStart(2, "0")}:{String(sec % 60).padStart(2, "0")}</b><span>FOCUS</span></div>
          </div>
          <p className="nb-meta">Goal 1 of 3 {"\u00b7"} 10 min plan</p>
          <div className="nb-card nb-in" style={d(0.3)}><span className="nb-box"></span><div><b>{GOALS_AI[0][0]}</b><small><span className="nb-spark">{"\u2726"}</span> {GOALS_AI[0][1]}</small></div></div>
        </div>
        <Foot a="Pause" b="End session" tap={tap} />
      </div>
    );
  }
  function StepReview({ tap }) {
    return (
      <div className="nbp"><Top />
        <div className="nbp-body">
          <p className="nb-eye">Step 4 {"\u00b7"} Review</p>
          <h4>Here{"\u2019"}s what changed.</h4>
          <p className="nbp-sub">Progress from today{"\u2019"}s goals, not time spent in the app.</p>
          <div className="nb-stats nb-in" style={d(0.1)}><div className="nb-stat"><b>3 / 3</b><span>Goals completed</span></div><div className="nb-stat"><b>10 min</b><span>Focused</span></div></div>
          <div className="nb-card nb-in" style={{ ...d(0.25), display: "block" }}>
            <b>Dwarf planet questions</b>
            <div className="nb-bar"><i className="is-old" style={{ width: "64%" }}></i><i style={{ width: "86%", "--from": "64%", "--d": ".7s" }}></i></div>
            <div className="nb-row"><span>64% last quiz</span><em>86% today</em></div>
          </div>
          <div className="nb-card nb-in" style={d(0.4)}><span className="nb-box is-on" style={d(0)}></span><div><b>Kuiper Belt summary saved</b><small className="is-mute">Added to Lecture 6 notes</small></div></div>
        </div>
        <Foot a="Back to notes" b="Plan next" tap={tap} />
      </div>
    );
  }
  const STEPS = [StepSelect, StepGoals, StepFocus, StepReview];
  const NAMES = ["Select notes", "Generate goals", "Focus", "Review progress"];

  function Notes({ step }) {
    return (
      <div className={"nb-notes" + (step === 2 ? " is-dim" : "")}>
        <div className="nb-tools"><i></i><i></i><i></i><i></i></div>
        <p className="nb-eye">Astronomy 10 {"\u00b7"} Lecture 6</p>
        <h3>The Solar System</h3>
        <p>The Solar System formed about 4.6 billion years ago from a collapsing cloud of gas and dust. Most of that material gathered at the center to form the Sun.</p>
        <h5>Dwarf planets</h5>
        <p>A <u>dwarf planet</u> orbits the Sun and is round, but <mark>has not cleared other objects out of its orbital path.</mark> Pluto is the best-known example, reclassified in 2006.</p>
        <p style={{ marginTop: 10 }}>These icy bodies cluster in the Kuiper Belt, a ring of debris beyond Neptune.</p>
        <div className="nb-hand">ask tutor what {"\u201c"}cleared its orbit{"\u201d"} means</div>
        {step === 0 ? <div className="nb-selbox" key="sel"><span>Selected {"\u00b7"} Lecture 6</span></div> : null}
      </div>
    );
  }

  const DUR = [3.8, 3.8, 3.8, 4.4];
  function Walkthrough() {
    const ref = useRef(null);
    const vis = window.useFigInView(ref);
    const [i, setI] = useState(0);
    const [hold, setHold] = useState(false);
    const auto = !window.figReduced();
    const S = STEPS[i];
    return (
      <div ref={ref} className={"nb" + (!vis || hold ? " is-paused" : "")} onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
        <div className="nb-dev"><div className="nb-screen">
          <Notes step={i} />
          <div className="nb-side"><S key={i} tap={auto ? DUR[i] - 0.8 : null} /></div>
        </div></div>
        <div className="nb-chips">
          {NAMES.map((n, k) => (
            <button key={k} type="button" className={"nb-chip" + (k === i ? " is-on" : "")} onClick={() => setI(k)}>
              <span>0{k + 1}</span>{n}
              {k === i && auto ? <i key={"b" + i} style={{ "--dur": DUR[i] + "s" }} onAnimationEnd={() => setI((x) => (x + 1) % 4)}></i> : null}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function Flow() {
    const ref = useRef(null);
    const c = window.useFigCycle(ref, 4, 1800);
    return (
      <div ref={ref} className="nb" onMouseLeave={() => c.setHold(false)}>
        <div style={{ position: "absolute", left: 56, right: 56, top: 54, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 38 }}>
          {STEPS.map((S, k) => (
            <div key={k} onMouseEnter={() => { c.setHold(true); c.setI(k); }} style={{ position: "relative" }}>
              <div className="nb-mini" data-on={k === c.i ? "1" : "0"}>
                <div className="nb-still" style={{ width: 360, height: 600, transform: "scale(.7)", transformOrigin: "0 0" }}><S still /></div>
              </div>
              {k < 3 ? <span className="nb-arrow">{"\u2192"}</span> : null}
              <p className="nb-mini-l"><span>0{k + 1}</span>{NAMES[k]}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function Progress() {
    const ref = useRef(null);
    const vis = window.useFigInView(ref, 0.4);
    return (
      <div ref={ref} className="nb">
        <div className="nb-tab">{vis ? <StepReview /> : null}</div>
      </div>
    );
  }

  function BeforeAfter() {
    const ref = useRef(null);
    const c = window.useFigCycle(ref, 2, 2600);
    const mode = c.i === 0 ? "ai" : "todo";
    return (
      <div ref={ref} className="nb">
        <div className="nb-ba" style={{ left: 110 }}>
          <p className="nb-ba-l"><b>Before</b> AI generates every step</p>
          <div className="nb-ba-dev"><StepGoals toggle={false} /></div>
        </div>
        <div className="nb-ba" style={{ right: 110 }} onMouseEnter={() => c.setHold(true)} onMouseLeave={() => c.setHold(false)}>
          <p className="nb-ba-l is-new"><b>After</b> Students choose how much AI</p>
          <div className="nb-ba-dev is-new"><StepGoals mode={mode} setMode={(m) => c.setI(m === "ai" ? 0 : 1)} /></div>
        </div>
      </div>
    );
  }

  Object.assign(window.CASE_FIGS, {
    "p1::Final Study Sessions walkthrough": Walkthrough,
    "p1::Four-screen product flow": Flow,
    "p1::Progress summary screen": Progress,
    "p1::Before and after": BeforeAfter,
  });
})();

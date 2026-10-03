// figs-nb-research.jsx — Notability research & strategy figures
(function () {
  const { useState, useRef } = React;
  const d = (s) => ({ "--d": s + "s" });

  function Competitive() {
    const ref = useRef(null);
    const vis = window.useFigInView(ref);
    const cols = [["Notability Learn", "N", "#3d6ff5"], ["StudyFetch", "S", "#1f2a44"], ["Knowt", "K", "#6d7690"], ["Others", "+", "#a3abc0"]];
    const rows = ["AI summaries", "Flashcards", "Lecture transcripts", "AI chat tutor", "Practice quizzes"];
    return (
      <div ref={ref} className="nb">
        <div className="nb-card-lg nb-mx">
          <div className="nb-mx-row is-head"><div className="nb-lbl">Feature</div>{cols.map((c, k) => <div key={k} className={k === 0 ? "is-nb" : ""}><span className="nb-logo" style={{ background: c[2] }}>{c[1]}</span>{c[0]}</div>)}</div>
          {vis ? rows.map((r, i) => <div className="nb-mx-row" key={r}><div>{r}</div>{cols.map((c, k) => <div key={k} className={k === 0 ? "is-nb" : ""}><span className="nb-yes" style={d(0.1 + i * 0.12 + k * 0.05)}></span></div>)}</div>) : null}
          {vis ? <div className="nb-mx-row is-opp nb-in" style={d(1)}><div>Adapts to how each student learns<span className="nb-opp">Opportunity</span></div>{cols.map((c, k) => <div key={k}><span className="nb-no"></span></div>)}</div> : null}
        </div>
      </div>
    );
  }

  const FINDINGS = [
    ["Streaks created pressure.", "A lightweight timer with no streaks or artificial urgency"],
    ["Points rewarded activity instead of understanding.", "Progress measured by completed goals and understanding"],
    ["Automatic answers made students question whether they were learning.", "A toggle between AI goals and a plain to-do list"],
  ];
  function Research() {
    const [h, setH] = useState(-1);
    return (
      <div className="nb">
        <div className="nb-rs-top">{["74 survey responses", "Interviews", "Focus group", "Diary studies"].map((m, i) => <span key={m} className={i === 0 ? "is-strong" : ""}>{m}</span>)}</div>
        <div className="nb-rs-head"><span className="nb-lbl">What students told us</span><span className="nb-lbl">What we changed</span></div>
        {FINDINGS.map((f, i) => (
          <div key={i} className={"nb-rs-row" + (h >= 0 && h !== i ? " is-dim" : "")} onMouseEnter={() => setH(i)} onMouseLeave={() => setH(-1)}>
            <div className="nb-rs-f"><span>0{i + 1}</span>{f[0]}</div>
            <div className="nb-rs-line"><i></i></div>
            <div className="nb-rs-d"><span className="nb-spark">{"\u2726"}</span>{f[1]}</div>
          </div>
        ))}
      </div>
    );
  }

  const PR = [
    ["01", "Active learning", "Help students think.", "Automatic answers made students question whether they were learning."],
    ["02", "Personalization", "Understand how each student learns.", "Participants spanned different subjects, learning preferences, and accessibility needs."],
    ["03", "Trust", "Use material the student has actually studied.", "Every goal cites the lecture, reading, or quiz it came from."],
    ["04", "Progress", "Show improvement without artificial rewards.", "\u201cI don\u2019t want points. I want to know I\u2019m actually getting better.\u201d"],
  ];
  function Principles() {
    return (
      <div className="nb">
        <div className="nb-pr">
          {PR.map((p) => (
            <div className="nb-pr-c" key={p[0]}>
              <span className="nb-pr-n">{p[0]}</span>
              <h6>{p[1]}</h6>
              <p>{p[2]}</p>
              <div className="nb-pr-ev"><span className="nb-lbl">From research</span><q>{p[3].replace(/[\u201c\u201d]/g, "")}</q></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function Sketch({ k }) {
    if (k === 0) return <div className="nb-sk"><div className="nb-sk-av"></div><i style={{ width: "50%" }}></i><i style={{ width: "34%" }}></i>{[70, 40, 85].map((w, j) => <div className="nb-sk-sl" key={j}><i style={{ width: w + "%" }}></i></div>)}</div>;
    if (k === 1) return <div className="nb-sk is-graph"><b style={{ left: "38%", top: "14%" }}>Sun</b><b style={{ left: "8%", top: "58%" }}>Pluto</b><b style={{ left: "62%", top: "62%" }}>Eris</b><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 26 L20 64 M50 26 L74 68"></path></svg></div>;
    if (k === 2) return <div className="nb-sk">{[92, 88, 70].map((w, j) => <i key={j} style={{ width: w + "%" }}></i>)}<div className="nb-sk-hl"><i style={{ width: "80%" }}></i><i style={{ width: "56%" }}></i></div>{[90, 64].map((w, j) => <i key={j} style={{ width: w + "%" }}></i>)}</div>;
    return <div className="nb-sk">{[0, 1, 2].map((j) => <div className="nb-sk-ck" key={j}><span></span><i style={{ width: [70, 55, 62][j] + "%" }}></i></div>)}<div className="nb-sk-ring"></div></div>;
  }
  const CONCEPTS = ["Adaptive Learning Profiles", "AI Visualizations", "Reading Support", "Study Sessions"];
  function Concepts() {
    return (
      <div className="nb nb-paper">
        <div className="nb-cx">
          {CONCEPTS.map((c, k) => (
            <div key={c} className={"nb-cx-c" + (k === 3 ? " is-pick" : "")} style={{ transform: "rotate(" + [-1.2, 0.8, -0.6, 1][k] + "deg)" }}>
              {k === 3 ? <span className="nb-cx-tag">Primary direction</span> : null}
              <Sketch k={k} />
              <p><span>0{k + 1}</span>{c}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const SCORES = [["Adaptive Learning Profiles", 3, 4, 3], ["AI Visualizations", 4, 3, 2], ["Reading Support", 3, 2, 4], ["Study Sessions", 5, 5, 4]];
  function Matrix() {
    const ref = useRef(null);
    const vis = window.useFigInView(ref);
    return (
      <div ref={ref} className="nb">
        <div className="nb-card-lg nb-pm">
          <div className="nb-pm-r is-head"><span className="nb-lbl">Direction</span><span className="nb-lbl">Student value</span><span className="nb-lbl">Differentiation</span><span className="nb-lbl">Feasibility</span><span className="nb-lbl">Total</span></div>
          {SCORES.map((s, i) => (
            <div className={"nb-pm-r" + (i === 3 ? " is-win" : "")} key={s[0]}>
              <b>{s[0]}</b>
              {[1, 2, 3].map((c) => <span className="nb-pips" key={c}>{[0, 1, 2, 3, 4].map((p) => <i key={p} className={vis && p < s[c] ? "is-on" : ""} style={{ transitionDelay: (i * 0.12 + c * 0.08 + p * 0.05) + "s" }}></i>)}</span>)}
              <em>{s[1] + s[2] + s[3]}<small>/15</small></em>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const SRC = [["Learning Profiles", "Context about subjects and preferences", "Review 5 questions on dwarf planets", "Matched to your quiz history"], ["AI Visualizations", "Alternatives when text is insufficient", "See the Kuiper Belt as a diagram", "Visual explanation"], ["Reading Support", "Restructures difficult passages", "Reread Chapter 6, simplified", "Shorter sentences, key terms first"]];
  function Ecosystem() {
    const [h, setH] = useState(-1);
    const ys = [96, 256, 416];
    return (
      <div className="nb">
        <svg className="nb-eco-svg" viewBox="0 0 1280 640">
          {ys.map((y, i) => <path key={i} className={h === i ? "is-on" : h >= 0 ? "is-dim" : ""} d={"M430 " + (y + 64) + " C 560 " + (y + 64) + ", 560 " + (262 + i * 84) + ", 700 " + (262 + i * 84)}></path>)}
        </svg>
        {SRC.map((s, i) => (
          <div key={i} className={"nb-eco-src" + (h === i ? " is-on" : "")} style={{ top: ys[i] }} onMouseEnter={() => setH(i)} onMouseLeave={() => setH(-1)}>
            <b>{s[0]}</b><span>{s[1]}</span>
          </div>
        ))}
        <div className="nb-eco-core">
          <div className="nb-eco-h"><span className="nb-pill">{"\u2726"} Learn</span><b>Study Session</b><small>Astronomy 10 {"\u00b7"} 10 min</small></div>
          {SRC.map((s, i) => (
            <div key={i} className={"nb-card" + (h === i ? " is-lit" : "")} onMouseEnter={() => setH(i)} onMouseLeave={() => setH(-1)}><span className="nb-box"></span><div><b>{s[2]}</b><small><span className="nb-spark">{"\u2726"}</span> {s[3]}</small></div></div>
          ))}
        </div>
      </div>
    );
  }

  Object.assign(window.CASE_FIGS, {
    "p1::Competitive landscape": Competitive,
    "p1::Research summary": Research,
    "p1::Four product principles": Principles,
    "p1::Concept exploration": Concepts,
    "p1::Prioritization matrix": Matrix,
    "p1::Product ecosystem": Ecosystem,
  });
})();

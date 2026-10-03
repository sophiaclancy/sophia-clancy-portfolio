// contextocover.jsx — Contexto cover: a choreographed, Apple-grade context-aware
// Spotlight that types a query, surfaces location/calendar awareness, then
// cascades the files you actually need — looping smoothly.

function ContextoCover() {
  const { useState, useEffect } = React;
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState("idle"); // idle · typing · reveal · focus · out

  useEffect(() => {
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const full = "math notes";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setQ(full);
      setPhase("focus");
      return;
    }

    (async () => {
      while (alive) {
        // 1 — calm, empty field
        setPhase("idle");
        setQ("");
        await sleep(900);

        // 2 — type the query with gentle human jitter
        setPhase("typing");
        for (let i = 1; i <= full.length; i++) {
          if (!alive) return;
          setQ(full.slice(0, i));
          const ch = full[i - 1];
          await sleep(ch === " " ? 150 : 92 + Math.random() * 70);
        }
        await sleep(360);

        // 3 — context + results cascade in
        setPhase("reveal");
        await sleep(1500);

        // 4 — the top result lights up
        setPhase("focus");
        await sleep(3400);

        // 5 — clear away and loop
        setPhase("out");
        await sleep(620);
        for (let i = full.length; i >= 0; i--) {
          if (!alive) return;
          setQ(full.slice(0, i));
          await sleep(26);
        }
        await sleep(420);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const FileIcon = (ext, cls) => (
    <span className={"cx-fi cx-fi-" + cls}>
      <span className="cx-fi-lines"><i></i><i></i><i></i></span>
      <span className="cx-fi-ext">{ext}</span>
    </span>
  );

  const Mg = (
    <svg className="cx-mg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="7" stroke="currentColor" strokeWidth="2.4" />
      <line x1="15.6" y1="15.6" x2="21" y2="21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );

  const dockColors = [
    "linear-gradient(160deg,#7dd6ff,#2f7bd6)",
    "linear-gradient(160deg,#5ee0b0,#16a37a)",
    "linear-gradient(160deg,#ffd36e,#f2a23c)",
    "linear-gradient(160deg,#ff9aa8,#ec5a76)",
    "linear-gradient(160deg,#c4a3ff,#7c5cf0)",
    "linear-gradient(160deg,#e9eef4,#c2ccd8)",
  ];

  const reveal = phase === "reveal" || phase === "focus";

  return (
    <div className={"flip-cover cx-cover phase-" + phase + (reveal ? " is-reveal" : "")}>
      {/* blurred macOS desktop */}
      <div className="cx-desk" aria-hidden="true">
        <span className="cx-bloom cx-bloom-a"></span>
        <span className="cx-bloom cx-bloom-b"></span>
        <div className="cx-menubar">
          <span className="cx-logo"></span>
          <span className="cx-mtitle">Finder</span>
          <span className="cx-mmenu">File</span>
          <span className="cx-mmenu">Edit</span>
          <span className="cx-mmenu">View</span>
          <span className="cx-mright"><i></i><i></i><span className="cx-mclock">2:00 PM</span></span>
        </div>
        <div className="cx-dock">
          {dockColors.map((g, i) => <i key={i} style={{ background: g }}></i>)}
        </div>
      </div>

      {/* context-aware Spotlight */}
      <div className="cx-spot">
        <div className="cx-spot-in">
          <span className="cx-mg-wrap">{Mg}</span>
          <span className="cx-q">
            <span>{q}</span>
            <span className="cursor"></span>
            {q === "" && <span className="cx-ph">Spotlight Search</span>}
          </span>
          <span className="cx-kbd">⌘ Space</span>
        </div>

        <div className="cx-ctx">
          <span className="cx-pin"></span>
          <span>Near <b>Dwinelle Hall</b> &middot; calendar shows <b>Anthro 3AC</b> at 2:00</span>
        </div>

        <div className="cx-sec">Files you might need</div>
        <div className="cx-list">
          <div className="cx-row top" style={{ "--i": 0 }}>
            <span className="cx-rowbg"></span>
            {FileIcon("PDF", "pdf")}
            <div className="cx-meta">
              <div className="cx-name">Math 1A &mdash; Lecture Notes.pdf</div>
              <div className="cx-chips"><span className="cx-chip">Math 1A</span><span className="cx-chip">Midterm week</span></div>
            </div>
            <div className="cx-open"><span className="cx-ret">&#8629;</span> Open</div>
          </div>
          <div className="cx-row" style={{ "--i": 1 }}>
            {FileIcon("PY", "py")}
            <div className="cx-meta">
              <div className="cx-name">lab01.py</div>
              <div className="cx-chips"><span className="cx-chip teal">Used in CS 61A lab</span></div>
            </div>
          </div>
          <div className="cx-row" style={{ "--i": 2 }}>
            {FileIcon("DOC", "doc")}
            <div className="cx-meta">
              <div className="cx-name">Anthro &mdash; Week 9 Reading</div>
              <div className="cx-chips"><span className="cx-chip blue">From bCourses</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ContextoCover = ContextoCover;

// sandcover.jsx — Sand project cover: an ambient AR rhythm HUD floating over a dusk workspace

function SandCover() {
  const { useState, useEffect } = React;
  const [sec, setSec] = useState(2828); // seconds "in flow" → 47:08

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  return (
    <div className="flip-cover sand-cover">
      {/* dusk workspace scene */}
      <div className="sd-bg" aria-hidden="true">
        <span className="sd-lamp"></span>
        <span className="sd-desk"></span>
        <span className="sd-grain sd-g1"></span>
        <span className="sd-grain sd-g2"></span>
        <span className="sd-grain sd-g3"></span>
        <span className="sd-grain sd-g4"></span>
        <span className="sd-grain sd-g5"></span>
        <span className="sd-grain sd-g6"></span>
      </div>

      {/* top status row */}
      <div className="sd-status"><i></i>Rhythm Active</div>
      <div className="sd-clock">5:04 PM</div>

      {/* left mode card */}
      <div className="sd-card sd-mode">
        <div className="sd-eyebrow">Current Mode</div>
        <div className="sd-mode-title">Evening Focus</div>
        <svg className="sd-curve" viewBox="0 0 130 46" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sdFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3fd07a" stopOpacity="0.42" />
              <stop offset="1" stopColor="#3fd07a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="sd-area" d="M2 40 C20 38 26 14 44 12 C62 10 70 26 86 30 C102 34 112 24 128 22 L128 46 L2 46 Z" fill="url(#sdFill)" />
          <path className="sd-line" d="M2 40 C20 38 26 14 44 12 C62 10 70 26 86 30 C102 34 112 24 128 22" />
          <path className="sd-pulse" d="M2 40 C20 38 26 14 44 12 C62 10 70 26 86 30 C102 34 112 24 128 22" />
        </svg>
        <div className="sd-mode-sub">Energy curve · now → midnight</div>
      </div>

      {/* right rhythm ring */}
      <div className="sd-ring">
        <svg viewBox="0 0 100 100">
          <circle className="sd-track" cx="50" cy="50" r="42" />
          <circle className="sd-arc" cx="50" cy="50" r="42" />
        </svg>
        <div className="sd-ring-core">
          <div className="sd-ring-time">{mm}:{ss}</div>
          <div className="sd-ring-lbl">in flow</div>
        </div>
      </div>

      {/* floating glass chips */}
      <div className="sd-chip sd-chip-1"><b>+90 min</b><span>ultradian peak</span></div>
      <div className="sd-chip sd-chip-2"><b>HRV ▲</b><span>recovered</span></div>
    </div>
  );
}

window.SandCover = SandCover;

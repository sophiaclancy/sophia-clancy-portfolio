// flipcover.jsx — Notability project cover: animated wordmark, UI peek on hover

function FlipCover() {
  const { useState, useEffect } = React;
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const full = "Want me to quiz you on this section?";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setMsg(full); return; }
    (async () => {
      while (alive) {
        for (let i = 0; i <= full.length; i++) { if (!alive) return; setMsg(full.slice(0, i)); await sleep(46); }
        await sleep(2400);
        for (let i = full.length; i >= 0; i--) { if (!alive) return; setMsg(full.slice(0, i)); await sleep(20); }
        await sleep(500);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="flip-cover">
      {/* default — animated Notability wordmark */}
      <div className="cover-front">
        <div className="e-bg">
          <div className="e-squig orbit-squig e-s1" style={{ "--d": "6.5s" }}>
            <svg width="56" height="34" viewBox="0 0 56 34"><path d="M3 17c6-14 12 14 18 0s12 14 18 0 12 14 14 8" /></svg>
          </div>
          <div className="e-squig orbit-squig e-s2 fill" style={{ "--d": "5.5s" }}>
            <svg width="30" height="30" viewBox="0 0 30 30"><polygon points="15,2 18,11 28,11 20,17 23,27 15,21 7,27 10,17 2,11 12,11" /></svg>
          </div>
          <div className="e-squig orbit-squig e-s3" style={{ "--d": "7.5s" }}>
            <svg width="46" height="46" viewBox="0 0 46 46"><circle cx="23" cy="23" r="19" /></svg>
          </div>
          <div className="e-squig orbit-squig e-s4" style={{ "--d": "6.8s" }}>
            <svg width="60" height="30" viewBox="0 0 60 30"><path d="M3 27C3 6 19 6 19 15s16 9 16-6 22-3 22 9" /></svg>
          </div>
          <div className="e-squig orbit-squig e-s5 fill" style={{ "--d": "5.8s" }}>
            <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="7" /></svg>
          </div>
          <div className="e-squig orbit-squig e-s6" style={{ "--d": "7.2s" }}>
            <svg width="40" height="40" viewBox="0 0 40 40"><path d="M6 34L20 6l14 28" /></svg>
          </div>
          <div className="nb-lockup">
            <span className="nb-word"><span className="nb-inner">Notability</span></span>
            <svg className="nb-pencil" viewBox="0 0 24 24" fill="none">
              <path d="M4 20l3.5-1 11-11-2.5-2.5-11 11L4 20z" fill="#d98a4e" stroke="#f3eee2" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M15 6.5L17.5 9" stroke="#f3eee2" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>

      {/* hover — UI peek with AI tutor typing */}
      <div className="cover-ui">
        <div className="a-bg"></div>
        <div className="a-note">
          <div className="dotrow"><i></i><i></i><i></i></div>
          <div className="a-line" style={{ width: "92%" }}></div>
          <div className="a-line hl" style={{ width: "70%" }}></div>
          <div className="a-line" style={{ width: "84%" }}></div>
          <div className="a-line" style={{ width: "60%" }}></div>
          <div className="a-line" style={{ width: "78%" }}></div>
        </div>
        <div className="a-chat">
          <div className="who">AI Tutor</div>
          <div className="msg"><span>{msg}</span><span className="cursor"></span></div>
        </div>
      </div>
    </div>
  );
}

window.FlipCover = FlipCover;

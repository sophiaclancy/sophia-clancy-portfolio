// casestudy-v13.jsx — windowed case study shell; card view + expanded (full) view
const { useState, useEffect, useRef, useCallback } = React;

const LOGOS = { p1: "assets/logo-notability.png", p2: "assets/logo-partake.png" };

function getProject() {
  const id = new URLSearchParams(location.search).get("p");
  const list = window.PROJECTS || [];
  return list.find((p) => p.id === id) || list[0];
}
function heroOf(p) {
  if (p.hero) return { src: p.hero, bg: p.heroBg };
  const b = (p.blocks || []).find((x) => x.t === "img" && x.src);
  return b ? { src: b.src, bg: b.bg } : null;
}
function Cover({ p }) {
  const h = heroOf(p);
  if (p.id === "asus" && window.AsusCover) return <div className="cs-hero is-cover"><window.AsusCover /></div>;
  if (p.id === "p3" && window.SandAnimCover) return <div className="cs-hero is-cover"><window.SandAnimCover /></div>;
  if (h) return <div className="cs-hero" style={h.bg ? { background: h.bg } : null}><img src={h.src} alt="" /></div>;
  if (p.id === "p1" && window.FlipCover) return <div className="cs-hero is-cover"><window.FlipCover /></div>;
  if (p.id === "p7") return <div className="cs-hero"><img src="assets/thumbs/contexto.png" alt="" /></div>;
  return (
    <div className="cs-hero is-plate" style={{ background: p.tint }}>
      <span style={{ color: p.color }}>{p.title}</span>
    </div>
  );
}
function Mark({ p }) {
  const src = LOGOS[p.id];
  return (
    <span className="cs-mark" style={{ background: src ? "#fff" : "var(--lime)", borderColor: src ? "var(--line)" : "transparent" }}>
      {src ? <img src={src} alt="" /> : <b style={{ color: "var(--ink)" }}>{p.title.slice(0, 1)}</b>}
    </span>
  );
}

const META = (p) => [
  { k: "Timeline", v: p.timeline },
  { k: "Role", v: p.role },
  { k: "Team", v: p.team },
  { k: "Methods", v: p.methods },
  { k: "Skills", v: (p.skills || []).join(", ") },
].filter((m) => m.v);

function Page() {
  const p = getProject();
  const heads = (p.blocks || []).filter((b) => b.t === "head");
  const [full, setFull] = useState(new URLSearchParams(location.search).get("v") !== "card");
  const [active, setActive] = useState(heads.length ? heads[0].id : null);
  const scroller = useRef(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el || !heads.length) return;
    const onScroll = () => {
      let cur = heads[0].id;
      const top = el.getBoundingClientRect().top + 150;
      for (const h of heads) {
        const n = document.getElementById(h.id);
        if (n && n.getBoundingClientRect().top - top <= 0) cur = h.id;
      }
      if (el.scrollTop > 40 && el.scrollTop + el.clientHeight >= el.scrollHeight - 6) cur = heads[heads.length - 1].id;
      setActive(cur);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const t = setTimeout(onScroll, 400);
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", onScroll); clearTimeout(t); ro.disconnect(); };
  }, [full]);

  const go = useCallback((id) => {
    const el = scroller.current, n = document.getElementById(id);
    if (el && n) el.scrollTo({ top: n.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 28, behavior: "smooth" });
  }, []);

  const blocks = (p.blocks || []).map((b, i) => <window.CaseBlock b={b} accent={p.color} key={i} />);
  const close = () => { location.href = "./#work"; };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { if (full) setFull(false); else close(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);

  return (
    <div className="page v12 cs-page">
      {window.CustomCursor ? <window.CustomCursor /> : null}
      <div className="cs-backdrop" aria-hidden="true" onClick={close}>
        <iframe src="./" title="" tabIndex="-1" scrolling="no" loading="lazy"></iframe>
        <div className="cs-scrim"></div>
      </div>
      <header className="v12-top">
        <div className="wrap top-inner">
          <a className="mark" href="./" aria-label="Sophia — home"><img src="assets/logo-mark.png" alt="" /></a>
          <nav className="v12-nav">
            <a href="./#work">work</a>
            <a href="About.html">about</a>
            <a href="https://drive.google.com/file/d/1oPp-S96QerNcEBSoBz0-ZevHmxsRBRNT/view?usp=sharing" target="_blank" rel="noopener">resume</a>
          </nav>
        </div>
      </header>

      <div className={"cs-stage" + (full ? " is-full" : "")} onClick={(e) => { if (e.target === e.currentTarget && !full) close(); }}>
        <div className="cs-window">
          <div className="cs-bar">
            <a className="cs-btn" href="./#work" aria-label="Back to work" title="Back to work">
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 9.2 10 3.8l6.5 5.4V16a.8.8 0 0 1-.8.8h-3.4v-4.5H7.7v4.5H4.3a.8.8 0 0 1-.8-.8z" /></svg>
            </a>
            <span className="cs-bar-name">{p.kicker || <React.Fragment>{p.title} <i>·</i> {p.discipline} {p.year}</React.Fragment>}</span>
            <button className="cs-btn" onClick={() => setFull(!full)} aria-label={full ? "Exit full screen" : "Full screen"} title={full ? "Exit full screen" : "Full screen"}>
              {full
                ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 8.6h4.6V4M16 11.4h-4.6V16" /><path d="M8.6 8.6 3.6 3.6M11.4 11.4l5 5" /></svg>
                : <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.2 3.6H16.4V7.8M7.8 16.4H3.6v-4.2" /><path d="M16.4 3.6l-5.6 5.6M3.6 16.4l5.6-5.6" /></svg>}
            </button>
          </div>

          <div className="cs-scroll" ref={scroller}>
            {full ? (
              <div className="cs-full">
                <aside className="cs-toc">
                  <a className="cs-back" href="./#work">&larr; Back</a>
                  <nav>
                    {heads.map((h) => (
                      <button key={h.id} className={"cs-toc-link" + (active === h.id ? " is-active" : "")} onClick={() => go(h.id)}>{h.nav || h.eyebrow}</button>
                    ))}
                  </nav>
                </aside>
                <article className="cs-doc">
                  <p className="cs-kicker">{p.kicker || <React.Fragment>{p.title} &nbsp;·&nbsp; {p.discipline} {p.year}</React.Fragment>}</p>
                  <h1 className="cs-headline">{p.headline || p.subtitle}</h1>
                  <Cover p={p} />
                  <div className="cs-meta is-row">
                    {META(p).map((m) => (
                      <div key={m.k}><span className="cs-meta-k">{m.k}</span><span className="cs-meta-v">{m.v}</span></div>
                    ))}
                  </div>
                  <div className="case-blocks cs-blocks">{blocks}</div>
                </article>
              </div>
            ) : (
              <div className="cs-card">
                <div className="cs-intro">
                  <div className="cs-intro-l">
                    <Mark p={p} />
                    <h1 className="cs-name">{p.title}</h1>
                    <p className="cs-lead">{p.summary}</p>
                    <div className="cs-meta">
                      {META(p).map((m) => (
                        <div key={m.k}><span className="cs-meta-k">{m.k}</span><span className="cs-meta-v">{m.v}</span></div>
                      ))}
                    </div>
                  </div>
                  <div className="cs-intro-r"><Cover p={p} /></div>
                </div>
                <hr className="cs-rule" />
                <div className="case-blocks cs-blocks">{blocks}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Root() {
  const p = getProject();
  if (window.CaseStudy15 && window.CASE15 && window.CASE15[p.id]) return <window.CaseStudy15 p={p} />;
  return <Page />;
}
ReactDOM.createRoot(document.getElementById("root")).render(<Root />);

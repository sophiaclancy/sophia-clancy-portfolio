// app.jsx — Sophia portfolio

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#9278fa",
  "heroStyle": "colored",
  "heroFont": "bold",
  "cardLabels": true,
  "density": "regular"
}/*EDITMODE-END*/;

/* ---------- Placeholder color image ---------- */
function ColorPlate({ color, tint, label, ratio, showLabel }) {
  return (
    <div
      className="plate"
      style={{
        background: color,
        aspectRatio: ratio || "16 / 11",
      }}
    >
      <div className="plate-stripes" />
      {showLabel && (
        <div className="plate-label" style={{ color: tint }}>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}

/* ---------- Nav ---------- */
function Nav({ onNav }) {
  return (
    <header className="nav">
      <div className="nav-left">
        <button className="brand" onClick={() => onNav("home")}>SOPHIA CLANCY</button>
      </div>
      <nav className="nav-right">
        <button className="nav-link is-active" onClick={() => onNav("work")}>Work</button>
        <a className="nav-link" href="About.html">About</a>
        <a className="nav-link" href="https://drive.google.com/file/d/1oPp-S96QerNcEBSoBz0-ZevHmxsRBRNT/view?usp=sharing" target="_blank" rel="noopener">Resume</a>
      </nav>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero({ colored, font }) {
  const on = colored ? " is-on" : "";
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1 className={"hero-head is-" + font}>
          Hi, I&rsquo;m Sophia &mdash; a product designer exploring <span className={"role role-designer" + on}>human behavior</span> and building <span className={"role role-developer" + on}>thoughtful products</span> around it.
        </h1>
        <p className="hero-current">
          Currently designing at <a href="https://www.behance.net/berkeleyinnovation" target="_blank" rel="noopener">Berkeley Innovation</a>
        </p>
      </div>
    </section>
  );
}

/* ---------- Project card ---------- */
function ProjectCard({ p, showLabel }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      className={"card" + (hover ? " is-hover" : "")}
      href={"CaseStudy.html?p=" + p.id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {p.id === "p1" && window.FlipCover
        ? <window.FlipCover />
        : p.id === "p7"
        ? <div className="proto-shot"><img src="assets/thumbs/contexto.png" alt="Contexto prototype" loading="lazy" /></div>
        : p.id === "p2" && window.PartakeCover
        ? <window.PartakeCover />
        : p.id === "p3" && window.SandCover
        ? <window.SandCover />
        : <ColorPlate color={p.color} tint={p.tint} label="project shot" showLabel={showLabel} />}
      <div className="card-meta">
        <div className={"card-rule" + (hover ? " is-hover" : "")}></div>
        <div className="card-headrow">
          <h3 className="card-title">{p.cardTitle || p.headline}</h3>
          <span className="card-eyebrow">{p.discipline} · {p.year}</span>
        </div>
      </div>
    </a>
  );
}

/* ---------- Work grid ---------- */
function Work({ showLabel }) {
  return (
    <section className="work" id="work">
      <div className="grid">
        {window.PROJECTS.map((p) => (
          <ProjectCard key={p.id} p={p} showLabel={showLabel} />
        ))}
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <div className="foot">
      <span>© 2026 Sophia</span>
      <span>Designed &amp; built from scratch</span>
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const rootRef = useRef(null);

  const onNav = (id) => {
    if (id === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={rootRef} className={"page density-" + t.density} style={{ "--accent": t.accent }}>
      <Nav onNav={onNav} />
      <main className="shell">
        <Hero colored={t.heroStyle === "colored"} font={t.heroFont} />
        <Work showLabel={t.cardLabels} />
        <Footer />
      </main>

      <TweaksPanel>
        <TweakSection label="Hero" />
        <TweakRadio
          label="Headline font"
          value={t.heroFont}
          options={["bold", "editorial"]}
          onChange={(v) => setTweak("heroFont", v)}
        />
        <TweakRadio
          label="Accent words"
          value={t.heroStyle}
          options={["colored", "plain"]}
          onChange={(v) => setTweak("heroStyle", v)}
        />
        <TweakSection label="Work grid" />
        <TweakToggle
          label="Image labels"
          value={t.cardLabels}
          onChange={(v) => setTweak("cardLabels", v)}
        />
        <TweakRadio
          label="Density"
          value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakSection label="Theme" />
        <TweakColor
          label="Accent"
          value={t.accent}
          options={["#9278fa", "#007aff", "#00800a", "#1a1a1a"]}
          onChange={(v) => setTweak("accent", v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

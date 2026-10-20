// about-v2.jsx — About page content, rendered inside the sidebar shell from app-v13
// Photos: drop files into assets/about/ using the filenames below. Missing files show a labeled placeholder.
(function () {
  const COMMUNITIES = [
    {
      id: "bi", logo: "assets/logo-bi.png", fill: true, name: "Berkeley Innovation",
      text: "I’m a Project Lead, leading a design team on client projects with Notability and Partake Foods.",
      photos: [
        { src: "assets/about/bi-1.jpg", cap: "Add a caption" },
        { src: "assets/about/bi-2.jpg", cap: "Add a caption" },
        { src: "assets/about/bi-3.jpg", cap: "Add a caption" },
        { src: "assets/about/bi-4.jpg", cap: "Add a caption" },
      ],
    },
    {
      id: "mdb", logo: "assets/logo-mdb.png", bg: "#DCEBFA", name: "Mobile Developers of Berkeley",
      text: "VP Marketing. The mobile development club where I started on frontend tasks and found my way into design.",
      photos: [
        { src: "assets/about/mdb-1.jpg", cap: "Add a caption" },
        { src: "assets/about/mdb-2.jpg", cap: "Add a caption" },
        { src: "assets/about/mdb-3.jpg", cap: "Add a caption" },
        { src: "assets/about/mdb-4.jpg", cap: "Add a caption" },
      ],
    },
    {
      id: "partiful", logo: "assets/logo-partiful.png", fill: true, name: "Partiful",
      text: "Growth Ambassador. Helping more people find reasons to get together.",
      photos: [
        { src: "assets/about/partiful-1.jpg", cap: "Add a caption" },
        { src: "assets/about/partiful-2.jpg", cap: "Add a caption" },
        { src: "assets/about/partiful-3.jpg", cap: "Add a caption" },
        { src: "assets/about/partiful-4.jpg", cap: "Add a caption" },
      ],
    },
  ];

  // clancystuff: lore + pictures. href is optional (shows an ↗ when set).
  const LORE = [
    { src: "assets/about/lore-1.jpg", title: "Lore title", year: "2026", sub: "" },
    { src: "assets/about/lore-2.jpg", title: "Lore title", year: "2025", sub: "" },
    { src: "assets/about/lore-3.jpg", title: "Lore title", year: "2025", sub: "" },
    { src: "assets/about/lore-4.jpg", title: "Lore title", year: "2024", sub: "" },
    { src: "assets/about/lore-5.jpg", title: "Lore title", year: "2023", sub: "" },
    { src: "assets/about/lore-6.jpg", title: "Lore title", year: "est. 20XX", sub: "" },
  ];

  const INTERESTS = [
    { e: "🏓", t: "Pickleball", s: "Always down for a game" },
    { e: "💃", t: "Brazilian zouk", s: "Partner dancing, lots of spinning" },
    { e: "🎤", t: "Concerts", s: "Front row if I can help it" },
    { e: "🥾", t: "Hiking", s: "Bay Area trails" },
    { e: "🎨", t: "Painting", s: "Making things with my hands" },
    { e: "🍜", t: "Trying new food", s: "Always looking for the next spot" },
    { e: "🎛️", t: "Music production", s: "Learning next" },
    { e: "💡", t: "Venue + lighting", s: "Learning next" },
    { e: "🍽️", t: "Fine-dining cooking", s: "Learning next" },
  ];

  const ROT = [-2.2, 1.4, -0.6, 2];
  const LIFT = [0, 26, 12, 4];

  function Photo({ src, className }) {
    const [bad, setBad] = React.useState(false);
    if (!src || bad) {
      return <div className={"abt-ph " + (className || "")}><span>{src ? src.split("/").pop() : "photo"}</span></div>;
    }
    return <img className={className} src={src} alt="" loading="lazy" onError={() => setBad(true)} />;
  }

  function Rotator() {
    const [i, setI] = React.useState(0);
    React.useEffect(() => {
      if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const t = setInterval(() => setI((n) => (n + 1) % INTERESTS.length), 2200);
      return () => clearInterval(t);
    }, []);
    const it = INTERESTS[i];
    return (
      <p className="abt-rot" aria-live="polite">
        Currently into <span className="abt-rot-w" key={i}><span aria-hidden="true">{it.e}</span> {it.t.toLowerCase()}</span>
      </p>
    );
  }

  function AboutMain() {
    return (
      <div className="abt">
        <section className="abt-intro" id="hi">
          <div>
            <h1 className="abx-hi">Hi, I&rsquo;m Sophia!</h1>
            <div className="abt-meta">
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>Berkeley, CA</span>
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/></svg>Cognitive Science &amp; Data Science, UC Berkeley</span>
            </div>
            <p className="abt-p">I&rsquo;m a product designer and builder who found design through frontend work at a mobile dev club. I&rsquo;m endlessly curious about why people do what they do, and I like designing for the people the default experience leaves out.</p>
            <p className="abt-tiger"><em>I&rsquo;ve got the eye of the tiger.</em> The white tiger is my spirit animal (hence the tiger references all over this site). I love what it stands for: focus, independence, and fierce determination, and that&rsquo;s the energy I try to bring to everything I do.</p>
          </div>
          <figure className="abx-polaroid">
            <span className="abx-photo">
              <img className="abx-base" src="assets/about-default.jpg" alt="Sophia holding a lemon slice" />
              <img className="abx-hover" src="assets/about-hover.jpg" alt="" />
            </span>
            <figcaption>the eye of the tiger</figcaption>
          </figure>
        </section>

        <section className="abt-sec" id="communities">
          <h2 className="abt-h">My Communities</h2>
          <p className="abt-sub">The people who make it all worth it <span aria-hidden="true">&hearts;</span></p>
          {COMMUNITIES.map((c) => (
            <article className="abt-comm" key={c.id}>
              <div className="abt-comm-head">
                <div className="abt-comm-id">
                  <span className="abt-logo" style={c.bg ? { background: c.bg } : null}>
                    <img src={c.logo} alt="" className={c.fill ? "is-fill" : undefined} />
                  </span>
                  <h3>{c.name}</h3>
                </div>
                <p>{c.text}</p>
              </div>
              <div className="abt-strip">
                {c.photos.map((p, i) => (
                  <figure className="abt-pol" key={i} style={{ "--r": ROT[i % 4] + "deg", "--y": LIFT[i % 4] + "px", zIndex: i + 1 }}>
                    <span className="abt-pol-frame"><Photo src={p.src} /></span>
                    {p.cap ? <figcaption>{p.cap}</figcaption> : null}
                  </figure>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="abt-sec" id="clancystuff">
          <div className="abt-h-row">
            <h2 className="abt-h">clancystuff <span className="abt-spark" aria-hidden="true">&#10023;&#729;&#8902;</span></h2>
            <a className="abt-handle" href="https://x.com/clancystufff" target="_blank" rel="noopener">@clancystufff &#8599;</a>
          </div>
          <p className="abt-sub">Lore, pictures, and fun snippets from past lives</p>
          <div className="abt-lore">
            {LORE.map((l, i) => {
              const body = (
                <React.Fragment>
                  <span className="abt-lore-img"><Photo src={l.src} /></span>
                  <span className="abt-lore-t">
                    <b>{l.title}</b>{l.year ? <span className="abt-dot"> &bull; {l.year}</span> : null}
                    {l.href ? <span className="abt-arr" aria-hidden="true">&#8599;</span> : null}
                  </span>
                  {l.sub ? <span className="abt-lore-s">{l.sub}</span> : null}
                </React.Fragment>
              );
              return l.href
                ? <a className="abt-lore-card" key={i} href={l.href} target="_blank" rel="noopener">{body}</a>
                : <div className="abt-lore-card" key={i}>{body}</div>;
            })}
          </div>
        </section>

        <section className="abt-sec" id="interests">
          <h2 className="abt-h">Interests</h2>
          <Rotator />
          <div className="abt-marq" aria-label="Interests">
            <div className="abt-marq-track">
              {[0, 1].map((k) => INTERESTS.map((it) => (
                <div className="abt-int" key={k + it.t} aria-hidden={k === 1 ? "true" : undefined}>
                  <span className="abt-int-e">{it.e}</span>
                  <b>{it.t}</b>
                  <span>{it.s}</span>
                </div>
              )))}
            </div>
          </div>
        </section>
      </div>
    );
  }
  Object.assign(window, { AboutMain });
})();

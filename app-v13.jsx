// app-v13.jsx — Sophia portfolio, sidebar layout

const WORK_LEFT = [
  { id: "asus", title: "ASUS ProArt", desc: "AI autonomy in creative workflows. Leading research on what creators are comfortable delegating to agents.", tags: ["Product Management", "In Progress"], href: "CaseStudy.html?p=asus", tint: "var(--bg-card)" },
  { id: "p7", title: "Contexto", desc: "Finder concept that organizes files into Workspaces by project. 12-week research and design project.", tags: ["UX Research", "Concept"], href: "CaseStudy.html?p=p7", tint: "var(--bg-card)", bleed: true },
];

const WORK_RIGHT = [
  { id: "p1", title: "Notability", desc: "A personalized, accessible AI study experience for Notability Learn.", tags: ["Product Design", "Shipped"], href: "CaseStudy.html?p=p1", tint: "var(--bg-card)" },
  { id: "p2", title: "Partake", desc: "TikTok content strategy for an allergen-free snack brand. 10-week research project.", tags: ["Content Strategy", "TikTok"], href: "CaseStudy.html?p=p2", tint: "var(--bg-card)" },
];

const TIMELINE = [
  { id: "bilead", logo: "assets/logo-bi.png", fill: true, org: "Berkeley Innovation", role: "Project Lead", tag: "leadership + community", pos: [50, 44], r: 104, hub: true },
  { id: "bi", logo: "assets/logo-notability.png", fill: true, org: "Notability", role: "Product Designer", tag: "ux research + prototype", pos: [72, 12], r: 74 },
  { id: "bimkt", logo: "assets/logo-partake.png", fill: true, org: "Partake Foods", role: "Marketing Strategist", tag: "content + strategy", pos: [64, 84], r: 74 },
  { id: "jacobs", logo: "assets/logo-jacobs.png", org: "Jacobs Institute", role: "Figma Course Instructor", tag: "education", pos: [24, 78], r: 64 },
  { id: "mdb", logo: "assets/logo-mdb.png", bg: "#DCEBFA", org: "Mobile Developers of Berkeley", role: "VP Marketing", tag: "leadership + community", pos: [10, 5], r: 76 },
  { id: "circuit", bg: "#FDF6D3", logo: "assets/logo-circuit.png", org: "Circuit Speed Dating", role: "Full-stack Engineer", tag: "web development", pos: [10, 68], r: 64 },
  { id: "partiful", logo: "assets/logo-partiful.png", fill: true, org: "Partiful", role: "Growth Ambassador", tag: "growth", pos: [90, 60], r: 68 },
];
const BY_ID = Object.fromEntries(TIMELINE.map((e) => [e.id, e]));

/* hub and spoke: Berkeley Innovation at the center, MDB -> Circuit on its own */
const EDGES = [
  ["mdb", "circuit", {}],
  ["bilead", "bi", {}],
  ["bilead", "bimkt", {}],
  ["bilead", "jacobs", {}],
];

const STATUS_PHRASES = [
  "leading a design team @ Berkeley Innovation",
  "teaching design @ Figma Decal",
  "looking to bring a creative lens to technical spaces",
];
const STATUS_COLORS = ["#2c9169", "#2c9169", "#2c9169"];
const STATUS_LONGEST = "looking to bring a creative lens to technical spaces";

function HeroName() {
  return (
    <React.Fragment>
      <h1 className="hero-head sb-name">Sophia Clancy</h1>
      <p className="sb-sub">CogSci &amp; Data Science @ UC Berkeley</p>
    </React.Fragment>
  );
}

function HeroRole() {
  return (
    <div className="hero-roleset">
      <p className="hero-role">a <i className="hl hl-pink" data-text="technical">technical</i> product designer with a background in <i className="hl hl-orange" data-text="mobile development">mobile development</i>.</p>
    </div>
  );
}

function HeroSparkles() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const hero = host.parentElement;
    let last = 0;
    const onMove = (ev) => {
      const now = performance.now();
      if (now - last < 55) return;
      last = now;
      const r = host.getBoundingClientRect();
      const n = 1;
      for (let k = 0; k < n; k++) {
        const s = document.createElement("span");
        const roll = Math.random();
        const kind = roll < 0.55 ? "aster" : "dot";
        s.className = "spark is-" + kind;
        if (kind === "aster") s.textContent = "*";
        const size = kind === "dot" ? 3 + Math.random() * 5 : 10 + Math.random() * 14;
        s.style.left = (ev.clientX - r.left + (Math.random() * 22 - 11)) + "px";
        s.style.top = (ev.clientY - r.top + (Math.random() * 22 - 11)) + "px";
        s.style.color = STATUS_COLORS[(Math.random() * STATUS_COLORS.length) | 0];
        s.style.setProperty("--o", (0.2 + Math.random() * 0.55).toFixed(2));
        s.style.setProperty("--r", ((Math.random() * 140 - 70) | 0) + "deg");
        if (kind === "aster") s.style.fontSize = size + "px";
        else { s.style.width = size + "px"; s.style.height = size + "px"; }
        host.appendChild(s);
        setTimeout(() => s.remove(), 1100);
      }
    };
    hero.addEventListener("pointermove", onMove);
    return () => hero.removeEventListener("pointermove", onMove);
  }, []);
  return <div className="hero-spark" ref={ref} aria-hidden="true"></div>;
}

const TIGER_ASCII = {
  walk: `   .,+%S@S+,
 ..:*S@@@S+,
.,+%@@@#%+,.
,;S@@@S+,,.
;%@@@@+,.
*@@@@%:.
*@@@#%,.                                         .....
;%@@@@+,.                    . ...          .....,:;:,,...
,+S#@#S*:... .....  .....,,,,,,,,,.........,,,:;+?S@S%?+;:..
.,+S@@@@S*;::,,,,,,,:;;+**??%%??**+++;;;;++*?S####@@@@@@@%+,.
 .,:?@@@@##S%%????%%S#@@@@@@@@###@@@@@@#@@@@@@@@#@@@@@#@@#@*,..
   .,;*%##@@@@@@@@@@@@@@@@@@@@#@@@@#@@@@@@@@@#@@#@@@@@@@@@@@*,
    ...,:+*??%S##@@#@@@@#@@@@@@@@@@#@@@@@@@@@@@@@@@#@@@@@@@@*,.
        ....,,+@@#@@@@##@@@@@@@#@@@@@@@@@#@@@@#@@@@@#@@@##S*:.
          . .,+#@##@@@@@@@@#@@@#@@@@@@@@@@@@@#@#@@@@%+;++;:,..
        ....,+#@@#@@@@@@@@@#@@#@@@@@@@@@@@#@@#@@#@@%:......
        .:;+%#@@@@#@@@@#@@@@@@@#@@@@#@@@@@@#@#@#@@@+,   .
      .,+%##@@@@@@@@@#@@@@@@#@#%+**%%SS#@@@@@@@@@@#*,.
     .,+#@@#@@@@@##@#@@#@@@#@#*:..,,,:+%@@@@@#@@@@#@+,.        .
    .,+@@@##@S?**+;;+S#@@@#@S+,. . ..,+S@@@@@@@@@@@@#+,..   ...,
   .,+#@@##@*:,.....,;S@@@@@S*:,.  .,*#@@@#@?;;?#@@@@#*:..  ..,,
   .,?#@@@@%,..      ,;%@@@@@S%+,. .;%@@@@%+:..,+S@@@@#%+,.  ..,
    ,*#@@@#+,        ..:*S@@##@?,. .,+??*;:..  .,;%@@@@@%:.    .
   ..;?SSS*:.          .,+?SSSS*,.  .,,,,...    ..;?S@@#%:.`,
  crouch: `   .,+?#@@?,.
 ..:*S@@@@?,.
.,;S@@@@#?;,.
.;S@@@@?;,...
;%@@@@?:...
*##@@#;.
*@@@##;.
;S@@@@*,.
,*@#@@#+,...
.:?@@@@#*:,..
 .,*#@@@@S*;:,,............ .
 ..,+%@@@@@#S?*+;:::::;;::,,,....
    .,+?S@@@#@##@S#S##@@S#S%?+;,...              .....
    ...,:+*%@@@@@@@@@@@@@@@#@@@%*:,....  .  ....,:++;:,,...
        ..,:*@@@@@@@@@@@@@@@#@@###?+;:,,,,,,::;;*S##@S?*+:..
          .,+@@@@@@##@@@@@#@@@@@@@#@@S%??%%%S#@#@@@###@@@S+,..
           ,*@@@@@#@@@@@@@@#@@@@@@@#@@@@@@@#@@@@@@@@@@@@@@@?,.
        ...:?@@@@@#@@@@@@@@@@@@@#@#@@@@#@@#@@@@@@@@@@@@@@@@@+..
       .,:+?@@@@@@@@@@#@##@@#@@@@@#@@@@@#@#@@@@@#@@#@@@@@@@@*,
       .;S@@#@@@@@@@@@@@@@#@@@@@@@@@@@@#@#@@#@@@##@@@@#@@@S?:.
      .:%#@@@@@@##@@#@@#@@@@@@@@@@@@@@#@@@@#@#@@@@@%*++**+:,....
      .;@@@@#@@%%S@@@@@@@@@@@@@#@@@@@@@#@@@@@@@@@@#%*+:,,....,,,
      .;#@@##@S+::*@@@@@##S?*?%#@#@@@@@##@@@@@@@@@@@@S+,....,;;;
      .,?#@@@@S;..,+S@@@@@S+:,::;;++*?S@@#@@@@@@@@@@@@*,. ..,:;;
       .;%@@@@%:...,+%#@#@%;........,:+?SSS##SSS#@#@@%+,  ..,,::`,
};

window.TIGER_ASCII = TIGER_ASCII;

function HeroTiger() {
  return (
    <div className="hero-tiger" aria-hidden="true">
      <pre className="tg tg-a">{TIGER_ASCII.walk}</pre>
      <pre className="tg tg-b">{TIGER_ASCII.crouch}</pre>
      <span className="tg-dots"></span>
    </div>
  );
}


function StatusLine() {
  const reduced = typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  const [idx, setIdx] = React.useState(0);
  const [n, setN] = React.useState(reduced ? STATUS_PHRASES[0].length : 0);
  const [del, setDel] = React.useState(false);
  React.useEffect(() => {
    if (reduced) return;
    const full = STATUS_PHRASES[idx];
    let t;
    if (!del && n < full.length) t = setTimeout(() => setN(n + 1), 38 + Math.random() * 40);
    else if (!del) t = setTimeout(() => setDel(true), 2200);
    else if (n > 0) t = setTimeout(() => setN(n - 1), 18);
    else t = setTimeout(() => { setDel(false); setIdx((i) => (i + 1) % STATUS_PHRASES.length); }, 320);
    return () => clearTimeout(t);
  }, [n, del, idx, reduced]);
  const full = STATUS_PHRASES[idx];
  return (
    <div className="hero-status">
      <span className="status-star" aria-hidden="true">*</span>
      <span className="status-text">
        <span className="sr-only">Currently {full}</span>
        <span className="status-type" aria-hidden="true"><mark className="status-hl"><i className="status-cur">Currently</i>{" " + full.slice(0, n)}</mark><span className="status-caret"></span></span>
      </span>
    </div>
  );
}

function Timeline() {
  const netRef = React.useRef(null);
  const [size, setSize] = React.useState({ w: 0 });
  const [caps, setCaps] = React.useState({});
  const capsKey = React.useRef("");
  const [hot, setHot] = React.useState(null);
  React.useEffect(() => {
    const el = netRef.current;
    if (!el) return;
    const wires = el.querySelector(".xp-wires");
    const measure = () => {
      setSize({ w: wires.clientWidth, h: wires.clientHeight });
      const m = {};
      el.querySelectorAll(".xp-item").forEach((li) => {
        const logo = li.querySelector(".xp-logo"), cap = li.querySelector(".xp-cap");
        if (!logo || !cap || !li.dataset.id) return;
        const lr = logo.getBoundingClientRect(), cr = cap.getBoundingClientRect();
        m[li.dataset.id] = cr.bottom - (lr.top + lr.height / 2) + 12;
      });
      const key = JSON.stringify(m);
      if (key !== capsKey.current) { capsKey.current = key; setCaps(m); }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const linked = React.useMemo(() => {
    if (!hot) return null;
    const s = new Set([hot]);
    EDGES.forEach(([a, b]) => { if (a === hot) s.add(b); if (b === hot) s.add(a); });
    return s;
  }, [hot]);

  /* trim each wire at the edge of the node's caption box so it never crosses text */
  const exit = (node, cx, cy, dx, dy) => {
    const half = node.r / 2;
    const box = { x: 58, up: half + 12, down: Math.max(caps[node.id] || 0, half + 80) };
    if (!dx && !dy) return [cx, cy];
    const tx = dx ? box.x / Math.abs(dx) : Infinity;
    const ty = dy ? (dy < 0 ? box.up : box.down) / Math.abs(dy) : Infinity;
    const t = Math.min(tx, ty, 1);
    return [cx + dx * t, cy + dy * t];
  };

  const wires = size.w ? EDGES.map(([a, b, o], i) => {
    const A = BY_ID[a], B = BY_ID[b];
    const ax = A.pos[0] / 100 * size.w, ay = A.pos[1] / 100 * size.h;
    const bx = B.pos[0] / 100 * size.w, by = B.pos[1] / 100 * size.h;
    const [x1, y1] = exit(A, ax, ay, bx - ax, by - ay);
    const [x2, y2] = exit(B, bx, by, ax - bx, ay - by);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    if (len < 24) return null;
    const bow = o.bow || 0;
    const qx = mx + (-(y2 - y1) / len) * bow, qy = my + ((x2 - x1) / len) * bow;
    const d = bow ? `M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}` : `M ${x1} ${y1} L ${x2} ${y2}`;
    const on = !hot || hot === a || hot === b;
    return (
      <g key={i} className={"xp-wire" + (on ? " is-on" : "")}>
        <path d={d} fill="none" stroke="currentColor" strokeWidth={o.dash ? .9 : 1}
          strokeDasharray={o.dash ? "2.5 6" : undefined} />
        <circle cx={x1} cy={y1} r="2.2" /><circle cx={x2} cy={y2} r="2.2" />
      </g>
    );
  }) : null;

  return (
    <div className="xp">
      <div className="xp-intro">
        <span className="xp-label">My experience</span>
        <p className="xp-lede">A constellation of the places that shaped how I build, design, and lead.</p>
      </div>
      <div className={"xp-net" + (hot ? " is-hot" : "")} ref={netRef}>
        <svg className="xp-decor" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <pattern id="xpdots" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="0.4" cy="0.4" r="0.28" fill="currentColor" />
            </pattern>
          </defs>
          <rect x="66" y="80" width="30" height="16" fill="url(#xpdots)" opacity=".55" />
          <rect x="26" y="4" width="22" height="12" fill="url(#xpdots)" opacity=".4" />
        </svg>
        <div className="xp-marks" aria-hidden="true">
          <span className="xp-cross" style={{ left: "35%", top: "24%" }} />
          <span className="xp-cross" style={{ left: "68%", top: "48%" }} />
          <span className="xp-cross" style={{ left: "5%", top: "94%" }} />
          <span className="xp-sq" style={{ left: "97%", top: "18%" }} />
          <span className="xp-sq" style={{ left: "44%", top: "97%" }} />
        </div>
        <svg className="xp-wires" aria-hidden="true">{wires}</svg>
        <ul className="xp-nodes">
          {TIMELINE.map((e) => {
            const state = !linked ? "" : linked.has(e.id) ? (hot === e.id ? " is-hot" : " is-near") : " is-dim";
            return (
              <li key={e.id} data-id={e.id} className={"xp-item" + state + (e.hub ? " is-hub" : "")}
                  style={{ left: e.pos[0] + "%", top: e.pos[1] + "%", "--r": e.r + "px" }}
                  onMouseEnter={() => setHot(e.id)} onMouseLeave={() => setHot(null)}>
                <span className={"xp-logo" + (e.fill ? " is-fill" : "")} style={e.bg ? { background: e.bg } : undefined}>{e.logo ? <img src={e.logo} alt="" /> : <image-slot id={"xp-" + e.id} shape="circle" placeholder="logo"></image-slot>}</span>
                <span className="xp-cap">
                  <span className="xp-org">{e.org}</span>
                  <span className="xp-titles">
                    {e.role ? <span className="xp-role">{e.role}</span> : null}
                    <span className="xp-tag">{e.tag}</span>
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="sec-label">
      <span>{children}</span>
      <hr className="bleed-rule" />
    </div>
  );
}

const PLAY_ITEMS = [
  { k: "eat", t: "Cheese Board Collective", s: "9.4", d: "sourdough + garlic cheese, split on the curb" },
  { k: "song", t: "Espresso Machine", a: "Tennis", d: "on repeat all week" },
  { k: "eat", t: "Kasa Indian Eatery", s: "8.7", d: "kathi roll, extra chutney" },
  { k: "song", t: "Blue Nights", a: "Sam Gellaitry", d: "walking to class" },
  { k: "eat", t: "Gypsy's Trattoria", s: "8.1", d: "late-night pesto, no regrets" },
  { k: "song", t: "Sunny Side", a: "TOPS", d: "zouk practice warmup" },
];
const PLAY_LINKS = { eat: "https://beliapp.com", song: "https://open.spotify.com" };

function Playground() {
  const [open, setOpen] = React.useState(null);
  const n = PLAY_ITEMS.length;
  return (
    <div className={"pg" + (open !== null ? " is-open" : "")}>
      <div className="pg-hub">
        <span className="pg-hub-l">now</span>
        <span className="pg-hub-s">eating + listening</span>
      </div>
      <div className="pg-ring">
        {PLAY_ITEMS.map((it, i) => (
          <button key={i} type="button" className={"pg-slot" + (open === i ? " is-sel" : "")}
                  style={{ "--a": (i * 360 / n) + "deg" }}
                  onClick={() => setOpen(open === i ? null : i)}>
            <span className="pg-card">
              <span className="pg-k">{it.k === "eat" ? "receipt" : "track"}</span>
              <span className="pg-t">{it.t}</span>
              <span className="pg-d">{it.k === "eat" ? it.s + " / 10" : it.a}</span>
            </span>
          </button>
        ))}
      </div>
      {open !== null ? (
        <div className="pg-pop">
          <span className="pg-pop-k">{PLAY_ITEMS[open].k === "eat" ? "eaten" : "played"}</span>
          <span className="pg-pop-t">{PLAY_ITEMS[open].t}</span>
          <span className="pg-pop-d">{PLAY_ITEMS[open].d}</span>
          <a className="pg-pop-a" href={PLAY_LINKS[PLAY_ITEMS[open].k]} target="_blank" rel="noopener">
            {PLAY_ITEMS[open].k === "eat" ? "see my Beli" : "see what's playing"}
          </a>
        </div>
      ) : null}
    </div>
  );
}

function Cover({ item }) {
  if (item.id === "p1") return (
    <div className="nb-cover">
      <div className="nb-sky"></div>
      <div className="nb-stage">
        <img className="nb-shot" src="assets/thumbs/notability-base-v5.png" alt="" loading="lazy" />
        <div className="nb-hsky" aria-hidden="true"><i></i></div>
        <img className="nb-pill nb-notes" src="assets/thumbs/notability-pill-notes.png" alt="" loading="lazy" style={{ left: "7.60%", top: "14.34%", width: "23.83%" }} />
        <img className="nb-pill nb-tutor" src="assets/thumbs/notability-pill-tutor.png" alt="" loading="lazy" style={{ left: "73.08%", top: "26.00%", width: "20.67%" }} />
        <img className="nb-pill nb-plan" src="assets/thumbs/notability-pill-plan.png" alt="" loading="lazy" style={{ left: "7.10%", top: "70.57%", width: "25.89%" }} />
      </div>
      <div className="nb-grain"></div>
    </div>
  );
  if (item.id === "p2" && window.PartakeCover) return <window.PartakeCover />;
  if (item.id === "p3" && window.SandAnimCover) return <window.SandAnimCover />;
  if (item.id === "p7" && window.ContextoFlowCover) return <window.ContextoFlowCover />;
  if (item.id === "p7") return <img src="assets/thumbs/contexto.png" alt="" loading="lazy" />;
  if (item.id === "asus" && window.AsusCover) return <window.AsusCover />;
  return null;
}

const HAS_ART = ["p1", "p2", "p3", "p7", "asus"];

function Card({ item, lead }) {
  const body = (
    <React.Fragment>
      <div className={"card-plate" + (HAS_ART.includes(item.id) ? "" : " is-empty")} style={{ background: item.tint }}>
        <div className="card-art"><Cover item={item} /></div>
      </div>
      <div className="card-cap">
        <span className="card-title">{item.title}</span>
        {item.tags ? <span className="card-tags">{item.tags.map((t) => <span key={t} className="card-tag">{t}</span>)}</span> : <span className="card-meta">{item.meta}</span>}
      </div>
      {item.desc ? <p className="card-desc">{item.desc}</p> : null}
    </React.Fragment>
  );
  const cls = "wcard" + (lead ? " is-lead" : "");
  const st = item.h ? { "--card-h": item.h + "px" } : undefined;
  return item.href ? <a className={cls} href={item.href} style={st}>{body}</a> : <div className={cls} style={st}>{body}</div>;
}

const SB_NAV = [
  { n: "01", t: "Work", href: "./", on: (window.PAGE || "work") === "work" },
  { n: "02", t: "About", href: "About.html", on: window.PAGE === "about" },
  { n: "03", t: "Play", href: "Play.html", on: window.PAGE === "play" },
  { n: "04", t: "Resume", href: "https://drive.google.com/file/d/1oPp-S96QerNcEBSoBz0-ZevHmxsRBRNT/view?usp=sharing", ext: true },
];

function AsusBar() {
  return (
    <a className="now asus-bar" href="CaseStudy.html?p=asus">
      <span className="now-head">
        <span className="now-dot" aria-hidden="true"></span>
        <span className="now-label">Coming soon</span>
        <span className="now-count">To be shipped December 2026</span>
        <span className="asus-arr" aria-hidden="true">&rarr;</span>
      </span>
      <p className="now-msg asus-msg"><b>ASUS ProArt</b> &mdash; AI autonomy in creative workflows. Leading research on what creators are comfortable delegating to agents.</p>
    </a>
  );
}

const MANTIS_LINES = [
  "hi. i'm the mantis. sophia keeps me around for focus.",
  "click a case study. i'll wait. i'm very good at waiting.",
  "fun fact: i can turn my head almost all the way around.",
  "sophia does brazilian zouk. i prefer standing very still.",
  "hiring? her resume is right up there.",
  "please tap the glass gently.",
];
const MANTIS = `  \\    //
   \\()//
   _(oo)_
  / /||\\ \\
    /||\\
   /    \\`;

function Mantis() {
  const [i, setI] = React.useState(-1);
  return (
    <div className="mantis">
      {i >= 0 ? <p className="mantis-say" key={i} role="status">{MANTIS_LINES[i]}</p> : null}
      <button type="button" className="mantis-tank" aria-label="Talk to the mantis" onClick={() => setI((k) => (k + 1) % MANTIS_LINES.length)}>
        <pre className="mantis-art" aria-hidden="true">{MANTIS}</pre>
        <span className="mantis-soil" aria-hidden="true"></span>
      </button>
    </div>
  );
}

function NowToast() {
  const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [i, setI] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [hov, setHov] = React.useState(false);
  React.useEffect(() => {
    if (reduced || open || !hov) return;
    const t = setInterval(() => setI((k) => (k + 1) % STATUS_PHRASES.length), 4200);
    return () => clearInterval(t);
  }, [open, hov]);
  return (
    <aside className={"now" + (open ? " is-open" : "")} aria-live="polite" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <button type="button" className="now-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="now-dot" aria-hidden="true"></span>
        <span className="now-label">Now</span>
        <span className="now-count">{i + 1}/{STATUS_PHRASES.length}</span>
        <span className="now-chev" aria-hidden="true">&#8964;</span>
      </button>
      {open ? (
        <ul className="now-list">{STATUS_PHRASES.map((p) => <li key={p}>{p}</li>)}</ul>
      ) : (
        <p className="now-msg" key={i}>{STATUS_PHRASES[i].split(" ").map((w, k) => <span key={k} className="dw" style={{ "--i": k }}>{w + " "}</span>)}</p>
      )}
    </aside>
  );
}

function useGlassGlare() {
  React.useEffect(() => {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, ev = null;
    const run = () => {
      raf = 0;
      const el = document.querySelector(".sb-top"); if (!el || !ev) return;
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
      const d = Math.hypot(Math.max(0, Math.abs(x - .5) - .5), Math.max(0, Math.abs(y - .5) - .5));
      el.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
      el.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      el.style.setProperty("--ga", Math.max(0, 1 - d * 2.2).toFixed(3));
    };
    const onMove = (e) => { ev = e; if (!raf) raf = requestAnimationFrame(run); };
    addEventListener("pointermove", onMove, { passive: true });
    return () => { removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);
}

function App() {
  return (
    <div className="v12 sb-shell">
      {window.CustomCursor ? <window.CustomCursor /> : null}
      <aside className="sb fh">
        <section className="v12-hero sb-top is-mirror" aria-hidden="true"></section>
        <div className="hero-left">
          <HeroName />
          <HeroRole />
        </div>
        <nav className="sb-nav" aria-label="Main">
          {SB_NAV.map((it) => (
            <a key={it.n} href={it.href} target={it.ext ? "_blank" : undefined} rel={it.ext ? "noopener" : undefined} className={it.on ? "is-active" : undefined} aria-current={it.on ? "page" : undefined}>
              <span>{it.t}</span><span className="sb-arr" aria-hidden="true">&rarr;</span>
            </a>
          ))}
        </nav>
        <div className="sb-out">
          <a href="https://www.linkedin.com/in/sophia-clancy-488970325/" aria-label="LinkedIn" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 10.5V16.5M8 7.6v.1M11.5 16.5v-6M11.5 13.2a2.4 2.4 0 0 1 4.8 0v3.3"/></svg></a>
          <a href="https://github.com/sophiaclancy" aria-label="GitHub" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg></a>
          <a href="https://x.com/clancystufff" aria-label="X" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M4 4h4.5L20 20h-4.5zM20 4l-6.5 7.2M4 20l6.5-7.2"/></svg></a>
          <a href="mailto:sophiaclancy@berkeley.edu" aria-label="Email"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg></a>
        </div>
      </aside>
      {window.PAGE === "play" && window.PlayMain ? (
        <main className="sb-main is-play"><window.PlayMain /></main>
      ) : window.PAGE === "about" && window.AboutMain ? (
        <main className="sb-main is-about"><window.AboutMain /></main>
      ) : (
      <main className="sb-main" id="work">
        <NowToast />
        <div className="work-cols">
          <div className="work-col">{WORK_LEFT.map((w) => <Card key={w.id} item={w} />)}</div>
          <div className="work-col">{WORK_RIGHT.map((w) => <Card key={w.id} item={w} />)}</div>
        </div>
        <PixelTrees />
      </main>
      )}
    </div>
  );
}

function NightSky() {
  const stars = React.useMemo(() => {
    let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const out = [];
    for (let i = 0; i < 110; i++) {
      const y = 16 + r() * 84, t = r();
      out.push({ x: r() * 100, y, sz: t > .93 ? 2.6 : t > .7 ? 1.8 : 1.1, c: t > .86 ? "b" : t > .5 ? "c" : "w", tw: r() > .7, d: (r() * 6).toFixed(2), o: (.35 + r() * .6) * Math.min(1, (y - 16) / 18) });
    }
    const glints = [[8, 38, 14], [23, 72, 10], [47, 30, 9], [61, 86, 12], [79, 44, 16], [93, 70, 10], [36, 58, 8], [70, 22, 9]].map(([x, y, z], i) => ({ x, y, z, d: i * .7, b: i % 3 === 1 }));
    return { out, glints };
  }, []);
  const pxRef = React.useRef(null);
  React.useEffect(() => {
    const cv = pxRef.current; if (!cv) return;
    const draw = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1), W = r.width, H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; const x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
      let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
      const C = 12, G = 3, cols = Math.ceil(W / C), rows = Math.ceil(H / C);
      const blob = (i, j) => { const u = i * C / W, v = j * C / H; return .5 + .28 * Math.sin(u * 9.1 + 1.3 + v * 2) * Math.cos(v * 5.2 - u * 3) + .2 * Math.sin(u * 23 - v * 7 + 2) + .12 * Math.sin(u * 51 + v * 13); };
      const pal = [[208, 213, 224], [170, 178, 197], [128, 139, 166], [88, 100, 134], [58, 70, 104], [36, 46, 80], [22, 31, 60]];
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const t = j / rows, b = blob(i, j), q = rnd();
        const dens = Math.max(0, (b - .55 + t * .75) * 1.6) * (1 - Math.max(0, t - .8) * 5);
        if (q > dens * .75) continue;
        const k = Math.max(0, Math.min(pal.length - 1, Math.round((t * .8 + b * .35) * (pal.length - 1) + (rnd() - .5) * 1.6)));
        const c = rnd() > .97 ? [244, 236, 214] : rnd() > .96 ? [157, 187, 255] : pal[k];
        const al = (.1 + rnd() * .4) * (.5 + b * .6);
        const sz = rnd() > .9 ? C * 2 - G : C - G;
        x.fillStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + al.toFixed(3) + ")";
        x.fillRect(i * C, j * C, sz, sz);
      }
      for (let n = 0; n < 60; n++) { const px = rnd() * W, py = rnd() * H * .7, z = rnd() > .7 ? 5 : 3; x.fillStyle = "rgba(" + (rnd() > .5 ? "88,100,134" : "128,139,166") + "," + (.25 + rnd() * .4).toFixed(2) + ")"; x.fillRect(Math.round(px / C) * C, Math.round(py / C) * C, z, z); }
    };
    draw(); const ro = new ResizeObserver(draw); ro.observe(cv); return () => ro.disconnect();
  }, []);
  return (
    <div className="night-sky" aria-hidden="true">
      <canvas ref={pxRef} className="ns-px"></canvas>
      {stars.out.map((st, i) => <i key={i} className={"ns-dot is-" + st.c + (st.tw ? " is-tw" : "")} style={{ left: st.x + "%", top: st.y + "%", width: st.sz, height: st.sz, opacity: st.o, animationDelay: st.d + "s" }} />)}
      {stars.glints.map((g, i) => <b key={i} className={"ns-glint" + (g.b ? " is-b" : "")} style={{ left: g.x + "%", top: g.y + "%", width: g.z, height: g.z, animationDelay: g.d + "s" }} />)}
    </div>
  );
}

function PixelTrees() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const draw = () => {
      const W = cv.clientWidth, H = cv.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = W * dpr; cv.height = H * dpr; const x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
      let sd = 5; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      const pal = [[218, 226, 170], [190, 204, 134], [158, 178, 98], [128, 150, 72], [102, 124, 56], [80, 100, 44]];
      const C = 6, G = 1.5, ground = H - 14;
      const branch = (x0, y0, ang, len, w, depth, tips) => {
        const x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len, mx = (x0 + x1) / 2 + (r() - .5) * len * .25, my = (y0 + y1) / 2 + (r() - .5) * len * .2;
        x.strokeStyle = "rgba(108,124,58,1)"; x.lineWidth = w; x.lineCap = "round";
        x.beginPath(); x.moveTo(x0, y0); x.quadraticCurveTo(mx, my, x1, y1); x.stroke();
        if (depth <= 0) { tips.push([x1, y1]); return; }
        const n = depth > 2 ? 2 : 2 + (r() > .5 ? 1 : 0);
        for (let i = 0; i < n; i++) branch(x1, y1, ang + (i - (n - 1) / 2) * (.5 + r() * .35) + (r() - .5) * .3, len * (.62 + r() * .14), w * .62, depth - 1, tips);
        if (depth > 1) tips.push([x1, y1]);
      };
      const tile = (cx, cy, rad, k0) => {
        for (let gy = -rad; gy <= rad; gy += C) for (let gx = -rad * 1.2; gx <= rad * 1.2; gx += C) {
          const px = Math.round((cx + gx) / C) * C, py = Math.round((cy + gy) / C) * C;
          const d = Math.hypot(gx / 1.2, gy) / rad; if (d > 1 || r() > (1 - d) * .9 + .05) continue;
          const k = Math.max(0, Math.min(5, k0 + Math.round((gy / rad) * 1.4 + (r() - .5) * 2.2)));
          const c = r() > .96 ? [240, 238, 214] : pal[k];
          x.fillStyle = "rgba(" + c + "," + (.25 + r() * .6).toFixed(2) + ")";
          x.fillRect(px, py, C - G, C - G);
        }
      };
      const leaf = (lx, ly) => { x.save(); x.translate(lx, ly); x.rotate(r() * 6.28); x.fillStyle = "rgba(118,142,62," + (.6 + r() * .4).toFixed(2) + ")"; x.beginPath(); x.ellipse(0, 0, 5, 2.2, 0, 0, 6.28); x.fill(); x.restore(); };
      const n = Math.max(3, Math.round(W / 260));
      for (let i = 0; i < n; i++) {
        const tx = W * (i + .5) / n + (r() - .5) * W / n * .4, sc = .5 + r() * .45, h = (H - 40) * sc;
        tile(tx, ground - 4, 30 * sc + 14, 2);
        const tips = []; branch(tx, ground, -Math.PI / 2 + (r() - .5) * .35, h * .36, 7 * sc + 2, 3, tips);
        tips.forEach(([px, py]) => tile(px, py - 4, (14 + r() * 14) * sc + 6, 1));
        for (let g = 0; g < 4; g++) { const gx = tx + (r() - .5) * 90 * sc; x.strokeStyle = "rgba(108,128,58,.8)"; x.lineWidth = 1.4; x.beginPath(); x.moveTo(gx, ground + 4); x.quadraticCurveTo(gx + (r() - .5) * 10, ground - 14, gx + (r() - .5) * 18, ground - 22 - r() * 16); x.stroke(); }
        for (let l = 0; l < 7; l++) leaf(tx + (r() - .5) * 170 * sc, ground - h * (.2 + r() * .8));
      }
      for (let j = 0; j < 40; j++) { x.fillStyle = "rgba(" + pal[2 + (j % 3)] + ",.55)"; x.fillRect(Math.round(r() * W / C) * C, Math.round((ground - r() * H * .9) / C) * C, C - G, C - G); }
    };
    draw(); const ro = new ResizeObserver(draw); ro.observe(cv); return () => ro.disconnect();
  }, []);
  return <div className="pt-row" aria-hidden="true"><canvas ref={ref} className="pt-cv"></canvas></div>;
}

function TigerStageUnused(){
  React.useEffect(function(){ if(window.startTigerStage) window.startTigerStage(); }, []);
  return (
    <div className="tiger-stage" id="tigerStage">
      <div className="tiger-sprite" id="tigerSprite">
        <img id="tigerA" alt="" /><img id="tigerB" alt="" />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

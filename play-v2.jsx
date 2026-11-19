// play-v2.jsx — Play page: filterable masonry of side projects
(function () {
  const ITEMS = [
    { id: "sand", cat: "Designathon", title: "Sand: helping people feel time", sub: "AR glasses, ring, and app · FigBuild 2026", href: "Sand.html", img: "assets/sand/cover.webp", ratio: "4 / 5", field: "sand", fg: { src: "assets/sand/home.webp", cls: "pl-phone" } },
    { id: "baro", cat: "Product", title: "Baro: behavior support for classrooms", sub: "Project Manager · 0-to-1 product with 5 engineers", href: "Baro.html", img: "assets/baro/cover.webp", ratio: "1 / 1", field: "baro", fg: { src: "assets/baro/t-home.webp", cls: "pl-win" } },
    { id: "circuit", cat: "Front-end", title: "Circuit: virtual speed dating", sub: "Front-end implementation · 1,000+ users · Live site ↗", href: "https://www.circuitspeeddating.com/", ext: true, img: "assets/circuit/cover.webp", ratio: "1 / 1" , field: "circuit", fg: { src: "assets/circuit/cover.webp", cls: "pl-site" } },
    { id: "brain", cat: "Experiment", title: "Pick at my brain", sub: "Interactive experiment", href: "Pick%20at%20My%20Brain.html", art: "brain", ratio: "1 / 1", field: "brain", fg: { src: "assets/chip-brain.webp", cls: "pl-chip" } },
  ];
  const CATS = ["All", ...Array.from(new Set(ITEMS.map((i) => i.cat)))];
  function Art({ it }) {
    // Terrarium fields (fields.js): blurred photo field behind a cutout of the work
    if (it.field) return <React.Fragment><canvas className="da-field" data-field={it.field} aria-hidden="true"></canvas><img className={"pl-fg " + it.fg.cls} src={it.fg.src} alt="" loading="lazy" /></React.Fragment>;
    if (it.img) return <img src={it.img} alt="" loading="lazy" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />;
    if (it.art === "brain") return <div className="pl-brain"><img src="assets/chip-brain.png" alt="" /></div>;
    return null;
  }
  function PlayMain() {
    const [cat, setCat] = React.useState("All");
    const list = ITEMS.filter((i) => cat === "All" || i.cat === cat);
    return (
      <div className="pl">
        <div className="pl-filters" role="tablist">
          {CATS.map((c) => <button key={c} type="button" role="tab" aria-selected={c === cat} className={c === cat ? "is-on" : ""} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <div className="pl-grid">
          {list.map((it) => (
            React.createElement(it.soon ? "div" : "a", { className: "pl-item" + (it.soon ? " is-soon" : ""), key: it.id, href: it.soon ? undefined : it.href, target: it.ext ? "_blank" : undefined, rel: it.ext ? "noopener noreferrer" : undefined },
              <div className={"pl-art" + (it.field ? " has-field" : "")} style={{ aspectRatio: it.ratio }}><Art it={it} /></div>,
              <span className="pl-t">{it.title}</span>,
              <span className="pl-s">{it.sub}</span>
            )
          ))}
        </div>
      </div>
    );
  }
  Object.assign(window, { PlayMain });
})();

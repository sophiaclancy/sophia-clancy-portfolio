// play-v2.jsx — Play page: filterable masonry of side projects
(function () {
  const ITEMS = [
    { id: "sand", cat: "Designathon", title: "Sand: helping people feel time", sub: "FigBuild 2026 designathon", href: "CaseStudy.html?p=p3", art: "sand", ratio: "4 / 5" },
    { id: "brain", cat: "Experiment", title: "Pick at my brain", sub: "Interactive experiment", href: "Pick%20at%20My%20Brain.html", art: "brain", ratio: "1 / 1" },
  ];
  const CATS = ["All", ...Array.from(new Set(ITEMS.map((i) => i.cat)))];
  function Art({ it }) {
    if (it.art === "sand" && window.SandAnimCover) return <window.SandAnimCover />;
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
            React.createElement(it.soon ? "div" : "a", { className: "pl-item" + (it.soon ? " is-soon" : ""), key: it.id, href: it.soon ? undefined : it.href },
              <div className="pl-art" style={{ aspectRatio: it.ratio }}><Art it={it} /></div>,
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

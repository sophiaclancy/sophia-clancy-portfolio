// casestudy-v15.jsx — full-page case study: sticky dot TOC, descriptive headings, framed visuals
(function () {
  const { useState, useEffect, useRef, useCallback } = React;

  const rich = (body) => Array.isArray(body) ? body.map((x, i) => Array.isArray(x) ? <strong key={i}>{x[0]}</strong> : x) : body;

  function Visual({ pid, label, ratio, src, bg, alt }) {
    if (src) return <img src={src} alt={alt || ""} loading="lazy" />;
    const F = window.CASE_FIGS && window.CASE_FIGS[pid + "::" + label];
    if (F && window.FigStage) return <div className="c15-stage" style={{ aspectRatio: ratio || "16 / 9" }}><window.FigStage ratio={ratio || "16 / 9"}><F /></window.FigStage></div>;
    return <div className="c15-slot" style={{ aspectRatio: ratio || "16 / 9" }}><span>{label}</span></div>;
  }

  function Block({ b, pid }) {
    switch (b.t) {
      case "p": return <p className="c15-p">{rich(b.body)}</p>;
      case "cols": return <div className="c15-cols">{b.items.map((x, i) => <p className="c15-p" key={i}>{rich(x)}</p>)}</div>;
      case "statement": return <p className="c15-statement">{rich(b.body)}</p>;
      case "quote": return <blockquote className="c15-quote"><p>{b.text}</p></blockquote>;
      case "note": return <p className="c15-note">{b.text}</p>;
      case "fig": return (
        <figure className="c15-fig">
          <div className="c15-fig-box">
            <span className="c15-fig-label">{b.label}</span>
            <Visual pid={pid} label={b.label} ratio={b.ratio} />
          </div>
          {b.caption ? <figcaption>{b.caption}</figcaption> : null}
        </figure>
      );
      case "img": return (
        <figure className="c15-fig">
          <div className="c15-fig-box is-img" style={b.bg ? { background: b.bg } : null}><img src={b.src} alt={b.caption || ""} loading="lazy" /></div>
          {b.caption ? <figcaption>{b.caption}</figcaption> : null}
        </figure>
      );
      case "cards": return (
        <div className={"c15-cards cols-" + (b.cols || 3) + (b.tone ? " is-" + b.tone : "")}>
          {b.items.map((it, i) => (
            <div className={"c15-card" + (it.on ? " is-on" : "")} key={i}>
              {it.n ? <span className="c15-card-n">{it.n}</span> : null}
              {it.title ? <h4>{it.title}</h4> : null}
              {it.desc ? <p>{it.desc}</p> : null}
            </div>
          ))}
        </div>
      );
      case "list": return (
        <ul className="c15-list">{b.items.map((x, i) => <li key={i}>{Array.isArray(x) ? <><strong>{x[0]}</strong>{x.slice(1).join("")}</> : x}</li>)}</ul>
      );
      case "callout": return (
        <div className="c15-callout">{b.label ? <span>{b.label}</span> : null}<p>{b.text}</p></div>
      );
      case "aside": return (
        <aside className="c15-aside">{b.label ? <span>{b.label}</span> : null}<p>{b.text}</p></aside>
      );
      case "table": return (
        <div className="c15-table" style={{ "--n": b.head.length }}>
          <div className="c15-tr is-head">{b.head.map((h, i) => <div key={i} className={i === b.head.length - 1 ? "is-ours" : ""}>{h}</div>)}</div>
          {b.rows.map((r, ri) => <div className="c15-tr" key={ri}>{r.map((c, i) => <div key={i} className={i === r.length - 1 ? "is-ours" : ""}>{c}</div>)}</div>)}
        </div>
      );
      case "gallery": return (
        <div className="c15-gallery" style={{ "--cols": b.cols || 3 }}>
          {b.items.map((it, i) => (
            <figure className="c15-fig" key={i}>
              <div className="c15-fig-box"><span className="c15-fig-label">{it.label}</span><Visual pid={pid} label={it.label} ratio={it.ratio} src={it.src} /></div>
              {it.caption ? <figcaption>{it.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      );
      case "numlist": return (
        <ol className="c15-numlist">
          {b.items.map((x, i) => <li key={i}><span>{i + 1}</span><p>{x}</p></li>)}
        </ol>
      );
      case "bento": return (
        <div className="c15-bento">
          {b.items.map((it, i) => (
            <div className={"c15-bento-card" + (it.tall ? " is-tall" : "") + (it.wide ? " is-wide" : "")} style={{ gridArea: it.area }} key={i}>
              <div className="c15-bento-text">
                <span className="c15-card-n">{it.n}</span>
                <h4>{it.title}</h4>
                <p>{it.body}</p>
              </div>
              <div className="c15-bento-shot"><Visual pid={pid} label={it.label} ratio={it.ratio} src={it.src} alt={it.title} /></div>
            </div>
          ))}
        </div>
      );
      default: return null;
    }
  }

  function CaseStudy15({ p }) {
    const d = window.CASE15[p.id];
    const secs = d.sections;
    const [active, setActive] = useState(secs[0].id);
    const scroller = useRef(null);

    useEffect(() => {
      const el = scroller.current;
      const onScroll = () => {
        let cur = secs[0].id;
        for (const s of secs) {
          const n = document.getElementById(s.id);
          if (n && n.getBoundingClientRect().top <= window.innerHeight * 0.35) cur = s.id;
        }
        if (el.scrollTop > 0 && el.scrollTop + el.clientHeight >= el.scrollHeight - 6) cur = secs[secs.length - 1].id;
        setActive(cur);
      };
      el.addEventListener("scroll", onScroll, { passive: true });
      const ro = new ResizeObserver(onScroll);
      const main = el.querySelector(".c15-main");
      if (main) ro.observe(main);
      onScroll();
      return () => { el.removeEventListener("scroll", onScroll); ro.disconnect(); };
    }, []);

    const go = useCallback((id) => {
      const el = scroller.current, n = document.getElementById(id);
      if (el && n) el.scrollTo({ top: n.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 48, behavior: "smooth" });
    }, []);

    useEffect(() => {
      const k = (e) => { if (e.key === "Escape" && !document.querySelector(".fg-lb")) location.href = "Portfolio.html#work"; };
      window.addEventListener("keydown", k);
      return () => window.removeEventListener("keydown", k);
    }, []);

    const meta = [
      { k: "Role", v: [p.role] },
      { k: "Team", v: [p.team] },
      { k: "Timeline", v: [p.timeline] },
      { k: "Skills", v: p.skills || [] },
          ].filter((m) => m.v.length && m.v[0]);
    const idx = secs.findIndex((s) => s.id === active);

    return (
      <div className="c15" ref={scroller} style={{ "--acc": p.color, "--acc-tint": p.tint }}>
        {window.CustomCursor ? <window.CustomCursor /> : null}
        <div className="c15-grid">
          <aside className="c15-side">
            <a className="c15-back" href="Portfolio.html#work"><span aria-hidden="true">&larr;</span> Back to work</a>
            <div className="c15-side-id">
              <span>Case study</span>
              <b>{p.title}</b>
            </div>
            <nav className="c15-toc" style={{ "--prog": Math.max(0, idx) / Math.max(1, secs.length - 1) }}>
              {secs.map((s, i) => (
                <button key={s.id} className={"c15-toc-link" + (s.id === active ? " is-active" : "") + (i < idx ? " is-past" : "")} onClick={() => go(s.id)}>
                  <i aria-hidden="true"></i>
                  <em>{String(i + 1).padStart(2, "0")}</em>
                  {s.nav}
                </button>
              ))}
            </nav>
            <button className="c15-top" onClick={() => scroller.current.scrollTo({ top: 0, behavior: "smooth" })}><span aria-hidden="true">&uarr;</span> Back to top</button>
          </aside>

          <main className="c15-main">
            <header className="c15-hero">
              <p className="c15-kicker">{d.tags.join(" \u00b7 ")}{d.status ? <span className="c15-status"><i aria-hidden="true"></i>{d.status}</span> : null}</p>
              <h1 className="c15-h1">{p.headline}</h1>
              {p.hero ? <div className="c15-hero-shot" style={p.heroBg ? { background: p.heroBg } : null}><img src={p.hero} alt="" /></div> : (d.cover && window[d.cover]) ? <div className="c15-hero-shot is-cover">{React.createElement(window[d.cover])}</div> : null}
              <dl className="c15-meta">
                {meta.map((m) => <div key={m.k}><dt>{m.k}</dt>{m.v.map((v, i) => <dd key={i}>{v}</dd>)}</div>)}
              </dl>
              <p className="c15-lead">{p.summary}</p>
            </header>

            {secs.map((s) => (
              <section className="c15-sec" id={s.id} key={s.id} data-screen-label={s.nav}>
                <p className="c15-eyebrow">{s.eyebrow}</p>
                <h2 className="c15-h2">{s.title}</h2>
                {s.body ? <p className="c15-sub">{s.body}</p> : null}
                {s.blocks.map((b, i) => <Block b={b} pid={p.id} key={i} />)}
              </section>
            ))}

            <div className="c15-end" aria-hidden="true"></div>
          </main>
        </div>
      </div>
    );
  }

  Object.assign(window, { CaseStudy15 });
})();

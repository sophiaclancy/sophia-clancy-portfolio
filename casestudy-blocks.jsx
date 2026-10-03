// casestudy-blocks.jsx — rich content block renderer (shared)

const { useState, useEffect, useRef } = React;

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function getProject() {
  const id = new URLSearchParams(location.search).get("p");
  const list = window.PROJECTS || [];
  return list.find((p) => p.id === id) || list[0];
}

/* placeholder color image */
function ColorPlate({ color, tint, label, ratio }) {
  return (
    <div className="plate" style={{ background: color, aspectRatio: ratio || "16 / 9" }}>
      <div className="plate-stripes" />
      <div className="plate-label" style={{ color: tint }}><span>{label}</span></div>
    </div>
  );
}

/* placeholder media slot used in rich case studies */
function figFor(label) {
  const p = getProject();
  return p && window.CASE_FIGS && window.CASE_FIGS[p.id + "::" + label];
}
function FigFrame({ F, ratio, cls }) {
  const [open, setOpen] = useState(false);
  const r = ratio || "16 / 9";
  const [a, c] = r.split("/").map(Number);
  useEffect(() => {
    if (!open) return;
    const k = (e) => { if (e.key === "Escape") { e.stopPropagation(); setOpen(false); } };
    window.addEventListener("keydown", k, true);
    return () => window.removeEventListener("keydown", k, true);
  }, [open]);
  return (
    <div className="fg-wrap">
      <div className={(cls || "cb-media-frame") + " is-fig"} style={{ aspectRatio: r }}><window.FigStage ratio={r}><F /></window.FigStage></div>
      <button type="button" className="fg-open" onClick={() => setOpen(true)} aria-label="Expand figure">&#x2922; Expand</button>
      {open ? ReactDOM.createPortal(
        <div className="fg-lb" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="fg-lb-box" style={{ "--ar": r, "--r": c / a }} onClick={(e) => e.stopPropagation()}><window.FigStage ratio={r}><F /></window.FigStage></div>
          <button type="button" className="fg-lb-x" onClick={() => setOpen(false)} aria-label="Close">&times;</button>
        </div>, document.body) : null}
    </div>
  );
}
function MediaSlot({ label, caption, ratio }) {
  const F = figFor(label);
  return (
    <figure className="cb-media">
      {F ? <FigFrame F={F} ratio={ratio} /> : <div className="cb-media-frame" style={{ aspectRatio: ratio || "16 / 9" }}>
        <div className="plate-stripes" />
        <span className="cb-media-tag">{label}</span>
      </div>}
      {caption ? <figcaption className="cb-media-cap">{caption}</figcaption> : null}
    </figure>
  );
}

/* one rich content block */
function Block({ b, accent }) {
  switch (b.t) {
    case "head":
      return (
        <header className="cb-head" id={b.id}>
          <p className="cb-eyebrow" style={{ color: accent }}>{b.eyebrow}</p>
          <h2 className="cb-statement">{b.title}</h2>
          {b.body ? <p className="cb-lead">{b.body}</p> : null}
        </header>
      );
    case "subhead":
      return (
        <div className="cb-subhead">
          <h3 className="cb-subtitle">{b.title}</h3>
          {b.body ? <p className="cb-body">{b.body}</p> : null}
        </div>
      );
    case "text":
      return <p className="cb-body">{Array.isArray(b.body) ? b.body.map((x, i) => Array.isArray(x) ? <strong key={i}>{x[0]}</strong> : x) : b.body}</p>;
    case "list":
      return (
        <ul className="cb-list">
          {b.items.map((it, i) => <li key={i}>{Array.isArray(it) ? <React.Fragment><strong>{it[0]}</strong>{it[1] || ""}</React.Fragment> : it}</li>)}
        </ul>
      );
    case "note":
      return (
        <p className="cb-note">
          {b.label ? <span className="cb-note-label" style={{ color: accent }}>{b.label}</span> : null}
          {b.text}
        </p>
      );
    case "contrast":
      return (
        <div className="cb-contrast">
          {b.sides.map((s, i) => (
            <div className={"cb-contrast-side is-" + (s.tone || "neutral")} key={i}>
              <span className="cb-contrast-label">{s.label}</span>
              <ul className={"cb-contrast-list" + (s.strike ? " is-strike" : "")}>
                {s.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      );
    case "table":
      return (
        <div className="cb-table">
          {b.head ? (
            <div className="cb-table-row is-head">
              <span>{b.head[0]}</span>
              <span className="cb-table-arrow" aria-hidden="true"></span>
              <span>{b.head[1]}</span>
            </div>
          ) : null}
          {b.rows.map((r, i) => (
            <div className="cb-table-row" key={i}>
              <span className="cb-table-find">{r[0]}</span>
              <span className="cb-table-arrow" style={{ color: accent }} aria-hidden="true">&rarr;</span>
              <span className="cb-table-resp">{r[1]}</span>
            </div>
          ))}
        </div>
      );
    case "callout":
      return (
        <aside className="cb-callout">
          {b.label ? <span className="cb-callout-label" style={{ color: accent }}>{b.label}</span> : null}
          <p className="cb-callout-text">{b.text}</p>
        </aside>
      );
    case "points":
      return (
        <div className={"cb-points cols-" + (b.cols || 3)}>
          {b.items.map((it, i) => (
            <div className="cb-point" key={i}>
              {it.n ? <span className="cb-point-n" style={{ color: accent }}>{it.n}</span> : null}
              <h4 className="cb-point-title">{it.title}</h4>
              <p className="cb-point-desc">{it.desc}</p>
            </div>
          ))}
        </div>
      );
    case "stats":
      return (
        <div className="cb-stats">
          {b.items.map((it, i) => (
            <div className="cb-stat" key={i}>
              <span className="cb-stat-v" style={{ color: accent }}>{it.value}</span>
              <span className="cb-stat-l">{it.label}</span>
            </div>
          ))}
        </div>
      );
    case "quotes":
      return (
        <div className={"cb-quotes cols-" + (b.cols || 2)}>
          {b.items.map((it, i) => (
            <blockquote className="cb-quote" key={i}>
              <span className="cb-quote-mark" style={{ color: accent }} aria-hidden="true">&ldquo;</span>
              <p className="cb-quote-text">{it.text}</p>
              {it.by ? <cite className="cb-quote-by">{it.by}</cite> : null}
            </blockquote>
          ))}
        </div>
      );
    case "media":
      return <MediaSlot label={b.label} caption={b.caption} ratio={b.ratio} />;
    case "embed":
      return (
        <figure className="cb-embed">
          <div className="cb-embed-frame" style={{ aspectRatio: b.ratio || "1728 / 1080" }}>
            <iframe src={b.src} title={b.caption || "Interactive prototype"} loading="lazy"
                    className="cb-embed-iframe" scrolling="no"></iframe>
          </div>
          {b.caption ? <figcaption className="cb-media-cap">{b.live ? <span className="cb-live">● Live</span> : null}{b.caption}</figcaption> : null}
        </figure>
      );
    case "img":
      return (
        <figure className={"cb-img" + (b.frame ? " is-framed" : "")}>
          <div className="cb-img-wrap" style={b.bg ? { background: b.bg } : null}>
            <img src={b.src} alt={b.caption || ""} loading="lazy"
                 style={b.maxh ? { maxHeight: b.maxh } : null} />
          </div>
          {b.caption ? <figcaption className="cb-media-cap">{b.caption}</figcaption> : null}
        </figure>
      );
    case "imgrow":
      return (
        <div className={"cb-imgrow cols-" + (b.cols || 3)}>
          {b.items.map((it, i) => (
            <figure className="cb-img is-framed" key={i}>
              <div className="cb-img-wrap" style={it.bg ? { background: it.bg } : (b.bg ? { background: b.bg } : null)}>
                <img src={it.src} alt={it.caption || ""} loading="lazy" />
              </div>
              {it.caption ? <figcaption className="cb-media-cap">{it.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      );
    case "gallery":
      return (
        <div className={"cb-gallery cols-" + (b.cols || 2)}>
          {b.items.map((it, i) => (
            <MediaSlot key={i} label={it.label} caption={it.caption} ratio={it.ratio} />
          ))}
        </div>
      );
    case "persona":
      return (
        <div className="cb-persona">
          <div className="cb-persona-id">
            <span className="cb-persona-avatar" aria-hidden="true">{b.emoji}</span>
            <div>
              <h4 className="cb-persona-name">{b.name}</h4>
              <span className="cb-persona-tag" style={{ color: accent }}>{b.tag}</span>
            </div>
          </div>
          <p className="cb-persona-bio">{b.bio}</p>
          <dl className="cb-persona-grid">
            {b.items.map((it, i) => (
              <div className="cb-persona-row" key={i}>
                <dt>{it.label}</dt>
                <dd>{it.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "tags":
      return <ul className="cb-tags">{b.items.map((t, i) => <li key={i}>{t}</li>)}</ul>;
    case "big":
      return (
        <div className={"cb-big" + (b.tone ? " is-" + b.tone : "")}>
          {b.eyebrow ? <p className="cb-big-eyebrow" style={{ color: accent }}>{b.eyebrow}</p> : null}
          {b.lines.map((l, i) => <p className="cb-big-line" key={i}>{l}</p>)}
          {b.foot ? <p className="cb-big-foot">{b.foot}</p> : null}
        </div>
      );
    case "bigquote":
      return (
        <blockquote className="cb-bigquote">
          <p>{b.text}</p>
          {b.by ? <cite>{b.by}</cite> : null}
        </blockquote>
      );
    case "spectrum":
      return (
        <div className="cb-spectrum">
          <div className="cb-spec-ends"><span>{b.left}</span><span>{b.right}</span></div>
          <div className="cb-spec-track"></div>
          <div className="cb-spec-marks">
            {b.marks.map((m, i) => (
              <span className={"cb-spec-mark" + (m.ours ? " is-ours" : "")} key={i} style={{ left: m.at + "%" }}>
                <i style={m.ours ? { background: accent, borderColor: accent } : null}></i>
                <b>{m.label}</b>
              </span>
            ))}
          </div>
        </div>
      );
    case "journeys":
      return (
        <div className="cb-journeys">
          {b.items.map((it, i) => (
            <div className="cb-journey" key={i}>
              <span className="cb-journey-label" style={{ color: accent }}>{it.label}</span>
              {it.src
                ? <div className="cb-journey-shot" style={b.bg ? { background: b.bg } : null}><img src={it.src} alt="" loading="lazy" /></div>
                : <div className="cb-journey-shot is-slot"><div className="plate-stripes" /><span className="cb-media-tag">{it.label}</span></div>}
              <ol className="cb-journey-steps">{it.steps.map((s, j) => <li key={j}>{s}</li>)}</ol>
              {it.note ? <p className="cb-journey-note">{it.note}</p> : null}
            </div>
          ))}
        </div>
      );
    case "matrix":
      return (
        <div className="cb-matrix">
          <div className="cb-matrix-row is-head"><span></span>{b.cols.map((c, i) => <span key={i}>{c}</span>)}</div>
          {b.rows.map((r, i) => (
            <div className={"cb-matrix-row" + (r.win ? " is-win" : "")} key={i}>
              <span className="cb-matrix-name">{r.name}{r.win ? <em style={{ color: accent }}>chosen</em> : null}</span>
              {r.cells.map((c, j) => (
                <span className="cb-matrix-cell" key={j}><i className={"cb-dots d" + c} aria-hidden="true"><b></b><b></b><b></b></i></span>
              ))}
            </div>
          ))}
        </div>
      );
    case "step":
      return (
        <section className="cb-step">
          <div className="cb-step-head">
            <span className="cb-step-n" style={{ color: accent }}>{b.n}</span>
            <div>
              <h3 className="cb-step-title">{b.title}</h3>
              {b.body ? <p className="cb-step-body">{b.body}</p> : null}
            </div>
          </div>
          {b.src
            ? <div className="cb-step-shot" style={b.bg ? { background: b.bg } : null}><img src={b.src} alt={b.title} loading="lazy" /></div>
            : figFor(b.label) ? <FigFrame F={figFor(b.label)} ratio={b.ratio} cls="cb-step-shot" />
            : <div className="cb-step-shot is-slot" style={{ aspectRatio: b.ratio || "16 / 9" }}><div className="plate-stripes" /><span className="cb-media-tag">{b.label}</span></div>}
        </section>
      );
    case "versus":
      return (
        <div className="cb-versus">
          <figure className="cb-versus-side">
            <div className={"cb-versus-shot" + (b.a.src ? "" : " is-slot")} style={b.bg ? { background: b.bg } : null}>
              {b.a.src ? <img src={b.a.src} alt="" loading="lazy" /> : <React.Fragment><div className="plate-stripes" /><span className="cb-media-tag">{b.a.label}</span></React.Fragment>}
            </div>
            <figcaption>{b.a.label}</figcaption>
          </figure>
          <span className="cb-versus-mid" style={{ color: accent }}>{b.mid || "\u2194"}</span>
          <figure className="cb-versus-side">
            <div className={"cb-versus-shot" + (b.b.src ? "" : " is-slot")} style={b.bg ? { background: b.bg } : null}>
              {b.b.src ? <img src={b.b.src} alt="" loading="lazy" /> : <React.Fragment><div className="plate-stripes" /><span className="cb-media-tag">{b.b.label}</span></React.Fragment>}
            </div>
            <figcaption>{b.b.label}</figcaption>
          </figure>
        </div>
      );
    case "collage":
      return (
        <div className="cb-collage">
          {b.items.map((it, i) => (
            <figure className={"cb-collage-cell" + (it.span ? " span-" + it.span : "") + (it.tilt ? " is-tilt" : "")} key={i}>
              <div className="cb-collage-frame" style={{ aspectRatio: it.ratio || "4 / 3" }}>
                <div className="plate-stripes" />
                <span className="cb-media-tag">{it.label}</span>
              </div>
              {it.note ? <figcaption className="cb-collage-note" style={{ color: accent }}>{it.note}</figcaption> : null}
            </figure>
          ))}
        </div>
      );
    default:
      return null;
  }
}

Object.assign(window, { CaseBlock: Block, CaseColorPlate: ColorPlate, CaseMediaSlot: MediaSlot });

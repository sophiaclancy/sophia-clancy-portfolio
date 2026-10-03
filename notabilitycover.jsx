// notabilitycover.jsx — Notability card cover: the live flow animation, scaled into the card.
function NotabilityCover() {
  const wrap = React.useRef(null);
  const [live, setLive] = React.useState(false);
  const [k, setK] = React.useState(0);
  React.useEffect(() => {
    const el = wrap.current; if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setLive(true); setK((n) => n + 1); } });
    }, { threshold: 0.4 });
    io.observe(el);
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      el.style.setProperty("--s", w / 1180);
    });
    ro.observe(el);
    return () => { io.disconnect(); ro.disconnect(); };
  }, []);
  return (
    <div className="nbf" ref={wrap}>
      {live ? <iframe key={k} className="nbf-frame" src="Notability Flow Animation v2.html?embed=1" title="Notability Learn flow" scrolling="no" tabIndex="-1"></iframe> : null}
    </div>
  );
}

window.NotabilityCover = NotabilityCover;

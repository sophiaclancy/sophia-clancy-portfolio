// asuscover.jsx — ASUS ProArt card cover: slow lava-lamp gradient with a glowing lockup.
function AsusCover() {
  const grain = React.useMemo(() => {
    const s = 128, c = document.createElement("canvas");
    c.width = c.height = s;
    const g = c.getContext("2d"), d = g.createImageData(s, s), p = d.data;
    for (let i = 0; i < p.length; i += 4) { const v = (Math.random() * 255) | 0; p[i] = p[i + 1] = p[i + 2] = v; p[i + 3] = 66; }
    g.putImageData(d, 0, 0);
    return c.toDataURL();
  }, []);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="ac" ref={ref}>
      <svg className="ac-defs" aria-hidden="true"><filter id="acWave" x="-12%" y="-12%" width="124%" height="124%"><feTurbulence type="fractalNoise" baseFrequency="0.0035 0.008" numOctaves="2" seed="7" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" xChannelSelector="R" yChannelSelector="G" scale="30" /></filter></svg>
      <div className="ac-bg"></div>
      <div className="ac-bg ac-bg2"></div>
      <div className="ac-deepen"></div>
      <div className="ac-lava"><div className="ac-blob b1"></div><div className="ac-blob b2"></div><div className="ac-blob b3"></div></div>
      <div className="ac-bloom"></div>
      <div className="ac-vig"></div>
      <div className="ac-lock-wrap"><img className="ac-lock" src="assets/asus-proart-lockup.png" alt="" loading="lazy" /></div>
      <div className="ac-grain" style={{ backgroundImage: "url(" + grain + ")" }}></div>
      <div className="ac-sheen"></div>
    </div>
  );
}

Object.assign(window, { AsusCover });

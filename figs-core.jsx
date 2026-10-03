// figs-core.jsx — scaled hi-fi figure stage + shared hooks
(function () {
  const { useState, useEffect, useRef } = React;
  window.CASE_FIGS = window.CASE_FIGS || {};
  function ratioOf(r) { if (!r) return 9 / 16; const [a, b] = String(r).split("/").map(Number); return b / a; }
  function FigStage({ ratio, w = 1280, children }) {
    const ref = useRef(null);
    const [s, setS] = useState(0);
    useEffect(() => {
      const el = ref.current;
      const ro = new ResizeObserver(() => setS(el.clientWidth / w));
      ro.observe(el);
      return () => ro.disconnect();
    }, []);
    const h = Math.round(w * ratioOf(ratio));
    return <div ref={ref} className="fg-stage"><div className="fg-canvas" style={{ width: w, height: h, transform: "scale(" + s + ")" }}>{s ? children : null}</div></div>;
  }
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  function useInView(ref, th = 0.3) {
    const [v, setV] = useState(false);
    useEffect(() => {
      const el = ref.current; if (!el) return;
      const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold: th });
      io.observe(el);
      return () => io.disconnect();
    }, []);
    return v;
  }
  // cycles 0..n-1 while visible and not held (hover)
  function useCycle(ref, n, ms) {
    const vis = useInView(ref);
    const [i, setI] = useState(0);
    const [hold, setHold] = useState(false);
    useEffect(() => {
      if (!vis || hold || reduced()) return;
      const d = Array.isArray(ms) ? ms[i] : ms;
      const t = setTimeout(() => setI((x) => (x + 1) % n), d);
      return () => clearTimeout(t);
    }, [i, vis, hold]);
    return { i, setI, hold, setHold, vis };
  }
  Object.assign(window, { FigStage, useFigInView: useInView, useFigCycle: useCycle, figReduced: reduced });
})();

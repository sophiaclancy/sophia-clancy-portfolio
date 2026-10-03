// contextoflowcover.jsx — Finder redesign cover: camera move across four Finder screens, looping
function ContextoFlowCover() {
  return (
    <div className="ctx-flow-cover" style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#0d3b63'}}>
      <iframe src="Contexto Finder Thumb.html" title="Finder redesign — Recents to Constellation" tabIndex="-1" scrolling="no" loading="lazy"
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, pointerEvents: 'none'}}></iframe>
    </div>
  );
}
window.ContextoFlowCover = ContextoFlowCover;

// partakecover.jsx — Partake cover: static engagement-chart artwork
function PartakeCover() {
  return (
    <div className="flip-cover pk-cover" style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#0C3B27'}}>
      <img src="assets/thumbs/partake-cover.png" alt="" loading="lazy" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
    </div>
  );
}
window.PartakeCover = PartakeCover;

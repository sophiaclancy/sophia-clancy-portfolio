// sandanimcover.jsx — Sand cover/hero: the AR→phone animation, looping, embedded
function SandAnimCover() {
  return (
    <div className="sand-anim" style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#F6F7F6'}}>
      <iframe src="Sand AR Embed.html" title="Sand — AR to phone" tabIndex="-1" scrolling="no" loading="lazy"
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, pointerEvents: 'none'}}></iframe>
    </div>
  );
}
window.SandAnimCover = SandAnimCover;

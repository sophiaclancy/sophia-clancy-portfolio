/* Sand AR animation — composition */
const {useComposition, Easing, animate, interpolate} = window;
const MOTION = {
  enter: (start, len = .45) => animate({from: 0, to: 1, start, end: start + len, ease: Easing.easeOutCubic}),
  pop: (start) => animate({from: 0, to: 1, start, end: start + .4, ease: Easing.easeOutBack}),
  draw: (start, len = .8) => animate({from: 0, to: 1, start, end: start + len, ease: Easing.easeInOutCubic})
};
const lerp = (a, b, t) => a + (b - a) * t;

function Glow({t}) {
  const orbs = [
    {x: 260, y: 180, r: 620, c: '176,226,206', dx: 70, dy: 40, sp: .07},
    {x: 1340, y: 720, r: 700, c: '64,154,130', dx: -60, dy: -50, sp: .05},
    {x: 900, y: 120, r: 460, c: '255,255,255', dx: 40, dy: 60, sp: .09}
  ];
  return (
    <div style={{position: 'absolute', inset: -200, pointerEvents: 'none'}}>
      {orbs.map((o, i) => {
        const p = Math.sin(t * o.sp * Math.PI * 2 + i);
        return <div key={i} style={{position: 'absolute', left: o.x + o.dx * p, top: o.y + o.dy * p, width: o.r, height: o.r, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${o.c},.55), rgba(${o.c},0) 70%)`, filter: 'blur(40px)', transform: `scale(${1 + .06 * p})`}} />;
      })}
    </div>
  );
}

function SandPiece() {
  const {T, CUES: C, authoredTotal} = useComposition();

  const keys = [C.Dunes, C.Slide, C.Slide + .6, C.Mode + .5, C.Burnout - .15, C.Burnout + .5, C.Flow - .15, C.Flow + .5, C.Close + .5];
  const cam = (v) => interpolate(keys, v, Easing.easeInOutCubic)(T);
  const camS = cam([1, 1.06, 1.06, 1.8, 1.8, 2.1, 2.1, 1.8, .98]);
  const camX = cam([0, -48, -48, -640, -640, -880, -880, -640, 16]);
  const camY = cam([0, -27, -27, -124, -124, -539, -539, -659, 9]);

  const cardIn = MOTION.pop(.12)(T);
  const fill = MOTION.enter(.6, .7)(T);
  const slide = animate({from: 0, to: 1, start: C.Slide + .05, end: C.Slide + .8, ease: Easing.easeInOutCubic})(T);
  const phoneFill = MOTION.enter(C.Mode + .3, .7)(T);
  const flowDraw = MOTION.draw(C.Flow + .25)(T);
  const focus = T < C.Burnout - .1 ? 'mode' : T < C.Flow - .1 ? 'risk' : T < C.Close + .3 ? 'flow' : 'none';
  const outro = animate({from: 0, to: 1, start: authoredTotal - .4, end: authoredTotal - .02})(T);

  return (
    <div style={{position: 'absolute', inset: 0, background: '#F6F7F6', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, sans-serif'}}>
      <div style={{position: 'absolute', width: 1600, height: 900, transformOrigin: '0 0', transform: `translate(${camX}px,${camY}px) scale(${camS})`}}>
        {/* headset optics: binocular lens mask, edge falloff, tracking marks */}
        <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: (1 - slide) * MOTION.enter(.05, .8)(T)}}>
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(62% 90% at 30% 50%, rgba(46,140,135,0) 62%, rgba(46,140,135,.10) 100%), radial-gradient(62% 90% at 70% 50%, rgba(46,140,135,0) 62%, rgba(46,140,135,.10) 100%)'}} />
          <div style={{position: 'absolute', left: 210, top: 46, right: 210, bottom: 46, borderRadius: 180, boxShadow: '0 0 0 3px rgba(255,255,255,.85), 0 0 0 10px rgba(18,128,106,.10)'}} />
          {/* depth grid of the tracked surface */}
          <div style={{position: 'absolute', left: 260, right: 260, bottom: 80, height: 260, opacity: .3 * MOTION.enter(.2, .7)(T),
            background: 'repeating-linear-gradient(90deg, rgba(18,128,106,.55) 0 1px, transparent 1px 86px), repeating-linear-gradient(0deg, rgba(18,128,106,.45) 0 1px, transparent 1px 54px)',
            maskImage: 'linear-gradient(0deg, rgba(0,0,0,.9), transparent)', WebkitMaskImage: 'linear-gradient(0deg, rgba(0,0,0,.9), transparent)',
            transform: 'perspective(520px) rotateX(64deg)', transformOrigin: 'bottom center'}} />
          {/* anchor brackets around the surfaced card */}
          {[[470, 150], [1150, 150], [470, 730], [1150, 730]].map(([x, y], i) => (
            <div key={i} style={{position: 'absolute', left: x, top: y, width: 36, height: 36,
              borderTop: i < 2 ? '3px solid rgba(18,128,106,.85)' : 'none', borderBottom: i > 1 ? '3px solid rgba(18,128,106,.85)' : 'none',
              borderLeft: i % 2 === 0 ? '3px solid rgba(18,128,106,.85)' : 'none', borderRight: i % 2 === 1 ? '3px solid rgba(18,128,106,.85)' : 'none',
              borderRadius: 6, opacity: MOTION.enter(.35 + i * .06, .4)(T), transform: `scale(${lerp(1.5, 1, MOTION.enter(.35 + i * .06, .4)(T))})`}} />
          ))}
          {/* tracking reticle */}
          <div style={{position: 'absolute', left: 786, top: 812, width: 28, height: 28, borderRadius: 28, border: '2px solid rgba(255,255,255,.8)', opacity: .85}} />
        </div>

        <ModeCard reveal={fill} style={{position: 'absolute', left: 520, top: 190, opacity: cardIn,
          transform: `translate(${slide * -1500}px, ${(1 - cardIn) * 50}px) scale(${lerp(.95, 1, cardIn)})`}} />

        <div style={{position: 'absolute', left: 610, top: 60, transform: `translateX(${(1 - slide) * 1500}px)`}}>
          <Phone><PhoneScreen fill={phoneFill} draw={flowDraw} focus={focus} /></Phone>
        </div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: '#F6F7F6', opacity: outro, pointerEvents: 'none'}} />
    </div>
  );
}
window.SandPiece = SandPiece;

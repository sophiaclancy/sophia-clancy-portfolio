/* Sand AR animation — AR card on light orange */
const SAND = {cream: '#F6F7F6', ink: '#1E2A2A', dim: '#6B7B7A', hot: '#12806A', bright: '#A3DCC4'};
const card = (r = 26) => ({background: 'rgba(250,251,250,.94)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,.75)', borderRadius: r, boxShadow: '0 50px 80px -34px rgba(16,60,58,.42), 0 2px 0 rgba(255,255,255,.7) inset', color: SAND.ink});

/* lo-fi text stand-in */
function Ln({w = 120, h = 7, o = .16, c = '30,42,42', style}) {
  return <div style={{width: w, height: h, borderRadius: h, background: `rgba(${c},${o})`, ...style}} />;
}

function ModeCard({reveal = 1, style}) {
  const modes = ['Peak', 'Steady', 'Fatigue', 'Rest'];
  return (
    <div style={{width: 560, overflow: 'hidden', ...card(32), ...style}}>
      <div style={{padding: '24px 28px 16px', display: 'flex', flexDirection: 'column', gap: 12}}>
        <Ln w={92} h={8} o={.14} />
        <div style={{fontSize: 36, fontWeight: 600, letterSpacing: '-.02em'}}>Golden Dunes</div>
      </div>
      <div style={{height: 156, position: 'relative', background: 'radial-gradient(40% 130% at 78% 16%, rgba(238,213,143,.5), rgba(238,213,143,0) 60%), linear-gradient(180deg,#DDF2E7,#9BD8C0 46%,#2C8B75)'}}>
        <div style={{position: 'absolute', right: 66, top: 26, width: 40, height: 40, borderRadius: 40, background: '#FBF1D2', boxShadow: '0 0 54px 22px rgba(242,219,152,.7)'}} />
        <div style={{position: 'absolute', inset: 'auto 0 0 0', height: 74, background: '#14705C', borderRadius: '60% 40% 0 0 / 100% 100% 0 0'}} />
      </div>
      <div style={{display: 'flex', gap: 9, padding: '18px 20px 10px'}}>
        {modes.map((m, i) => (
          <div key={m} style={{flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 15, fontSize: 17, fontWeight: 600,
            background: i === 0 ? SAND.bright : 'rgba(30,42,42,.06)', color: i === 0 ? '#0B3A30' : SAND.dim,
            boxShadow: i === 0 ? '0 14px 26px -12px rgba(18,128,106,.7)' : 'none'}}>{m}</div>
        ))}
      </div>
      <div style={{padding: '8px 28px 26px', display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{flex: 1, height: 10, borderRadius: 10, background: 'rgba(30,42,42,.1)', overflow: 'hidden'}}>
          <div style={{width: (reveal * 76) + '%', height: '100%', background: SAND.hot}} />
        </div>
        <div style={{fontSize: 18, fontWeight: 600, color: SAND.hot, minWidth: 52}}>{Math.round(reveal * 76)}%</div>
      </div>
    </div>
  );
}

Object.assign(window, {SAND, card, Ln, ModeCard});

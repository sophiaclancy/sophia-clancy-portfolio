/* Sand AR animation — phone mock */
const FLOW_PATH = 'M12 96 C 52 92, 66 40, 104 34 S 150 62, 186 66 S 244 88, 300 100';

function PhoneScreen({fill = 1, draw = 1, focus = 'mode'}) {
  const modes = ['Peak', 'Steady', 'Fatigue', 'Rest'];
  const box = (k) => ({background: '#FBFCFB', border: '1px solid rgba(30,42,42,.06)', borderRadius: 18,
    boxShadow: k ? '0 22px 38px -16px rgba(16,60,58,.4)' : '0 10px 20px -14px rgba(16,60,58,.22)',
    transform: k ? 'scale(1.015)' : 'none'});
  return (
    <div style={{position: 'absolute', inset: 0, background: '#F6F7F6', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, sans-serif', color: '#1E2A2A', padding: '56px 16px 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px'}}><Ln w={30} h={8} o={.2} /><Ln w={34} h={8} o={.2} /></div>
      <div style={{display: 'flex', gap: 6, marginTop: 18, alignItems: 'center'}}>
        <span style={{background: '#12806A', color: '#F6F7F6', fontSize: 11, fontWeight: 600, padding: '6px 14px', borderRadius: 999}}>Daily</span>
        <Ln w={46} h={20} o={.06} /><Ln w={38} h={20} o={.06} />
        <Ln w={40} h={20} o={.06} style={{marginLeft: 'auto'}} />
      </div>
      <div style={{fontSize: 46, fontWeight: 600, letterSpacing: '-.03em', margin: '10px 0 14px'}}>Sand</div>

      <div style={{overflow: 'hidden', ...box(focus === 'mode')}}>
        <div style={{height: 84, background: 'radial-gradient(40% 130% at 78% 16%, rgba(238,213,143,.5), rgba(238,213,143,0) 60%), linear-gradient(180deg,#DDF2E7,#9BD8C0 46%,#2C8B75)', position: 'relative'}}>
          <div style={{position: 'absolute', right: 34, top: 14, width: 22, height: 22, borderRadius: 22, background: '#FBF1D2', boxShadow: '0 0 30px 12px rgba(242,219,152,.6)'}} />
        </div>
        <div style={{display: 'flex', gap: 5, padding: 10}}>
          {modes.map((m, i) => <div key={m} style={{flex: 1, textAlign: 'center', fontSize: 9, fontWeight: 600, padding: '9px 0', borderRadius: 11, background: i === 0 ? '#A3DCC4' : 'rgba(30,42,42,.06)', color: i === 0 ? '#0B3A30' : '#8A9997'}}>{m}</div>)}
        </div>
        <div style={{padding: '0 12px 14px', display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{flex: 1, height: 6, borderRadius: 6, background: 'rgba(30,42,42,.09)', overflow: 'hidden'}}><div style={{width: (fill * 76) + '%', height: '100%', background: '#12806A'}} /></div>
          <span style={{fontSize: 10, fontWeight: 600, color: '#12806A'}}>{Math.round(fill * 76)}%</span>
        </div>
      </div>

      <div style={{marginTop: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, ...box(focus === 'risk')}}>
        <div style={{width: 38, height: 38, borderRadius: 38, border: '5px solid #12806A', borderRightColor: 'rgba(30,42,42,.1)', fontSize: 11, display: 'grid', placeItems: 'center', fontWeight: 700}}>76</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 7}}><Ln w={96} h={8} o={.16} /><Ln w={132} h={6} o={.1} /></div>
      </div>

      <div style={{marginTop: 18, padding: '14px 10px 10px', ...box(focus === 'flow')}}>
        <Ln w={104} h={8} o={.16} style={{margin: '0 4px 8px'}} />
        <svg width="100%" viewBox="0 0 312 110" style={{display: 'block'}}>
          {[30, 62, 94].map(y => <line key={y} x1="10" x2="302" y1={y} y2={y} stroke="rgba(30,42,42,.07)" strokeDasharray="4 6" />)}
          <path d={FLOW_PATH} fill="none" stroke="#12806A" strokeWidth="3.6" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
        </svg>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '4px 8px 0'}}>{[0, 1, 2, 3, 4, 5].map(i => <Ln key={i} w={14} h={5} o={.1} />)}</div>
      </div>
    </div>
  );
}

function Phone({children, style}) {
  return (
    <div style={{position: 'relative', width: 380, height: 780, borderRadius: 52, overflow: 'hidden', boxShadow: '0 80px 110px -45px rgba(16,60,58,.5)', ...style}}>
      {children}
    </div>
  );
}

Object.assign(window, {FLOW_PATH, PhoneScreen, Phone});

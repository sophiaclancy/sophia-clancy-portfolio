// screens.jsx — Contexto prototype screens.
const { useState, useEffect, useRef } = React;

/* ---------------- Workspaces Home ---------------- */
function Home({ workspaces, openWs, justCreated, startCreate }) {
  const featured = workspaces.find(w => w.id === justCreated) || workspaces[0];
  const fc = ACCENT[featured.accent];
  return (
    <div className="screen fade-enter">
      <div className="pg-head">
        <div>
          <h1 className="pg-title">Today</h1>
          <p className="pg-sub">{workspaces.length} workspaces · organized around what you were doing</p>
        </div>
        <span className="pg-meta">Monday, June 10</span>
      </div>

      <div className="sec-label">Pick up where you left off</div>
      <div className="ws-hero" onClick={()=>openWs(featured.id)} style={{ cursor:"pointer" }}>
        <span className="hero-glow" style={{ background:`linear-gradient(120deg, ${fc}, ${shade(fc,-22)})` }}></span>
        <span className="hero-in">
          <WsIcon accent={featured.accent} size={54} />
          <span>
            <h2>{featured.name}</h2>
            <p>Last active {featured.active.toLowerCase()} · {featured.count} files · {featured.blurb}</p>
          </span>
          <button className="btn-resume" onClick={(e)=>{e.stopPropagation(); openWs(featured.id);}}>{I.resume} Continue</button>
        </span>
      </div>

      <div className="sec-label">Your workspaces</div>
      <div className="ws-grid">
        {workspaces.map(w => (
          <WsCard key={w.id} ws={w} onClick={()=>openWs(w.id)} spawn={w.id===justCreated} />
        ))}
      </div>
    </div>
  );
}

function WsCard({ ws, onClick, spawn }) {
  const c = ACCENT[ws.accent];
  return (
    <div className={"ws-card" + (spawn ? " spawn" : "")} onClick={onClick}>
      <span className="accent-bar" style={{ background:`linear-gradient(90deg, ${c}, ${shade(c,-15)})` }}></span>
      <div className="ws-head">
        <WsIcon accent={ws.accent} />
        <div style={{ minWidth:0 }}>
          <div className="ws-name">{ws.name}</div>
          <div className="ws-blurb">{ws.blurb}</div>
        </div>
        <span className="ws-active">{ws.active}</span>
      </div>
      <div className="ws-thumbs">
        {ws.files.slice(0,5).map((f,i)=><FileDoc key={i} type={f.type} size={40} />)}
      </div>
      <div className="ws-foot">
        <span className="ws-count">{ws.count} files</span>
        <span className="app-row">{ws.apps.map(a=><AppDot key={a} app={a} />)}</span>
      </div>
    </div>
  );
}

/* ---------------- Inside a Workspace ---------------- */
function Workspace({ ws, openWs }) {
  const c = ACCENT[ws.accent];

  return (
    <div className="screen fade-enter">
      <div className="ws-hero" style={{ marginBottom:18 }}>
        <span className="hero-glow" style={{ background:`linear-gradient(120deg, ${c}, ${shade(c,-22)})` }}></span>
        <span className="hero-in">
          <WsIcon accent={ws.accent} size={54} />
          <span>
            <h2>{ws.name}</h2>
            <p>Last active {ws.active.toLowerCase()} · {ws.count} files · {ws.blurb}</p>
          </span>
          <button className="btn-resume">{I.resume} Reopen everything</button>
        </span>
      </div>

      <div className="sec-label">Files</div>
      <div>
        {ws.files.map((f,i)=>(
          <div className="frow" key={i}>
            <FileDoc type={f.type} size={40} />
            <div className="fmeta">
              <div className="fname">{f.name}</div>
              <div className="fwhy">{f.meta}</div>
            </div>
            <span className="ftime">{i===0 ? "Just now" : `${i+1}d ago`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Recents (the mess) + Progressive Organization ---------------- */
function Recents({ phase, onCreate, onDismiss }) {
  return (
    <div className="screen fade-enter">
      <div className="pg-head">
        <div>
          <h1 className="pg-title">Recents</h1>
          <p className="pg-sub">185 items · sorted by date added</p>
        </div>
      </div>

      {phase !== "dismissed" && (
        <div className="suggest">
          <span className="spark">{I.spark}</span>
          <span className="smeta">
            <div className="stitle">These 14 files look like one project</div>
            <div className="ssub">You've been working across <b>Figma, VS Code &amp; Safari</b> all week — group them as <b>“Portfolio Refresh”</b>?</div>
          </span>
          <span className="sactions">
            <button className="btn-ghost" onClick={onDismiss}>Not now</button>
            <button className="btn-primary" onClick={onCreate}>Create Workspace</button>
          </span>
        </div>
      )}

      <div className="mess-grid">
        {MESS.map((f,i)=>{
          const match = f.ws === "portfolio";
          let cls = "mess-item";
          if (phase === "gather") cls += match ? " glow" : " dim";
          return (
            <div className={cls} key={i} style={{ transitionDelay: match ? `${(i%14)*30}ms` : "0ms" }}>
              <FileDoc type={f.type} size={52} />
              <span className="mname">{f.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Constellation (Obsidian-style graph) ---------------- */
function Constellation({ openWs }) {
  // cluster centers in a 960x600 stage
  const centers = {
    dendrite: { x:300, y:200 }, portfolio: { x:610, y:150 }, cs61a: { x:790, y:330 },
    anthro: { x:560, y:440 }, abroad: { x:170, y:430 }, bi: { x:430, y:310 },
  };
  const nodes = [], edges = [];
  WORKSPACES.forEach(w => {
    const ctr = centers[w.id]; const c = ACCENT[w.accent];
    const n = Math.min(w.count, 8);
    nodes.push({ x:ctr.x, y:ctr.y, r:13, c, center:true, id:w.id, name:w.name });
    for (let k=0;k<n;k++){
      const ang = (k/n)*Math.PI*2 + w.id.length;
      const rad = 52 + (k%3)*16;
      const x = ctr.x + Math.cos(ang)*rad, y = ctr.y + Math.sin(ang)*rad;
      nodes.push({ x, y, r:5.5, c });
      edges.push({ x1:ctr.x, y1:ctr.y, x2:x, y2:y, c, w:1 });
    }
  });
  // a couple of faint cross-links (shared context)
  const cross = [["portfolio","bi"],["dendrite","bi"],["cs61a","portfolio"]];
  cross.forEach(([a,b])=>edges.push({ x1:centers[a].x,y1:centers[a].y,x2:centers[b].x,y2:centers[b].y,c:"#9aa3b2",w:1,dash:true }));

  return (
    <div className="screen fade-enter" style={{ padding:0 }}>
      <div className="graph-wrap">
        <div className="graph-legend">
          <h1 className="pg-title" style={{ fontSize:24 }}>Constellation</h1>
          <p className="pg-sub" style={{ maxWidth:300 }}>Every file is a node. The links are inferred — files you use together pull into the same cluster. <b>Clusters become Workspaces.</b></p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px 14px", marginTop:14 }}>
            {WORKSPACES.map(w=>(
              <span key={w.id} style={{ display:"flex", alignItems:"center", gap:7, fontSize:12.5, color:"#33333a" }}>
                <span style={{ width:9, height:9, borderRadius:9, background:ACCENT[w.accent] }}></span>{w.name}
              </span>
            ))}
          </div>
        </div>
        <div className="gstage">
          {edges.map((e,i)=>{
            const dx=e.x2-e.x1, dy=e.y2-e.y1;
            const len=Math.sqrt(dx*dx+dy*dy);
            const ang=Math.atan2(dy,dx)*180/Math.PI;
            return <div key={"e"+i} className="gedge" style={{
              left:e.x1, top:e.y1, width:len, transform:`rotate(${ang}deg)`,
              background:e.c, opacity:e.dash?0.22:0.3,
              ...(e.dash?{backgroundImage:`repeating-linear-gradient(90deg, ${e.c} 0 4px, transparent 4px 10px)`, background:"none"}:{})
            }}></div>;
          })}
          {nodes.map((n,i)=>(
            <div key={"n"+i} className="floaty" style={{ position:"absolute", left:n.x, top:n.y, animationDelay:`${(i%9)*-0.7}s` }}>
              <div className="gnode" style={{
                width:n.r*2, height:n.r*2, left:-n.r, top:-n.r,
                background:n.c, opacity:n.center?1:0.78, cursor:n.center?"pointer":"default",
                boxShadow:n.center?`0 0 0 9px ${n.c}28`:"none"
              }} onClick={n.center?()=>openWs(n.id):undefined}></div>
              {n.center && <div className="gname" style={{ top:n.r+6 }}>{n.name}</div>}
            </div>
          ))}
        </div>
        <div className="graph-hint">A living map of your work · click a cluster to open its Workspace</div>
      </div>
    </div>
  );
}

/* ---------------- Ask Finder ---------------- */
function AskFinder({ openWs }) {
  const full = ASK.query;
  const instant = new URLSearchParams(location.search).get("instant") === "1";
  const [typed, setTyped] = useState(instant ? full : "");
  const [done, setDone] = useState(instant);
  useEffect(()=>{
    if (instant) return;
    let i=0, alive=true;
    const tick=()=>{ if(!alive) return; if(i<=full.length){ setTyped(full.slice(0,i)); i++; setTimeout(tick, 38+Math.random()*40);} else { setTimeout(()=>alive&&setDone(true),350);} };
    const t=setTimeout(tick,500); return ()=>{ alive=false; clearTimeout(t); };
  },[]);
  const ws = WORKSPACES.find(w=>w.id===ASK.answerWs);
  return (
    <div className="screen fade-enter">
      <div className="ask-wrap">
        <div className="ask-bar">
          <span className="ai">{I.spark}</span>
          <span className="ask-q">{typed}</span>
          {!done && <span className="ask-cursor"></span>}
        </div>

        {done && (
          <div className="ask-answer">
            <div className="sec-label" style={{ marginTop:24 }}>Found it</div>
            <div className="frow" style={{ background:"rgba(255,255,255,.7)", border:"1px solid var(--hair)" }} >
              <FileDoc type="pdf" size={44} />
              <div className="fmeta">
                <div className="fname">{ASK.answerFile}</div>
                <div className="fwhy">in <b>{ws.name}</b></div>
              </div>
              <button className="btn-primary" onClick={()=>openWs(ws.id)}>Open</button>
            </div>
            <div className="ask-reason">{I.pin}<span>{ASK.reason}</span></div>
            <div className="ask-suggest">Try also:</div>
            <div>
              <span className="ask-chip">{I.spark} Files from the night before my Data 100 final</span>
              <span className="ask-chip">{I.spark} Everything I made in Dwinelle last week</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Home, Workspace, Recents, Constellation, AskFinder });

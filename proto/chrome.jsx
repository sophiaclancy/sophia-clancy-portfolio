// chrome.jsx — shared UI: icons, file thumbs, menubar, sidebar, toolbar.

const I = {
  back:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  fwd:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  search:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7"/><line x1="15.6" y1="15.6" x2="21" y2="21"/></svg>,
  plus:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  help:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9.2 9a2.8 2.8 0 1 1 4.3 2.4c-.9.6-1.5 1.1-1.5 2.1"/><circle cx="12" cy="17.3" r="1.1" fill="currentColor" stroke="none"/></svg>,
  chevDown:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  chevR: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>,
  today: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l2 4.7 4.9 1.4-3.6 3.4.6 5-3.9-2.4-3.9 2.4.6-5L1.6 8.7 6.5 7.3z"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14" strokeLinecap="round"/></svg>,
  files: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="14 3 14 9 20 9"/></svg>,
  star:  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.5 5.6L20.5 9l-4.4 4 1.2 6L12 16.9 6.7 19l1.2-6L3.5 9l5.9-.4z"/></svg>,
  graph: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="7" r="2.3"/><circle cx="18" cy="6" r="2.3"/><circle cx="17" cy="18" r="2.3"/><circle cx="8" cy="17" r="2.3"/><line x1="8" y1="8" x2="16" y2="7" strokeLinecap="round"/><line x1="7.5" y1="9" x2="8" y2="15" strokeLinecap="round"/><line x1="9.5" y1="16.5" x2="15.5" y2="17.5" strokeLinecap="round"/><line x1="9" y1="16" x2="16.5" y2="8" strokeLinecap="round"/></svg>,
  ask:   <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 3.8L17.4 7l-3 2.7.9 3.9L12 11.7 8.7 13.6l.9-3.9-3-2.7 3.8-1.2z"/><circle cx="18.5" cy="16.5" r="1.4"/><circle cx="6" cy="17" r="1.1"/></svg>,
  archive:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="3" y="4" width="18" height="4.5" rx="1.4"/><path d="M5 9h14v9.5A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5z"/><line x1="10" y1="12.5" x2="14" y2="12.5" strokeLinecap="round"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 6 20 6"/><path d="M7 6l1 13.5A1.5 1.5 0 0 0 9.5 21h5A1.5 1.5 0 0 0 16 19.5L17 6"/><path d="M9.5 6V4.5A1.5 1.5 0 0 1 11 3h2a1.5 1.5 0 0 1 1.5 1.5V6"/></svg>,
  stack: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 4.5-9 4.5-9-4.5z" opacity=".95"/><path d="M3 12l9 4.5 9-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity=".7"/></svg>,
  resume:<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  spark: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 4.6L18.5 8l-4.2 3 .8 5-3.1-2.6L8.9 16l.8-5L5.5 8l4.8-1.4z"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  link:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a3 3 0 0 1 3-3h3a3 3 0 0 1 0 6h-1"/><path d="M15 12a3 3 0 0 1-3 3H9a3 3 0 0 1 0-6h1"/></svg>,
  wifi:  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 18a1.6 1.6 0 1 0 0 3.2A1.6 1.6 0 0 0 12 18zM5.5 11.5a9 9 0 0 1 13 0l-1.6 1.6a6.7 6.7 0 0 0-9.8 0zM2.5 8.5a13 13 0 0 1 19 0l-1.6 1.6a10.7 10.7 0 0 0-15.8 0z"/></svg>,
  ctrl:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="12" r="2.4" fill="currentColor" stroke="none"/></svg>,
  batt:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="8" width="17" height="8" rx="2"/><rect x="3.5" y="9.5" width="12" height="5" rx="1" fill="currentColor" stroke="none"/><line x1="21" y1="11" x2="21" y2="13" strokeLinecap="round"/></svg>,
  pin:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>,
};

const APPS = {
  figma:  { bg:"#a259ff", t:"F" },
  vscode: { bg:"#1f8ad2", t:"{}" },
  safari: { bg:"#1f9bff", t:"S" },
  preview:{ bg:"#5aa0ec", t:"P" },
  voice:  { bg:"#ff5e5e", t:"●" },
  notes:  { bg:"#f5c33b", t:"≡" },
  mail:   { bg:"#3b9bff", t:"@" },
  xcode:  { bg:"#1f7ce0", t:"X" },
  github: { bg:"#24292e", t:"G" },
};

function AppDot({ app, className }) {
  const a = APPS[app] || { bg:"#888", t:"?" };
  return <span className={"app-dot " + (className||"")} style={{ background:a.bg }}>{a.t}</span>;
}

function WsIcon({ accent, size=42, glyph }) {
  const c = window.ACCENT[accent] || accent;
  return (
    <span className="ws-icon" style={{ width:size, height:size, borderRadius:size*0.29,
      background:`linear-gradient(150deg, ${c}, ${shade(c,-18)})` }}>
      {glyph || I.stack}
    </span>
  );
}

function shade(hex, pct){
  const n = parseInt(hex.slice(1),16); let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  const f = pct/100; r=Math.round(r+(255-r)*Math.max(0,f)+r*Math.min(0,f));
  g=Math.round(g+(255-g)*Math.max(0,f)+g*Math.min(0,f)); b=Math.round(b+(255-b)*Math.max(0,f)+b*Math.min(0,f));
  return `rgb(${r},${g},${b})`;
}

// document thumbnail
function FileDoc({ type, size=44 }) {
  const ft = window.FT[type] || window.FT.doc;
  const h = size, w = Math.round(size*0.8);
  return (
    <span className="fdoc" style={{ width:w, height:h }}>
      <span className="ln" style={{ top:"22%", width:"32%" }}></span>
      <span className="ln" style={{ top:"34%", width:"52%" }}></span>
      <span className="ln" style={{ top:"46%", width:"42%" }}></span>
      <span className="band" style={{ background:ft.grad, fontSize:Math.max(7,size*0.16) }}>{ft.band}</span>
    </span>
  );
}

function MenuBar() {
  return (
    <div className="menubar">
      <span className="apple"></span>
      <span className="mb-app">Finder</span>
      <span className="mb">File</span><span className="mb">Edit</span><span className="mb">View</span>
      <span className="mb">Go</span><span className="mb">Window</span><span className="mb">Help</span>
      <span className="mb-right">
        {I.wifi}{I.search}{I.ctrl}{I.batt}
        <span className="mb-clock">Mon Jun 10&nbsp;&nbsp;9:41 AM</span>
      </span>
    </div>
  );
}

function NavItem({ icon, label, count, active, onClick, dot }) {
  return (
    <div className={"nav-item" + (active ? " on" : "")} onClick={onClick}>
      {dot ? dot : <span className="ni-ic">{icon}</span>}
      <span>{label}</span>
      {count != null && <span className="ni-ct">{count}</span>}
    </div>
  );
}

function Sidebar({ route, go, openWs, workspaces }) {
  const list = workspaces || WORKSPACES;
  const isHome = route.name === "home" || route.name === "ws" || route.name === "create";
  return (
    <aside className="sidebar">
      <div className="profile">
        <span className="avatar">M</span>
        <span className="pname">Maya Chen</span>
        <span className="chev">{I.chevDown}</span>
      </div>
      <div className="sb-scroll">
        <NavItem icon={I.clock} label="Recents" active={route.name==="recents"} count={185} onClick={()=>go({name:"recents"})} />
        <NavItem icon={I.files} label="All Files" />
        <NavItem icon={I.star} label="Favorites" />

        <div className="sb-sec">
          <span className="chev">{I.chevDown}</span> WORKSPACES
          <span className="add">{I.plus}</span>
        </div>
        <NavItem icon={I.today} label="Today" active={isHome} count={list.length} onClick={()=>go({name:"home"})} />
        {list.map(w => (
          <NavItem key={w.id} label={w.name} count={w.count}
            active={route.name==="ws" && route.id===w.id}
            onClick={()=>openWs(w.id)}
            dot={<span className="ws-dot" style={{ background:`linear-gradient(150deg, ${ACCENT[w.accent]}, ${shade(ACCENT[w.accent],-18)})` }}>{I.stack}</span>} />
        ))}

        <div className="sb-sec"><span className="chev">{I.chevDown}</span> LABS</div>
        <NavItem icon={I.graph} label="Constellation" active={route.name==="graph"} onClick={()=>go({name:"graph"})} />
        <NavItem icon={I.ask} label="Ask Finder" active={route.name==="ask"} onClick={()=>go({name:"ask"})} />
      </div>
      <div className="sb-bottom">
        <NavItem icon={I.archive} label="Archive" />
        <NavItem icon={I.trash} label="Recently Deleted" />
      </div>
    </aside>
  );
}

function Toolbar({ title, onBack, canBack, onNew }) {
  return (
    <div className="toolbar">
      <span className="lights"><i className="r"></i><i className="y"></i><i className="g"></i></span>
      <span className="tb-nav" style={{ marginLeft:8 }}>
        <button disabled={!canBack} onClick={onBack}>{I.back}</button>
        <button disabled>{I.fwd}</button>
      </span>
      <span className="tb-search">{I.search}{title}</span>
      <span className="tb-help">{I.help}</span>
      <button className="btn-new" onClick={onNew}>{I.plus} New Workspace</button>
    </div>
  );
}

Object.assign(window, { I, APPS, AppDot, WsIcon, FileDoc, MenuBar, Sidebar, Toolbar, NavItem, shade });

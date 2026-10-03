// app.jsx — router, state, create animation, scaling.

function App() {
  const initial = (() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("screen");
    if (s === "graph") return { name: "graph" };
    if (s === "ask") return { name: "ask" };
    if (s === "recents") return { name: "recents" };
    if (s === "ws") return { name: "ws", id: params.get("id") || "dendrite" };
    return { name: "home" };
  })();
  const [route, setRoute] = useState(initial);
  const [hist, setHist] = useState([]);
  const [created, setCreated] = useState(() => new Set(["dendrite","cs61a","anthro","abroad","bi"])); // portfolio not yet created
  const [justCreated, setJustCreated] = useState(null);
  const [messPhase, setMessPhase] = useState(null); // null | gather | dismissed
  const [toast, setToast] = useState(false);

  const workspaces = WORKSPACES.filter(w => created.has(w.id));

  const go = (r) => { setHist(h => [...h, route]); setRoute(r); };
  const back = () => setHist(h => { if (!h.length) return h; const p = h[h.length-1]; setRoute(p); return h.slice(0,-1); });
  const openWs = (id) => go({ name: "ws", id });

  const onCreate = () => {
    setMessPhase("gather");
    setTimeout(() => {
      setCreated(s => new Set([...s, "portfolio"]));
      setJustCreated("portfolio");
      setHist([]); setRoute({ name: "home" });
      setMessPhase(null);
      setToast(true);
      setTimeout(() => setToast(false), 2600);
      setTimeout(() => setJustCreated(null), 1200);
    }, 1250);
  };

  const titleFor = () => {
    if (route.name === "ws") { const w = WORKSPACES.find(x=>x.id===route.id); return w ? w.name : "Workspace"; }
    return { home:"Search your files", recents:"Search Recents", graph:"Search the constellation", ask:"Ask Finder anything" }[route.name] || "Search";
  };

  let screen;
  if (route.name === "ws") {
    const w = WORKSPACES.find(x=>x.id===route.id);
    screen = <Workspace key={route.id} ws={w} openWs={openWs} />;
  } else if (route.name === "recents") {
    screen = <Recents key="recents" phase={messPhase} onCreate={onCreate} onDismiss={()=>setMessPhase("dismissed")} />;
  } else if (route.name === "graph") {
    screen = <Constellation key="graph" openWs={openWs} />;
  } else if (route.name === "ask") {
    screen = <AskFinder key="ask" openWs={openWs} />;
  } else {
    screen = <Home key={"home"+justCreated} workspaces={workspaces} openWs={openWs} justCreated={justCreated} />;
  }

  return (
    <div className="stage" id="stage">
      <div className="wall"><img className="wall-img" src="assets/contexto/wallpaper2.png" alt="" /></div>
      <MenuBar />
      <div className="window">
        <Toolbar title={titleFor()} onBack={back} canBack={hist.length>0} onNew={()=>go({name:"recents"})} />
        <div className="wbody">
          <Sidebar route={route} go={go} openWs={openWs} workspaces={workspaces} />
          <div className="content">
            {screen}
            {toast && <div className="toast">{I.check} Workspace “Portfolio Refresh” created</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function fit() {
  const stage = document.getElementById("stage");
  if (!stage) return;
  const s = Math.min(window.innerWidth / 1728, window.innerHeight / 1080);
  stage.style.transform = `translate(-50%,-50%) scale(${s})`;
  stage.style.position = "absolute";
  stage.style.left = "50%"; stage.style.top = "50%";
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
setTimeout(fit, 30);
window.addEventListener("resize", fit);

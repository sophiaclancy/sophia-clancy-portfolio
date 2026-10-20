import { createBrainScene } from "./brain-scene.js";
import { createEntryPortal } from "./entry-portal.js";
import { createBrainOverlay } from "./overlay.js";
import { NODES } from "./scene-data.js";

const canvas = document.getElementById("brain-canvas");
const overlayRoot = document.getElementById("brain-overlay");
const portalRoot = document.getElementById("entry-portal");

let overlay, pendingNodes = null;
const scene = createBrainScene({
  canvas,
  onProject: {
    onLabels: (labels, fade) => overlay && overlay.onLabels(labels, fade),
    onMoved: (m) => overlay && overlay.onMoved(m),
    onNodeSet: (list) => { if (overlay) overlay.setNodes(list); else pendingNodes = list; },
    onWorld: (world, activeId) => { if (overlay) { overlay.setWorld(world, world || ""); overlay.setActive(activeId); } },
  },
});

overlay = createBrainOverlay(overlayRoot, {
  onHover: (id) => scene.setHover(id),
  onSelect: (id) => {
    const next = id === scene.activeId ? null : id;
    scene.select(next);
    overlay.setActive(next);
  },
  onReset: () => { scene.resetView(false); overlay.setActive(null); },
  onHome: () => { scene.setWorld(null); overlay.setActive(null); },
});
overlay.setNodes(pendingNodes || NODES);

createEntryPortal(portalRoot, {
  onEnter: () => {
    document.body.classList.add("is-entered");
    scene.enter();
    overlay.reveal();
  },
});

window.brainScene = scene;

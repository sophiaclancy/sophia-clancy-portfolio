import { createBrainScene } from "./brain-scene.js";
import { createEntryPortal } from "./entry-portal.js";
import { createBrainOverlay } from "./overlay.js";

const canvas = document.getElementById("brain-canvas");
const overlayRoot = document.getElementById("brain-overlay");
const portalRoot = document.getElementById("entry-portal");

let overlay;
const scene = createBrainScene({
  canvas,
  onProject: {
    onLabels: (labels, fade) => overlay && overlay.onLabels(labels, fade),
    onMoved: (m) => overlay && overlay.onMoved(m),
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
});

createEntryPortal(portalRoot, {
  onEnter: () => {
    document.body.classList.add("is-entered");
    scene.enter();
    overlay.reveal();
  },
});

window.brainScene = scene;

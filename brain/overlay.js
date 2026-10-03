// BrainOverlay — DOM layer: projected node labels, the contextual panel,
// world breadcrumb and view controls. Node sets are rebuilt on demand so the
// same overlay serves the brain, a world, or a branched cluster.

export function createBrainOverlay(root, { onHover, onSelect, onReset, onHome }) {
  const labelLayer = root.querySelector(".bo-labels");
  const panel = root.querySelector(".bo-panel");
  const panelLabel = panel.querySelector(".bo-panel-label");
  const panelDesc = panel.querySelector(".bo-panel-desc");
  const closeBtn = panel.querySelector(".bo-panel-close");
  const resetBtn = root.querySelector(".bo-reset");
  const crumb = root.querySelector(".bo-crumb");
  const homeBtn = root.querySelector(".bo-home");

  let data = [];
  const els = new Map();

  closeBtn.addEventListener("click", () => onSelect(null));
  resetBtn.addEventListener("click", () => onReset());
  homeBtn.addEventListener("click", () => onHome());
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (document.activeElement && document.activeElement.tagName === "INPUT") return;
    onSelect(null);
  });

  function setNodes(list) {
    data = list;
    labelLayer.textContent = "";
    els.clear();
    list.forEach((n) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "bo-label" + (n.type === "scene" ? " is-scene" : "");
      b.dataset.accent = n.accent;
      b.innerHTML = '<span class="bo-tick"></span><span class="bo-name"></span>';
      b.querySelector(".bo-name").textContent = n.label;
      b.addEventListener("pointerenter", () => onHover(n.id));
      b.addEventListener("pointerleave", () => onHover(null));
      b.addEventListener("focus", () => onHover(n.id));
      b.addEventListener("blur", () => onHover(null));
      b.addEventListener("click", () => onSelect(n.id));
      labelLayer.appendChild(b);
      els.set(n.id, b);
    });
  }

  const api = {
    setNodes,
    onLabels(labels, fade) {
      labelLayer.style.opacity = fade;
      for (const l of labels) {
        const el = els.get(l.id);
        if (!el) continue;
        if (!Number.isFinite(l.x) || !Number.isFinite(l.y)) { el.style.visibility = "hidden"; continue; }
        const x = Math.min(Math.max(l.x, 18), Math.max(20, window.innerWidth - 150));
        const y = Math.min(Math.max(l.y, 56), Math.max(60, window.innerHeight - 86));
        el.style.transform = "translate3d(" + Math.round(x) + "px," + Math.round(y) + "px,0)";
        el.style.visibility = l.visible ? "visible" : "hidden";
      }
    },
    onMoved(moved) { resetBtn.classList.toggle("is-on", moved); },
    setWorld(world, label) {
      crumb.textContent = world ? label : "";
      crumb.classList.toggle("is-on", !!world);
      homeBtn.classList.toggle("is-on", !!world);
    },
    setActive(id) {
      els.forEach((el, key) => el.classList.toggle("is-active", key === id));
      const n = data.find((x) => x.id === id);
      panel.classList.add("is-open");
      if (!n) {
        panelLabel.textContent = "PICK AT MY BRAIN";
        panelDesc.textContent = "choose a thought";
        panel.dataset.accent = "rest";
        closeBtn.hidden = true;
        return;
      }
      panelLabel.textContent = n.label;
      panelDesc.textContent = n.description;
      panel.dataset.accent = n.accent;
      closeBtn.hidden = false;
    },
    reveal() { root.classList.add("is-live"); api.setActive(null); },
  };
  return api;
}

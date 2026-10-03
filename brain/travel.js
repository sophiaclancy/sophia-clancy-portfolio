import { WORLD_DEF, sceneLabel } from "./worlds.js";

// Travel — turns a brain response's `destination` into camera + world motion.
// The AI says where; this module decides how.
//   none   answer in place
//   focus  glide toward the related node
//   dive   travel into another world (pixel wipe at the cut)
//   branch current world stays, new nodes grow outward

export function createTravel({ scene, overlay, wipeEl }) {
  function wipe() {
    if (scene.reduced) return;
    wipeEl.classList.remove("is-on");
    void wipeEl.offsetWidth;
    wipeEl.classList.add("is-on");
    setTimeout(() => wipeEl.classList.remove("is-on"), 700);
  }

  function announce() {
    const w = scene.world;
    overlay.setWorld(w, w ? WORLD_DEF[w].label : "");
    overlay.setActive(scene.activeId);
  }

  async function travel(res) {
    const d = res.destination || {};
    const target = d.scene || res.path?.[res.path.length - 1] || null;

    if (d.transition === "dive") {
      const gate = res.path?.find((id) => nodeExists(id)) || target;
      await scene.dive({ nodeId: gate, world: d.world, scene: d.scene, onFlash: wipe });
      announce();
      return;
    }

    if (d.transition === "branch") {
      const host = res.path?.find((id) => nodeExists(id));
      const grow = (res.path || []).filter((id) => id !== host);
      scene.branch(host, grow.length ? grow : res.relatedNodes);
      announce();
      return;
    }

    if (d.transition === "focus") {
      if (target && scene.focus(target)) { announce(); return; }
      // the named scene is not in this world — dive instead of doing nothing
      if (d.world && WORLD_DEF[d.world] && d.world !== scene.world) {
        await scene.dive({ nodeId: res.path?.[0], world: d.world, scene: d.scene, onFlash: wipe });
      }
      announce();
      return;
    }

    announce(); // "none"
  }

  function nodeExists(id) {
    return scene.three.nodes().some((n) => n.data.id === id);
  }

  function home() {
    wipe();
    scene.setWorld(null, null);
    announce();
  }

  return { travel, home, announce, label: sceneLabel };
}

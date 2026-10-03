import * as THREE from "three";
import { NODES, PALETTE, CAMERA } from "./scene-data.js";
import { WORLD_DEF, layoutScenes, layoutBranch } from "./worlds.js";
import { createBrainCore } from "./brain-core.js";
import { createThoughtNode } from "./thought-node.js";
import { createEnvironment } from "./environment.js";

// BrainScene — owns renderer, camera rig, node sets and the render loop.
// All continuous motion runs on refs inside the loop; no per-frame framework state.
// Travel verbs (focus / dive / branch) are exposed for travel.js to drive.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function createBrainScene({ canvas, onProject }) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const quality = coarse ? 0.55 : 1;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 2 : 1.75));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(PALETTE.bg, 0.085);
  const bgNow = new THREE.Color(PALETTE.bg);
  const bgGoal = new THREE.Color(PALETTE.bg);
  let fogGoal = 0.085;
  renderer.setClearColor(bgNow, 1);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);

  const core = createBrainCore({ quality });
  const env = createEnvironment({ quality });
  scene.add(core.group, env.group);

  let nodes = [];
  let world = null; // null = the brain itself

  function disposeNodes() {
    for (const n of nodes) {
      scene.remove(n.group);
      n.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    }
    nodes = [];
  }
  function setNodeSet(list) {
    disposeNodes();
    nodes = list.map(createThoughtNode);
    nodes.forEach((n) => scene.add(n.group));
    if (onProject) onProject.onNodeSet(list);
  }

  // camera rig -----------------------------------------------------------
  const rig = { yaw: CAMERA.home.yaw, pitch: CAMERA.home.pitch, dist: CAMERA.home.dist, look: new THREE.Vector3().fromArray(CAMERA.home.look) };
  const goal = { yaw: rig.yaw, pitch: rig.pitch, dist: rig.dist, look: rig.look.clone() };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let dragging = false, lastX = 0, lastY = 0, moved = false;
  let hoverId = null, activeId = null;

  const entry = { t: reduced ? 1 : 0, running: false };

  let lastW = 0, lastH = 0;
  function resize() {
    const w = Math.max(1, canvas.clientWidth || window.innerWidth || 1);
    const h = Math.max(1, canvas.clientHeight || window.innerHeight || 1);
    if (w === lastW && h === lastH) return;
    lastW = w; lastH = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);

  // input ----------------------------------------------------------------
  function onPointerMove(e) {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    if (dragging && !coarse) {
      goal.yaw = clamp(goal.yaw - (e.clientX - lastX) * 0.004, -CAMERA.clamp.yaw, CAMERA.clamp.yaw);
      goal.pitch = clamp(goal.pitch + (e.clientY - lastY) * 0.003, -CAMERA.clamp.pitch, CAMERA.clamp.pitch);
      lastX = e.clientX; lastY = e.clientY;
      moved = true;
      if (onProject) onProject.onMoved(true);
    }
  }
  function onDown(e) { if (coarse) return; dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.style.cursor = "grabbing"; }
  function onUp() { dragging = false; canvas.style.cursor = ""; }
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);

  // travel ---------------------------------------------------------------
  function aimAt(node, dist) {
    const p = new THREE.Vector3().fromArray(node.data.position);
    goal.look.copy(p).multiplyScalar(0.42);
    goal.yaw = clamp(Math.atan2(p.x, Math.abs(p.z) + 2.2) * 0.55, -CAMERA.clamp.yaw, CAMERA.clamp.yaw);
    goal.pitch = clamp(CAMERA.home.pitch - p.y * 0.07, -CAMERA.clamp.pitch, CAMERA.clamp.pitch);
    goal.dist = dist;
    moved = true;
    if (onProject) onProject.onMoved(true);
  }

  function select(id) {
    activeId = id;
    core.flash();
    core.setFocus(id || hoverId);
    core.setCohesion(id ? 1 : 0);
    if (!id) return resetView(true);
    const n = nodes.find((x) => x.data.id === id);
    if (n) aimAt(n, 5.5);
  }

  function resetView(keepSelection) {
    if (!keepSelection) { activeId = null; core.setFocus(null); core.setCohesion(world ? 1 : 0); }
    goal.yaw = CAMERA.home.yaw;
    goal.pitch = CAMERA.home.pitch;
    goal.dist = CAMERA.home.dist;
    goal.look.fromArray(CAMERA.home.look);
    moved = false;
    if (onProject) onProject.onMoved(false);
  }

  function setWorld(id, sceneId) {
    world = id && WORLD_DEF[id] ? id : null;
    const def = world ? WORLD_DEF[world] : null;
    bgGoal.set(def ? def.bg : PALETTE.bg);
    fogGoal = def ? def.fog : 0.085;
    core.setRemote(world ? 1 : 0);
    core.setCohesion(world ? 1 : 0);
    setNodeSet(world ? layoutScenes(def.scenes) : NODES);
    activeId = sceneId && nodes.some((n) => n.data.id === sceneId) ? sceneId : null;
    core.setFocus(null);
    resetView(true);
    rig.dist = world ? 3.4 : 8.2; // rush out of / back from the transition
    if (activeId) select(activeId);
    if (onProject) onProject.onWorld(world, activeId);
  }

  // focus: glide toward a node in the current world
  function focus(id) {
    const n = nodes.find((x) => x.data.id === id);
    if (!n) return false;
    select(id);
    return true;
  }

  // branch: keep the world, grow new nodes outward from a node
  function branch(fromId, ids) {
    const host = nodes.find((x) => x.data.id === fromId) || nodes[0];
    const from = host ? host.data.position : [-0.7, 0, 0];
    const have = new Set(nodes.map((n) => n.data.id));
    const fresh = (ids || []).filter((id) => !have.has(id)).slice(0, 3);
    if (!fresh.length) return focus(fromId);
    setNodeSet([...nodes.map((n) => n.data), ...layoutBranch(fresh, from)]);
    core.flash(0.7);
    core.setCohesion(0.55);
    return focus(fresh[0]);
  }

  // dive: travel into another world. onFlash fires at the cut.
  function dive({ nodeId, world: worldId, scene: sceneId, onFlash }) {
    const n = nodes.find((x) => x.data.id === nodeId);
    if (n) aimAt(n, 1.5);
    core.setCohesion(1);
    core.flash(1);
    return new Promise((res) => {
      setTimeout(() => {
        if (onFlash) onFlash();
        setWorld(worldId, sceneId);
        res();
      }, reduced ? 0 : 430);
    });
  }

  // loop -----------------------------------------------------------------
  const clock = new THREE.Clock();
  const projected = new THREE.Vector3();
  let raf = 0, timer = 0, frames = 0, mode = "raf";

  function schedule() {
    if (mode === "raf") raf = requestAnimationFrame(frame);
    else timer = setTimeout(frame, 16);
  }

  function frame() {
    frames++;
    schedule();
    resize();
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    if (entry.running) {
      entry.t = Math.min(1, entry.t + dt / 0.9);
      if (entry.t >= 1) entry.running = false;
    }
    const e = entry.t;
    const ease = 1 - Math.pow(1 - e, 3) + Math.sin(e * Math.PI) * 0.05;

    const k = Math.min(1, dt * (reduced ? 60 : 6.5));
    rig.yaw += (goal.yaw - rig.yaw) * k;
    rig.pitch += (goal.pitch - rig.pitch) * k;
    rig.dist += (goal.dist - rig.dist) * k;
    rig.look.lerp(goal.look, k);

    const pk = Math.min(1, dt * 6);
    pointer.x += (pointer.tx - pointer.x) * pk;
    pointer.y += (pointer.ty - pointer.y) * pk;

    const par = coarse || reduced ? 0.02 : 0.09;
    const yaw = rig.yaw + pointer.x * par;
    const pitch = rig.pitch + pointer.y * par * 0.6;
    const dist = THREE.MathUtils.lerp(0.35, rig.dist, ease);

    camera.position.set(
      rig.look.x + Math.sin(yaw) * Math.cos(pitch) * dist,
      rig.look.y + Math.sin(pitch) * dist,
      rig.look.z + Math.cos(yaw) * Math.cos(pitch) * dist
    );
    camera.lookAt(rig.look);

    const bk = Math.min(1, dt * 2.4);
    bgNow.lerp(bgGoal, bk);
    renderer.setClearColor(bgNow, 1);
    scene.fog.color.copy(bgNow);
    scene.fog.density += (fogGoal - scene.fog.density) * bk;

    core.update(t, dt, pointer, reduced);
    env.update(t, dt, reduced);

    const anyHover = hoverId !== null;
    const labels = [];
    for (const n of nodes) {
      const id = n.data.id;
      n.update(t, dt, {
        hover: hoverId === id ? 1 : 0,
        active: activeId === id ? 1 : 0,
        dim: (anyHover && hoverId !== id) || (activeId && activeId !== id) ? 1 : 0,
      }, reduced);
      projected.copy(n.world).project(camera);
      const lx = (projected.x * 0.5 + 0.5) * lastW;
      const ly = (-projected.y * 0.5 + 0.5) * lastH;
      labels.push({ id, x: lx, y: ly, visible: projected.z < 1 && Number.isFinite(lx) && Number.isFinite(ly) });
    }
    if (onProject) onProject.onLabels(labels, Math.min(1, entry.t * 1.4));

    renderer.render(scene, camera);
  }

  setNodeSet(NODES);
  resize();
  frame();
  // Some embedded/offscreen contexts never fire rAF — fall back to a timer loop.
  setTimeout(() => {
    if (frames < 3 && mode === "raf") { cancelAnimationFrame(raf); mode = "timer"; schedule(); }
  }, 320);

  return {
    reduced, coarse,
    three: { scene, camera, renderer, core, nodes: () => nodes, rig, goal, entry },
    enter() { entry.running = !reduced; entry.t = reduced ? 1 : 0; },
    select, resetView, setWorld, focus, branch, dive,
    setHover(id) { hoverId = id; core.setFocus(id || activeId); if (id) core.flash(0.5); },
    get activeId() { return activeId; },
    get world() { return world; },
    get moved() { return moved; },
    dispose() {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onUp);
      renderer.dispose();
    },
  };
}

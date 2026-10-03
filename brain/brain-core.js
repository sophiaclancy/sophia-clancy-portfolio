import * as THREE from "three";
import { PALETTE, NODES } from "./scene-data.js";

// BrainCore — abstract sculptural core built from pixel squares, outlined boxes,
// short line segments and points. No anatomical model, no glow.
// A share of the cubes drifts just outside the silhouette and reconnects when a
// category is selected (cohesion 0 -> 1).

const GRID = 0.062; // quantization step -> "pixel" feel
const snap = (v) => Math.round(v / GRID) * GRID;
const OFFSET_X = -0.7; // sits slightly left of centre

function shellPoint(rng) {
  const u = rng() * 2 - 1;
  const a = rng() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  let x = s * Math.cos(a), y = u, z = s * Math.sin(a);
  const fold = 0.085 * Math.sin(5.5 * Math.atan2(z, x)) + 0.07 * Math.sin(4.5 * Math.asin(Math.max(-1, Math.min(1, y))));
  let r = 1 + fold;
  r *= 1 + 0.07 * x;
  x *= 1.55 * r; y *= 1.02 * r; z *= 1.12 * r;
  const groove = 1 - 0.2 * Math.exp(-((z / 0.16) ** 2)) * Math.max(0, y);
  x *= groove; y *= groove;
  return [x, y, z];
}

function cerebellum(rng) {
  const u = rng() * 2 - 1, a = rng() * Math.PI * 2, s = Math.sqrt(1 - u * u);
  const r = 0.42 + 0.05 * Math.sin(7 * a);
  return [-1.12 + s * Math.cos(a) * r * 1.1, -0.62 + u * r * 0.72, s * Math.sin(a) * r * 1.25];
}

function stem(rng) {
  const t = rng();
  const r = 0.14 * (1 - t * 0.45);
  const a = rng() * Math.PI * 2;
  return [-0.5 + Math.cos(a) * r, -0.92 - t * 0.42, Math.sin(a) * r];
}

function mulberry(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createBrainCore({ quality = 1 } = {}) {
  const rng = mulberry(20260921);
  const SCALE = 0.78;
  const group = new THREE.Group();
  group.position.x = OFFSET_X;
  group.scale.setScalar(SCALE);

  const N = Math.round(1450 * quality);
  const OUTLINED = Math.round(N * 0.11);
  const pts = [];
  for (let i = 0; i < N + OUTLINED; i++) {
    const roll = rng();
    const p = roll < 0.82 ? shellPoint(rng) : roll < 0.95 ? cerebellum(rng) : stem(rng);
    pts.push([snap(p[0]), snap(p[1]), snap(p[2])]);
  }

  const cNavy = new THREE.Color(PALETTE.navy);
  const cPale = new THREE.Color(PALETTE.pale);
  const cPink = new THREE.Color(PALETTE.pink);
  const cLime = new THREE.Color(PALETTE.lime);
  const cOrange = new THREE.Color(PALETTE.orange);
  const ACCENT = { pink: cPink, lime: cLime, orange: cOrange };

  const mkMesh = (count, size, wireframe, opacity) => {
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshBasicMaterial({ wireframe, transparent: true, opacity });
    const m = new THREE.InstancedMesh(geo, mat, count);
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    return m;
  };

  const pixels = mkMesh(N, 0.052, false, 0.95);
  const boxes = mkMesh(OUTLINED, 0.1, true, 0.55);

  const dummy = new THREE.Object3D();
  const signals = [];
  const base = new Float32Array(N * 3);
  const baseCol = new Float32Array(N * 3);
  const scaleOf = new Float32Array(N);
  const drifters = []; // {i, ox, oy, oz, ph}
  let pi = 0, bi = 0;
  const tmp = new THREE.Color();

  for (let i = 0; i < pts.length; i++) {
    const [x, y, z] = pts[i];
    const outlined = i >= N;
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, 0, 0);
    const jitter = 0.82 + rng() * 0.5;
    dummy.scale.setScalar(outlined ? 0.8 + rng() * 0.7 : jitter);
    dummy.updateMatrix();
    if (outlined) {
      boxes.setMatrixAt(bi, dummy.matrix);
      tmp.copy(cNavy).lerp(cPale, 0.1 + rng() * 0.22);
      boxes.setColorAt(bi, tmp);
      bi++;
      continue;
    }
    pixels.setMatrixAt(pi, dummy.matrix);
    base[pi * 3] = x; base[pi * 3 + 1] = y; base[pi * 3 + 2] = z;
    scaleOf[pi] = jitter;
    const depth = (z + 1.3) / 2.6;
    const roll = rng();
    if (roll < 0.019) { tmp.copy(cPink).lerp(cNavy, 0.4); signals.push(pi); }
    else if (roll < 0.027) tmp.copy(cLime).lerp(cNavy, 0.55);
    else if (roll < 0.032) tmp.copy(cOrange).lerp(cNavy, 0.5);
    else tmp.copy(cNavy).lerp(cPale, 0.06 + depth * 0.42 * (0.5 + rng() * 0.6));
    pixels.setColorAt(pi, tmp);
    baseCol[pi * 3] = tmp.r; baseCol[pi * 3 + 1] = tmp.g; baseCol[pi * 3 + 2] = tmp.b;
    // a share of cubes drifts outside the silhouette
    if (rng() < 0.13) {
      const n = Math.hypot(x, y, z) || 1;
      const d = 0.16 + rng() * 0.4;
      drifters.push({ i: pi, ox: (x / n) * d, oy: (y / n) * d, oz: (z / n) * d, ph: rng() * 6.28 });
    }
    pi++;
  }
  pixels.instanceColor.needsUpdate = true;
  boxes.instanceColor.needsUpdate = true;
  group.add(pixels, boxes);

  // per-node cube clusters: cubes on the side of the brain facing each node
  const focusSets = {};
  for (const n of NODES) {
    const dir = new THREE.Vector3().fromArray(n.position).sub(new THREE.Vector3(OFFSET_X, 0, 0)).normalize();
    const scored = [];
    for (let i = 0; i < N; i += 3) {
      const d = base[i * 3] * dir.x + base[i * 3 + 1] * dir.y + base[i * 3 + 2] * dir.z;
      scored.push([d, i]);
    }
    scored.sort((a, b) => b[0] - a[0]);
    focusSets[n.id] = scored.slice(0, 46).map((s) => s[1]);
  }

  // short line segments between nearby shell pixels
  const segCount = Math.round(190 * quality);
  const segPos = new Float32Array(segCount * 6);
  for (let i = 0; i < segCount; i++) {
    const a = Math.floor(rng() * N);
    const ax = base[a * 3], ay = base[a * 3 + 1], az = base[a * 3 + 2];
    const len = 0.1 + rng() * 0.26;
    const dx = (rng() - 0.5), dy = (rng() - 0.5), dz = (rng() - 0.5);
    const n = Math.hypot(dx, dy, dz) || 1;
    segPos.set([ax, ay, az, ax + (dx / n) * len, ay + (dy / n) * len, az + (dz / n) * len], i * 6);
  }
  const segGeo = new THREE.BufferGeometry();
  segGeo.setAttribute("position", new THREE.BufferAttribute(segPos, 3));
  group.add(new THREE.LineSegments(segGeo, new THREE.LineBasicMaterial({ color: PALETTE.pale, transparent: true, opacity: 0.22 })));

  // interior points
  const ptCount = Math.round(520 * quality);
  const pPos = new Float32Array(ptCount * 3);
  for (let i = 0; i < ptCount; i++) {
    const k = Math.floor(rng() * N);
    const f = 0.35 + rng() * 0.5;
    pPos[i * 3] = base[k * 3] * f; pPos[i * 3 + 1] = base[k * 3 + 1] * f; pPos[i * 3 + 2] = base[k * 3 + 2] * f;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  group.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: PALETTE.pale, size: 0.022, transparent: true, opacity: 0.4 })));

  // channel-offset ghosts (very subtle RGB separation on interaction)
  const ghost = (color, dx) => {
    const g = new THREE.LineSegments(segGeo.clone(), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 }));
    g.position.x = dx;
    return g;
  };
  const ghostA = ghost(PALETTE.pink, 0.05);
  const ghostB = ghost(PALETTE.lime, -0.05);
  group.add(ghostA, ghostB);

  let sepTarget = 0, sep = 0;
  let cohesionGoal = 0, cohesion = 0;
  let remoteGoal = 0, remote = 0; // 1 = pushed back into the distance
  let focusId = null, focusPrev = null, focusMix = 0, focusGoal = 0;
  const pulse = (t, i) => 0.5 + 0.5 * Math.sin(t * 1.4 + i * 1.7);

  function paint(indices, color, mix) {
    for (const i of indices) {
      tmp.setRGB(baseCol[i * 3], baseCol[i * 3 + 1], baseCol[i * 3 + 2]).lerp(color, mix);
      pixels.setColorAt(i, tmp);
    }
  }

  return {
    group,
    // Extension points: focus/cohesion are how future node layers drive the core.
    flash(strength = 1) { sepTarget = Math.max(sepTarget, strength); },
    setFocus(id) {
      if (id === focusId) return;
      if (focusId) focusPrev = focusId;
      focusId = id;
      focusGoal = id ? 1 : 0;
      if (id) sepTarget = Math.max(sepTarget, 0.55);
    },
    setCohesion(v) { cohesionGoal = v; },
    setRemote(v) { remoteGoal = v; },
    update(t, dt, pointer, reduced) {
      remote += (remoteGoal - remote) * Math.min(1, dt * (reduced ? 60 : 4.2));
      group.position.set(OFFSET_X * (1 - remote) - 0.25 * remote, 0.55 * remote, -7 * remote);
      if (!reduced) {
        group.rotation.y = t * 0.055 + pointer.x * 0.16 * (1 - remote);
        group.rotation.x = Math.sin(t * 0.13) * 0.035 + pointer.y * -0.09 * (1 - remote);
        group.scale.setScalar((SCALE * (1 - remote) + 0.42 * remote) * (1 + Math.sin(t * 0.5) * 0.008));
      } else {
        group.scale.setScalar(SCALE * (1 - remote) + 0.42 * remote);
      }
      sepTarget *= Math.exp(-dt * 4.5);
      sep += (sepTarget - sep) * Math.min(1, dt * 12);
      ghostA.material.opacity = sep * 0.3;
      ghostB.material.opacity = sep * 0.22;

      // drift / reconnect
      const ck = Math.min(1, dt * (reduced ? 60 : 5));
      const prevCoh = cohesion;
      cohesion += (cohesionGoal - cohesion) * ck;
      const moving = !reduced || Math.abs(cohesion - prevCoh) > 0.0005;
      if (moving) {
        const out = 1 - cohesion;
        for (const d of drifters) {
          const w = out * (1 + (reduced ? 0 : Math.sin(t * 0.5 + d.ph) * 0.18));
          dummy.position.set(base[d.i * 3] + d.ox * w, base[d.i * 3 + 1] + d.oy * w, base[d.i * 3 + 2] + d.oz * w);
          dummy.rotation.set(0, reduced ? 0 : t * 0.12 + d.ph, 0);
          dummy.scale.setScalar(scaleOf[d.i] * (1 - out * 0.15));
          dummy.updateMatrix();
          pixels.setMatrixAt(d.i, dummy.matrix);
        }
        pixels.instanceMatrix.needsUpdate = true;
      }

      // focus tint
      const fk = Math.min(1, dt * (reduced ? 60 : 9));
      const prevMix = focusMix;
      focusMix += (focusGoal - focusMix) * fk;
      let dirty = false;
      if (Math.abs(focusMix - prevMix) > 0.002) {
        if (focusPrev && focusPrev !== focusId) paint(focusSets[focusPrev], cPale, 0);
        const id = focusId || focusPrev;
        const node = NODES.find((n) => n.id === id);
        if (node) paint(focusSets[id], ACCENT[node.accent] || cPink, focusMix * 0.85);
        dirty = true;
        if (focusMix < 0.004 && !focusId) focusPrev = null;
      }

      if (!reduced) {
        for (let i = 0; i < signals.length; i++) {
          tmp.copy(cNavy).lerp(cPink, 0.15 + 0.45 * pulse(t, i));
          pixels.setColorAt(signals[i], tmp);
        }
        dirty = dirty || signals.length > 0;
      }
      if (dirty) pixels.instanceColor.needsUpdate = true;
    },
  };
}

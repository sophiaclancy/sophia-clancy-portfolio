import * as THREE from "three";
import { PALETTE } from "./scene-data.js";

// Environment — quiet digital field: distant nodes, tiny fragments, faint long lines.
// Deliberately sparse; the centre stays the focus.

function mulberry(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createEnvironment({ quality = 1 } = {}) {
  const rng = mulberry(7712);
  const group = new THREE.Group();

  // distant outlined nodes
  const shellGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.3, 0.3, 0.3));
  const shellMat = new THREE.LineBasicMaterial({ color: PALETTE.navy, transparent: true, opacity: 0.45 });
  const far = Math.round(14 * quality);
  for (let i = 0; i < far; i++) {
    const m = new THREE.LineSegments(shellGeo, shellMat);
    const r = 8 + rng() * 9;
    const a = rng() * Math.PI * 2;
    const y = (rng() - 0.5) * 9;
    m.position.set(Math.cos(a) * r, y, Math.sin(a) * r * 0.7 - 3);
    m.scale.setScalar(0.6 + rng() * 1.6);
    group.add(m);
  }

  // a few very large, barely-visible wireframe cubes
  const bigMat = new THREE.LineBasicMaterial({ color: PALETTE.navy, transparent: true, opacity: 0.12 });
  for (let i = 0; i < 4; i++) {
    const size = 3.5 + rng() * 4.5;
    const m = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size)), bigMat);
    const a = rng() * Math.PI * 2;
    m.position.set(Math.cos(a) * (7 + rng() * 5), (rng() - 0.5) * 7, Math.sin(a) * 5 - 11);
    m.rotation.set(rng(), rng(), rng());
    group.add(m);
  }

  // tiny square fragments
  const count = Math.round(230 * quality);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 5 + rng() * 13;
    const a = rng() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = (rng() - 0.5) * 12;
    pos[i * 3 + 2] = Math.sin(a) * r * 0.8 - 2;
  }
  const fragGeo = new THREE.BufferGeometry();
  fragGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const frags = new THREE.Points(fragGeo, new THREE.PointsMaterial({ color: PALETTE.pale, size: 0.05, transparent: true, opacity: 0.3 }));
  group.add(frags);

  // faint long line segments
  const lines = 9;
  const lp = new Float32Array(lines * 6);
  for (let i = 0; i < lines; i++) {
    const r = 7 + rng() * 10, a = rng() * Math.PI * 2;
    const x = Math.cos(a) * r, z = Math.sin(a) * r - 2, y = (rng() - 0.5) * 8;
    const len = 1.5 + rng() * 4;
    lp.set([x, y, z, x + (rng() - 0.5) * len, y + (rng() - 0.5) * len, z + (rng() - 0.5) * len], i * 6);
  }
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute("position", new THREE.BufferAttribute(lp, 3));
  group.add(new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({ color: PALETTE.navy, transparent: true, opacity: 0.5 })));

  return {
    group,
    update(t, dt, reduced) {
      if (reduced) return;
      group.rotation.y = t * 0.008;
      frags.rotation.y = -t * 0.012;
    },
  };
}

import * as THREE from "three";
import { PALETTE, BRAIN_CENTER } from "./scene-data.js";

// ThoughtNode — small geometric marker + one faint connection back toward the brain.
// The label lives in the DOM overlay (crisper type, bigger tap target); this module
// exposes the marker world position so the overlay can project it each frame.

const ACCENT = { pink: PALETTE.pink, lime: PALETTE.lime, orange: PALETTE.orange, pale: PALETTE.pale };

export function createThoughtNode(data) {
  const group = new THREE.Group();
  group.position.fromArray(data.position);

  const accent = ACCENT[data.accent] || PALETTE.pink;

  const shell = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.26, 0.26, 0.26)),
    new THREE.LineBasicMaterial({ color: PALETTE.pale, transparent: true, opacity: 0.4 })
  );
  const kernel = new THREE.Mesh(
    new THREE.BoxGeometry(0.075, 0.075, 0.075),
    new THREE.MeshBasicMaterial({ color: PALETTE.navy })
  );
  const marker = new THREE.Group();
  marker.add(shell, kernel);
  group.add(marker);

  // connection back toward the core
  const from = new THREE.Vector3().fromArray(data.position);
  const centre = new THREE.Vector3().fromArray(BRAIN_CENTER);
  const toCentre = centre.clone().sub(from);
  const end = from.clone().add(toCentre.clone().multiplyScalar(1 - 1.45 / Math.max(toCentre.length(), 0.01)));
  const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), end.sub(from)]);
  const line = new THREE.Line(geo, new THREE.LineDashedMaterial({ color: PALETTE.pale, dashSize: 0.1, gapSize: 0.09, transparent: true, opacity: 0.16 }));
  line.computeLineDistances();
  group.add(line);

  const state = { hover: 0, active: 0, dim: 0 };
  const cPale = new THREE.Color(PALETTE.pale);
  const cAcc = new THREE.Color(accent);
  const tmp = new THREE.Color();

  return {
    data,
    group,
    world: new THREE.Vector3(),
    set(next) { Object.assign(state, next); },
    update(t, dt, targets, reduced) {
      const k = Math.min(1, dt * (reduced ? 60 : 13));
      state.hover += (targets.hover - state.hover) * k;
      state.active += (targets.active - state.active) * k;
      state.dim += (targets.dim - state.dim) * k;

      const s = 1 + state.hover * 0.3 + state.active * 0.18;
      marker.scale.setScalar(s);
      if (!reduced) {
        marker.rotation.y = t * 0.3 + state.active * 0.6;
        marker.rotation.x = Math.sin(t * 0.4) * 0.12;
        group.position.y = data.position[1] + Math.sin(t * 0.55 + data.position[0]) * 0.045;
      }
      const fade = 1 - state.dim * 0.65;
      tmp.copy(cPale).lerp(cAcc, Math.max(state.active, state.hover * 0.35));
      shell.material.color.copy(tmp);
      shell.material.opacity = (0.38 + state.hover * 0.45 + state.active * 0.5) * fade;
      kernel.material.color.copy(cAcc).lerp(new THREE.Color(PALETTE.navy), 1 - Math.max(state.active, state.hover * 0.5));
      line.material.color.copy(tmp);
      line.material.opacity = (0.14 + state.hover * 0.3 + state.active * 0.42) * fade;
      group.getWorldPosition(this.world);
    },
  };
}

// Scene data — kept separate from rendering logic.
// Extension point: add nodes here (later: real embedding positions, sub-nodes, content refs).

export const PALETTE = {
  bg: 0x1f2940,
  navy: 0x3a4766,
  pale: 0xc9d1e0,
  pink: 0xff5f9e,
  lime: 0xa6ff00,
  orange: 0xff6a00,
};

export const CSS = {
  bg: "#1F2940",
  navy: "#3A4766",
  pale: "#C9D1E0",
  pink: "#FF5F9E",
  lime: "#A6FF00",
  orange: "#FF6A00",
};

export const BRAIN_CENTER = [-0.7, 0, 0];

export const NODES = [
  {
    id: "people",
    label: "PEOPLE",
    type: "category",
    position: [-3.2, 1.05, 0.7],
    description: "psychology · cognition · behavior · connection",
    accent: "pale",
  },
  {
    id: "technology",
    label: "TECHNOLOGY",
    type: "category",
    position: [2.5, 0.55, -0.5],
    description: "systems · interfaces · models · tools",
    accent: "lime",
  },
  {
    id: "creativity",
    label: "CREATIVITY",
    type: "category",
    position: [-0.85, -1.62, 1.3],
    description: "making · play · form · attention",
    accent: "pink",
  },
];

export const CAMERA = {
  home: { dist: 6.4, yaw: 0, pitch: 0.06, look: [0.15, 0, 0] },
  clamp: { yaw: 1.05, pitch: 0.42, distMin: 4.6, distMax: 7.4 },
};

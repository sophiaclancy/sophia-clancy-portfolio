// Worlds, scenes and their spatial layout. Scene ids match brain-schema.ts.
// The LLM names a world/scene; this file decides what that place looks like.

export const SCENE_META = {
  psychology: { label: "PSYCHOLOGY", desc: "behavior · motivation · mental models", accent: "pink" },
  attention: { label: "ATTENTION", desc: "notifications · focus · interruption cost", accent: "pink" },
  motivation: { label: "MOTIVATION", desc: "progress · accountability · meaning", accent: "orange" },
  learning: { label: "LEARNING", desc: "cognitive load · personalization · support", accent: "pale" },
  "human-connection": { label: "HUMAN CONNECTION", desc: "matching · community · trust", accent: "pink" },
  ai: { label: "AI", desc: "assistance · autonomy · human agency", accent: "lime" },
  frontend: { label: "FRONTEND", desc: "react native · expo · firebase", accent: "lime" },
  data: { label: "DATA", desc: "signals · analysis · evidence", accent: "lime" },
  systems: { label: "SYSTEMS", desc: "structure · constraints · scale", accent: "pale" },
  "creative-control": { label: "CREATIVE CONTROL", desc: "direct control · assisted work", accent: "orange" },
  painting: { label: "PAINTING", desc: "colour · surface · slowness", accent: "pink" },
  music: { label: "MUSIC", desc: "concerts · listening · rhythm", accent: "pink" },
  writing: { label: "WRITING", desc: "noticing · drafting · clarity", accent: "pale" },
  dancing: { label: "DANCING", desc: "movement · release · practice", accent: "pink" },
  notability: { label: "NOTABILITY", desc: "ai learning · motivation · accessibility", accent: "lime" },
  asus: { label: "ASUS PROART", desc: "ai autonomy in creative workflows", accent: "orange" },
  partake: { label: "PARTAKE", desc: "strategy · onboarding · content", accent: "pale" },
  partiful: { label: "PARTIFUL", desc: "growth · social behavior · adoption", accent: "pink" },
  finder: { label: "FINDER", desc: "mental models · retrieval · macos", accent: "pale" },
  sand: { label: "SAND", desc: "ar · spatial interaction · experiments", accent: "lime" },
  circuit: { label: "CIRCUIT", desc: "frontend · algorithms · connection", accent: "lime" },
};

export const WORLD_DEF = {
  people: { label: "PEOPLE", bg: 0x1f2940, fog: 0.085, scenes: ["psychology", "attention", "motivation", "learning", "human-connection"] },
  technology: { label: "TECHNOLOGY", bg: 0x1b2537, fog: 0.078, scenes: ["ai", "frontend", "data", "systems"] },
  creativity: { label: "CREATIVITY", bg: 0x24203a, fog: 0.09, scenes: ["creative-control", "painting", "music", "writing"] },
  projects: { label: "PROJECTS", bg: 0x1a2b31, fog: 0.072, scenes: ["notability", "asus", "partake", "partiful", "finder", "sand", "circuit"] },
  interests: { label: "INTERESTS", bg: 0x2a2237, fog: 0.095, scenes: ["painting", "music", "writing", "dancing"] },
};

export const sceneLabel = (id) => (SCENE_META[id] ? SCENE_META[id].label : String(id).replace(/-/g, " ").toUpperCase());

// Deterministic ring so new scenes never need hand-placed coordinates.
export function layoutScenes(ids, { radiusX = 3.4, radiusY = 1.75, centre = [-0.7, 0, 0] } = {}) {
  return ids.map((id, i) => {
    const a = Math.PI * 2 * ((i + 0.35) / ids.length);
    const meta = SCENE_META[id] || {};
    return {
      id,
      label: sceneLabel(id),
      type: "scene",
      description: meta.desc || "",
      accent: meta.accent || "pale",
      position: [centre[0] + Math.cos(a) * radiusX, centre[1] + Math.sin(a) * radiusY, centre[2] + Math.sin(a * 2) * 0.7],
    };
  });
}

// branch: grow a couple of nodes outward from an existing point
export function layoutBranch(ids, from) {
  return ids.map((id, i) => {
    const a = (i - (ids.length - 1) / 2) * 0.85;
    const meta = SCENE_META[id] || {};
    return {
      id,
      label: sceneLabel(id),
      type: "scene",
      description: meta.desc || "",
      accent: meta.accent || "pale",
      position: [from[0] + Math.cos(a) * 1.35, from[1] + Math.sin(a) * 1.1, from[2] + 0.35],
    };
  });
}

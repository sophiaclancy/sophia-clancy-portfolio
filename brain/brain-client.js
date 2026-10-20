// Client for /api/brain — the single seam between Clanc-E and the 3D world.
// No UI here. The scene layer will later do:
//   const res = await askBrain(messages);
//   scene.travel(res.destination, res.path);
//
// setBrainEndpoint() lets the static prototype point at a deployed route
// while the Next app uses the default same-origin path.

let ENDPOINT = "/api/brain";

export function setBrainEndpoint(url) { ENDPOINT = url; }

export const TRANSITIONS = ["none", "focus", "dive", "branch"];

export async function askBrain(messages, { signal } = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: messages.slice(-8) }),
    signal,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "brain request failed");
  return normalize(data);
}

// Defensive shaping so a malformed response can never break the render loop.
export function normalize(d) {
  const arr = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);
  const dest = d.destination || {};
  return {
    answer: typeof d.answer === "string" ? d.answer : "",
    relatedNodes: arr(d.relatedNodes),
    relatedProjects: arr(d.relatedProjects),
    path: arr(d.path),
    destination: {
      world: typeof dest.world === "string" ? dest.world : "people",
      scene: typeof dest.scene === "string" ? dest.scene : null,
      transition: TRANSITIONS.includes(dest.transition) ? dest.transition : "none",
    },
    followUps: arr(d.followUps).slice(0, 3),
  };
}

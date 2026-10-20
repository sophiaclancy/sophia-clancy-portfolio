// Mock AI layer. Behaves exactly like POST /api/brain — same fields, same ids,
// same async latency — so the UI never learns it is talking to a stub.
//
// SWAP POINT: in main.js replace
//   import { askBrain } from "./mock-brain.js";
// with
//   import { askBrain, setBrainEndpoint } from "./brain-client.js";
// Nothing else changes.

const INTENTS = [
  {
    match: /cognitive science|psychology|behaviou?r|how do you think|mental model/i,
    res: {
      answer:
        "Cognitive science is the lens, not a section of the work. I start from how people actually behave under load — what they notice, what they skip, what they'll never read — and design for that version of the person rather than the ideal one.\n\nIt shows up most in Notability, where research said students wanted AI to support their thinking, not replace it.",
      relatedNodes: ["psychology", "cognitive-science", "human-behavior", "mental-models"],
      relatedProjects: ["notability", "partiful"],
      path: ["people", "psychology", "mental-models"],
      destination: { world: "people", scene: "psychology", transition: "dive" },
      followUps: ["What are you learning about attention?", "How did that affect Notability?", "What about motivation?"],
    },
  },
  {
    match: /notification|attention|distract|focus|interrupt/i,
    res: {
      answer:
        "Attention is the resource I'm most careful with. An interruption is never free — it costs the thing the person was already holding in their head, and most products price that at zero.\n\nSo I'd rather earn a return than demand one.",
      relatedNodes: ["attention", "psychology", "human-behavior"],
      relatedProjects: ["notability", "partiful"],
      path: ["people", "psychology", "attention"],
      destination: { world: "people", scene: "attention", transition: "dive" },
      followUps: ["How does this affect your design?", "Show me the Notability connection", "What about motivation?"],
    },
  },
  {
    match: /motivat|streak|gamif|badge|progress|accountab/i,
    res: {
      answer:
        "Students in the Notability research wanted accountability but disliked streaks, points and badges. The reward wasn't the problem — the performance was.\n\nThe principle I kept: progress should feel meaningful, not performative.",
      relatedNodes: ["motivation", "learning", "psychology"],
      relatedProjects: ["notability"],
      path: ["people", "motivation", "learning"],
      destination: { world: "people", scene: "motivation", transition: "focus" },
      followUps: ["Tell me about Notability", "What about accessibility?", "How do you research this?"],
    },
  },
  {
    match: /notability|learning|student|study/i,
    res: {
      answer:
        "Notability was personalized AI learning. The finding that reframed it: students wanted AI to support thinking rather than do it for them — help me get unstuck, don't hand me the answer.\n\nThat made restraint the design problem, not capability.",
      relatedNodes: ["learning", "ai", "motivation", "accessibility"],
      relatedProjects: ["notability"],
      path: ["people", "learning", "ai"],
      destination: { world: "projects", scene: "notability", transition: "dive" },
      followUps: ["What about AI autonomy?", "How do you handle accessibility?", "Show me another project"],
    },
  },
  {
    match: /asus|proart|autonomy|creative control|agency/i,
    res: {
      answer:
        "ASUS ProArt is where I'm working through AI autonomy: when should the tool act, and when does the person need their hands directly on the work?\n\nCreatives will trade speed for control much less often than product teams assume.",
      relatedNodes: ["ai", "autonomy", "creative-control", "human-agency"],
      relatedProjects: ["asus"],
      path: ["technology", "ai", "creative-control"],
      destination: { world: "projects", scene: "asus", transition: "dive" },
      followUps: ["How do you decide what AI should do?", "Tell me about Notability", "What are you building now?"],
    },
  },
  {
    match: /technolog|engineer|frontend|code|react|firebase|technical|stack/i,
    res: {
      answer:
        "I came into product through frontend — React Native, Expo, Firebase — so I design in things that can actually be built, and I can build the thing I'm arguing for.\n\nCircuit is the clearest example: algorithms, a real database, and a human problem underneath.",
      relatedNodes: ["frontend", "technology", "algorithms", "data"],
      relatedProjects: ["circuit", "sand"],
      path: ["technology", "frontend", "algorithms"],
      destination: { world: "technology", scene: "frontend", transition: "dive" },
      followUps: ["Tell me about Circuit", "What about AR?", "How technical do you get?"],
    },
  },
  {
    match: /growth|onboard|marketing|partiful|partake|spread|adoption/i,
    res: {
      answer:
        "Growth work is behavioral work. On Partiful campus growth I'm mostly asking why a product spreads between people who already know each other, which is a social question before it's a funnel.\n\nPartake was the same instinct aimed at strategy, flows and onboarding.",
      relatedNodes: ["growth", "onboarding", "human-behavior", "strategy", "marketing"],
      relatedProjects: ["partiful", "partake"],
      path: ["people", "human-behavior", "growth"],
      destination: { world: "projects", scene: "partiful", transition: "branch" },
      followUps: ["What makes products spread?", "Tell me about Partake", "How do you think about onboarding?"],
    },
  },
  {
    match: /creativ|paint|music|writ|art|dance|dancing|hobb|outside of design|outside design|fun|free time/i,
    res: {
      answer:
        "Outside work: painting, music and concerts, dancing, biking, writing. They're not side-quests from design — they're where I practise noticing things.\n\nPainting in particular is the only one with no undo, which keeps me honest.",
      relatedNodes: ["painting", "music", "writing", "dancing", "creativity"],
      relatedProjects: [],
      path: ["creativity", "painting", "music"],
      destination: { world: "interests", scene: "painting", transition: "dive" },
      followUps: ["What are you painting?", "Do you go to a lot of shows?", "Back to the work"],
    },
  },
  {
    match: /finder|information|organiz|retriev|architecture|macos/i,
    res: {
      answer:
        "Finder was a human-centered redesign about information organization — where people expect things to be versus where the system decided to put them.\n\nMental models first, folders second.",
      relatedNodes: ["information-architecture", "mental-models", "hci"],
      relatedProjects: ["finder"],
      path: ["technology", "mental-models", "information-architecture"],
      destination: { world: "projects", scene: "finder", transition: "dive" },
      followUps: ["What did you change?", "Tell me about Sand", "How do you research this?"],
    },
  },
  {
    match: /\bar\b|augmented|sand|spatial|emerging/i,
    res: {
      answer:
        "Sand is my AR and emerging-interface experiment. Spatial work is useful precisely because none of the conventions are settled yet — you have to reason from perception instead of copying patterns.",
      relatedNodes: ["ar", "spatial-interaction", "hci"],
      relatedProjects: ["sand"],
      path: ["technology", "ar", "spatial-interaction"],
      destination: { world: "projects", scene: "sand", transition: "dive" },
      followUps: ["What did you learn from it?", "Tell me about Circuit", "What's next for you?"],
    },
  },
  {
    match: /circuit|dating|match|connection|algorithm/i,
    res: {
      answer:
        "Circuit is matchmaking — frontend engineering, Firebase, and an algorithm trying to do something humans are bad at describing about themselves.\n\nThe design problem was mostly restraint about what to ask people.",
      relatedNodes: ["algorithms", "human-connection", "frontend"],
      relatedProjects: ["circuit"],
      path: ["technology", "algorithms", "human-connection"],
      destination: { world: "projects", scene: "circuit", transition: "dive" },
      followUps: ["What surprised you?", "How technical was it?", "Tell me about Sand"],
    },
  },
  {
    match: /accessib|inclusive|cognitive load/i,
    res: {
      answer:
        "Accessibility and cognitive load are the same conversation to me: how much work does this interface demand before it gives anything back?\n\nIt was a constant in the Notability work.",
      relatedNodes: ["accessibility", "learning", "mental-models"],
      relatedProjects: ["notability"],
      path: ["people", "learning", "accessibility"],
      destination: { world: "people", scene: "learning", transition: "focus" },
      followUps: ["Tell me about Notability", "How do you test for this?", "What about attention?"],
    },
  },
  {
    match: /who are you|about (you|sophia)|background|resume|hire|role|looking for|berkeley|teach/i,
    res: {
      answer:
        "Sophia's a technical product designer — Cognitive Science, Data Science and frontend, currently leading a design team at Berkeley Innovation and teaching through Figma DeCal.\n\nShe's after roles where the technical and the creative thinking aren't separate jobs.",
      relatedNodes: ["technology", "creativity", "people"],
      relatedProjects: ["notability", "asus"],
      path: ["people", "technology", "creativity"],
      destination: { world: "people", scene: null, transition: "branch" },
      followUps: ["What kind of role?", "Show me your best project", "How do you think about design?"],
    },
  },
];

const FALLBACK = {
  answer:
    "That one's outside the brain — I only know Sophia in here.\n\nAsk me about how she thinks, a project, or what she does when she isn't designing.",
  relatedNodes: ["people", "technology", "creativity"],
  relatedProjects: [],
  path: ["people"],
  destination: { world: "people", scene: null, transition: "none" },
  followUps: ["How does psychology affect your design?", "Tell me about a project", "What do you do outside design?"],
};

export async function askBrain(messages) {
  const last = [...messages].reverse().find((m) => m.role !== "assistant");
  const q = last ? String(last.content) : "";
  const hit = INTENTS.find((i) => i.match.test(q));
  await new Promise((r) => setTimeout(r, 380 + Math.random() * 420));
  return JSON.parse(JSON.stringify(hit ? hit.res : FALLBACK));
}

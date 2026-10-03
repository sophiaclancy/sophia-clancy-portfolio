// data.jsx — Contexto prototype data: workspaces, files, the "mess", AI answers.

const FT = {
  pdf:  { band: "PDF", grad: "linear-gradient(180deg,#ff6a5a,#ec4334)" },
  fig:  { band: "FIG", grad: "linear-gradient(180deg,#a78bfa,#7c5cf0)" },
  py:   { band: "PY",  grad: "linear-gradient(180deg,#4b8bd0,#356ab0)" },
  doc:  { band: "DOC", grad: "linear-gradient(180deg,#5aa0ec,#3b7fd6)" },
  png:  { band: "PNG", grad: "linear-gradient(180deg,#5ec8c0,#2aa39a)" },
  md:   { band: "MD",  grad: "linear-gradient(180deg,#8a93a3,#5d6675)" },
  html: { band: "HTML",grad: "linear-gradient(180deg,#f2a23c,#e0822a)" },
  mp4:  { band: "MP4", grad: "linear-gradient(180deg,#ff9aa8,#ec5a76)" },
  m4a:  { band: "M4A", grad: "linear-gradient(180deg,#c4a3ff,#9b78f0)" },
  key:  { band: "KEY", grad: "linear-gradient(180deg,#f6b73c,#e0962a)" },
  swift:{ band: "SWIFT",grad: "linear-gradient(180deg,#ff8a3c,#ee5a24)" },
  app:  { band: "APP", grad: "linear-gradient(180deg,#13b6a8,#0e8f84)" },
};

// accent palette per workspace
const ACCENT = {
  blue:   "#0a84ff",
  purple: "#8a5cf6",
  green:  "#34a853",
  orange: "#f2933c",
  pink:   "#ff5e8a",
  teal:   "#13b6a8",
};

const WORKSPACES = [
  {
    id: "dendrite",
    name: "Dendrite",
    accent: "teal",
    count: 31,
    active: "1 hour ago",
    blurb: "iOS app — design, build & ship",
    apps: ["figma", "xcode", "github", "notes"],
    why: "31 files you move between across Figma, Xcode & GitHub",
    files: [
      { name: "Dendrite.fig", type: "fig", meta: "Edited 1h ago · Figma" },
      { name: "ContentView.swift", type: "swift", meta: "Xcode · main branch" },
      { name: "api-spec.md", type: "md", meta: "Backend contract" },
      { name: "Build 42 — TestFlight.app", type: "app", meta: "Shipped to testers" },
      { name: "onboarding-flow.png", type: "png", meta: "Latest export" },
      { name: "DENDRITE_brief.md", type: "md", meta: "Product brief" },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio Refresh",
    accent: "blue",
    count: 14,
    active: "2 hours ago",
    blurb: "Case-study site, resume & visual exploration",
    apps: ["figma", "vscode", "safari", "preview"],
    why: "14 files you've used together across Figma, VS Code & Safari this week",
    files: [
      { name: "portfolio.fig", type: "fig", meta: "Edited 2h ago · Figma" },
      { name: "Maya_Chen_Resume.pdf", type: "pdf", meta: "Opened before MDB interview" },
      { name: "dendrite.html", type: "html", meta: "Live preview · VS Code" },
      { name: "DENDRITE_brief.md", type: "md", meta: "Project brief" },
      { name: "Screenshot 2026-06-04…46.07 PM.png", type: "png", meta: "Hero mock" },
      { name: "Screenshot 2026-06-04…4.23 AM.png", type: "png", meta: "Inspiration" },
      { name: "signature.png", type: "png", meta: "Footer asset" },
    ],
  },
  {
    id: "cs61a",
    name: "CS 61A",
    accent: "green",
    count: 24,
    active: "Yesterday",
    blurb: "Labs, problem sets & lecture code",
    apps: ["vscode", "safari", "preview"],
    why: "Downloaded from bCourses during CS 61A lab blocks",
    files: [
      { name: "lab01.py", type: "py", meta: "Opened in CS 61A lab" },
      { name: "hw03.py", type: "py", meta: "Due Friday" },
      { name: "Lecture 12 — Trees.pdf", type: "pdf", meta: "From bCourses" },
      { name: "discussion09.pdf", type: "pdf", meta: "Section handout" },
    ],
  },
  {
    id: "anthro",
    name: "Anthro 3AC",
    accent: "purple",
    count: 12,
    active: "3 days ago",
    blurb: "Readings, lecture recordings & notes",
    apps: ["preview", "voice", "notes"],
    why: "Created during your Anthro 3AC calendar events",
    files: [
      { name: "Week 9 Reading.pdf", type: "pdf", meta: "From bCourses" },
      { name: "Lecture — Apr 12.m4a", type: "m4a", meta: "Recorded in class" },
      { name: "essay-draft.doc", type: "doc", meta: "Edited 3d ago" },
    ],
  },
  {
    id: "abroad",
    name: "Study Abroad",
    accent: "orange",
    count: 9,
    active: "Last week",
    blurb: "Applications, essays & program research",
    apps: ["safari", "preview", "mail"],
    why: "Saved while browsing program sites & the application portal",
    files: [
      { name: "Application_Final.pdf", type: "pdf", meta: "Submitted" },
      { name: "personal-statement.doc", type: "doc", meta: "Last edited" },
      { name: "programs.html", type: "html", meta: "Saved page" },
    ],
  },
  {
    id: "bi",
    name: "BI Recruiting",
    accent: "pink",
    count: 7,
    active: "2 days ago",
    blurb: "Interview prep, recordings & notes",
    apps: ["voice", "notes", "mail"],
    why: "Grouped around interview calendar events & recordings",
    files: [
      { name: "Interview #2.m4a", type: "m4a", meta: "Recorded" },
      { name: "Interview #3.m4a", type: "m4a", meta: "Recorded" },
      { name: "prep-notes.doc", type: "doc", meta: "Edited 2d ago" },
    ],
  },
];

// The "before" — a messy Recents dump (names pulled from a real student desktop).
const MESS = [
  { name: "Maya_Chen_Resume.pdf", type: "pdf", ws: "portfolio" },
  { name: "Screenshot 2026-06-04…50.52 PM.png", type: "png", ws: "portfolio" },
  { name: "text-7BFA00EB4CFB-1.txt", type: "md", ws: null },
  { name: "IMG_8667.PNG", type: "png", ws: "portfolio" },
  { name: "IMG_8666.PNG", type: "png", ws: "portfolio" },
  { name: "IMG_8665.PNG", type: "png", ws: "portfolio" },
  { name: "IMG_8664.PNG", type: "png", ws: "portfolio" },
  { name: "IMG_8662.PNG", type: "png", ws: "portfolio" },
  { name: "signature.png", type: "png", ws: "portfolio" },
  { name: "portfolio.fig", type: "fig", ws: "portfolio" },
  { name: "dendrite.html", type: "html", ws: "portfolio" },
  { name: "DENDRITE_brief.md", type: "md", ws: "portfolio" },
  { name: "Screenshot 2026-06-04…46.07 PM.png", type: "png", ws: "portfolio" },
  { name: "Screenshot 2026-06-04…4.23 AM.png", type: "png", ws: "portfolio" },
  { name: "lab01.py", type: "py", ws: "cs61a" },
  { name: "Week 9 Reading.pdf", type: "pdf", ws: "anthro" },
  { name: "Interview #2.m4a", type: "m4a", ws: "bi" },
  { name: "video.mp4", type: "mp4", ws: null },
  { name: "Claude (1).dmg", type: "md", ws: null },
];

// Canned natural-language answers for "Ask Finder"
const ASK = {
  query: "the resume I edited before my MDB interview",
  answerWs: "portfolio",
  answerFile: "Maya_Chen_Resume.pdf",
  reason: "Opened from Portfolio Refresh, 11 minutes before “MDB — Final round” on your calendar",
};

Object.assign(window, { FT, ACCENT, WORKSPACES, MESS, ASK });

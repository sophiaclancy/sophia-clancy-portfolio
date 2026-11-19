# Case Study Glow-Up: Prompt to Paste Back to Claude

> **How to use:** paste everything below the line into a new Claude Code session opened in `~/git/sophia-clancy-portfolio`. Before pasting, fill in or confirm every item marked **[CONFIRM]**. Work through it one phase at a time; Claude should stop for your review after Phase 2 (the Notability hero).

---

## 0. Role and goal

You are rebuilding the case-study pages of my portfolio (`CaseStudy.html?p=<id>`, rendered by `casestudy-v15.jsx` from `data-case15.jsx` and `data.jsx`).

**Target:** a working prototype whose craft matches Bao To's two case studies.

- **Zen Editor** (`https://www.baothiento.com/work?project=zeneditor`, no hyphen) is the **primary** reference: the hero, interactive mini-demos, interaction cards and Try-it card.
- **NotetakingLM** (`https://www.baothiento.com/work?project=notetaking-lm`) is the reference for research-heavy sections: problem cards, interview quotes, competitive gallery and process panels.

Both pages share one shell (§1.1–1.5). Zen adds components C18–C24 (§1.7).

**Process:**
0. **Build the clickable Notability prototype** in its own folder first (§8). I'll test it, then we iterate on its screens and animations.
1. Build **Notability** as the hero case study. It becomes the master template.
2. Apply that template to Contexto, Partake, Sand and ASUS.

**Non-negotiables:**
- Keep **my wording**. Re-organize my copy into Bao's information architecture, and shorten a block only when it would otherwise break a component. Never invent claims, metrics, quotes or results. Where something is missing, insert a visible **placeholder** (spec in §5) that says exactly what belongs there.
- Use my teammate Cheyenne Paw's Notability page (`https://cheyennepaw.com/notability`) only to **fill gaps**. Everything from it is listed in §4.1. Credit is shared: we were the same 5-person team.
- Bao is the reference for layout, type, spacing and components. Do not average him with anyone else.
- No motion beyond what Bao has: TOC active-state color, the hero carousel, and hover border/shadow on cards and images. Respect `prefers-reduced-motion`.
- Everything must work from `file://`. For links back home, use `location.protocol === "file:" ? "index.html" : "./"`.
- Small, reversible commits of work. Log each milestone in `PROGRESS.md` (my existing format) and add screenshots to `~/git/portfolio-design-versions/`.

---

## 1. Bao's case-study anatomy (exact spec, measured from his live page at 1440px)

His stack is Tailwind with PP Mori (sans) and Fragment Mono (labels). **Map PP Mori → Hanken Grotesk** (already loaded in `direction-a.css`) and keep Fragment Mono. Ink is `#2a2520`. All grays are **opacity steps of ink**, never separate gray hexes.

### 1.1 Page frame
- **Background:** my paper `#F5F1EC`. Bao uses white, but we keep our paper so the site stays one world.
- **Two columns:**
  - **Left rail:** about 175px wide, sticky, full height. Padding: 32px top, 24px left.
  - **Content column:** starts at about x=255 and ends 16px from the right edge (about 1170px of usable width at 1440). Cap the content at **1120px** and left-align it; don't center it.
- **The left rail, top to bottom:**
  1. **Back to home:** chevron-left icon (13×18) + "BACK TO HOME". 12px sans, `black/55`, hover `black/75`, 8px gap, 20px margin below.
  2. **Label "CASE STUDY":** 10px uppercase sans, `black/30`, `tracking-wide`, 4px margin below.
  3. **Project name:** 14px sans, `black/90`.
  4. **TOC:** 24px below the project name. A vertical list of section names, each item `py-2`, 12px sans, uppercase as written, `black/45`, hover `black/65`. The **active item** is `black/80` and medium weight.
     - Each item has a **7px dot** on a **1.5px vertical rail** (`black/8`), drawn as a 32px-tall segment between dots.
     - Dots are `black/15` (hover `black/30`); the active dot is ink.
     - Clicking an item smooth-scrolls to its section. Sections use `scroll-mt-20` (80px).
     - Active state follows scroll position (IntersectionObserver).
- **Mobile (<768px):** the rail disappears. Show the back link at the top, then a horizontal scrolling row of TOC chips.

### 1.2 Header row (top of the content column)
- **Line 1:** one-sentence description (my card description). 14px sans, `foreground/70`, aligned with the content column.
- **Top right, same line:** tag chips. 10–12px sans, `black/40`, padding 2px 8px, radius 5px, fill `black/4%`. Below them, right-aligned, the **year** at 10–12px, `black/40`.
- Bao repeats the chip style used on his home cards. Mine already exist (`.card-tag` in `direction-a.css` §2.3); reuse them exactly.

### 1.3 Hero carousel
- **Frame (Zen version, use this):** the hero slide is **the same glassy "bubble" card as the home page**: a landscape/scene background, the product window inset with a bezel, and edge glints. That makes the home card and the case study one continuous object.
  - Reuse `.card-plate` + `.da-rim` + `.da-glint` + the project's `.sc-<id>` scene at full content width, about **4:3**.
  - Show no hover-state icons inside the hero.
- **Other slides:** NotetakingLM style. `rounded-lg` (8px), 1px border `border/50`, fill `foreground/5`. Images inside are `object-contain` with soft shadow `0 8px 30px rgba(0,0,0,.08)`, hover `0 12px 40px rgba(0,0,0,.12)`.
- **Controls:** 16px below the frame, centered. Dots are 8px circles, `black/20`. The **active dot stretches into a 24px pill** (`transition-[width] 300ms`). After the dots, a chevron-right button (`p-2`, hover scale 1.1, active scale .95).
- **Slides:** 4–5. Each slide is a real screen or a placeholder.

### 1.4 Title block (48px below the carousel)
- **Eyebrow:** `"<PROJECT> CASE STUDY"`. Fragment Mono, 10/12px, `foreground/50`, uppercase.
- **H1:** the project's core question, written as a question. 48px (lg) / 36px (md) / 24px (sm), weight 400, `leading-tight`, ink. This is the biggest type on the page.
- **Core concept rail (Zen):** directly under the H1, 24px gap. Left border 1px `foreground/20`, `pl-4 py-1`. Mono label `CORE CONCEPT` (10/12px `foreground/50`), then one 16px sentence at `foreground/60`. This is the one-line answer to the H1.
- **Meta grid:** 64px below. Columns are `grid-cols-2 md:grid-cols-3 lg:grid-cols-5`, gap 24px.
  - Each cell: a mono label (10–12px, `foreground/50`, uppercase) over 6–8px of space, then a stack of 14px sans values, `foreground/80`, 2–4px apart.
  - Bao's cells: **ROLE / DURATION / TOOL / SKILLS** (NotetakingLM) or **ROLE / DURATION / SCOPE / LIVE** (Zen). Mine are **ROLE / DURATION / TOOLS / SKILLS / TEAM**.
- **Link card (Zen "TRY THE LIVE PRODUCT"):** 48px below the meta. Full width, radius 8px, 1px border `foreground/10`, fill `foreground/3%`, `p-5`, hover border `foreground/20` + fill `foreground/5%`.
  - **Left:** mono label (`TRY THE PROTOTYPE`) over an 18px medium ink title (`Study Session prototype`).
  - **Right:** "Visit ↗" in 14px `foreground/50`, which goes to `foreground/80` on hover.
  - Use it wherever a live or clickable thing exists (Notability prototype, Contexto prototype, Sand AR embed).

### 1.5 Section pattern (repeat for every TOC section)
- **Spacing:** `py-14` (56px top and bottom), so sections sit about 112px apart. Add `scroll-mt-20`.
- **Eyebrow:** Fragment Mono, 12px, uppercase, `tracking-wider`, `foreground/50`, 12px margin below. The text matches the TOC label, e.g. `PROBLEMS`.
- **H2:** 30px (md) / 24px, weight 400, ink. A short noun phrase ("The Vision", "Key Challenges Students Face", "The Core Question").
- **Content:** starts 40px below the H2 (`mt-10`).
- **H3 subhead** (inside a section): 24px, weight 400, ink, 40px above, 24px below.
- **H4 feature title:** 20px, weight 400, ink.
- **Body:** 14px (`text-sm`), `foreground/60`, `leading-relaxed`, full content width. Lead paragraphs use 16px at `foreground/70` with `max-w-2xl` (672px).

### 1.6 Component library (build each once in `casestudy-blocks.jsx`, reuse everywhere)

| # | Component | Bao spec | Used for |
|---|---|---|---|
| C1 | **Problem cards** | 2×2 grid, gap 24px. Each card: 1px border `border/50`, radius 8px, padding 20px, `space-y-3`. Hover: border `foreground/20`. Mono label 12px `foreground/50` uppercase (e.g. EFFICIENCY), then 16px body `foreground/70`. | Problems, principles, insights |
| C2 | **Core question** | Blockquote: left border 2px `foreground/30`, padding-left 24px. Text 18–20px ink, weight 400. Supporting paragraph below at 14px `foreground/60`. | The HMW / reframed question |
| C3 | **Interview quotes** | Each quote: left border 2px `foreground/30`, padding-left 16px, `py-2`, *italic* 16px `foreground/70`. Stack them 12–16px apart. | Student quotes |
| C4 | **Two-column facts** | `grid md:grid-cols-2 gap-6`. Mono label (TARGET USERS / GOALS), then a 16px value or a dash list ("– Improve academic performance"). | Users, goals, constraints |
| C5 | **Three-up gallery with captions** | `grid md:grid-cols-3 gap-4`. Each tile is a 4:3 frame, `rounded-lg`, fill `foreground/5`, with the image contained. Caption below, centered, 14px `foreground/70`, numbered "1. AI-Powered Conversational Agents". | Competitive analysis, user flows |
| C6 | **Takeaway rail** | Left border 1px `foreground/20`, padding-left 16px. Mono label (ANALYSIS TAKEAWAYS). Numbered lines of 16px text, with the lead phrase in **medium ink** and the rest `foreground/70`. | Competitive takeaways, "what we learned" |
| C7 | **Solution statement** | Like C2, but uses *italic* to stress 2–3 key phrases ("A *word-level, AI-powered* note-taking platform…"). A 12px `foreground/50` supporting line goes directly under it. | One-sentence solution |
| C8 | **Full-width product shot** | Full content width, radius 8px, image edge to edge, no padding. Bao's is a dark UI on white; ours sits on the project's scene color (see §3). | Hero UI under the solution |
| C9 | **Big process panel** | Full width, radius 8px, filled with the canvas color of the design tool (Figma gray `#2C2C2C` / FigJam `#F1F1F1`). Shows component sheets or wireframes at true scale. | Componentization, wireframes, affinity map |
| C10 | **Two-up frames** | `grid md:grid-cols-2 gap-6`, radius 8px, images cropped to the same height. | Final frames |
| C11 | **Feature showcase** | H4 title + 16px description (`max-w-2xl`, `foreground/70`). Then 1–2 media tiles in `grid md:grid-cols-2 gap-6`. Each tile is radius 8px with Bao's card glints (top/bottom/corners, already built as `.da-glint`). Italic 14px `foreground/50` caption under each. Optional note line: left border 1px, 12px italic `foreground/50` ("NOTE: As of March 2025, Google's NotebookLM released…"). | Final features, plus the **real-world validation note** (§4.1) |
| C12 | **Numbered conclusions** | Rows with `gap-4 items-start`: a 28px circle (1px border `foreground/20`) holding a 14px number `foreground/60`, then 16px text `foreground/70` with 2px top padding. | Takeaways and reflection |
| C13 | **Footer** | Top border 1px `border/50`, `py-6`, centered. Mono label "CONNECT WITH ME", then a line of 14px text with my email link. Then **next/previous case study** (my addition, styled as small home cards). | End of every page |
| C14 | **Placeholder** (mine, see §5) | Same frame as C5/C8 with a mono label and an instruction caption. | Every missing visual |
| C15 | **Stat row** (mine, Brandon-style, used sparingly) | 3–4 cells. Each: a number in 30px ink, then a 12px mono `foreground/50` label below. No boxes. | Research scale (74 surveys etc.) |
| C16 | **Prototype embed** (mine) | Same frame as C8. Holds an `<iframe>` of a local prototype HTML. Top-right chip "Interactive · click through"; below the frame, "Open full screen ↗". | Notability prototype, `Contexto Prototype.html` |
| C17 | **Before → after table** (existing `table` block) | Restyle it: 2 columns, 1px row lines `border/50`, mono column headers, 14px cells. The left column is `foreground/50`, the right is ink. | Reframes (Contexto, Sand) |

### 1.7 Zen Editor components (interactive; this is what makes his page feel like a product)

All interactive surfaces share one container:
- radius `0.35rem` (~6px), 1px border `foreground/8%`, fill `foreground/2%`, `overflow-hidden`
- internal dividers 1px `foreground/6%`

| # | Component | Zen spec | My use |
|---|---|---|---|
| C18 | **Old way vs new way** | Two panels side by side, each topped with a colored mono label: `THE OLD WAY` in muted red `rgba(239,68,68,.7)` and `ZEN EDITOR` in muted green.<br>• **Left panel:** mini windows with traffic-light dots (`essay.doc` → `ChatGPT`) play the painful steps.<br>• **Right panel:** plays the one-step flow.<br>• **Bottom of each:** a thin progress bar with a mono timer (`~90s` red / `~3s` green).<br>• Plays once on scroll-in; static under reduced motion.<br>• A 14px `foreground/60` sentence sits under the pair. | **Notability:** "Before Study Session" (open notes → ChatGPT → copy → make a to-do list elsewhere → set a phone timer) vs "Study Session" (open note → Start session). **Use step counts, never invented seconds:** `5 steps · 3 apps` vs `1 step · 0 apps`.<br>**Contexto:** finding a file by name (Finder → search → wrong file → Recents → Downloads) vs Ask Finder. |
| C19 | **Tab panel** | A full-width tab row: each tab is `flex-1 px-5 py-3`, 14px medium. The active tab is `foreground/90` with a 2px bottom border `foreground/30` and fill `foreground/2%`; inactive tabs are `foreground/50`. The panel below holds an illustration. | **Notability:** `Gamification (the brief)` / `Evidence of progress (the research)`.<br>**Contexto:** `Folders` / `Workspaces`.<br>**Sand:** `Dashboard` / `Ambient AR`. |
| C20 | **Segmented demo** | Mono label (`TRY DIFFERENT GRANULARITY LEVELS`), then a container. Its top row is segmented buttons (`px-4 py-2`, radius 6px, 12px medium); the active one is filled `foreground/90` with paper text and `shadow-sm`, inactive ones `foreground/50` with hover fill `foreground/4%`.<br>• **Body (p-5):** removed rows (red tint `rgba(239,68,68,.06)` + 2px left border `rgba(239,68,68,.3)` + strikethrough `foreground/50`) and added rows (green equivalents).<br>• **Footer:** a 12px `foreground/40` caption above a top divider. | **Notability's signature demo:** `AI goals` / `To-do list` toggle, showing the same goal ("Understand dwarf planets for Thursday's quiz") as AI microtasks vs a plain checklist. This *is* "the control that lets students use less AI."<br>**Contexto:** `Name` / `Context` search. |
| C21 | **Core loop strip** | A mono label (`THE CORE LOOP`), then a tab-like row of 4 uppercase mono steps (`SELECT · ASK · REVIEW · DECIDE`). The active step is ink and the others `foreground/40`. It auto-advances every 2.5s and pauses on hover; the panel below shows each step's screen. | **Notability:** `PICK NOTES · SET GOALS · FOCUS · REVIEW`.<br>**Contexto:** `DETECT · SUGGEST · CONFIRM · REOPEN`. |
| C22 | **Two-column mini features** | `grid md:grid-cols-2 gap-8`. Each: a 14px medium `foreground/80` title over a 14px `foreground/50` line. Usually followed by a C8 hero shot in the bubble frame with a 12px caption. | "Works with your notes" / "Try without commitment"-style pairs. |
| C23 | **Interaction cards** | A 2×2 grid, gap 12px. Each card uses the shared container.<br>• **Header row** (`px-4 py-3`, bottom divider): 14px medium `foreground/70` title on the left, 12px `foreground/50` hint on the right (`hover to interact`, `⌘S`, `hover to switch`).<br>• **Body:** a live mini-component, then a 12px `foreground/50` caption.<br>• Intro line above the grid: "Hover over each card to see the interaction." | **Notability:**<br>• *Focus timer* (hover: 25:00 starts ticking)<br>• *Sidebar widget* (hover to collapse)<br>• *Silence notifications* (toggle)<br>• *Completion moment* (hover: goal checks off and a soft confetti-free check animation plays)<br>**Contexto:** *Suggestion chip*, *Reopen Everything*, *Explain why*, *Undo*. |
| C24 | **Try-it card** | Section `TRY IT`, H2 "See it yourself", one 14px line, then a card: radius 12px, `p-6`, fill `foreground/3%`, border `foreground/10`, hover fill `foreground/5%` + border `foreground/20`.<br>• **Inside:** mono `GET STARTED`, an 18px medium link "Try Zen Editor ↗" (`foreground/90` → ink), and a 14px `foreground/60` line. | The last section of every study with a prototype: "Try Study Session ↗ · Opens the clickable prototype. Best on desktop." |

**Zen's section order** (the default for product-heavy studies): THE PROBLEM · THE CHALLENGE · THE SOLUTION · [feature deep-dives ×3–4] · INTERACTION DESIGN · HOW IT WORKS · REFLECTIONS · TRY IT. Use it for **Notability and Contexto**. Use NotetakingLM's research-heavy order (§2) as the spine, then switch to Zen's order from THE SOLUTION onward.

**Buttons and links (all of them):**
- Back to home: §1.1.
- Carousel chevron: §1.3.
- "Open full screen ↗" and "Visit site ↗": 12px sans, `black/55`, hover `black/75`, no underline, arrow nudges 2px on hover.
- Inline links: ink with a 1px underline at `foreground/30`, offset 3px.
- **No filled buttons anywhere.**

---

## 2. Shared information architecture (Bao's order → my sections)

Bao's TOC is OVERVIEW · PROJECT OVERVIEW · PROBLEMS · DESIGN CHALLENGE · RESEARCH · THE SOLUTION · LO-FI DESIGNS · HI-FI DESIGNS · FINAL FEATURES · CONCLUSIONS.

Map each project onto this order. Keep my section titles as the H2s, with Bao-style short eyebrows above them. Aim for 8–10 TOC items per study.

| Bao slot | Purpose | Notability | Contexto | Partake | Sand |
|---|---|---|---|---|---|
| OVERVIEW | carousel + H1 question + meta | ✓ | ✓ | ✓ | ✓ |
| PROJECT OVERVIEW → "The Brief" | context, client, the ask | Notability Learn + the two-part ask | Students and digital clutter | Partake + the discovery problem | Felt time and wearables |
| PROBLEMS | 2×2 problem cards (C1) | Problem Space | Problem (4 costs of clutter) | Problem (4 strategy requirements) | Problem Space |
| DESIGN CHALLENGE | core question (C2) | original vs reframed HMW | "Initial framing" HMW | "The real question" | "We asked" |
| RESEARCH | methods, stats, quotes, takeaways | Research | Research + Insights | Research + Insights 01/02 | Research |
| THE REFRAME *(my addition; this is my signature move)* | what research overturned | Reframing the Brief | Strategic Shift + Why Apple + Strategic Fit | Strategic Shift + Opportunity | Reframing the Question + Opportunity |
| LO-FI / EXPLORATION | concepts, sketches, matrix | Exploring Directions | early concepts | strategy framework | storyboard |
| THE SOLUTION | statement (C7) + big shot (C8) | Solution | Solution + Core Flow | Solution (3 formats) | Solution (3 moments) |
| HI-FI / ITERATION | decisions and tensions | Designing for Autonomy + Building the System | Privacy + Design Tension + Extended Concepts | System + Feasibility | Companion + Tension + Edge Cases + Ethics |
| FINAL FEATURES | feature showcase (C11) + prototype (C16) | Study Session features + prototype | Workspaces / Suggest / Reopen / Constellation / Ask Finder + prototype | 3 concepts | AR moments + app |
| CONCLUSIONS | outcome + numbered reflection (C12) | Outcome + Reflection | Outcome + Reflection | Outcome + Reflection | Outcome + Reflection |

---

## 3. Visual identity per project (ties the pages to the home cards)

Each case study inherits its **home-card scene** (`direction-a.css` §4.2 and §5). Use it for the hero carousel frame (C8/C16 backgrounds) and nowhere else. The page itself stays paper.

| Project | Scene | Accent for small highlights (stats, active TOC dot) |
|---|---|---|
| Notability | the sky gradient `.sc-p1` | `#3b6ef5` |
| Contexto | macOS wallpaper `assets/contexto/wallpaper2.webp` | `#1577b8` |
| ASUS | jade/sapphire glass `.sc-asus` | `#1f4fa3` |
| Partake | **pinkish**: dusty rose `.sc-p2` | deep rose `#A4506E` |
| Sand | **yellowish**: warm sand/gold scene `linear-gradient(180deg,#F1DFA8,#E2BF6E 60%,#C99A4A)` with a soft sun haze (add as `.sc-p3`) | ochre `#B07A1E` |

---

## 4. Per-project content specs

### 4.1 NOTABILITY: the hero / master template (build first)

**Header**
- **Description line:** "A personalized, accessible AI study experience for Notability Learn."
- **Chips:** `Product Design` `UX Research` · **Year:** 2025
- **Carousel:**
  1. `assets/notability/ss-intro.png`
  2. `assets/notability/ss-content.png`
  3. `assets/notability/ss-goals.png`
  4. `assets/notability/comp-timer.png`
  5. `assets/notability/showcase.png`
  
  Each sits on the sky scene, and the window gets the same slate bezel as the home card.
- **Eyebrow:** `NOTABILITY CASE STUDY`
- **H1:** "How could Notability motivate students without turning learning into a game?"
- **Meta grid:**
  - **ROLE:** UX Researcher, Product Designer
  - **DURATION:** Aug – Dec 2025
  - **TOOLS:** Figma, FigJam, ChatGPT
  - **SKILLS:** UX Research, Product Strategy, Interaction Design, AI Learning Experiences
  - **TEAM:** Cheyenne Paw, Mikayla Acosta, Grace Zhang, Karen Pham. Client Notability × Berkeley Innovation.

**THE BRIEF** (from Cheyenne; my data lacks it)
- Notability is a note-taking and PDF-annotation app that combines handwriting, sketches, images and audio in one document. Berkeley Innovation is UC Berkeley's student design consultancy.
- **Notability Learn** (the existing AI feature): smart notes, summaries, transcripts, quizzes, and a content-aware chatbot.
- **The ask, in two parts (C4 two-column):**
  1. "Design a more inclusive, AI-powered note-taking and study experience for students with learning differences."
  2. "Evolve Learn on the web app to be more gamified, personalized, and engaging."

**PROBLEMS** (C1 2×2). Source: my "Problem Space" plus my old summary card.
- **SAMENESS:** "Learn already offered summaries, flashcards, transcripts, and AI chat. Competitive products provided many of the same features."
- **NO ADVANTAGE:** "Adding another AI capability would not create a meaningful advantage."
- **ONE-SIZE-FITS-ALL:** "Notability Learn treats every student the same, leaving learners with differences behind."
- **THE MISSING PIECE:** "Notability needed to understand something generic tools could not: the student behind the material."
- Then **C5**: competitive landscape, 3-up. Use the coded figure `Competitive` from `figs-nb-research.jsx` if it renders; otherwise placeholder "Competitive landscape: Notability Learn vs StudyFetch vs Knowt (+1). Shared features greyed; adaptive-learning gap highlighted."

**DESIGN CHALLENGE** (C2, two quotes stacked)
- **Original brief, struck through in `foreground/40`:** "How do we make studying more engaging?"
- **Reframed (ink):** "How can we help students find where to begin?"
- **Supporting line:** "How might we evolve Learn on the web app to create a personalized, accessible experience that keeps students motivated and focused?"

**RESEARCH**
- **C15 stat row (these are the current, confirmed numbers):**
  - **85** survey responses
  - **15** interviews
  - **5** focus groups
  - **5** diary studies
- **Body:** "We collected 85 survey responses and conducted 15 interviews, 5 focus groups, and 5 diary studies across different subjects, learning preferences, and accessibility needs."
  - **Also update the old "74 survey responses"** in `data-case15.jsx` and `data.jsx` to 85, so every page agrees.
- **H3 "Our 3 research lenses"** (from the team's diagram; rebuild it as C1 3-up, no image). Each card has a mono label, then one sentence:
  - **PERSONALIZATION:** Understand how learning differences shape study needs.
  - **AI:** Analyze how students and tools currently utilize AI.
  - **GAMIFICATION:** Identify what makes digital learning engaging.
  
  Under the cards, add a 14px `foreground/60` line: "The third lens is the one research overturned." That sets up THE REFRAME.
- **H3 "What students rejected":** C1 cards with label REJECTED, each holding one line:
  - "Streaks created pressure."
  - "Badges felt childish."
  - "Points rewarded activity instead of understanding."
  - "Automatic answers made students question whether they were learning."
- **C3 quote:** "I don't want points. I want to know I'm actually getting better." **[CONFIRM: add 2 more real quotes from the diary study, if you have them.]**
- **H3 "Personas":** C5 three-up using `assets/notability/journey-isa.png`, `journey-cheryl.png` and `journey-dylan.png`. Captions: "1. Interactive Isa", "2. Conceptual Cheryl", "3. Optimizer Dylan".
- **H3 "Synthesis":** C9 panel placeholder: "Affinity map: two zones, learning behaviors & challenges / potential features. Show a cropped, legible region, not the whole board."
- **C6 takeaway rail, "WHAT WE FOUND"** (Cheyenne's three insights, which line up with mine):
  1. **Provide clarity:** students handle overload best with clear structure and small, focused tasks.
  2. **Celebrate small wins:** clear progress tracking keeps students motivated. *(Note: this is where we diverged from gamification.)*
  3. **Be a tutor, not an answer key:** students value AI that adapts to their weak spots.
- **Statement (C7):** "The brief asked for gamification. The research revealed a need for *evidence of progress*."

**THE REFRAME**
- **H2:** "Progress could motivate students without becoming performative."
- **C1 as 4-up (01–04):** Active learning · Personalization · Trust · Progress, with my descriptions.
- **Body:** "These principles became a filter for every concept, not a checklist added after designing."

**EXPLORATION**
- **H2:** "Four directions survived research. Only one connected the system."
- **Chips:** 01 Adaptive Learning Profiles · 02 AI Visualizations · 03 Reading Support · **04 Study Sessions** (selected: ink fill, paper text).
- **Body:** "We evaluated each direction based on student value, differentiation, and feasibility."
- **C10:** coded `Concepts` and `Matrix` figures from `figs-nb-research.jsx`, or placeholders "Concept sketches ×4" and "Prioritization matrix: Study Sessions highest on value × differentiation × feasibility".
- **H3 "Entry point & session setup"** (from Cheyenne): placeholder C10. Left: "Entry point: where Study Session launches from inside an open note". Right: "Session setup: onboarding quiz capturing preferred study method".

**THE SOLUTION**
- **C7:** "Study Sessions give studying a *beginning, middle, and end*." Supporting line: "Instead of rewarding students for opening Notability, Study Sessions turn their own notes into a focused plan."
- **C8:** big shot of `ss-intro.png` on the sky scene.
- **Step grid:** 2×2, numbered 01–04 in mono, image above, title and one line below:
  1. **Start with my material** (`ss-content.png`)
  2. **Help me decide what to do** (`ss-goals.png`)
  3. **Keep me focused** (`comp-timer.png`)
  4. **Show me what changed** (placeholder: "Progress summary screen")

**ITERATION: "Designing for Autonomy"**
- **H2:** "The most important control lets students use less AI."
- **Body:** my paragraph about the AI-goals ↔ plain to-do toggle.
- **C2 statement:** "No competitor we reviewed offered an equally clear way to turn the AI down instead of up."
- **C10 before/after:** use coded `BeforeAfter` from `figs-nb-app.jsx`, or a placeholder.
- **H3 "Building the System":** C12 numbered list of the 4 ecosystem lines. Then coded `Ecosystem`, or a placeholder.

**FINAL FEATURES** (C11, one block per feature; media = real screen or placeholder)
1. **Suggestions based on progress:** recommendations from reading progress, quiz scores and performance.
2. **Goals in your own words:** a typed goal becomes AI microtasks scaled to familiarity. Includes the **AI ↔ to-do toggle**.
3. **Focus mode:** a simple Pomodoro timer, with an optional mode that silences other apps. Kept minimal "so Notability wouldn't feel like a productivity app".
4. **Distraction-free sidebar:** Study Session collapses into a customizable widget beside the notes.
5. **Visible progress, no points:** brief completion moments at natural stopping points.

- **NOTE line under feature 3 (C11 note), Bao's NotebookLM-note pattern:** "NOTE: In April 2026, Notability launched a Study Timer on iOS with Pomodoro and custom session lengths, the direction our concept proposed." **[CONFIRM wording. Don't imply causation.]**
- **Zen modules for Notability** (place them like this):
  - **C18** in PROBLEMS: "Before Study Session" (`5 steps · 3 apps`) vs "Study Session" (`1 step`).
  - **C19** in THE REFRAME: Gamification / Evidence of progress.
  - **C21** in THE SOLUTION: `PICK NOTES · SET GOALS · FOCUS · REVIEW`, with each step showing a prototype screen.
  - **C20** in ITERATION: `AI goals` / `To-do list`.
  - **C23** INTERACTION DESIGN: focus timer · sidebar widget · silence notifications · completion moment.
- **C16 PROTOTYPE + C24 TRY IT:** embed `prototypes/notability/index.html` (built in Phase 0, §8). The link card under the meta grid also points to it.

**CONCLUSIONS**
- **H2:** "Research matters most when it changes the direction."
- **Outcome paragraph:** my honest-scope paragraph ("Because this was a conceptual client engagement…").
- **C12 numbered:**
  1. Treat the brief as a hypothesis, not an answer.
  2. Students didn't need more engagement; they needed less friction getting started.
  3. The strongest learning tools leave the thinking to the student.
  4. Research should change the outcome: light progress cues over heavy gamification.
- **Credit note:** "Built with Berkeley Innovation for Notability alongside Cheyenne Paw, Mikayla Acosta, Grace Zhang, and Karen Pham."

### 4.2 CONTEXTO
- **Description:** "Finder concept that organizes files into Workspaces by project. 12-week research and design project."
- **Chips:** `UX Research` `Concept` · **2025**
- **Carousel:** `v2-home`, `v2-suggest`, `v2-workspace`, `v2-constellation`, `v2-ask` (all in `assets/contexto/`). Each window is cropped like `cover-*.png` and sits on the wallpaper.
- **H1:** "How can Finder stay organized without requiring people to become organized?"
- **Meta:**
  - **ROLE:** Design & Prototyping Lead; UX Researcher
  - **DURATION:** 12 weeks · Spring 2025
  - **TOOLS:** Figma, FigJam
  - **SKILLS:** User Research, Contextual Inquiry, Interaction Design, Prototyping
  - **TEAM:** Aldrin Ong, Ink Chavanapanit, Valerie Eng
- **PROBLEMS (C1):** the 4 costs (time lost searching · duplicates & outdated versions · missed work & overwrites · persistent disorder). Then C8 with `before-finder.jpg`, captioned "A real student Finder window…".
- **DESIGN CHALLENGE (C2):** "How might we help students maintain cleaner files and folders?" (initial, struck through), then the pivotal insight in ink: "They forgot where a file lived, but remembered what they were doing when they used it."
- **RESEARCH:**
  - Stat row: survey **[CONFIRM n]** · interviews **[CONFIRM n]** · contextual inquiries **[CONFIRM n]** · **4** findings.
  - C6 rail "WE WANTED TO UNDERSTAND" with my 4 questions.
  - C1 2×2 with the 4 insights (01–04).
  - Placeholders: "Contextual inquiry session photo" and "Survey highlights".
- **THE REFRAME:**
  - C17 table (Initial vs Research-backed, 4 rows).
  - H3 "Why Apple": C2 principle + C17 table (Apple integration vs friction removed).
  - Placeholder: 3 invisible-friction examples.
- **SOLUTION:** C7 "Contexto organizes Finder into *Workspaces*." C8 `v2-home.png`.
- **HI-FI:**
  - H3 Privacy: C6 rail of the 5 privacy rules.
  - H3 Design Tension: C1 3-up (Propose, don't move · Explain connections · Always reversible).
- **FINAL FEATURES (C11):**
  - Progressive Organization (`v2-suggest`, callout "These 14 files appear to belong to Portfolio Refresh.")
  - Reopen Everything (`v2-workspace`)
  - Constellation (`v2-constellation`)
  - Ask Finder (`v2-ask`, callout "The résumé I edited before my MDB interview.")
  - **C16:** embed `Contexto Prototype.html` (already clickable).
- **CONCLUSIONS:** the outcome list as C12. Reflection: "The best intelligence can feel like one less step." + 3 lines.

### 4.3 PARTAKE
- **Description:** "TikTok content strategy for an allergen-free snack brand. 10-week research project."
- **Chips:** `Content Strategy` `TikTok` · **2025**
- **H1:** "How can a small food brand earn attention in an algorithm-driven feed?"
- **Meta:**
  - **ROLE:** UX Researcher, Content Strategist
  - **DURATION:** 10 weeks · Spring 2025
  - **TOOLS:** Figma, FigJam, ChatGPT
  - **SKILLS:** User Research, Growth Strategy, Consumer Behavior, Content Systems
  - **TEAM:** 5 consultants · Partake Foods × Berkeley Innovation
- **PROBLEMS (C1):** the 4 strategy requirements (reach the unfamiliar · trust before purchase · saves/shares/participation · feasible weekly for a small team).
- **CHALLENGE (C2):** "How do products earn attention in environments designed to keep people scrolling?"
- **RESEARCH:**
  - Stat row **55** survey responses · **3** consumer interviews · **5** competitor deep dives
  - Insight 01 "Consumers discover moments before they discover products." Insight 02 "Trust was not one step in the journey. It was the journey."
- **REFRAME:** Strategic Shift + "What I pushed" aside (my polished-vs-handmade argument), C10 before/after. Opportunity: 3 principles (Familiar behavior · Immediate value · Community participation).
- **SOLUTION / FEATURES (C11 ×3):** Cookie Crumb Latte (storyboard placeholder: "recipe, reveal, reaction in under 20 seconds") · Partake Everywhere · Your Month, Your Cookie (participation flow).
- **HI-FI:** System ("Each concept serves a different stage of discovery"). Feasibility + production-toolkit placeholder.
- **CONCLUSIONS:** "We delivered a system for earning attention, not a list of TikTok ideas." + reflection.

### 4.4 SAND
Use the full `CASE15.p3` content.
- **H1:** "What if technology helped people feel time instead of merely tracking it?"
- **Stats:**
  - **36** surveyed
  - **70%** preferred real-time support built into their environment
  - **41%** disliked getting information too late to act
- **Meta:**
  - **ROLE:** **[CONFIRM]**
  - **DURATION:** FigBuild 2026 **[CONFIRM length]**
  - **TOOLS:** Figma, FigJam, ChatGPT
  - **SKILLS:** Speculative Product Design, AR
- **Big moments:** the 3-up "Three moments" (C1); companion gallery 9:16 ×3 (C5, phone frames); autonomy-spectrum placeholder. Embed `Sand AR Embed.html` as C16.

### 4.5 ASUS (short; work in progress)
- The header and meta follow the same pattern: **ROLE** Product Manager · **DURATION** Fall 2026–Present · status chip `In Progress`.
- The carousel is a single slide: the glass-lens cover from the home card.
- Sections: OVERVIEW (3-up research questions, C1), RESEARCH IN PROGRESS (one placeholder), then the footer. **Add no invented findings.**

---

## 5. Placeholder spec (C14)
- **Frame:** same as the slot it replaces (ratio given per slot), radius 8px, fill `foreground/5`, 1px dashed border `foreground/15`.
- **Top-left, inside the frame:** Fragment Mono 11px uppercase `foreground/45` label, e.g. `PLACEHOLDER · AFFINITY MAP`.
- **Center:** 14px `foreground/55`, max 48ch, giving the exact brief of what goes there (what it shows, what to crop, what to avoid).
- **Bottom-right:** 11px mono `foreground/35` with the recommended export size, e.g. `2400 × 1200 · PNG`.
- **Dev only:** keep a list of every placeholder on the page in a console table so I can track them, and add a `?placeholders=0` URL flag that hides them for sharing.

---

## 6. Build and technical rules
- **Data:** extend `data-case15.jsx` (`window.CASE15[id]`) with new block types (`problemCards`, `coreQuestion`, `quotes`, `facts`, `gallery3`, `takeaways`, `solution`, `shot`, `panel`, `frames2`, `feature`, `conclusions`, `stats`, `proto`, `placeholder`) plus header fields (`desc`, `chips`, `year`, `h1`, `meta{role,duration,tool,skills,team}`, `carousel[]`, `scene`).
- **Rendering:** render them in `casestudy-v15.jsx` / `casestudy-blocks.jsx`.
- **Styles:** go in a new `case-a.css`, linked last on `CaseStudy.html`, using the `direction-a.css` tokens. Removing that `<link>` must restore the old look.
- **Rebuild:** `cd tools && npm run build` after edits. Verify with headless Chrome against `file://` at 1440 and 390 (iframe wrapper), and compare side by side with Bao's page screenshot.
- **Accessibility:** one `<h1>` per page, then h2/h3 in order. TOC is a `<nav aria-label="Sections">` with `aria-current` on the active item. Carousel buttons have labels, and arrow keys work. Images have alt text from captions.
- **Performance:** lazy-load everything below the carousel; serve webp siblings.

## 7. Phases and acceptance
0. **Phase 0: Notability prototype** (§8). Build it, then **stop and hand it to me to test**. Iterate on screens and animations from my notes before touching the case study.
1. **Phase 1: Components.** Build C1–C17 on a hidden `CaseStudy.html?p=kit` page, then screenshot.
2. **Phase 2: Notability hero.** Full page per §4.1. **Stop for my review** and list every [CONFIRM] still open.
3. **Phase 3:** Contexto, then Partake, Sand and ASUS, reusing the template unchanged.
4. **Phase 4: Polish.** Mobile, reduced motion, next/previous navigation, footer.

**Done means:**
- A screenshot of any section is indistinguishable in rhythm from Bao's: same eyebrow, then H2, then 40px gap, then component.
- No gray hexes, only ink opacities.
- No filled buttons.
- Every visual is either a real asset or a labeled placeholder.
- Every number traces to §4 or a [CONFIRM] I answered.


## 8. Phase 0: the clickable Notability prototype (separate folder)

**Where:** `prototypes/notability/`, a standalone `index.html` plus `app.jsx`, `screens.jsx`, `styles.css` and `data.jsx`. Mirror the structure of the existing `proto/` Contexto prototype. It must open from `file://` with no build step: React 18 UMD + Babel standalone, pinned versions, the same as `Contexto Prototype.html`.

**Look:** Notability's real UI, matched to `assets/thumbs/notability-window.png`, `assets/notability/ss-*.png` and `comp-*.png`:
- an iPad-landscape canvas at **1194×834**, scaled to fit the window, with a slate bezel
- Notability blue `#3b6ef5` and the soft-blue panels
- Inter or the SF system font as a stand-in for Notability's UI font

**Screens and flow** (each one a real, clickable state):
1. **Open note:** "Astronomy 10 · Lecture 6 — The Solar System", with highlights and the handwritten margin note. A sparkle button opens Learn.
2. **Entry point:** the Learn panel slides in from the right with a "Study Session" card and the blue mascot ("Hi Alison — let's set today's goals.").
3. **First-time setup:** an onboarding quiz, 3 questions (how you study best · session length · how much AI help). It is skippable.
4. **Suggestions:** "Start with your material". Notes are ranked by progress, quiz score and highlights, and the student can adjust them.
5. **Goals:** the **AI goals ↔ To-do list** toggle. Typing a goal produces 3–5 microtasks scaled to familiarity. Each task can be edited or removed.
6. **Focus:**
   - minimal Pomodoro timer (25:00 default, with custom lengths)
   - "Silence other apps" toggle
   - the panel collapses into a **sidebar widget** next to the note
7. **Completion moment:** a goal checks off, with a brief, quiet animation (no points, badges or streaks).
8. **Progress summary:** goals completed, time focused, concepts reviewed, and a suggested next session.

**Prototype rules:**
- Every button does something. Back and Escape always work.
- A small dev-only "screen jumper" (press `?`) lists all 8 states.
- **Motion:** 200–300ms ease-out slides and fades only; honor reduced motion. Animations are *added after my first test round*, not before.
- **Test kit:** `prototypes/notability/TEST.md` lists 5 tasks for me ("Start a session on the Solar System note", "Switch to a plain to-do list", "Collapse the session to the sidebar", "Finish a goal", "Find your summary"). For each task: what I should notice, and a blank for my notes. After my notes, log each change as a PROGRESS milestone (`P0.x`).
- **Screenshots:** once approved, export each state at 2× as PNG into `assets/notability/proto/`. These become the case-study carousel, C21 steps and C23 cards.

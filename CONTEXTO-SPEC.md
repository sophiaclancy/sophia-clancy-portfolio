yes# Contexto 2.0: Product Spec (draft)

> An upgrade of **ContextFile** (spring prototype + user testing) and **Contexto** (Workspaces, Constellation, Ask Finder) into one agentic, Finder-native system.
> Status: **draft for Sophia's review.** Items marked **[DECIDE]** need a call before the prototype gets built.

---

## 1. One-line definition

**Contexto is a context layer for macOS that learns what you're working on and gets the right files ready before you go looking for them, inside Finder, Spotlight, and Notification Center, not in a new app.**

It is not a file manager. It is closer to **Focus Mode for files** or **Photos Memories for your work**, as one tester said: *"It's like Photos memories but for school. I would use this before every class."*

---

## 2. Where we're starting from

### 2.1 What exists (ContextFile hi-fi, Figma)
| Surface | What it does today |
|---|---|
| **Spotlight** | Typing a vague term ("files") shows *Files you might need*. Hover shows a context card (Used during Math 1A · Downloaded from Google Docs · 📍 Midterm Week). The card can **Pin / Open / Group**. |
| **Finder sidebar** | A *ContextFile* section with **Pinned · Suggested · Smart Groups · Archive** views, and hover cards on files. |
| **Widget** | *Pinned for this week · Suggested for today · Weekly cleanup suggestion*, each with an Open/Archive action. |
| **Notification** | "Math 1A Notes is ready for lecture." Clicking it opens the file. |

### 2.2 What user testing told us
| Worked | Needs work |
|---|---|
| Auto-surfacing from **calendar + location** was praised. | **Pinned files get buried:** *"If it's just buried in Finder, I might not remember to check it."* |
| **Automatic tags** were essential; manual tagging would be a dealbreaker. | **Unclear what pinning does.** Users want a micro-hint after pinning. |
| The **widget** was the favorite: *"I'd use the widget daily if it popped up before lecture."* | **Cleanup needs review:** *"I like cleanup but want to check before files get moved."* |
| | **One-tap open** from the widget, with no extra steps. |

### 2.3 What Contexto (portfolio version) added
- **Workspaces:** project-level clusters of files and apps, with **Reopen Everything**.
- **Progressive Organization:** "These 14 files appear to belong to Portfolio Refresh." Confirm / Edit / Dismiss.
- **Constellation:** files as nodes and shared context as edges. Clusters show which projects form a Workspace.
- **Ask Finder:** retrieval in natural language ("the résumé I edited before my MDB interview"), which explains its match.
- **Principles:** propose, don't move · explain connections · always reversible · on-device first.

---

## 3. The upgrade: from *surfacing* to *agentic*

ContextFile **shows** you files. Contexto 2.0 **acts** on your behalf, within limits you can see and undo.

| Level | ContextFile (v1) | Contexto 2.0 |
|---|---|---|
| Notice | Suggests files by time and place | Detects that you're **about to start something** (event, location, opening a file) |
| Prepare | You open each file | **Prepares a Workspace:** files, apps, tabs, and last state, staged and ready |
| Explain | Context card on hover | **"Why this?"** on every suggestion: the signals used, with confidence |
| Act | Pin / Archive buttons | **Agent actions** with a preview: reopen, group, clean up, hand off to an app |
| Recover | n/a | **Undo + activity log:** everything the agent did, reversible |

### 3.1 The agent's job, in one sentence
> **Before you need it, have it ready. While you work, keep it together. After you're done, clean up, but only with your OK.**

### 3.2 Autonomy levels (user-set, per action type) **[DECIDE default]**
| Level | Behavior | Example |
|---|---|---|
| **Suggest** | Shows a suggestion; nothing happens without a tap. | "Math 1A notes are ready." Open? |
| **Prepare** | Stages things silently, so opening is instant. | Pre-builds the Workspace 10 min before lecture. |
| **Act** | Does it and tells you, with Undo. | Groups 14 new files into *Portfolio Refresh*. Undo |

Defaults: **Prepare** for opening and staging files, **Suggest** for anything that moves or archives. Nothing is ever deleted.

---

## 4. Surfaces (all native, no new app)

### 4.1 Finder: the home base
- **Sidebar:** a *Contexto* section that replaces *ContextFile*, with these rows:
  - **Now:** the Workspace for what you're doing right now. It's the agent's main surface.
  - **Workspaces:** all project clusters.
  - **Constellation:** the graph view.
  - **Pinned:** stays, but becomes a filter on Now rather than a buried folder (this fixes the "buried" feedback).
  - **Review:** the agent's pending proposals, plus the cleanup queue.
- **Now view:** a context header ("CS61A Study Group · Doe Library · until 4:00"), staged files, apps used last time, **Reopen Everything**, and a *Why these?* link.
- **Context card:** every file gets one (hover or ⌘I). It shows where it came from, when and where it was used, related files, and the Workspace.
- **Pin feedback:** after you pin a file, a micro-hint says "Pinned to *Now* and your widget."

### 4.2 Constellation: the map of your work
- **Nodes** are files; size = recent use. **Edges** are shared context: same event, same place, opened together, same source.
- **Clusters** are Workspaces. Unconfirmed clusters show as dashed outlines, with a **"Make this a Workspace?"** chip.
- **Time scrubber:** drag through the semester and watch clusters form and fade.
- **Agent overlay:** when the agent proposes something, the affected nodes glow and the edges that justify it are highlighted (the explanation, made visible).
- **Select a cluster** to see why the files are connected: "Opened together 6× · during *ECON 1* events · from Canvas."

### 4.3 Spotlight: ask in your own words
- **Ask Finder:** "slides from the lecture before the midterm" or "the doc I had open with Maya on Tuesday."
- Results show a **match reason** ("Opened during ECON 1 · Oct 14 · Wheeler Hall").
- **Inline actions:** Open · Open Workspace · Pin.

### 4.4 Widget + notifications: arrive prepared
- **Widget:** *Up next* (the next event's Workspace) with **one-tap Open All**, then *Pinned*, then *Needs your OK* (pending proposals).
- **Notification:** "Your **Math 1A** Workspace is ready, 3 files from last lecture." Actions: **Open** · *Later* · *Not this*.
- **"Not this"** teaches the agent. The next suggestion shows "Adjusted: fewer lecture-slide suggestions."

### 4.5 Review: the trust surface
- **Proposals:** each one shows a preview (before → after), the signals used, a confidence level, and **Approve / Edit / Dismiss**.
- **Cleanup:** archive proposals list every file. Nothing moves until you approve (this answers the testing feedback directly).
- **Activity log:** "Grouped 14 files · Tue 3:12 PM · Undo." 30-day undo.

---

## 5. Context engine (what signals, and what it never does)

| Signal | Used for | Notes |
|---|---|---|
| **Calendar events** | Upcoming Workspace, notifications | Read-only |
| **Location** (coarse) | "Opened at Doe Library" context | On-device, optional |
| **Co-opened files** | Clusters, Constellation edges | Strongest signal |
| **App usage** | Reopen Everything | Which apps were open with these files |
| **Source** | Canvas, Google Docs, Downloads | From quarantine metadata / download origin |
| **Recency + frequency** | Ranking, node size | |

**Never:** read file *contents* off-device · move files without approval · delete anything · share context with other apps.
**Privacy model:** on-device inference first, Private Cloud Compute only for Ask Finder language parsing. A per-signal toggle lives in System Settings › Contexto.

---

## 6. Key flows to prototype

1. **Arrive prepared:** a notification 10 min before *Math 1A* → tap → Finder opens to **Now** with the files staged → Reopen Everything.
2. **Agent groups new work:** you download 6 files for a new project → a Review badge appears → open the proposal → see the cluster light up in **Constellation** → Approve → Workspace created → "Undo" toast.
3. **Find by memory:** ⌘Space → "notes from the lecture before the midterm" → match reason → Open Workspace.
4. **Clean up with consent:** widget shows "Needs your OK: archive *Spring 2023 Notes* (unused 45 days)" → review the list → uncheck 1 → Approve → activity log.
5. **Correct the agent:** "Not this" on a suggestion → the agent explains the change → the autonomy setting is adjustable inline.

---

## 7. Visual + interaction spec

- **Platform:** macOS Tahoe look (Liquid Glass materials, SF Pro, SF Symbols), framed at **1440 × 900**.
- **Agent presence:** no avatar or chatbot. Agent actions get a small ✦ glyph plus a soft tint (system accent at 12%). The agent is a *quality of the system*, not a character.
- **Explanations:** always one tap away (*Why this?*), never auto-expanded.
- **Motion:** staged files slide into Now (240ms). Constellation nodes ease into clusters (600ms spring). Approve → items fly into their Workspace. Reduced-motion fallbacks for everything.
- **Copy voice:** plain and specific. "Ready for Math 1A," not "AI has curated your files!"

---

## 8. What changes from v1, and why

| Change | Reason |
|---|---|
| Pinned → a filter on **Now** | Testers forgot buried pins |
| Post-pin micro-hint | "What happens after pinning?" was unclear |
| **Review** queue before any move | "Want to check before files get moved" |
| Widget **Open All** | "One-tap access without extra steps" |
| **Constellation** as an explanation surface | Makes the agent's reasoning visible instead of opaque |
| **Autonomy levels** | Users differ in how much they want automated; trust grows over time |
| **Activity log + undo** | Agentic actions need a safety net |

---

## 9. Case study outline (Bao / ASUS layout)

1. **Overview:** the headline ("Your files, ready before you look for them."), a live prototype hero, and meta.
2. **The challenge:** clutter shows up only when you need something; folders demand upkeep nobody does.
3. **What we found:** survey + contextual inquiry, and the pivotal insight: *people forget where a file is, but remember what they were doing.*
4. **Version 1, ContextFile:** Spotlight / Finder / Widget / Notification, plus user-testing results (metric boxes + quotes).
5. **The reframe:** from surfacing to an agent that *prepares*.
6. **Key decisions** (each with a live demo): autonomy levels · Review before move · Constellation as explanation · notifications that learn.
7. **The system:** a surfaces map (Finder, Spotlight, Widget, Notifications, Context engine).
8. **Privacy as product:** what it reads, what it never does.
9. **Impact & reflection.**

---

## 10. Decisions (Sophia, Nov 17)

- **Naming:** **ContextFile = v1** (team project) · **Contexto = v2** (Sophia's solo upgrade).
- **Credit:** initial research + v1 build with Aldrin Ong, Ink Chavanapanit, and Valerie Eng (Sophia: Design & Prototyping Lead). **v2 is Sophia's own update** to bring it up to date with agentic AI.
- **Founding pain point (first person):** "I have a hard time finding files, managing storage, finding old résumés. I don't use folders; folders don't feel like they belong in this decade. Compare Photos, where finding a photo is easy."
  → v2 should **borrow Photos' model**: automatic people/places/moments, **Memories**, search by what's *in* the thing, and **no filing required**.
- **Tagging:** automatic **context tags** (event, place, source, project, people) generated by the system, editable, never required. Smart tags are the bridge between v1 and the Constellation.
- **User testing:** v1 tested with **6–9 participants**; **v2 is untested** (be honest in the case study; propose a test plan).
- **Visual style:** **macOS Tahoe 26 / Liquid Glass**, built from **Apple's official design resources**, not approximations (see §12).
- **Constellation needs evidence:** it's the most novel piece, so it's backed by the research in §11 and kept as a *complement* to search and lists, not a replacement.

## 11. Research backing (for the Constellation + context approach)

| Finding | Source | What it means for Contexto |
|---|---|---|
| People prefer **navigating** to re-find files, even as search improves; email flipped to search. Calls for **integrated search + navigation**. | Jones, Wenning & Bruce, 2014 · [IDEALS](https://www.ideals.illinois.edu/items/47311) | Don't kill browsing; give people a **better thing to browse** than folders: Workspaces and the Constellation. |
| Re-finding queries are short (1.6 words), 53% sought items >1 month old; **search must support episodic access to memory.** People remember many attributes. | Dumais et al., *Stuff I've Seen*, SIGIR 2003 · [talk slides](https://www.cs.nuim.ie/~lkelly/DS2010/SusanDumaisPresentation.pdf) | Ask Finder + context tags (when, where, with what) match how memory actually works. "Old résumés" is exactly this case. |
| **Lapses in memory** are what block re-finding. | Elsweiler, Ruthven & Jones, JASIST 2007 · [paper](https://epub.uni-regensburg.de/22679/1/jasist2007%2Dtowards_memory.pdf) | Surface the cues people *do* remember (event, place, collaborator) instead of filenames. |
| **Associative retrieval** (finding X via a related Y) is easy to use and may be faster than browse/search for these tasks. | Chau, Myers & Faulring, *Feldspar*, CHI 2008 · [summary](https://sciweavers.org/publications/what-do-when-search-fails-finding-information-association) | Direct precedent for the Constellation: hop from a remembered thing to the forgotten one. |
| Participants **often chose associative browsing**; it works best **combined with keyword search**. | Kim & Croft, UMass CIIR · [paper](https://ciir-publications.cs.umass.edu/pub/web/getpdf.php?id=1013) | Constellation is a *complement* to Ask Finder, reached from search results ("show related"). |
| **Co-access graphs** (files opened within ~30 s of each other) are a strong relationship signal for ranking. | Personal file search via relationship graphs · [arXiv 1601.07273](https://www.arxiv.org/pdf/1601.07273) | Edges = co-opened files is technically grounded, not invented. |
| Personal knowledge graphs enable **browsing by association**. | SemEx (Dong & Halevy) · [survey](https://arxiv.org/pdf/2412.12330) | The same idea that powers Obsidian's graph, applied automatically to files you never linked by hand. |

**Analogues users already understand:** Photos (Memories, People, Places), Obsidian graph view (linked thinking), Spotlight (ask anywhere).
**Gap to test in v2:** do students *use* the Constellation to re-find, or only to understand the agent's grouping? (Test plan below.)

### v2 test plan (proposed)
- 6–8 students. Tasks: (1) find a résumé from last year's recruiting season, (2) prepare for tomorrow's class, (3) approve/correct an agent grouping.
- Compare **folder/Spotlight baseline vs. Contexto** on time-to-find and confidence. Note when people choose Ask Finder vs. Constellation.
- Measure trust: did they review the agent's proposals before approving? Did undo get used?

## 12. Building it "identical to macOS"

The prototype will be built from **Apple's official macOS Tahoe 26 design resources** (Liquid Glass materials, window chrome, sidebar, toolbar, Spotlight, widgets, notifications) plus **SF Pro + SF Symbols**, not hand-drawn approximations.
- Apple ships the macOS 26 kit as a **Sketch library** ([Apple Design Resources](https://developer.apple.com/design/resources/)); **Figma lists a macOS 26 UI kit** that can be added from the Libraries modal / Community ([Figma help](https://help.figma.com/hc/en-us/articles/24037833895831-Get-started-with-Apple-s-UI-kit)).
- **Needed from Sophia:** add the macOS 26 kit to a Figma file (or duplicate the Community file) and share the link, so specs (sizes, radii, blur, materials, type) are read directly from Apple's components.

## 12b. Hero flow: "The right résumé, every time" (job hunting)

**Scenario:** Maya has 11 résumé versions across Downloads, Desktop, and Google Drive exports ("Resume_final_v3.pdf", "resume_PM_new.pdf"…). Her calendar shows *Figma PM Intern application due Fri* and *Interview: Notion, Tue 2pm*.

1. **Context detected:** Contexto sees a calendar event tagged as an application deadline and an upload dialog opening in Safari (Greenhouse / Workday).
2. **Agent surfaces the match:** above the file picker, a Contexto suggestion: **"Resume_PM_Fall26.pdf"**, with *Why this?*: "Tailored for product roles · last edited Oct 30 · used for 3 PM applications · not the design-intern version."
3. **Guardrail:** if she picks an older or mismatched version ("Resume_Design_2025.pdf"), a gentle inline flag says "This one is from last year's design search. Use the PM version instead?" Two taps: **Use suggested** / **Keep mine**.
4. **After submit:** the application joins the **Job Search** Workspace (company, role, résumé used, date, status), so "which résumé did I send Notion?" is answerable later via Ask Finder.
5. **Constellation view:** the Job Search cluster shows each résumé version linked to the applications it was used for. The *current* version is highlighted; stale ones fade (archive suggested, with review).

Why it's the hero: it's high-stakes (the wrong résumé costs an opportunity), universal for students, directly from Sophia's own pain point, and it shows all three agent behaviors: **notice → prepare → protect**.

## 13. Remaining open questions
1. Prototype scope: start with **Arrive prepared** + **Agent groups → Constellation** + **Find an old résumé (Ask Finder)**?
2. Real or sample data: use a realistic student file set (résumés by season, CS61A, ECON 1, internship apps)?

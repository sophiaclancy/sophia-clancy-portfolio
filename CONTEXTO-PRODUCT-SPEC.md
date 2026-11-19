# Contexto · Product & Design Spec
### *Your files, ready before you look for them.*

> **Version:** 2.0 (v2 upgrade of ContextFile) · **Author:** Sophia Clancy · **Status:** Spec → prototype · **Date:** Nov 2026
> **Lineage:** ContextFile v1 (Spring 2025, team: Aldrin Ong, Ink Chavanapanit, Valerie Eng; Sophia: Design & Prototyping Lead) → **Contexto v2** (Fall 2026, Sophia, solo).

---

## 0. TL;DR

Finding a file on a Mac still depends on **remembering where you put it**. Finding a photo doesn't: Photos just knows the who, where, and when. **Contexto brings the Photos model to Finder.** It automatically connects files to the moments they belong to (classes, applications, projects, people) and uses an **on-device agent** that gets the right files ready *before* you go looking, explains why, and never moves anything without your OK.

**v1 (ContextFile)** proved that students want files to surface automatically. 6–9 testers loved the widget and the automatic tags, and asked for more visibility, review-before-cleanup, and one-tap access.
**v2 (Contexto)** makes it **agentic** (notice → prepare → protect), adds a **Constellation** map for associative re-finding (grounded in PIM research), and leads with the highest-stakes case students face: **sending the right résumé.**

---

## 1. Problem

### 1.1 The founder story
> "I have such a hard time finding files, managing storage, finding old résumés. I don't use folders. Folders don't feel like they belong in this decade. In Photos, it's easy to find anything."
> *Sophia, designer and target user*

### 1.2 The real problem, stated precisely
People **don't forget files. They forget *where they put them*.** What they *do* remember is the **episode**: what they were doing, when, where, and with whom. Finder only indexes the thing people forget (location in a hierarchy) and ignores the thing they remember (context).

| What people remember | What Finder asks for |
|---|---|
| "The résumé I sent Notion" | `~/Downloads/resume_final_v3 (2).pdf` |
| "Slides from the lecture before the midterm" | `ECON1/Week7/Lecture13.key` |
| "The doc I worked on with Maya at Doe" | A filename they never chose |

### 1.3 Why now
- **On-device intelligence is real.** Apple Intelligence + Private Cloud Compute make private, context-aware features feasible without uploading files.
- **Agents are the new interface.** Users increasingly expect software to *act*, but trust drops fast when an agent acts invisibly.
- **The comparison is unavoidable.** Photos (Memories, People, Places), Spotlight, and Siri Suggestions already prove this model on Apple platforms; files are the last big unorganized surface.

### 1.4 Who hurts most
**Students and early-career job seekers.** High file churn, many near-duplicate versions, deadline pressure, many sources (Canvas, Google Docs, email attachments, Downloads), and no time or desire to file.

---

## 2. Research

### 2.1 Primary (v1, ContextFile)
- **Survey + contextual inquiry** (team, Spring 2025): students navigated their own Macs while explaining how they search and save.
- **User testing of the v1 hi-fi:** **6–9 participants**, flow Spotlight → Pin → Finder → Widget → Open.

**v1 testing results**
| Signal | Evidence |
|---|---|
| ✅ Concept understood instantly | "Users quickly understood ContextFile's purpose: surfacing needed files automatically." |
| ✅ Auto-surfacing by calendar + location praised | |
| ✅ Automatic tags essential | Manual tagging "would have been a dealbreaker." |
| ✅ **Widget = favorite feature** | "I'd use the widget daily if it popped up before lecture." |
| ✅ Emotional anchor | "It's like Photos memories but for school. I would use this before every class." |
| ⚠️ Pins get buried | "If it's just buried in Finder, I might not remember to check it." |
| ⚠️ Unclear what pinning does | Users wanted a micro-hint after pinning |
| ⚠️ Cleanup needs review | "I like cleanup but want to check before files get moved." |
| ⚠️ Too many steps from widget | Wanted one-tap open |

### 2.2 Secondary: Personal Information Management (PIM)
| # | Finding | Source | Design implication |
|---|---|---|---|
| R1 | People **prefer navigating** to re-find files, even as search improves; authors call for **integrated search + navigation**. | Jones, Wenning & Bruce, 2014 · [IDEALS](https://www.ideals.illinois.edu/items/47311) | Don't replace browsing; give people a **better thing to browse** than folders. |
| R2 | Re-finding queries are short (~1.6 words); 53% of sought items are >1 month old; **search must support episodic memory**. | Dumais et al., *Stuff I've Seen*, SIGIR 2003 · [slides](https://www.cs.nuim.ie/~lkelly/DS2010/SusanDumaisPresentation.pdf) | Index **when / where / with what / for what**, not just names. |
| R3 | **Memory lapses** are what block re-finding. | Elsweiler, Ruthven & Jones, JASIST 2007 · [paper](https://epub.uni-regensburg.de/22679/1/jasist2007%2Dtowards_memory.pdf) | Surface cues people *do* remember; never require recalling a filename. |
| R4 | **Associative retrieval** (find X via a related Y) is easy and may be faster than browse/search for these tasks. | Chau, Myers & Faulring, *Feldspar*, CHI 2008 · [summary](https://sciweavers.org/publications/what-do-when-search-fails-finding-information-association) | Direct precedent for the **Constellation**. |
| R5 | Users **often choose associative browsing**; best **combined with keyword search**. | Kim & Croft, UMass CIIR · [paper](https://ciir-publications.cs.umass.edu/pub/web/getpdf.php?id=1013) | Constellation is reached *from* search ("show related"), not a separate destination. |
| R6 | **Co-access** (files opened within ~30 s) is a strong relationship signal. | Personal file search via relationship graphs · [arXiv 1601.07273](https://www.arxiv.org/pdf/1601.07273) | Graph edges are grounded in behavior, not guesses. |
| R7 | Personal knowledge graphs enable **browsing by association**. | SemEx; survey in [arXiv 2412.12330](https://arxiv.org/pdf/2412.12330) | Obsidian-style linked thinking, built **automatically**. |

### 2.3 Analogues (what users already trust)
*Full teardown, feature matrix, and positioning map: **CONTEXTO-COMPETITIVE.md**.*

| Product | Borrow | Avoid |
|---|---|---|
| **Photos** | Automatic Memories, People, Places; zero filing | Opaque curation with no "why" |
| **Obsidian graph** | Linked thinking, spatial memory of ideas | Manual linking, intimidating hairball graphs |
| **Spotlight / Siri Suggestions** | Ask anywhere, suggestions at the right moment | Suggestions with no explanation |
| **NotebookLM / AI agents** | Grounded answers with sources | Acting without visible, reversible steps |

---

## 3. Insights → opportunities

| Insight | Opportunity |
|---|---|
| **I1. People remember episodes, not paths.** (R2, R3, v1 inquiry) | Make **context** the primary index: event, place, source, project, people. |
| **I2. Filing is a tax nobody pays.** (Sophia; v1: manual tags = dealbreaker) | **Zero-effort organization:** automatic context tags + Workspaces. |
| **I3. Browsing still matters; folders are the wrong thing to browse.** (R1, R4, R5) | **Constellation + Workspaces** as browsable structure that builds itself. |
| **I4. Surfacing is only valuable at the right moment.** (v1 widget love) | Agent **prepares** before the moment (class, interview, application). |
| **I5. Automation without review breaks trust.** (v1 cleanup feedback) | **Review queue + undo log**; nothing moves without approval. |
| **I6. High stakes amplify the pain.** (résumés, applications) | Lead with the **job-search** scenario, where the wrong file costs an opportunity. |

---

## 4. Product principles

1. **Context over location.** Every file is findable by *what it was for*.
2. **No filing required, ever.** Tags and groups are automatic; editing is optional.
3. **Prepare, don't presume.** The agent gets things ready; you decide what happens.
4. **Always explain.** Every suggestion has a *Why this?* with the signals used.
5. **Always reversible.** Approve before moves; 30-day undo on everything.
6. **Native, not new.** Lives inside Finder, Spotlight, widgets, and notifications. No new app to remember.
7. **Private by default.** On-device inference; file contents never leave the Mac.

---

## 5. The system

### 5.1 Concept model
```
Signals ──► Context Graph ──► Workspaces ──► Surfaces
(calendar,   (files ↔ events,   (auto clusters:   (Finder · Spotlight ·
 location,    places, sources,   "ECON 1",         Widget · Notification ·
 co-opens,    people, apps)      "Job Search")     File pickers)
 sources,                │
 app usage)              └──► Agent (notice → prepare → protect)
                                   └──► Review queue + Activity log
```

### 5.2 Objects
| Object | Definition | Created by |
|---|---|---|
| **Context tag** | Typed label: `event`, `place`, `source`, `project`, `person`, `version` | System (editable) |
| **Workspace** | A living cluster of files + apps for one class/project/goal | System proposes · user confirms |
| **Moment** | A time-bounded episode (lecture, interview, study session) | Calendar + activity |
| **Proposal** | An agent action awaiting approval (group, archive, swap file) | Agent |
| **Activity entry** | Something the agent did, with Undo | Agent |

### 5.3 Agent behaviors
| Behavior | Trigger | Output | Default autonomy |
|---|---|---|---|
| **Notice** | Upcoming event, upload dialog, new download burst | A moment is detected | Silent |
| **Prepare** | ~10 min before an event; file picker opens | Workspace staged; best file suggested | **Prepare** (no moves) |
| **Protect** | Likely wrong/outdated version selected | Inline flag with a better match | **Suggest** |
| **Organize** | New cluster of co-used files | "Make this a Workspace?" proposal | **Suggest** |
| **Clean up** | Files unused 45+ days | Archive proposal with full list | **Suggest**, never delete |

**Autonomy levels (per behavior, user-adjustable in Settings › Contexto):** Suggest → Prepare → Act (with Undo).

---

## 6. Surfaces & information architecture

### 6.1 Finder sidebar
```
Favorites
Contexto                ← new section (Section Header, system style)
  ◉ Now                  current moment's Workspace
  ▢ Workspaces           all clusters (ECON 1, CS61A, Job Search…)
  ✦ Constellation        graph view
  ⚑ Review          (3)  pending proposals (badge = Detail text)
Locations
Tags
```
- **Pinned** is removed as a destination (v1 "buried" problem). It becomes a **pin state** visible in *Now*, the widget, and Spotlight.

### 6.2 Now (Finder content area)
- **Header:** moment name, time, place ("Interview prep · Notion · Tue 2:00 PM").
- **Staged files:** gallery of 3–6 files, each with a context chip ("Sent to Notion · Oct 30").
- **Apps last used here** + **Reopen Everything**.
- *Why these?* link opens the signals list.

### 6.3 Workspaces
Grid of cluster cards (cover = most-used file thumbnail, file count, last active). Inside: files grouped by **source** (Canvas · Docs · Downloads) or **version** (for résumés), plus an applications table for Job Search.

### 6.4 Constellation (v2 design: focus + orbit)
> Prototype feedback: showing every node at once was hard to follow. The redesign shows **one file at a time**.
- **Center:** the file in focus, as a large Liquid Glass card (preview, name, one line of metadata, Open / Quick Look).
- **Orbit:** up to 7 direct connections as glass pills, each captioned with the *relationship* ("Sent Oct 30", "Tailored copy", "Replaced by this").
- **Outer ring:** faint second-degree items, shown only when they fit. Never squeezed, never a hairball.
- **Click any pill → it moves to the center** (750 ms spring), with a back crumb. Re-finding is just following the trail.
- **The agent speaks once, at the bottom:** a single glass pill ("4 older versions were replaced by this résumé · Review · Archive").
- **Behind it all:** a soft, slowly drifting Contexto glow (indigo → teal) that gives the glass something to refract.

#### Earlier exploration (v2.0 prototype)
- **Nodes** = files (size = recent use; color = Workspace). **Edges** = shared context (co-opened, same event, same source).
- **Clusters** = Workspaces; unconfirmed clusters have a dashed hull plus a **"Make this a Workspace?"** chip.
- **Focus mode:** select a node to fade others; show 1-hop neighbors labeled with *why* they're linked.
- **Time scrubber:** drag through the semester; clusters form and fade.
- **Agent overlay:** proposals highlight their nodes and the edges that justify them. **The graph is the explanation.**
- **Guardrail:** never show more than ~60 nodes at once; collapse distant clusters into labeled bubbles (avoid the Obsidian "hairball").

### 6.5 Spotlight (Ask Finder)
- Natural queries: "résumé I sent Notion," "slides before the ECON midterm."
- Result rows show a **match reason** in Detail text plus actions: **Open · Show in Workspace · Show related (→ Constellation)**.

### 6.6 Widget (Notification Center / desktop)
- **Up next:** the next moment's Workspace with **Open All** (one tap; fixes v1 feedback).
- **Pinned** (2–3).
- **Needs your OK:** pending proposals count.

### 6.7 Notifications
- "Your **Notion interview** Workspace is ready: résumé, portfolio, and notes." **Open** · Later · *Not this*.
- *Not this* → a follow-up line: "Got it, fewer interview reminders like this."

### 6.8 File pickers (Open/Upload panels)
- Contexto row at the top of the panel: **Suggested for this upload** with a reason. This is the core of the résumé flow.

---

## 7. Hero flows

### Flow A: The right résumé, every time ★ (primary)
**Persona:** Maya, CS junior, recruiting season. 11 résumé versions across Downloads, Desktop, and Drive exports.
**Context:** Calendar: *Figma APM application due Fri*; Safari opens a Greenhouse upload dialog.

| Step | Screen | What happens | Why (principle / research) |
|---|---|---|---|
| A1 | Safari + upload panel | Picker opens with a **Contexto suggestion row**: *Resume_PM_Fall26.pdf* | Prepare, don't presume · I4 |
| A2 | *Why this?* popover | "Tailored for product roles · edited Oct 30 · used for 3 PM applications · newer than the design version" | Always explain · R2 |
| A3 | Wrong pick | Maya selects *Resume_Design_2025.pdf* → inline flag: "This is from last year's design search. Use the PM version?" **Use suggested / Keep mine** | Protect · I6 |
| A4 | After upload | Toast: "Added to **Job Search**: Figma · APM · Resume_PM_Fall26." Undo | Always reversible |
| A5 | Finder › Workspaces › Job Search | Applications table: company, role, résumé sent, date, status | No filing required |
| A6 | Constellation | Résumé versions linked to the applications they were sent to; the stale design versions fade, with an archive proposal | The graph is the explanation · R4 |

**Success:** correct version uploaded on the first try; "which résumé did I send X?" answered in <10 s.

### Flow B: Arrive prepared
Notification 10 min before *ECON 1* → **Open** → Finder *Now* with lecture slides, problem set, and notes staged → **Reopen Everything** (Preview + Notes + Canvas tab).

### Flow C: Agent organizes new work (Constellation)
6 downloads + 2 new docs, opened together over 2 days → **Review (1)** badge → proposal "These 8 files look like **Portfolio Refresh**" → open in Constellation: the dashed cluster glows, with edges labeled *opened together 5×* → **Approve** → the cluster becomes solid → Undo toast.

### Flow D: Find by memory
⌘Space → "slides before the econ midterm" → result with reason "Opened during ECON 1 · Oct 14 · Wheeler Hall" → **Show related** → Constellation focus on that node.

### Flow E: Clean up with consent
Widget: *Needs your OK* → "Archive *Spring 2025 Notes* (14 files, unused 60 days)?" → review list → uncheck 1 → **Approve** → activity log entry.

---

## 8. Visual specification (Apple macOS 26 UI Kit, measured)

All values read directly from Apple's **macOS 26** Figma library (Desktop Template, Window, Sidebar Example, Item, Section Header, Notification, Search Field, Window/Search). The prototype must match these exactly.

### 8.1 Canvas
| Element | Spec |
|---|---|
| Desktop | **1512 × 982** (MacBook Pro 14") with the official Tahoe wallpaper |
| Menu bar | **34 px** tall · padding 5/10 · items 24 px tall, radius 4, padding 4/11 · **SF Pro Semibold 13/16** (app name **Bold 13/16**) · backdrop: background blur **60** + white 15% "plus lighter" |
| Dock | 882 × 62 · radius **15** · fill #F6F6F6 @36% · stroke #1A1A1A @46% 1 px · background blur **~136** · shadow 0 0 6 #000 @15% · icons **36 px**, gap 9, padding 10/8/11/8 · separator 1 × 41 #3C3C43 @29% |

### 8.2 Window
| Element | Spec |
|---|---|
| Window | radius **26** · fill #FFFFFF · shadows **0 16 48 #000 @35%** + **0 0 0 1 (spread) #000 @23%** |
| Window controls | 3 × **14 px** circles, gap **9** · Close **#FF736A** · Minimize **#FEBC2E** · Zoom **#19C332** · stroke #000 @10% 0.5 px |
| Toolbar glass button (Window/Search) | height **36**, radius full · fill stack #333 / #FFF @50% / #F7F7F7 · **Glass r7** + #000 @20% · shadow 0 8 40 #000 @12% · label **SF Pro Medium 13/16 #727272** · padding 0/10, gap 6 |

### 8.3 Sidebar (floating Liquid Glass panel)
| Element | Spec |
|---|---|
| Panel | width **240** · radius **18** · fill #262626 + #F5F5F5 @67% · **Glass r12** + #000 @20% · shadow 0 8 40 #000 @12% · inner padding top/bottom **10** |
| Sidebar toggle | 24 × 24 button · SF Symbol `sidebar.left` Semibold 10 |
| Item | height **24** · outer padding 0/10 · inner radius **8**, padding 4/10/4/8, gap **6** · icon slot 18 × 16 · label **SF Pro Medium 11/16 #000 @85%** · detail **SF Pro Medium 11/14 #BFBFBF** |
| Item, selected | inner fill **#000 @11%** |
| Section header | height **34** · padding 15/12/5/18 · title **SF Pro Bold 11/14 #000 @50%** · disclosure chevron Bold 11 #000 @25% |

### 8.4 Notification
| Element | Spec |
|---|---|
| Container | **344 × 72** · radius **16** · Liquid Glass Medium (fill #262626 + #F5F5F5 @67%, Glass r12, #000 @20%, shadow 0 8 40 #000 @12%) · padding 12/9/12/13 · gap 13 |
| App icon | **32 px** |
| Title | **SF Pro Bold 13/16**, tracking −2%, #000 @85% |
| Body | **SF Pro Regular 13/16**, tracking −0.8%, #000 @85% (2 lines max) |
| Timestamp | **SF Pro Regular 11/14 #BFBFBF** |

### 8.5 Search field (in-window)
24 px tall · radius full · white fill + 1 px ring #000 @8% · magnifier **SF Pro Rounded Medium 13** · text **SF Pro Medium 13/16**.

### 8.6 Color & materials
- Accent: **#007AFF** (system blue). Labels: Primary #000, Secondary/Tertiary/Quaternary per the kit's `Labels/*` variables.
- Materials: use the kit's **Ultrathin → Ultrathick** fills; Liquid Glass surfaces = fill stack + `GLASS` effect (r7 for controls, r12 for panels).
- **Contexto accent:** none beyond system blue. The agent's presence is shown with an **SF Symbol `sparkle`** in secondary label color and a **12% accent tint** on proposal rows. No branded color; it should feel like Apple shipped it.

### 8.6b Contexto brand layer
Apple's system first; Contexto adds exactly **one signature**: an **indigo → teal gradient** (`#5E5CE6 → #30B0C7`, both Apple system hues) used only where the *agent* is speaking: the ✦ glyph, its primary action button, and the focus halo in the Constellation. Everything else is system blue, system type, and system materials, so it reads like a feature Apple shipped, with its own fingerprint.

### 8.7 Typography
**SF Pro** only (Text ≤ 19 pt, Display ≥ 20 pt), SF Symbols for all icons. No emoji in UI (v1 used 📍 and 📄; replace with `mappin`, `doc`).

### 8.8 Motion
| Moment | Motion |
|---|---|
| Staged files enter *Now* | slide-up 12 px + fade, 240 ms, ease-out, 40 ms stagger |
| Proposal approved | items scale to 0.9 and fly toward the Workspace sidebar row, 360 ms spring |
| Constellation cluster confirm | dashed hull → solid, 600 ms spring; nodes ease together |
| Notification | system banner timing (slide from top-right) |
| Reduced motion | cross-fades only |

---

## 9. Content & voice

- Plain, specific, calm. **"Ready for ECON 1"**, not "✨ AI curated your files!"
- Always name the reason: *"Used for 3 PM applications."*
- Errors and uncertainty are honest: *"Not sure. These 2 files could belong to either Workspace."*
- Never anthropomorphize the agent ("I think…"). It's the system, not a character.

---

## 10. Privacy & trust

| Contexto reads | Contexto never |
|---|---|
| Calendar event titles/times (read-only) | Reads file **contents** off-device |
| Coarse location (optional) | Moves or renames files without approval |
| File metadata: opened, modified, source, co-opened | Deletes anything |
| Which apps were open with which files | Shares context with third-party apps |

- **Per-signal toggles** in System Settings › Contexto.
- **Activity log** retains 30 days; one-tap Undo.
- Ask Finder language parsing via **Private Cloud Compute** only when needed.

---

## 11. Success metrics

| Metric | Target (prototype test) | Why |
|---|---|---|
| Time to find a target file (vs. Finder baseline) | **−50%** | Core value |
| First-try correct résumé upload | **≥ 90%** | Hero flow |
| Proposals reviewed before approval | **≥ 80%** | Trust/understanding, not blind accept |
| Undo usage | **< 10%** of actions | Agent accuracy |
| "Would use before every class/application" (SUS-style agree) | **≥ 4/5** | Desirability (v1 anchor quote) |
| Constellation used to re-find (not just view) | Observe | Validate R4/R5 in our context |

---

## 12. v2 test plan

- **Participants:** 6–8 students/recent grads, at least 4 actively job hunting.
- **Setup:** pre-seeded Mac with a realistic file set (11 résumé versions, 3 classes, internship apps).
- **Tasks:**
  1. Upload the correct résumé for the Figma APM application.
  2. Find the résumé you sent Notion last month.
  3. Get ready for tomorrow's ECON class.
  4. Review and approve or correct an agent grouping.
  5. Clean up last semester's files.
- **Compare:** Finder + Spotlight baseline vs. Contexto (within-subjects, counterbalanced).
- **Measure:** time, errors, path (Ask Finder vs. Constellation vs. Workspaces), trust ratings, think-aloud on *Why this?*.

---

## 13. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Wrong suggestions erode trust | Confidence thresholds; show reasons; "Not this" learning; never auto-act on moves |
| Graph overwhelms ("hairball") | Cap visible nodes; focus mode; clusters collapse to bubbles |
| Creepiness (location/calendar) | On-device, per-signal toggles, plain-language privacy screen at setup |
| Feels like "another thing to check" | Lives in existing surfaces; the widget + file picker do the work |
| Technical feasibility | Builds on existing APIs: Spotlight metadata, quarantine/download origin, EventKit, File Provider, App Intents |

---

## 14. Scope

| v2 prototype (now) | Later |
|---|---|
| Flow A (résumé) end-to-end | Collaboration (shared Workspaces) |
| Flows B–D | iPhone/iPad continuity |
| Constellation (focus, proposal overlay, scrubber) | Third-party app integrations |
| Review queue + activity log | Learning dashboard |
| Settings: autonomy + signals | |

---

## 15. Build plan

| Phase | Output |
|---|---|
| **1. Kit** | Rebuild macOS 26 components in code from §8 specs (window, sidebar, items, notification, menu bar, dock, glass materials) |
| **2. Flow A** | Safari upload → picker suggestion → wrong-pick protection → Job Search Workspace → Constellation |
| **3. Flows B–D** | Notification → Now; proposal → Constellation; Spotlight Ask Finder |
| **4. Polish** | Motion, reduced-motion, self-playing tours for the case study |
| **5. Case study** | v1 → v2 story in the portfolio's standard layout |

---

## 16. Case study narrative (portfolio)

1. **Hook:** "Finding a photo takes seconds. Finding last year's résumé takes twenty minutes."
2. **v1, ContextFile:** team research, the four surfaces, testing results (metric boxes + quotes).
3. **What v1 taught me:** buried pins, review-before-cleanup, one tap.
4. **Reframe:** from *surfacing* files to an agent that *prepares*.
5. **Key decisions** (live demos): picker suggestion + protection · Review before move · Constellation as explanation · autonomy levels.
6. **The system:** surfaces map + privacy model.
7. **Research backing** (Constellation evidence).
8. **What's next:** v2 test plan.

---

### Appendix: Apple macOS 26 components used
Desktop Template · Menu Bar · Dock · Window · Window Controls · Window/Search (toolbar glass) · Sidebar Example · Item · Folder · Section Header · Search Field · Notification · Materials (Ultrathin–Ultrathick) · Labels variables · Accents/Default.

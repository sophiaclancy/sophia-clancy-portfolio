# Contexto · Competitive Analysis
*Companion to CONTEXTO-PRODUCT-SPEC.md · Nov 2026*

> **Question:** Who already helps people re-find files, and where do they all stop?
> **Short answer:** Every tool falls into one of three camps: it **waits for you to search**, it **organizes by rules you write**, or it **remembers everything without explaining anything**. None of them *prepare* the right file for the moment you need it and *show their reasoning*. That gap is Contexto.

---

## 1. The landscape

| Camp | Products | Promise | Where it stops |
|---|---|---|---|
| **Search-first** | Finder + Spotlight, Raycast, Google Drive search, Dropbox Dash | "Type and we'll find it." | Requires you to remember *something* about the file (a name, a word). Reactive; never helps before you ask. |
| **Rules-first** | Hazel, Smart Folders, Finder Tags, Sparkle-style AI sorters | "Set it up once and files go to the right place." | Setup cost; rules don't know *why* a file matters this week. AI sorters move files into new folders, which reproduces the folder problem. |
| **Memory-first** | Windows Recall, Rewind-style screen recorders | "We captured everything; ask anything." | Records far more than needed (trust/privacy backlash); answers *what happened*, not *what you need next*. |
| **Graph-first** | Obsidian graph, Notion AI, Mem | "See how your ideas connect." | Links are manual (or limited to notes in one app); graphs become unreadable "hairballs"; not about real files on disk. |
| **Moment-first (analogue)** | Apple Photos Memories, Siri Suggestions | "We bring the right thing back at the right time." | Proven for photos and apps, **not applied to documents.** |
| **Job-search trackers** | Teal, Huntr, spreadsheets | "Track every application." | Résumé versions live *outside* the file system; logging is manual; nothing checks the upload itself. |

---

## 2. Feature comparison

● = strong · ◐ = partial · ○ = none

| | Finder + Spotlight | Google Drive | Dropbox Dash | Hazel / Smart Folders | Windows Recall | Obsidian | Photos (analogue) | **Contexto** |
|---|---|---|---|---|---|---|---|---|
| Zero-effort organization | ○ | ◐ | ◐ | ○ (rules) | ● | ○ | ● | **●** |
| Understands *moments* (calendar, place, task) | ○ | ◐ | ◐ | ○ | ◐ | ○ | ● | **●** |
| Proactive (before you search) | ◐ | ◐ | ○ | ○ | ○ | ○ | ● | **●** |
| Explains *why* a result appears | ○ | ○ | ◐ | ● (your rule) | ○ | ● (your links) | ○ | **●** |
| Review + undo before changes | n/a | n/a | n/a | ◐ | n/a | n/a | n/a | **●** |
| Browsable structure besides folders | ◐ (tags) | ○ | ○ | ◐ | ◐ (timeline) | ● (graph) | ● | **●** |
| Works inside existing OS surfaces | ● | ○ | ○ | ● | ● | ○ | ● | **●** |
| Protects against the *wrong* file | ○ | ○ | ○ | ○ | ○ | ○ | ○ | **●** |
| Private / on-device by default | ● | ○ | ○ | ● | ◐ | ● | ● | **●** |

*Ratings are a designer's qualitative read of each product's core experience, not a feature audit.*

---

## 3. Positioning

```
                    PROACTIVE (prepares before you ask)
                                 ▲
             Photos Memories ●   │        ★ Contexto
         (photos only)           │   (files · explains · reversible)
                                 │
   MANUAL ───────────────────────┼─────────────────────── AUTOMATIC
   (you organize)                │                  (system organizes)
        Hazel ●  Obsidian ●      │      ● Recall   ● Drive / Dash
     Smart Folders ●             │   (captures all,  (AI search)
                                 │    explains none)
            Finder ●             │
                                 ▼
                    REACTIVE (waits for a query)
```

**The open quadrant:** *automatic and proactive*, for files. The products closest to it either aren't for documents (Photos) or lose user trust by capturing everything (Recall). Contexto's differentiator isn't "more AI." It's **AI that prepares, explains, and asks first.**

---

## 4. Product teardown: what to borrow, what to avoid

### Finder + Spotlight (macOS 26)
- **Borrow:** native surfaces, instant search, Tags as a data model, Quick Look.
- **Gap:** Tags are manual (v1 testers: manual tagging = "dealbreaker"); Recents is a flat time list with no idea *what for*; nothing proactive inside Finder.
- **Contexto move:** add a **Contexto** sidebar section and auto-tags; make Spotlight results carry a *match reason*.

### Google Drive / Dropbox Dash
- **Borrow:** suggested files on the home screen; cross-app search.
- **Gap:** cloud-only, account-bound; suggestions don't say why; no help at the moment of upload.
- **Contexto move:** the same idea, but **on-device**, **explained**, and **in the file picker**.

### Hazel / Smart Folders / AI sorters
- **Borrow:** automation that runs in the background; the user stays in control of the rules.
- **Gap:** you must anticipate every case up front; AI sorters still *move files into folders*.
- **Contexto move:** **organize by meaning without moving anything.** Workspaces are views, not folders.

### Windows Recall / screen-memory tools
- **Borrow:** search by episode ("what was I doing Tuesday").
- **Avoid:** capturing screenshots of everything; unclear consent. Recall launched to a privacy backlash and was reworked to be opt-in.
- **Contexto move:** only **metadata and calendar**, per-signal toggles, nothing leaves the Mac.

### Obsidian graph view
- **Borrow:** spatial, associative re-finding (backed by Feldspar, CHI 2008; Kim & Croft).
- **Avoid:** manual links and the unreadable hairball.
- **Contexto move:** the **Constellation** is built automatically from behavior, capped at ~60 nodes, clustered by Workspace, and **doubles as the agent's explanation.**

### Photos Memories
- **Borrow:** the emotional model Sophia and v1 testers named ("like Photos memories but for school").
- **Gap:** never says why it chose something, and that's fine for photos. For a résumé, it isn't.
- **Contexto move:** Memories + **Why this?**

### Teal / Huntr (job-search trackers)
- **Borrow:** the applications table (company, role, status).
- **Gap:** you log everything by hand; the tracker never sees which file you actually uploaded.
- **Contexto move:** the tracker **builds itself at the upload moment**, and links each application to the exact résumé sent.

---

## 5. Takeaways for the design

1. **Win at the moment of need, not in a new app.** The file picker and the widget matter more than a dashboard.
2. **Explanation is the feature.** Every competitor that automates hides its reasoning; *Why this?* is the differentiator.
3. **Don't move files.** Workspaces and tags are lenses; folders stay where they are (removes the Hazel/AI-sorter fear).
4. **Capture less than Recall.** Metadata + calendar is enough, and it's easier to trust.
5. **Make the graph useful, not decorative.** The Constellation earns its place by showing *why* the agent grouped or flagged something.

---

## 6. For the case study
- Show the **2×2** (Section 3) as a clean diagram.
- Show the **comparison table** trimmed to 5 rows: Zero-effort · Moments · Proactive · Explains why · Protects against the wrong file.
- One line per competitor: *what they do well → what's missing → our move.*

---

## 7. Added Nov 18, 2026 (see CONTEXTO-DECISIONS.md, evidence E2–E3)

| Product | Model | Lesson for Contexto |
|---|---|---|
| **AvianSort** | Pick a folder → proposed categories → *Apply* moves files. "Nothing changes until you say so." Windows only for now; Smart Folders (auto-sort) coming | Tidiness sells, and review-before-apply is table stakes. But moving files into one category recreates the tree. → Contexto's **Organized views** give the payoff without moving anything (D-007) |
| **WinFS** (Microsoft, cancelled) | Replace the filesystem with a relational/metadata store | Don't replace the FS. Layer on top (D-002) |
| **Didgets** | Stable file IDs + tags; folders optional and many-to-many | Stable identity, one file in many homes (D-003, D-005) |
| **Perkeep / homemade graphs** | Content-addressed store + node/edge DB; navigate search → follow edge | Even graph enthusiasts navigate one hop at a time (D-010) |
| **MyReach** | Cloud graph of files | Cloud-only; Contexto stays on-device |

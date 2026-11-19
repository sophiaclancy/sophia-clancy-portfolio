# Contexto · Product Requirements (PRD)
**Direction D:** mention → find + Organized views · **Owner:** Sophia Clancy · **Status:** Draft v1 · Nov 18, 2026
**Related:** CONTEXTO-DECISIONS.md (evidence + decisions, cited as D-xxx) · CONTEXTO-BLUEPRINT.md (system, psychology, onboarding detail) · CONTEXTO-INTERACTIONS.md

---

## 1. Summary
Contexto is a macOS menu bar app that understands what your files *are* (class, term, type, version, source) without moving anything. It gives that understanding back in two ways:
1. **Organized views (day one).** Read-only, auto-built "folders" such as *Classes › ECON 1* and *Latest versions*. Your files look organized immediately, and nothing moves.
2. **Mention → find (every day).** When you mention a file while writing ("my final project from CS 61A") or reach an upload field, Contexto underlines it in place, and one keystroke attaches it.

**Positioning:** *Your files, organized, without moving a single one. And found the moment you mention them.*

---

## 2. Problem
- People remember the **episode** (class, term, who it was for), not the filename or path. Search needs a word; folders need filing that nobody does consistently (E2, Whittaker 2011).
- Files belong in **many categories at once** (a lecture is ECON 1, Fall 2023, *and* midterm prep), but folders allow one home, and links break on rename (E2).
- **Near-duplicate versions** cause wrong-file mistakes (résumés, essays).
- Existing fixes either **move your files** (AvianSort, E3), **make you write rules** (Hazel), or **wait for you to search** (Spotlight). None helps at the moment of need.

## 3. Target users
| Segment | Description | Priority |
|---|---|---|
| **Primary** | College students on Mac: many classes and terms, files from LMS/email/Downloads, rarely use folders | P0 |
| Secondary | Early-career job seekers: many résumé/portfolio versions, frequent uploads | P1 |
| Later | Knowledge workers with project-heavy files | P2 |

**Jobs to be done:**
- *When I need something from a past class, I want to find it by describing it, so I don't lose 20 minutes digging.*
- *When I attach or upload, I want the right, newest version, so I don't send the wrong one.*
- *When I open my Mac, I want to feel my files are under control, without spending a weekend organizing.*

## 4. Goals & non-goals
**Goals (v1)**
- G1: Make a user's files feel organized within **5 minutes of install**, with zero files moved.
- G2: Let users retrieve a file **by mentioning it**, in ≤ 3 s, inside Mail, Notes, Pages, and Safari upload fields.
- G3: Keep users' trust: no false-confident suggestions, nothing moved, everything on-device.

**Non-goals (v1)**
- Moving, renaming, deleting, or deduplicating files (D-002).
- A browsable force-directed graph of all files (D-001).
- Cloud sync, sharing, team features, Windows/Linux.
- Generating or rewriting document content.
- Full support for canvas-based web editors (e.g., Google Docs). Badge-only at most.

## 5. Success metrics
| Metric | Target (beta, 30 days) | Why |
|---|---|---|
| **Activation:** first Organized view opened + first accepted suggestion within 48 h | ≥ 60% | Both value moments reached |
| **Precision:** accepted ÷ shown underlines | ≥ 70% | Trust (P3) |
| "Not this" rate | ≤ 10% | False alarms |
| Median time, underline → attached | ≤ 3 s | Frictionless |
| Organized-view accuracy (user-confirmed course/term) | ≥ 85% of files correct | Views are only useful if right |
| Week-4 retention (≥ 1 accept or view per week) | ≥ 40% | Habit |
| Creepiness rating (1–5, lower better) | ≤ 2 | Privacy design works |

**Guardrails:** 0 files ever moved or modified. Index CPU < 10% average after initial indexing. Suggestion latency < 150 ms (D-011).

---

## 6. Scope

### MVP (private beta, ~14 weeks)
| # | Feature | Priority |
|---|---|---|
| F1 | Indexer + context graph (on-device) | P0 |
| F2 | Automatic tags: Course, Term, Type, Version state, Source | P0 |
| F3 | **Organized views** in a Contexto window: Classes, Terms, Latest versions | P0 |
| F4 | **Mention → find** in Notes, Mail, TextEdit, Pages (underline, badge, card, Tab) | P0 |
| F5 | Missing-attachment detection in Mail | P1 |
| F6 | Safari extension: upload-field suggestions | P1 |
| F7 | Onboarding (O1–O8) with the "organized, nothing moved" reveal | P0 |
| F8 | Settings, Pause, Library ("what Contexto knows"), Erase all | P0 |
| F9 | Related (one hop, from a file) | P2 |
| F10 | Core Spotlight donations (facets searchable in Spotlight) | P1 |
| **F11** | **Instant forgiving name search** (global shortcut panel + search in views): finds files from *any part* of the name, typos, and tags | **P0** |

### Later
- Finder sidebar integration for views (needs a Finder extension/File Provider spike)
- People/Organization/Project facets
- Calendar-based prepare (opt-in)
- Messages and Slack
- Finder tag mirroring

---

## 7. Requirements & user stories

### F1 · Indexer + graph (P0)
- **Story:** As a user, I choose which folders Contexto may read, and it learns them in the background.
- **Acceptance:**
  - Indexes only user-selected folders (security-scoped bookmarks); default suggestions: Documents, Desktop, Downloads, iCloud Drive.
  - File identity = bookmark + file resource ID. Rename or move keeps all tags and edges (D-003).
  - Extracts text from PDF/Pages/Keynote/Docs/TXT; OCR for images and scanned PDFs (D-006).
  - Initial index of 20k files completes in < 15 min on Apple Silicon; incremental updates < 5 s after a change.
  - Never writes to user files (D-002).

### F2 · Automatic tags (P0)
- **Story:** As a user, my files are labeled by class, term, type, and version without me doing anything.
- **Acceptance:**
  - **Course:** inferred from download origin (LMS URLs), filename codes, folder names (D-009), and first-page text. Needs ≥ 2 agreeing signals to show.
  - **Term:** mapped from dates onto a personal term timeline, confirmed once in onboarding.
  - **Version state:** current / older / duplicate / tailored, via lineage (text similarity ≥ 0.9 + filename stem + dates).
  - Every tag has a confidence; tags below threshold are hidden, not shown as guesses.
  - One-tap correction from any card or view row; propagates to lineage siblings, with Undo.
  - Edges only from observed signals (D-004).

### F3 · Organized views (P0) · *new in direction D*
- **Story:** As a user, right after setup I see my files organized by class and term, and I can trust that nothing moved.
- **Acceptance:**
  - A Contexto window with a sidebar: **Classes** (one row per course, with counts), **Terms** (newest first), **Latest versions** (newest of each lineage).
  - Each view lists files from any location; a **"Where it really is"** column shows the real folder.
  - Persistent banner: **"View only. Nothing was moved."**
  - A file can appear in multiple views (one file, many homes; D-005).
  - "Latest versions" hides older versions with a visible count and a **Show older** toggle.
  - Selecting a row shows "Also appears in: [chips]" + **Show in Finder** (reveals the real file).
  - Double-click opens the file in its default app.
  - **Folders / Organized** toggle so users who like their tree can compare (D-009).
  - Views open < 300 ms at 50k files (D-011).
  - Views are read-only in v1: dragging files *out* works (copies the reference); dropping *in* is disabled.

### F4 · Mention → find (P0)
- **Story:** As a user writing in Notes or Mail, when I mention a file, it's underlined, and I can insert or attach it without leaving the sentence.
- **Acceptance:**
  - Detection runs after a pause (~400 ms) or punctuation; never mid-word.
  - Underline only when one match is confident (top p ≥ 0.75 and margin ≥ 0.15). Otherwise nothing.
  - Corner badge shows the count of open references; ✓ when resolved.
  - Card opens on hover (300 ms), click, or **Tab**. It never opens by itself.
  - Card shows:
    - a header with why it appeared
    - the file and one context line
    - ≤ 3 source chips
    - one primary action (Attach / Insert Link)
    - Open, Other matches (≤ 3), and Not this
  - **Tab** accepts. Esc closes. "Not this" removes the underline and never re-suggests it in that document.
  - Never reads secure fields or excluded apps (password managers, banking, Terminal).
  - Reads only text near the caret; nothing persisted beyond the detected reference.

### F5 · Missing attachment (P1)
- Mail: "attached / attaching / see attached" + no attachment + a resolvable reference → underline with **Attach**. Attaching uses Mail's own mechanism.

### F6 · Upload-field suggestions (P1)
- Safari extension finds `<input type=file>`, reads the label/accept text, and shows one inline suggestion (≥ 0.80) under the field; **Attach** fills it via `DataTransfer`.
- If two match, it shows both with none preselected.
- Picking an older version shows a one-line warning with **Use newest**.

### F7 · Onboarding (P0)
- Follows Blueprint §5 (O1–O8), with one change for direction D: **O3 ends with the reveal**. "Your files, organized. Nothing moved." Stats (classes, terms, résumés, projects) → **See Organized** opens the Classes view.
- Order: Pick folders → index with live discoveries → reveal Organized views → confirm start term → try mention-to-find once (sandbox) → grant Accessibility → optional extras → done.
- **Acceptance:** median time to the reveal ≤ 3 min; Accessibility is requested only after the sandbox success.

### F8 · Settings, Pause, Library, Erase (P0)
- Menu bar: Search · Recent finds · Pause (1 h / until tomorrow / this app) · Library · Settings.
- Library shows classes, terms, counts, and per-file tags (editable).
- Erase all wipes the index in one action.

### F11 · Instant forgiving name search (P0) · *added Nov 18 (E7, D-024)*
- **Story:** As a user, I type any part of a name ("fall26", "sume", "lectre 7") and the file shows up instantly, unlike Finder.
- **Acceptance:**
  - Global shortcut (default ⌥Space, changeable) opens a floating search panel over any app, full-screen included. The same engine powers the search field in Organized views.
  - **Matches:**
    - substrings anywhere in the name
    - word starts after `_ - . space`, camelCase, and letter↔digit boundaries
    - fuzzy subsequences ("rspmf" → Resume_PM_Fall26)
    - one or two typos ("resme")
    - accents ignored (resume = résumé)
    - aliases (CV ↔ résumé, "ps4" ↔ problem set 4, "econ1" ↔ ECON 1)
    - display titles and tags ("econ fall 2023 slides")
  - **Results update on every keystroke in < 30 ms** at 50k files.
  - **Ranking:** exact > starts-with > word-start > substring > fuzzy, then boosted by recency, version head, and the current context.
  - Each row shows the real location; ↩ opens, ⌘↩ reveals in Finder, ⌘C copies the file, and dragging out works.
  - Never blocks on indexing: name search works from metadata alone within minutes of install.

### F9 · Related (P2)
- From any file (view row or card): a one-hop list or panel of connected files and applications, each labeled with the relationship. Never the full graph (D-001, D-010).

### F10 · Spotlight (P1)
- Donate items with course, term, and type keywords so "econ 1 slides fall 2023" works in system Spotlight (D-006).

---

## 8. UX principles (from the decision log and blueprint)
1. **Graph is the model, not the map** (D-001).
2. **Never move files** (D-002).
3. **Quiet unless sure:** confidence gates loudness.
4. **One primary button** per surface.
5. **Show the why** with source chips.
6. **Respect existing trees** (D-009).
7. **Teach once, then fade.**

---

## 9. Technical approach (summary; detail in Blueprint §1, §8)
- **App and distribution:** Swift/SwiftUI menu bar app, distributed outside the App Store (Developer ID + notarization). Accessibility features don't work inside the App Store sandbox.
- **Storage:** SQLite (FTS5 + sqlite-vec) for files, tags, entities, edges, and terms.
- **On-device models:** Apple Foundation Models for type classification and phrase extraction; NLContextualEmbedding for embeddings; Vision for OCR.
- **Underline overlay:** AXObserver + bounds-for-range, drawn on a transparent click-through panel.
- **Web:** Safari Web Extension with native messaging.
- **Spotlight:** Core Spotlight donations.

## 10. Dependencies & risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Accessibility text/bounds inconsistent across apps | High | High | Start with Apple apps (Phase 0 spike, X5); badge-only fallback |
| Course/term inference wrong on messy files | Medium | High | ≥ 2-signal rule; confirm term timeline in onboarding; one-tap fix (X3) |
| Users expect real folders to change after seeing views | Medium | Medium | Persistent "nothing moved" banner + Show in Finder (X1) |
| Performance at 50k+ files | Medium | Medium | Incremental indexing, query budgets (X4) |
| Permission anxiety (Accessibility, Full Disk) | High | High | Value before permission; folder-scoped access; on-device messaging |
| Competitor ships on Mac (AvianSort) | Medium | Low–Med | Differentiate on "nothing moves" + mention → find |

## 11. Experiments before and during the build (from CONTEXTO-DECISIONS.md §5)
- **X1:** Organized views vs. auto-sort preference, and trust in "nothing moved."
- **X2:** Underline discoverability.
- **X3:** Anchor-resolution accuracy on real files.
- **X4:** Performance at 50k files.
- **X5:** Accessibility underline feasibility.

## 12. Milestones
| Phase | Weeks | Exit criteria |
|---|---|---|
| 0 · Spike | 1–2 | Underline drawn at the right place in Notes + TextEdit (X5) |
| 1 · Index + tags + views | 3–6 | F1–F3 on your own files; ≥ 85% course/term correct (X3) |
| 2 · Mention → find | 7–9 | F4 at ≥ 70% precision on a labeled phrase set |
| 3 · Mail + Safari | 10–11 | F5, F6 |
| 4 · Onboarding + settings | 12–13 | F7, F8, F10 |
| 5 · Beta test | 14 | 6–8 students; metrics in §5 |

## 13. Open questions
1. Do Organized views live in their own Contexto window (v1) or inside Finder's sidebar (needs a Finder extension feasibility check)?
2. Should "Terms" use academic terms only, or also calendar months for non-students?
3. How should views handle files in folders the user didn't grant (show "1 file not indexed" or nothing)?
4. Free vs. paid: is the free tier views only, with mention → find paid?
5. Naming: "Organized views" vs. "Smart views" vs. "Collections" (test in X1).

## 14. Changelog
- **Nov 18, 2026:** Added F11 instant forgiving name search (P0) from Sophia's Finder pain point.
- **Nov 18, 2026:** Draft v1 for direction D. Adds F3 Organized views and the onboarding reveal; MVP scope defined.

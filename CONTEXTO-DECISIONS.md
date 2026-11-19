# Contexto · Decision Log & Evidence
*Living document. Started Nov 18, 2026. Every direction change gets an entry here, with the evidence that drove it. Don't delete evidence. Mark entries superseded instead.*

---

## 1. Current direction (one paragraph)

**The graph is the model, not the map.** Contexto keeps a private, on-device graph of what each file *is* (course, term, type, version, source, people) and how it's been used (sent to, opened together, mentioned in). It **never moves or renames files** and **never asks you to file.** The graph shows up in three ways, from most to least used:
1. **Mention → find.** An ambient underline where you write or upload (v4).
2. **Organized views.** Virtual, read-only "folders" (by class, term, latest versions) that give the satisfying *organized* feeling without touching the real tree. *(Proposed, D-007.)*
3. **Related.** A one-hop panel from any file, never a full force-directed map.

---

## 2. Evidence (verbatim where possible)

### E1 · Quora: "Is a simple force-directed graph a better way to organize files than the normal tree structure?"
- **David Vanderschel (PhD, Math & Physics):** *"No. The two types of graphs serve different purposes. A force-directed graph provides a way to discover relationships among elements… based on observed links between them."* · *"Apparent links between pairs of files of the same type don't normally exist until we impose them. We impose them by explicitly organizing them in a hierarchical structure… The hierarchical directory tree structure expresses the user's understanding of the logical relationships. That is what most users (including myself) want."* · *"If you tossed all files… into a bucket with no structure, I am at a bit of a loss to think of how I would discover links between them."*
- **Bill Bell (former software developer):** *"…for such a large number of nodes I suspect that it would be very slow. Many activities involving identifying files in the usual hierarchical structure are already agony."*
- **Takeaways:**
  - A force-directed graph is a *discovery* tool, not a *filing* tool.
  - Links must come from **real observed signals**, or the graph is meaningless.
  - Many people *like* their tree.
  - A big graph is slow and visually overwhelming.

### E2 · Reddit: "Storing files locally in a graph"
- **OP's real need:** *"certain files that would fit well in multiple categories, and I don't know where to put them / find them back later… I would love to just navigate through my files and be able to find stuff regardless of which of the multiple categories I chose to put it in."*
- **On symlinks:** *"a symbolic link does not update if I move a directory or change the name."*
- **fnord123:**
  - *"What you're describing has been attempted a few times. WinFS for example."*
  - *"most of the functionality is now handled by Full Text Search… so you can search for the actual data you want instead of spending your time managing a taxonomy. This works well for documents and spreadsheets but not well for images, video, CSV or DB files."*
  - *"Spotlight on Mac has a concept of search providers and you can make a provider to manage the tags you care about."*
  - *"accept that filesystems don't work that way at the moment and focus on your real goals."*
  - Also: *"it sounds like you might be trying to solve a problem and think this is something you could use to solve that. What's the fundamental thing you need to get done?"*
- **0x14f:** built a homemade graph (nodes + edges in SQLite, blobs in a content-addressed store, inspired by **Perkeep/Camlistore**). The interface was **search → select node → follow edges**. Console only. *"not meant to be used by somebody else than me."*
- **DidgetMaster (Didgets):** *"each file has a unique number that never changes. Meta-data tags can be attached… there is no requirement that a file has to be in a folder or a file could be in many different folders."*
- **Also mentioned:** MyReach, a cloud-based graph file app.
- **Takeaways:**
  - The real need is **one file, many homes**, without managing a taxonomy.
  - File identity must **survive rename and move.**
  - **Full-text search is the incumbent.** Win where it fails: non-text files, and "which one / from when."
  - Replacing the filesystem (WinFS) failed. **Layer on top.**
  - Even graph builders navigate by **search → one hop**, not by a big map.

### E3 · AvianSort (aviansort.com), checked Nov 18, 2026
- **What it is:** a desktop app. Pick a folder → it analyzes files ("understands file types, names and context") → proposes a category structure → **Apply Changes** moves the files. *"Nothing changes until you say so."*
- **Availability:** Windows available; macOS and Linux download links lead to "not available" pages.
- **Planned:** **Smart Folders (coming soon)** will watch folders and sort new files in real time with custom rules.
- **Price and privacy:** free download; the page doesn't say whether processing is local or cloud.
- **Taglines:** *"Your files, organized."* · *"Three steps to a clean computer."* · *"Set it once. Stay clean forever."*
- **Takeaways:**
  - Visible tidiness is **aspirational and easy to sell.** It's a concrete "before/after."
  - Review-before-apply is now table stakes.
  - AvianSort still **moves files into one category each.** That recreates the tree, keeps the one-file-one-place problem, and is the same move that v1 testers distrusted ("I want to check before files get moved").
  - Mac is open territory today.

### E5 · "Why it's time to abandon folders for graph-based architecture" (Mirko Peters, M365.FM blog, Aug 26, 2026)
- Vendor blog (Microsoft 365 ecosystem). Claims: *"you move from searching for information to receiving it when you need it most"*; graphs surface documents for meetings from interaction signals; reduce cognitive load (no paths).
- Caution: marketing tone, and several statistics are uncited. Use it for **framing only** (industry direction), not as evidence of effect sizes.

### E6 · Bao To's repos (read Nov 18, 2026; studied, not copied)
- **NotetakingLM:** React + Express; `/api/chat` pastes note + sources into an OpenAI prompt (gpt-4o-mini / 3.5). The "RAG" is context stuffing; no vector or graph DB. *The case study says Gemini; the repo calls OpenAI.*
- **globalnotetaker:** Electron + Vite + React + TS; global shortcut; always-on-top panel over full-screen apps; main/preload/renderer split; Google OAuth/Docs sync; auto-updater; setup and security docs.
- **Figma-Context-MCP:** TS MCP server (enhanced fork of figma-developer-mcp); services/transformers; **simplifies API data to save AI tokens**; ~11 tools; stdio + HTTP/SSE; integration + benchmark tests; changesets release; `codebase.md`.
- **Takeaways:** ship the simplest version that shows the experience; simplify data before AI; expose capabilities as MCP tools; split system access from UI; benchmark tests; repo docs for AI-assisted development.

### E7 · Sophia's Finder search pain (Nov 18, 2026)
- *"The search bar in Finder: I literally will type part of the name and nothing will show up, which I hate."*
- Likely causes (macOS behavior, to verify in X6):
  - Spotlight matches the **beginnings of words**, not text in the middle ("sume" won't find "Resume").
  - Names joined with `_` or digits may be indexed as one word ("Fall" may miss `Resume_PM_Fall26`).
  - No typo tolerance.
  - Finder defaults to searching "This Mac" and file contents, not names.
  - Non-downloaded iCloud files, excluded folders, or a stale index.

### E4 · Our own evidence (earlier rounds)
- **v1 testing (6–9 students):**
  - Loved automatic surfacing and the widget.
  - Manual tagging = "dealbreaker."
  - "If it's just buried in Finder, I might not remember to check it."
  - "I like cleanup but want to check before files get moved."
- **v2.0 Constellation feedback:** "a little hard to follow."
- **v2.1:** "looks AI."
- **v2.2:** "flow makes no sense; the older one was easier."
- **v3:** "too much for recruiting; more sleek and automatic than a sidebar, like Grammarly; completely frictionless."
- **v4:** "yes good!"
- **Sophia (founder):** can't find files or old résumés; doesn't use folders; they feel outdated next to Photos.

---

## 3. Decisions

| ID | Decision | Evidence | Status |
|---|---|---|---|
| **D-001** | **The graph is the data model, not the primary UI.** No force-directed map as a way to navigate files. | E1 (purpose mismatch, slow at scale), E2 (graph builders still use search → one hop), E4 (v2.0 "hard to follow") | ✅ Decided |
| **D-002** | **Never move, rename, or delete files.** Contexto is a metadata layer on top of the normal filesystem. | E2 (WinFS failed by replacing the FS), E3 (differentiates from AvianSort), E4 (v1 "check before moving") | ✅ Decided |
| **D-003** | **File identity = macOS bookmark + file resource ID, never the path.** Links survive rename and move. | E2 (symlinks break on rename; Didgets' stable IDs) | ✅ Decided |
| **D-004** | **Edges only from observed signals:** download origin, course/term evidence, version lineage, sent-to, opened-together, mentioned-in. No "similar content" edges shown to users. | E1 ("links don't exist until we impose them"; meaningless clusters) | ✅ Decided |
| **D-005** | **One file, many homes, via facets.** A file can be in ECON 1, Fall 2023, *and* Slides, with no copies or links. | E2 (OP's core need) | ✅ Decided |
| **D-006** | **Compete where full-text search fails:** "which version", "from when / which class", and non-text files (scanned PDFs via OCR, images, zips, slides). Use Spotlight, don't fight it: donate Contexto facets to Core Spotlight. | E2 (FTS is the incumbent; Spotlight search providers) | ✅ Decided |
| **D-007** | **Add "Organized views": virtual folders** generated from the graph (e.g., *Classes › ECON 1 › Fall 2023*, *Latest versions only*, *Résumés*). Read-only views; nothing moves. Deliver AvianSort's "Your files, organized" payoff without its cost. | E3 (tidiness sells), E2 (one file, many homes), E1 (people like trees), E4 (v1 Smart Groups were liked) | ✅ Chosen (Nov 18) · validate in X1 |
| **D-008** | **Mention → find (ambient underline) stays the core interaction.** | E4 (v4 approval), E2 (search beats taxonomy management), blueprint P1–P5 | ✅ Decided, validate in X2 |
| **D-009** | **Respect people who use folders.** Their folder names become signals ("econ" folder → ECON 1). Contexto adds to their tree; it never competes with it. | E1 ("hierarchy expresses the user's understanding… what most users want") | ✅ Decided |
| **D-010** | **Related = one hop, from a file.** Never the whole graph. | E1, E2 (0x14f's follow-an-edge navigation), Cowan 2001 | ✅ Decided |
| **D-011** | **Performance budget:** suggestion < 150 ms; organized view < 300 ms at 50k files. | E1 (Bell: "very slow… already agony") | ✅ Decided, verify in X4 |
| **D-012** | **Mac first.** | E3 (AvianSort's Mac build isn't available yet), Sophia's own platform | ✅ Decided |
| **D-013** | **Display titles** for generic files ("Untitled 3.pages" shown as "Econ notes · week 3"); real file never renamed unless she chooses | E2 (generic names; one file many homes), D-002 | 🟡 Proposed (see CONTEXTO-ENGINE.md) |
| **D-014** | **Tiered indexing:** skip → metadata (from Spotlight) → first pages → AI only for unclassified; newest first; idle and on power | E1 (Bell: slow/agony), E2 (FTS already exists) | ✅ Decided |
| **D-015** | **Markdown cards** per file in Contexto's own folder as the readable memory (opens in Obsidian / MCP); SQLite stays the index | E2 (homemade graphs: nodes as JSON + SQLite), transparency (P5) | ✅ Decided by Sophia (Nov 18) |
| **D-016** | **Privacy tiers:** on-device (Apple Foundation Models) by default; Claude Haiku 5.5 only as opt-in "Better tagging," first-page excerpts only, never sensitive types | P9, contextual integrity | ✅ Decided by Sophia (Nov 18) |
| **D-017** | **No agent:** single model calls inside a deterministic pipeline | Simplest reliable tier; testable | ✅ Decided |
| **D-018** | **Golden dataset + eval script before engine code;** regressions block merges | "Make every part work" | ✅ Decided |
| **D-019** | **Contexto as an MCP server** (search, card, related, versions, view, excerpt, calendar, prepare_upload) | E6 (Bao Figma-MCP), "I want an agent… as an option" | 🟡 Proposed |
| **D-020** | **Agent mode (opt-in)** via Claude API tool use; local, read-only tools; prepare_upload needs a user click | Sophia wants an agent; P6/P9 | 🟡 Proposed |
| **D-021** | **Swift native app; Python engine prototype first;** MCP in TS or Swift | E6 (Electron needs native add-ons for AX/Foundation Models) | ✅ Decided by Sophia (Nov 18): Swift app + Python prototype first; Claude writes the Swift |
| **D-022** | **Retrieve → rank → calibrate → learn** (learning to rank; hand-weighted v1, learned v2) | Industry pattern (Drive Quick Access, Microsoft Graph, Siri Suggestions) | ✅ Decided |
| **D-023** | **Résumé lineages:** role lines, pick the head of the matching line, penalize tailored copies unless the company matches | Sophia's #1 pain point | ✅ Decided |
| **D-024** | **Instant forgiving name search:** substring + fuzzy + typo-tolerant matching on names, display titles, and tags, with smart word-splitting (`Resume_PM_Fall26` → resume, pm, fall, 26) and a global shortcut panel. MVP P0 | E7 (Sophia: "I type part of the name and nothing shows up") | ✅ Decided |


### Superseded
| ID | Was | Replaced by | Why |
|---|---|---|---|
| S-001 | Constellation as a destination (v2.0/2.1) | D-001, D-010 | E1, E4 |
| S-002 | Invisible-only file picker (v2.2) | D-008 (visible underline) | Illegible (E4) |
| S-003 | Docked sidebar kit (v3) | D-008 | Still a place to open (E4) |
| S-004 | Recruiting-specific framing | General "mention any file" | E4 |

---

## 4. Directions considered (current round)

| Direction | What it is | For | Against | Verdict |
|---|---|---|---|---|
| **A · Graph as UI** | Browse files on a force-directed map | Novel, pretty | E1: wrong tool, slow, meaningless links; v2.0 feedback | ❌ |
| **B · Auto-sorter** (AvianSort model) | AI proposes folders, moves files | Instant visible payoff; easy to sell | Moves files; one category per file; crowded; v1 distrust | ❌ as core. Steal "review before apply" + the before/after payoff |
| **C · Ambient retrieval only** (v4) | Underline when you mention a file | Unique, frictionless, any use case | Value is invisible until a mention happens; no "wow, I'm organized" moment | ✅ core, but not enough alone |
| **D · C + Organized views** | v4 + virtual, auto-built views (Classes, Terms, Latest) + one-hop Related | Day-one visible payoff *and* daily frictionless retrieval; nothing moves; respects trees | More to build; must keep views read-only and fast | ⭐ **Recommended** |

---

## 5. Experiments to run next

| ID | Question | Method | Pass bar |
|---|---|---|---|
| X1 | Do people want Organized views, and do they trust "nothing moves"? | 5 students: show AvianSort-style before/after vs. Contexto views; preference + trust rating | ≥ 4/5 prefer views or both; trust ≥ 4/5 |
| X2 | Do people notice and use the underline? | Prototype task: "email your prof your CS 61A project"; observe without instructions | ≥ 4/5 discover Tab or click within 10 s |
| X3 | Can anchors be resolved on real files? | Label 50 phrases against Sophia's own files ("econ 1 graphs freshman year") | ≥ 70% top-1 correct; 0 confident wrong |
| X4 | Is it fast at scale? | Synthetic 50k-file index on an M-series Mac | D-011 budgets met |
| X5 | Does the Accessibility API underline work in Notes, Mail, Pages, and Chrome/Docs? | Phase 0 spike | Works in 3 of 4 Apple apps; documented fallback for the web |

---

## 6. Changelog
- **Nov 18, 2026:** D-021 decided (Swift + Python prototype). Added E7 (Finder search pain) → D-024 instant forgiving name search (MVP P0).
- **Nov 18, 2026:** Sophia decided D-015 (keep markdown cards) and D-016 (on-device default + opt-in Claude). D-021 (stack) open: comparing Swift+Python vs. Electron.
- **Nov 18, 2026 (later):** Added E5 (graph-architecture blog, framing only), E6 (Bao repos). D-019 → D-023 in CONTEXTO-SURFACING-TECH.md (industry ranking pattern, agent as option via MCP + Claude tool use, Swift + Python prototype, résumé lineages).
- **Nov 18, 2026 (later):** Engine questions answered in CONTEXTO-ENGINE.md (generic names, tiered indexing, markdown cards, APIs, Bao, testing). Added D-013 → D-018. Adopted the step-by-step build workflow (plan → facets → requirements → architecture → build plan → one step at a time → validate).
- **Nov 18, 2026:** Sophia chose **Direction D**. PRD written (CONTEXTO-PRD.md): MVP = F1–F10; Organized views (F3) + onboarding reveal. D-007 is now ✅ Chosen, pending X1.
- **Nov 18, 2026:**
  - Added E1 (Quora), E2 (Reddit), E3 (AvianSort).
  - Decided D-001 → D-012.
  - Proposed Direction D (core + Organized views).
  - Superseded Constellation-as-destination.

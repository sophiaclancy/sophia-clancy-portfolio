# Contexto · The Engine: how it actually works
*Nov 18, 2026 · Answers: generic names? does it read every file? markdown? which APIs so I don't build the AI myself? how did Bao do it? how do I make every part work?*
*Related: CONTEXTO-PRD.md (what), CONTEXTO-BLUEPRINT.md (why/psychology), CONTEXTO-DECISIONS.md (log). New decisions here are D-013 → D-018.*

---

## 1. Generic and useless filenames ("Untitled.pdf", "download (1).pdf", "IMG_2041.heic")

**Rule: the filename is the weakest signal, never the only one.** Contexto ranks evidence like this (strongest first):

| # | Signal | Example | Where it comes from |
|---|---|---|---|
| 1 | **Where it was downloaded from** | `bcourses.berkeley.edu/courses/1520/files/…` → ECON 1 | `kMDItemWhereFroms` (macOS stores this on every download) |
| 2 | **What's inside** | First page says "Economics 1 · Problem Set 4 · Fall 2023" | PDF/Pages/Word text; OCR for scans and photos |
| 3 | **When** | Created Oct 20, 2023 → Fall 2023 | File dates mapped onto the term timeline |
| 4 | **What it was used with** | Opened 30 s after ECON1_Lecture07 on 3 different days | Co-access log (Contexto records open events from install onward) |
| 5 | **Who it came from** | Saved from an email by "econ1-gsi@…" | Mail attachment origin |
| 6 | **Embedded metadata** | PDF Title/Author fields | File metadata |
| 7 | **Folder and neighbors** | Sits next to 6 files tagged ECON 1 | Location (D-009) |
| 8 | **Filename** | "ECON1_…" | Only when it's informative |

**What she sees for a generic file:**
- **D-013 · Display titles.** In Contexto views and cards, `Untitled 3.pages` shows as **"Econ notes · week 3"**. The title is generated from the content, labeled with a small "named by Contexto" hint, and **the real file is never renamed** (D-002). One click → "Rename the real file too?" (her choice, never automatic).
- **If there isn't enough evidence → no tag.** It goes to **"Not sure yet (14)"**, a quiet view where one tap ("ECON 1?" ✓ / ✗) teaches the system. Never a confident wrong guess (P3).
- **Images** (whiteboard photos, screenshots): OCR via Apple Vision. A screenshot with "Elasticity of demand" becomes findable. A photo with no text stays untagged unless its download origin or date says otherwise.

---

## 2. Does it read every file? No. It reads in tiers.

Reading everything would be slow, hot, and pointless (Bill Bell's "already agony," E1). **D-014 · Tiered indexing:**

| Tier | What | Which files | Cost |
|---|---|---|---|
| **0 · Skip** | Never indexed | `Library/`, caches, app bundles, `node_modules`, `.git` internals, VM/disk images, system files, anything in folders she didn't grant | 0 |
| **1 · Metadata** | Name, type, dates, size, download origin, location | **Every** file in granted folders (from Spotlight's existing index; no re-reading) | Seconds |
| **2 · Text** | First ~2 pages / ~2,000 characters + embedded metadata | Document-like files: PDF, Pages, Keynote, Word, PowerPoint, text/markdown, images with text (OCR) | Minutes, in the background |
| **3 · Understand** | AI classification: type, course, display title | **Only files rules couldn't classify** (typically the generic-name ones) | See §4 |

- **Code repos** (a folder with `.git`) become **one node** ("CS 61B Project 2 repo"), not 4,000 files.
- **Big media** (videos, raw photos): metadata only.
- **Order:** newest first, so the files she's most likely to need are ready within minutes. The backlog runs only when the Mac is idle and on power.
- **Incremental:** FSEvents watches for changes; a content hash skips anything unchanged. A changed file is re-read in under 5 s.

**Rough numbers for a typical student Mac** (estimate; measure in X4): about 30k files in granted folders → about 3–5k document-like → about 500–1,500 need Tier 3. **Spotlight already has the full-text index**, so Contexto doesn't build a second copy of every document. It stores only the first-pages excerpt, embeddings, tags, and the graph.

---

## 3. "Is there some markdown we can go through?" Yes, in two useful ways

### 3a · Convert documents → markdown for the AI
Models read clean text best. Convert each document's first pages to markdown before classifying:
- **In Swift (production):** PDFKit (PDF text), Vision (OCR), `NSAttributedString` (Word/RTF), the iWork export formats.
- **For a fast Python prototype:** Microsoft **MarkItDown** (PDF/Word/PowerPoint/Excel/images → markdown) or IBM **Docling**. Great for testing tagging quality on your own files in a weekend.

### 3b · D-015 · Contexto's memory is a folder of markdown "cards"
For every file, Contexto writes a small markdown card **in its own folder** (`~/Library/Application Support/Contexto/cards/`). Your files are never touched (D-002).

```markdown
---
file_id: 8C2F…            # bookmark + file resource ID (D-003)
real_path: ~/Downloads/Untitled 3.pages
display_title: Econ notes · week 3
course: ECON 1
term: Fall 2023
type: notes
version: current
source: created in Pages
confidence: {course: 0.92, term: 0.99, type: 0.88}
---
Related: [[ECON1_Lecture07_Supply_Demand]] (opened together 3×) · [[ECON 1]] · [[Fall 2023]]

> Excerpt: "Week 3 — elasticity, price ceilings…"
```

**Why this is a great call:**
- **Human-readable and inspectable:** the "What Contexto knows" view is literally these cards. Trust through transparency.
- **Free tools work on it immediately:**
  - **Obsidian** can open the cards folder as a vault. Graph view, Dataview tables ("all ECON 1, Fall 2023"), and search come free, as a debugging and prototyping UI.
  - **Claude Desktop / any MCP client** can read it with a filesystem MCP server, so you can *ask* questions about your files before building any chat UI.
- **Easy to diff and test:** a golden test is just "expected card vs. actual card."
- The SQLite database stays the fast index. Cards are the human-readable mirror, regenerated from it.

---

## 4. "Any API integrations so I don't have to build the agent myself?"

**First: you don't need an *agent*.** Tagging and mention-detection are **single model calls** (classify this text; extract the file reference from this sentence). That's the simplest, cheapest, most reliable tier. No loop, no autonomy. You write the pipeline; the model fills in one step.

| Need | Use this (don't build it) | Notes |
|---|---|---|
| Full-text index | **Spotlight** (`NSMetadataQuery`, `mdfind`) | Already on every Mac |
| On-device AI (private, free) | **Apple Foundation Models** framework (macOS 26) | Classification, titles, phrase extraction. Small context, so feed it the first-pages excerpt. **Default for production** |
| Cloud AI (higher quality) | **Claude API** · `claude-haiku-5-5` for bulk tagging ($0.10 / $0.50 per million tokens), `claude-opus-5-5` for hard cases; the **Batches API** runs bulk jobs asynchronously at 50% off | Sends file excerpts off the Mac, so **opt-in only** with clear disclosure (D-016). Swift has no official Claude SDK: call the HTTP API from Swift, or prototype in Python with the official `anthropic` SDK |
| Embeddings | Apple `NLContextualEmbedding` (on-device) | For "meaning" search |
| OCR | Apple **Vision** | Free, on-device |
| Doc → text | PDFKit (Swift) · **MarkItDown** / **Docling** (Python prototype) | §3a |
| Calendar | **EventKit** | Opt-in |
| Graph browser / debug UI | **Obsidian** on the cards vault | Prototype only |
| "Ask my files" chat | **Claude Desktop + filesystem MCP** on the cards vault | Prototype only; zero UI code |
| Underlines in other apps | **Accessibility API** | Can't be bought; this is the one part you must build |
| Upload fields | **Safari Web Extension** | Must build (small) |
| Siri / Spotlight actions | **App Intents** | "Find my ECON 1 slides" for free surfaces |

**Rough Claude cost for the one-time Tier-3 pass** (estimate, verify against the live pricing page): about 1,500 files × about 1,500 tokens ≈ 2.3M input tokens ≈ **$0.23 on Haiku 5.5**, about half that through Batches, plus small output. That's pennies, so the real constraint is **privacy, not price.**

**D-016 · Privacy tiers:**
- **Default:** on-device only (Apple models).
- **Opt-in "Better tagging":** sends *only first-page excerpts* of unclassified files to Claude. Never full files, never sensitive types (classifier-flagged: tax, medical, IDs), and never when she has turned it off.

---

## 5. How did Bao do it?
From his NotetakingLM case study (*our reading of his public page; he doesn't publish the full stack*):
- He built a web app as product designer **and** full-stack engineer.
- He **integrated an LLM API (Gemini)** rather than training anything.
- He used **RAG**: notes were generated from the student's own uploaded sources so answers stayed grounded.
- He added a **graph view** of relationships between notes, plus "multi-scope" editing (select a word, phrase, or section and ask the AI to change just that).

**What we take from it:**
1. Use an API model plus your own retrieval. Don't build "an AI."
2. Ground every output in the user's own sources, with visible provenance. That's our source chips.
3. The graph is a feature built on a relationship store. He showed it as a view; we use it under the hood (D-001), with one-hop Related.
4. He iterated through **3 rounds of testing** with students. Do the same with X1–X5.

**Where we differ on purpose:**
- **Privacy:** on-device by default.
- **Integration:** a system layer instead of a new app.
- **Disclosure:** we name exactly which signals drove each suggestion.

---

## 6. How do I make sure every part works?
"Perfect" isn't reachable, but **measured and fail-safe** is. Three layers:

### 6a · A golden dataset made from your own Mac (build it first, ~1 evening)
- **200 files**, hand-labeled: course, term, type, version state, and expected display title. Include about 40 generic-name files and about 20 near-duplicate versions.
- **60 mention phrases** with the expected file. Include about 15 with **no** correct answer, to test that it stays silent.
- **20 upload-field labels** → expected file.
- Store as `golden/files.csv`, `golden/mentions.csv`, `golden/uploads.csv`. These *are* experiments X3 and X2.

### 6b · An eval script that runs on every change
`python eval.py` (or a Swift test target) reports per-component scores against pass bars:

| Component | Metric | Pass bar |
|---|---|---|
| Course tag | accuracy on tagged files | ≥ 90% |
| Term tag | accuracy | ≥ 95% |
| Type tag | accuracy | ≥ 85% |
| Version lineage | precision of "current" | ≥ 95% |
| Display titles | judged "useful" (you, yes/no) | ≥ 80% |
| "Not sure yet" honesty | % of truly ambiguous files *not* tagged | ≥ 90% |
| Mention → file | top-1 correct | ≥ 80% |
| **Silence** | no underline when no correct file | ≥ 95% (**most important**) |
| Latency | suggestion p95 | < 150 ms |
| Views | open time at 50k files | < 300 ms |

Any change that lowers a score is a regression, and you don't merge it. (If you use Claude in the pipeline, the `claude-api` skill's `build-eval` / `hillclimb` flows can run this loop for prompt tuning.)

### 6c · Deterministic parts get unit tests
URL → course parser, date → term mapper, lineage grouping, skip rules, card writer, and permission and pause states. Pure functions, fully testable, no AI involved.

### 6d · Fail-safes, so the inevitable errors are cheap
- Never move or rename files (D-002).
- Silent when unsure (confidence gates).
- Every tag is correctable in one tap, and fixes become new golden rows.
- The local suggestion log (outcome only: accepted / not this / ignored) feeds a weekly self-review while you dogfood.

### 6e · Dogfood → test → iterate
1. Two weeks on your own Mac with the log on.
2. Five-student X1/X2 tests.
3. Three rounds, like Bao.

---

## 7. Build process (adopting the step-by-step workflow you shared)
| Workflow step | Our doc | Status |
|---|---|---|
| 1 · Goals + plan → markdown | CONTEXTO-PRODUCT-SPEC.md, CONTEXTO-PRD.md | ✅ |
| 2 · Facets in detail, one file each | BLUEPRINT (system/psych/onboarding), INTERACTIONS, COMPETITIVE, DECISIONS, **ENGINE (this)** | ✅ |
| 3 · Minimum requirements: user stories + technical requirements | PRD §6–7 | ✅ (refine after X3) |
| 4 · Architecture: schema, APIs, stack | BLUEPRINT §1/§8 + this doc §2–4 → **next: CONTEXTO-ARCHITECTURE.md** consolidating schema, card format, module boundaries, privacy tiers | ⏭ next |
| 5 · Step-by-step MVP plan, one feature at a time | **next: CONTEXTO-BUILD-PLAN.md** (each step small, testable, with its eval check) | ⏭ |
| 6–7 · Implement one step at a time, git commit each | New repo `contexto-app/` (separate from the portfolio) | later |
| 8 · Validate each step in a fresh session against the plan | Uses the golden set + eval (§6) | later |

**Ground rule from that workflow, adopted:** nothing gets built that isn't a step in the build plan. New ideas go into DECISIONS.md as *proposed*, not into code.

---

## 8. New decisions (also logged in CONTEXTO-DECISIONS.md)
| ID | Decision | Status |
|---|---|---|
| D-013 | Display titles for generic files (virtual name; real file never renamed unless she chooses) | 🟡 Proposed |
| D-014 | Tiered indexing: skip → metadata → first pages → AI only for unclassified files; newest first; idle and on power | ✅ Decided |
| D-015 | Markdown "cards" in Contexto's own folder as the human-readable memory (Obsidian/MCP-compatible); SQLite stays the index | 🟡 Proposed |
| D-016 | Privacy tiers: on-device by default; Claude (Haiku 5.5) only as opt-in, excerpts only, never sensitive types | 🟡 Proposed, needs Sophia |
| D-017 | No agent: single model calls inside a deterministic pipeline | ✅ Decided |
| D-018 | Golden dataset + eval script before any engine code; regressions block merges | ✅ Decided |

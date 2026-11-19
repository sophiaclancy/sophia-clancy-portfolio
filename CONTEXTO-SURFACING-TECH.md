# Contexto · How to sort & surface (technically), the agent option, and what Bao's code teaches
*Nov 18, 2026 · Builds on CONTEXTO-ENGINE.md. New decisions D-019 → D-023 (also in CONTEXTO-DECISIONS.md).*

---

## 1. How big companies do it (the pattern is the same everywhere)

| Product | What it surfaces | How (publicly described, paraphrased) |
|---|---|---|
| **Google Drive "Quick Access"** | Files you'll open next, on the Drive home | A machine-learned model scores your files using **activity signals**: recency and frequency of opens/edits, who you collaborate with, upcoming meetings, time of day. Google published it at KDD 2017 ("Quick Access: Building a Smart Experience for Google Drive") and reported large reductions in time-to-open. |
| **Microsoft Graph / Office "Recommended"** | Documents relevant to you and your meetings | An **activity graph**: people ↔ documents ↔ meetings ↔ emails, with edges from real interactions (the "graph-based architecture" article you shared, E5). |
| **Apple Siri Suggestions / Spotlight** | Apps, files, contacts at the right moment | **On-device** learning of usage patterns (time, place, routine), privacy-first. |
| **Dropbox Dash** | Universal search across apps | Connectors pull content from many apps into one index; AI search on top. |

**The shared recipe is "retrieve → rank → decide":**

```
1 CANDIDATES      cheap, broad: lexical (BM25) ∪ semantic (embeddings) ∪ graph neighbors   → ~50 files
2 FEATURES        for each candidate: how well does it match THIS moment?                   → numbers
3 RANK            a scoring model combines features → one score per file                     → ordered list
4 CALIBRATE       turn the score into "how sure am I?" → show 1, show 2, or stay silent
5 LEARN           what she accepted / rejected becomes training data for step 3
```

This is called **learning to rank**. Nobody hand-sorts files; they rank candidates for a moment and learn from what people pick. **Contexto does the same thing, on-device, for files.**

---

## 2. Contexto's surfacing engine (concrete)

### 2.1 Moments (what triggers ranking)
| Moment | Query is built from |
|---|---|
| **Upload field** (résumé, transcript) | Field label + `accept` types + page title + job description text (Safari extension) + calendar (deadline) |
| **Mention in text** | The extracted phrase: artifact ("final project") + anchor ("CS 61A", "freshman year") + intent ("attached") |
| **Organized view** | No query; the "view" is a filter on tags (course = ECON 1) sorted by term/date |
| **Spotlight / Ask** | Her typed question |

### 2.2 Candidates (fast, broad, ~50)
- **Lexical:** SQLite FTS5 (BM25) on name + first-pages excerpt + display title + tags.
- **Semantic:** cosine similarity between query embedding and file embedding (`NLContextualEmbedding`, on-device).
- **Graph:** files linked to the resolved anchor (course/term/company), plus lineage siblings.
- Merge with **reciprocal rank fusion** (simple, robust; no tuning).

### 2.3 Features (per candidate)
| Feature | Meaning | Résumé example |
|---|---|---|
| `type_match` | Is it the kind of file asked for? | type = résumé ✓ |
| `anchor_match` | Same course/term/company? | — |
| `role_match` | Cosine(job description, résumé text) | PM posting ↔ PM résumé 0.82 vs. design résumé 0.41 |
| `is_version_head` | Newest in its lineage? | current ✓, "final_v3 (2)" ✗ |
| `tailored_penalty` | Tailored for a *different* company? | "…_Notion" on a Figma posting ↓ |
| `past_success` | Sent to similar roles before? | sent to Linear, Ramp (PM) ↑ |
| `recency` | Days since edit/open, scaled by the anchor's term | — |
| `co_access` | Opened with other files from this moment | — |
| `user_feedback` | Past accepts / "Not this" for this pairing | — |
| `lexical_score`, `semantic_score` | From candidate generation | — |

### 2.4 Rank (start simple, then learn)
- **v1, hand-weighted:** `score = Σ wᵢ·featureᵢ`, weights set by you and tuned on the golden set (CONTEXTO-ENGINE §6). Fully explainable: the top 2–3 weighted features *are* the "Why this?" chips.
- **v2, learned (after dogfooding):** a small logistic regression or gradient-boosted model trained on her own accept/reject log (on-device; a few hundred examples is enough to move weights). Same features, so explanations still work.
- *Don't* start with a neural ranker. It needs data you don't have yet, and it can't explain itself.

### 2.5 Calibrate → decide (the "quiet unless sure" rule)
| Top score probability | Margin to #2 | Surface |
|---|---|---|
| ≥ 0.80 | ≥ 0.15 | One suggestion (preselect / underline) |
| 0.50–0.80, or small margin | — | Two options, none preselected |
| < 0.50 | — | Nothing (still findable via search) |

### 2.6 The résumé problem specifically (your #1 pain point)
1. **Group résumés into lineages** (text similarity + filename stem): "PM line," "Design line," each with a **head** (newest).
2. **Classify each line's role** once (PM / design / SWE / research) from content via Foundation Models, or Claude opt-in.
3. At upload: classify the **posting's role** from the job description → pick the **head of the matching line** → penalize company-tailored copies unless the company matches → check `past_success`.
4. Explain: "Product role · newest PM version · sent to Linear and Ramp."
5. Guard: if she picks a non-head or wrong-role file, show one line + **Use newest**.

---

## 3. The agent (optional, as you said)

**Default Contexto is not an agent** (D-017): fast, predictable, single-step suggestions. **Agent mode is an opt-in layer** for multi-step jobs a suggestion can't do:
- "Get my Figma application ready": find the résumé and portfolio, find the closest cover letter, draft a tailored one, list what's missing.
- "Collect everything from ECON 1 I need for the 100B midterm."
- "Which résumé did I send each company this fall? Make me a table."

### 3.1 How: give an agent *tools* over Contexto's graph
| Tool | Does |
|---|---|
| `search_files(query, filters)` | Runs the ranking engine (§2) and returns top files with reasons |
| `get_card(file_id)` | Returns the file's markdown card (tags, excerpt, links), never the whole file by default |
| `related(file_id)` | One-hop neighbors with relationship labels |
| `versions(file_id)` | The lineage: head, older, tailored copies |
| `list_view(facet, value)` | e.g., all files with course = ECON 1 |
| `read_excerpt(file_id, pages)` | First N pages as markdown, *only* when needed |
| `calendar_upcoming(days)` | Deadlines and interviews (if the user allowed Calendar) |
| `prepare_upload(file_id)` | Stages a file for the current upload field; the user still clicks Attach |

**Safety rails (non-negotiable):**
- Tools are **read-only** except `prepare_upload`, which needs her click.
- No delete, move, rename, or send tools exist.
- Every agent action shows in an activity list with Undo where relevant.

### 3.2 Two ways to ship it (do both, in this order)
1. **D-019 · Contexto as an MCP server first** (Bao's Figma-MCP pattern). Expose the tools above over the Model Context Protocol. **Any agent can then use Contexto with zero agent code from you:** Claude Desktop, Claude Code, Cursor. This is the fastest way to try agent mode, and a strong portfolio story ("works with your AI").
2. **D-020 · In-app agent later**, via the Claude API's tool use (the SDK's tool runner drives the loop). It runs only when the user turns on Agent mode. The tools run **locally on the Mac**, so files stay put; only tool *results* (cards and excerpts) go to the model. A cloud-hosted agent sandbox doesn't fit here, because the files live on the user's Mac, not in a cloud container. Model: `claude-opus-5-5` for the agent; Haiku 5.5 for bulk tagging if the user opts into cloud tagging (D-016).

---

## 4. What Bao's code shows (studied read-only; nothing copied into our project)

| Repo | What it is | Structure | Lesson for us |
|---|---|---|---|
| **NotetakingLM** | React (Create React App) frontend + small Express server | One `/api/chat` endpoint that **pastes the selected note and sources into the system prompt** of an OpenAI model (`gpt-4o-mini` / `gpt-3.5-turbo`). No vector DB, no graph DB in the repo. *Note: the case study names Gemini; this repo calls OpenAI.* | **Ship the simplest thing that demonstrates the experience.** His "RAG" was context stuffing, and the *design* carried the case study. Our v1 ranking can be hand-weighted too. |
| **globalnotetaker** | Electron + Vite + React + TypeScript + Tailwind desktop app | **Global shortcut** (⌘⇧N), an `alwaysOnTop` panel window that floats over full-screen apps, `main` (system access) / `preload` (safe bridge) / renderer (UI) split, IPC handlers, Google OAuth + Docs sync, auto-updater, SETUP/SECURITY/OAUTH docs, `env.example` | The **process split** maps onto Contexto: system access (files, Accessibility) in one layer, UI in another, a narrow bridge between. Also: ship setup docs, security notes, and auto-update from day one. |
| **Figma-Context-MCP** | A TypeScript MCP server (his enhanced fork of `figma-developer-mcp`) | `services/` (logic), `transformers/` (data shaping), `simplify-node-response` (**shrinks verbose API data into token-cheap AI input, deduplicating shared styles**), many `server.tool(...)` tools, stdio + HTTP/SSE transports, Jest integration + **benchmark** tests, tsup build, changesets + GitHub Actions release, a `codebase.md` overview for AI coding tools | (1) **Simplify before you send to AI**: that's our markdown cards. (2) **Be an MCP server** (D-019). (3) **Benchmark tests** for speed (our D-011 budgets). (4) Keep a `codebase.md` so AI coding sessions get context (your pasted workflow). |

### Stack decision this informs (D-021)
- **Mac app in Swift**, not Electron. Accessibility underlines, Apple's on-device models (Foundation Models), Vision OCR, and Spotlight APIs are all native Swift. Electron would need native add-ons for each, and it's heavier for an always-running menu bar app.
- **Engine prototype in Python first** (MarkItDown, the official `anthropic` SDK if testing Claude, quick evals on the golden set). Then port the proven logic to Swift.
- **MCP server:** TypeScript (Bao's proven pattern) reading Contexto's SQLite/cards, or Swift if a mature Swift MCP SDK fits. Decide at Phase 4.
- **Borrow Bao's repo hygiene:** `codebase.md`, `SETUP.md`, `SECURITY.md`, `env.example`, tests + benchmarks, automated releases.

---

## 5. New decisions
| ID | Decision | Status |
|---|---|---|
| D-019 | Ship **Contexto as an MCP server** (search, card, related, versions, view, excerpt, calendar, prepare_upload) so existing agents can use it | 🟡 Proposed |
| D-020 | **In-app Agent mode** (opt-in) via Claude API tool use; tools run locally and read-only (except `prepare_upload` with a user click) | 🟡 Proposed |
| D-021 | **Swift native app; Python engine prototype first;** MCP server in TS or Swift (decide in Phase 4) | 🟡 Proposed, needs Sophia |
| D-022 | **Retrieve → rank → calibrate → learn** (learning to rank): hand-weighted v1, on-device learned v2 from accept/reject | ✅ Decided |
| D-023 | **Résumé lineages:** group into role lines, pick the head of the matching line, penalize tailored copies unless the company matches | ✅ Decided |

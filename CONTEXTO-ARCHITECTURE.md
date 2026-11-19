# Contexto · Architecture
*v1 · Nov 18, 2026 · Workflow step 4 (schema, interfaces, stack). Decisions referenced as D-xxx (CONTEXTO-DECISIONS.md).*
*Stack (D-021): Swift macOS app + Python lab for prototyping and evals; MCP server later (TS or Swift).*

---

## 1. Pieces

```
┌──────────────────────────── Contexto.app (Swift, menu bar, Developer ID) ─────────────────────────────┐
│  UI (SwiftUI)                 ContextoCore (Swift package: all logic, no UI, fully testable)           │
│  ─ Menu bar + Settings        ─ Index      FSEvents · Spotlight metadata · skip rules (D-014)          │
│  ─ Search panel (F11)         ─ Extract    PDFKit · Vision OCR · doc text → markdown                   │
│  ─ Organized views (F3)       ─ Tag        rules + AIProvider (Foundation Models | Claude opt-in)       │
│  ─ Onboarding (F7)            ─ Lineage    versions: head / older / duplicate / tailored               │
│  ─ Card popover (F4)          ─ Graph      entities + typed edges                                      │
│                               ─ Search     NameSearch (F11) · ContentSearch                            │
│  Overlay (AX, F4)             ─ Rank       candidates → features → score → calibrate (D-022)           │
│  ─ AXObserver per app         ─ Surface    levels, thresholds, rate limits                             │
│  ─ click-through NSPanel      ─ Cards      markdown mirror (D-015)                                     │
│                               ─ Store      SQLite (GRDB) + FTS5 + sqlite-vec                           │
└─────────────┬─────────────────────────────────────────────────────────────────────┬────────────────────┘
              │ native messaging                                                    │ reads DB/cards
     Safari Web Extension (F6)                                              MCP server (D-019, later)
              ▲                                                                     ▲
     upload fields on web pages                                      Claude Desktop / Code / Cursor

lab/ (Python, not shipped): same algorithms, fast to iterate · golden set · eval.py (D-018)
```

**Rule:** everything that thinks lives in **ContextoCore**. The UI, the overlay, the Safari extension, and the MCP server only call it. That makes each part testable in isolation, the same split as Bao's main/renderer and services/transformers.

---

## 2. Repo layout (new repo, separate from the portfolio)

```
contexto/
├─ docs/                 PRD, BLUEPRINT, ENGINE, SURFACING-TECH, ARCHITECTURE, BUILD-PLAN, DECISIONS (copied from portfolio)
├─ codebase.md           one-page map for AI coding sessions (Bao's pattern)
├─ lab/                  Python 3.12 prototype
│  ├─ contexto_lab/      ingest.py · extract.py · tag.py · lineage.py · namesearch.py · rank.py · cards.py
│  ├─ golden/            files.csv · mentions.csv · uploads.csv · searches.csv   (private, from your Mac; gitignored)
│  ├─ eval.py            prints per-component scores vs. pass bars
│  └─ tests/             pytest
├─ app/
│  ├─ Contexto.xcodeproj
│  ├─ Contexto/          app target: SwiftUI, menu bar, panels, onboarding
│  ├─ ContextoCore/      Swift package (logic) + Tests/ (XCTest unit + benchmark)
│  ├─ ContextoOverlay/   AX observer + underline panel
│  └─ SafariExtension/   web extension + native handler
├─ mcp/                  later (D-019)
├─ SETUP.md · SECURITY.md · PRIVACY.md · env.example
└─ .github/workflows/    tests on every push
```

---

## 3. Data model (SQLite)

```sql
-- identity survives rename/move (D-003)
files(id INTEGER PK, file_res_id TEXT UNIQUE, bookmark BLOB, path TEXT, name TEXT, ext TEXT, uti TEXT,
      size INT, created REAL, modified REAL, last_used REAL, where_from TEXT, sha1 TEXT, simhash INT,
      tier INT,                 -- 1 metadata, 2 text, 3 understood (D-014)
      display_title TEXT,       -- D-013, virtual
      excerpt TEXT,             -- first ~2,000 chars as markdown
      sensitive INT DEFAULT 0, indexed_at REAL)

name_tokens(file_id INT, token TEXT, pos INT)            -- split names for word-start matching (F11)
names_tri USING fts5(name, display_title, tokenize='trigram')        -- substring matching (F11)
files_fts USING fts5(name, display_title, excerpt, tags, tokenize='unicode61 remove_diacritics 2')
file_vec USING vec0(file_id INTEGER PRIMARY KEY, embedding float[512])

tags(file_id INT, facet TEXT, value TEXT, confidence REAL, origin TEXT)   -- origin: rule | model | user
entities(id INT PK, kind TEXT, name TEXT, aliases TEXT)  -- course | term | person | org | project
file_entities(file_id INT, entity_id INT, confidence REAL)
edges(src INT, dst INT, type TEXT, weight REAL, first_seen REAL, last_seen REAL)
      -- version_of | tailored_for | co_opened | sent_to | about_event | mentioned_in
lineages(id INT PK, role TEXT, head_file_id INT)         -- résumé lines (D-023)
lineage_members(lineage_id INT, file_id INT, state TEXT) -- head | older | duplicate | tailored
terms(id INT PK, name TEXT, start REAL, end REAL)        -- personal term timeline
open_events(file_id INT, at REAL, app TEXT)              -- for co_opened (local only)
suggestions(id INT PK, at REAL, surface TEXT, query TEXT, file_id INT, score REAL, level INT, outcome TEXT)
settings(key TEXT PK, value TEXT)
```

---

## 4. Core interfaces (Swift, sketched; Python mirrors them)

```swift
protocol AIProvider {            // D-016: FoundationModelsProvider (default) | ClaudeProvider (opt-in)
  func classify(_ excerpt: String, schema: TagSchema) async throws -> [TagGuess]
  func displayTitle(_ excerpt: String) async throws -> String?
  func extractReference(_ sentence: String) async throws -> Reference?   // {artifact, anchor, intent, range}
}
protocol Indexer      { func start(folders: [URL]); func reindex(_ id: FileID) }
protocol Extractor    { func excerpt(_ url: URL) async -> String? }          // PDFKit / Vision / text
protocol Tagger       { func tag(_ file: FileRecord) async -> [Tag] }        // rules first, AI only if needed
protocol LineageBuilder { func rebuild(affecting id: FileID) }
protocol NameSearch   { func search(_ q: String, limit: Int) -> [Hit] }      // F11, synchronous, < 30 ms
protocol Ranker       { func rank(_ m: Moment, candidates: [FileID]) -> [Scored] }
protocol Surfacer     { func decide(_ ranked: [Scored], moment: Moment) -> Surface }  // none | one | two
protocol CardWriter   { func write(_ id: FileID) }                           // D-015 mirror
```

---

## 5. Name search (F11): how it beats Finder

**Why Finder misses:** Spotlight matches **word beginnings**, often treats `Resume_PM_Fall26` as one word, has no typo tolerance, and defaults to searching contents across "This Mac."

**Contexto's matcher.** Every keystroke runs these in order, merges the results, and ranks them:

| Tier | Example query → match | How |
|---|---|---|
| 1 Exact / prefix of whole name | "resume_pm" → Resume_PM_Fall26.pdf | in-memory sorted names |
| 2 Word start | "fall" → Resume_PM_**Fall**26 | `name_tokens` split on `_ - . space`, camelCase, letter↔digit |
| 3 Substring | "sume" → Re**sume**…; "26" → …Fall**26** | FTS5 trigram (`names_tri`) |
| 4 Fuzzy subsequence | "rspmf" → **R**e**s**ume_**PM**_**F**all26 | fzf-style scorer over the top trigram candidates |
| 5 Typo | "resme", "lectre" | edit distance ≤ 1 (≤ 2 for 6+ letters) on tokens |
| 6 Meaning and tags | "econ fall 2023 slides" | tags + display titles via `files_fts` |

- **Normalization:** lowercase, accents folded (résumé = resume), aliases from a small table (`cv`↔`résumé`, `ps`↔`problem set`, course codes with or without spaces).
- **Ranking:** tier score → + recency → + version head → + current context (the open app, the upload moment) → − files in "older versions."
- **Speed:** names of 50k files ≈ 2–3 MB, kept in memory. Tiers 1–3 return in < 10 ms; fuzzy only rescores the top 200. Target < 30 ms per keystroke.
- **UI:** floating panel on ⌥Space (Bao's globalnotetaker pattern: shows over full-screen apps). Rows show icon, name (matched letters highlighted), display title, real folder, and date. ↩ open · ⌘↩ reveal · ⌘C copy · drag out.

---

## 6. AI usage (no agent in the core; D-017)

| Task | Default (on-device) | Opt-in (Claude, D-016) | Input sent | Output |
|---|---|---|---|---|
| Type + course classification | Foundation Models | `claude-haiku-5-5` (Batches for backlog) | first-page excerpt (~2k chars), never sensitive | JSON matching a tag schema |
| Display title | Foundation Models | `claude-haiku-5-5` | excerpt | short string |
| Reference extraction (mentions) | Foundation Models | (on-device only by default) | one sentence | `{artifact, anchor, intent}` |
| Agent mode (later, D-020) | — | `claude-opus-5-5` with local read-only tools | cards and excerpts from tool calls | answers and staged files |

All prompts return **structured output** validated against a schema. Invalid or low-confidence output → no tag (P3).

---

## 7. Privacy & security
- **Core path:** no network calls. Claude is only reached when the user enables it, through one network module with an allow-list.
- **API key:** stored in the macOS Keychain, never in files.
- **Never read:** secure text fields, excluded apps, or folders outside the user's grants.
- **Sensitive files** (tax, medical, IDs, by classifier and path rules): never sent to the cloud; never surfaced unless explicitly searched.
- **"Erase all"** deletes the DB and cards.

## 8. Performance budgets (D-011)
| Operation | Budget |
|---|---|
| Name search per keystroke (F11) | < 30 ms @ 50k files |
| Mention suggestion | < 150 ms after debounce |
| Organized view open | < 300 ms |
| Initial metadata index | < 2 min @ 50k files |
| Text + tag backlog | background, idle + power only |

## 9. Testing
- **lab/eval.py** against the golden set: per-component scores vs. the pass bars in CONTEXTO-ENGINE §6b, plus a new **search set** (`golden/searches.csv`: 50 partial or typo'd queries → expected file; pass = expected file in the top 3 for ≥ 95%).
- **ContextoCore XCTest:** unit tests for tokenizer, term mapping, lineage, URL → course, and surfacing thresholds; **benchmarks** for search and view budgets (Bao's benchmark-test pattern).
- **CI** runs both on every push. A drop in any score blocks merging (D-018).

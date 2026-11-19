# Contexto · Build Plan (one small step at a time)
*v1 · Nov 18, 2026 · Workflow step 5. Each step is one Claude Code session: implement → test → commit. Validate in a **fresh** session against this plan before moving on. Nothing gets built that isn't listed here (new ideas → DECISIONS.md as "proposed").*

**How to run each step with Claude Code:**
> "Read docs/CONTEXTO-ARCHITECTURE.md and docs/CONTEXTO-BUILD-PLAN.md. Implement step **X.Y only**. Write the tests it lists, run them, and commit with the message `X.Y: <title>`. Don't do anything outside this step."

Then in a new session:
> "Validate step X.Y against the plan: run the tests and eval, and report pass/fail with evidence. Don't fix anything; just report."

---

## Phase 0 · Setup & golden data (week 1)
| Step | Deliverable | Done when |
|---|---|---|
| 0.1 | New repo `contexto/` with the layout from ARCHITECTURE §2, docs copied in, `codebase.md`, `.gitignore` (golden data private) | Repo pushes; tree matches |
| 0.2 | `lab/` Python project (uv or venv), pytest runs, `eval.py` stub prints "0 checks" | `pytest` green |
| 0.3 | **You:** fill `golden/files.csv` (200 files: path, course, term, type, version_state, title) using a helper script that lists candidate files | 200 rows, ≥ 40 generic names, ≥ 20 versions |
| 0.4 | **You:** `golden/searches.csv` (50 partial or typo queries → file), `mentions.csv` (60, 15 with no answer), `uploads.csv` (20) | Files exist |

## Phase 1 · Python lab: prove it works on your Mac (weeks 1–3)
| Step | Deliverable | Done when |
|---|---|---|
| 1.1 | `ingest.py`: walk granted folders with skip rules (D-014); metadata incl. `kMDItemWhereFroms` via `mdls`; write SQLite `files` | Indexes your folders; count printed; junk skipped |
| 1.2 | `namesearch.py` (F11): tokenizer + trigram + fuzzy + typo + aliases; CLI `search "sume"` | **eval: searches top-3 ≥ 95%**; < 30 ms/query |
| 1.3 | `extract.py`: first ~2k chars → markdown (MarkItDown for Office/PDF, macOS Vision OCR via a small Swift CLI or `ocrmac`) | Excerpts for ≥ 90% of document-like golden files |
| 1.4 | `tag.py` rules: URL → course, date → term, filename codes, folder names | eval: course/term accuracy reported |
| 1.5 | `tag.py` AI fallback: provider interface; Claude Haiku 5.5 adapter (opt-in testing) + a local-model stub; structured JSON tags; confidence gate → "not sure" | eval: course ≥ 90%, term ≥ 95%, type ≥ 85%, honesty ≥ 90% |
| 1.6 | Display titles for generic files (D-013) | ≥ 80% judged useful (you mark y/n in a CSV) |
| 1.7 | `lineage.py`: SimHash + stem + dates → head/older/duplicate/tailored; résumé role lines (D-023) | "current" precision ≥ 95% |
| 1.8 | `rank.py`: candidates (BM25 ∪ embeddings ∪ graph) → features → hand weights → calibrate | eval: uploads top-1 ≥ 80%; mentions top-1 ≥ 80%; **silence ≥ 95%** |
| 1.9 | `cards.py`: markdown cards (D-015); open the folder in Obsidian to eyeball | Cards for all indexed files; Dataview table works |
| 1.10 | **Checkpoint:** `eval.py` full report saved to `docs/eval-YYYY-MM-DD.md` | All pass bars met, or gaps logged as decisions |

## Phase 2 · Swift spike: the hardest unknown (week 2, in parallel)
| Step | Deliverable | Done when |
|---|---|---|
| 2.1 | Minimal menu bar app (SwiftUI `MenuBarExtra`), Accessibility permission flow | App runs; permission detected live |
| 2.2 | AX observer on Notes/TextEdit: read the focused text + caret; find a hard-coded phrase's bounds | Logs the correct rectangle |
| 2.3 | Click-through overlay panel draws a blue underline at those bounds; follows scroll and resize | Underline stays aligned in Notes, TextEdit, Mail (X5) |

## Phase 3 · ContextoCore in Swift (weeks 4–6)
| Step | Deliverable | Done when |
|---|---|---|
| 3.1 | Package + GRDB store + schema (ARCHITECTURE §3) + migrations | Unit tests create and read all tables |
| 3.2 | Indexer: Spotlight metadata + FSEvents + bookmarks/file IDs (D-003) + skip rules | Rename/move keeps identity (test) |
| 3.3 | NameSearch port from the lab (F11) | Same `searches.csv` passes; benchmark < 30 ms |
| 3.4 | Extractor (PDFKit, Vision, text) | Matches lab excerpts on golden files |
| 3.5 | Tagger rules port + FoundationModelsProvider | Course/term within 2 pts of the lab |
| 3.6 | ClaudeProvider (opt-in, Keychain key, allow-listed network module) | Off by default; integration test with a mock |
| 3.7 | Lineage + display titles port | Matches the lab |
| 3.8 | Ranker + Surfacer port | Matches the lab on uploads/mentions; silence ≥ 95% |
| 3.9 | CardWriter | Cards identical in format to the lab's |

## Phase 4 · First usable app: search + views (weeks 7–8)
| Step | Deliverable | Done when |
|---|---|---|
| 4.1 | ⌥Space **search panel** (F11) over full-screen apps; open/reveal/copy/drag | You stop using Finder search for a week |
| 4.2 | **Organized views** window (F3): Classes, Terms, Latest versions, "Where it really is," view-only banner | Views open < 300 ms; nothing moved (test asserts no writes) |
| 4.3 | Inline tag correction + "Not sure yet" view | Fix propagates to lineage; undo works |
| 4.4 | Settings, Pause, Library, Erase all (F8) | Erase leaves no DB or cards |

## Phase 5 · Mention → find (weeks 9–10)
| Step | Deliverable | Done when |
|---|---|---|
| 5.1 | Phrase detection on pause/punctuation in Notes/TextEdit/Pages (F4) | Detects golden mentions in a test harness |
| 5.2 | Underline + badge + card popover; Tab accepts; Insert Link | End-to-end in Notes |
| 5.3 | Mail: missing attachment → Attach (F5) | Works in Mail compose |
| 5.4 | Rate limits, cooldowns, exclusions, secure-field skip | Unit tests for every rule |

## Phase 6 · Uploads, onboarding, recall (weeks 11–13)
| Step | Deliverable | Done when |
|---|---|---|
| 6.1 | Safari Web Extension: detect file inputs, ask Core, show inline suggestion, fill via DataTransfer (F6) | Works on 3 real upload pages |
| 6.2 | Résumé guard (wrong version → one line + Use newest) | Golden upload cases pass |
| 6.3 | Onboarding O1–O8 with the "organized, nothing moved" reveal (F7) | Time to reveal ≤ 3 min on a fresh account |
| 6.4 | Core Spotlight donations (F10) | "econ 1 slides fall 2023" works in system Spotlight |

## Phase 7 · Test & tune (week 14)
| Step | Deliverable | Done when |
|---|---|---|
| 7.1 | Two weeks of dogfooding with the local suggestion log | Weekly review notes in docs/ |
| 7.2 | X1/X2 tests with 5–8 students | PRD §5 metrics measured |
| 7.3 | Tune weights and thresholds against the eval; log decisions | No regressions |

## Later (not MVP; needs a new plan entry first)
- MCP server (D-019)
- In-app Agent mode (D-020)
- Related panel (F9)
- Calendar prepare
- Learned ranker v2 (D-022)
- Finder sidebar integration

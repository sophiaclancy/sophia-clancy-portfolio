# Contexto · Interactions, System & Psychology


# v4 update · Ambient, like Grammarly (current direction)

> **Feedback on v3:** "Too much for recruiting. Generalize it, e.g. finding a thing for a class from way back. More sleek and automatic than a sidebar, like how Grammarly suggests spelling errors. Completely frictionless."

## The model
Contexto is a **layer, not a place.** It watches what you're doing (with permission) and notices when you **refer to a file**, then underlines the reference right where you wrote it. Nothing to open, nothing to search.

| Trigger (what she does) | What Contexto notices | What appears | One action |
|---|---|---|---|
| Writes "I've attached my final project from CS 61A" in Mail | A file reference + "attached" with no attachment | Blue underline + badge "1" in the corner | Click (or **Tab**) → card → **Attach** |
| Writes "revisit the supply and demand graphs from ECON 1" in Notes | A file reference to a past class (2023) | Blue underline | → **Insert Link** (inline file chip) |
| Reaches an upload field ("Unofficial transcript") | The field's purpose | A suggestion directly under the field | **Attach** |
| Recruiting (résumé), sharing in Messages, citing in Pages… | Same layer | Same underline / field suggestion | Same one button |

## The card (Grammarly-style)
- **Header says why it appeared:** "You mentioned an attachment" / "From a class you took in 2023"
- **The file** + one line of real context (course, term, where it came from, when you used it)
- **Source chips:** Matches · From · Also
- **One blue button** (Attach / Insert Link) + Open · **Tab** accepts
- **Other matches (2)** and **Not this** for when it's wrong
- Corner **badge** shows how many references it found (✓ when resolved), just like Grammarly's count

## How it finds "a thing from way back" (system)
1. **Reference detection** (on-device, as you type, debounced ~400 ms): Foundation Models / NL tagging extracts *artifact* ("final project", "graphs", "slides") + *anchor* ("CS 61A", "ECON 1", "last semester", a person) + *intent* ("attached", "revisit").
2. **Anchor resolution:** "ECON 1" → a course entity built from calendar events, bCourses/Canvas download origins (`kMDItemWhereFroms`), folder names, and file text; "freshman year" → Fall 2023 from the term timeline.
3. **Retrieval:** hybrid (BM25 + embeddings) **filtered by the resolved anchor**, then graph-expanded (`about_event`, `co_opened`, `sent_to`).
4. **Calibrate:** underline only when confident; otherwise stay silent (no "maybe" underlines).
5. **Explain:** the card's context line + chips are generated from the matched signals (templates, not free text).
6. **Learn:** "Not this" lowers that pairing; accepting reinforces it.

**Real build path:** system-wide inline underlines are possible through the macOS **Accessibility API** (the same approach Grammarly's desktop app uses), plus a Safari extension for web upload fields. Everything stays on-device.

## Guidance principles
Automatic (no invocation) · in place (no panel) · one button · Tab to accept · silent when unsure · always reversible (remove the attachment / chip like any other).

---

# v3 update · Surfaced & guided (supersedes the "invisible" approach)

> **Feedback on v2.3:** "Not very intuitive. Stuff needs to be more easily surfaced. Pretend users know nothing. Guide them. No friction. The value is what the AI can gather behind the scenes, and *when* things surface."
> **Reference:** NotebookLM / Bao's NotetakingLM. A clear home panel, visible sources, one obvious action, answers with citations.

## The surfacing model: right place, right time, one button

| When | Where it surfaces | What she sees | One action |
|---|---|---|---|
| **Deadline approaching** (morning of, or 3 days out) | System notification | "Figma application due Friday. Contexto put together your application kit." | **Open Kit** |
| **She's on the posting** | Safari toolbar button | "Kit ready" (always there, never pops up again) | Click → panel |
| **She reaches an upload field** | **Right under the field** (like a password manager filling a login) | "Resume_PM_Fall26.pdf · your newest product résumé" | **Attach** |
| **Panel opens** | Contexto panel docked beside the page | *Gathering context…* → 3 checked sources → **Your application kit** (résumé, portfolio, optional cover letter), progress "1 of 2 attached" | **Attach** per item |
| **She picks a different version** | Inside the kit card | One warning line + "Use newest" | **Use newest** |
| **Kit complete** | Panel | "Review & Submit on Page" | **Submit** |
| **Submitted** | Panel | ✓ Application sent · **Up next:** Notion interview Tue 2 PM | **See all applications** / **Open** |
| **She has a question** | Ask bar at the bottom of the panel, with suggested questions | Answer + **source chips** (file, Safari history, calendar) | Tap a suggestion |
| **She uses Browse… anyway** | System picker | Suggested group + one-line guard (from v2.2) | **Upload** |

## Guidance rules ("pretend users know nothing")
1. **One primary (blue) button per moment.** Everything else is gray or a link.
2. **Show the work before the answer.** The 2-second *Gathering context* sequence (posting → calendar → Mac) makes the AI's capability visible and makes the answer believable.
3. **Every suggestion carries its sources** as small chips ("Posting · product role", "Sent to · Linear, Ramp"). No black boxes.
4. **Progress is explicit** ("1 of 2 attached" + bar), so she always knows what's left.
5. **Two doors to the same result:** the inline field suggestion (zero learning) and the panel (full context). Both stay in sync.
6. **Finish with what's next,** not a dead end ("Up next: Notion interview").

---


*Nov 2026 · v2.3. Supersedes the flow in CONTEXTO-FLOW-REDESIGN.md (its principles stay).*

> **What happened:** v2.1 was easy to follow but looked "AI." v2.2 looked native but was hard to follow. It hid every effect, jumped through time, and moved the story into a test bar.
> **Lesson:** *invisible* is not *illegible.* The **product** should be quiet; the **story** must still show cause → effect at every step.
> **v2.3:** v2.1's linear story (notice → prepare → protect → record → recall → tidy) in v2.2's calm, native visuals, with the reasoning shown **beside** the Mac, never inside it.

---

## 1. The system: on-device Graph-RAG for files

Contexto is a **retrieval-augmented** system: it retrieves the right files from your Mac, grounds every suggestion and explanation in signals it can point to, and uses a small language model only where language is needed (reading a job posting, parsing a question). It never asks a model to *invent* an answer.

```
SIGNALS                INDEX (on-device)                 MOMENT                      SURFACES
─────────              ─────────────────                 ──────                      ────────
Files (Spotlight       ┌─ Lexical   SQLite FTS5 (BM25)   Upload panel opens on   →   Open panel "Suggested"
  metadata, FSEvents)  ├─ Vector    NLContextualEmbedding  a job posting               + ⓘ Why + status-line guard
File text (PDFKit,     │            → sqlite-vec / HNSW   ─────────────────────
  Vision OCR)          └─ Graph     nodes + typed edges   1 Build query (JD + event)  Notification (once)
Calendar (EventKit)          file, version, application,  2 Hybrid retrieve           Finder: Job Search
Page context (Safari         company, event, person       3 Graph expand              Finder: Related
  extension)                                              4 Rank (features)           Spotlight: "Sent to Figma"
Open/attach events                                        5 Calibrate (thresholds)
                                                          6 Explain (templates)
                                                          7 Act / record / learn
```

### 1.1 Ingestion
| Signal | Source (Apple API) | Used for |
|---|---|---|
| File metadata | `NSMetadataQuery`: `kMDItemLastUsedDate`, `kMDItemWhereFroms` (download origin), content dates | recency, source, co-access |
| File changes | FSEvents | keeping the index fresh |
| File text | PDFKit text extraction; Vision `VNRecognizeTextRequest` for scanned PDFs | role/skills embedding, version similarity |
| Calendar | EventKit (read-only) | deadlines, interviews ("Figma application due Fri") |
| Page context | Safari Web Extension content script: page title, job description, `<input type=file>` presence | building the query at the moment of need |
| Behavior | open/attach/upload events | `co_opened`, `sent_to`, overrides |

### 1.2 Index: three views of the same files
- **Lexical:** SQLite FTS5 / BM25. Catches exact words ("Figma", "Product Manager").
- **Vector:** sentence embeddings via Apple's `NLContextualEmbedding` (on-device), stored with sqlite-vec. Catches meaning ("APM" ≈ "Product Manager").
- **Graph:** typed nodes and edges. This is the "Graph" in Graph-RAG, and it powers *Related*, *Sent To*, and the version guard.

| Edge | How it's built |
|---|---|
| `version_of` | SimHash similarity of text ≥ 0.9 **and** shared filename stem **and** time order → lineage; newest = **head** |
| `tailored_for` | company name in filename or text differs from the base version |
| `sent_to` | an upload from the open panel on a posting, confirmed by the site's thank-you page |
| `co_opened` | opened within ~30 s of each other, repeatedly (arXiv 1601.07273) |
| `about_event` | file opened/edited near a calendar event with matching entities |

### 1.3 Retrieval at the upload moment (budget: ready < 150 ms)
1. **Query.** When the posting loads, the on-device model (Apple **Foundation Models** framework) reads the job description and returns structured fields: `{role: "product", level: "intern", company: "Figma", skills: [...]}`. The calendar adds `deadline: Fri`.
2. **Candidates.** Hybrid search over files classified as résumés: BM25 ∪ vector top-k, merged with reciprocal rank fusion.
3. **Graph expand.** Pull lineage (`version_of`), past `sent_to` for similar roles, `tailored_for`.
4. **Rank.** A small, inspectable linear model over features:

| Feature | Example value (Resume_PM_Fall26) |
|---|---|
| `role_match` (cosine JD ↔ résumé) | 0.82 |
| `is_version_head` | 1 |
| `sent_to_similar_roles` | 2 (Linear, Ramp) |
| `recency_days` | 19 |
| `tailored_for_other_company` | 0 |
| `user_override_penalty` (this site) | 0 |

5. **Calibrate.** Map the score to a probability, then decide the UI by *confidence and margin*:

| Top p | Margin to #2 | UI |
|---|---|---|
| ≥ 0.80 | ≥ 0.20 | **Preselect** one under *Suggested* |
| 0.50–0.80, or margin < 0.20 | | Show up to **two**, select neither |
| < 0.50 | | **Nothing.** Standard picker |

6. **Explain.** The ⓘ text is generated from the **top-weighted features via templates** ("The version you sent Linear and Ramp"). No free-form generation, so **no hallucinated reasons**. Every line traces to a signal (the NotebookLM-citation idea, applied to files).
7. **Learn.** Accept = positive label; override = negative label for that domain; after two overrides on one site, stop flagging there.

### 1.4 Guard (on every selection, < 16 ms)
Selected file → graph lookup: *not the version head?* → "Older version." *`tailored_for` ≠ this company?* → "Tailored for Notion." *role mismatch?* → "For design roles." One line, one fix.

### 1.5 Record & recall
On submit: write `sent_to(file → application{company, role, url, date})`, and donate a `CSSearchableItem` to **Core Spotlight**, so "figma resume" in system Spotlight returns *Resume_PM_Fall26 · Sent to Figma · Nov 18*. *Job Search* is a **saved graph query** (applications ⨝ files sent), not a folder.

### 1.6 Privacy
All indexing, embedding, and inference run on-device. No file content leaves the Mac. Per-signal toggles; one-tap "Erase Contexto data."

### 1.7 How to really build it (feasibility)
- **As an Apple feature** (what the prototype shows): suggestions inside the system open panel.
- **As a shippable third-party v1:** the system open panel can't be extended by third parties. So: a **menu-bar app** (index + graph + models) + a **Safari Web Extension**. When a page has a file input, the extension shows a small native-styled chip right under it ("Resume_PM_Fall26.pdf · Attach"). It gets the file from the app via native messaging and sets the input with `DataTransfer`. Recall ships through Core Spotlight; Finder through a Quick Look / Finder extension + a smart-folder-style window.

---

## 2. Interaction by interaction

Each interaction: **trigger → what she sees → what the system does → psychology → decision (and what we rejected) → edge cases.**

### I1 · Notice: one notification, at a natural pause
- **Trigger:** 9:41 AM, first unlock; calendar has *Figma application due Fri*; the posting is open in Safari.
- **Sees:** "**Figma application due Friday.** Your product résumé is up to date." No buttons she has to answer.
- **System:** EventKit event classified `deadline`; ranking precomputed for this posting (§1.3), so the picker is instant later.
- **Psychology:** an unfinished task stays on the mind (**Zeigarnik effect**). Naming the deadline *and* saying "ready" closes that loop and lowers anxiety. Sent at a **natural break** (unlock), when interruptions cost the least (Iqbal & Bailey 2008).
- **Decision:** one notification per deadline, never repeated. *Rejected:* daily reminders (alert fatigue), a badge on Finder (no context).
- **Edges:** no calendar access → no notification; everything else still works.

### I2 · Prepare: the picker opens with the right file selected
- **Trigger:** she clicks **Attach**.
- **Sees:** the normal macOS open panel. At the top, a **Suggested** group with *Resume_PM_Fall26.pdf* **already selected**; Upload is blue and ready.
- **System:** p = 0.91, margin 0.34 → preselect (§1.3 step 5).
- **Psychology:**
  - **Default effect:** people keep pre-set options (Johnson & Goldstein 2003). The right file *is* the default, so the easiest path is the correct one.
  - **Choice overload / Hick's law:** decision time grows with options (Hick 1952; Iyengar & Lepper 2000). Eleven near-identical names → one obvious answer.
  - **Recognition over recall:** she recognizes the file; she doesn't have to remember which one was newest.
- **Decision:** preselect inside the *existing* list. *Rejected:* a banner card (banner blindness; looked "AI"), auto-attaching without the picker (removes agency → **automation bias** and blame when wrong; Parasuraman & Riley 1997).
- **Edges:** two plausible matches → two shown, none selected; one résumé → no Suggested group.

### I3 · Reassure: a gray line under the suggestion
- **Sees:** "Sent to Linear and Ramp · Edited Oct 30."
- **System:** `sent_to` edges + modified date.
- **Psychology:** **information scent** (Pirolli & Card 1999). The cue tells her she's on the right path without opening the file. Her *own* past choices are the most persuasive proof (**consistency**).
- **Decision:** facts, not adjectives ("Best match!" was rejected: unfalsifiable, salesy).

### I4 · Explain: ⓘ "Why this file"
- **Trigger:** she hovers or clicks ⓘ (optional).
- **Sees:** 3–4 plain reasons + "Suggested by Contexto from files on this Mac."
- **System:** template rendering of the top features (§1.3 step 6).
- **Psychology:** **trust calibration** (Lee & See 2004). Enough evidence to trust the default, available but not pushed, so it doesn't invite blind over-trust. **Progressive disclosure** keeps the main path clean.
- **Decision:** the brand name appears *only here*, where it's accountable. *Rejected:* "AI picked this" (vague), confidence percentages (false precision).

### I5 · Protect: a one-line guard on the wrong pick
- **Trigger:** she selects *resume_PM_new (2).pdf*.
- **Sees:** status bar: "⚠︎ Older version. Your newest product résumé is Resume_PM_Fall26 (Oct 30)." **[Use Newer]**. Upload still works.
- **System:** lineage lookup (§1.4).
- **Psychology:** this is a **mistake** (wrong mental model of which file is newest), not a **slip** (Norman 1988), so the fix is *information at the point of action*. One proportional line avoids **alert fatigue**; keeping Upload enabled respects **autonomy** (people resist controls that feel coercive: reactance, Brehm 1966).
- **Decision:** *Rejected:* modal dialog (habituated "OK"), blocking Upload, red error styling (implies she did something wrong).
- **Edges:** tailored copy → "Tailored for Notion"; design résumé on a PM role → "For design roles"; two overrides on a site → stop flagging there.

### I6 · Record: "Added to Job Search"
- **Trigger:** Upload → Submit.
- **Sees:** the page's own confirmation, then one notification: "**Added to Job Search** · Figma · Product Manager Intern · Resume_PM_Fall26.pdf" with **Show** / **Undo**.
- **System:** `sent_to` edge + Core Spotlight donation (§1.5).
- **Psychology:** **visibility of system status** plus **closure**. Ending on a clear, positive "done" shapes how the whole task is remembered (**peak-end rule**, Kahneman et al. 1993). **Undo** lowers the cost of being wrong, so she doesn't need to watch the system.
- **Decision:** this is the only other notification in the flow, because it reports something she can't see otherwise.

### I7 · Recall: Job Search builds itself
- **Trigger:** **Show**, or *Job Search* in Finder's sidebar.
- **Sees:** a table: company, role, résumé sent, date, status. The new Figma row is gently highlighted.
- **System:** a saved graph query, not a folder.
- **Psychology:** **external memory** (distributed cognition). She no longer has to *remember* what she sent where. Seeing six applications in a row creates **goal-gradient** motivation (Kivetz et al. 2006).
- **Decision:** no manual logging, ever. *Rejected:* a separate tracker app (Teal/Huntr model).

### I8 · Tidy: Stop Suggesting (nothing moves)
- **Sees:** a quiet row above the table: "3 older résumé versions haven't been opened since May. They still appear when you attach a résumé." **[Stop Suggesting]** · Show.
- **System:** sets `suppress` on non-head versions; ranker excludes them; files untouched.
- **Psychology:** **loss aversion** (Kahneman & Tversky 1979) makes deleting or archiving feel risky, so people hoard. A **non-destructive, reversible** action removes the fear.
- **Decision:** *Rejected:* "Archive" (implies moving), "Delete" (irreversible), auto-cleanup (v1 testers: "I want to check before files get moved").

### I9 · Related: one hop at a time
- **Trigger:** **Related** in the toolbar.
- **Sees:** the résumé in the center; up to six connected items around it, each captioned with the relationship ("Sent Nov 18", "Tailored copy"). Click one to move it to the center.
- **System:** 1-hop graph neighborhood, plus faint 2nd-hop items when they fit.
- **Psychology:** memory is **associative** (spreading activation, Collins & Loftus 1975). People re-find by association (Feldspar, CHI 2008). **Working memory holds ~4 chunks** (Cowan 2001), so we show one hop, never the whole graph.
- **Decision:** *Rejected:* the full Obsidian-style map (v2.0 feedback: "hard to follow").

### I10 · Ask later: Spotlight (not in the prototype path)
- "figma resume" → *Resume_PM_Fall26 · Sent to Figma · Nov 18.*
- **Psychology:** **encoding specificity** (Tulving & Thomson 1973). She remembers the *company*, so the company is the cue that retrieves the file.

---

## 3. What the prototype shows
A linear seven-step story with a **"How it works" panel** beside the Mac. Each step names what she does, what Contexto does, the system step, and the psychology. Click any step to jump to it.

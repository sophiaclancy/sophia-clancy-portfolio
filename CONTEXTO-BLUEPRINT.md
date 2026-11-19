# Contexto · Build Blueprint
### How it works, end to end: system, tagging, surfacing, interaction, onboarding. Every decision with its reason.
*v4 (ambient) · Nov 2026 · Author: Sophia Clancy · Status: ready to build*

> **One line:** Contexto is a quiet layer on your Mac that knows what your files *are* (which class, which term, which version), and when you mention one while writing or reach an upload field, it underlines the reference and hands you the file in one keystroke.
>
> **Product promise:** *You never have to remember where you put something. You only have to mention it.*

How to read this: every decision is written as **Decision → Why (psychology / evidence) → How (implementation)**. Citations are listed in §13. Verify each one against the original paper before quoting it publicly.

---

## 0. Ten principles (the cut list for every future decision)

| # | Principle | Why |
|---|---|---|
| P1 | **Mention, don't search.** The trigger is natural language you were already writing. | People remember episodes and context, not filenames or paths (Dumais et al. 2003; Elsweiler et al. 2007). Recall is harder than recognition (Nielsen's heuristics). |
| P2 | **Pull, not push.** Underline quietly; the card opens only when she asks. | Interruptions carry a resumption cost and raise stress (Mark, Gudith & Klocke 2008). Calm technology lives in the periphery until it's needed (Weiser & Brown 1996). |
| P3 | **Silent when unsure.** No "maybe" underlines. | False alarms damage trust in automation more than misses, and that damage lasts (Dzindolet et al. 2003; Lee & See 2004). |
| P4 | **One button.** Every surface has exactly one primary action. | Choice overload and Hick's law: more options means slower and less satisfying decisions (Hick 1952; Iyengar & Lepper 2000). |
| P5 | **Show the reason.** Every suggestion says why ("From a class you took in 2023"). | Explanations calibrate trust (Lee & See 2004). Visible reasons let users catch errors instead of blindly accepting (Parasuraman & Riley 1997). |
| P6 | **Never move, rename, or delete files.** Tags and links are a layer on top. | Loss aversion (Kahneman & Tversky 1979). v1 testers: "I want to check before files get moved." |
| P7 | **Zero filing.** Users never have to tag anything. | People don't organize consistently; organizing costs time and rarely pays back in re-finding (Whittaker et al. 2011). v1 testers called manual tagging a "dealbreaker." |
| P8 | **Correctable in one tap.** When a tag is wrong, fix it right there. | Perceived control reduces creepiness and increases adoption of automation. Small investments raise how much people value a product (IKEA effect; Norton, Mochon & Ariely 2012). |
| P9 | **Private by construction.** On-device; reads only what's needed. | Privacy feels violated when information flows outside the context it came from (contextual integrity; Nissenbaum 2004). |
| P10 | **Teach once, then disappear.** Coach marks fade after a few uses. | Instructional scaffolding should fade as competence grows (Wood, Bruner & Ross 1976). |

---

## 1. How it works (system overview)

```
┌────────────────────────── Contexto.app (menu bar, Developer ID, non-sandboxed) ──────────────────────────┐
│                                                                                                           │
│  INDEXER (background)          CONTEXT GRAPH (SQLite)            REFERENCE DETECTOR        OVERLAY UI      │
│  ─ FSEvents watcher        →   files · tags · entities      ←    (as you type, AX)    →    underline       │
│  ─ Spotlight metadata          (course, term, person,            ─ phrase extraction        badge           │
│  ─ text extract (PDFKit,        org, project, type,              ─ anchor resolution        card            │
│    Vision OCR)                  version, source)                 ─ retrieval + rank                         │
│  ─ embeddings (on-device)      edges: version_of, sent_to,       ─ calibrate                                │
│  ─ TAGGER (rules + model)      co_opened, about_event            SURFACING ENGINE                           │
│                                FTS5 (lexical) + vectors          (levels, thresholds, rate limits)          │
│                                                                                                           │
│  EventKit (calendar, opt-in)   Core Spotlight donations          Safari Web Extension ⇄ native messaging    │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Five jobs, in order:**
1. **Index:** know every file in the folders she allowed.
2. **Tag:** turn each file into *meaning*: course, term, type, version, source, people (§2).
3. **Detect:** notice when what she's writing or doing refers to a file (§3.1).
4. **Surface:** decide whether, where, and how loudly to show it (§3).
5. **Act and learn:** attach, insert, or open; learn from accepts and "Not this" (§4).

**Tech stack (solo-buildable):**

| Layer | Choice | Why this choice |
|---|---|---|
| App | Swift + SwiftUI, menu bar app (`MenuBarExtra`) | Native look; low resource use |
| Distribution | **Developer ID + notarization, outside the App Store** | The App Sandbox blocks using the Accessibility API to read and annotate other apps. Grammarly's desktop app ships the same way. |
| File access | User-selected folders (Documents, Desktop, Downloads, iCloud Drive) kept as security-scoped bookmarks; optional Full Disk Access | Ask only for what's needed (just-in-time; §6) |
| Text in other apps | **Accessibility API**: `AXObserver` for `kAXValueChangedNotification` and `kAXSelectedTextChangedNotification`; `kAXBoundsForRangeParameterizedAttribute` to place underlines | The only system-wide way to see and annotate text |
| Overlay | Transparent, click-through `NSPanel` per focused text view; draws underlines at the AX bounds | Matches Grammarly's approach; doesn't modify the host app |
| Web | Safari Web Extension (content script finds `<input type=file>` and text areas; sets files via `DataTransfer`) | Browsers expose little through AX; web upload fields need an extension |
| Language | Apple **Foundation Models** framework (on-device LLM) for phrase extraction and type classification; `NLTagger` and `NLContextualEmbedding` for entities and embeddings | Free, private, and offline |
| Storage | SQLite + FTS5 (BM25) + sqlite-vec (vectors) | One file, fast, inspectable |
| Recall | Core Spotlight `CSSearchableItem` donations | "ECON 1 graphs" works in system Spotlight too |

---

## 2. The tagging system (the brain)

### 2.1 Decision: tags are automatic, faceted, and mostly invisible
- **Why:** P7 (people don't file). Photos proved that automatic facets (people, places, dates) beat folders for re-finding. That's the model Sophia and v1 testers named.
- **How:** every file gets values in a **fixed set of facets** (the facets never change; the values are open). Tags show up to her as **chips in cards and Spotlight**, never as a chore.

### 2.2 The facets

| Facet | Example values | Main signals | Confidence source |
|---|---|---|---|
| **Course** | ECON 1, CS 61A | Download origin (`kMDItemWhereFroms`: bCourses/Canvas/Gradescope URLs contain the course), filename ("CS61A_"), folder name, first-page text ("Economics 1, Fall 2023"), calendar events the file was opened near | Agreement across ≥2 signals |
| **Term** | Fall 2023, Spring 2024 | Created/downloaded date mapped onto the **term timeline** (§2.4); text ("Fall 2023") | Date + text |
| **Type** (artifact) | lecture slides, problem set, essay, lab report, project, notes, résumé, transcript, cover letter, syllabus, receipt | Foundation Models classifier on title + first 1–2 pages; layout cues (slides vs. prose) | Model probability |
| **Version state** | current · older · duplicate · tailored | Lineage (§2.5) | Deterministic |
| **Source** | bCourses, Gmail, Gradescope, Safari download, AirDrop, screenshot | `kMDItemWhereFroms`, quarantine attributes, app that created it | Deterministic |
| **People** | Prof. Rivera, Aldrin (teammate) | Text (author lines), email the file came from, calendar attendees | Text + source |
| **Organization** | Figma, Berkeley URAP | Text, sent-to history | Text + history |
| **Project** | "Ants project", "Portfolio refresh" | Co-opened clusters (§2.6) named by the model from shared titles | Cluster strength |

### 2.3 Decision: show at most 3 chips per file, chosen by usefulness
- **Why:** working memory holds about four chunks (Cowan 2001). Chips are cues, not a database dump.
- **How:** rank facets by how much they **distinguish** this file from its neighbors (term matters when there are many ECON 1 files; type matters when the course is unique).

### 2.4 The term timeline (this is how "freshman year" works)
- **Decision:** build a personal academic calendar automatically, confirmed in onboarding with **one** question.
- **Why:** temporal phrases ("freshman year", "last semester", "way back") are how people describe old episodes (encoding specificity; Tulving & Thomson 1973). Confirming a guess is far easier than typing an answer (recognition over recall).
- **How:**
  1. Infer terms from file-date density plus course-code clusters (big gaps = breaks).
  2. Onboarding asks: "Looks like you started at Berkeley in **Fall 2023**. Right?" [Yes] [Change].
  3. Map "freshman year" → Fall 2023 + Spring 2024; "last semester" → the previous term; "sophomore spring" → Spring 2025.

### 2.5 Version lineage (current vs. older vs. duplicate vs. tailored)
- **Decision:** compute it; never ask.
- **Why:** near-duplicate versions are the #1 source of wrong-file mistakes (Sophia's résumé pain point). People can't reliably tell which "final_v3 (2)" is newest.
- **How:** same type + text SimHash similarity ≥ 0.9 + shared filename stem → one lineage, ordered by content-modified date. **Newest = current.** Byte-identical = **duplicate**. Same base with a company or person name added = **tailored**.

### 2.6 Projects from behavior (co-access)
- **Decision:** files opened together repeatedly become a project, named automatically and confirmed lazily.
- **Why:** files used together are related (co-access graphs; arXiv 1601.07273), and associative re-finding works (Feldspar, CHI 2008).
- **How:** opened within ~30 s of each other, on ≥3 separate days → `co_opened` edge. Dense clusters get a model-generated name from shared title tokens ("Ants project"). The name only becomes visible if it's used in a card.

### 2.7 Decision: corrections happen inline and propagate
- **Why:** P8. One tap of control converts "creepy" into "mine," and each fix is training data.
- **How:** chips in a card are tappable → "Change course…" → pick from her courses. The fix updates this file *and* its lineage and project siblings, with an Undo toast ("Updated 6 related files").

### 2.8 Decision: Finder tag mirroring is opt-in and off by default
- **Why:** avoid clutter and surprises in Finder (P6 spirit: don't change her files' visible state uninvited). Offer it later for power users who want portability (no lock-in).
- **How:** Settings › "Show course tags in Finder" writes standard macOS tags (e.g., "ECON 1").

---

## 3. The surfacing system (when, where, how loud)

### 3.1 What counts as a trigger

| Trigger | Detected by | Example |
|---|---|---|
| **T1 Reference in text** | AX text changes → phrase extractor → `{artifact, anchor, intent}` | "the supply and demand graphs from ECON 1" → `{artifact: graphs/slides, anchor: course=ECON 1, intent: revisit}` |
| **T2 Missing attachment** | Intent "attached/attaching/see attached" in Mail/Gmail + no attachment present | "I've attached my final project from CS 61A" |
| **T3 Upload field** | Safari extension finds `<input type=file>` + label/accept text ("Unofficial transcript (PDF)") | Transcript, résumé, ID, assignment upload |
| **T4 Natural-language search** | Spotlight query routed through Core Spotlight items | "econ 1 graphs freshman year" |
| **T5 Time-based prepare** (opt-in, off by default) | Calendar event starting soon + course entity | "ECON 100B in 10 min: last week's slides" |

**Phrase detection rule:** run only after a **pause (~400 ms) or punctuation** following a noun phrase. *Why:* don't interrupt a forming thought. Flow and working memory are fragile mid-sentence (Csikszentmihalyi 1990; Mark et al. 2008). This is why Grammarly marks errors after the word, not during it.

### 3.2 The surfacing ladder (loudness levels)

| Level | Surface | Used for | Min confidence | Why this loudness |
|---|---|---|---|---|
| **L0** | Nothing visible (index only) | Everything | none | Calm by default (Weiser & Brown) |
| **L1** | Corner **badge** count | Any active reference in the focused field | ≥ 0.75 | Peripheral awareness without pulling attention |
| **L2** | **Underline** on the phrase | T1, T2 | ≥ 0.75 (one clear match) | Spatially attached to the cause, so no search for "what is this about" (proximity / Gestalt) |
| **L3** | **Inline suggestion** under an upload field | T3 | ≥ 0.80 | At the exact point of action; field purpose is explicit, so higher precision |
| **L4** | **Notification** | T5 only, opt-in | ≥ 0.90 | Notifications interrupt; reserve them for time-critical, user-requested moments |

### 3.3 Decision: confidence gates loudness, not just existence
- **Why:** signal detection theory. When the cost of a false alarm is high (lost trust, annoyance), raise the threshold (Green & Swets 1966). Trust in automation drops sharply after visible errors (Dzindolet et al. 2003).
- **How:** calibrated score → level. Ambiguous (top-2 margin < 0.15) → **no underline**; the file still appears in Spotlight for T4. For T3, two good matches show two rows, neither preselected.

### 3.4 Rate limits and cooldowns (anti-annoyance)

| Rule | Why |
|---|---|
| Max **1 underline per phrase**; never re-underline after "Not this" in the same document | Respect explicit rejection; avoid nagging (reactance; Brehm 1966) |
| Max **3 active underlines** per document | Avoid visual noise; preserve the meaning of the signal (alert fatigue) |
| After **3 "Not this"** in one app within a week → that app goes to badge-only for 7 days, with a one-time note | Adapt to the user instead of making them configure |
| **L4:** max 1 per day, never during Focus modes | Notification fatigue; respect system Focus |
| **No surfacing** in password fields, banking/password-manager apps, or Terminal | Secure fields are unreadable by design; P9 |

### 3.5 Decision: the card is pull-only
- **Why:** P2. Popping a card unasked is an interruption; an underline is an *invitation*. Users stay in control of when to spend attention (perceived control).
- **How:** the card opens on hover (after 300 ms), click, or **Tab** while the caret is in or right after the underlined phrase. It never opens on its own.

---

## 4. The interaction spec

### 4.1 Underline
- **Look:** 2 px system-blue line, animates in left → right over 500 ms; on hover, a 10% blue tint.
- **Why blue, not red:** red means *error* (Grammarly's spelling convention). This isn't a mistake, it's help. Blue reads as "link/action" on Apple platforms (affordance from convention).
- **Why animate:** onset motion draws attention in the periphery just enough to be noticed once (attention capture by abrupt onsets; Yantis & Jonides 1984), then it stays still.

### 4.2 Badge (corner of the focused text area)
- **Look:** 30 px white circle with the Contexto mark; count bubble (blue) → ✓ (green) when resolved.
- **Why:** a familiar pattern (Grammarly) shrinks the learning curve to zero (Jakob's Law: users expect your product to work like the others they know). The count closes the loop: she knows if anything is pending (Zeigarnik effect).
- **Click:** opens the card for the first unresolved reference.

### 4.3 Card anatomy (top → bottom)

| Element | Content | Why |
|---|---|---|
| Header | *Why it appeared*: "You mentioned an attachment" / "From a class you took in 2023" | Explains the cause before the content (sense-making; P5) |
| File | Thumbnail, name, **one** context line (course · term · source · usage) | Recognition over recall; information scent (Pirolli & Card 1999) |
| Chips (≤3) | Matches · From · Also | Evidence, inspectable (P5) |
| Primary | **Attach** / **Insert Link** / **Use** (verb matches the app) | One action (P4); verb fits the context (match between system and real world) |
| Secondary | Open | Lets her verify before committing (reduces anxiety about the wrong file) |
| Shortcut hint | "Tab to attach" (first 5 times only) | Teach the fast path, then fade (P10) |
| Footer | Other matches (n) · Not this | Escape hatches: correction without leaving (P8) |

### 4.4 Accepting
- **Mail/Gmail:** the file is attached using the app's own attach mechanism (AX menu action / pasteboard file URL). The underline becomes plain text; badge ✓.
- **Notes/Pages/Docs:** inserts a **file link chip** right after the phrase (or a standard link where chips aren't supported).
- **Upload field:** fills it via the extension; the inline suggestion is replaced by the app's own "file attached" state.
- **Undo:** the host app's ⌘Z, plus "Remove" on the attachment like any other.
- **Why:** after acceptance, Contexto *disappears into the host app's normal state*. Nothing new to manage. Reversibility lowers the cost of trying (people take more beneficial actions when mistakes are cheap).

### 4.5 "Other matches"
- Shows up to 3 alternatives with their distinguishing chip ("Project 1 · Feb 2024").
- **Why 3:** enough to cover near-misses without turning the card into a search UI (Hick's law).

### 4.6 "Not this"
- Removes the underline immediately and asks **nothing** (no "why?" survey). Optional second step: "Wrong course?" only if the anchor was the likely failure.
- **Why:** asking for justification after a rejection adds friction exactly when trust is lowest. Learn silently from the negative label.

### 4.7 Keyboard & accessibility
- **Tab** = open card / accept · **Esc** = close · **↓↑** = move through other matches · **⌘.** = dismiss.
- VoiceOver: when an underline appears, post a polite announcement ("Contexto found a file for 'final project from CS 61A'. Press Tab to review."). The card is an accessible popover with labeled buttons.
- **Why:** keyboard-first keeps her hands on the keys mid-writing (lower interaction cost). Accessibility shares the same path, not a separate one.

---

## 5. Onboarding (first 3 minutes → first win)

**Goal:** first accepted suggestion **inside onboarding**, under 3 minutes. That's the activation moment ("aha"): users who experience the core value early retain far better. Everything else is deferred.

### Screen-by-screen

**O1 · Welcome (5 s)**
- A looping 6-second clip: someone types "my notes from ECON 1" → blue underline → Tab → file attached. One line: **"Mention a file. Contexto finds it."** [Get Started]
- *Why:* show, don't tell. A concrete example builds the mental model faster than a feature list (worked-example effect; Sweller & Cooper 1985). One sentence = one promise.

**O2 · Choose where to look (pre-permission screen)**
- Checkboxes, pre-checked: Documents · Desktop · Downloads · iCloud Drive. "Contexto reads these on this Mac. Nothing is uploaded." [Continue] → system folder-access prompts.
- *Why:* explaining *before* the system dialog increases grants and reduces anxiety (a pre-permission "primer"). Pre-checked defaults carry an implicit recommendation (default effect; Johnson & Goldstein 2003) while leaving control visible (P9).

**O3 · Indexing, with immediate payoff**
- Live progress plus **her own content appearing**: "Found **6 classes**: ECON 1 · CS 61A · DATA 8 · ECON 100B… · **11 résumés** · **3 projects**."
- *Why:* waiting feels shorter with visible progress and meaningful content (occupied time feels shorter than unoccupied time; Maister 1985). Seeing her own life organized *is* the value proposition, proven on her data (personal relevance increases engagement).
- Long indexes continue in the background; she can proceed at any time ("Keep going, I'll finish in the background").

**O4 · One confirmation (term timeline)**
- "Looks like you started in **Fall 2023**." [That's right] [Change]. Then: "ECON 1 → **Fall 2023**, CS 61A → **Spring 2024**." [Looks good] [Fix one]
- *Why:* recognition beats recall. Confirming is cheaper than entering. A small investment raises ownership and trust (IKEA effect), and it's the single fact that unlocks "freshman year" phrases (§2.4).

**O5 · Try it (the first win, in a sandbox)**
- A small text box pre-filled: "Remember to review ▌" with a hint "Type: **my notes from ECON 1**". The underline appears on *her* real file → "Press **Tab**" → card → **Insert** → confetti-free ✓ ("That's it.").
- *Why:* learning by doing with immediate feedback. The first success is the strongest predictor of continued use. It uses her real data so the magic is credible, not a demo.

**O6 · Turn it on where you write (just-in-time Accessibility permission)**
- "Contexto works in Mail, Notes, Pages, Messages, and Safari. To show underlines in other apps, macOS needs your OK." [Open Settings] with an inline 3-step visual of the Accessibility toggle. Live detection: the screen updates to ✓ the moment it's granted.
- *Why:* the scariest permission is asked **after** she has felt the value (in O5), so the benefit is concrete when the cost is weighed (privacy calculus; Culnan & Armstrong 1999). Live ✓ detection removes uncertainty about whether it worked.

**O7 · Optional extras (skippable, one screen)**
- Toggles, all off: Calendar ("Prepare files before class"), Safari extension ("Suggest files for upload fields"), Finder tags.
- *Why:* progressive disclosure. Optional power is offered once, without blocking. Off by default respects privacy expectations for sensitive signals.

**O8 · Done**
- "Contexto lives in your menu bar. You'll see a **blue underline** when you mention a file. That's all you need to know." Menu bar icon pulses once.
- *Why:* state the mental model in one sentence (a clear conceptual model predicts correct use; Norman 1988). Point to where it lives so she can find it again.

### After onboarding (scaffolding that fades)

| Moment | What happens | Fades when |
|---|---|---|
| First 3 underlines in real apps | Tiny tooltip: "Press Tab to see the file" | After 3 accepts or 7 days |
| First "Not this" | Toast: "Got it. Contexto learns from this." | Once |
| First upload-field suggestion | Tooltip: "Contexto picked your newest transcript" | Once |
| Day 3, if 0 accepts | Menu bar "Try: type 'last semester's syllabus' in Notes" | Once, then never |

**Activation metric:** ≥1 accepted suggestion in a real app within 48 h of install.

---

## 6. Trust, privacy & control

| Decision | Why | How |
|---|---|---|
| **Everything on-device** | Contextual integrity (Nissenbaum 2004): file contents shouldn't flow to a server just to find a file | Foundation Models + local SQLite; no network calls in the core path |
| **Read only around the caret** | Minimize data exposure; reading whole documents feels like surveillance | AX reads the current sentence/paragraph window; discards it after detection |
| **Never in secure fields or excluded apps** | Safety; expectations | Skip `AXSecureTextField`; default exclusions: password managers, banking, Terminal; user-editable |
| **"What Contexto knows" view** | Transparency reduces creepiness; people trust systems they can inspect | Settings › Library: courses, terms, projects, counts; per-file chips; edit/delete |
| **Pause** | Instant control without uninstalling | Menu bar › Pause for 1 hour / until tomorrow / in this app |
| **Erase all** | Reversibility of consent | One button; wipes the index |
| **No dark patterns** | Long-term trust > short-term metrics | No nagging re-prompts; a declined permission is asked again only when she uses that feature |

---

## 7. Menu bar app & settings (IA)

```
Menu bar ◉
├─ Search your files…              (natural language, same engine as T4)
├─ Recent finds                    (last 5 accepted, with source app)
├─ Pause ▸  1 hour · Until tomorrow · In <current app>
├─ Library…                        (what Contexto knows)
└─ Settings…
    ├─ General      launch at login · underline style · Tab shortcut
    ├─ Places       folders indexed · index status
    ├─ Apps         per-app on/off · badge-only · excluded apps
    ├─ Sources      Calendar · Safari extension · Mail
    ├─ School       start term · term timeline · courses (rename/merge)
    └─ Privacy      what's stored · erase all
```
*Why this shape:* the menu holds only daily actions (search, pause). Configuration lives one level down (progressive disclosure). "Library" exists for transparency, not daily use.

---

## 8. Data model (SQLite)

```sql
files(id, path, bookmark, name, uti, size, created, modified, last_used, source, sha1, simhash, text_excerpt)
tags(file_id, facet, value, confidence, origin)          -- origin: rule | model | user
entities(id, kind, name, aliases_json)                   -- kind: course | term | person | org | project
file_entities(file_id, entity_id, confidence)
edges(src_id, dst_id, type, weight, first_seen, last_seen)  -- version_of | co_opened | sent_to | about_event | tailored_for
terms(id, name, start_date, end_date)                    -- personal term timeline
events(id, ek_id, title, start, end, course_entity_id)   -- opt-in calendar
suggestions(id, app, trigger, phrase, file_id, score, level, shown_at, outcome)  -- outcome: accepted | other | not_this | ignored
files_fts USING fts5(name, text_excerpt, tags)
file_vec USING vec0(embedding float[512])
```

### Detection → suggestion (pseudo)

```swift
onTextChange(field) {
  guard !field.isSecure, app.isEnabled, pausedUntil < now else { return }
  let window = field.sentence(aroundCaret)
  debounce(400.ms, untilPunctuationOrPause) {
    guard let ref = extractor.extract(window)          // {artifact, anchor, intent, range}
    else { return }
    let anchor = resolver.resolve(ref.anchor)          // course/term/person/org entities
    var cands = retrieve(lexical: ref.text, vector: embed(ref.text), filter: anchor)  // top 20
    cands = graphExpand(cands)                         // lineage heads, co_opened, sent_to
    let ranked = rank(cands, features: [artifactTypeMatch, anchorMatch, isVersionHead,
                                        recencyForAnchorTerm, pastUseInThisApp, notThisPenalty])
    let (p, margin) = calibrate(ranked)
    let level = surfacingLevel(trigger: ref.intent, p: p, margin: margin, rateLimits: state)
    if level >= .underline { overlay.underline(field, ref.range, suggestion: ranked[0], others: ranked[1...3]) }
    log(suggestion, level)
  }
}
```

---

## 9. Edge cases & failure modes

| Case | Behavior | Why |
|---|---|---|
| Two equally good files | No underline; T4/Spotlight still finds both | P3 |
| Anchor unknown ("my notes from that one class") | No underline; menu bar search can handle it conversationally | Don't guess on vague anchors |
| File is in iCloud, not downloaded | Card shows "Downloads when attached"; system progress | Matches system behavior |
| She's typing in a language other than English | Detector supports the system languages that Foundation Models supports; otherwise silent | Graceful degradation |
| App doesn't expose AX text (some Electron apps, canvas editors like Google Docs) | Badge-only via the browser extension, or silent | Honest limits; never break the host app |
| Index incomplete | Card footer: "Still learning your files (62%)" | Sets expectations (visibility of system status) |
| She accepts the wrong file | Normal ⌘Z / Remove; the "accepted then removed within 60 s" signal counts as a negative | Learn without asking |
| Sensitive file types (tax, medical) | Never surfaced unless she explicitly searches; classifier flags `sensitive` | Contextual integrity |
| Shared Mac | Index is per macOS user | Isolation |

---

## 10. Metrics & testing

| Metric | Target | What it tells you |
|---|---|---|
| Activation: first real accept ≤ 48 h | ≥ 60% | Onboarding works |
| **Precision of underlines** (accepted ÷ shown) | ≥ 70% | Trust health (P3) |
| "Not this" rate | ≤ 10% | False alarms |
| Time from underline → attached | ≤ 3 s median | Frictionless |
| Week-4 retention (≥1 accept/week) | ≥ 40% | Real habit |
| Permission grant rate (Accessibility) after O5 | ≥ 75% | Value-before-permission works |
| "Feels creepy" (1–5, lower better) | ≤ 2 | Privacy design works |

**Test plan (v2 user test, 6–8 students):**
1. Re-find a 2-year-old class file by mentioning it in Notes.
2. Email a professor with an old project attached.
3. Upload a transcript.
4. Recover from a wrong suggestion.
5. Onboarding from scratch, timed to the first win.

Measure time, errors, think-aloud on the card, and post-task trust and creepiness ratings.

---

## 11. Build roadmap (solo)

| Phase | Weeks | Ship | De-risks |
|---|---|---|---|
| **0 · Spike** | 1–2 | Menu bar app; AX observer on TextEdit + Notes; draw an underline at a hard-coded phrase's bounds | The hardest technical unknown: AX bounds + overlay alignment |
| **1 · Index + tags** | 3–5 | FSEvents indexer, text extraction, FTS5, embeddings; Course/Term/Type/Version facets with rules; Library view | Tag quality on *your own* files |
| **2 · Detector** | 6–7 | Phrase extraction (Foundation Models), anchor resolution, retrieval + rank + calibrate, card UI, Tab accept (Insert Link) | Precision ≥ 70% on a labeled set of your own phrases |
| **3 · Mail** | 8 | Missing-attachment trigger; attach via AX/pasteboard | Host-app integration |
| **4 · Safari extension** | 9–10 | Upload-field suggestions; native messaging | Web coverage |
| **5 · Onboarding** | 11–12 | O1–O8, coach marks, settings, pause, erase | Activation |
| **6 · Test & tune** | 13–14 | 6–8 user tests; tune thresholds and rate limits | Trust and creepiness |

**Biggest risks:**
1. AX inconsistency across apps. Start with Apple apps.
2. Overlay alignment on scroll and resize.
3. Classifier accuracy for Type. Start with rules plus a small model.
4. Notarization and permissions UX.

---

## 12. Decision log (quick reference)

| Decision | Alternative rejected | Psychological reason |
|---|---|---|
| Underline in place | Sidebar / panel (v3) | Proximity to cause; no attention switch; pull not push |
| Blue, not red | Red (Grammarly-style) | Red signals error and induces mild threat; this is help |
| Card on demand only | Auto-popup | Interruption cost; perceived control |
| Silent when unsure | "Did you mean…?" suggestions | False alarms erode trust faster than misses |
| One primary button | Multiple equal actions | Hick's law; decision fatigue |
| Auto tags with fixed facets | User-created tags / folders | People don't file (Whittaker 2011); the Photos model |
| Inline correction | Settings-only correction | Control in context; IKEA effect |
| Value before Accessibility permission | Ask all permissions upfront | Privacy calculus: concrete benefit before cost |
| One onboarding question (start term) | Full profile form | Recognition over recall; minimal investment, maximal unlock |
| Fading coach marks | Persistent hints / tutorial | Scaffolding should fade (Wood et al. 1976) |
| Never move files | Auto-archive / cleanup | Loss aversion; v1 test feedback |
| On-device only | Cloud index | Contextual integrity; trust |

---

## 13. References (verify before citing publicly)
- Brehm, J. W. (1966). *A Theory of Psychological Reactance.*
- Cowan, N. (2001). The magical number 4 in short-term memory. *Behavioral and Brain Sciences.*
- Csikszentmihalyi, M. (1990). *Flow.*
- Culnan, M. & Armstrong, P. (1999). Information privacy concerns, procedural fairness, and impersonal trust. *Organization Science.*
- Dumais, S. et al. (2003). Stuff I've Seen. *SIGIR.*
- Dzindolet, M. et al. (2003). The role of trust in automation reliance. *Int. J. Human-Computer Studies.*
- Elsweiler, D., Ruthven, I. & Jones, C. (2007). Towards memory supporting personal information management tools. *JASIST.*
- Chau, D. H., Myers, B. & Faulring, A. (2008). What to do when search fails: finding information by association (Feldspar). *CHI.*
- Green, D. & Swets, J. (1966). *Signal Detection Theory and Psychophysics.*
- Hick, W. E. (1952). On the rate of gain of information. *Quarterly J. of Experimental Psychology.*
- Iyengar, S. & Lepper, M. (2000). When choice is demotivating. *J. Personality and Social Psychology.*
- Johnson, E. & Goldstein, D. (2003). Do defaults save lives? *Science.*
- Kahneman, D. & Tversky, A. (1979). Prospect theory. *Econometrica.*
- Lee, J. & See, K. (2004). Trust in automation: designing for appropriate reliance. *Human Factors.*
- Maister, D. (1985). The psychology of waiting lines.
- Mark, G., Gudith, D. & Klocke, U. (2008). The cost of interrupted work. *CHI.*
- Nissenbaum, H. (2004). Privacy as contextual integrity. *Washington Law Review.*
- Norman, D. (1988). *The Design of Everyday Things.*
- Norton, M., Mochon, D. & Ariely, D. (2012). The IKEA effect. *J. Consumer Psychology.*
- Parasuraman, R. & Riley, V. (1997). Humans and automation: use, misuse, disuse, abuse. *Human Factors.*
- Pirolli, P. & Card, S. (1999). Information foraging. *Psychological Review.*
- Sweller, J. & Cooper, G. (1985). The use of worked examples. *Cognition and Instruction.*
- Tulving, E. & Thomson, D. (1973). Encoding specificity. *Psychological Review.*
- Weiser, M. & Brown, J. S. (1996). Designing calm technology. *PowerGrid Journal.*
- Whittaker, S., Matthews, T., Cerruti, J., Badenes, H. & Tang, J. (2011). Am I wasting my time organizing email? *CHI.*
- Wood, D., Bruner, J. & Ross, G. (1976). The role of tutoring in problem solving. *J. Child Psychology and Psychiatry.*
- Yantis, S. & Jonides, J. (1984). Abrupt visual onsets and selective attention. *J. Experimental Psychology: HPP.*

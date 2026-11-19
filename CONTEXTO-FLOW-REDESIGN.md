# Contexto · Flow Redesign: Invisible by Default
*Nov 2026 · supersedes the v2.0/v2.1 prototype flow. Companion to CONTEXTO-PRODUCT-SPEC.md.*

> **Feedback on v2.1:** "It looks AI and the flow looks confusing."
> **Diagnosis:** the prototype *performed* intelligence. It had sparkles, gradient buttons, a glowing halo, a "Suggested for this application" banner, 3 notifications, and a separate Constellation destination. Every one of those is a new thing to read, so the agent got louder than the task.
> **Reframe:** the best version of Contexto looks like **macOS already knew.** The right file is the default; everything else stays quiet until it's needed.

---

## 1. Method (how this was rethought)

1. **Start from the moment, not the feature.** What is Maya doing, second by second, when it matters?
2. **Separate needs from wants.** Needs decide the default; wants decide what's one click away.
3. **List every test case before designing,** including the ones where Contexto should do *nothing.*
4. **Price the mistakes.** A wrong suggestion costs more than no suggestion.
5. **Remove until it breaks,** then add back the one thing that fixes it.

---

## 2. The moment

| Second | Maya's reality | What she needs |
|---|---|---|
| 0 | Clicks **Attach résumé** on a posting, mid-application, mildly stressed | The picker to open somewhere useful |
| 1–3 | Scans 11 near-identical filenames | **The right one, obvious, already selected** |
| 3–5 | Hesitates: "is this the newest one?" | **Quiet proof** (sent where, edited when) without opening it |
| 5 | Presses **Upload** | Nothing in the way |
| Later | "Which résumé did I send Figma?" | An answer in one search |
| Much later | 11 versions keep cluttering every picker | Old ones to **stop showing up**, with nothing deleted |

The **irreversible step is Upload.** Once it's sent, it's sent. So protection has to happen *in the picker*, before that click. A notification afterward is too late to help.

---

## 3. Needs vs. wants

| | Needs (must be the default) | Wants (one click away) |
|---|---|---|
| **Find** | The right version, preselected | Why it was chosen |
| **Trust** | Never auto-upload; never move files | To see what Contexto knows |
| **Safety** | A heads-up *before* sending the wrong version | To override it without nagging |
| **Memory** | "What did I send to X?" answered later | A view of everything related |
| **Calm** | No new app, no new notifications, no new vocabulary | To tidy old versions when *she* chooses |
| **Privacy** | Works without uploading anything | Control over which signals are used |

---

## 4. Test cases

| # | Situation | What Contexto does | Why |
|---|---|---|---|
| T1 | **High confidence:** one clear match (PM posting, newest PM résumé) | Picker opens with it **preselected** under *Suggested*; Return uploads | Correct action = default action |
| T2 | **Two good options:** hybrid posting (PM + design) | Shows both under *Suggested*, **selects neither**; caption "Two résumés match this posting." | Never fake confidence |
| T3 | **One résumé total** | **Nothing.** The standard picker, sorted by Recents | Invisible when there's no problem |
| T4 | Picks an **outdated** version | One line in the picker's status bar: "Older version. Replaced by Resume_PM_Fall26 on Oct 30." **Use Newer** | Protect *before* the irreversible step; one line, no modal |
| T5 | Picks a **current but mismatched** version (design résumé for PM role) | Same status line, softer: "This version is for design roles." | Inform, don't block; she may know better |
| T6 | Ignores the warning on purpose | Uploads normally. If she overrides on the same site twice, it stops flagging there | Respect intent; learn quietly |
| T7 | No calendar access / signal turned off | Still works from file history alone; never asks for more access mid-task | Graceful degradation |
| T8 | Not a résumé upload (photo, PDF for class) | Nothing | Scope discipline |
| T9 | File is in iCloud, not downloaded | Suggestion still shown; downloads on Upload with system progress | Matches system behavior |
| T10 | "Which one did I send Figma?" (a week later) | Spotlight result shows **"Sent to Figma · Nov 18"** | Answer when asked, never before |
| T11 | Old versions cluttering | In Finder's preview pane: "4 older versions · not opened since May" → **Stop Suggesting** | Her choice, her timing; files never move |
| T12 | Keyboard / VoiceOver | Suggested row is selected and focused; VoiceOver: "Suggested. Resume_PM_Fall26. Sent to Linear and Ramp." | Accessibility is the same path, not a separate one |

---

## 5. Pricing mistakes

| Error | Cost to Maya | Design response |
|---|---|---|
| Suggests the **wrong** file and she uploads it | **High** (lost opportunity) | Preselect only above a high-confidence bar (T1); otherwise show options (T2) or nothing (T3) |
| Suggests nothing when it could have | Low (today's Mac) | Acceptable |
| Interrupts her (notification, modal) | Medium (stress, distrust) | **Zero notifications** in this flow |
| Moves or hides a file she needed | High (trust broken) | Never move; "Stop Suggesting" only affects suggestions |

---

## 6. Principles (the cut list)

1. **The best suggestion looks like a default.** Preselect it. No banner.
2. **Be quiet when unsure.** Two options or none, never a confident guess.
3. **Protect before it's irreversible.** Warn in the picker, not after.
4. **Answer later, not now.** History shows up where she'll search (Spotlight, Finder info), not in a notification.
5. **No new places.** Picker, Spotlight, Finder's preview pane. No new app, no new sidebar section.
6. **No AI costume.** No sparkles, no gradients, no glow, no "AI" copy. System type, system blue, system materials. The word *Contexto* appears only where it's accountable: the *Why* popover and Settings.

---

## 7. What changed from v2.1

| v2.1 | Now | Reason |
|---|---|---|
| "Suggested for this application" banner card with ✦ | A **Suggested** group header + preselected row | Same information, zero new UI |
| "Why this?" button | ⓘ on the row → small native popover | Available, not advertised |
| Yellow warning card | One status-bar line + **Use Newer** | Proportional to the risk |
| 3 notifications | **None** | Notifications are for things that can't wait |
| Auto-built applications table | "Sent To" section in Finder's preview pane + Spotlight subtitle | Answers live where she looks |
| Archive proposal pill | **Stop Suggesting** in preview pane | Nothing moves; reversible |
| Constellation as a destination with glow | **Show Related** from a file, neutral styling | Secondary tool, reached from a file |
| Contexto sidebar section | Removed (one smart folder: *Job Search*) | No new vocabulary |
| Indigo→teal brand gradient | Removed from the UI | It was the "AI" tell |

---

## 8. The flow (three tasks, also the user-test script)

**Task 1 · Apply.** "Attach your résumé and submit the Figma application."
Attach → picker opens on **Recents** with *Suggested: Resume_PM_Fall26.pdf* selected (secondary line: *Sent to Linear and Ramp · Edited Oct 30*) → **Upload** → Submit.
*Variants:* T2 (two options), T3 (one résumé), T4/T5 (pick the wrong one).

**Task 2 · Remember.** "A week later: which résumé did you send Figma?"
⌘Space → "figma resume" → top hit *Resume_PM_Fall26.pdf* · **Sent to Figma · Nov 18**.

**Task 3 · Tidy.** "Stop old versions from showing up."
Open the file → Finder preview pane: **Sent To** (Figma, Ramp, Linear) · **Older Versions** (4, not opened since May) → **Stop Suggesting**. Optional: **Show Related**.

**Success measures** (unchanged from spec §11, plus):
- T1 completed with **no reading**: Upload within 5 s, no hover on ⓘ (shows trust in the default)
- T4 caught **before** Upload ≥ 90%
- Zero participants describe it as "the AI" unprompted (measures invisibility)

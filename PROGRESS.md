# Progress — Direction A (Bao-led)

Branch: `design/direction-a`. All styling lives in `direction-a.css` (remove its `<link>` to revert); structural edits are in `app-v13.jsx`. Rebuild with `cd tools && npm run build`.

### Milestone 1.0 — Design contract with strict inspiration hierarchy
- What changed: Rewrote DESIGN.md around the ranked hierarchy (Bao > Brandon > Airla > Lazim > Megan), with Direction A/B split, tokens, card spec and a 10-rule never list. Created CHECKLIST.md and this log.
- Primary inspiration used: Bao
- Why this is better: Every later change has one tiebreaker, so decisions stop drifting toward an average of five sites.
- Anti-slop decision: Explicit "conflict rule": higher rank wins outright, no blending.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

### Milestone 1.1 — Foundation: Bao paper/ink, Airla grotesk, Brandon mono
- What changed: Added `direction-a.css` (linked last on index/About/Play). Page + sidebar on Bao's `#F5F1EC`, all text on his warm ink `#2A2520` tiers. Instrument Serif/Sans and Satoshi replaced by Hanken Grotesk everywhere; Fragment Mono for nav, sub-title, tags. Name set in Hanken 500 / 30px / -0.035em.
- Primary inspiration used: Bao (color), Airla (grotesk + tight tracking), Brandon (mono meta)
- Why this is better: The serif name + three sans families read as "tasteful template". One grotesk + one mono gives the crisp, single-voice feel Bao and Airla have, and the name becomes the one big thing (Brandon).
- Anti-slop decision: Dropped the Instrument Serif/Instrument Sans pair (the default AI-portfolio pairing) and cooled the blue-gray ink to Bao's warm near-black instead of averaging colors.
- Risk: Low (one stylesheet; retargets existing CSS variables)
- Status: ✅ Done
- Review: [ ]

### Milestone 1.2 — Sidebar becomes Bao's plain column
- What changed: Sidebar panel color + right border removed (same paper as page). NOW carousel (glass card, pulsing dot, 1/3 counter, typewriter blur) replaced by a static "Currently" list in the sidebar, using the existing three phrases verbatim. Nav is one row of mono caps text (WORK ABOUT PLAY RESUME), no pill, no arrows; active = ink, rest = ink-3. Social icons shrunk to 15px thin strokes, no boxes. Intro keywords kept but turned into Bao's regular-weight colored nouns (moss + clay), no glow.
- Primary inspiration used: Bao (sidebar on /work, "Recently, I've been:" list, text nav), Brandon (mono caps nav)
- Why this is better: The sidebar went from four competing UI objects (glass nav pill, icon boxes, NOW widget, bold highlights) to text only. Work is now the first thing in the content column.
- Anti-slop decision: Killed the rotating status widget entirely instead of restyling it; carousels/tickers are the most "AI portfolio" pattern on the page.
- Risk: Low (JSX: moved status into sidebar, removed `<NowToast/>` from main; NowToast component left in file, unused)
- Status: ✅ Done
- Review: [ ]

### Milestone 1.3 — Work grid rows align
- What changed: Two independent flex columns (masonry) replaced by one CSS grid (`.da-grid`), same visual order: ASUS, Notability / Contexto, Partake. Row gap 48px, column gap 24px, content padding 40px. 3 columns ≥ 1600px, 1 column < 720px.
- Primary inspiration used: Bao (/work grid)
- Why this is better: Second-row cards were offset ~20px because ASUS has a 2-line description. Now every title sits on one baseline per row, which is most of what makes Bao's grid feel crisp.
- Anti-slop decision: No masonry stagger for four items; strict rows.
- Risk: Low (JSX: one grid instead of two columns; data arrays untouched)
- Status: ✅ Done
- Review: [ ]

### Milestone 1.4 — Cards get Bao's flat frame + text meta
- What changed: Removed the glass rim/inner highlight/shadow on every card plate (radius 8px, flat). Tags are no longer gray chips: 10px Fragment Mono caps in ink-3, joined with " · ", right-aligned on the title baseline. Title 16px/500/-0.015em ink; description 13.5px ink-2, max 58ch. Focus ring = 2px moss on the frame; all hover lift/scale/shadow neutralised.
- Primary inspiration used: Bao (card caption row: title left, tiny tags right, gray description)
- Why this is better: Chips + glass edges made each card look like a UI kit component. Text-only meta lets the artwork carry the card, and the title/tag baseline gives the crisp line Bao has.
- Anti-slop decision: No pills, no hover lift/shadow; caption is typography only.
- Risk: Low (CSS only)
- Status: ✅ Done
- Review: [ ]

### Milestone 1.5 — Flat paper (page grain removed)
- What changed: Disabled the fixed full-page SVG noise overlay (`body::before`, 34% opacity) on Direction A pages.
- Primary inspiration used: Bao (flat #F5F1EC ground)
- Why this is better: The grain made the paper look muddy and slightly gray next to the screenshots. Flat paper is what gives Bao's page its "refreshing" crispness.
- Anti-slop decision: Removed a texture effect rather than tuning it; film grain overlays are a common AI-portfolio tell.
- Risk: Low (CSS only)
- Status: ✅ Done
- Review: [ ]

### Milestone 1.6 — ASUS cover: flat frame + ink lockup
- What changed: On the homepage card, hid the lava-lamp gradient, bloom, vignette, grain and sheen layers of the ASUS cover; the lockup now sits at 38% width in ink on Bao's flat frame color, static.
- Primary inspiration used: Bao (light flat frames)
- Why this is better: It was the single most "AI-generated" element on the page (glowing logo on a blurred gradient). Now it matches the other frames and reads as a quiet, honest placeholder for in-progress work.
- Anti-slop decision: No gradient, no glow. Interim only: a real ASUS artifact (research board, prototype frame) should replace it when shareable.
- Risk: Low (CSS only; the cover component and its case-study use are untouched)
- Status: ✅ Done
- Review: [ ]

### Milestone 1.7 — Mobile check + no divider line
- What changed: Verified homepage at a true 390px viewport (iframe; headless Chrome's own min window width had produced a false overflow). Layout holds: sidebar stacks, 1-column cards, tags fit. Added a defensive `min-width:0` on grid items and wrap for the caption on small screens. Removed the 1px rule under the stacked sidebar on mobile.
- Primary inspiration used: Bao (sections separated by space, not lines)
- Why this is better: One less line on mobile; the work starts after whitespace like on desktop.
- Anti-slop decision: Space instead of dividers.
- Risk: Low (CSS only)
- Status: ✅ Done
- Review: [ ]

### Milestone 1.8 — Play page joins the system
- What changed: Play filter pills (glass active pill, 16px) became Bao-/art-style category text: 11px Fragment Mono caps, active = ink, others ink-3. Play cards: radius 16 → 8, shadow and hover lift removed, flat frame color; title/subtitle use the homepage card type spec. Top padding removed so the first row sits at the same 40px line as the homepage grid.
- Primary inspiration used: Bao (/art category list + flat frames)
- Why this is better: Play no longer looks like a different site. Same frame, same caption, same nav voice as Work.
- Anti-slop decision: No pill filter tabs.
- Risk: Low (CSS only). Note: the Sand thumbnail renders blank in headless capture before and after this change (live embed); unrelated.
- Status: ✅ Done
- Review: [ ]

### Milestone 1.9 — Sub-title breaks on purpose
- What changed: "CogSci & Data Science @ UC Berkeley" now breaks deliberately before "@" on desktop (one line on mobile). Wording unchanged.
- Primary inspiration used: Brandon (clean, intentional meta line)
- Why this is better: The browser was breaking it as "… @ UC / BERKELEY" or "DATA / SCIENCE …", which looked accidental.
- Anti-slop decision: Controlled line break instead of letting the layout decide.
- Risk: Low (one `<br />` in app-v13.jsx, hidden < 900px)
- Status: ✅ Done
- Review: [ ]

### Milestone 1.10 — About: one big thing, small headings
- What changed: "Hi, I'm Sophia!" 52px → 30px/500/-0.035em (same spec as the sidebar name). Section heads (My Communities, clancystuff, Interests) 38px → 20px/500. Community names 28px → 18px/500 so they sit below section heads. Body 17–18px → 15.5px ink-2; labels to mono.
- Primary inspiration used: Brandon (one dominant element), Bao (small, quiet About page)
- Why this is better: The About page had three competing display sizes. Now the hierarchy reads name → section → item → body, all within the Bao scale.
- Anti-slop decision: No oversized "Hi, I'm…" hero, the most common AI-portfolio About opener treatment.
- Risk: Low (CSS only; no About copy changed)
- Status: ✅ Done
- Review: [ ]

### Milestone 1.11 — Contexto thumbnail on a light frame
- What changed: Contexto's animated Finder thumbnail moved from a saturated navy stage (`#0f2545`) with a heavy drop shadow to Bao's frame color `#ECE7E0` with a 1px `#E0DBD4` hairline around the window. Two values in `Contexto Finder Thumb.html`; the wrapper in `contextoflowcover.jsx` uses `var(--da-frame)` with the old navy as fallback.
- Primary inspiration used: Bao (light UI inset on light frame, 1px border, no shadow)
- Why this is better: Three of four covers now share one frame language, so the grid reads as one body of work; Partake's green campaign art becomes the single deliberate accent.
- Anti-slop decision: Hairline instead of floating drop shadow.
- Risk: Low (revert = restore `--ink:#0f2545` and the old box-shadow)
- Status: ✅ Done
- Review: [ ]

---

## Needs Sophia (can't be done autonomously)
- **ASUS cover**: currently an ink lockup on a flat frame (1.6). Replace with a real, shareable artifact (research board, prototype frame) when possible.
- **About › My Communities**: polaroids are still placeholders ("bi-1.jpg… Add a caption"). Needs real photos + captions.
- **Sand thumbnail (Play)**: renders blank in headless capture; check in a real browser.

## Next up (Direction A loop)
1. ✅ Done in Milestone 10.0: case-study page (`CaseStudy.html`) moved to Direction A type and colors.
2. Footer: pixel-tree band + one-line colophon so the homepage ends deliberately.
3. Notability cover: its pale-blue wash is the last pastel field; test it on the frame color.

### Milestone 1.12 — Fix: WORK link when previewing locally
- What changed: WORK (sidebar) and the case-study home mark linked to `./`, which opens a folder listing when the site is viewed as local files. They now use `index.html` under `file://` and keep `./` on the live site.
- Primary inspiration used: n/a (bug fix)
- Why this is better: Local review works end to end; live URLs unchanged.
- Anti-slop decision: n/a
- Risk: Low (app-v13.jsx, casestudy-v13.jsx)
- Status: ✅ Done
- Review: [ ]

---
# Round 2 — after Sophia's review ("flat, soulless", "nav should be vertical")

### Milestone 2.0 — Fix: Back / Home buttons on case studies when previewing locally
- What changed: All case-study "Back", "Home", "work" and Escape-to-close links used `./#work`, which opens a folder listing from local files. They now use `index.html#work` locally and `./#work` live (`HOMEW` in casestudy-v13/v15.jsx). The case-study background iframe got the same fix.
- Primary inspiration used: n/a (bug fix)
- Why this is better: Local review no longer dead-ends.
- Anti-slop decision: n/a
- Risk: Low
- Status: ✅ Done
- Review: [ ]

### Milestone 2.1 — Navigation stacked vertically
- What changed: WORK / ABOUT / PLAY / RESUME back to a vertical list, 11.5px mono caps; active item in ink with a small moss dot to its left.
- Primary inspiration used: Sophia's direction; Bao's quiet caps for the type
- Why this is better: Reads top-to-bottom with the rest of the sidebar instead of a cramped row.
- Anti-slop decision: Dot marker instead of a glass pill for the active page.
- Risk: Low (CSS)
- Status: ✅ Done
- Review: [ ]

### Milestone 2.2 — Sidebar text in ink, not gray
- What changed: Bio sentence and "Currently" list raised from gray to ~80% ink.
- Primary inspiration used: Bao (his intro copy is near-black)
- Why this is better: Round 1 made too much text gray, which read as washed-out and lifeless.
- Anti-slop decision: Contrast instead of decoration.
- Risk: Low (CSS)
- Status: ✅ Done
- Review: [ ]

### Milestone 2.3 — Bao's frame + inset screen + chips + hover label
- What changed: Card frames are soft gray with an inner glow; each project image is inset 9% with 6px corners and a thin bezel, like Bao's screenshots. Tags are Bao-style soft chips again (black 4% fill). Title black/90 and fades on hover; frame darkens; a frosted "View case study →" label appears bottom-right (real element `.da-view`, not a pseudo-element, to avoid old glass rules).
- Primary inspiration used: Bao (observed at 2x: frame glow, bezel, chips, hover icons)
- Why this is better: Round 1's flat frames + text tags removed the depth that makes Bao's cards feel crafted. This restores it using his actual treatment.
- Anti-slop decision: Depth from one consistent frame system, not per-card effects; no lift/tilt/glow.
- Risk: Low (CSS + one span in app-v13.jsx)
- Status: ✅ Done
- Review: [ ]

### Milestone 2.4 — ASUS uses Sophia's own paper cover
- What changed: Replaced the bare ink lockup (1.6) with `assets/asus-proart-cover2.png` (navy lockup on paper with dot grid and soft green/blue corners), inset like the other screens.
- Primary inspiration used: Bao (inset screens) + Sophia's existing art
- Why this is better: Has character and matches the paper palette; no glowing gradient.
- Anti-slop decision: Uses her made asset, not a generated effect.
- Risk: Low (CSS)
- Status: ✅ Done
- Review: [ ]

### Milestone 2.5 — Contexto back to navy (reverts 1.11)
- What changed: Restored the thumbnail's original navy stage and shadow.
- Primary inspiration used: Bao (screens with real, vivid content inside a neutral frame)
- Why this is better: With the new inset bezel, a light stage made a frame-inside-a-frame. Navy reads as a lit screen, like Partake's green.
- Anti-slop decision: Reverted my own change instead of stacking another fix on it.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

### Milestone 2.6 — Plain-language DESIGN.md + versions gallery
- What changed: DESIGN.md rewritten as 8 plain principles, each traceable to Bao's page. Screenshots of every version saved to `~/git/portfolio-design-versions/` (open `index.html` there).
- Primary inspiration used: Bao
- Why this is better: Round-1 rules were abstract and some contradicted Bao (e.g., "no chips").
- Anti-slop decision: Rules describe observed decisions, not generic taste.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

---
# Round 3 — card hover, matched to Bao's actual markup

### Milestone 3.1 — Bao's hover: arrow, tool squares, title fade, press, edge glints
- What changed: Read Bao's card HTML directly. Implemented his exact values: white ↗ arrow (2.5 stroke, drop shadow) fades in top-right; frosted 28px tool squares (white/30, blur, white/20 border) fade in bottom-right when a card has `tools`; title 90% → 70% black; description black/50; card scales to 0.985 on press (150ms); always-on glass-edge glints (thin blurred white lines top and bottom, soft white glows in three corners). Removed my round-2 "View case study →" label and the frame-darken on hover (Bao doesn't do either).
- Primary inspiration used: Bao (values copied from his markup)
- Why this is better: Round 2 guessed at his hover; this is his hover.
- Anti-slop decision: Replaced my invented label with his real pattern instead of keeping both.
- Risk: Low (CSS + a few spans in app-v13.jsx Card)
- Status: ✅ Done
- Review: [ ]
- Waiting on Sophia: hover videos (his main effect) and tool lists per project.

## Round 4 — bubble frames, scenes, sidebar (Sophia's screenshots of Bao's cards)

### Milestone 4.1 — Glassy "bubble" frames
- What changed: Frames are 16px-rounded with a thick glassy bezel: a light highlight on top, shade on the bottom, and a frosted 14px rim (`.da-rim`, backdrop blur). The screen sits inside with a tinted 3px bezel and a soft drop shadow.
- Primary inspiration used: Bao (Scraps / DemoStudio / Zen / chords cards)
- Why this is better: The cards now feel like objects instead of gray boxes, which is what Sophia liked.
- Anti-slop decision: No outer glow and no lift. All the depth is inside the frame.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

### Milestone 4.2 — A scene behind every screen
- What changed: Each project gets its own frame background:
  - ASUS: warm dusk sand.
  - Notability: sky with soft clouds.
  - Contexto: Sophia's own macOS wallpaper. The Finder thumbnail now sits on that wallpaper, not on navy.
  - Partake: dusty rose.
- Primary inspiration used: Bao
- Why this is better: The color now comes from the work, and each card is recognizable at a glance.
- Anti-slop decision: Each scene is tied to its project, with no generic purple gradients. Each one is a single CSS rule (`.sc-<id>`), so it can be swapped for a photo later.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

### Milestone 4.3 — Sidebar hierarchy and spacing
- What changed: The sidebar now uses one font (sans) and no small caps. There are 3 levels:
  - name (28px)
  - body (15px ink)
  - meta (14px at 50% gray), used for the school line and "Currently"
  
  Nav items are 15px sans in sentence case. Spacing follows one rhythm: 8px (name to school), 24px (between groups), 40px (before the nav). The dashes before the "Currently" items are gone.
- Primary inspiration used: Bao (sidebar), Brandon (hierarchy)
- Why this is better: Before, there were 4 competing styles: serif-like name, mono caps, body text and mono caps again. Now there's a clear top-to-bottom read.
- Anti-slop decision: No decorative labels. Gray text means meta and ink means content.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

## Round 5 — case-study covers (Brandon-style full view + mixed view, inside Bao's frame)

### Milestone 5.1 — Contexto cover
- What changed: The inner "screen" box is removed for Contexto. Sophia's macOS wallpaper now fills the whole frame, with two pieces of the software on top of it:
  - the Constellation Finder window (top right)
  - the Spotlight "math" panel overlapping it (bottom left)
  
  Both were cropped from her own mockups. The originals are untouched, and the crops are `assets/contexto/cover-*.png/.webp`. This replaces the animated Finder iframe on the home card only; the `ContextoFlowCover` component still exists.
- Primary inspiration used: Brandon (full view and mixed view), framed with Bao's bubble rim
- Why this is better: It shows the real product at a readable size and tells the story (map of your work plus contextual search) in one glance.
- Anti-slop decision: No device mockups, fake browser chrome or floating stickers. These are just the real windows on the real desktop.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

### Milestone 5.2 — ASUS cover: glass lens
- What changed: The ASUS card is now a full-bleed soft pastel field: white with mint at the top right, blush at the bottom left and lavender at the bottom right, plus fine grain. In the center, a single frosted-glass pill holds the white ASUS ProArt lockup. The pill has a highlight on its top edge and a soft lavender shadow. Everything is CSS plus the existing lockup PNG. The old `AsusCover` is no longer used on the home card.
- Primary inspiration used: Sophia's reference (Apple card with a glass disc), kept inside Bao's frame
- Why this is better: It's premium and quiet, and it works while the real ASUS work can't be shown yet.
- Anti-slop decision: The pill shape fits the wide lockup; a circle would have squeezed it. It's one object with no extra sparkles or orbs.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

### Milestone 5.3 — Notability: one screen on the sky
- What changed: Removed the double square (sky frame, then pale box, then app window). The app window is cropped out of the cover art (`assets/thumbs/notability-window.png/.webp`) and now sits directly on the sky. It's 82% wide, centered, with a thin slate bezel and a soft shadow. The sky got more cloud contrast. The old floating pills and the `nb-cover` are no longer used on the home card.
- Primary inspiration used: Bao (Scraps card)
- Why this is better: There's one frame and one screen, and the UI is about 1.5× larger and readable.
- Anti-slop decision: The decorative pills were dropped and the real UI does the talking.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

### Milestone 5.2c — ASUS in muted gem tones
- What changed: Pastels were replaced with muted gem tones: an amethyst base, jade at the top right, garnet at the bottom left and sapphire at the bottom right. The grain uses overlay blending. The glass lens is clearer, with a deeper shadow.
- Primary inspiration used: Sophia's direction ("more gem tones or muted")
- Why this is better: It's richer and more confident, and the white lockup now has real contrast.
- Anti-slop decision: The colors are dusty and desaturated, never neon.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

### Milestone 5.2d — ASUS led by green + blue
- What changed: The ASUS cover is now jade green at the top left and sapphire blue at the bottom right, with deep teal in the bottom-left corner and a lighter steel blue in the top-right corner. The purple and red are gone.
- Primary inspiration used: Sophia's direction ("the main colors are green and blue")
- Why this is better: It matches what she asked for and ties back to the green/blue of the original ASUS cover.
- Anti-slop decision: The colors stay muted.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

### Milestone 5.2e — ASUS: green + blue, shiny again
- What changed: The green/blue palette is lighter and more luminous:
  - a mint-white glow at the top left, flowing into jade, then steel blue, then sapphire
  - two diagonal satin sheen bands (soft-light)
  - a soft glow behind the lens
  
  The lens is glassier: a brighter top highlight, a reflection along the bottom edge and a backdrop with more saturation and brightness. The logo shadow is deeper so the white lockup stays readable.
- Primary inspiration used: Sophia's reference (the pastel version she called beautiful and shiny), in her green + blue
- Why this is better: It brings back the light, glassy quality of 5.2 while keeping the brand colors.
- Anti-slop decision: The sheen is subtle and static. Nothing moves.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

## Phase 0 — Notability clickable prototype (`prototypes/notability/`)

### Milestone P0.1 — First clickable build (8 screens)
- What changed:
  - Built a standalone prototype (plain HTML/CSS/JS, no build step; it opens from the folder), styled after the real Notability screens:
    1. Note
    2. Learn entry
    3. 3-question first-time setup
    4. Topic suggestions with "why" reasons
    5. Plan with the **AI goals ↔ To-do list** toggle, plus typed goals, inline edit and remove
    6. Focus: timer, length chips, silence-other-apps with held notifications, collapse to sidebar widget
    7. Quiet completion moment
    8. Progress summary with a suggested next session
  - Added `?` screen jumper, `Esc` back and `#screen` deep links.
  - Added `TEST.md` with 5 tasks.
- Primary inspiration used: Notability's own UI (ss-*.png); Bao/Zen's "show the product working"
- Why this is better: The case study can show a real, testable product instead of static mocks.
- Anti-slop decision: No points, badges or streaks, and no animations until after Sophia's test round.
- Risk: Low (separate folder; nothing else touched)
- Status: ✅ Done, waiting on Sophia's test notes
- Review: [ ]

### Milestone P0.2 — Rebuilt on the team's real Figma UI
- What changed:
  - Replaced the invented UI with an exact rebuild of the team's frames (`ref/`): note view, Goals (AI ↔ list toggle, ••• cards), "Great Goals!" ready screen, and the Outline session with + chapters and the Timer.
  - The toolbars, icons, AI sparkle and mascot are cropped from the frames, so they're pixel-exact. Layout was measured from the frames at 0.6536×.
  - New screens built in the same system: Focus (timer, silence, collapse), sidebar widget, "Goals met!", Today's progress.
  - Improvements: the placeholder "AI-generated microtask" and chapter text were replaced with real content; added ••• actions (Edit, Why this goal?, Suggest another, Delete), an "Ask for a different goal" field, a Timer popover, and held notifications.
- Primary inspiration used: the team's Figma (Notability × Berkeley Innovation)
- Why this is better: It's the real product Sophia's team designed, now clickable end to end.
- Anti-slop decision: No invented visual language. Every new screen reuses the frames' type, borders, blue and band.
- Risk: Low
- Status: ✅ Done, waiting on test notes and Figma access for the remaining frames
- Review: [ ]

### Milestone P0.3 — Rebuilt from the Figma file (Final Hi-fi › Combined)
- What changed:
  - Connected to the team's Figma and pulled every Study Session frame (about 45), its type and color styles, and the original vector assets: mascots, confetti, icons, and the toolbars at 2×.
  - Rebuilt all 6 flows: Entry → Selecting Content → AI-assisted goals (typed and manual) → Setting a Timer → In Progress → Ending.
  - Fonts are Proxima Soft and Moranga, exactly as in the file. Tokens: accent `#4278FF`, fg1 `#171A20`, fg2 `#444F60`, bg2 `#F6F6F8`, accent container `#ECF2FF`, cards with a 0.5px `#898989` border and 8px radius.
- Primary inspiration used: the team's own Figma (Notability × Berkeley Innovation)
- Why this is better: It's the real product, fully clickable, at Figma fidelity.
- Anti-slop decision: No invented UI. The only changes are real content where Figma had placeholders, plus working timers and goals.
- Risk: Low (separate folder). Note: Proxima Soft and Moranga load from Sophia's Mac. Embedding on the live site needs web licenses or screenshot exports.
- Status: ✅ Done, waiting on test notes
- Review: [ ]

### Milestone P0.4 — Onboarding survey + Learn Profile, with motion
- What changed:
  - Added the Figma "Profile Personalization" flows (onboarding survey and Learn profile), improved.
  - Added motion matching the team's flow videos: scrim fade, modal lift, progress fills, orange check pops, staggered content, the blue band rising, a mascot pop, confetti, count-ups. It plays only on change and respects reduced motion.
  - **Survey improvements:**
    - Removed the duplicate chip.
    - "Other" really lets you type.
    - Enforced "up to 3" with a counter and a shake.
    - The struggles question is marked optional and private.
    - Q3 cards explain each option.
    - Loading shows what Learn is doing.
    - The finish screen lists exactly what changes, and answers actually change the session: goal-setting difficulty → AI goals by default; focus or burnout → shorter timer.
  - **Profile improvements:**
    - Chips and AI Overview are generated from the answers, with the source shown.
    - "Sounds like me / Not quite" feedback, with a path to update.
    - A privacy switch for struggles.
    - "How Learn adapts to you."
    - "Day streak" replaced with "Concepts reviewed", and "Evidence of progress" (before → after) added. Research: streaks created pressure; students wanted evidence of progress.
- Primary inspiration used: team Figma + Cheyenne's flow recordings
- Risk: Low
- Status: ✅ Done, waiting on test notes
- Review: [ ]

## Round 6 — Notability case study (Bao methodology)

### Milestone 6.1 — `Notability.html`: hero case study with live demos
- What changed: Built a new case study in Bao's shell: left rail + dot TOC, eyebrow → H2 → 40px rhythm, core-concept rail, meta grid, link card, Try-it card. It has 17 sections:
  - Meet Learn, Brief, Strategy (competitive analysis, positioning map, 3 strategic bets), Research (85/15/5/5)
  - Synthesis (FigJam affinity map, themes, personas), Reframe (tab panel + struck-through HMW), Ideation (Crazy 8's, impact/effort FigJam)
  - Core loop strip, 4 feature deep-dives, each with a **live self-playing prototype** and "Why…?" decision cards
  - Motion section (hover interaction cards + motion system table), Outcome, Reflections

  The prototype gained `?embed&tour=` modes that auto-play each flow and hand over control on tap. The home card now links here.
- Primary inspiration used: Bao (NotetakingLM structure + Zen Editor interactive components)
- Why this is better: Every decision is shown working and tied to a research source, so the reader sees the evidence → decision → interaction chain.
- Anti-slop decision: No invented metrics. Copy comes from the team deck (verbatim insights, quotes, persona text). The positioning map is labeled as a hypothesis, and the Study Timer note avoids implying causation.
- Risk: Medium. Fonts in the iframes rely on locally installed Proxima Soft/Moranga; on other machines they fall back.
- Status: ✅ Done
- Review: [ ]

### Milestone 6.2 — Notability visual layer
- What changed: Replaced text-heavy blocks with components in Notability's own visual language:
  - Learn-style blue tiles with icons (features, market patterns, research methods)
  - "Awesome Work"-style colored badge boxes (stats, asks, strategic bets, diary findings, prototype decisions)
  - FigJam sticky notes for the emerging themes
  - speech-bubble quotes, numbered insight boxes, and persona cards (needs / pain points)
  - a mascot definition callout, a NotebookLM-vs-gap compare box, and boxed "Why?" decision cards with source chips
  - colored reflection numbers
- Primary inspiration used: the Notability product UI (Study Options tiles, progress badges) + the team's FigJam
- Why this is better: Scannable at a glance, and the page now looks like the product it describes.
- Risk: Low
- Status: ✅ Done
- Review: [ ]

### Milestone 6.3 — Leaner structure (Rachel Chen model)
- What changed: Cut the case study to what shows impact, thought process, and decisions:
  - Overview → Problem → My Role → What We Found → Reframe → Strategy → Exploration → Key Decisions (4) → Solution → Impact & Reflection → Try It.
  - Removed: Motion, Focus, Meet Learn detail, research-method tiles, positioning map, personas, long decision grids.
  - Copy is 1–2 sentences per point. Decisions are a bold claim beside a live demo, alternating sides.
- Primary inspiration used: Rachel Chen (Notion case study), within Bao's shell
- Status: ✅ Done
- Review: [ ]

### Milestone 6.4 — Live Notability card + lighter hero
- What changed:
  - The home card's Notability cover is now the real prototype (an iframe) on the sky scene. It rests on the "Goals for Today's Study Session" screen and plays the full tour on hover or focus. It returns to rest on mouse-out (postMessage play/rest), and stays still under reduced motion.
  - The case-study hero frame is now soft paper (#f6f6f4) with subtle grain instead of the dark sky.
- Primary inspiration used: Bao (hover reveals motion) + Sophia's paper texture reference
- Status: ✅ Done
- Review: [ ]

### Milestone 7.0 — Geist type + Bao ink
- What changed: Hanken Grotesk was replaced site-wide with Geist (closest free match to Bao's PP Mori; self-hosted by the build). Text now uses Bao-style soft near-black opacities (headings 88–90%, body 60–70%, meta 45%).
- Status: ✅ Done
- Review: [ ]

### Milestone 7.3 — ASUS: password-protected preview
- What changed:
  - `ASUS.html` is now a minimal, type-led preview in the Rachel / Michelle / Bao style. No boxes, no prototypes.
  - Sections: hero ("AI that knows when to step back."), "Coming December 2026" pill, HMW, a role list (oversee sprint leads, pick direction, client relationship, narrow scope), a sprint timeline (Prototyping = now), two early signals, and a "coming December" close.
  - Content is AES-GCM encrypted (PBKDF2 250k iterations) and unlocked in the browser. The plaintext source lives outside the repo at `~/git/portfolio-private/`.
  - Re-encrypt with `PW='…' node encrypt.mjs asus-preview.html ../sophia-clancy-portfolio/ASUS.html`.
  - The home card shows a lock and a "Coming Dec" tag.
- Status: ✅ Done (temporary password: proart2026)
- Review: [ ]

## 8.0 Contexto v2 (Nov 17, 2026)
- CONTEXTO-PRODUCT-SPEC.md (full spec, macOS 26 kit measurements) + CONTEXTO-COMPETITIVE.md (landscape, matrix, 2×2, teardowns)
- prototypes/contexto/: Flow A "right résumé" — Safari upload → open-panel suggestion + Why this? → wrong-version guard → Job Search workspace → Constellation (hover focus, time scrubber, archive proposal)
- Real Tahoe wallpaper + Dock icons from Apple's macOS 26 Figma kit (img/)
- URL params: ?s=sheet|why|guard|finder|graph|archived (stills) · ?embed&tour=resume (self-playing, loops) · tour=once

## 8.1 Contexto v2.2: invisible by default (Nov 17, 2026)
- Feedback: "looks AI, flow confusing." Rethought in CONTEXTO-FLOW-REDESIGN.md (moment map, needs vs wants, 12 test cases, mistake pricing, principles, cut list)
- Prototype rebuilt: standard open panel + "Suggested" group (preselected) + ⓘ popover + one status-line guard; Spotlight "Sent to Figma"; Finder preview pane (Sent To, Older Versions → Stop Suggesting); Show Related (neutral)
- Removed: notifications, sparkles, gradients, glow, banner card, Contexto sidebar section, archive pill
- Test bar outside the Mac: 3 tasks + case switcher (Clear match / Two good options / Only one résumé)
- Old v2.1 files backed up in the session scratchpad (contexto-v21)

## 8.2 Contexto v2.3: legible story + system + psychology (Nov 17, 2026)
- Feedback: v2.2 flow "makes no sense", v2.1 was easier. Restored v2.1's linear story in v2.2's calm visuals
- CONTEXTO-INTERACTIONS.md: on-device Graph-RAG architecture (ingest → lexical/vector/graph index → retrieve → rank → calibrate → explain → guard → record), real build path (menu-bar app + Safari extension), I1–I10 interaction specs with psychology + rejected alternatives
- Prototype: 8 steps (Notice, Prepare, Explain, Protect, Record, Recall, Tidy, Relate) with a "How it works" panel beside the Mac; ?step=N jumps; v2.2 backed up to scratchpad

## 9.0 Contexto v3: surfaced & guided (Nov 17, 2026)
- Feedback: not intuitive; surface more; guide users; NotebookLM-style. Rebuilt around an application kit
- Surfaces: notification (Open Kit) · Safari toolbar "Kit ready" · inline suggestion under each upload field · docked Contexto panel (gathering animation → kit with sources → progress → sent → up next) · Ask with source chips · Browse… keeps picker guard · Finder Job Search + Related
- Doc: "v3 update" section at top of CONTEXTO-INTERACTIONS.md (surfacing timing table + guidance rules). v2.3 backed up in scratchpad

## 9.1 Contexto v4: ambient, Grammarly-style (Nov 17, 2026)
- Feedback: too recruiting-specific; generalize (old class files); sleeker than a sidebar; automatic like Grammarly; frictionless
- Prototype: 3 scenes (Mail: "my final project from CS 61A" → Attach · Notes: "graphs from ECON 1" (2023) → Insert Link · Safari form: transcript field suggestion). Auto-typing, underline appears, corner badge count, Grammarly-style card with sources, Tab to accept, Other matches / Not this
- Doc: v4 section at the top of CONTEXTO-INTERACTIONS.md (trigger table, card anatomy, reference detection → anchor resolution → retrieval, Accessibility API build path). v3 backed up in scratchpad

## 9.2 Contexto build blueprint (Nov 17, 2026)
- CONTEXTO-BLUEPRINT.md: principles, system architecture + stack (Swift menu bar app, AX overlay, Safari extension, Foundation Models, SQLite/FTS5/sqlite-vec), tagging system (8 facets, term timeline, version lineage, co-access projects, inline correction), surfacing ladder L0–L4 with confidence gates + rate limits, interaction spec (underline/badge/card/accept/not this/keyboard/VoiceOver), onboarding O1–O8 + fading scaffolds, privacy/control, settings IA, data model + pseudocode, edge cases, metrics, 14-week solo roadmap, decision log, references

## 9.3 Contexto v4.1: Organized views, direction D (Nov 18, 2026)
- New first scene "Day one: organized": messy Downloads → indexing → "Your files, organized. Nothing moved." → Classes › ECON 1 (files from 4 real locations, "Where it really is" column, view-only banner, "Also appears in" chips + Show in Finder) · Latest versions (older hidden, Show older) · Folders/Organized toggle
- Only the prototype files changed (index.html, styles.css, app.js); v4 backup in scratchpad contexto-v4-safe. Case study iframes unaffected (Mail/Notes/Upload scenes); the hero tour now starts with this scene

## 9.4 Contexto build docs (Nov 18, 2026)
- CONTEXTO-ENGINE.md (generic names, tiered indexing, markdown cards, APIs, Bao, testing) · CONTEXTO-SURFACING-TECH.md (industry learning-to-rank pattern, résumé lineages, agent via MCP + Claude tool use, Bao repo study)
- CONTEXTO-ARCHITECTURE.md (pieces, repo layout, SQLite schema, Swift interfaces, forgiving name search, AI usage, privacy, budgets, testing) · CONTEXTO-BUILD-PLAN.md (Phases 0–7, one step per session, validate in a fresh session)
- Decisions: D-013 → D-024 (Sophia decided D-015 cards, D-016 on-device + opt-in Claude, D-021 Swift + Python prototype). F11 forgiving name search added to the PRD as P0

## 9.5 Contexto hi-fi touch points + case study (Nov 18, 2026)
- Prototype: hover-to-peek card (file preview + why), new "Find any file" scene (Finder "No Results" for "sume" → ⌥Space Contexto finds it in 9 ms), scenes: Day one organized · Find any file · Email · Notes · Upload
- Case study: ContextFile v1 Figma reference gallery; live demos for Day one + Find any file; features renumbered 1–9
- ASUS password gate removed (backup: portfolio-private/ASUS.locked.html)

### Milestone 10.0 — Partake case study joins Direction A
- What changed: `CaseStudy.html` now links `direction-a.css`. A scoped `.c15` block moves Partake from navy ink, blue accents and cream paper to the warm ink, moss accent, white paper and heading scale of the other case studies. The ASUS meta description no longer says "Password-protected."
- Primary inspiration used: Bao (warm ink, restrained type)
- Why this is better: All four case studies now read as one site.
- Anti-slop decision: Type and color only. No content, layout or motion changes.
- Risk: Low (revert = remove the `direction-a.css` link from `CaseStudy.html` and the 10.0 block from `direction-a.css`)
- Status: ✅ Done
- Review: [ ]

## 9.6 Contexto prototype polish (Nov 18, 2026)
- Study notes card: long file names now stay inside the card
- End-of-scene line now fits each scene ("No panel, no searching" no longer appears after the search scene); the final line says five scenes, not three
- ECON 1 view: header now says 7 files from 4 places, matching the list (the eighth row is a note that mentions ECON 1)

## 9.7 Contexto case study: real work only (Nov 18, 2026)
- Removed the old generated screenshots (v1 mockups and v2.1–v3 iteration shots). Originals archived in `~/git/portfolio-private/contexto-old-assets/`
- Added the real ContextFile v1 work from Figma: mid-fi screens and an animated, clickable player for the Spotlight, Finder, and Widget flows (`assets/contexto/v1/`)
- Kept the hand-drawn sketches and all live prototype demos
- From the HCD research deck: cluttered desktop photo, survey chart, two interview quotes, three personas
- "Six versions" is now a text list of what each version taught
- v1 flows now play as one automatic film (Spotlight → Finder → Widget → Notification → Quick Look) in the same frame as the v2 demos

## 9.8 Contexto case study: story rewrite (Nov 18, 2026)
- New arc: same frustration in 2025 and 2026 → prior research → v1 lessons → strategy → ambient layer → decisions → how it works → Claude and agents → hard problems → testing → reflection
- Every decision now states its reason; personas and mid-fi screens removed; v2 user testing is labeled as not yet run
- v1 flow rebuilt from separate Figma layers with a moving cursor and smooth transitions (`prototypes/contextfile-v1/`)

## 9.9 Contexto case study: chronological structure (Nov 18, 2026)
- Five parts: The problem → 2025 ContextFile → 2026 Contexto → Building it → Looking ahead, grouped the same way in the sidebar
- Added vision, problems, core question, scope, key terms, user flows, key takeaways, reflection, and next steps
- Replaced line-based tables with cards and flow diagrams; prior research now appears as design principles

## 9.10 Contexto case study: tightened (Nov 18, 2026)
- Cut from about 2,300 words to about 850, matching Notability's page length
- Sidebar is one flat list using Bao's section order: Overview, Project Overview, Problems, Design Challenge, Research, The Solution, Lo-fi, Hi-fi, Final Features, How It Works, Conclusions
- Previous longer version: session backup only (Contexto-before-tighten.html)

## 9.11 Contexto case study: narrative pass (Nov 18, 2026)
- Rewrote section copy so each part leads into the next; restored the original five key takeaways
- Added Challenges (Finder, underlines, tagging, privacy) and Opportunity (agents, labeled as a proposed direction)
- Restored the folders vs. graph visual in How It Works

## 9.12 Partake case study rebuilt (Nov 18, 2026)
- New `Partake.html` in the Notability format, built from the real Berkeley Innovation board and client deck; old `CaseStudy.html?p=p2` links redirect to it
- Corrected facts: Spring 2026, 6 competitors, 5 interviews, real TikTok results; 13 empty placeholders removed
- Partake reframed as a customer and go-to-market strategy case, with human-centered design as the method

## 9.13 Play page: Sand + Baro (Nov 18, 2026)
- New `Sand.html` from the FigBuild deck and Figma; old Sand links redirect to it
- Rebuilt the four Figma Make AR prototypes as one self-playing film (`prototypes/sand-ar/`): calibrate, focus, be present
- New `Baro.html` (Project Manager) from the Baro redesign Figma; both added to Play with new covers
- Contexto: added "richer context" to The Solution
- Baro rewritten around the PM story (founder expertise → behavior logic → 5 engineers) with an interactive reward-schedule demo; Sand now credits Avery for the app and reflects the team's ethics framing
- Sand app rebuilt as a working prototype (`prototypes/sand-app/`): phone-to-phone flow film, four live interactions, and a fully tappable phone
- Sand app film verified end to end in real time (11 phone-to-phone transitions, about 41 seconds per loop)
- Play: added Circuit (front-end implementation, external link). Sand credits corrected: Sophia made the app and AR, team effort. Baro timeline added: Sept–Dec 2025

### Milestone 10.1 — Contexto and Partake covers
- What changed: Contexto now shows the real Mail moment from the prototype and plays it on hover. Partake shows the three TikTok concepts the team posted, on Partake blue.
- Primary inspiration used: Bao (hover reveals motion)
- Why this is better: Both cards now show shipped work instead of an old concept screen and abstract artwork.
- Risk: Low (revert = restore the Cover line in `app-v13.jsx`, `partakecover.jsx`, and remove block 10.1 in `direction-a.css`)
- Status: ✅ Done
- Review: [ ]

### Milestone 11.0 — Notability on the shared case-study system
- What changed: New `case-b.css` with five text sizes, two weights, and one 680px reading column. Cards, tiles, and colored stat boxes became plain text. Live demos stayed.
- Primary inspiration used: Rachel Chen (structure and breathing room), Bao To (live demos)
- Why this is better: Clearer hierarchy, more space, and the work carries the page.
- Risk: Low (revert = restore `~/git/portfolio-design-versions/backups/Notability-before-audit-pass.html`)
- Status: ✅ Done
- Review: [ ]

### Milestone 11.1 — All six case studies on the shared system
- What changed: Title back on top of every hero with a specific one-line title. Contexto, Sand, Partake, Baro, and ASUS moved onto `case-b.css`: one 680px column, five text sizes, two weights, cards turned into plain text and lists. Copy unchanged.
- Risk: Low (backups in `~/git/portfolio-design-versions/backups/*-before-audit-pass.html`)
- Status: ✅ Done
- Review: [ ]

### Milestone 11.2 — One spacing scale + challenge rows
- What changed: `case-b.css` spacing tokens (16 / 32 / 64 / 128px; 32px frame padding; 16 / 24 / 48 / 96 / 16 on phone). Every media block now sits in the 680px column; only the hero runs wider (after May Wu's QoderWake study). Contexto Challenges and Baro Hard problems are now rows: question + status, then "The problem" | "Where I landed" side by side.
- Status: ✅ Done
- Review: [ ]

### Milestone 11.3 — Prototype-first hero
- What changed: on all six case studies the live prototype/work leads the page again, then the label, specific title, lede, and meta.
- Status: ✅ Done
- Review: [ ]

### Milestone 12.0 — Centered sidebar, "Currently" removed
- What changed: Removed the "Currently" list from the sidebar. The name, role line, nav and social icons stay left-aligned and sit in the vertical middle of the sidebar on desktop, with an even 48px gap between groups (32px on phone). Nav links have 14px between them; social icons have 20px.
- Primary inspiration used: Sophia's direction
- Why this is better: The sidebar has fewer elements and reads as one calm, balanced column.
- Anti-slop decision: Spacing only; no new elements.
- Risk: Low (revert = restore the `da-now` block in `app-v13.jsx` and remove block 12.0 in `direction-a.css`)
- Status: ✅ Done
- Review: [ ]

### Milestone 12.1 — New tagline + proof from the resume
- What changed: Sidebar tagline is now "a product builder who decides what AI should do, and what stays human." (from the resume summary). Homepage meta descriptions match. Added proof from the resume: Notability (2 concepts later appeared in the app; status meta + outcome), Partake (concepts went live on Instagram), Circuit on Play (1,000+ users).
- Primary inspiration used: Sophia's product resume (Drive)
- Why this is better: One positioning across resume and site; adds the outcomes the audit graded C+.
- Risk: Low (copy only)
- Status: ✅ Done
- Review: [ ]

### Milestone 13.0 — Top nav (branch `design/top-nav`)
- What changed: Sidebar replaced by a thin sticky top bar (name left; Work / About / Play / Resume right, moss dot under the active page). Homepage opens with a two-line intro: the tagline at 26–34px, then "CogSci & Data Science @ UC Berkeley" and the social icons. Work grid now uses the full width. On phones under 420px, "Work" hides (the name links home) so Resume always fits.
- Primary inspiration used: Sophia's direction; recruiter skim (tagline as headline, Resume always one click away)
- Why this is better: The positioning is the first thing read, and the work gets about 25% more width.
- Risk: Medium (layout change on index/About/Play; sidebar version kept on `design/nav-centered`, commit 0fecf8f)
- Status: ✅ Done
- Review: [ ]

### Milestone 13.1 — Narrower page with wide side margins
- What changed: Top bar contents and the page content are capped at 1040px and centered (at least 40px per side; 200px per side on a 1440px screen). Bar is 56px tall. Grid gaps 56px / 32px.
- Primary inspiration used: Bao To (narrow centered column, generous margins)
- Risk: Low (block 13.1 in `direction-a.css`; change `--tn-w` to adjust)
- Status: ✅ Done
- Review: [ ]

# DESIGN.md — sophiaclancy.com

Plain-language rules for the redesign. Every rule comes from something visible on Bao's site (baothiento.com/work) unless marked otherwise.
Styling lives in `direction-a.css` (loaded last on index / About / Play). Remove that one `<link>` to go back to the old look.

## Who wins
**Bao decides.** Brandon helps with hierarchy, Airla with type, Lazim with small details, Megan with sidebar ideas later. If two disagree, do what Bao does. Never blend them.

---

## The 8 principles

### 1. The work is the color. The page is paper.
Background is Bao's warm paper `#F5F1EC`. Text is his warm near-black `#2A2520`. All the bright color on the page comes from the project images.

### 2. Every project sits on a soft frame, like a screen on a desk.
Each card is a thick glassy "bubble" frame (16px corners, light on top, shaded at the bottom, frosted rim). Behind it sits a **scene that belongs to the project** (ASUS dusk sand, Notability sky, Contexto's macOS wallpaper, Partake rose). The project screen sits inside with 8px corners and a tinted bezel. Each scene is one CSS rule (`.sc-<id>`) and can be swapped for a photo.

### 3. Under each frame: title left, tags right, one sentence below.
- Title: 16px, medium weight, almost-black.
- Tags: small soft chips (light gray fill, gray text, 4px corners). Max two.
- Description: one sentence, 14px, gray.

### 4. Hover is quiet.
A white ↗ fades in top-right, the title fades from 90% to 70%, and the card shrinks very slightly when pressed. Glass glints on the frame edges are always on. Later: a looping screen recording fades in, and frosted tool icons appear bottom-right. Nothing lifts, tilts or bounces.

### 5. The sidebar reads top to bottom like a short letter.
Forest mark → name → school → one sentence about you (two colored words) → "Currently" list → navigation **stacked vertically** → small social icons. Same paper as the page, no panel, no border. Only three levels: name 28px; content 15px ink; meta 14px gray. Spacing is 8 / 24 / 40.

### 6. One big thing per page.
Your name is the largest text (30px). Page titles match it; section titles are 20px; everything else is 16px or smaller. *(Brandon)*

### 7. One sans, one mono.
Hanken Grotesk for everything you read, with slightly tight letter-spacing on large text. Fragment Mono only for tiny data inside covers. The sidebar is all sans: small caps made it noisy. *(Airla + Brandon)*

### 8. Rows line up.
Projects sit in a grid where each row's titles share one line. 24px between columns, 48px between rows, 40px from the page edges.

---

## Don't
- Don't put a logo on a blurry gradient as a project image.
- Don't rotate or animate status text (no carousels, counters, typewriters).
- Don't bold or highlight words in your bio — color only, regular weight, max two or three words.
- Don't use big glassy pill buttons for navigation or filters.
- Don't mix in a serif or a third font.
- Don't strip everything flat: the frame glow, bezel, chips and hover label are what give it life.

## Open items (need Sophia)
- ASUS image: currently your paper/dot-grid ASUS cover. Replace with real work when shareable.
- About › Communities photos are still placeholders.

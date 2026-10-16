# Handoff: Shehab Mohsen — Portfolio (Swiss direction)

## Overview
A single-page personal portfolio for Shehab Mohsen, a Senior Full-Stack Engineer (frontend-focused). It is written for recruiters and hiring managers filling senior or lead remote roles. It has three jobs:
- show six case studies fast, through a hover-preview index that opens a full-screen case study
- make contact and the résumé one click away
- show frontend craft through the build quality itself

The chosen direction is **Swiss**: a strict grid, a neutral palette, one cobalt accent, sharp corners, a single typeface (Onest), and light and dark themes.

## About the design files
The files in this bundle are **design references built in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. The task is to **recreate them in the target codebase** using its own patterns. If no codebase exists yet, use the stack in `CLAUDE_CODE_PROMPT.md`.

`Portfolio Swiss.dc.html` runs in a browser. Serve the folder (`npx serve .`) and open it. It runs on a small prototype runtime (`support.js`) that uses `{{ }}` template holes, `<sc-for>`/`<sc-if>`, and a `class Component` logic block. Treat that as readable pseudo-code: port the values and behaviour, not the runtime.

Ignore these prototype-only quirks:
- **Inline styles everywhere.** This is a runtime constraint. Implement with tokens and CSS modules.
- **Images assigned via `ref` callbacks** (`coverRef`, `thumbRef`, `mainImgRef`) instead of `src`. This is a runtime workaround; use a plain `src`.
- **Theme variables written onto the root element from JS.** Use `[data-theme]` on `<html>` instead.

## Fidelity
**High-fidelity.** Colours, type, spacing, copy and motion are final. Match the reference at 1440×900 and 390×844, in both themes.

## Content
All copy and data lives in `content.json`. Use it **verbatim**; don't rewrite it.

Inline markers in strings:
- `**bold**`: weight 600, colour `--ink`
- `*italic*`: colour `--ink`
- `==accent==`: a span coloured `--acc-ink`

Each image entry includes its intrinsic `width` and `height`. Use them to prevent layout shift.

---

## Design tokens

### Colours

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F3F3F1` | `#0E0E10` | page background |
| `--bg2` | `#E8E8E5` | `#18181B` | alternate sections, image wells |
| `--ink` | `#111112` | `#F1F1EE` | primary text, strong rules |
| `--ink2` | `#3B3B3F` | `#C2C2C5` | body text |
| `--mute` | `#67676D` | `#8D8D93` | labels, meta, placeholders |
| `--line` | `rgba(17,17,18,.14)` | `rgba(241,241,238,.14)` | hairlines, borders |
| `--acc` | `#2443F5` | `#7086FF` | accent fills (buttons, bars, contact bg) |
| `--acc-ink` | `#2443F5` | `#8196FF` | accent used as text |
| `--on-acc` | `#FFFFFF` | `#0E0E10` | text on `--acc` |
| `--syn-kw` | `#2443F5` | `#8196FF` | code keyword |
| `--syn-str` | `#14794A` | `#6FD39C` | code string |
| `--syn-com` | `#67676D` | `#8D8D93` | code comment |
| status green | `#1FA463` | `#1FA463` | "open to work" dots |

- Selection: background `--acc`, text `--on-acc`.
- Links: `color: inherit`, `text-underline-offset: 3px`; on hover, `--acc-ink`.
- Focus: `:focus-visible { outline: 2px solid var(--acc); outline-offset: 3px }`. Inside Contact the outline is `--on-acc`.
- Default theme is **light**. Persist the user's choice and apply it before first paint, so there is no flash. Set `color-scheme` to match the theme.

### Typography
- One family: **Onest** (Google Fonts, variable weight 300–800), with a `system-ui, sans-serif` fallback.
- Code sample font: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.
- Body: `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility`.
- Use `font-variant-numeric: tabular-nums` on numbers, the clock and counters.

| Role | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| Hero name (H1) | `clamp(66px, 15vw, 230px)` | 640 | .88 | -0.055em |
| Contact heading | `clamp(48px, 8.4vw, 132px)` | 620 | .92 | -0.06em |
| Case-study title | `clamp(52px, 9vw, 140px)` | 600 | .88 | -0.045em |
| Section H2 | `clamp(34px, 4.6vw, 68px)` | 600 | 1 | -0.045em |
| Hero lead | `clamp(24px, 2.8vw, 42px)` | 450 | 1.14 | -0.03em |
| Project name (index row) | `clamp(28px, 3.2vw, 46px)` | 560 | 1 | -0.045em |
| "Next project" name | `clamp(36px, 5vw, 72px)` | 600 | 1 | -0.045em |
| Card title (H3) | 21–22px | 600 | — | -0.025 / -0.03em |
| Experience role | 19px | 600 | 1.3 | -0.02em |
| Body (about) | `clamp(16px, 1.25vw, 18px)` | 400 | 1.62 | 0 |
| Body (lists/cards) | 15px | 400 | 1.5–1.58 | 0 |
| Section intro | 16px | 400 | 1.55 | 0 |
| UI / buttons | 13–15px | 400–500 | — | 0 |
| Labels / meta | 12–13px | 400 | — | 0 |

H2s and the hero lead use `text-wrap: balance`. Long paragraphs use `text-wrap: pretty`.

### Layout and spacing
- Container: `max-width: 1320px; margin: 0 auto; padding-inline: clamp(18px, 4vw, 40px)`.
- Section padding-block: `clamp(64px, 10vh, 120px)`.
  - Hero: `clamp(40px, 8vh, 96px)` top and `clamp(56px, 9vh, 110px)` bottom.
  - Work: `clamp(48px, 8vh, 100px)` top and `clamp(64px, 10vh, 120px)` bottom.
- **Section header pattern** (used by every section after the hero) is two flex columns that wrap:
  - Label column `flex: 1 1 220px`: the number in `--acc-ink` plus the label in `--mute`, 13px, gap 10px.
  - Content column `flex: 3 1 520px`: the H2, plus an optional intro with `margin-top: 18px; max-width: 56ch`.
  - Row gap: `16px clamp(24px, 4vw, 60px)`. Margin below the header: `clamp(32px, 5vw, 56px)`.
- Section backgrounds alternate:
  - Hero `--bg`, Work `--bg`, About `--bg2`
  - Experience `--bg`, Principles `--bg2`, Stack `--bg`, Beyond `--bg2`
  - Contact `--acc`
- Corner radius is **0 everywhere**. The only round things are the status dots and the theme icon.
- Rules: hairlines are `1px var(--line)`; a 1px rule in `--ink` marks the top of every list or grid.
- The only breakpoint is **960px**. Hover behaviour is gated on `(hover: hover) and (pointer: fine)`.
- Everything else reflows with `flex-wrap` and `auto-fit` grids, so check down to 360px.

### Shadows
- Hover preview card: `0 30px 70px -24px rgba(0,0,0,.45)`
- Command palette: `0 30px 80px -20px rgba(0,0,0,.5)`

### Easing
- `--ease-out: cubic-bezier(.2,.75,.1,1)`: almost every motion.
- `--ease-theme: cubic-bezier(.65,0,.25,1)`: the theme reveal.
- `--ease-in: cubic-bezier(.4,0,1,1)`: dialog close.

---

## Sections (top to bottom)

### 0. Header (sticky)
- Container: `position: sticky; top: 0; z-index: 40`, background `--bg`, `border-bottom: 1px solid var(--line)`.
- Inner row: container width, height 60px, flex, centred, gap `clamp(14px, 2.4vw, 30px)`.
- **Logo**: links to `#top`. An 11×11px `--acc` square plus "Shehab Mohsen" at 15px/600, letter-spacing -0.01em, gap 10px.
- A flexible spacer follows the logo.
- **At 960px and up:**
  - Nav (Work, About, Experience, Stack, Contact): 14px, gap 26px, colour `--mute`. The active section's link is `--ink`; hover is also `--ink`; transition on colour .2s.
  - Clock: "Cairo HH:MM" at 13px in `--mute`, tabular-nums.
- **Theme toggle**:
  - Box: 34px tall, padding `0 12px`, `1px solid var(--line)` (`--ink` on hover), transparent background, 13px.
  - Icon: a 12px circle with a 1.5px `currentColor` border, half-filled with `linear-gradient(90deg, currentColor 50%, transparent 50%)`.
  - The label names the target mode: "Dark" while light, "Light" while dark.
- **Below 960px**: a "Menu" button (34px tall, padding `0 14px`, background `--ink`, text `--bg`, 13px) that opens the command palette.
- **Scroll progress**: a 2px bar under the header row with `margin-bottom: -1px`, so it overlays the border. Fill `--acc`, `transform: scaleX(progress)` from the left.

### 1. Hero (`#top`)
1. **Meta row**:
   - Flex, wrap, space-between, gap `8px 24px`, `padding-bottom: 16px`, `border-bottom: 1px solid var(--line)`, 13px `--ink2`.
   - Left: the eyebrow text.
   - Right: an 8px green dot (pulsing) plus the status text, gap 9px.
2. **Name (H1)**:
   - `margin-top: clamp(28px, 5vw, 64px)`.
   - Line 1 "Shehab" is a block.
   - Line 2 has `padding-left: 22%` and contains "Mohsen" plus an accent square: `.15em × .15em`, `margin-bottom: .14em`, gap .08em, aligned flex-end so it reads like a full stop.
3. **Lead and CTAs**: a flex row that wraps, `align-items: flex-end`, gap `32px clamp(32px, 6vw, 96px)`, `margin-top: clamp(36px, 6vw, 72px)`.
   - Lead: `flex: 2 1 420px; max-width: 26ch`. The `==systems behind the pixels==` span is `--acc-ink`.
   - CTA stack: `flex: 1 1 260px; max-width: 380px`, a column with gap 10px. Each CTA is a full-width row with the label left and the icon right (space-between, gap 16px), 15px/500. Hover transitions run on background and colour, .25s.

| CTA | Padding | Default | Hover |
|---|---|---|---|
| primary | 17px 20px | bg `--acc`, text `--on-acc` | bg `--ink`, text `--bg` |
| outline | 16px 20px | 1px `--ink` border, text `--ink` (downloads the Frontend PDF) | fill `--ink`, text `--bg` |
| text | 12px 20px | text `--ink2` | text `--acc-ink` |

4. **Facts grid**:
   - `margin-top: clamp(48px, 7vw, 88px)`, `padding-top: 18px`, `border-top: 1px solid var(--ink)`.
   - Grid `repeat(auto-fit, minmax(min(100%, 230px), 1fr))`, gap `20px 32px`.
   - Each fact: the label at 12px `--mute` (6px below it), then the value at 15px with line-height 1.45.
   - "Elsewhere" holds two underlined links, gap 16px.

### 2. Selected Work (`#work`)
- Header pattern: "01 · Selected Work", the H2, and the intro.
- **Index header** (960px and up only): flex, gap 16px, `padding-bottom: 10px`, `border-bottom: 1px solid var(--ink)`, 12px `--mute`. The columns use the same flex values as the row cells below. Below 960px it is only a 1px `--ink` rule.
- **Row**: a `<button>` at full width; flex, wrap, `align-items: baseline`, gap `6px 16px`, `padding: 24px 0`, `border-bottom: 1px solid var(--line)`, left-aligned. Cells:

| Cell | Flex | Style |
|---|---|---|
| No. | `0 0 52px` | 13px `--mute`, tabular |
| Project | `1.3 1 200px` | the project-name style |
| Sector | `1 1 200px` | 14px, lh 1.4, `--ink2` |
| Role | `1.4 1 240px` | 14px, lh 1.4, `--ink2` |
| Case study | `0 0 96px` | "Open ↗", 14px `--acc-ink`, right-aligned |

- **Touch devices** (no hover): each row also shows its cover (the first image) at full width below the text. 16:10, `object-fit: cover; object-position: top center`, background `--bg2`, `margin-top: 14px`.
- **Also shipped**:
  - `margin-top: clamp(48px, 7vw, 88px)`. The label is 13px `--mute` with 16px below it.
  - Grid `auto-fit, minmax(min(100%, 280px), 1fr)`, column gap `clamp(20px, 3vw, 40px)`.
  - Card: `border-top: 1px solid var(--ink)`, padding `18px 0 10px`.
  - Card contents, in order:
    - kicker: 12px `--acc-ink`, 12px below
    - title: 22px/600, letter-spacing -0.03em, 8px below
    - description: 15px, lh 1.5, `--ink2`, 12px below
    - meta: 12px `--mute`

### 3. About (`#about`): background `--bg2`
This section varies the header pattern: the portrait sits in the label column, so that column isn't left empty.
- Row: flex, wrap, gap `24px clamp(24px, 4vw, 60px)`.
- **Left column** (`flex: 1 1 220px`, a column with gap 28px):
  - The label "02 · About".
  - **Portrait** (`width: 100%; max-width: 340px`):
    - Frame: 4:5, background `--bg`.
    - Image filter: `grayscale(1) contrast(1.04)` by default, plain colour on hover; `transition: filter .7s ease`.
    - Badge at top-left (inset 10px): background `--bg`, padding `5px 10px`, 11.5px, a 6px green dot, then "Open to remote".
    - Caption: space-between, 12px `--mute`, 10px above. The left part is in `--ink`.
- **Right column** (`flex: 3 1 520px`):
  - The H2: `max-width: 18ch`, `margin-bottom: clamp(28px, 4vw, 48px)`; "don't" is accented.
  - Text block (`max-width: 62ch`):
    - Two paragraphs, 18px apart.
    - Chips (`margin-top: 26px`, gap 8px): padding `7px 12px`, `1px solid var(--line)`, background `--bg`, 13px.
- When the columns wrap (narrow screens) the order is: label, portrait, heading, text.

### 4. Experience (`#experience`)
- Header: "03 · Experience". The H2 has `max-width: 20ch`.
- List: `border-top: 1px solid var(--ink)`. Each row is flex, wrap, gap `8px clamp(16px, 3vw, 40px)`, `padding: 24px 0`, `border-bottom: 1px solid var(--line)`.
  - When (`0 0 160px`, 13px, `padding-top: 3px`): the current role is `--acc-ink` with a 7px `--acc` square in front; the rest are `--mute`.
  - Role (`1 1 280px`):
    - Title: 19px/600.
    - Company: 15px `--ink2`, 4px above.
    - Optional tag: " · Part-time" in `--acc-ink`.
  - Description (`2 1 380px`): 15px, lh 1.58, `--ink2`.
- Education row (padding `24px 0`, no bottom rule): the label "Education" (`0 0 160px`, 13px `--mute`), then each entry (`1 1 280px`, 15px `--ink2`) as "**Title** — where".

### 5. How I think (`#principles`): background `--bg2`
- Header: "04 · How I think", the H2 (with "lasts" accented), and the intro.
- Grid `auto-fit, minmax(min(100%, 300px), 1fr)`, column gap `clamp(20px, 3vw, 40px)`.
- Item: padding `20px 0 32px`, `border-top: 1px solid var(--ink)`.
  - Number: 13px `--acc-ink`, tabular.
  - Title: 21px/600, letter-spacing -0.025em, margin `16px 0 8px`.
  - Description: 15px, lh 1.55, `--ink2`.
- **Code sample**:
  - Box: `margin-top: clamp(20px, 3vw, 32px)`, padding `clamp(18px, 2.6vw, 28px)`, `1px solid var(--line)`, background `--bg`.
  - Text: mono `clamp(12.5px, 1.1vw, 14.5px)`, lh 1.85; lines are `white-space: pre`; the box scrolls with `overflow-x: auto`.
  - Highlighting: comments `--syn-com`, the `type` keyword `--syn-kw`, string literals `--syn-str`.

### 6. Stack (`#stack`)
- Header: "05 · Stack".
- Rows: a 1px `--ink` rule on top. Each row is flex, wrap, gap `8px clamp(16px, 3vw, 40px)`, `padding: 20px 0`, `border-bottom: 1px solid var(--line)`.
  - Category (`0 0 220px`): 13px `--mute`, `padding-top: 4px`.
  - Items (`1 1 360px`): flex, wrap, gap `4px 24px`, `clamp(17px, 1.5vw, 21px)`, letter-spacing -0.015em, lh 1.4.

### 7. Beyond the keyboard (`#beyond`): background `--bg2`
- Header: "06 · Beyond the keyboard". The H2 has `max-width: 18ch`; "sharpen" is accented.
- Grid `auto-fit, minmax(min(100%, 280px), 1fr)`.
- Item: `border-top: 1px solid var(--ink)`, padding `20px 0 28px`.
  - Kicker: 12px `--acc-ink`.
  - Title: 22px/600, margin `16px 0 8px`.
  - Description: 15px, lh 1.55, `--ink2`.

### 8. Contact (`#contact`): background `--acc`, all text `--on-acc`
- Re-map tokens inside this section:
  - `--ink` and `--ink2` become `--on-acc`
  - `--mute` becomes `color-mix(in oklab, var(--on-acc) 70%, var(--acc))`
  - `--line` becomes `color-mix(in oklab, var(--on-acc) 35%, transparent)`
- Padding: `clamp(64px, 10vh, 120px)` top, 28px bottom.
- Label: "07 · Let's talk", 13px, `margin-bottom: clamp(24px, 4vw, 40px)`.
- Heading: `max-width: 12ch`, using the contact-heading style.
- Two columns (flex, wrap, gap `48px clamp(32px, 6vw, 96px)`, `margin-top: clamp(40px, 6vw, 80px)`).
- **Left column** (`1 1 360px`, a column with gap 30px):
  - Email:
    - Label: 12px, 10px below it.
    - Link: `clamp(20px, 2.4vw, 32px)`/500, letter-spacing -0.02em, 1px underline at 6px offset, `overflow-wrap: anywhere`.
    - **Copy** button: 34px tall, padding `0 14px`, `1px solid var(--on-acc)`, transparent; on hover it fills `--on-acc` with `--acc` text.
  - Details grid: `auto-fit, minmax(150px, 1fr)`, gap `20px 28px`, 15px. Labels are 12px with 8px below.
  - Résumé row: 14px, gap `10px 22px`; both links download.
- **Right column**, the form (`1 1 380px`, a column with gap 20px):
  - Layout: Name and Email side by side (each `1 1 160px`, wrapping); Message below.
  - Labels: 12px, gap 6px.
  - Inputs: height 46px, padding 0, border only at the bottom (`1px solid var(--on-acc)`; 2px on focus), radius 0, transparent background, 16px.
  - Textarea: padding `10px 0`, lh 1.5, `resize: vertical`, 4 rows.
  - Submit button: 52px tall, padding `0 24px`, background `--on-acc`, text `--acc`, 15px/500, aligned start.
  - Note: 12px.
- Footer row: `margin-top: clamp(56px, 9vh, 110px)`, `padding-top: 20px`, `border-top: 1px solid var(--on-acc)`, 12px, space-between. "Back to top ↑" links to `#top` with no underline.

### 9. Case study dialog
- `position: fixed; inset: 0; z-index: 80; overflow-y: auto; overscroll-behavior: contain`, background `--bg`.
- Use `role="dialog"`, `aria-modal="true"` and `aria-label="{Name} case study"`.
- **Sticky top bar**:
  - Container: background `--bg`, a 1px `--line` bottom border.
  - Inner row: container width, min-height 60px, padding `10px clamp(16px, 3vw, 40px)`, flex, wrap, gap `10px 14px`.
  - Contents, left to right:
    - the counter "Case study 01 / 06": 13px `--mute`, tabular
    - a spacer
    - "← Prev" and "Next →": 36px tall, padding `0 14px`, `1px solid var(--line)` (`--ink` on hover), 13px
    - "Close ✕": the same size, background `--ink`, text `--bg`
- **Body** (container width, padding `clamp(28px, 5vw, 64px) clamp(16px, 3vw, 40px) clamp(56px, 8vw, 100px)`):
  1. Sector: 13px `--acc-ink`.
  2. Title: the case-study-title style, margin `14px 0 18px`.
  3. Blurb: `max-width: 44ch`, `clamp(19px, 1.8vw, 25px)`, lh 1.4, `--ink2`.
  4. **Gallery** (`margin-top: clamp(28px, 4vw, 48px)`):
     - Frame: `max-height: min(76vh, 860px); overflow-y: auto`, a 1px `--line` border, background `--bg2`. The image is `width: 100%; height: auto`, so tall screenshots scroll inside the frame.
     - Row under the frame (`margin-top: 12px`, flex, wrap, space-between, gap `12px 24px`):
       - Thumbnails: 92×58, a 2px border (`--acc` when active, `--line` otherwise), opacity 1 or .6, a .2s transition, the image covering from the top centre.
       - Caption: 12px `--mute`, in the form "`1 / 4 — Public site — home`". When the image's aspect ratio (w/h) is below 1.25, append " · scroll inside the frame for the full page".
  5. **Details** (`margin-top: clamp(44px, 6vw, 80px)`, flex, wrap, gap `40px clamp(32px, 6vw, 96px)`). Every label here is 12px `--mute` with 10px below it.
     - Left column (`2 1 460px`, gap 30px):
       - Problem and Solution: `clamp(16px, 1.3vw, 19px)`, lh 1.6, `--ink2`.
       - Impact: `clamp(19px, 1.8vw, 25px)`, lh 1.4, `--ink`.
     - Right column (`1 1 260px`, gap 30px):
       - Role: 17px/600.
       - Stack chips: padding `6px 11px`, `1px solid var(--line)`, 12.5px, gap 8px.
       - Live: only when `live` is set. A 46px-tall button, padding `0 18px`, background `--acc`, text `--on-acc`, 14px, "{label} ↗", opening in a new tab with `rel="noopener noreferrer"`. Fatura has no live link.
  6. **Next project**: a full-width button.
     - Box: `margin-top: clamp(56px, 8vw, 100px)`, `padding-top: 28px`, `border-top: 1px solid var(--ink)`.
     - Layout: flex, wrap, baseline, space-between.
     - Content: "Next project" (13px `--mute`), then "{Next name} →" in the next-project style. On hover the button turns `--acc-ink`.

### 10. Hover preview (fine pointers only)
- `position: fixed; left: 0; top: 0; z-index: 60; width: clamp(260px, 24vw, 400px); pointer-events: none`, positioned through `transform: translate3d(x, y, 0)`.
- Card: a 1px `--line` border, background `--bg2`, the preview shadow.
- Inside the card is a 16:10 box with **all six covers stacked**. The hovered cover has opacity 1 and `scale(1)`; the rest have opacity 0 and `scale(1.08)`. Transitions: opacity .35s ease, transform .7s `--ease-out`, so moving between rows crossfades.

### 11. Command palette
- **Overlay**: `position: fixed; inset: 0; z-index: 95`, background `rgba(0,0,0,.4)` with `backdrop-filter: blur(3px)`, padding `12vh 16px 16px`, content centred at the top. Clicking outside the panel closes it.
- **Panel**: `max-width: 580px`, a 1px `--line` border, background `--bg`, the palette shadow.
- **Input row**:
  - Row: padding `0 16px`, a bottom border.
  - Contents: a "›" in `--acc-ink`, the input (56px tall, 16px, no border), and an "esc" chip (1px `--line`, 11px `--mute`).
- **List**: `max-height: min(52vh, 430px)`, scrolls, padding 6px.
  - Item: padding `11px 12px`, 15px label on the left, 12px hint on the right (ellipsised).
  - Selected item: background `--acc`, label and hint in `--on-acc`.
  - Other items: label `--ink`, hint `--mute`.
- Empty state: "No matches." at 14px `--mute`.
- Commands come from `content.json → palette.commands`.

### 12. Toast
- `position: fixed; top: 18px; left: 50%`, centred, z-index 100, `max-width: calc(100vw - 32px)`, padding `10px 16px`, background `--ink`, text `--bg`, 14px, `aria-live="polite"`.

---

## Interactions and behaviour

### Scroll reveals
- Elements marked `data-reveal` start at opacity 0.
- An IntersectionObserver watches them (threshold 0.08, `rootMargin: '0px 0px -4% 0px'`).
- On entry each element animates **once**:
  - from `{opacity: 0, transform: translateY(24px)}` to `{opacity: 1, transform: none}`
  - duration 900ms, easing `--ease-out`, `fill: backwards`
  - delay `min(k × 80ms, 480ms)`, where `k` is its index among the entries in the same observer callback (a natural stagger)
- **Hero name lines** use a separate "rise":
  - from `{opacity: 0, transform: translateY(34%) skewY(2.5deg)}` to `none`
  - duration 1150ms, with an extra 130ms delay per line
- Reveals must survive re-renders and theme switches (mark elements as played) and must never leave content hidden.

### Status dot pulse
- `box-shadow` animates from `0 0 0 0 rgba(31,164,99,.55)` to `0 0 0 9px rgba(31,164,99,0)`.
- 1800ms, ease-out, infinite.

### Project index hover (fine pointers)
- Hovering a row:
  - Every **other** row fades to opacity .3 (`transition: opacity .35s ease`).
  - The hovered row gets a 2px `--acc` bar at `bottom: -1px` that animates `scaleX(0 → 1)` from the left (.55s `--ease-out`).
  - The project name shifts `translateX(14px)` (.55s `--ease-out`).
- The list's `mouseleave` clears the hover state.
- **The preview follows the cursor**:
  - Target X is `cursorX + 32`. If the card would pass `viewportWidth − 12`, use `cursorX − cardWidth − 32` instead. The result is never less than 12.
  - Target Y is `cursorY − cardHeight/2`, clamped to `[12, viewportHeight − cardHeight − 12]`.
  - Each frame, `pos += (target − pos) × 0.16` (×1 under reduced motion). Stop the loop when the remaining distance is under 0.4px.
  - The first hover after leaving the list snaps straight to the target, with no glide from the corner.
  - Visibility: opacity 0 → 1 over .25s; the inner card scales `.94 → 1` over .45s `--ease-out`. Hidden while the dialog is open.

### Case study dialog
- **Open** (row click, palette, or Enter or Space on a focused row):
  - Lock body scroll.
  - Animate `{opacity 0, translateY(56px)} → none` over 560ms `--ease-out`.
  - Move focus to Close. Trap focus inside the dialog.
- **Close** (Close button, or Esc):
  - Animate `{opacity 1} → {opacity 0, translateY(32px)}` over 260ms `--ease-in`, then unmount.
  - Restore focus to the element that opened it and unlock scroll.
- **Prev / Next / Next project**: cycle through projects with wrap-around, reset to the first image, and scroll the dialog to the top.
- **Images**: ←/→ cycle images (with wrap-around); thumbnails select one. On each change, reset the frame's scrollTop to 0 and fade the image in (opacity 0 → 1, 320ms ease-out).
- *Recommended (not in the mock):* reflect the open case in the URL (`?case=<slug>`) with the History API. Deep links then open it, and Back closes it.

### Command palette
- Opening:
  - **⌘K / Ctrl+K** toggles it from anywhere, including inside inputs.
  - **/** opens it, except while typing in a field.
  - The "Menu" button opens it below 960px.
- Focus the input when it opens and lock body scroll.
- **Filter**: a case-insensitive substring match on `label + " " + hint`. Reset the selection to 0 whenever the query changes.
- **Keys**: ↑/↓ move the selection (clamped) and keep it scrolled into view inside the list. Do this by adjusting `scrollTop`; don't use `scrollIntoView` on the page. Enter runs the selected command; Esc closes.
- Mouse hover sets the selection.
- Running a command closes the palette first, then executes it about 30ms later.
- **Actions**:
  - `scrollTo`: smooth-scroll to the section, offset 56px.
  - `openCase`: open the dialog.
  - `copyEmail`: see below.
  - `download`: trigger a download of the file.
  - `openUrl`: open in a new tab with `noopener`.
  - `toggleTheme`: switch themes.

### Theme toggle
- Use `document.startViewTransition`.
  - While it runs, set `html[data-vt="theme"]` and turn off the default root crossfade: `::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal }`.
  - Animate `clip-path` on `::view-transition-new(root)` from `circle(0px at x y)` to `circle(r at x y)`, where `r = hypot(max(x, vw − x), max(y, vh − y))`. Duration 700ms, easing `--ease-theme`.
  - The origin is the click point. Keyboard triggers fall back to `(vw − 60, 30)`.
- Without View Transitions support, or under reduced motion, swap instantly.
- Persist the theme to localStorage.

### Copy email
- Use `navigator.clipboard.writeText`, falling back to a hidden textarea with `execCommand('copy')`.
- On success show the toast "Email copied to clipboard"; on failure show the email address itself.
- **Toast motion**:
  - Hidden: opacity 0 and `translate(-50%, -14px)`. Visible: opacity 1 and `translate(-50%, 0)`.
  - Transitions: opacity .3s, transform .45s `--ease-out`.
  - The toast stays visible for 2300ms.

### Contact form
There is no backend.
- Validate natively (all fields are required; email uses `type="email"`).
- On submit, build a mailto link:
  - subject: `"Portfolio inquiry" + (name ? " — " + name : "")`
  - body: `message + "\n\n— " + name + (email ? " · " + email : "")`
  - Open it with `location.href = "mailto:shehabmohsen1995@gmail.com?subject=…&body=…"`, URL-encoding both values.

### Header behaviour
- **Active section**: an IntersectionObserver over all eight sections with `rootMargin: '-45% 0px -50% 0px'`. The intersecting section becomes active.
- **Clock**: `Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hour12: false })`, refreshed every 15s.
- **Progress**: `scrollY / (scrollHeight − clientHeight)`, throttled with rAF on scroll and resize.
- **Anchors**: `html { scroll-behavior: smooth }` and `scroll-margin-top: 62px` on every section.

### Reduced motion
Applies under `prefers-reduced-motion: reduce`:
- no reveals (content is visible immediately)
- no pulse
- the preview follows the cursor instantly
- no dialog, theme or image animations
- `scroll-behavior: auto`

---

## State
- `theme: 'light' | 'dark'`: persisted; light by default.
- `hoveredProject: number | -1` and `canHover: boolean` (from the media query).
- `openProject: number | -1` and `activeImage: number`.
- `paletteOpen`, `paletteQuery`, `paletteSelection`.
- `activeSection: string`.
- `toast: { message, visible }`.
- `isWide: viewport ≥ 960` (prefer CSS media queries where possible).
- There is no data fetching. All content is static from `content.json`.

## Assets (`assets/`)
- `portrait.png`: used in About.
- Résumés: `Shehab_Mohsen_Resume_Frontend_2026.pdf` (the hero CTA, the contact link and the palette) and `Shehab_Mohsen_Resume_FullStack_2026.pdf`.
- Project screenshots. The first image of each project is its cover, used in the index preview and on touch devices.
  - GoPay: `gopay-home.png`, `gopay-dashboard.png`, `gopay-pricing.png`, `gopay-payments.png`
  - WalaPlus: `walaplus-rewards.jpg`, `walaplus-transactions.jpg`, `walaplus-home.jpg`, `walaplus-employees.jpg`
  - Fatura: `fatura-transactions.jpeg`, `fatura-order.jpeg`, `fatura-ad-builder.jpeg`, `fatura-entities.jpeg`, `fatura-collections.jpeg`
  - Møller Auto: `moller-home.jpeg`, `moller-listing.jpeg`, `moller-detail.jpeg`, `moller-modal.jpeg`, `moller-contacts.jpeg`
  - Printerbase: `printerbase-home.jpeg`, `printerbase-brands.jpeg`, `printerbase-subscription.jpeg`
  - 21 Farmer: `farmer-dashboard.jpeg`, `farmer-farms.jpeg`, `farmer-map.jpeg`
- Several screenshots are very tall full-page captures (aspect ratio as low as 0.27). Those are the ones that scroll inside the gallery frame. Captions, alt text and intrinsic sizes are in `content.json`.
- `og-image.png` shows the **old** design. Replace it with a new 1200×630 image in the Swiss style: `--bg` background, the name set in the H1 style with the accent square, and the eyebrow line.
- **Favicon** (inline SVG): a 64×64 square in `#111112`, with a 16×16 `#2443F5` square at (36, 36).

## Meta
From `content.json → meta`: the title, description, `og:type=website`, the OG title, description and image, and `twitter:card=summary_large_image`. Add `og:url` and a canonical link pointing at the deployed URL.

## Files in this bundle
- `Portfolio Swiss.dc.html`: the working HTML reference (Swiss only)
- `support.js`: the prototype runtime that the reference needs in order to run (don't port it)
- `content.json`: all copy and data
- `assets/`: images and résumé PDFs
- `CLAUDE_CODE_PROMPT.md`: the prompt for Claude Code

# Portfolio (Swiss) — implementation spec and deviations ledger

The design source of truth is `design_handoff_portfolio_swiss/`: `Portfolio Swiss.dc.html` for
look and behaviour, `README.md` for the written spec, `content.json` for every word. This file
records how the design maps onto the code and every place the build knowingly differs.

## Token map

All design tokens live in `src/app/tokens.css`; components never hard-code colours.

| Design (README) | CSS variable | Notes |
|---|---|---|
| `--bg`, `--bg2`, `--ink`, `--ink2`, `--mute`, `--line` | same names | light on `:root`, dark on `:root[data-theme='dark']` |
| `--acc`, `--acc-ink`, `--on-acc` | same names | |
| `--syn-kw`, `--syn-str`, `--syn-com` | same names | code sample in How I think |
| status green `#1FA463` | `--status` | hero pulse, portrait badge |
| Onest 300–800, `system-ui` fallback | `--font` (`next/font/google`, latin subset) | variable font, so 450/560/620/640 render exactly |
| code font stack | `--font-code` | |
| `--ease-out`, `--ease-theme`, `--ease-in` | same names | repeated in `src/lib/motion.ts` for the Web Animations API |
| preview / palette shadows | `--shadow-preview`, `--shadow-palette` | |
| container 1320, gutter `clamp(18px,4vw,40px)` | `--container`, `--gutter` | |
| section padding `clamp(64px,10vh,120px)` | `--section-pad` | Hero and Work use their own values, as specified |
| section header gap / margin | `--section-head-gap`, `--section-head-mb` | |
| H2 role `clamp(34px,4.6vw,68px)`, -0.045em | `--h2-size`, `--h2-tracking` | |
| `scroll-margin-top: 62px` | `--scroll-offset` | |
| breakpoint 960px, hover gate | literal media queries | CSS can't read variables in media queries |

Theme: `data-theme` on `<html>`, set before first paint by `src/lib/boot.ts`, persisted in
`localStorage['theme']`, light by default.

## Verification

`scripts/compare.ts` drives both pages in Chrome (serve the bundle on :4100 and the build on :3000):

- `geometry` measures every visible word on both pages and diffs position, size, type and colour.
- `shots` takes full-page side-by-sides plus a per-slice pixel diff.
- `states` drives hover, the dialog (open, image step, details) and the palette (open, filter).

Final results at 1440×900 and 390×844, light and dark:

- geometry: identical page heights; every word matches except the two Contact detail links,
  which now wrap after their slash (ledger #9).
- shots: 0.00% differing pixels in every 900px slice except the one holding the Contact details
  and form (0.25–0.46%: the GitHub link's line break and the placeholder colour, #9 and #10).
- states: palette 0.00%; hover, dialog and image states 0.03–1.2%, all from WebP vs. the
  original screenshot files, plus sub-pixel scroll rounding in the 390 dialog. Word positions in
  the dialog are identical.

## Deviations ledger

| # | What differs from the reference | Why | Status |
|---|---|---|---|
| 1 | The hero entrance (meta row, name rise, lead, CTAs) runs as CSS animations from first paint instead of being started by the IntersectionObserver. Same keyframes, durations, easing and delays (0/80/290/240/320ms, measured against the reference). Elements also in view at load (the facts grid on phones) continue the same stagger on the CSS clock. | The hero's largest text would otherwise wait for React to load, which costs Largest Contentful Paint and mobile Performance. Only visible difference: after a reload part-way down the page, scrolling back up finds the hero already settled. | Built |
| 2 | The OG image is generated with `next/og` from a static route `app/og.png/route.tsx`, not `opengraph-image.tsx`. | A static export writes `opengraph-image` without a file extension; GitHub Pages serves that as `application/octet-stream`, which Facebook, LinkedIn and X reject. | Built |
| 3 | The OG card sets the name at weight 600 (the page uses 640) and shows the status next to the eyebrow, like the hero meta row. | The image renderer can't use the variable font, and Google serves static Onest instances only at 400/600/700. | Built |
| 4 | Focus rings inside Contact use `:focus-visible` in `--on-acc` for every control. | The reference used `:focus` on three controls (a ring after every mouse click) and left the other links with the global `--acc` ring, invisible on the `--acc` background. The README asks for `--on-acc` there. | Built |
| 5 | No hover colour change on plain links. | The README's global `a:hover { color: --acc-ink }` never applies in the reference, because every link sets its own colour inline. Matched the reference, as agreed. | Agreed |
| 6 | Tabular figures only on Work's "01"; `text-wrap: balance` on every H2 except How I think and Stack; the "Contact" text CTA at weight 400 with no transition. | The README describes these more uniformly; the reference is the visual source of truth and does them this way. Matching it keeps label positions and mobile line breaks identical. | Matched reference |
| 7 | Screenshots and the portrait load as WebP variants through `srcset`, with width and height always set. The dialog's main image reserves its space before it loads. | Performance and no layout shift; 0.00% pixel difference against the originals at the diff threshold. | Built |
| 8 | Additions with no visual change: `?case=<slug>` deep links (Back closes the dialog), `aria-current` on the active nav link, `aria-modal` + focus trap + focus return for the palette, decorative icons hidden from screen readers, a `<main>` landmark. | The handoff prompt's must-haves and accessibility bar. | Built |
| 9 | The Contact detail links can break after an inner slash (a `<wbr>`; the text is unchanged). "github.com/shehab20089 ↗" now wraps as "github.com/" + "shehab20089 ↗" wherever it doesn't fit its column: 375–430px, ~600px and 1280px and up, 1440 included. | In the reference it ran past its column at those widths: up to 28px past the screen edge on phones (clipped at 375 and 390) and 12–18px into the column gap on desktop, with "↗" alone on a second line. The cell stays two lines either way, so nothing else moves. Measured at 17 widths from 360 to 1600: no overflow anywhere. | Approved by you, built |
| 10 | Contact re-maps `--mute` as `color-mix(in oklab, var(--on-acc) 78%, var(--acc))` instead of 70%. It only colours the form placeholders. | At 70% the placeholders measured 4.12:1 (light) and 4.07:1 (dark), under WCAG AA's 4.5:1; 78% gives 4.71:1 and 4.65:1, the smallest step with a safe margin. Every text run on the page now passes AA in both themes. | Approved by you, built |

No design issues are open.

## Content changes since the handoff

`content.json` started as the handoff's verbatim copy. Edits you asked for afterwards:

| Date | Section | Change |
|---|---|---|
| 2026-10-16 | Stack · Backend exposure | Added SQL, Prisma and Redis. |
| 2026-10-16 | Stack · AI tooling | Added Codex and OpenCode. Claude and Codex lead the row and are highlighted in the accent colour with the content's `==…==` marker. |
| 2026-10-16 | Selected Work | Added SparkFlow as case study 07: BitBang's internal Jira-style platform, framed as your initiative (bench time turned into a product) with your full-stack role. No live link, because the app sits behind company sign-in. |
| 2026-10-16 | Selected Work · Also shipped | Added a fourth card for the BitBang and Shamel360 marketing sites. At 1440 the grid now shows four narrower cards in one row; at 960–1300 the fourth card wraps to a second row. |
| 2026-10-16 | Case-study dialog | The counter template became `Case study {number} / {total}`, with the total counted from the projects. |
| 2026-10-16 | Selected Work | Added Amplifidor (08) and Shamel360 (09), the BitBang influencer × brand platform and the Shamel360 warehouse fulfillment portal. Each "I built" line names only the areas your commits show: Amplifidor's profile, insights, wallet and Arabic / RTL setup; Shamel's foundation, shared components, inventory stock list and product configurations and approvals. No live links, because both apps sit behind sign-in. |
| 2026-10-16 | Selected Work · Also shipped | Removed the "Amplifidor Platform" card, now case study 08. The grid is back to three cards, as in the reference. |

The reference page predates these, so `npm run compare` reports them as differences in the Stack
and Work sections, and everything below those sections shifts accordingly.

SparkFlow's five screenshots (`public/assets/sparkflow-*.png`, 1920×1200) were taken from a local
run of the SparkFlow repo against throwaway Postgres and Redis containers seeded with its demo data
(the "Acme Engineering" workspace), so no real project or client data appears. To retake them, run
SparkFlow locally with its demo seed and sign in as the seeded owner.

Amplifidor's and Shamel360's screenshots (`public/assets/amplifidor-*.png`, `shamel-*.png`) come
from each app's frontend run locally with its backend replaced: a Playwright script answered every
API call (GraphQL for Amplifidor, REST for Shamel) with invented data, such as the creator "Sara
Al-Amri" and merchants like "Noor Beauty", so no real user, client or production data appears and
no real backend was called. Neither repo was changed. A few fixes were applied only to the copy
served to the browser: Amplifidor's Insights page, which still renders the app's own placeholder
module, was given numbers consistent with the profile, and Shamel's staff avatars were passed in
the widget's pre-formatted shape so they show initials instead of empty circles. The capture
scripts stay outside this repo, because they mirror both clients' private API shapes.

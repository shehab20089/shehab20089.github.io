Implement my new personal portfolio from the design handoff in `design_handoff_portfolio_swiss/`.

The design is final. It's the **Swiss** direction: a strict grid, a neutral palette, one cobalt-blue accent (#2443F5), sharp corners, the Onest typeface, and light and dark themes. I love it, so match it exactly. Don't redesign it, restyle it or rewrite the copy. Ignore the old site in `/docs` and `Portfolio.dc.html` completely.

## Read first, in this order
1. `design_handoff_portfolio_swiss/README.md`: the full spec. It covers tokens, the layout of every section, interactions, motion timings and easings, states and assets.
2. `design_handoff_portfolio_swiss/content.json`: every piece of copy and data. Use it verbatim as the site's single content source, typed in TypeScript.
3. `design_handoff_portfolio_swiss/Portfolio Swiss.dc.html`: the working HTML reference. Serve the folder (`npx serve design_handoff_portfolio_swiss`), open it, and use it as the visual and behavioural source of truth. Its `{{ }}` templates, inline styles and `support.js` runtime exist only for the prototype: port the values and behaviour, not the runtime.

## Stack
If this repo already has a setup, follow it instead.
- Next.js (App Router) with TypeScript in strict mode, built as a static export (`output: 'export'`).
- Deploy to GitHub Pages with a GitHub Actions workflow. If this is a project site rather than `<user>.github.io`, set `basePath` and `assetPrefix`.
- Styling: CSS Modules plus one global `tokens.css` of CSS custom properties. Switch themes with `[data-theme]` on `<html>`. No UI kit and no CSS-in-JS runtime.
- Load Onest with `next/font/google`.
- Motion: IntersectionObserver plus the Web Animations API or CSS transitions, wrapped in small hooks. Don't add an animation library.
- Images:
  - Copy the bundle's `assets/` folder to `public/assets/`.
  - Add a small `sharp` script that generates WebP variants.
  - Always set width and height (taken from `content.json`).
  - Lazy-load everything below the hero.

## Must-haves
Everything below is specified in the README.
- **Sticky header**: active-section nav, a live Cairo clock, the theme toggle and a scroll-progress bar. Below 960px, a "Menu" button opens the command palette.
- **Project index**:
  - Hover (fine pointers only): other rows dim, the hovered row gets the accent underline and its name nudges right, and a floating screenshot preview follows the cursor with lerp easing and crossfades between projects.
  - Touch devices: inline covers instead.
- **Full-screen case-study dialog**:
  - A gallery with thumbnails; tall screenshots scroll inside the frame.
  - ←/→ for images; Prev, Next and "Next project" for projects; Esc to close.
  - A focus trap with focus restore, and a body scroll lock.
  - Sync the open case to `?case=<slug>`, so it's linkable and Back closes it.
- **Command palette**: opened with ⌘K, Ctrl+K or "/"; substring filter; ↑/↓/Enter; Esc to close.
- **Theme toggle**: a circular View Transitions reveal from the click point, with an instant fallback. Persist the choice and apply it before first paint, so there is no flash.
- **Contact**: copy-email with a toast, and a form that builds a `mailto:` link (no backend).
- **Motion**: scroll reveals and the staggered hero-name rise, exactly as specified. Everything is static under `prefers-reduced-motion`.
- **Responsive**: fully responsive down to 360px; every layout wraps as described.

## Quality bar
- Lighthouse on mobile: 95 or higher in Performance, Accessibility, Best Practices and SEO. No layout shift from fonts or images.
- Accessibility:
  - Semantic landmarks, and everything reachable by keyboard.
  - Visible focus: a 2px accent outline at a 3px offset.
  - WCAG AA contrast in both themes.
- Meta and SEO:
  - Meta, OG and Twitter tags from `content.json`, plus canonical and `og:url`.
  - A **new** 1200×630 OG image in the Swiss style via `opengraph-image.tsx`; the old `og-image.png` shows the previous design.
  - The SVG favicon described in the README.
- Code:
  - One component per section, plus `CaseStudyDialog`, `HoverPreview`, `CommandPalette`, `Toast` and `ThemeToggle`.
  - Shared hooks: `useReveal`, `useActiveSection`, `useScrollProgress`, `useCanHover`.
  - No dead code, no `any`.

## Process
1. Read the three files, then reply with a short plan (the file tree, the component list, and how theme and reveals work) before writing code.
2. Build section by section, top to bottom.
3. After each section, use Playwright (install it if needed) to screenshot your build and the reference side by side at 1440×900 and 390×844, in light and dark. Fix differences until they match. Also test hover, dialog, palette and theme at both sizes.
4. Add the GitHub Pages workflow. Remove the old `/docs` deploy only after the new workflow succeeds.
5. Finish with:
   - confirmation that `npm run build` passes
   - your Lighthouse scores
   - a short list of anything that doesn't match the reference, and why

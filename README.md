# Shehab Mohsen — Portfolio

A single-page portfolio, built from the Swiss design handoff in `design_handoff_portfolio_swiss/`.
Next.js (App Router) static export, TypeScript (strict), CSS Modules with one `tokens.css`, deployed
to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000 (generates WebP variants first)
```

- Copy and data: `src/content/content.json` (from the handoff; later edits are listed in
  `design/SPEC.md`), typed in `src/content/index.ts`. Wrap a word in `==…==` to set it in the accent
  colour, `**…**` for bold and `*…*` for emphasis.
- Design tokens and themes: `src/app/tokens.css`.
- One component per section in `src/components/`; shared hooks in `src/hooks/`.

## Build

```bash
npm run build      # static site in out/
npm start          # serves out/ on http://localhost:3000
npm run lint
npm run typecheck
```

`npm run images` (run automatically before `dev` and `build`) writes WebP variants of every image
in `public/assets/` at the widths in `src/lib/image-widths.ts`.

## Résumés

The two résumé PDFs in `public/assets/` (Frontend and Full-stack) are printed from
`resume/content.ts`. Edit the text there, not the PDFs, then run:

```bash
npm run resume     # needs Google Chrome; fails if either résumé runs past one page
```

## Check against the design

```bash
npx serve design_handoff_portfolio_swiss -l 4100   # the reference
npm run build && npm start                          # the build
npm run compare -- geometry                         # every word: position, size, type, colour
npm run compare -- shots                            # full-page side-by-sides in design/shots/
npm run compare -- states                           # hover, dialog and palette states
```

`design/SPEC.md` holds the token map and the deviations ledger.

## Deploy

`.github/workflows/deploy.yml` builds and publishes on every push to `main`. In the GitHub
repository, set Settings → Pages → Build and deployment → Source to **GitHub Actions**. The
workflow reads the site's base path and URL from the Pages settings, so it works as a user site
(`<user>.github.io`), a project site (`<user>.github.io/<repo>`) or on a custom domain.

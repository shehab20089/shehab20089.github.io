// Design-vs-build verification: screenshots and a geometry diff of the handoff's
// reference page against the static build, in both themes and at both target sizes.
//
// Serve both sides first:
//   npx serve design_handoff_portfolio_swiss -l 4100
//   npm run build && npm start            (the build, on :3000)
//
// Usage:
//   node scripts/compare.ts geometry [--width 1440] [--theme dark] [--zones header,top] [--limit 40]
//                                    [--state dialog]   (run a states scenario first; dialog text is zone "overlay")
//   node scripts/compare.ts shots    [--width 390]  [--theme light]
//   node scripts/compare.ts states   [--width 390]  [--theme light] [--only dialog]
//
// geometry: measures every visible word on both pages (the copy is identical, so
//   words pair up regardless of how either page structures its DOM) and prints
//   those whose position, size, type or colour differ.
// shots:    full-page screenshots, side-by-side slices and a pixel-diff score per slice.
// states:   drives hover, the case-study dialog and the command palette the same way
//   on both pages and compares viewport screenshots.
// Images land in design/shots/.
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import type { Browser, Page } from 'playwright-core';
import sharp from 'sharp';

type Side = 'design' | 'build';
type Theme = 'light' | 'dark';
interface Viewport {
  width: number;
  height: number;
}
interface TextBox {
  key: string;
  /** id of the enclosing section, or "header" / "overlay". */
  zone: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  color: string;
}
interface Word extends Omit<TextBox, 'key'> {
  word: string;
}
interface Scenario {
  name: string;
  /** Hover only exists for fine pointers, which the 390 run doesn't stand in for. */
  desktopOnly?: boolean;
  run: (page: Page) => Promise<void>;
}

const URLS: Record<Side, string> = {
  design: process.env.DESIGN_URL ?? 'http://localhost:4100/Portfolio%20Swiss.dc.html',
  build: process.env.BUILD_URL ?? 'http://localhost:3000/',
};
// The reference renders into #dc-root; its raw template stays in the DOM, hidden.
const ROOTS: Record<Side, string> = { design: '#dc-root', build: 'body' };
const OUT = 'design/shots';
const SLICE = 900;

const args = process.argv.slice(2);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const mode = args[0] && !args[0].startsWith('--') ? args[0] : 'geometry';
const viewports: Viewport[] = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
].filter((v) => !option('width') || String(v.width) === option('width'));
const themeOption = option('theme');
const themes: Theme[] = themeOption === 'light' || themeOption === 'dark' ? [themeOption] : ['light', 'dark'];
const limit = Number(option('limit') ?? 60);
const zones = option('zones')?.split(',');
const only = option('only');

const settle = (page: Page, ms = 900) => page.waitForTimeout(ms);
const openCase = (name: string) => async (page: Page) => {
  await page.getByRole('button', { name: `Open case study: ${name}` }).click();
  await page.getByRole('dialog').first().waitFor();
  await settle(page);
};

const SCENARIOS: Scenario[] = [
  {
    name: 'hover',
    desktopOnly: true,
    run: async (page) => {
      await page.getByRole('button', { name: 'Open case study: WalaPlus' }).hover();
      await settle(page, 1200);
    },
  },
  { name: 'dialog', run: openCase('GoPay') },
  {
    name: 'dialog-image',
    run: async (page) => {
      await openCase('WalaPlus')(page);
      await page.keyboard.press('ArrowRight');
      await settle(page, 600);
    },
  },
  {
    name: 'dialog-details',
    run: async (page) => {
      await openCase('Fatura')(page);
      await page.getByRole('dialog').first().evaluate((el) => el.scrollTo(0, 99999));
      await settle(page, 400);
    },
  },
  {
    name: 'palette',
    run: async (page) => {
      await page.keyboard.press('Control+k');
      await settle(page, 500);
    },
  },
  {
    name: 'palette-filter',
    run: async (page) => {
      await page.keyboard.press('Control+k');
      await settle(page, 300);
      await page.keyboard.type('st');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await settle(page, 300);
    },
  },
];

async function open(browser: Browser, side: Side, viewport: Viewport, theme: Theme): Promise<Page> {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await context.addInitScript(
    ({ isDesign, dark }) => {
      if (isDesign) localStorage.setItem('smp-v2', JSON.stringify({ dir: 'a', modes: { a: dark } }));
      else localStorage.setItem('theme', dark ? 'dark' : 'light');
    },
    { isDesign: side === 'design', dark: theme === 'dark' },
  );
  const page = await context.newPage();
  await page.goto(URLS[side], { waitUntil: 'networkidle' });
  await page.waitForSelector(`${ROOTS[side]} section#top`);
  await page.evaluate(() => document.fonts.ready);
  // Full-page shots never scroll, so lazy images below the fold would stay blank: load them all.
  await page.evaluate(() => {
    const decoded = Array.from(document.images).map((img) => {
      img.loading = 'eager';
      return img.decode().catch(() => {});
    });
    return Promise.race([Promise.all(decoded), new Promise((done) => setTimeout(done, 10000))]);
  });
  await settle(page, side === 'design' ? 900 : 300);
  // Freeze the live Cairo clock so both sides show the same time.
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('span')) {
      if (/^(\d\d:\d\d|--:--)$/.test(el.textContent ?? '')) el.textContent = '12:00';
    }
  });
  return page;
}

/**
 * Every visible word with its glyph box. Words, not elements: the reference runtime
 * splits strings at its template holes and wraps them in extra inline elements, so
 * element boxes and text nodes don't line up between the two pages, but words do.
 * Keys are numbered by occurrence within the requested zones.
 */
async function collectText(page: Page, root: string): Promise<TextBox[]> {
  const words = await page.evaluate((rootSelector) => {
    const out: Word[] = [];
    const scope = document.querySelector(rootSelector) ?? document.body;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      const text = node.textContent ?? '';
      if (!parent || !text.trim() || parent.closest('script, style')) continue;
      const style = getComputedStyle(parent);
      if (style.visibility === 'hidden') continue;
      const zone = parent.closest('[role="dialog"]')
        ? 'overlay'
        : parent.closest('section')?.id || (parent.closest('header') ? 'header' : 'overlay');
      for (const match of text.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const r = range.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        out.push({
          word: match[0],
          zone,
          x: r.left + scrollX,
          y: r.top + scrollY,
          w: r.width,
          h: r.height,
          type: `${style.fontSize}/${style.lineHeight} w${style.fontWeight} ls${style.letterSpacing} ${/onest/i.test(style.fontFamily) ? 'Onest' : style.fontFamily}`,
          color: style.color,
        });
      }
    }
    return out;
  }, root);

  const seen = new Map<string, number>();
  return words
    .filter((w) => !zones || zones.includes(w.zone))
    .map(({ word, ...box }) => {
      const count = (seen.get(word) ?? 0) + 1;
      seen.set(word, count);
      return { ...box, key: count > 1 ? `${word} #${count}` : word };
    });
}

const round = (n: number) => Math.round(n * 10) / 10;
const short = (s: string) => (s.length > 48 ? `${s.slice(0, 45)}…` : s);

async function geometry(browser: Browser, viewport: Viewport, theme: Theme) {
  const design = await open(browser, 'design', viewport, theme);
  const build = await open(browser, 'build', viewport, theme);
  const state = SCENARIOS.find((s) => s.name === option('state'));
  if (state) await Promise.all([state.run(design), state.run(build)]);
  const [a, b] = await Promise.all([collectText(design, ROOTS.design), collectText(build, ROOTS.build)]);
  const heights = await Promise.all([design, build].map((p) => p.evaluate(() => document.documentElement.scrollHeight)));
  await Promise.all([design.context().close(), build.context().close()]);

  const byKey = new Map(b.map((row) => [row.key, row]));
  const lines: string[] = [];
  for (const d of a) {
    const i = byKey.get(d.key);
    if (!i) {
      lines.push(`  MISSING in build: "${short(d.key)}"`);
      continue;
    }
    byKey.delete(d.key);
    const diffs: string[] = [];
    for (const k of ['x', 'y', 'w', 'h'] as const) {
      if (Math.abs(d[k] - i[k]) > 0.5) diffs.push(`${k} ${round(d[k])}→${round(i[k])}`);
    }
    if (d.type !== i.type) diffs.push(`type ${d.type} → ${i.type}`);
    if (d.color !== i.color) diffs.push(`color ${d.color} → ${i.color}`);
    if (diffs.length) lines.push(`  "${short(d.key)}": ${diffs.join(', ')}`);
  }
  for (const extra of byKey.keys()) lines.push(`  EXTRA in build: "${short(extra)}"`);

  console.log(`\n== geometry ${viewport.width}x${viewport.height} ${theme}: page height ${heights[0]} → ${heights[1]}, ${lines.length} difference(s) of ${a.length} words`);
  for (const line of lines.slice(0, limit)) console.log(line);
  if (lines.length > limit) console.log(`  … ${lines.length - limit} more (raise --limit)`);
}

/** Writes design|build side-by-side slices and returns the differing-pixel share of each slice. */
async function sideBySide(files: Record<Side, string>, name: string, width: number): Promise<string[]> {
  const [d, b] = await Promise.all([
    sharp(files.design).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(files.build).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  ]);
  const height = Math.max(d.info.height, b.info.height);
  const scores: string[] = [];
  for (let top = 0, n = 1; top < height; top += SLICE, n++) {
    const sliceHeight = Math.min(SLICE, height - top);
    let differing = 0;
    for (let y = top; y < top + sliceHeight; y++) {
      for (let x = 0; x < width; x++) {
        if (y >= d.info.height || y >= b.info.height) {
          differing++;
          continue;
        }
        // Full-page shots can be wider than the viewport when a page overflows, so index each by its own width.
        const od = (y * d.info.width + x) * 4;
        const ob = (y * b.info.width + x) * 4;
        const delta = Math.max(
          Math.abs((d.data[od] ?? 0) - (b.data[ob] ?? 0)),
          Math.abs((d.data[od + 1] ?? 0) - (b.data[ob + 1] ?? 0)),
          Math.abs((d.data[od + 2] ?? 0) - (b.data[ob + 2] ?? 0)),
        );
        if (delta > 24) differing++;
      }
    }
    const crop = (file: string, imageHeight: number) =>
      top < imageHeight
        ? sharp(file)
            .extract({ left: 0, top, width, height: Math.min(sliceHeight, imageHeight - top) })
            .toBuffer()
        : null;
    const [left, right] = await Promise.all([crop(files.design, d.info.height), crop(files.build, b.info.height)]);
    const gap = 16;
    const layers = [
      ...(left ? [{ input: left, left: 0, top: 0 }] : []),
      ...(right ? [{ input: right, left: width + gap, top: 0 }] : []),
    ];
    const suffix = height > SLICE ? `-${String(n).padStart(2, '0')}` : '';
    await sharp({ create: { width: width * 2 + gap, height: sliceHeight, channels: 4, background: '#ff00ff' } })
      .composite(layers)
      .png()
      .toFile(path.join(OUT, `${name}-sbs${suffix}.png`));
    scores.push(`${n}:${((differing / (width * sliceHeight)) * 100).toFixed(2)}%`);
  }
  return scores;
}

async function shots(browser: Browser, viewport: Viewport, theme: Theme) {
  const name = `${viewport.width}-${theme}`;
  const files: Record<Side, string> = {
    design: path.join(OUT, `${name}-design.png`),
    build: path.join(OUT, `${name}-build.png`),
  };
  const heights: number[] = [];
  for (const side of ['design', 'build'] as const) {
    const page = await open(browser, side, viewport, theme);
    await page.screenshot({ path: files[side], fullPage: true });
    heights.push(await page.evaluate(() => document.documentElement.scrollHeight));
    await page.context().close();
  }
  const scores = await sideBySide(files, name, viewport.width);
  console.log(`== shots ${name}: heights ${heights.join(' → ')}; differing pixels per ${SLICE}px slice: ${scores.join('  ')}`);
}

async function states(browser: Browser, viewport: Viewport, theme: Theme) {
  for (const scenario of SCENARIOS) {
    if ((only && scenario.name !== only) || (scenario.desktopOnly && viewport.width < 960)) continue;
    const name = `state-${scenario.name}-${viewport.width}-${theme}`;
    const files: Record<Side, string> = {
      design: path.join(OUT, `${name}-design.png`),
      build: path.join(OUT, `${name}-build.png`),
    };
    for (const side of ['design', 'build'] as const) {
      const page = await open(browser, side, viewport, theme);
      await scenario.run(page);
      await page.screenshot({ path: files[side] });
      await page.context().close();
    }
    const [score] = await sideBySide(files, name, viewport.width);
    console.log(`== state ${scenario.name} ${viewport.width} ${theme}: ${score?.slice(2)} differing pixels`);
  }
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const viewport of viewports) {
    for (const theme of themes) {
      if (mode === 'shots') await shots(browser, viewport, theme);
      else if (mode === 'states') await states(browser, viewport, theme);
      else await geometry(browser, viewport, theme);
    }
  }
} finally {
  await browser.close();
}

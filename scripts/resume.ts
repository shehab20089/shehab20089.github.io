// Prints the two résumé PDFs in public/assets from resume/content.ts, in the
// layout of the v3 résumé (dark masthead, numbered sections, a skills grid) with
// the site's blue. US Letter, at most two pages each, real text and links, so
// ATS parsers and screen readers can read them.
//
// Usage: node scripts/resume.ts   (needs Google Chrome and a network connection
// for the Google Fonts, like scripts/compare.ts)
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { contact, education, resumes, type Feature, type Resume, type Role } from '../resume/content.ts';

const MAX_PAGES = 2;

const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Hyphenated words never split across lines, so text pulled out of the PDF (by an
// ATS, say) reads "e-commerce" rather than "e- commerce" or "ecommerce".
const keepHyphens = (html: string) => html.replace(/[\w./]+(?:-[\w./]+)+/g, (word) => `<span class="nw">${word}</span>`);
// Body copy: **bold** markers become <strong>.
const rich = (text: string) =>
  text
    .split('**')
    .map((part, i) => (i % 2 ? `<strong>${keepHyphens(esc(part))}</strong>` : keepHyphens(esc(part))))
    .join('');
const link = ({ label, href }: { label: string; href: string }) => `<a href="${esc(href)}">${esc(label)}</a>`;

// Colours are the site's tokens: --ink, --mute, --acc, and the dark theme's
// --acc-ink for blue text on the dark masthead.
const css = `
  @page { size: letter; margin: 32pt 40pt 30pt; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Archivo, Arial, sans-serif; font-size: 9.5pt; line-height: 1.42; word-spacing: 0.04em; color: #111112;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  a { color: inherit; text-decoration: none; }
  strong { font-weight: 650; }
  .nw { white-space: nowrap; }
  .mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

  .masthead { background: #111112; color: #f1f1ee; padding: 18pt 22pt 13pt; }
  h1 { font-family: 'Archivo Black', Arial, sans-serif; font-weight: 400; font-size: 32pt; line-height: 1; text-transform: uppercase; }
  .headline {
    margin-top: 9pt; padding-bottom: 11pt; border-bottom: 0.75pt solid rgba(241, 241, 238, .28);
    font-weight: 600; font-size: 9pt; letter-spacing: 0.12em; text-transform: uppercase; color: #8196ff;
  }
  .contact { display: flex; flex-wrap: wrap; gap: 3pt 16pt; margin-top: 9pt; font-size: 8pt; color: #d6d6d2; }

  h2 {
    display: flex; align-items: center; gap: 8pt; margin: 13pt 0 8pt; break-after: avoid;
    font-family: 'Archivo Black', Arial, sans-serif; font-weight: 400; font-size: 13pt; letter-spacing: 0.03em; text-transform: uppercase;
  }
  h2 span { color: #2443f5; }
  h2::after { content: ''; flex: 1; border-top: 2.5pt solid #111112; }
  .summary { font-size: 10pt; line-height: 1.5; }

  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7pt 24pt; }
  .cell { border-top: 1.75pt solid #111112; padding-top: 5pt; break-inside: avoid; }
  .label { margin-bottom: 2pt; font-weight: 600; font-size: 7pt; letter-spacing: 0.12em; text-transform: uppercase; color: #2443f5; }

  .role { padding: 7pt 0 8pt; border-bottom: 0.75pt solid rgba(17, 17, 18, .16); }
  .role:first-of-type { padding-top: 0; }
  .role:last-of-type { border-bottom: 0; padding-bottom: 0; }
  .role-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; break-after: avoid; }
  .title { font-weight: 600; font-size: 11.5pt; }
  .title small { font-weight: 400; font-size: 9pt; color: #67676d; }
  .dates { white-space: nowrap; font-size: 7.5pt; letter-spacing: 0.08em; text-transform: uppercase; color: #67676d; }
  .badge {
    margin-left: 8pt; padding: 1.5pt 5pt; background: #2443f5; color: #fff;
    font-weight: 600; font-size: 7pt; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .company { margin: 1pt 0 5pt; color: #67676d; break-after: avoid; }
  .company b { font-weight: 600; color: #2443f5; }
  ul { list-style: none; }
  li { position: relative; margin-top: 2.5pt; padding-left: 14pt; break-inside: avoid; }
  li::before { content: ''; position: absolute; left: 2pt; top: 4.75pt; width: 4pt; height: 4pt; background: #2443f5; }

  .feature { margin: 4pt 0 6pt; padding: 9pt 13pt 10pt; background: #111112; color: #f1f1ee; break-inside: avoid; }
  .feature-head { display: flex; justify-content: space-between; align-items: baseline; }
  .feature-head b { font-weight: 700; font-size: 11pt; }
  .feature-head span { font-weight: 600; font-size: 7pt; letter-spacing: 0.12em; text-transform: uppercase; color: #8196ff; }
  .feature-stack { margin: 3pt 0 3pt; font-size: 7.5pt; line-height: 1.45; color: #a9a9ad; }
  .feature li::before { background: #8196ff; }

  .edu-head { display: flex; justify-content: space-between; gap: 8pt; font-weight: 600; font-size: 10pt; }
  .edu-head span { font-weight: 400; font-size: 7.5pt; color: #67676d; }
  .edu p { margin-top: 2pt; font-size: 9pt; color: #67676d; }

  footer {
    display: flex; justify-content: space-between; margin-top: 12pt; padding-top: 6pt; border-top: 1.75pt solid #111112; break-inside: avoid;
    font-size: 7pt; letter-spacing: 0.12em; text-transform: uppercase; color: #67676d;
  }
  footer i { display: inline-block; width: 6pt; height: 6pt; margin-left: 6pt; background: #2443f5; vertical-align: -0.5pt; }
`;

const section = (n: number, title: string, body: string) =>
  `<section><h2><span>${String(n).padStart(2, '0')}/</span>${esc(title)}</h2>${body}</section>`;

const bullets = (items: string[]) => `<ul>${items.map((item) => `<li>${rich(item)}</li>`).join('')}</ul>`;

const feature = (f: Feature) =>
  `<div class="feature">
    <div class="feature-head"><b>${esc(f.name)}</b><span class="mono">${esc(f.tag)}</span></div>
    <p class="feature-stack mono">${esc(f.stack)}</p>
    ${bullets(f.bullets)}
  </div>`;

const role = (r: Role) =>
  `<div class="role">
    <div class="role-head">
      <p class="title">${esc(r.title)}${r.note ? ` <small>${esc(r.note)}</small>` : ''}</p>
      <p class="dates mono">${esc(r.dates)}${r.current ? '<span class="badge">Current</span>' : ''}</p>
    </div>
    <p class="company"><b>${esc(r.company)}</b> · ${esc(r.place)}</p>
    ${r.feature ? feature(r.feature) : ''}
    ${bullets(r.bullets)}
  </div>`;

function html(resume: Resume): string {
  const skills = resume.skills
    .map(([label, value]) => `<div class="cell"><p class="label mono">${esc(label)}</p><p>${rich(value)}</p></div>`)
    .join('');
  const schools = education
    .map(
      ([school, detail, year]) =>
        `<div class="cell edu"><p class="edu-head">${esc(school)}<span class="mono">${esc(year)}</span></p><p>${esc(detail)}</p></div>`,
    )
    .join('');
  const contactItems = [link(contact.email), link(contact.phone), esc(contact.location), link(contact.github), link(contact.linkedin)];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(contact.name)} — ${esc(resume.headline)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Archivo+Black&family=IBM+Plex+Mono:wght@400;600&display=block">
<style>${css}</style>
</head>
<body>
<header class="masthead">
  <h1>${esc(contact.name)}</h1>
  <p class="headline mono">${esc(resume.headline)}</p>
  <p class="contact mono">${contactItems.map((item) => `<span>${item}</span>`).join('')}</p>
</header>
${section(1, 'Summary', `<p class="summary">${rich(resume.summary)}</p>`)}
${section(2, 'Core skills', `<div class="grid">${skills}</div>`)}
${section(3, 'Experience', resume.experience.map(role).join(''))}
${section(4, 'Education', `<div class="grid">${schools}</div>`)}
<footer class="mono"><span>${esc(contact.name)} — ${esc(resume.headline)}</span><span>CV / 2026<i></i></span></footer>
</body>
</html>`;
}

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
try {
  for (const resume of resumes) {
    await page.setContent(html(resume), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const loaded = await page.evaluate(() =>
      ['12pt "Archivo"', '600 12pt "Archivo"', '12pt "Archivo Black"', '12pt "IBM Plex Mono"'].every((font) => document.fonts.check(font)),
    );
    if (!loaded) throw new Error('The résumé fonts did not load from Google Fonts; check the network and try again.');
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true });
    const pages = pdf.toString('latin1').match(/\/Type\s*\/Page\b(?!s)/g)?.length ?? 0;
    if (pages < 1 || pages > MAX_PAGES) throw new Error(`${resume.file} prints on ${pages} pages; trim it to ${MAX_PAGES}.`);
    await writeFile(path.resolve('public', resume.file), pdf);
    console.log(`resume: wrote public/${resume.file} (${pages} page${pages > 1 ? 's' : ''})`);
  }
} finally {
  await browser.close();
}

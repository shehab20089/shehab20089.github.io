// Prints the two résumé PDFs in public/assets from resume/content.ts, in the
// layout of the original Word files: US Letter, Arial, one page each, real text
// and links (so ATS parsers and screen readers can read them).
//
// Usage: node scripts/resume.ts   (needs Google Chrome, like scripts/compare.ts)
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { contact, education, resumes, type Resume } from '../resume/content.ts';

// Word's "  |  " separator, as HTML: the non-breaking spaces keep both gaps from collapsing.
const SEP = '&nbsp; |&nbsp; ';

const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Body copy: hyphenated words never split across lines, so text pulled out of the
// PDF (by an ATS, say) reads "e-commerce" rather than "e- commerce" or "ecommerce".
const prose = (text: string) => esc(text).replace(/[\w./]+(?:-[\w./]+)+/g, (word) => `<span class="nw">${word}</span>`);
const link = ({ label, href }: { label: string; href: string }) => `<a href="${esc(href)}">${esc(label)}</a>`;

// Sizes, colours, spacing and indents are the Word file's own (twips and
// half-points converted to points).
const css = `
  @page { size: letter; margin: 0.45in 0.63in 0.42in 0.63in; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, 'Liberation Sans', Helvetica, sans-serif; font-size: 9pt; line-height: 1.15; color: #000; }
  a { color: #1e437c; text-decoration: none; }
  h1 { font-size: 22pt; color: #1e437c; }
  .headline { font-size: 11.5pt; font-weight: 700; }
  .contact { color: #5a5a5a; }
  .contact + .contact { margin-bottom: 4pt; }
  h2 { font-size: 11pt; color: #1e437c; margin: 1pt 0; padding-bottom: 1pt; border-bottom: 0.875pt solid #1e437c; }
  .summary { font-size: 9.5pt; margin-bottom: 1pt; }
  h3 { font-size: 10pt; margin-top: 2pt; }
  .bullet { padding-left: 10.1pt; text-indent: -7.9pt; }
  .dot { display: inline-block; width: 7.9pt; text-indent: 0; }
  .nw { white-space: nowrap; }
`;

function html(resume: Resume): string {
  const roles = resume.experience
    .map(
      (role) =>
        `<h3>${[role.title, role.company, role.dates].map(esc).join(SEP)}</h3>` +
        role.bullets.map((bullet) => `<p class="bullet"><span class="dot">•</span>${prose(bullet)}</p>`).join(''),
    )
    .join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(contact.name)} — ${esc(resume.headline)}</title>
<style>${css}</style>
</head>
<body>
<h1>${esc(contact.name)}</h1>
<p class="headline">${esc(resume.headline)}</p>
<p class="contact">${[contact.location, contact.email, contact.phone].map(esc).join(SEP)}</p>
<p class="contact">GitHub: ${link(contact.github)}${SEP}LinkedIn: ${link(contact.linkedin)}</p>
<h2>SUMMARY</h2>
<p class="summary">${prose(resume.summary)}</p>
<h2>CORE SKILLS</h2>
${resume.skills.map(([label, value]) => `<p><b>${esc(label)}:</b> ${prose(value)}</p>`).join('')}
<h2>EXPERIENCE</h2>
${roles}
<h2>EDUCATION</h2>
${education.map((entry) => `<p>${entry.map(esc).join(SEP)}</p>`).join('')}
</body>
</html>`;
}

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
try {
  for (const resume of resumes) {
    await page.setContent(html(resume), { waitUntil: 'load' });
    const pdf = await page.pdf({ preferCSSPageSize: true, tagged: true });
    const pages = pdf.toString('latin1').match(/\/Type\s*\/Page\b(?!s)/g)?.length ?? 0;
    if (pages !== 1) throw new Error(`${resume.file} prints on ${pages} pages; trim it to fit one.`);
    await writeFile(path.resolve('public', resume.file), pdf);
    console.log(`resume: wrote public/${resume.file}`);
  }
} finally {
  await browser.close();
}

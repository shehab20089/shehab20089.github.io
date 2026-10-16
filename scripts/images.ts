// Writes the WebP variants the site's srcsets point at: every PNG/JPEG in
// public/assets at each width from src/lib/image-widths.ts. Up-to-date files
// are skipped, so this is cheap to run before every dev session and build.
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { variantPath, variantWidths } from '../src/lib/image-widths.ts';

const dir = path.resolve('public');
const sources = (await readdir(path.join(dir, 'assets'))).filter((f) => /\.(png|jpe?g)$/i.test(f));

async function isFresh(file: string, sourceTime: number): Promise<boolean> {
  try {
    return (await stat(file)).mtimeMs >= sourceTime;
  } catch {
    return false;
  }
}

let written = 0;
for (const name of sources) {
  const src = `assets/${name}`;
  const file = path.join(dir, src);
  const { width } = await sharp(file).metadata();
  const sourceTime = (await stat(file)).mtimeMs;
  for (const w of variantWidths(width)) {
    const out = path.join(dir, variantPath(src, w));
    if (await isFresh(out, sourceTime)) continue;
    await sharp(file).resize({ width: w }).webp({ quality: 82 }).toFile(out);
    written++;
  }
}
console.log(`images: ${written} WebP variant(s) written for ${sources.length} source images`);

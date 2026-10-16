import { ImageResponse } from 'next/og';
import { content } from '@/content';
import { OG_IMAGE } from '@/lib/og-image';

// The 1200×630 social card, in the Swiss style: the hero's meta row and the name
// set like the H1, accent square included. Rendered once at build time.
//
// It's a static route rather than the opengraph-image.tsx convention because a
// static export writes that one without a file extension, and GitHub Pages then
// serves it as application/octet-stream, which social crawlers reject.
export const dynamic = 'force-static';

const { hero } = content;
const [firstName, lastName] = hero.nameLines;
const NAME_SIZE = 220;

/**
 * Onest as TTF, subset to the characters on the card. The image renderer can't
 * read the site's variable WOFF2, and Google serves static instances only at
 * standard weights, so the name uses 600, the nearest to the page's 640.
 */
async function loadOnest(weights: number[], text: string) {
  const query = `family=Onest:wght@${weights.join(';')}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text();
  const faces = [...css.matchAll(/font-weight: (\d+);\s*src: url\((.+?)\) format\('(?:truetype|opentype)'\)/g)];
  if (faces.length !== weights.length) throw new Error('og.png: could not load Onest from Google Fonts');
  return Promise.all(
    faces.map(async ([, weight, url]) => ({
      name: 'Onest',
      weight: Number(weight) as 400 | 600,
      style: 'normal' as const,
      data: await (await fetch(url ?? '')).arrayBuffer(),
    })),
  );
}

export async function GET() {
  const fonts = await loadOnest([400, 600], `${hero.eyebrow}${hero.status}${firstName}${lastName}`);
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px 58px',
          background: '#F3F3F1',
          color: '#111112',
          fontFamily: 'Onest',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 22,
            borderBottom: '2px solid rgba(17,17,18,.14)',
            fontSize: 22,
            color: '#3B3B3F',
          }}
        >
          <span>{hero.eyebrow}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: '#1FA463' }} />
            {hero.status}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: NAME_SIZE,
            fontWeight: 600,
            lineHeight: 0.88,
            letterSpacing: -0.055 * NAME_SIZE,
          }}
        >
          <span>{firstName}</span>
          <span style={{ display: 'flex', alignItems: 'flex-end', paddingLeft: '22%' }}>
            {lastName}
            <span
              style={{
                width: 0.15 * NAME_SIZE,
                height: 0.15 * NAME_SIZE,
                marginLeft: 0.08 * NAME_SIZE,
                marginBottom: 0.14 * NAME_SIZE,
                background: '#2443F5',
              }}
            />
          </span>
        </div>
      </div>
    ),
    { width: OG_IMAGE.width, height: OG_IMAGE.height, fonts },
  );
}

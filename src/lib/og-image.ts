import { content } from '@/content';

/** The social card rendered by app/og.png/route.tsx. The URL is relative so it resolves under the base path. */
export const OG_IMAGE = {
  url: 'og.png',
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: content.meta.ogTitle,
};

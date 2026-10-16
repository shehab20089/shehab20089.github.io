import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { content, oneOf } from '@/content';
import { bootScript } from '@/lib/boot';
import { OG_IMAGE } from '@/lib/og-image';
import { onest } from './fonts';
import './tokens.css';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000/';
const { meta } = content;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: meta.title,
  description: meta.description,
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: meta.ogTitle,
    description: meta.ogDescription,
    images: [OG_IMAGE],
  },
  twitter: {
    card: oneOf(meta.twitterCard, ['summary_large_image']),
    title: meta.ogTitle,
    description: meta.ogDescription,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The boot script sets data-theme and data-reveal-state before hydration.
    <html lang={meta.lang} data-theme="light" className={onest.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { NextConfig } from 'next';

// GitHub Pages serves project sites from /<repo>. The deploy workflow passes that
// prefix and the public URL in; local builds run at the root of localhost.
const basePath = process.env.BASE_PATH ?? '';
const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`,
    // Umami Cloud website ID; empty means no analytics (see src/lib/analytics.ts).
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.UMAMI_WEBSITE_ID ?? '',
  },
};

export default nextConfig;

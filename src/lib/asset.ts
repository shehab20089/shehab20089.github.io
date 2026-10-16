const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Public URL of a file in /public, e.g. "assets/portrait.png", including the GitHub Pages base path. */
export function asset(path: string): string {
  return `${basePath}/${path.replace(/^\/+/, '')}`;
}

/** content.json hrefs are anchors, absolute URLs or site-relative files; only the last need the base path. */
export function resolveHref(href: string): string {
  return /^(#|[a-z]+:)/i.test(href) ? href : asset(href);
}

/** "assets/Shehab_Mohsen_Resume_Frontend_2026.pdf" → "Shehab_Mohsen_Resume_Frontend_2026.pdf" */
export function fileName(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

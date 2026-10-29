// Visit stats with Umami Cloud: no cookies, so no consent banner. Its ~2 KB script loads
// only on the live site, after the page has finished loading and the browser is idle, so it
// never competes with the first paint or with input. Without UMAMI_WEBSITE_ID (a GitHub
// Actions variable, see README) nothing loads and every call here is a no-op.

const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? '';
const SCRIPT_SRC = 'https://cloud.umami.is/script.js';
// The deployed site's host. Local builds use localhost, so they never count.
const LIVE_HOST = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000/').hostname;

type EventData = Record<string, string>;

declare global {
  interface Window {
    umami?: { track(event: string, data?: EventData): void };
  }
}

// Events from before the script arrives (a click in the first second or two) wait here.
const queue: [string, EventData | undefined][] = [];

const enabled = () => WEBSITE_ID !== '' && LIVE_HOST !== 'localhost' && location.hostname === LIVE_HOST;

/** Records a custom event, e.g. track('Download CV', { version: 'Frontend', from: 'contact' }). */
export function track(event: string, data?: EventData) {
  if (!enabled()) return;
  if (window.umami) window.umami.track(event, data);
  else queue.push([event, data]);
}

/** Loads the tracker once the page is idle, and counts CV downloads, email links and outbound links. */
export function loadAnalytics() {
  if (!enabled() || document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
  const inject = () => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.defer = true;
    script.dataset.websiteId = WEBSITE_ID;
    script.dataset.domains = LIVE_HOST;
    script.onload = () => {
      for (const [event, data] of queue.splice(0)) window.umami?.track(event, data);
    };
    document.head.append(script);
  };
  const whenIdle = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(inject, { timeout: 5000 });
    else setTimeout(inject, 1500);
  };
  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });
  document.addEventListener('click', trackLink, { capture: true });
}

// One listener for every link: the hero, Contact and command-menu downloads all go through <a download>.
function trackLink(event: MouseEvent) {
  const link = event.target instanceof Element ? event.target.closest('a') : null;
  if (!link) return;
  const href = link.getAttribute('href') ?? '';
  const from = link.closest('section[id]')?.id ?? (link.closest('[role="dialog"]') ? 'case study' : 'menu');
  if (link.hasAttribute('download')) {
    track('Download CV', { version: /fullstack/i.test(href) ? 'Full-stack' : 'Frontend', from });
  } else if (href.startsWith('mailto:')) {
    track('Email link', { from });
  } else if (/^https?:\/\//.test(href)) {
    const url = new URL(href);
    if (url.hostname !== location.hostname) track('Outbound link', { url: `${url.hostname}${url.pathname}`.replace(/\/$/, ''), from });
  }
}

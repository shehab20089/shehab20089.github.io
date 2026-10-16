import { EASE_THEME, prefersReducedMotion } from './motion';

export const THEME_KEY = 'theme';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage is blocked (private mode, policy): the theme still applies for this visit.
  }
}

/**
 * Flips light/dark. With View Transitions the new theme is revealed as a circle
 * growing from `origin` (the click point). Keyboard and palette triggers have no
 * pointer position and fall back to the top-right corner, as in the reference.
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const next: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  if (!('startViewTransition' in document) || prefersReducedMotion()) {
    applyTheme(next);
    return;
  }
  const x = origin?.x || window.innerWidth - 60;
  const y = origin?.y || 30;
  root.dataset.vt = 'theme';
  const transition = document.startViewTransition(() => applyTheme(next));
  transition.ready
    .then(() => {
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: EASE_THEME, pseudoElement: '::view-transition-new(root)' },
      );
    })
    // A skipped transition rejects `ready`; the new theme has been applied regardless.
    .catch(() => {});
  const cleanUp = () => delete root.dataset.vt;
  transition.finished.then(cleanUp, cleanUp);
}

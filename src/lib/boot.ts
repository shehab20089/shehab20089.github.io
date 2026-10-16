import { THEME_KEY } from './theme';

/**
 * Inlined into <head>, so it runs before first paint:
 * - applies the saved theme, so returning dark-mode visitors never see a light flash;
 * - arms the hidden starting state of scroll reveals. Content only starts hidden
 *   when scripts run, and if the app never boots the failsafe shows it anyway.
 * Serialised with toString(), so it must not reference anything outside itself.
 */
function boot(themeKey: string) {
  const root = document.documentElement;
  try {
    const saved = localStorage.getItem(themeKey);
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch {
    // Storage is blocked: keep the default light theme.
  }
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.dataset.revealState = 'pending';
    addEventListener('load', () => {
      setTimeout(() => {
        if (root.dataset.revealState === 'pending') delete root.dataset.revealState;
      }, 3000);
    });
  }
}

export const bootScript = `(${boot.toString()})(${JSON.stringify(THEME_KEY)})`;

// Easings from tokens.css, repeated here because the Web Animations API can't read CSS variables.
export const EASE_OUT = 'cubic-bezier(.2,.75,.1,1)';
export const EASE_THEME = 'cubic-bezier(.65,0,.25,1)';
export const EASE_IN = 'cubic-bezier(.4,0,1,1)';

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

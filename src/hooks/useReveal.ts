'use client';

import { useEffect } from 'react';
import { EASE_OUT } from '@/lib/motion';

const STAGGER = 80;
const MAX_DELAY = 480;

/**
 * Scroll reveals for every [data-reveal] element, as in the reference: one shared
 * IntersectionObserver, so elements entering in the same callback stagger by 80ms
 * (capped at 480ms). Each element plays once and is marked data-played, so
 * re-renders and theme switches never replay or re-hide it.
 *
 * The hero's entrance ([data-entrance]) runs in CSS from first paint instead, so
 * it never waits for JavaScript. It still takes its places in the stagger: when
 * it is in a batch, the rest of that batch is timed against its animation clock,
 * exactly as if the observer had started it.
 *
 * The boot script arms the hidden state (data-reveal-state="pending"); without it
 * (reduced motion, no IntersectionObserver, or the failsafe fired) nothing is
 * hidden and there is nothing to do.
 */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.revealState) return;
    root.dataset.revealState = 'live';

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target)
          .filter((target) => target instanceof HTMLElement);
        const entrance = entering.find((el) => el.hasAttribute('data-entrance'));
        const elapsed = entrance ? cssClock(entrance) : 0;
        entering.forEach((el, k) => {
          observer.unobserve(el);
          if (!el.hasAttribute('data-entrance')) play(el, Math.max(0, Math.min(k * STAGGER, MAX_DELAY) - elapsed));
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    );
    document.querySelectorAll('[data-reveal]:not([data-played]), [data-entrance]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/** How long an element's CSS animation has been running; Infinity once it has finished. */
function cssClock(el: HTMLElement): number {
  const time = el.getAnimations()[0]?.currentTime;
  return typeof time === 'number' ? time : Infinity;
}

function play(el: HTMLElement, delay: number) {
  el.dataset.played = '';
  el.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], {
    duration: 900,
    delay,
    easing: EASE_OUT,
    fill: 'backwards',
  });
}

'use client';

import { useEffect, useRef } from 'react';

/**
 * Drives a progress bar from page scroll: attach the returned ref and the
 * element's transform becomes scaleX(progress). Updates are rAF-throttled and
 * written straight to the DOM, so scrolling never re-renders React.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight || 1;
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      if (ref.current) ref.current.style.transform = `scaleX(${progress.toFixed(4)})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return ref;
}

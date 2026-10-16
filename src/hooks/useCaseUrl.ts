'use client';

import { useEffect, useRef } from 'react';
import { content } from '@/content';
import { getUi, ui, useUi } from '@/lib/ui-store';

const PARAM = 'case';

/**
 * Mirrors the open case study in ?case=<slug>. A deep link opens it on load;
 * opening from the page pushes a history entry, so Back closes the dialog, and
 * switching projects replaces that entry rather than stacking more.
 */
export function useCaseUrl() {
  const openCase = useUi((s) => s.openCase);
  const pushed = useRef(false);
  const previous = useRef(-1);

  useEffect(() => {
    const sync = () => {
      const slug = new URLSearchParams(window.location.search).get(PARAM);
      const index = content.projects.findIndex((project) => project.slug === slug);
      const current = getUi().openCase;
      if (index >= 0 && index !== current) {
        ui.openCase(index);
      } else if (index < 0 && current >= 0) {
        pushed.current = false;
        ui.requestClose();
      }
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  useEffect(() => {
    const before = previous.current;
    previous.current = openCase;
    const url = new URL(window.location.href);
    const slugInUrl = url.searchParams.get(PARAM);

    if (openCase >= 0) {
      const slug = content.projects[openCase]?.slug;
      if (!slug || slug === slugInUrl) return;
      url.searchParams.set(PARAM, slug);
      if (before < 0) {
        window.history.pushState(null, '', url);
        pushed.current = true;
      } else {
        window.history.replaceState(null, '', url);
      }
    } else if (before >= 0 && slugInUrl) {
      if (pushed.current) {
        pushed.current = false;
        window.history.back();
      } else {
        url.searchParams.delete(PARAM);
        window.history.replaceState(null, '', url);
      }
    }
  }, [openCase]);
}

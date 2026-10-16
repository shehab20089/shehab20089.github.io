'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { CaseStudyDialog } from '@/components/CaseStudyDialog/CaseStudyDialog';
import { CommandPalette } from '@/components/CommandPalette/CommandPalette';
import { HoverPreview } from '@/components/HoverPreview/HoverPreview';
import { Toast } from '@/components/Toast/Toast';
import { useCaseUrl } from '@/hooks/useCaseUrl';
import { useReveal } from '@/hooks/useReveal';
import { getUi, ui, useUi } from '@/lib/ui-store';

/** Client root: page-wide behaviours, and the overlays that sit above the sections. */
export function SiteShell({ children }: { children: ReactNode }) {
  useReveal();
  useCaseUrl();
  useShortcuts();
  useScrollLock(useUi((s) => s.openCase >= 0 || s.paletteOpen));

  return (
    <>
      {children}
      <HoverPreview />
      <CaseStudyDialog />
      <CommandPalette />
      <Toast />
    </>
  );
}

/**
 * ⌘K / Ctrl+K toggles the palette from anywhere, "/" opens it unless you're typing,
 * Esc closes the palette and then the dialog, and ←/→ step through screenshots.
 */
function useShortcuts() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const { paletteOpen, openCase } = getUi();
      const target = event.target instanceof HTMLElement ? event.target : null;
      const typing = !!target && (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (paletteOpen) ui.closePalette();
        else ui.openPalette();
        return;
      }
      if (event.key === 'Escape') {
        if (paletteOpen) ui.closePalette();
        else if (openCase >= 0) ui.requestClose();
        return;
      }
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (openCase >= 0) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          ui.stepImage(event.key === 'ArrowRight' ? 1 : -1);
        }
        return;
      }
      if (event.key === '/' && !paletteOpen) {
        event.preventDefault();
        ui.openPalette();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

/** The page behind the dialog and the palette doesn't scroll. */
function useScrollLock(locked: boolean) {
  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : '';
  }, [locked]);
}

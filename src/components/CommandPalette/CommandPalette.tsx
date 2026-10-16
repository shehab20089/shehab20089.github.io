'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { a11y } from '@/content/a11y';
import { content, oneOf } from '@/content';
import type { PaletteCommand } from '@/content';
import { copyEmail, download, openUrl, scrollToSection } from '@/lib/actions';
import { trapFocus } from '@/lib/focus-trap';
import { toggleTheme } from '@/lib/theme';
import { ui, useUi } from '@/lib/ui-store';
import styles from './CommandPalette.module.css';

const ACTIONS = ['scrollTo', 'openCase', 'copyEmail', 'download', 'openUrl', 'toggleTheme'] as const;

interface Command {
  label: string;
  hint: string;
  run: () => void;
}

/** Turns a content.json command into its handler; unknown actions or targets fail the build. */
function toCommand({ label, hint, action, target = '' }: PaletteCommand): Command {
  const command = (run: () => void) => ({ label, hint, run });
  switch (oneOf(action, ACTIONS)) {
    case 'scrollTo':
      return command(() => scrollToSection(target));
    case 'openCase': {
      const index = content.projects.findIndex((project) => project.slug === target);
      if (index < 0) throw new Error(`content.json: palette command "${label}" opens unknown case "${target}"`);
      return command(() => ui.openCase(index));
    }
    case 'copyEmail':
      return command(() => void copyEmail());
    case 'download':
      return command(() => download(target));
    case 'openUrl':
      return command(() => openUrl(target));
    case 'toggleTheme':
      return command(() => toggleTheme());
  }
}

const COMMANDS = content.palette.commands.map(toCommand);

export function CommandPalette() {
  const open = useUi((s) => s.paletteOpen);
  return open ? <Palette /> : null;
}

function Palette() {
  const { palette } = content;
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? COMMANDS.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(q)) : COMMANDS;
  }, [query]);

  // Focus the search field on open; give focus back to where it was on close.
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    inputRef.current?.focus();
    return () => previous?.focus({ preventScroll: true });
  }, []);

  // Keep the selected item visible by scrolling the list itself, never the page.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[selected];
    if (!list || !(item instanceof HTMLElement)) return;
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop - 6;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight + 6;
    }
  }, [selected]);

  // Close first, then act, so scrolling and focus happen on the page rather than under the overlay.
  const run = (command: Command) => {
    ui.closePalette();
    setTimeout(command.run, 30);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelected((s) => Math.min(matches.length - 1, s + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelected((s) => Math.max(0, s - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const command = matches[selected];
      if (command) run(command);
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) ui.closePalette();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={a11y.palette} className={styles.panel} onKeyDown={trapFocus}>
        <div className={styles.search}>
          <span className={styles.prompt} aria-hidden="true">
            ›
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={palette.placeholder}
            aria-label={a11y.paletteInput}
            className={styles.input}
          />
          <span className={styles.esc}>{palette.escHint}</span>
          <button type="button" className={styles.close} onClick={ui.closePalette} aria-label={palette.closeAria}>
            {palette.close}
          </button>
        </div>
        <div ref={listRef} className={styles.list}>
          {matches.map((command, k) => (
            <button
              key={command.label}
              type="button"
              className={styles.item}
              data-selected={k === selected ? '' : undefined}
              onClick={() => run(command)}
              onMouseEnter={() => setSelected(k)}
            >
              <span>{command.label}</span>
              <span className={styles.hint}>{command.hint}</span>
            </button>
          ))}
          {matches.length === 0 && <div className={styles.empty}>{palette.empty}</div>}
        </div>
      </div>
    </div>
  );
}

'use client';

import { a11y } from '@/content/a11y';
import { content } from '@/content';
import { toggleTheme } from '@/lib/theme';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { whenLight, whenDark } = content.header.themeToggleLabel;
  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={a11y.themeToggle}
      onClick={(event) => toggleTheme({ x: event.clientX, y: event.clientY })}
    >
      <span className={styles.icon} aria-hidden="true" />
      {/* Both labels are rendered and CSS shows the one for the active theme, so the
          prerendered HTML is right for either theme and never flickers. */}
      <span className={styles.whenLight}>{whenLight}</span>
      <span className={styles.whenDark}>{whenDark}</span>
    </button>
  );
}

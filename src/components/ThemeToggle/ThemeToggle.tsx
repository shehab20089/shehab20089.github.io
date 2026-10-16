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
      onClick={(event) => toggleTheme({ x: event.clientX, y: event.clientY })}
    >
      <span className={styles.icon} aria-hidden="true" />
      {/* Both labels are rendered and CSS shows the one for the active theme, so the
          prerendered HTML is right for either theme and never flickers. The hidden word
          after them makes the accessible name "Dark theme" or "Light theme": it contains
          the visible label, so voice control users can say what they see (WCAG 2.5.3). */}
      <span className={styles.whenLight}>{whenLight}</span>
      <span className={styles.whenDark}>{whenDark}</span>
      <span className={styles.srOnly}>{a11y.themeSuffix}</span>
    </button>
  );
}

'use client';

import { useSyncExternalStore } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { a11y } from '@/content/a11y';
import { content } from '@/content';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { ui } from '@/lib/ui-store';
import styles from './Header.module.css';

const SECTION_IDS = ['top', 'work', 'about', 'experience', 'principles', 'stack', 'beyond', 'contact'] as const;

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: content.person.timezone,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function subscribeClock(onTick: () => void) {
  const id = setInterval(onTick, 15000);
  return () => clearInterval(id);
}

/** Local time in Cairo as HH:MM, refreshed every 15s; "--:--" until the page is interactive. */
function useClock(): string {
  return useSyncExternalStore(
    subscribeClock,
    () => timeFormat.format(new Date()),
    () => '--:--',
  );
}

export function Header() {
  const { header } = content;
  const active = useActiveSection(SECTION_IDS);
  const progressRef = useScrollProgress<HTMLDivElement>();
  const time = useClock();

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <a href="#top" className={styles.logo}>
          <span className={styles.mark} aria-hidden="true" />
          {header.logo}
        </a>
        <span className={styles.spacer} />
        <nav aria-label={a11y.sectionsNav} className={styles.nav}>
          {header.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              aria-current={active === link.href.slice(1) ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <span className={styles.clock}>
          {header.clockLabel} <span>{time}</span>
        </span>
        <ThemeToggle />
        <button type="button" className={styles.menu} onClick={ui.openPalette}>
          {header.menuButton}
        </button>
      </div>
      <div className={styles.progressTrack}>
        <div ref={progressRef} className={styles.progressBar} />
      </div>
    </header>
  );
}

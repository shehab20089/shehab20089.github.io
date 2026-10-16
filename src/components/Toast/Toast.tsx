'use client';

import { useUi } from '@/lib/ui-store';
import styles from './Toast.module.css';

/** Always mounted, so screen readers announce each new message through the live region. */
export function Toast() {
  const message = useUi((s) => s.toast);
  const visible = useUi((s) => s.toastVisible);
  return (
    <div aria-live="polite" className={styles.toast} data-visible={visible ? '' : undefined}>
      {message}
    </div>
  );
}

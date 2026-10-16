'use client';

import { useEffect, useRef } from 'react';
import { Picture } from '@/components/Picture/Picture';
import { content, coverOf } from '@/content';
import { useCanHover } from '@/hooks/useCanHover';
import { cx } from '@/lib/cx';
import { prefersReducedMotion } from '@/lib/motion';
import { getUi, subscribeUi, useUi } from '@/lib/ui-store';
import styles from './HoverPreview.module.css';

interface Point {
  x: number;
  y: number;
}

/**
 * The floating screenshot that follows the cursor over the project index (fine
 * pointers only). All six covers are stacked and crossfade as the hovered row
 * changes; the card eases toward the cursor each frame.
 */
export function HoverPreview() {
  const canHover = useCanHover();
  const hovered = useUi((s) => s.hovered);
  const dialogOpen = useUi((s) => s.openCase >= 0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pointer: Point | null = null;
    let position: Point | null = null;
    let snap = false;
    let frame = 0;
    let lastHovered = getUi().hovered;

    function tick() {
      frame = 0;
      if (!el || !pointer) return;
      const { offsetWidth: w, offsetHeight: h } = el;
      // Right of the cursor, or left of it when that would leave the viewport; vertically centred on it.
      let targetX = pointer.x + 32;
      if (targetX + w > window.innerWidth - 12) targetX = pointer.x - w - 32;
      targetX = Math.max(12, targetX);
      const targetY = Math.max(12, Math.min(window.innerHeight - h - 12, pointer.y - h * 0.5));
      if (!position || snap) {
        position = { x: targetX, y: targetY };
        snap = false;
      }
      const ease = prefersReducedMotion() ? 1 : 0.16;
      const dx = targetX - position.x;
      position.x += dx * ease;
      position.y += (targetY - position.y) * ease;
      el.style.transform = `translate3d(${position.x.toFixed(1)}px,${position.y.toFixed(1)}px,0)`;
      if (Math.abs(dx) > 0.4 || Math.abs(targetY - position.y) > 0.4) frame = requestAnimationFrame(tick);
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: MouseEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (getUi().hovered !== -1) schedule();
    };
    const onHoverChange = () => {
      const current = getUi().hovered;
      if (current === lastHovered) return;
      // The first hover after leaving the list jumps straight to the cursor instead of gliding in.
      if (current !== -1) {
        if (lastHovered === -1) snap = true;
        schedule();
      }
      lastHovered = current;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    const unsubscribe = subscribeUi(onHoverChange);
    return () => {
      window.removeEventListener('mousemove', onMove);
      unsubscribe();
      cancelAnimationFrame(frame);
    };
  }, [canHover]);

  if (!canHover) return null;

  return (
    <div ref={ref} aria-hidden="true" className={styles.preview} data-visible={hovered !== -1 && !dialogOpen ? '' : undefined}>
      <div className={styles.card} data-active={hovered !== -1 ? '' : undefined}>
        <div className={styles.frame}>
          {content.projects.map((project, i) => (
            <Picture
              key={project.slug}
              image={coverOf(project)}
              alt=""
              sizes="400px"
              loading="eager"
              fetchPriority="low"
              className={cx(styles.cover, i === hovered && styles.coverShown)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

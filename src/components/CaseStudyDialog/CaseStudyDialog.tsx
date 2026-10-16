'use client';

import { useEffect, useRef } from 'react';
import { Picture } from '@/components/Picture/Picture';
import { a11y } from '@/content/a11y';
import { content, format } from '@/content';
import { trapFocus } from '@/lib/focus-trap';
import { EASE_IN, EASE_OUT, prefersReducedMotion } from '@/lib/motion';
import { ui, useUi } from '@/lib/ui-store';
import styles from './CaseStudyDialog.module.css';

/** Screenshots narrower than this ratio (w/h) are full-page captures that scroll inside the frame. */
const TALL_RATIO = 1.25;

export function CaseStudyDialog() {
  const index = useUi((s) => s.openCase);
  return index >= 0 ? <Dialog index={index} /> : null;
}

function Dialog({ index }: { index: number }) {
  const { caseStudy, projects } = content;
  const image = useUi((s) => s.image);
  const closing = useUi((s) => s.closing);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const shown = useRef({ index, image });

  // Opening: slide up, focus Close, and hand focus back to the opener when the dialog unmounts.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!prefersReducedMotion()) {
      overlayRef.current?.animate([{ opacity: 0, transform: 'translateY(56px)' }, { opacity: 1, transform: 'none' }], {
        duration: 560,
        easing: EASE_OUT,
      });
    }
    closeRef.current?.focus({ preventScroll: true });
    return () => opener?.focus({ preventScroll: true });
  }, []);

  // Closing: play the exit, then unmount.
  useEffect(() => {
    if (!closing) return;
    const overlay = overlayRef.current;
    if (!overlay || prefersReducedMotion()) {
      ui.finishClose();
      return;
    }
    const exit = overlay.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(32px)' }], {
      duration: 260,
      easing: EASE_IN,
      fill: 'forwards',
    });
    exit.onfinish = () => ui.finishClose();
    return () => exit.cancel();
  }, [closing]);

  // Another project: back to the top. Another screenshot: reset the frame and fade the image in.
  useEffect(() => {
    const previous = shown.current;
    if (previous.index === index && previous.image === image) return;
    shown.current = { index, image };
    if (previous.index !== index) overlayRef.current?.scrollTo({ top: 0 });
    if (frameRef.current) frameRef.current.scrollTop = 0;
    if (!prefersReducedMotion()) imageRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' });
  }, [index, image]);

  const project = projects[index];
  const screenshot = project?.images[image] ?? project?.images[0];
  const next = projects[(index + 1) % projects.length];
  if (!project || !screenshot || !next) return null;
  const { labels } = caseStudy;
  const tall = screenshot.width / screenshot.height < TALL_RATIO;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={a11y.caseDialog(project.name)}
      className={styles.overlay}
      onKeyDown={trapFocus}
    >
      <div className={styles.bar}>
        <div className={styles.barRow}>
          <span className={styles.counter}>
            {format(caseStudy.counter, { number: project.number, total: String(projects.length).padStart(2, '0') })}
          </span>
          <span className={styles.spacer} />
          <button type="button" className={styles.step} onClick={() => ui.stepCase(-1)}>
            {caseStudy.prev}
          </button>
          <button type="button" className={styles.step} onClick={() => ui.stepCase(1)}>
            {caseStudy.next}
          </button>
          <button ref={closeRef} type="button" className={styles.close} onClick={ui.requestClose} aria-label={caseStudy.closeAria}>
            {caseStudy.close}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.sector}>{project.sector}</div>
        <h2 className={styles.title}>{project.name}</h2>
        <p className={styles.blurb}>{project.blurb}</p>

        <div className={styles.gallery}>
          <div ref={frameRef} className={styles.frame}>
            <Picture
              ref={imageRef}
              image={screenshot}
              alt={screenshot.alt}
              sizes="(min-width: 1320px) 1238px, 94vw"
              loading="eager"
              className={styles.image}
            />
          </div>
          <div className={styles.galleryRow}>
            <div className={styles.thumbs}>
              {project.images.map((shot, k) => (
                <button
                  key={shot.src}
                  type="button"
                  className={styles.thumb}
                  data-active={k === image ? '' : undefined}
                  onClick={() => ui.showImage(k)}
                  aria-label={a11y.showScreenshot(shot.caption)}
                >
                  <Picture image={shot} alt="" sizes="92px" className={styles.thumbImage} />
                </button>
              ))}
            </div>
            <div className={styles.caption}>
              {format(caseStudy.imageCounter, { i: image + 1, n: project.images.length, caption: screenshot.caption })}
              {tall && caseStudy.tallHint}
            </div>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.detailsMain}>
            <div>
              <div className={styles.label}>{labels.problem}</div>
              <p className={styles.prose}>{project.problem}</p>
            </div>
            <div>
              <div className={styles.label}>{labels.solution}</div>
              <p className={styles.prose}>{project.solution}</p>
            </div>
            <div>
              <div className={styles.label}>{labels.impact}</div>
              <p className={styles.impact}>{project.impact}</p>
            </div>
          </div>
          <div className={styles.detailsSide}>
            <div>
              <div className={styles.label}>{labels.role}</div>
              <p className={styles.role}>{project.role}</p>
            </div>
            <div>
              <div className={styles.label}>{labels.stack}</div>
              <div className={styles.chips}>
                {project.stack.map((item) => (
                  <span key={item} className={styles.chip}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {project.live && (
              <div>
                <div className={styles.label}>{labels.live}</div>
                <a href={project.live.url} target="_blank" rel="noopener noreferrer" className={styles.live}>
                  {project.live.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            )}
          </div>
        </div>

        <button type="button" className={styles.nextProject} onClick={() => ui.stepCase(1)}>
          <span className={styles.nextLabel}>{caseStudy.nextProject}</span>
          <span className={styles.nextName}>{next.name} →</span>
        </button>
      </div>
    </div>
  );
}

'use client';

import { Picture } from '@/components/Picture/Picture';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { a11y } from '@/content/a11y';
import { content, coverOf } from '@/content';
import { useCanHover } from '@/hooks/useCanHover';
import { ui, useUi } from '@/lib/ui-store';
import styles from './Work.module.css';

export function Work() {
  const { work, projects, alsoShipped } = content;
  const canHover = useCanHover();
  const hovered = useUi((s) => s.hovered);
  const [noLabel, projectLabel, sectorLabel, roleLabel, caseLabel] = work.tableColumns;

  return (
    <section id="work" className={styles.work}>
      <SectionHeader number={work.number} label={work.label} heading={work.heading} intro={work.intro} tabularNumber />

      {/* Column labels from 960px up; below that only the rule remains. */}
      <div className={styles.indexHead}>
        <span className={styles.no}>{noLabel}</span>
        <span className={styles.project}>{projectLabel}</span>
        <span className={styles.sector}>{sectorLabel}</span>
        <span className={styles.role}>{roleLabel}</span>
        <span className={styles.open}>{caseLabel}</span>
      </div>

      <div onMouseLeave={ui.clearHover}>
        {projects.map((project, i) => {
          const cover = coverOf(project);
          return (
            <div key={project.slug} data-reveal="">
              <button
                type="button"
                className={styles.row}
                data-hovered={hovered === i ? '' : undefined}
                data-dimmed={hovered !== -1 && hovered !== i ? '' : undefined}
                onMouseEnter={canHover ? () => ui.hover(i) : undefined}
                onClick={() => ui.openCase(i)}
                aria-label={a11y.openCase(project.name)}
              >
                <span className={styles.bar} aria-hidden="true" />
                <span className={styles.no}>{project.number}</span>
                <span className={styles.name}>{project.name}</span>
                <span className={styles.sector}>{project.sector}</span>
                <span className={styles.role}>{project.role}</span>
                <span className={styles.open}>{work.rowCta}</span>
                {/* Touch devices get the cover inline; hover devices get the floating preview. */}
                <span className={styles.cover}>
                  <Picture image={cover} alt={cover.alt} sizes="(min-width: 1320px) 1240px, 92vw" className={styles.coverImage} />
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.shipped}>
        <div data-reveal="" className={styles.shippedLabel}>
          {work.alsoShippedLabel}
        </div>
        <div className={styles.shippedGrid}>
          {alsoShipped.map((item) => (
            <div key={item.title} data-reveal="" className={styles.card}>
              <div className={styles.kicker}>{item.kicker}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.description}</p>
              <div className={styles.cardMeta}>{item.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { content } from '@/content';
import styles from './Experience.module.css';

export function Experience() {
  const { experience } = content;
  return (
    <section id="experience" className={styles.experience}>
      <SectionHeader
        number={experience.number}
        label={experience.label}
        heading={experience.heading}
        headingClassName={styles.heading}
      />
      <div className={styles.list}>
        {experience.roles.map((role) => (
          <div key={`${role.company} ${role.role}`} data-reveal="" className={styles.row}>
            <div className={styles.when} data-current={role.current ? '' : undefined}>
              {role.current && <span className={styles.now} aria-hidden="true" />}
              {role.when}
            </div>
            <div className={styles.role}>
              <h3 className={styles.title}>{role.role}</h3>
              <div className={styles.company}>
                {role.company}
                {role.tag && (
                  <>
                    {' · '}
                    <span className={styles.tag}>{role.tag}</span>
                  </>
                )}
              </div>
            </div>
            <p className={styles.description}>{role.description}</p>
          </div>
        ))}
        <div data-reveal="" className={styles.education}>
          <div className={styles.educationLabel}>{experience.educationLabel}</div>
          {experience.education.map((entry) => (
            <div key={entry.title} className={styles.educationEntry}>
              <strong className={styles.educationTitle}>{entry.title}</strong> — {entry.where}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

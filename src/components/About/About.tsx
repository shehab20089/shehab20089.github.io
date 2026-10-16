import { Picture } from '@/components/Picture/Picture';
import { RichText } from '@/components/RichText/RichText';
import { SectionLabel } from '@/components/SectionHeader/SectionHeader';
import { content } from '@/content';
import styles from './About.module.css';

/**
 * A variation on the section header: the portrait sits under the label, so the
 * label column isn't empty. Narrow screens stack label, portrait, heading, text.
 */
export function About() {
  const { about } = content;
  const { portrait } = about;
  return (
    <section id="about" className={styles.about}>
      <div className={styles.inner}>
        <div className={styles.side}>
          <SectionLabel number={about.number} label={about.label} />
          <figure data-reveal="" className={styles.figure}>
            <div className={styles.frame}>
              <Picture image={portrait} alt={portrait.alt} sizes="340px" className={styles.photo} />
              <span className={styles.badge}>
                <span className={styles.dot} aria-hidden="true" />
                {portrait.badge}
              </span>
            </div>
            <figcaption className={styles.caption}>
              <span className={styles.captionName}>{portrait.captionLeft}</span>
              <span>{portrait.captionRight}</span>
            </figcaption>
          </figure>
        </div>
        <div className={styles.main}>
          <h2 data-reveal="" className={styles.heading}>
            <RichText text={about.heading} />
          </h2>
          <div className={styles.text}>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} data-reveal="" className={styles.paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
            <div data-reveal="" className={styles.chips}>
              {about.chips.map((chip) => (
                <span key={chip} className={styles.chip}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

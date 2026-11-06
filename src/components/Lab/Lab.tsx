import { Picture } from '@/components/Picture/Picture';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { content } from '@/content';
import styles from './Lab.module.css';

export function Lab() {
  const { lab } = content;
  return (
    <section id="lab" className={styles.lab}>
      <SectionHeader number={lab.number} label={lab.label} heading={lab.heading} headingClassName={styles.heading} />
      <div className={styles.grid}>
        {lab.items.map((item) => (
          <div key={item.title} data-reveal="" className={styles.item}>
            {item.image && (
              <Picture
                image={item.image}
                alt={item.image.alt}
                sizes="(min-width: 1320px) 600px, (min-width: 660px) 46vw, 92vw"
                className={styles.image}
              />
            )}
            <div className={styles.kicker}>{item.kicker}</div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
            {item.links.length > 0 && (
              <div className={styles.links}>
                {item.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

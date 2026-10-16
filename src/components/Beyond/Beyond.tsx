import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { content } from '@/content';
import styles from './Beyond.module.css';

export function Beyond() {
  const { beyond } = content;
  return (
    <section id="beyond" className={styles.beyond}>
      <div className={styles.inner}>
        <SectionHeader
          number={beyond.number}
          label={beyond.label}
          heading={beyond.heading}
          headingClassName={styles.heading}
        />
        <div className={styles.grid}>
          {beyond.items.map((item) => (
            <div key={item.title} data-reveal="" className={styles.item}>
              <div className={styles.kicker}>{item.kicker}</div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

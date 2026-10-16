import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { content } from '@/content';
import styles from './Stack.module.css';

export function Stack() {
  const { stack } = content;
  return (
    <section id="stack" className={styles.stack}>
      <SectionHeader number={stack.number} label={stack.label} heading={stack.heading} balance={false} />
      <div className={styles.list}>
        {stack.groups.map((group) => (
          <div key={group.category} data-reveal="" className={styles.row}>
            <div className={styles.category}>{group.category}</div>
            <div className={styles.items}>
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

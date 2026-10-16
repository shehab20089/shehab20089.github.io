import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { content } from '@/content';
import { cx } from '@/lib/cx';
import styles from './Principles.module.css';

export function Principles() {
  const { principles } = content;
  return (
    <section id="principles" className={styles.principles}>
      <div className={styles.inner}>
        <SectionHeader
          number={principles.number}
          label={principles.label}
          heading={principles.heading}
          intro={principles.intro}
          balance={false}
        />
        <div className={styles.grid}>
          {principles.items.map((item) => (
            <div key={item.number} data-reveal="" className={styles.item}>
              <div className={styles.number}>{item.number}</div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
          ))}
        </div>
        <div data-reveal="" className={styles.code}>
          {principles.codeSample.map((line) => (
            <CodeLine key={line} line={line} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Highlights the TypeScript sample the way the reference does: comments, the
 * `type` keyword and string literals, with two-space indents drawn as padding.
 */
function CodeLine({ line }: { line: string }) {
  if (line.startsWith('//')) return <div className={cx(styles.line, styles.comment)}>{line}</div>;
  const indented = line.startsWith('  ');
  const code = indented ? line.slice(2) : line;
  const keyword = code.startsWith('type ') ? 'type' : '';
  return (
    <div className={cx(styles.line, indented && styles.indented)}>
      {keyword && <span className={styles.keyword}>{keyword}</span>}
      {code
        .slice(keyword.length)
        .split(/("[^"]*")/)
        .map((part, i) =>
          part.startsWith('"') ? (
            <span key={i} className={styles.string}>
              {part}
            </span>
          ) : (
            part
          ),
        )}
    </div>
  );
}

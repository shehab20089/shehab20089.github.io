import { RichText } from '@/components/RichText/RichText';
import { content, oneOf } from '@/content';
import { fileName, resolveHref } from '@/lib/asset';
import { cx } from '@/lib/cx';
import styles from './Hero.module.css';

const CTA_VARIANTS = ['primary', 'outline', 'text'] as const;

/**
 * The first screen. Its entrance (meta row, the two name lines rising, lead and
 * CTAs, marked data-entrance) runs as CSS animations from first paint rather than
 * waiting for the reveal observer, so the largest text never waits on JavaScript.
 * The delays are the ones the observer gives these elements on load: 80ms steps,
 * plus 130ms per name line.
 */
export function Hero() {
  const { hero } = content;
  const [firstName, lastName] = hero.nameLines;
  return (
    <section id="top" className={styles.hero}>
      <div data-entrance="" className={styles.meta}>
        <span>{hero.eyebrow}</span>
        <span className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          {hero.status}
        </span>
      </div>

      <h1 className={styles.name}>
        <span data-entrance="" className={styles.firstLine}>
          {firstName}
        </span>
        <span className={styles.secondLine}>
          <span data-entrance="" className={styles.secondLineText}>
            {lastName}
            <span className={styles.stop} aria-hidden="true" />
          </span>
        </span>
      </h1>

      <div className={styles.leadRow}>
        <p data-entrance="" className={styles.lead}>
          <RichText text={hero.lead} />
        </p>
        <div data-entrance="" className={styles.ctas}>
          {hero.ctas.map((cta) => (
            <a
              key={cta.label}
              href={resolveHref(cta.href)}
              download={cta.download ? fileName(cta.href) : undefined}
              className={cx(styles.cta, styles[oneOf(cta.variant, CTA_VARIANTS)])}
            >
              {cta.label}
              <span aria-hidden="true">{cta.icon}</span>
            </a>
          ))}
        </div>
      </div>

      <div data-reveal="" className={styles.facts}>
        {hero.facts.map((fact) => (
          <div key={fact.label}>
            <div className={styles.factLabel}>{fact.label}</div>
            {fact.links ? (
              <div className={styles.factLinks}>
                {fact.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <div className={styles.factValue}>{fact.value}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

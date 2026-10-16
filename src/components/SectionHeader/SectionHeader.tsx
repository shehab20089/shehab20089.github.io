import { RichText } from '@/components/RichText/RichText';
import { cx } from '@/lib/cx';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  number: string;
  label: string;
  heading: string;
  intro?: string;
  /** Section-specific heading rules (max-width) from the section's own module. */
  headingClassName?: string;
  /** The reference balances most H2s, but not "How I think" or "Stack". */
  balance?: boolean;
  /** Only Work's "01" uses tabular figures in the reference; Onest's default digits are proportional. */
  tabularNumber?: boolean;
}

/**
 * The header pattern of every section after the hero: a label column and a
 * heading column that wrap. As in the reference, a heading with an intro sits in
 * a wrapper column; without one, the H2 itself is the flex item (which changes
 * how leftover width is shared when the heading has a max-width).
 */
export function SectionHeader({
  number,
  label,
  heading,
  intro,
  headingClassName,
  balance = true,
  tabularNumber = false,
}: SectionHeaderProps) {
  const h2 = (
    <h2
      data-reveal=""
      className={cx(styles.heading, balance && styles.balance, !intro && styles.column, headingClassName)}
    >
      <RichText text={heading} />
    </h2>
  );
  return (
    <div className={styles.head}>
      <SectionLabel number={number} label={label} tabular={tabularNumber} className={styles.labelColumn} />
      {intro ? (
        <div className={styles.column}>
          {h2}
          <p data-reveal="" className={styles.intro}>
            {intro}
          </p>
        </div>
      ) : (
        h2
      )}
    </div>
  );
}

interface SectionLabelProps {
  number: string;
  label: string;
  tabular?: boolean;
  className?: string;
}

export function SectionLabel({ number, label, tabular = false, className }: SectionLabelProps) {
  return (
    <div data-reveal="" className={cx(styles.label, className)}>
      <span className={cx(styles.number, tabular && styles.tabular)}>{number}</span>
      {label}
    </div>
  );
}

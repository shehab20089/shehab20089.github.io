'use client';

import type { FormEvent } from 'react';
import { content } from '@/content';
import type { FormField } from '@/content';
import { copyEmail } from '@/lib/actions';
import { track } from '@/lib/analytics';
import { fileName, resolveHref } from '@/lib/asset';
import { cx } from '@/lib/cx';
import styles from './Contact.module.css';

export function Contact() {
  const { contact, person } = content;
  const { fields, submit, note } = contact.form;
  const [submitLabel, submitIcon] = splitTrailingIcon(submit);

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.inner}>
        <div data-reveal="" className={styles.label}>
          <span>{contact.number}</span>
          {contact.label}
        </div>
        <h2 data-reveal="" className={styles.heading}>
          {contact.heading}
        </h2>

        <div className={styles.columns}>
          <div data-reveal="" className={styles.info}>
            <div>
              <div className={styles.emailLabel}>{contact.emailLabel}</div>
              <div className={styles.emailRow}>
                <a href={`mailto:${person.email}`} className={styles.email}>
                  {person.email}
                </a>
                <button type="button" className={styles.copy} onClick={copyEmail}>
                  {contact.copyButton}
                </button>
              </div>
            </div>
            <div className={styles.details}>
              {contact.details.map((detail) => (
                <div key={detail.label}>
                  <div className={styles.detailLabel}>{detail.label}</div>
                  {detail.href ? (
                    <a href={detail.href} target="_blank" rel="noopener noreferrer">
                      {breakAfterSlashes(detail.text)}
                    </a>
                  ) : (
                    <div className={styles.detailText}>{detail.text}</div>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.resumes}>
              <span>{contact.resumeLabel}</span>
              {contact.resumeLinks.map((link) => (
                <a key={link.href} href={resolveHref(link.href)} download={fileName(link.href)}>
                  {link.text}
                </a>
              ))}
            </div>
          </div>

          {/* No backend: submitting opens a pre-filled email in the visitor's mail client. */}
          <form data-reveal="" className={styles.form} onSubmit={sendMail}>
            <div className={styles.fieldRow}>
              {fields
                .filter((field) => field.type !== 'textarea')
                .map((field) => (
                  <Field key={field.name} field={field} className={styles.rowField} />
                ))}
            </div>
            {fields
              .filter((field) => field.type === 'textarea')
              .map((field) => (
                <Field key={field.name} field={field} />
              ))}
            <button type="submit" className={styles.submit}>
              {submitLabel}
              {submitIcon && <span aria-hidden="true">{submitIcon}</span>}
            </button>
            <p className={styles.note}>{note}</p>
          </form>
        </div>

        <div className={styles.footer}>
          <span>{contact.footer.copyright}</span>
          <a href="#top" className={styles.backToTop}>
            {contact.footer.backToTop}
          </a>
        </div>
      </div>
    </section>
  );
}

function Field({ field, className }: { field: FormField; className?: string }) {
  return (
    <label className={cx(styles.field, className)}>
      <span className={styles.fieldLabel}>{field.label}</span>
      {field.type === 'textarea' ? (
        <textarea
          name={field.name}
          rows={field.rows}
          required={field.required}
          placeholder={field.placeholder}
          className={cx(styles.input, styles.textarea)}
        />
      ) : (
        <input
          name={field.name}
          type={field.type}
          required={field.required}
          autoComplete={field.autocomplete}
          placeholder={field.placeholder}
          className={styles.input}
        />
      )}
    </label>
  );
}

/**
 * Lets URL-like link text wrap after its inner slashes ("github.com/" | "shehab20089 ↗")
 * rather than run past its grid column; the text itself is unchanged. A deliberate
 * deviation from the reference, which overflows by up to 28px on phones (design/SPEC.md).
 */
function breakAfterSlashes(text: string) {
  return text.split(/(?<=[^/\s]\/)/).flatMap((part, i) => (i === 0 ? [part] : [<wbr key={i} />, part]));
}

/** "Send message →" → ["Send message", "→"]: the reference spaces the arrow with the button's gap. */
function splitTrailingIcon(text: string): [string, string] {
  const match = text.match(/^(.*\S)\s+(\S)$/u);
  return match?.[1] && match[2] ? [match[1], match[2]] : [text, ''];
}

// Native validation runs first (every field is required), so this only fires with a complete form.
function sendMail(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const value = (name: string) => String(data.get(name) ?? '').trim();
  const name = value('name');
  const email = value('email');
  const subject = `Portfolio inquiry${name ? ` — ${name}` : ''}`;
  const body = `${value('message')}\n\n— ${name}${email ? ` · ${email}` : ''}`;
  track('Open email draft');
  window.location.href = `mailto:${content.person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

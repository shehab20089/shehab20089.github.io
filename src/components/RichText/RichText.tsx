import styles from './RichText.module.css';

// content.json marks emphasis inline: **bold**, *italic*, ==accent==.
const MARKERS = /(\*\*[^*]+\*\*|==[^=]+==|\*[^*]+\*)/g;

export function RichText({ text }: { text: string }) {
  return text.split(MARKERS).map((part, i) => {
    if (part.startsWith('**')) {
      return (
        <strong key={i} className={styles.strong}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('==')) {
      return (
        <span key={i} className={styles.accent}>
          {part.slice(2, -2)}
        </span>
      );
    }
    if (part.startsWith('*')) {
      return (
        <em key={i} className={styles.em}>
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

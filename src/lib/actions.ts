import { content } from '@/content';
import { asset, fileName } from './asset';
import { prefersReducedMotion } from './motion';
import { ui } from './ui-store';

/** Smooth-scrolls to a section, leaving room for the sticky header. */
export function scrollToSection(hash: string) {
  const id = hash.replace(/^#/, '');
  const section = document.getElementById(id);
  if (!section) return;
  const top = id === 'top' ? 0 : section.getBoundingClientRect().top + window.scrollY - 56;
  window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Copies the email address and confirms with a toast; if copying fails, the toast shows the address instead. */
export async function copyEmail() {
  const { email } = content.person;
  let copied: boolean;
  try {
    await navigator.clipboard.writeText(email);
    copied = true;
  } catch {
    copied = copyWithSelection(email);
  }
  ui.showToast(copied ? content.toast.emailCopied : email);
}

// Fallback for browsers or contexts without the async Clipboard API.
function copyWithSelection(text: string): boolean {
  const field = document.createElement('textarea');
  field.value = text;
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    field.remove();
  }
}

/** Downloads a file from /public, e.g. a résumé PDF. */
export function download(path: string) {
  const link = document.createElement('a');
  link.href = asset(path);
  link.download = fileName(path);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function openUrl(url: string) {
  window.open(url, '_blank', 'noopener');
}

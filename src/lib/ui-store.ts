import { useSyncExternalStore } from 'react';
import { content } from '@/content';

// Page-wide UI state shared by the index, the hover preview, the case-study
// dialog, the command palette and the toast. A tiny external store rather than
// context, so a hover change only re-renders the components that read it.
export interface UiState {
  /** Project row under the pointer, -1 for none. */
  hovered: number;
  /** Project shown in the case-study dialog, -1 when closed. */
  openCase: number;
  /** The dialog is playing its exit animation. */
  closing: boolean;
  /** Active screenshot in the dialog gallery. */
  image: number;
  paletteOpen: boolean;
  toast: string;
  toastVisible: boolean;
}

const initial: UiState = {
  hovered: -1,
  openCase: -1,
  closing: false,
  image: 0,
  paletteOpen: false,
  toast: '',
  toastVisible: false,
};

let state = initial;
const listeners = new Set<() => void>();
const projectCount = content.projects.length;
let toastTimer: ReturnType<typeof setTimeout> | undefined;

function set(patch: Partial<UiState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

/** Calls `listener` after every state change; returns the unsubscribe function. */
export function subscribeUi(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Reads one slice of UI state; return primitives so unrelated changes don't re-render. */
export function useUi<T>(select: (s: UiState) => T): T {
  return useSyncExternalStore(
    subscribeUi,
    () => select(state),
    () => select(initial),
  );
}

export const getUi = (): UiState => state;

const wrap = (index: number, length: number) => (index + length) % length;

export const ui = {
  hover(index: number) {
    if (state.openCase < 0 && state.hovered !== index) set({ hovered: index });
  },
  clearHover() {
    if (state.hovered !== -1) set({ hovered: -1 });
  },
  openCase(index: number) {
    set({ openCase: index, image: 0, closing: false, hovered: -1, paletteOpen: false });
  },
  stepCase(delta: number) {
    if (state.openCase >= 0) set({ openCase: wrap(state.openCase + delta, projectCount), image: 0 });
  },
  /** Starts the dialog's exit; the dialog calls finishClose once its animation ends. */
  requestClose() {
    if (state.openCase >= 0 && !state.closing) set({ closing: true });
  },
  finishClose() {
    set({ openCase: -1, closing: false });
  },
  showImage(index: number) {
    set({ image: index });
  },
  stepImage(delta: number) {
    const count = content.projects[state.openCase]?.images.length;
    if (count) set({ image: wrap(state.image + delta, count) });
  },
  openPalette() {
    if (!state.paletteOpen) set({ paletteOpen: true, hovered: -1 });
  },
  closePalette() {
    if (state.paletteOpen) set({ paletteOpen: false });
  },
  showToast(message: string) {
    clearTimeout(toastTimer);
    set({ toast: message, toastVisible: true });
    toastTimer = setTimeout(() => set({ toastVisible: false }), 2300);
  },
};

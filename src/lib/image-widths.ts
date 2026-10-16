// Widths of the WebP variants generated for every screenshot and the portrait.
// Shared by scripts/images.ts (which writes the files) and the srcset builder
// (which points at them), so the two can never disagree.
export const IMAGE_WIDTHS = [240, 480, 960, 1600] as const;

/** The variant widths that exist for a source image, never upscaling past it. */
export function variantWidths(sourceWidth: number): number[] {
  const largest = IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1] ?? sourceWidth;
  const capped = Math.min(sourceWidth, largest);
  return [...IMAGE_WIDTHS.filter((w) => w < capped), capped];
}

/** File name of one variant: assets/gopay-home.png at 960 → assets/gopay-home-960.webp */
export function variantPath(src: string, width: number): string {
  return `${src.replace(/\.[a-z]+$/i, '')}-${width}.webp`;
}

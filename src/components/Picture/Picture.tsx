import type { Ref } from 'react';
import { asset } from '@/lib/asset';
import { variantPath, variantWidths } from '@/lib/image-widths';
import styles from './Picture.module.css';

interface PictureProps {
  image: { src: string; width: number; height: number };
  alt: string;
  /** Rendered width, for picking a variant (the srcset `sizes` attribute). */
  sizes: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  ref?: Ref<HTMLImageElement>;
}

/**
 * A screenshot or photo: the WebP variants from scripts/images.ts, the original
 * file as the fallback, and the intrinsic size always set so nothing shifts.
 */
export function Picture({ image, alt, sizes, className, loading = 'lazy', fetchPriority, ref }: PictureProps) {
  const srcSet = variantWidths(image.width)
    .map((w) => `${asset(variantPath(image.src, w))} ${w}w`)
    .join(', ');
  return (
    <picture className={styles.picture}>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        ref={ref}
        src={asset(image.src)}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={className}
      />
    </picture>
  );
}

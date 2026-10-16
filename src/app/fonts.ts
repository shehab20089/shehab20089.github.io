import { Onest } from 'next/font/google';

// The reference loads Onest's variable weights from Google Fonts; next/font
// self-hosts the same latin subset and preloads it.
export const onest = Onest({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-onest',
});

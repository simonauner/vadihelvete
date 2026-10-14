import type { Metadata, Viewport } from 'next';
import { Archivo_Black, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { emojiIcon } from '@/lib/emojiIcon';
import './globals.css';

const display = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vadihelvete.nu'),
  title: {
    default: 'Vad i helvete ska jag göra nu?',
    template: '%s – vad i helvete',
  },
  description: 'Vet du inte riktigt vad du ska göra med ditt liv?',
  icons: { icon: emojiIcon('🎯') },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    siteName: 'vad i helvete',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff6ee' },
    { media: '(prefers-color-scheme: dark)', color: '#150d0b' },
  ],
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="sv" className={`${display.variable} ${body.variable}`}>
    <body>{children}</body>
  </html>
);

export default RootLayout;

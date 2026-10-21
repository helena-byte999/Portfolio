import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import Reveal from '@/components/Reveal';
import './globals.css';

// Archivo throughout; its width axis gives the expanded ExtraBold used for the name.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], style: ['normal', 'italic'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://ena-labs.netlify.app'),
  title: { default: 'Ena Otuokon · Product Manager', template: '%s · Ena Otuokon' },
  description:
    'Ena Otuokon is a London-based product manager for AI, music and consumer products, and a DJ who builds the tools she wants to use.',
  openGraph: {
    title: 'Ena Otuokon · Product Manager',
    description: 'Product manager for AI, music and consumer products. I read the room before I drop the track.',
    url: '/',
    images: ['/booth/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#f3f1ec',
};

// Marks the page as scripted before paint, so scroll reveals never flash.
const jsFlag = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${archivo.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body>
        {children}
        <Reveal />
      </body>
    </html>
  );
}

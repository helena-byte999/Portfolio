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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f1ec' },
    { media: '(prefers-color-scheme: dark)', color: '#121211' },
  ],
};

// Runs before paint: applies the saved theme (or the system's) and marks the page as scripted,
// so neither the theme nor the scroll reveals flash.
const boot = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.dataset.theme=t}catch(e){}d.classList.add('js')})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${archivo.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        {children}
        <Reveal />
      </body>
    </html>
  );
}

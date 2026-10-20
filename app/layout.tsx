import type { Metadata, Viewport } from 'next';
import { Archivo, Space_Mono } from 'next/font/google';
import ParticleWeb from '@/components/ParticleWeb';
import Reveal from '@/components/Reveal';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-display', display: 'swap' });
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono', display: 'swap' });

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
    { media: '(prefers-color-scheme: dark)', color: '#0e0613' },
    { media: '(prefers-color-scheme: light)', color: '#fbf4e4' },
  ],
};

// Runs before paint so the saved theme never flashes the wrong colours.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add('js')})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${archivo.variable} ${mono.variable}`} style={{ ['--font-body' as string]: 'var(--font-display)' }} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ParticleWeb />
        {children}
        <Reveal />
      </body>
    </html>
  );
}

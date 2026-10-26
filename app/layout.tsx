import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import WaveBackground from '@/components/fx/WaveBackground';
import Header from '@/components/Header';
import MusicDock from '@/components/MusicDock';
import Reveal from '@/components/Reveal';
import './globals.css';

// Archivo throughout; its width axis gives the expanded ExtraBold used for the name.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], style: ['normal', 'italic'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://ena-labs.vercel.app'),
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
  themeColor: '#000000',
};

// Runs before paint: marks the page as scripted so the scroll reveals don't flash, and removes the
// comment Netlify injects into <head> on the production domain (plus stray whitespace), which
// otherwise breaks React's hydration with error #418.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');var h=document.head,n=h.firstChild,x;while(n){x=n.nextSibling;if(n.nodeType===8||(n.nodeType===3&&!n.nodeValue.trim()))h.removeChild(n);n=x}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" data-theme="dark" className={`${archivo.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <WaveBackground />
        <Header />
        {children}
        <MusicDock />
        <Reveal />
      </body>
    </html>
  );
}

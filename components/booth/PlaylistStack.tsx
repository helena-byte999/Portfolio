'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { siSpotify } from 'simple-icons';
import mine from '@/content/playlists.json';
import demo from '@/content/playlists.demo.json';
import s from './PlaylistStack.module.css';

// Three of Ena's playlists, stacked and tilted like the tool tiles. Pressing one opens Spotify's
// own embed player in a floating panel (portalled to <body> so it sits above everything) that
// stays put while you scroll, so visitors can listen
// (30-second previews, or full tracks if they're logged in to Spotify). Data comes from
// content/playlists.json (npm run playlists); ?playlists=demo previews the layout with samples.

type Playlist = { id: string; url: string; title: string; cover: string; tracks: number | null; subtitle: string | null };

const TINTS = ['#f08a3c', '#3557e8', '#e5484d'];

export default function PlaylistStack() {
  const [list, setList] = useState<Playlist[]>(mine as Playlist[]);
  const [isDemo, setIsDemo] = useState(false);
  const [open, setOpen] = useState<Playlist | null>(null);

  useEffect(() => {
    if (new URLSearchParams(location.search).get('playlists') === 'demo') {
      setList(demo as Playlist[]);
      setIsDemo(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!list.length) return null;

  return (
    <>
      <ul className={s.stack} aria-label={isDemo ? 'Sample playlists (demo)' : 'My playlists'}>
        {list.slice(0, 3).map((p, i) => (
          <li key={p.id} className={s.item} style={{ ['--i' as string]: i, ['--tint' as string]: TINTS[i % TINTS.length] }}>
            <button type="button" className={s.card} onClick={() => setOpen(p)} aria-label={`Play ${p.title} on Spotify`}>
              <img src={p.cover} alt="" loading="lazy" />
              <span className={s.count}>{p.tracks ? `${p.tracks} Tracks` : 'Playlist'}</span>
              <span className={s.foot}>
                <span className={s.play} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                  </svg>
                </span>
                <span className={s.names}>
                  <strong>{p.title}</strong>
                  <small>{isDemo ? 'Sample · not mine' : p.subtitle ?? 'My playlist'}</small>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open &&
        createPortal(
          <div className={s.player} role="dialog" aria-label={`${open.title} on Spotify`}>
            <div className={s.playerBar}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={siSpotify.path} fill="currentColor" />
              </svg>
              <span>{open.title}</span>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close player">
                ✕
              </button>
            </div>
            <iframe
              key={open.id}
              title={`Spotify player: ${open.title}`}
              src={`https://open.spotify.com/embed/playlist/${open.id}?utm_source=generator&theme=0`}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>,
          document.body,
        )}
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import mine from '@/content/playlists.json';
import demo from '@/content/playlists.demo.json';
import MusicPlayer, { type Playlist } from './MusicPlayer';
import s from './PlaylistStack.module.css';

// Three of Ena's playlists, stacked and tilted like the tool tiles. Pressing one opens her music
// player (MusicPlayer.tsx), docked bottom-centre so the music keeps going while visitors scroll.
// Data comes from content/playlists.json (npm run playlists); ?playlists=demo previews the layout
// with three public Spotify playlists.

const TINTS = ['#f08a3c', '#3557e8', '#e5484d'];

export default function PlaylistStack() {
  const [list, setList] = useState<Playlist[]>(mine as Playlist[]);
  const [isDemo, setIsDemo] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (new URLSearchParams(location.search).get('playlists') === 'demo') {
      setList(demo as Playlist[]);
      setIsDemo(true);
    }
  }, []);

  if (!list.length) return null;
  const shown = list.slice(0, 3);

  return (
    <>
      <ul className={s.stack} aria-label={isDemo ? 'Sample playlists (demo)' : 'My playlists'}>
        {shown.map((p, i) => (
          <li
            key={p.id}
            className={s.item}
            data-playing={open === i || undefined}
            style={{ ['--i' as string]: i, ['--tint' as string]: TINTS[i % TINTS.length] }}
          >
            <button type="button" className={s.card} onClick={() => setOpen(i)} aria-label={`Play ${p.title}`}>
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
      {open !== null && <MusicPlayer list={shown} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}

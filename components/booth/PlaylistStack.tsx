'use client';

import { useEffect, useState } from 'react';
import mine from '@/content/playlists.json';
import demo from '@/content/playlists.demo.json';
import type { Playlist } from './MusicPlayer';
import { music, useMusic } from './musicStore';
import s from './PlaylistStack.module.css';

// Three of Ena's playlists as mini covers, side by side and tilted like the tool tiles. Pressing one
// starts a preview in the mini LEGO player at the bottom of the screen (MusicPlayer.tsx).
// Data comes from content/playlists.json (npm run playlists); ?playlists=demo previews the layout
// with three public Spotify playlists.

export default function PlaylistStack() {
  const [list, setList] = useState<Playlist[]>(mine as Playlist[]);
  const [isDemo, setIsDemo] = useState(false);
  const playing = useMusic();

  useEffect(() => {
    if (new URLSearchParams(location.search).get('playlists') === 'demo') {
      setList(demo as Playlist[]);
      setIsDemo(true);
    }
  }, []);

  if (!list.length) return null;
  const shown = list.slice(0, 3);

  return (
    <div className={s.wrap}>
      <ul className={s.row} aria-label={isDemo ? 'Sample playlists (demo)' : 'My playlists'}>
        {shown.map((p, i) => {
          const on = playing?.list[playing.index]?.id === p.id;
          return (
            <li key={p.id} className={s.item} data-playing={on || undefined} style={{ ['--i' as string]: i }}>
              <button
                type="button"
                className={s.card}
                onClick={() => music.set({ list: shown, index: i, at: Date.now() })}
                aria-label={`Play a preview of ${p.title}`}
              >
                <img src={p.cover} alt="" loading="lazy" />
                <span className={s.play} aria-hidden="true">
                  {on ? (
                    <span className={s.eq}>
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                    </svg>
                  )}
                </span>
              </button>
              <span className={s.tip} aria-hidden="true">
                {p.title}
                {isDemo ? ' (sample)' : ''}
              </span>
            </li>
          );
        })}
      </ul>
      <span className={s.caption}>on repeat</span>
    </div>
  );
}

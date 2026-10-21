'use client';

import { useEffect, useState } from 'react';
import mine from '@/content/playlists.json';
import demo from '@/content/playlists.demo.json';
import type { Playlist } from './MusicPlayer';
import { music, useMusic } from './musicStore';
import s from './PlaylistStack.module.css';

// Three of Ena's playlists, stacked and tilted like the tool tiles. Pressing one starts a preview in
// the mini LEGO player at the bottom of the screen (MusicPlayer.tsx); ↗ goes straight to Spotify.
// Data comes from content/playlists.json (npm run playlists), and each visit asks Spotify (oEmbed,
// which allows browser requests) for the current name and cover, so the daylist is always today's.
// ?playlists=demo previews the layout with three public Spotify playlists.

const TINTS = ['#f08a3c', '#3557e8', '#e5484d'];

export default function PlaylistStack() {
  const [list, setList] = useState<Playlist[]>(mine as Playlist[]);
  const [isDemo, setIsDemo] = useState(false);
  const playing = useMusic();

  useEffect(() => {
    if (new URLSearchParams(location.search).get('playlists') === 'demo') {
      setList(demo as Playlist[]);
      setIsDemo(true);
      return;
    }
    // Refresh names and covers from Spotify; keep what we have if that fails.
    Promise.all(
      (mine as Playlist[]).map((p) =>
        fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(p.url)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d: { title?: string; thumbnail_url?: string } | null) =>
            d ? { ...p, title: d.title || p.title, cover: d.thumbnail_url || p.cover } : p,
          )
          .catch(() => p),
      ),
    ).then(setList);
  }, []);

  if (!list.length) return null;
  const shown = list.slice(0, 3);

  return (
    <ul className={s.stack} aria-label={isDemo ? 'Sample playlists (demo)' : 'My playlists'}>
      {shown.map((p, i) => {
        const on = playing?.list[playing.index]?.id === p.id;
        return (
          <li
            key={p.id}
            className={s.item}
            data-playing={on || undefined}
            style={{ ['--i' as string]: i, ['--tint' as string]: TINTS[i % TINTS.length] }}
          >
            <button
              type="button"
              className={s.card}
              onClick={() => music.set({ list: shown, index: i, at: Date.now() })}
              aria-label={`Play a preview of ${p.title}`}
            >
              <img src={p.cover} alt="" loading="lazy" />
              <span className={s.count}>{p.daily ? 'Updates daily' : p.tracks ? `${p.tracks} Tracks` : 'Playlist'}</span>
              <span className={s.foot}>
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
                <span className={s.names}>
                  <strong>{p.title}</strong>
                  <small>{isDemo ? 'Sample · not mine' : p.subtitle ?? 'My playlist'}</small>
                </span>
              </span>
            </button>
            <a className={s.out} href={p.url} target="_blank" rel="noopener" aria-label={`Open ${p.title} in Spotify`}>
              ↗
            </a>
          </li>
        );
      })}
    </ul>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { siSpotify } from 'simple-icons';
import { music } from './musicStore';
import s from './MusicPlayer.module.css';

// The mini player: a blue LEGO brick docked bottom-centre, holding Spotify's own compact embed
// (song, 30-second preview for logged-out visitors, play/pause, Spotify's attribution) with stud
// buttons beside it to share the playlist or go straight to it on Spotify. Spotify's official
// iFrame API lets a press on a playlist card start playing at once and switch playlists in place.

export type Playlist = {
  id: string;
  url: string;
  title: string;
  cover: string;
  tracks: number | null;
  subtitle: string | null;
};

type Controller = {
  loadUri: (uri: string) => void;
  play: () => void;
  destroy: () => void;
  addListener: (event: string, cb: () => void) => void;
};
type IFrameAPI = {
  createController: (el: HTMLElement, opts: { uri: string; width: string; height: number }, cb: (c: Controller) => void) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
  }
}

// Spotify's script only loads the first time someone presses a playlist.
let api: Promise<IFrameAPI> | null = null;
const loadApi = () =>
  (api ??= new Promise((resolve) => {
    window.onSpotifyIframeApiReady = resolve;
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    document.body.appendChild(script);
  }));

const STUDS = Array.from({ length: 8 });

type Props = { list: Playlist[]; index: number; at: number };

export default function MusicPlayer({ list, index, at }: Props) {
  const playlist = list[index];
  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<Controller | null>(null);
  const [note, setNote] = useState('');

  // Create the Spotify controller once; it starts playing as soon as it's ready.
  useEffect(() => {
    let cancelled = false;
    loadApi().then((iframeApi) => {
      if (cancelled || !host.current) return;
      iframeApi.createController(host.current, { uri: `spotify:playlist:${playlist.id}`, width: '100%', height: 80 }, (c) => {
        ctrl.current = c;
        c.addListener('ready', () => c.play());
      });
    });
    return () => {
      cancelled = true;
      ctrl.current?.destroy();
      ctrl.current = null;
    };
    // The controller lives as long as the player; switching goes through loadUri below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Another card pressed: switch playlists in place, or replay the same one.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    ctrl.current?.loadUri(`spotify:playlist:${playlist.id}`);
    ctrl.current?.play();
  }, [playlist.id, at]);

  const flash = (text: string) => {
    setNote(text);
    window.setTimeout(() => setNote(''), 1800);
  };

  const share = async () => {
    const data = { title: `${playlist.title} · a playlist by Ena Otuokon`, url: playlist.url };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(playlist.url);
        flash('Playlist link copied');
      }
    } catch {
      // Share sheet dismissed; nothing to do.
    }
  };

  return (
    <div className={s.dock} role="region" aria-label={`Spotify preview: ${playlist.title}`}>
      <span className={s.studs} aria-hidden="true">
        {STUDS.map((_, i) => (
          <i key={i} />
        ))}
      </span>
      <div className={s.brick}>
        <div className={s.embed}>
          <div ref={host} />
        </div>
        <div className={s.side}>
          <button type="button" className={s.stud} onClick={share} aria-label="Share this playlist">
            <svg viewBox="0 0 24 24"><path d="M12 15V3M7 8l5-5 5 5M5 12v8h14v-8" /></svg>
          </button>
          <a className={`${s.stud} ${s.green}`} href={playlist.url} target="_blank" rel="noopener" aria-label={`Open ${playlist.title} in Spotify`}>
            <svg viewBox="0 0 24 24"><path d={siSpotify.path} className={s.fill} /></svg>
          </a>
        </div>
      </div>
      <button type="button" className={s.close} onClick={() => music.set(null)} aria-label="Stop and close the player">
        <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      {note && (
        <span className={s.note} role="status">
          {note}
        </span>
      )}
    </div>
  );
}

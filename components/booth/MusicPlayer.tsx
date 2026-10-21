'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { siSpotify } from 'simple-icons';
import s from './MusicPlayer.module.css';

// Ena's own player, in the style of her reference: big cover, indigo glass panel, dotted progress,
// shuffle / play / repeat. It drives Spotify's embed through the official iFrame API, and keeps
// that embed visible at its compact 80px size at the foot of the card (attribution, and too small
// for Spotify's "Get Spotify" overlay). Collapses into a centred pill at navbar size; the embed
// stays mounted underneath so the music keeps playing. Logged-out visitors get 30-second previews.

export type Playlist = { id: string; url: string; title: string; cover: string; tracks: number | null; subtitle: string | null };

type Controller = {
  loadUri: (uri: string) => void;
  play: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  destroy: () => void;
  addListener: (event: string, cb: (e: { data: Record<string, unknown> }) => void) => void;
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

const clock = (ms: number) => {
  const sec = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
};

type Props = { list: Playlist[]; index: number; onIndex: (i: number) => void; onClose: () => void };

export default function MusicPlayer({ list, index, onIndex, onClose }: Props) {
  const playlist = list[index];
  const host = useRef<HTMLDivElement>(null);
  const full = useRef<HTMLDivElement>(null);
  const ctrl = useRef<Controller | null>(null);
  const openedAt = useRef(0);
  const [expanded, setExpanded] = useState(true);
  const [height, setHeight] = useState(560);
  const [paused, setPaused] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [track, setTrack] = useState<{ uri: string; title: string; art: string } | null>(null);

  // Create the Spotify controller once; later playlist changes reuse it.
  useEffect(() => {
    let cancelled = false;
    loadApi().then((iframeApi) => {
      if (cancelled || !host.current) return;
      iframeApi.createController(host.current, { uri: `spotify:playlist:${playlist.id}`, width: '100%', height: 80 }, (c) => {
        ctrl.current = c;
        c.addListener('ready', () => c.play());
        c.addListener('playback_update', ({ data }) => {
          setPaused(Boolean(data.isPaused));
          setPosition(Number(data.position) || 0);
          setDuration(Number(data.duration) || 0);
          const uri = typeof data.playingURI === 'string' ? data.playingURI : '';
          if (uri.startsWith('spotify:track:')) setTrack((t) => (t?.uri === uri ? t : { uri, title: '', art: '' }));
        });
      });
    });
    return () => {
      cancelled = true;
      ctrl.current?.destroy();
      ctrl.current = null;
    };
    // The controller lives as long as the player; switching playlists goes through loadUri below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch playlists without rebuilding the embed.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setTrack(null);
    setPosition(0);
    ctrl.current?.loadUri(`spotify:playlist:${playlist.id}`);
    ctrl.current?.play();
  }, [playlist.id]);

  // Look up the playing song's title and cover (Spotify's oEmbed allows browser requests).
  useEffect(() => {
    if (!track || track.title) return;
    const id = track.uri.split(':')[2];
    fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/track/${id}`)
      .then((r) => r.json())
      .then((d: { title?: string; thumbnail_url?: string }) =>
        setTrack((t) => (t?.uri === track.uri ? { ...t, title: d.title ?? '', art: d.thumbnail_url ?? '' } : t)),
      )
      .catch(() => {});
  }, [track]);

  // Mark the page so the section pill steps aside; Esc and scrolling away collapse the card.
  useEffect(() => {
    document.body.dataset.music = 'on';
    openedAt.current = window.scrollY;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setExpanded(false);
    const onScroll = () => Math.abs(window.scrollY - openedAt.current) > 400 && setExpanded(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      delete document.body.dataset.music;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // The card morphs between pill and card; it needs the expanded content's real height to do that.
  useLayoutEffect(() => {
    const el = full.current!;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const expand = () => {
    openedAt.current = window.scrollY;
    setExpanded(true);
  };
  const step = (by: number) => onIndex((index + by + list.length) % list.length);
  const shuffle = () => onIndex(list.length > 1 ? (index + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length : index);
  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    ctrl.current?.seek((((e.clientX - r.left) / r.width) * duration) / 1000);
  };

  const title = track?.title || playlist.title;
  const subtitle = track?.title ? playlist.title : 'Spotify preview';
  const art = track?.art || playlist.cover;
  const progress = duration ? Math.min(100, (position / duration) * 100) : 0;

  return createPortal(
    <div
      className={s.player}
      data-expanded={expanded || undefined}
      style={{ ['--h' as string]: `${height}px` }}
      role="region"
      aria-label={`Music player: ${playlist.title}`}
    >
      <div ref={full} className={s.full} aria-hidden={!expanded}>
        <div className={s.top}>
          <img className={s.cover} src={art} alt="" />
          <button type="button" className={s.collapse} onClick={() => setExpanded(false)} aria-label="Minimise player" tabIndex={expanded ? 0 : -1}>
            <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
          </button>
        </div>
        <div className={s.panel}>
          <div className={s.heading}>
            <div className={s.names}>
              <span className={s.sub}>{subtitle}</span>
              <strong className={s.title}>{title}</strong>
            </div>
            <a className={s.round} href={playlist.url} target="_blank" rel="noopener" aria-label="Open on Spotify to save it" tabIndex={expanded ? 0 : -1}>
              <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
            </a>
          </div>
          <div className={s.progress}>
            <span>{clock(position)}</span>
            <div className={s.track} onClick={seekTo} role="presentation">
              <i style={{ width: `${progress}%` }} />
            </div>
            <span>{clock(duration)}</span>
          </div>
          <div className={s.controls}>
            <button type="button" className={s.round} onClick={shuffle} aria-label="Shuffle to another playlist" tabIndex={expanded ? 0 : -1}>
              <svg viewBox="0 0 24 24"><path d="M3 6h3c5 0 7 12 12 12h3M3 18h3c2 0 3.5-2 4.5-4M21 6h-3c-2 0-3.5 2-4.5 4M18 3l3 3-3 3M18 15l3 3-3 3" /></svg>
            </button>
            <button type="button" className={s.round} onClick={() => step(-1)} aria-label="Previous playlist" tabIndex={expanded ? 0 : -1}>
              <svg viewBox="0 0 24 24"><path d="M6 5v14M18 5 9 12l9 7z" /></svg>
            </button>
            <button type="button" className={s.play} onClick={() => ctrl.current?.togglePlay()} aria-label={paused ? 'Play' : 'Pause'} tabIndex={expanded ? 0 : -1}>
              {paused ? (
                <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" className={s.fill} /></svg>
              ) : (
                <svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" className={s.fill} /></svg>
              )}
            </button>
            <button type="button" className={s.round} onClick={() => step(1)} aria-label="Next playlist" tabIndex={expanded ? 0 : -1}>
              <svg viewBox="0 0 24 24"><path d="M18 5v14M6 5l9 7-9 7z" /></svg>
            </button>
            <button type="button" className={s.round} onClick={() => ctrl.current?.seek(0)} aria-label="Start the song again" tabIndex={expanded ? 0 : -1}>
              <svg viewBox="0 0 24 24"><path d="M4 11V9a3 3 0 0 1 3-3h13l-3-3M20 13v2a3 3 0 0 1-3 3H4l3 3" /></svg>
            </button>
          </div>
        </div>
        <div className={s.embed}>
          <div ref={host} />
        </div>
      </div>

      <div className={s.mini} aria-hidden={expanded}>
        <img className={s.thumb} src={art} alt="" data-spin={!paused || undefined} />
        <span className={s.miniNames}>
          <strong>{title}</strong>
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={siSpotify.path} className={s.fill} /></svg>
            {subtitle}
          </span>
        </span>
        {!paused && (
          <span className={s.eq} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
        <button type="button" className={s.miniBtn} onClick={() => ctrl.current?.togglePlay()} aria-label={paused ? 'Play' : 'Pause'} tabIndex={expanded ? -1 : 0}>
          {paused ? (
            <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" className={s.fill} /></svg>
          ) : (
            <svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" className={s.fill} /></svg>
          )}
        </button>
        <button type="button" className={s.miniBtn} onClick={expand} aria-label="Open player" tabIndex={expanded ? -1 : 0}>
          <svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6" /></svg>
        </button>
        <button type="button" className={s.miniBtn} onClick={onClose} aria-label="Close player" tabIndex={expanded ? -1 : 0}>
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}

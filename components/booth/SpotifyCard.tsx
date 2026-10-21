'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { siSpotify } from 'simple-icons';
import s from './SpotifyCard.module.css';

// A floating "what I'm listening to" card, fed by /api/now-playing (netlify/functions/now-playing.mjs).
// Prev/next flip through recent tracks; the play button opens the track on Spotify. The card stays
// hidden until Spotify is connected. Add ?spotify=demo to the URL to preview it with sample tracks.

type Track = {
  id: string;
  title: string;
  artist: string;
  art: string | null;
  url: string;
  durationMs: number;
  live: boolean;
  progressMs?: number;
  playedAt?: string;
};

const DEMO: Track[] = [
  { id: 'd1', title: 'Borderline', artist: 'Tame Impala', art: null, url: 'https://open.spotify.com', durationMs: 309000, live: true, progressMs: 201000 },
  { id: 'd2', title: 'Sample track', artist: 'Sample artist', art: null, url: 'https://open.spotify.com', durationMs: 214000, live: false, playedAt: new Date(Date.now() - 36e5).toISOString() },
];

type Note = { id: number; glyph: string; x: number; y: number; dx: number; dy: number; rot: number; size: number; color: string; delay: number };

// U+FE0E asks for the plain text glyph, not the emoji, so the notes take our colours.
const GLYPHS = ['♪', '♫', '♬', '♩'].map((g) => `${g}︎`);
const NOTE_COLOURS = ['#f2c94c', '#3557e8', '#e5484d', '#4faf5b', '#f08a3c'];

/** A quick wobble when the card is tapped. */
const SHAKE: Keyframe[] = [
  { transform: 'rotate(0deg)' },
  { transform: 'rotate(-7deg) translateX(-5px)' },
  { transform: 'rotate(6deg) translateX(5px)' },
  { transform: 'rotate(-4deg) translateX(-3px)' },
  { transform: 'rotate(2deg) translateX(2px)' },
  { transform: 'rotate(0deg)' },
];

const clock = (ms: number) => {
  const sec = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
};

const ago = (iso?: string) => {
  if (!iso) return '';
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 60) return `${Math.max(1, min)}m ago`;
  if (min < 60 * 24) return `${Math.round(min / 60)}h ago`;
  return `${Math.round(min / 1440)}d ago`;
};

export default function SpotifyCard() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [demo, setDemo] = useState(false);
  const [index, setIndex] = useState(0);
  const [fetchedAt, setFetchedAt] = useState(0);
  const [now, setNow] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [shared, setShared] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const card = useRef<HTMLElement>(null);
  const noteId = useRef(0);

  // Tap: the card shakes and a handful of music notes tumble out from where it was tapped.
  const tap = (e: PointerEvent<HTMLElement>) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    card.current?.animate(SHAKE, { duration: 520, easing: 'ease-out' });
    const box = e.currentTarget.parentElement!.getBoundingClientRect();
    const burst: Note[] = Array.from({ length: 8 }, () => ({
      id: noteId.current++,
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      x: e.clientX - box.left,
      y: e.clientY - box.top,
      dx: (Math.random() - 0.5) * 220,
      dy: 160 + Math.random() * 160,
      rot: (Math.random() - 0.5) * 120,
      size: 18 + Math.random() * 16,
      color: NOTE_COLOURS[Math.floor(Math.random() * NOTE_COLOURS.length)],
      delay: Math.random() * 0.12,
    }));
    setNotes((n) => [...n, ...burst]);
    window.setTimeout(() => setNotes((n) => n.filter((note) => !burst.includes(note))), 1700);
  };

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/now-playing');
      const body = (await res.json()) as { tracks: Track[] };
      setTracks(body.tracks ?? []);
      setFetchedAt(Date.now());
    } catch {
      setTracks([]);
    }
  }, []);

  useEffect(() => {
    if (new URLSearchParams(location.search).get('spotify') === 'demo') {
      setDemo(true);
      setTracks(DEMO);
      setFetchedAt(Date.now());
      return;
    }
    load();
    const id = window.setInterval(() => !document.hidden && load(), 60_000);
    return () => window.clearInterval(id);
  }, [load]);

  // Tick the progress bar of a live track once a second.
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!tracks.length) return null;
  const track = tracks[Math.min(index, tracks.length - 1)];
  const next = tracks[(index + 1) % tracks.length];
  const elapsed = track.live ? Math.min(track.durationMs, (track.progressMs ?? 0) + (now - fetchedAt)) : 0;
  const go = (step: number) => setIndex((i) => (i + step + tracks.length) % tracks.length);

  const share = async () => {
    const data = { title: `${track.title} · ${track.artist}`, url: track.url };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(track.url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    } catch {}
  };

  return (
    <div className={s.float}>
      {tracks.length > 1 && (
        <div className={s.back} aria-hidden="true" style={next.art ? { ['--art' as string]: `url(${next.art})` } : undefined}>
          <span className={s.bg} />
        </div>
      )}
      {notes.map((n) => (
        <span
          key={n.id}
          className={s.note}
          aria-hidden="true"
          style={{
            left: n.x,
            top: n.y,
            color: n.color,
            fontSize: n.size,
            animationDelay: `${n.delay}s`,
            ['--dx' as string]: `${n.dx}px`,
            ['--dy' as string]: `${n.dy}px`,
            ['--rot' as string]: `${n.rot}deg`,
          }}
        >
          {n.glyph}
        </span>
      ))}
      <article
        ref={card}
        className={s.card}
        onPointerDown={tap}
        aria-label="What I'm listening to on Spotify"
        style={track.art ? { ['--art' as string]: `url(${track.art})` } : undefined}
      >
        <span className={s.bg} aria-hidden="true" />
        <header className={s.head}>
          <svg viewBox="0 0 24 24" className={s.logo} aria-hidden="true">
            <path d={siSpotify.path} fill="currentColor" />
          </svg>
          <span className={s.label}>{demo ? 'Sample · not live' : track.live ? 'Now playing' : 'Recently played'}</span>
          <a className={s.playNow} href={track.url} target="_blank" rel="noopener">
            Play now
          </a>
        </header>

        <div className={s.row}>
          <div className={s.art} data-spin={track.live || undefined}>
            {track.art ? <img src={track.art} alt="" /> : <span className={s.vinyl} />}
          </div>
          <div className={s.controls}>
            <button type="button" onClick={() => go(-1)} aria-label="Previous track" disabled={tracks.length < 2}>
              <svg viewBox="0 0 24 24">
                <path d="M6 5v14M18 5 9 12l9 7z" />
              </svg>
            </button>
            <a className={s.play} href={track.url} target="_blank" rel="noopener" aria-label={`Play ${track.title} on Spotify`}>
              <svg viewBox="0 0 24 24">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <button type="button" onClick={() => go(1)} aria-label="Next track" disabled={tracks.length < 2}>
              <svg viewBox="0 0 24 24">
                <path d="M18 5v14M6 5l9 7-9 7z" />
              </svg>
            </button>
          </div>
        </div>

        <div className={s.panel}>
          <div className={s.meta}>
            <p className={s.title}>{track.title}</p>
            <p className={s.artist}>{track.artist}</p>
          </div>
          <button type="button" className={s.icon} onClick={share} aria-label={shared ? 'Link copied' : 'Share this track'}>
            {shared ? (
              <svg viewBox="0 0 24 24">
                <path d="m5 12 5 5 9-10" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <path d="M12 15V3M7 8l5-5 5 5M5 12v8h14v-8" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className={s.icon}
            data-on={liked[track.id] || undefined}
            onClick={() => setLiked((l) => ({ ...l, [track.id]: !l[track.id] }))}
            aria-pressed={!!liked[track.id]}
            aria-label="Like"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
            </svg>
          </button>
        </div>

        <div className={`${s.panel} ${s.progress}`}>
          <button type="button" className={s.icon} onClick={() => setIndex(Math.floor(Math.random() * tracks.length))} aria-label="Shuffle">
            <svg viewBox="0 0 24 24">
              <path d="M3 6h3c5 0 7 12 12 12h3M3 18h3c2 0 3.5-2 4.5-4M21 6h-3c-2 0-3.5 2-4.5 4M18 3l3 3-3 3M18 15l3 3-3 3" />
            </svg>
          </button>
          <span className={s.time}>{track.live ? clock(elapsed) : ago(track.playedAt)}</span>
          <span className={s.bar}>
            <i style={{ width: `${track.live ? (elapsed / track.durationMs) * 100 : 0}%` }} />
          </span>
          <span className={s.time}>{track.live ? `-${clock(track.durationMs - elapsed)}` : clock(track.durationMs)}</span>
          <button type="button" className={s.icon} onClick={() => setIndex(0)} aria-label="Back to the latest track">
            <svg viewBox="0 0 24 24">
              <path d="M4 11V9a3 3 0 0 1 3-3h13l-3-3M20 13v2a3 3 0 0 1-3 3H4l3 3" />
            </svg>
          </button>
        </div>
      </article>
    </div>
  );
}

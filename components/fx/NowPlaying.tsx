'use client';

import { useEffect, useState } from 'react';
import s from './fx.module.css';

// A floating "now playing" pill that names the section on screen, like a track on a deck display.
// It slides in once the booth has scrolled away; the skip button jumps to the next section.
const TRACKLIST = [
  { id: 'top', label: 'The booth' },
  { id: 'work', label: 'Selected work' },
  { id: 'experience', label: 'Experience' },
  { id: 'setlist', label: 'The set list' },
  { id: 'about', label: 'About' },
  { id: 'writing', label: 'Liner notes' },
  { id: 'contact', label: 'Contact' },
];

export default function NowPlaying() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let index = 0;
      TRACKLIST.forEach((t, i) => {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top <= line) index = i;
      });
      setCurrent(index);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const track = TRACKLIST[current];
  const next = TRACKLIST[(current + 1) % TRACKLIST.length];
  const skip = () => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(next.id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <aside className={s.now} data-shown={current > 0 || undefined} aria-label="Now playing" aria-hidden={current === 0}>
      <span className={s.eq} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className={s.nowText}>
        <span className={s.nowLabel}>Now playing</span>
        <span className={s.nowTrack}>
          {String(current + 1).padStart(2, '0')} · {track.label}
        </span>
      </span>
      <button type="button" className={s.skip} onClick={skip} tabIndex={current === 0 ? -1 : 0} aria-label={`Skip to ${next.label}`}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M5 5l9 7-9 7zM16 5h3v14h-3z" fill="currentColor" />
        </svg>
      </button>
    </aside>
  );
}

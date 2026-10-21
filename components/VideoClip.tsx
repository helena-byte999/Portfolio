'use client';

import { useEffect, useRef, useState } from 'react';
import type { Clip } from '@/content/work';
import s from './VideoClip.module.css';

// A prototype recording that loops silently while it's on screen and pauses when it isn't.
// Nothing downloads until it's near the viewport. With reduced motion it waits for a press.
export default function VideoClip({ clip }: { clip: Clip }) {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true);
      return;
    }
    const v = video.current!;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // React doesn't keep the `muted` attribute in sync, so set the property directly.
  useEffect(() => {
    if (video.current) video.current.muted = muted;
  }, [muted]);

  return (
    <figure className={`${s.clip} ${clip.shape === 'phone' ? s.phone : s.wide}`}>
      <div className={s.stage}>
        <video
          ref={video}
          src={clip.src}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="none"
          controls={still}
          aria-label={`${clip.title}: ${clip.text}`}
        />
        {clip.sound && !still && (
          <button type="button" className={s.sound} onClick={() => setMuted((m) => !m)} aria-pressed={!muted}>
            {muted ? '🔇 Sound off' : '🔊 Sound on'}
          </button>
        )}
      </div>
      <figcaption>
        <strong>{clip.title}</strong>
        <span>{clip.text}</span>
      </figcaption>
    </figure>
  );
}

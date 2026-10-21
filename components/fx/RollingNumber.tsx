'use client';

import { useEffect, useRef, useState } from 'react';
import s from './fx.module.css';

// Each digit is a 0–9 reel that spins to its value the first time the number scrolls into view.
export default function RollingNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  let reel = 0;
  return (
    <span ref={ref} className={s.roll} data-on={on || undefined}>
      <span className="visually-hidden">{value}</span>
      {[...value].map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className={s.reel} aria-hidden="true">
            <span className={s.strip} style={{ ['--d' as string]: ch, ['--i' as string]: reel++ }}>
              {'0123456789'.split('').map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

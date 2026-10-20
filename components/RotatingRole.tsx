'use client';

import { useEffect, useState } from 'react';
import s from './Hero.module.css';

// Cycles through the roles like a track title on a deck display.
export default function RotatingRole({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % roles.length), 2400);
    return () => window.clearInterval(id);
  }, [roles.length]);

  return (
    <span className={s.role}>
      <span className="visually-hidden">{roles.join(', ')}</span>
      <span className={s.roleWindow} aria-hidden="true">
        <span key={i} className={s.roleText}>
          {roles[i]}
        </span>
      </span>
    </span>
  );
}

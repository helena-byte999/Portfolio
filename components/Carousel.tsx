'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import s from './Carousel.module.css';

// A swipeable row of cards with the work deck's controls: optional filter pills with a sliding
// indicator, an "01 / 08" counter and arrows. Used for skills, credentials and writing.

export type CarouselItem = { key: string; group?: string; node: ReactNode };

type Props = {
  label: string;
  items: CarouselItem[];
  filters?: { id: string; label: string }[];
  /** Card width, e.g. 'min(380px, 84vw)'. */
  width?: string;
};

const two = (n: number) => String(n).padStart(2, '0');

export default function Carousel({ label, items, filters, width = 'min(380px, 84vw)' }: Props) {
  const row = useRef<HTMLOListElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [filter, setFilter] = useState('all');
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const shown = items.filter((it) => filter === 'all' || it.group === filter);

  useLayoutEffect(() => {
    if (!filters) return;
    const place = () => {
      const active = tabs.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (active) setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [filter, filters]);

  const step = () => {
    const first = row.current?.children[0] as HTMLElement | undefined;
    const gap = parseFloat(getComputedStyle(row.current!).columnGap) || 0;
    return first ? first.offsetWidth + gap : 1;
  };
  const onScroll = () => setCurrent(Math.min(shown.length - 1, Math.round(row.current!.scrollLeft / step())));
  const go = (dir: 1 | -1) => row.current!.scrollBy({ left: dir * step(), behavior: 'smooth' });
  const pick = (id: string) => {
    setFilter(id);
    setCurrent(0);
    row.current?.scrollTo({ left: 0 });
  };

  return (
    <div className={s.carousel}>
      <div className={`wrap ${s.bar}`}>
        {filters ? (
          <div ref={tabs} className={s.tabs} role="group" aria-label={`Filter ${label.toLowerCase()}`}>
            <span className={s.indicator} style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} aria-hidden="true" />
            {[{ id: 'all', label: 'All' }, ...filters].map((f) => (
              <button key={f.id} type="button" className={s.tab} aria-pressed={filter === f.id} onClick={() => pick(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className={s.controls}>
          <span className="mono" aria-live="polite">
            {two(current + 1)} / {two(shown.length)}
          </span>
          <button type="button" className={s.arrow} onClick={() => go(-1)} aria-label="Previous" disabled={current === 0}>
            ←
          </button>
          <button type="button" className={s.arrow} onClick={() => go(1)} aria-label="Next" disabled={current >= shown.length - 1}>
            →
          </button>
        </div>
      </div>
      <ol ref={row} className={s.row} style={{ ['--w' as string]: width }} onScroll={onScroll} aria-label={label}>
        {shown.map((it) => (
          <li key={it.key} className={s.slide}>
            {it.node}
          </li>
        ))}
      </ol>
    </div>
  );
}

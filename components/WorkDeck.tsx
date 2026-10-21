'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { PADS, WORK_INTRO } from '@/content/site';
import { B_SIDES, SHELVES, TRACKS, type Shelf } from '@/content/work';
import { Squiggle } from './fx/Doodles';
import Rise from './fx/Rise';
import s from './WorkDeck.module.css';

const two = (n: number) => String(n).padStart(2, '0');


/** Tilt card: the card leans toward the cursor and a soft glare follows it. */
function tilt(e: PointerEvent<HTMLLIElement>) {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
  el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
  el.style.setProperty('--gx', `${x * 100}%`);
  el.style.setProperty('--gy', `${y * 100}%`);
}

function untilt(e: PointerEvent<HTMLLIElement>) {
  for (const p of ['--rx', '--ry', '--gx', '--gy']) e.currentTarget.style.removeProperty(p);
}

export default function WorkDeck() {
  const deck = useRef<HTMLOListElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [shelf, setShelf] = useState<Shelf | 'all'>('all');
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const tracks = TRACKS.map((t, i) => ({ ...t, number: i + 1 })).filter((t) => shelf === 'all' || t.shelves.includes(shelf));

  // Slide the pill indicator under the active filter.
  useLayoutEffect(() => {
    const place = () => {
      const active = tabs.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (active) setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [shelf]);

  const cardStep = () => {
    const first = deck.current?.children[0] as HTMLElement | undefined;
    const gap = parseFloat(getComputedStyle(deck.current!).columnGap) || 0;
    return first ? first.offsetWidth + gap : 1;
  };

  const onScroll = () => {
    setCurrent(Math.min(tracks.length - 1, Math.round(deck.current!.scrollLeft / cardStep())));
  };

  const go = (dir: 1 | -1) => {
    deck.current!.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
  };

  const pick = (id: Shelf | 'all') => {
    setShelf(id);
    setCurrent(0);
    deck.current?.scrollTo({ left: 0 });
  };

  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className={`wrap ${s.head}`}>
        <div data-reveal>
          <p className="eyebrow">{WORK_INTRO.title}</p>
          <h2 id="work-title" className="display section-title">
            <Rise text={WORK_INTRO.tagline} />
          </h2>
          <Squiggle />
          <p className="lede">{WORK_INTRO.text}</p>
        </div>
      </div>

      <div className={`wrap ${s.bar}`}>
        <div ref={tabs} className={s.tabs} role="group" aria-label="Filter projects">
          <span className={s.indicator} style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} aria-hidden="true" />
          {SHELVES.map((sh) => (
            <button key={sh.id} type="button" className={s.tab} aria-pressed={shelf === sh.id} onClick={() => pick(sh.id)}>
              {sh.label}
            </button>
          ))}
        </div>
        <div className={s.controls}>
          <span className="mono" aria-live="polite">
            {two(current + 1)} / {two(tracks.length)}
          </span>
          <button type="button" className={s.arrow} onClick={() => go(-1)} aria-label="Previous project" disabled={current === 0}>
            ←
          </button>
          <button type="button" className={s.arrow} onClick={() => go(1)} aria-label="Next project" disabled={current >= tracks.length - 1}>
            →
          </button>
        </div>
      </div>

      <ol ref={deck} className={s.deck} onScroll={onScroll} aria-label="Projects">
        {tracks.map((t, i) => (
          <li
            key={t.slug}
            className={s.card}
            style={{ ['--accent-c' as string]: PADS[(t.number - 1) % PADS.length].color }}
            onPointerMove={tilt}
            onPointerLeave={untilt}
          >
            <div className={s.media} aria-hidden="true">
              {t.card ? (
                <img src={t.card} alt="" loading={i < 2 ? 'eager' : 'lazy'} />
              ) : t.cover.kind === 'terminal' ? (
                <pre className={s.term}>{t.cover.lines.join('\n')}</pre>
              ) : t.cover.kind === 'stat' ? (
                <span className={s.statBg}>{t.cover.value}</span>
              ) : null}
            </div>
            <div className={s.chips}>
              <span className={s.glass}>Track {two(t.number)}</span>
              {t.year && <span className={s.glass}>{t.year}</span>}
            </div>
            <div className={s.fade} aria-hidden="true" />
            <div className={s.shade} aria-hidden="true" />
            <div className={s.content}>
              <span className={s.badge} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                </svg>
              </span>
              <p className={s.label}>{t.kicker.split(' · ')[0]}</p>
              <h3 className={s.title}>{t.title}</h3>
              <p className={s.sub}>{t.stat ?? t.summary}</p>
              <span className={s.more} aria-hidden="true">
                View case study <span className={s.moreArrow}>→</span>
              </span>
            </div>
            <Link href={`/work/${t.slug}/`} className={s.hit} aria-label={`${t.title}: view case study`} />
          </li>
        ))}
      </ol>

      <div className={`wrap ${s.bsides}`} data-reveal>
        <p className="eyebrow">B-sides</p>
        {B_SIDES.map((b) => (
          <a key={b.title} className={s.bside} href={b.link.href} target="_blank" rel="noopener">
            <span className="mono">{b.kicker}</span>
            <strong>{b.title}</strong>
            <span>{b.text}</span>
            <span className={s.more}>{b.link.label} ↗</span>
          </a>
        ))}
        <a className={s.github} href="https://github.com/helena-byte999" target="_blank" rel="noopener">
          Everything else I build in the open is on GitHub ↗
        </a>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { PADS, WORK_INTRO } from '@/content/site';
import { B_SIDES, TRACKS } from '@/content/work';
import Cover from './Cover';
import s from './WorkDeck.module.css';

const two = (n: number) => String(n).padStart(2, '0');

export default function WorkDeck() {
  const deck = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(0);

  const cardStep = () => {
    const first = deck.current?.children[0] as HTMLElement | undefined;
    const gap = parseFloat(getComputedStyle(deck.current!).columnGap) || 0;
    return first ? first.offsetWidth + gap : 1;
  };

  const onScroll = () => {
    setCurrent(Math.min(TRACKS.length - 1, Math.round(deck.current!.scrollLeft / cardStep())));
  };

  const go = (dir: 1 | -1) => {
    deck.current!.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
  };

  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className={`wrap ${s.head}`}>
        <div data-reveal>
          <p className="eyebrow">{WORK_INTRO.title}</p>
          <h2 id="work-title" className="display section-title">
            {WORK_INTRO.tagline}
          </h2>
          <p className="lede">{WORK_INTRO.text}</p>
        </div>
        <div className={s.controls}>
          <span className="mono" aria-live="polite">
            Track {two(current + 1)} / {two(TRACKS.length)}
          </span>
          <button type="button" className={s.arrow} onClick={() => go(-1)} aria-label="Previous track" disabled={current === 0}>
            ←
          </button>
          <button type="button" className={s.arrow} onClick={() => go(1)} aria-label="Next track" disabled={current === TRACKS.length - 1}>
            →
          </button>
        </div>
      </div>

      <ol ref={deck} className={s.deck} onScroll={onScroll} aria-label="Projects">
        {TRACKS.map((t, i) => (
          <li key={t.slug} className={s.card} style={{ ['--accent-c' as string]: PADS[i % PADS.length].color }}>
            <div className={s.cover}>
              <Cover cover={t.cover} title={t.title} eager={i < 2} />
            </div>
            <div className={s.body}>
              <p className="mono">
                Track {two(i + 1)}
                {t.year ? ` · ${t.year}` : ''}
              </p>
              <h3 className={`display ${s.title}`}>
                <Link href={`/work/${t.slug}/`} className={s.link}>
                  {t.title}
                </Link>
              </h3>
              <p className={s.kicker}>{t.kicker}</p>
              <p className={s.summary}>{t.summary}</p>
              {t.stat && <p className={s.stat}>{t.stat}</p>}
              <span className={s.more} aria-hidden="true">
                View case study →
              </span>
            </div>
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

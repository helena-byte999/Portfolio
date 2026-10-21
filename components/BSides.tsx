import { B_SIDES, type BSide } from '@/content/work';
import s from './BSides.module.css';

// B-sides: frosted glass cards stacked over slowly drifting colour blobs, after her reference.
// Each card bounces in when it scrolls into view, then floats on its own rhythm.

function Body({ b }: { b: BSide }) {
  return (
    <>
      <div className={s.row}>
        <div className={s.words}>
          <h3 className={s.title}>{b.title}</h3>
          <p className={s.text}>{b.text}</p>
        </div>
        {b.thumb ? (
          <img className={s.thumb} src={b.thumb} alt="" loading="lazy" />
        ) : (
          // Four bars: the 2×2 study (certainty × justification)
          <span className={s.chart} aria-hidden="true">
            <i style={{ ['--v' as string]: 0.45 }} />
            <i style={{ ['--v' as string]: 0.7 }} />
            <i style={{ ['--v' as string]: 0.55 }} />
            <i style={{ ['--v' as string]: 0.92 }} />
          </span>
        )}
      </div>
      <div className={s.foot}>
        <ul className={s.chips}>
          {b.chips.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <span className={s.meta}>
          {b.meta}
          {b.href && <span aria-hidden="true"> ↗</span>}
        </span>
      </div>
    </>
  );
}

export default function BSides() {
  return (
    <div className={`wrap ${s.section}`} data-reveal>
      <p className="eyebrow">B-sides</p>
      <div className={s.field}>
        <span className={`${s.blob} ${s.b1}`} aria-hidden="true" />
        <span className={`${s.blob} ${s.b2}`} aria-hidden="true" />
        <span className={`${s.blob} ${s.b3}`} aria-hidden="true" />
        <ul className={s.stack}>
          {B_SIDES.map((b, i) => (
            <li key={b.title} className={s.item} style={{ ['--i' as string]: i }}>
              {b.href ? (
                <a className={s.card} href={b.href} target="_blank" rel="noopener">
                  <Body b={b} />
                </a>
              ) : (
                <div className={s.card}>
                  <Body b={b} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <a className={s.github} href="https://github.com/helena-byte999" target="_blank" rel="noopener">
        Everything else I build in the open is on GitHub ↗
      </a>
    </div>
  );
}

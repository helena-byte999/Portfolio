import s from './Doodles.module.css';

// Hand-drawn marks used as punctuation (the Notion idea): they never carry content.

/** A wavy underline that draws itself when its [data-reveal] block comes into view. */
export function Squiggle({ color = 'var(--yellow)' }: { color?: string }) {
  return (
    <svg className={s.squiggle} viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M3 15 C 28 3, 48 3, 66 13 S 104 24, 126 12 S 166 2, 188 13 S 228 23, 250 11 S 284 6, 297 12"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  );
}

/** A doodled arrow with a scribbled note, pointing at the pads. */
export function PadNote({ text }: { text: string }) {
  return (
    <span className={s.note} aria-hidden="true">
      <span className={s.noteText}>{text}</span>
      <svg viewBox="0 0 90 70" className={s.arrow}>
        <path d="M6 8 C 30 4, 62 14, 70 46" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" pathLength={1} />
        <path d="M58 40 L 71 52 L 80 36" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
      </svg>
    </span>
  );
}

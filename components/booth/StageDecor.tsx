import { siClaude, siFigma, siNotion, siPython, type SimpleIcon } from 'simple-icons';
import { HERO } from '@/content/site';
import RollingNumber from '../fx/RollingNumber';
import s from './StageDecor.module.css';

// Floating app tiles (left) and tilted stickers (right) around the booth, after the reference
// portfolio's keyboard. Tools are from the CV; icons from simple-icons (CC0).
const TOOLS: { icon: SimpleIcon; label: string }[] = [
  { icon: siFigma, label: 'Figma' },
  { icon: siClaude, label: 'Claude Code' },
  { icon: siNotion, label: 'Notion' },
  { icon: siPython, label: 'Python' },
];

const STICKERS = ['var(--orange)', 'var(--yellow)', 'var(--green)'];

export default function StageDecor() {
  return (
    <>
      <ul className={s.tools} aria-label="Tools I use">
        {TOOLS.map(({ icon, label }, i) => (
          <li key={label} className={s.tile} style={{ ['--i' as string]: i }}>
            <svg viewBox="0 0 24 24" role="img" aria-label={label}>
              <path d={icon.path} fill={`#${icon.hex}`} />
            </svg>
            <span className={s.tip} aria-hidden="true">
              {label}
            </span>
          </li>
        ))}
      </ul>
      <ul className={s.stickers} aria-label="Highlights">
        {HERO.proof.map((p, i) => (
          <li key={p.label} className={s.sticker} style={{ ['--i' as string]: i, ['--paper' as string]: STICKERS[i % STICKERS.length] }}>
            <strong>
              <RollingNumber value={p.value} />
            </strong>{' '}
            {p.label}
          </li>
        ))}
      </ul>
    </>
  );
}

import { siClaude, siFigma, siGooglegemini, siJira, siMysql, siNotion, siPython } from 'simple-icons';
import SpotifyCard from './SpotifyCard';
import s from './StageDecor.module.css';

// Floating app tiles (left) and the Spotify card (right) around the booth, after the reference
// portfolio's keyboard. Tools are from the CV; icons from simple-icons (CC0). Codex has no
// published mark there, so it gets a plain terminal glyph rather than an imitation logo.
const CODEX = { path: 'M4 7l5 5-5 5M12 18h8', hex: '161616', stroke: true };

const TOOLS: { icon: { path: string; hex: string; stroke?: boolean }; label: string }[] = [
  { icon: siFigma, label: 'Figma' },
  { icon: siClaude, label: 'Claude Code' },
  { icon: siNotion, label: 'Notion' },
  { icon: siGooglegemini, label: 'Gemini' },
  { icon: CODEX, label: 'Codex' },
  { icon: siPython, label: 'Python' },
  { icon: siJira, label: 'Jira' },
  { icon: siMysql, label: 'MySQL' },
];

export default function StageDecor() {
  return (
    <>
      <ul className={s.tools} aria-label="Tools I use">
        {TOOLS.map(({ icon, label }, i) => (
          <li key={label} className={s.tile} style={{ ['--i' as string]: i }}>
            <svg viewBox="0 0 24 24" role="img" aria-label={label}>
              {icon.stroke ? (
                <path d={icon.path} fill="none" stroke={`#${icon.hex}`} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d={icon.path} fill={`#${icon.hex}`} />
              )}
            </svg>
            <span className={s.tip} aria-hidden="true">
              {label}
            </span>
          </li>
        ))}
      </ul>
      <div className={s.player}>
        <SpotifyCard />
      </div>
    </>
  );
}

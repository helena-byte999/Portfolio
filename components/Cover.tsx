import type { Cover as CoverSpec } from '@/content/work';
import s from './Cover.module.css';

// Device frames and tiles drawn in CSS, so screenshots don't need mocking up by hand.
export default function Cover({ cover, title, eager }: { cover: CoverSpec; title: string; eager?: boolean }) {
  const loading = eager ? 'eager' : 'lazy';

  switch (cover.kind) {
    case 'laptop':
      return (
        <div className={s.laptop}>
          <div className={s.screen}>
            <img src={cover.src} alt={`${title} on a laptop`} loading={loading} />
          </div>
          <div className={s.base} />
          {cover.phone && (
            <div className={s.phone}>
              <img src={cover.phone} alt={`${title} on a phone`} loading={loading} />
            </div>
          )}
        </div>
      );
    case 'slide':
      return (
        <div className={s.slide}>
          <img src={cover.src} alt={`${title}, title slide`} loading={loading} />
        </div>
      );
    case 'stat':
      return (
        <div className={s.stat}>
          <svg className={s.statIcon} viewBox="0 0 64 64" aria-hidden="true">
            {cover.icon === 'lens' ? (
              <>
                <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="32" cy="32" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="32" cy="32" r="5" fill="currentColor" />
              </>
            ) : (
              <path d="M16 8h24l10 10v38H16Z M40 8v10h10 M22 30h22 M22 38h22 M22 46h14" fill="none" stroke="currentColor" strokeWidth="3" />
            )}
          </svg>
          <span className={s.statValue}>{cover.value}</span>
          <span className={s.statLabel}>{cover.label}</span>
        </div>
      );
    case 'terminal':
      return (
        <div className={s.terminal} role="img" aria-label={`${title} running in a terminal`}>
          <div className={s.termBar}>
            <i />
            <i />
            <i />
          </div>
          <pre className={s.termBody}>
            {cover.lines.map((line, i) => (
              <span key={i} className={line.startsWith('$') ? s.termCmd : undefined}>
                {line}
                {'\n'}
              </span>
            ))}
          </pre>
        </div>
      );
  }
}

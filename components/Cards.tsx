import {
  Bot,
  Briefcase,
  Brain,
  ChartColumn,
  ChartLine,
  Code,
  CodeXml,
  Compass,
  Database,
  Disc3,
  FileSpreadsheet,
  Gamepad2,
  Glasses,
  Handshake,
  Headphones,
  Lightbulb,
  ListOrdered,
  Map,
  Network,
  Palette,
  PartyPopper,
  PenLine,
  Puzzle,
  Radio,
  RefreshCw,
  Sparkles,
  Terminal,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import {
  siBlender,
  siClaude,
  siFigma,
  siGithub,
  siGoogle,
  siGooglegemini,
  siJira,
  siNotion,
  siPython,
  siSnapchat,
  siTrello,
  type SimpleIcon,
} from 'simple-icons';
import { CREDENTIAL_KINDS, LOGOS, type Credential } from '@/content/site';
import s from './Cards.module.css';

/* ----- Logo tile ----- */

const BRAND: Record<string, SimpleIcon> = { snapchat: siSnapchat, google: siGoogle };

export function LogoTile({ id, size = 52 }: { id: string; size?: number }) {
  const l = LOGOS[id];
  if (!l) return null;
  // Full lockups (crest + name) keep their own shape at the tile's height.
  if (l.wide) return <img className={s.wideLogo} src={l.img} alt="" style={{ height: size }} />;
  return (
    <span
      className={s.logo}
      style={{ width: size, height: size, background: l.bg, color: l.ink ?? '#fff' }}
      aria-hidden="true"
    >
      {l.img ? (
        <img src={l.img} alt="" />
      ) : l.icon ? (
        <svg viewBox="0 0 24 24">
          <path d={BRAND[l.icon].path} fill="currentColor" />
        </svg>
      ) : (
        <b style={{ fontSize: size * (l.letters!.length > 2 ? 0.28 : 0.36) }}>{l.letters}</b>
      )}
    </span>
  );
}

/* ----- Credentials ----- */

const KIND_LABEL = Object.fromEntries(CREDENTIAL_KINDS.map((k) => [k.id, k.label.replace(/s$/, '')]));

export function CredentialCard({ c }: { c: Credential }) {
  const body = (
    <>
      <div className={s.top}>
        <LogoTile id={c.logo} />
        <span className={s.kind} data-kind={c.kind}>
          {KIND_LABEL[c.kind]}
        </span>
      </div>
      <h3 className={s.title}>{c.title}</h3>
      {c.grade && <p className={s.grade}>{c.grade}</p>}
      <p className={s.org}>{c.org}</p>
      <p className={s.text}>{c.text}</p>
      <div className={s.foot}>
        <span className="mono">{c.dates}</span>
        {c.href && <span className={s.view}>View ↗</span>}
      </div>
    </>
  );
  return c.href ? (
    <a className={`${s.glass} ${s.cred}`} href={c.href} target="_blank" rel="noopener">
      {body}
    </a>
  ) : (
    <article className={`${s.glass} ${s.cred}`}>{body}</article>
  );
}

/* ----- Skills ----- */

type Icon = { lucide: LucideIcon } | { brand: SimpleIcon } | { custom: 'basketball' };

const SKILL_ICONS: Record<string, Icon> = {
  'Strategy & roadmapping': { lucide: Map },
  'Discovery & prioritisation': { lucide: ListOrdered },
  'User research': { lucide: Users },
  'Insight synthesis & requirements': { lucide: Lightbulb },
  'Agile delivery': { lucide: RefreshCw },
  'Metrics & A/B testing': { lucide: ChartColumn },
  'Stakeholder management': { lucide: Handshake },
  'Cross-functional collaboration': { lucide: Network },
  'Creative problem-solving': { lucide: Puzzle },
  'AI/ML & recommender systems': { lucide: Brain },
  'Data analysis': { lucide: ChartLine },
  'UX/UI & AR design': { lucide: Glasses },
  'Software engineering': { lucide: Code },
  'Python 3': { brand: siPython },
  SQL: { lucide: Database },
  'HTML/CSS': { lucide: CodeXml },
  Jira: { brand: siJira },
  Trello: { brand: siTrello },
  Notion: { brand: siNotion },
  Figma: { brand: siFigma },
  'Lens Studio': { brand: siSnapchat },
  Blender: { brand: siBlender },
  'Claude Code': { brand: siClaude },
  'Gemini AI': { brand: siGooglegemini },
  Codex: { lucide: Terminal },
  GitHub: { brand: siGithub },
  Canva: { lucide: Palette },
  Excel: { lucide: FileSpreadsheet },
  'Microsoft Office': { lucide: Briefcase },
  'Google Workspace': { brand: siGoogle },
  DJing: { lucide: Disc3 },
  'Event production': { lucide: PartyPopper },
  'Music discovery & streaming culture': { lucide: Radio },
  AI: { lucide: Bot },
  Basketball: { custom: 'basketball' },
  Writing: { lucide: PenLine },
  'Video games': { lucide: Gamepad2 },
};

const GROUP_ICONS: Record<string, LucideIcon> = {
  'Product & research': Compass,
  Technical: Code,
  Tools: Wrench,
  'Off the clock': Headphones,
};

function SkillIcon({ label }: { label: string }) {
  const icon = SKILL_ICONS[label];
  if (!icon) return <Sparkles aria-hidden="true" />;
  if ('lucide' in icon) {
    const L = icon.lucide;
    return <L aria-hidden="true" />;
  }
  if ('brand' in icon) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={icon.brand.path} fill="currentColor" />
      </svg>
    );
  }
  // Lucide has no basketball, so it's drawn here in the same line style.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2v20M5 5c3 3 3 11 0 14M19 5c-3 3-3 11 0 14" />
    </svg>
  );
}

export function SkillCard({ group, items, color }: { group: string; items: string[]; color: string }) {
  const G = GROUP_ICONS[group] ?? Sparkles;
  return (
    <article className={s.glass} style={{ ['--c' as string]: color }}>
      <div className={s.skillHead}>
        <span className={s.groupIcon}>
          <G aria-hidden="true" />
        </span>
        <h3 className={s.title}>{group}</h3>
        <span className="mono">{String(items.length).padStart(2, '0')}</span>
      </div>
      <ul className={s.skillList}>
        {items.map((item) => (
          <li key={item}>
            <SkillIcon label={item} />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ----- Writing ----- */

export type Post = { title: string; href: string; date: string; minutes: number; blurb: string; thumb: string | null };

const postDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** A post: its header image on top (they carry their own titles), the details on glass below. */
export function PostCard({ p }: { p: Post }) {
  return (
    <a className={`${s.glass} ${s.post}`} href={p.href} target="_blank" rel="noopener">
      <span className={s.thumb}>{p.thumb && <img src={p.thumb} alt="" loading="lazy" />}</span>
      <span className={s.postMeta}>
        <span className={s.kind}>Medium</span>
        <span className="mono">
          {postDate(p.date)} · {p.minutes} min read
        </span>
      </span>
      <h3 className={s.title}>{p.title}</h3>
      <p className={s.text}>{p.blurb}</p>
      <span className={s.foot}>
        <span />
        <span className={s.view}>Read ↗</span>
      </span>
    </a>
  );
}

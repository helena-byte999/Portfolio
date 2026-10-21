import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Cover from '@/components/Cover';
import VideoClip from '@/components/VideoClip';
import { Footer } from '@/components/Sections';
import { PADS } from '@/content/site';
import { TRACKS } from '@/content/work';
import s from './CaseStudy.module.css';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return TRACKS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const track = TRACKS.find((t) => t.slug === slug);
  if (!track) return {};
  return {
    title: track.title,
    description: track.summary,
    openGraph: { title: `${track.title} · Ena Otuokon`, description: track.summary, url: `/work/${track.slug}/` },
  };
}

const two = (n: number) => String(n).padStart(2, '0');

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const index = TRACKS.findIndex((t) => t.slug === slug);
  if (index < 0) notFound();
  const track = TRACKS[index];
  const next = TRACKS[(index + 1) % TRACKS.length];
  const prev = TRACKS[(index - 1 + TRACKS.length) % TRACKS.length];

  return (
    <>
      <main className={s.page} style={{ ['--accent-c' as string]: PADS[index % PADS.length].color }}>
        <div className="wrap">
          <Link href="/#work" className={s.back}>
            ← Back to the set
          </Link>
          <p className={`mono ${s.track}`}>
            Track {two(index + 1)} / {two(TRACKS.length)}
            {track.year ? ` · ${track.year}` : ''}
          </p>
          <h1 className={`display ${s.title}`}>{track.title}</h1>
          <p className={s.kicker}>{track.kicker}</p>
          <p className="lede">{track.summary}</p>

          <dl className={s.meta}>
            {track.meta.map((m) => (
              <div key={m.label}>
                <dt className="mono">{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
          {track.links.length > 0 && (
            <div className={s.links}>
              {track.links.map((l, i) => (
                <a key={l.href} className={`btn ${i === 0 ? 'btn-primary' : ''}`} href={l.href} target="_blank" rel="noopener">
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        <div className={`wrap ${s.coverWrap}`}>
          <div className={s.cover}>
            <Cover cover={track.cover} title={track.title} eager />
          </div>
        </div>

        <div className={`wrap ${s.story}`}>
          <div>
            <p className="eyebrow">The story</p>
            {track.body.map((p) => (
              <p key={p.slice(0, 32)} className={s.para}>
                {p}
              </p>
            ))}
            {track.stat && <p className={s.stat}>{track.stat}</p>}
          </div>
          <aside>
            <p className="eyebrow">What it took</p>
            <ul className="chips">
              {track.tags.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {track.clips && track.clips.length > 0 && (
          <section className={`wrap ${s.notes}`} aria-labelledby="proto-title">
            <p className="eyebrow">Prototype</p>
            <h2 id="proto-title" className={`display ${s.notesTitle}`}>
              See it working
            </h2>
            <div className={s.clips}>
              {track.clips.map((clip) => (
                <VideoClip key={clip.src} clip={clip} />
              ))}
            </div>
          </section>
        )}

        {track.slides.length > 0 && (
          <section className={`wrap ${s.notes}`} aria-labelledby="notes-title">
            <p className="eyebrow">Liner notes</p>
            <h2 id="notes-title" className={`display ${s.notesTitle}`}>
              Step by step
            </h2>
            <ol className={s.slides}>
              {track.slides.map((slide, i) => (
                <li key={slide.src + i} className={s.slide} data-reveal>
                  <img src={slide.src} alt={`${track.title}: ${slide.title}`} loading="lazy" />
                  <div>
                    <span className="mono">{two(i + 1)}</span>
                    <h3>{slide.title}</h3>
                    <p>{slide.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <nav className={`wrap ${s.pager}`} aria-label="More work">
          <Link href={`/work/${prev.slug}/`} className={s.pagerLink}>
            <span className="mono">← Previous track</span>
            <strong>{prev.title}</strong>
          </Link>
          <Link href={`/work/${next.slug}/`} className={`${s.pagerLink} ${s.pagerNext}`}>
            <span className="mono">Next track →</span>
            <strong>{next.title}</strong>
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}

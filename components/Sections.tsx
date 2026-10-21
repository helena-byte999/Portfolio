import {
  ABOUT,
  CERTIFICATIONS,
  CONTACT,
  EDUCATION,
  EXPERIENCE,
  FOOTER,
  PADS,
  PERSON,
  RESEARCH,
  SET_LIST,
  SOCIALS,
  VOLUNTEERING,
  WRITING,
} from '@/content/site';
import CopyEmail from './fx/CopyEmail';
import { Squiggle } from './fx/Doodles';
import Magnetic from './fx/Magnetic';
import Rise from './fx/Rise';
import RollingNumber from './fx/RollingNumber';
import s from './Sections.module.css';

export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="wrap">
        <div data-reveal>
          <p className="eyebrow">Experience</p>
          <h2 id="experience-title" className="display section-title">
            <Rise text="Previously on" />
          </h2>
          <p className="lede">Product roles first, backed by the design and engineering work that taught me how products actually get built.</p>
        </div>

        <ol className={s.timeline}>
          {EXPERIENCE.map((job) => (
            <li key={job.role + job.org} className={s.job} data-reveal>
              <p className={`mono ${s.dates}`}>{job.dates}</p>
              <div>
                <h3 className={s.jobRole}>{job.role}</h3>
                <p className={s.jobOrg}>
                  {job.org} · {job.place}
                </p>
                <p className={s.jobText}>{job.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={s.extras}>
          <article className={s.panel} data-reveal>
            <p className="eyebrow">Research</p>
            <h3 className={s.panelTitle}>{RESEARCH.title}</h3>
            <p className={s.panelMeta}>{RESEARCH.org}</p>
            <p>{RESEARCH.text}</p>
          </article>
          <div className={s.stack}>
            <article className={s.panel} data-reveal>
              <p className="eyebrow">Education</p>
              {EDUCATION.map((e) => (
                <div key={e.title} className={s.line}>
                  <strong>{e.title}</strong>
                  <span>
                    {e.org} · {e.dates}
                  </span>
                  <p>{e.note}</p>
                </div>
              ))}
            </article>
            <article className={s.panel} data-reveal>
              <p className="eyebrow">Volunteering</p>
              <div className={s.line}>
                <strong>{VOLUNTEERING.role}</strong>
                <span>
                  {VOLUNTEERING.org} · {VOLUNTEERING.dates}
                </span>
                <p>{VOLUNTEERING.text}</p>
              </div>
            </article>
            <article className={s.panel} data-reveal>
              <p className="eyebrow">Certifications</p>
              {CERTIFICATIONS.map((c) =>
                c.href ? (
                  <a key={c.title} className={s.line} href={c.href} target="_blank" rel="noopener">
                    <strong>{c.title} ↗</strong>
                    <span>{c.org}</span>
                  </a>
                ) : (
                  <div key={c.title} className={s.line}>
                    <strong>{c.title}</strong>
                    <span>{c.org}</span>
                  </div>
                ),
              )}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SetList() {
  return (
    <section className="section" id="setlist" aria-labelledby="setlist-title">
      <div className="wrap">
        <div data-reveal>
          <p className="eyebrow">How I work</p>
          <h2 id="setlist-title" className="display section-title">
            <Rise text={SET_LIST.title} />
          </h2>
          <Squiggle color="var(--accent)" />
          <p className="lede">{SET_LIST.tagline}</p>
        </div>
        <ol className={s.steps}>
          {SET_LIST.steps.map((step, i) => (
            <li key={step.name} className={s.step} data-reveal style={{ ['--note' as string]: PADS[i % PADS.length].color, ['--tilt' as string]: `${i % 2 ? 1.4 : -1.2}deg` }}>
              <span className={s.stepNo}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={s.stepName}>{step.name}</h3>
              <span className={`mono ${s.stepMeans}`}>{step.means}</span>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className={`wrap ${s.about}`}>
        <div data-reveal>
          <p className="eyebrow">About</p>
          <h2 id="about-title" className={`display ${s.aboutTitle}`}>
            <Rise text={ABOUT.title} />
          </h2>
          {ABOUT.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className={s.aboutText}>
              {p}
            </p>
          ))}
          <blockquote className={s.quote}>“{ABOUT.quote}”</blockquote>
        </div>
        <div className={s.aboutSide} data-reveal>
          <dl className={s.stats}>
            {ABOUT.stats.map((st) => (
              <div key={st.label}>
                <dt className="display">
                  <RollingNumber value={st.value} />
                </dt>
                <dd>{st.label}</dd>
              </div>
            ))}
          </dl>
          {ABOUT.skills.map((g) => (
            <div key={g.group} className={s.skillGroup}>
              <h3 className="mono">{g.group}</h3>
              <ul className="chips">
                {g.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Writing() {
  return (
    <section className="section" id="writing" aria-labelledby="writing-title">
      <div className="wrap">
        <div data-reveal>
          <p className="eyebrow">Writing</p>
          <h2 id="writing-title" className="display section-title">
            <Rise text={WRITING.title} />
          </h2>
          <p className="lede">{WRITING.text}</p>
        </div>
        <div className={s.articles}>
          {WRITING.articles.map((a) => (
            <a key={a.href} className={s.article} href={a.href} target="_blank" rel="noopener" data-reveal>
              <span className="mono">Medium</span>
              <strong>{a.title}</strong>
              <span>{a.text}</span>
              <span className={s.read}>Read ↗</span>
            </a>
          ))}
        </div>
        <a className={s.moreLink} href={WRITING.more.href} target="_blank" rel="noopener">
          {WRITING.more.label} ↗
        </a>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className={`section ${s.contact}`} id="contact" aria-labelledby="contact-title">
      <div className="wrap" data-reveal>
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title" className={`display ${s.contactTitle}`}>
          <Rise text={CONTACT.title} />
        </h2>
        <div className={s.contactSquiggle}>
          <Squiggle />
        </div>
        <p className="lede">{CONTACT.text}</p>
        <a className={s.email} href={`mailto:${PERSON.email}`}>
          {PERSON.email}
        </a>
        <div className={s.contactLinks}>
          <CopyEmail email={PERSON.email} />
          {SOCIALS.map((so) => (
            <Magnetic key={so.label}>
              <a className="btn" href={so.href} target="_blank" rel="noopener">
                {so.label} ↗
              </a>
            </Magnetic>
          ))}
          <Magnetic>
            <a className="btn btn-primary" href={PERSON.cv} target="_blank" rel="noopener">
              Download CV
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.footerInner}`}>
        <p>{FOOTER}</p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

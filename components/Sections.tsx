import {
  ABOUT,
  CONTACT,
  CREDENTIAL_KINDS,
  CREDENTIALS,
  EXPERIENCE,
  FOOTER,
  PADS,
  PERSON,
  SET_LIST,
  SOCIALS,
  WRITING,
} from '@/content/site';
import posts from '@/content/writing.json';
import { CredentialCard, LogoTile, PostCard, SkillCard } from './Cards';
import Carousel from './Carousel';
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
              <div className={s.jobBody}>
                <LogoTile id={job.logo} size={48} />
                <div>
                  <h3 className={s.jobRole}>{job.role}</h3>
                  <p className={s.jobOrg}>
                    {job.org} · {job.place}
                  </p>
                  <ul className={s.jobPoints}>
                    {job.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="wrap" data-reveal>
        <h3 className={s.subhead}>Education, research &amp; credentials</h3>
      </div>
      <Carousel
        label="Education, research and credentials"
        filters={CREDENTIAL_KINDS}
        items={CREDENTIALS.map((c) => ({ key: c.title, group: c.kind, node: <CredentialCard c={c} /> }))}
      />
    </section>
  );
}

// The pad colours, with the black pad swapped for white so it shows on the dark page.
const STEP_COLOURS = PADS.map((p) => (p.color === '#2B2B2E' ? '#f4f4f5' : p.color));

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
            <li key={step.name} className={s.step} data-reveal style={{ ['--note' as string]: STEP_COLOURS[i % STEP_COLOURS.length], ['--tilt' as string]: `${i % 2 ? 1.4 : -1.2}deg` }}>
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

// One colour per skills card, from the pad keycaps.
const SKILL_COLOURS = ['#F2C94C', '#6b8cff', '#ff7a7e', '#7ee08a'];

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
        </div>
        <div className={s.aboutSide} data-reveal>
          <blockquote className={s.quote}>“{ABOUT.quote}”</blockquote>
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
        </div>
      </div>

      <div className="wrap" data-reveal>
        <h3 className={s.subhead}>What I bring to the booth</h3>
        <div className={s.skillGrid}>
          {ABOUT.skills.map((g, i) => (
            <SkillCard key={g.group} group={g.group} items={g.items} color={SKILL_COLOURS[i % SKILL_COLOURS.length]} />
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
      </div>
      <Carousel
        label="Medium posts"
        width="min(420px, 86vw)"
        items={posts.map((p) => ({ key: p.href, node: <PostCard p={p} /> }))}
      />
      <div className="wrap">
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

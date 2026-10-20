import { HERO, PERSON } from '@/content/site';
import Booth from './booth/Booth';
import RotatingRole from './RotatingRole';
import s from './Hero.module.css';

export default function Hero() {
  const [first, last] = PERSON.name.split(' ');
  return (
    <section className={s.hero} id="top">
      <div className="wrap">
        <p className="eyebrow">{HERO.eyebrow}</p>
        <h1 className={`display ${s.name}`}>
          <span>{first}</span> <span>{last}</span>
        </h1>
        <div className={s.row}>
          <div>
            <p className={s.roleLine}>
              <RotatingRole roles={PERSON.roles} />
              <span className={s.where}>· {PERSON.location}</span>
            </p>
            <p className="lede">{HERO.line}</p>
          </div>
          <div className={s.side}>
            <ul className="chips" aria-label="Highlights">
              {HERO.proof.map((p) => (
                <li key={p} className="chip">
                  {p}
                </li>
              ))}
            </ul>
            <div className={s.ctas}>
              <a className="btn btn-primary" href="#work">
                See the work ↓
              </a>
              <a className="btn" href={PERSON.cv} target="_blank" rel="noopener">
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
      <Booth />
    </section>
  );
}

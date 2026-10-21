import { HERO, PERSON } from '@/content/site';
import Booth from './booth/Booth';
import Rise from './fx/Rise';
import s from './Hero.module.css';

export default function Hero() {
  return (
    <section className={s.hero} id="top">
      <div className={`wrap ${s.text}`} data-reveal>
        <h1 className={`display ${s.title}`}>
          <span className={s.greet}>{HERO.greeting}</span>{' '}
          <span className={`expanded ${s.marker}`}>
            <Rise text={PERSON.name} />
          </span>
        </h1>
        <p className={s.lead}>
          {HERO.lead}
          <span className={s.accent}>{HERO.accent}</span>
          <span className={s.caret} aria-hidden="true" />
        </p>
        <p className={s.intro}>{HERO.intro}</p>
      </div>
      <Booth />
    </section>
  );
}

import Link from 'next/link';
import { PERSON } from '@/content/site';
import HeaderCenter from './HeaderCenter';
import ThemeToggle from './ThemeToggle';
import s from './Header.module.css';

// One header for the whole site, in the root layout.
export default function Header() {
  return (
    <header className={s.header}>
      <div className={`wrap ${s.inner}`}>
        <Link href="/" className={`expanded ${s.logo}`} aria-label="Ena Otuokon, home">
          {PERSON.name}
        </Link>
        <HeaderCenter />
        <nav className={s.nav} aria-label="Main">
          <Link href="/#work">Work</Link>
          <Link href="/#experience">Experience</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
          <a href={PERSON.cv} target="_blank" rel="noopener" className={s.cv}>
            Resume ↗
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

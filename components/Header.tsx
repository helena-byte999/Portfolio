import Link from 'next/link';
import { PERSON } from '@/content/site';
import ThemeToggle from './ThemeToggle';
import s from './Header.module.css';

export default function Header() {
  return (
    <header className={s.header}>
      <div className={`wrap ${s.inner}`}>
        <Link href="/" className={s.logo} aria-label="Ena Otuokon, home">
          ENA<span>·</span>O
        </Link>
        <nav className={s.nav} aria-label="Main">
          <Link href="/#work">Work</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <div className={s.actions}>
          <a className={`btn ${s.cv}`} href={PERSON.cv} target="_blank" rel="noopener">
            My CV
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

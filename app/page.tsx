import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WorkDeck from '@/components/WorkDeck';
import { About, Contact, Experience, Footer, SetList, Writing } from '@/components/Sections';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WorkDeck />
        <Experience />
        <SetList />
        <About />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

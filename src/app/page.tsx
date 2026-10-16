import { About } from '@/components/About/About';
import { Beyond } from '@/components/Beyond/Beyond';
import { Contact } from '@/components/Contact/Contact';
import { Experience } from '@/components/Experience/Experience';
import { Header } from '@/components/Header/Header';
import { Hero } from '@/components/Hero/Hero';
import { Principles } from '@/components/Principles/Principles';
import { SiteShell } from '@/components/SiteShell/SiteShell';
import { Stack } from '@/components/Stack/Stack';
import { Work } from '@/components/Work/Work';

export default function Home() {
  return (
    <SiteShell>
      <Header />
      <main>
        <Hero />
        <Work />
        <About />
        <Experience />
        <Principles />
        <Stack />
        <Beyond />
        <Contact />
      </main>
    </SiteShell>
  );
}

import { getHomepage } from '@/lib/homepage';
import HeroSection from '@/components/HeroSection';
import QuickLinks from '@/components/QuickLinks';

export default async function Home() {
  const { hero, quickLinks } = await getHomepage();

  return (
    <main>
      <HeroSection hero={hero} />
      <QuickLinks links={quickLinks} />
    </main>
  );
}
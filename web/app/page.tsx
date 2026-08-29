import { getHomepage } from '@/lib/homepage';
import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import QuickLinks from '@/components/QuickLinks';
import ServicesCarousel from '@/components/ServicesCarousel';

export default async function Home() {
  const { hero, aboutUsText, quickLinks, services } = await getHomepage();

  return (
    <main>
      <HeroSection hero={hero} />
      <AboutUs text={aboutUsText} />
      <QuickLinks links={quickLinks} />
      <ServicesCarousel services={services} />
    </main>
  );
}
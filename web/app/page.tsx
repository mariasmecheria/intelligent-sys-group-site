import { getHomepage } from '@/lib/homepage';

import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import QuickLinks from '@/components/QuickLinks';
import ServicesCarousel from '@/components/ServicesCarousel';
import SelectedPublications from '@/components/SelectedPublications';


export default async function Home() {
  
  const [{ hero, aboutUsText, quickLinks, services, selectedPublications }] = await Promise.all([
    getHomepage(),
  ]);

  return (
    <main>
      <HeroSection hero={hero} />
      <AboutUs text={aboutUsText} />
      <QuickLinks links={quickLinks} />
      <SelectedPublications publications={selectedPublications} />
      <ServicesCarousel services={services} />
    </main>
  );
}
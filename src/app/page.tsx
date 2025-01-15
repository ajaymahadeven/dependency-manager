import HomeCardsComponent from '@/components/home/cards-component/Component';
import Footer from '@/components/home/footer/Component';
import HeroSection from '@/components/home/hero-section/Component';
import SearchEngineComponent from '@/components/home/search-engine/Component';
import SiteNavbar from '@/components/navbar/Component';

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />

      <div className="container mx-auto px-4 pb-16 pt-24">
        <HeroSection />
        <SearchEngineComponent />
        <HomeCardsComponent />
      </div>
      <Footer />
    </div>
  );
}

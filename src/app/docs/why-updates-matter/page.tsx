import Footer from '@/components/home/footer/Component';
import SiteNavbar from '@/components/navbar/Component';
import WhyUpdatesMatterComponent from '@/components/why-updates-matter/Component';

export default function Page() {
  return (
    <div className="bg-background min-h-screen">
      <SiteNavbar />
      <div className="flex min-h-full items-center justify-center">
        <WhyUpdatesMatterComponent />
      </div>
      <Footer />
    </div>
  );
}

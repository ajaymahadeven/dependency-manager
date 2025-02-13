import Footer from '@/components/home/footer/Component';
import SiteNavbar from '@/components/navbar/Component';
import PackageStatusInfoComponent from '@/components/package-status/Component';

export default function Page() {
  return (
    <div className="bg-background min-h-screen">
      <SiteNavbar />
      <PackageStatusInfoComponent />
      <Footer />
    </div>
  );
}

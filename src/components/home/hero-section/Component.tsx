import { Caveat } from 'next/font/google';

const CaveatFont = Caveat({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

export default function HeroSection() {
  return (
    <>
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-5xl font-bold md:text-6xl">
          Dependencies, Simplified.
        </h1>
        <div className={`${CaveatFont.className} mt-6 h-10`}></div>
      </div>
    </>
  );
}

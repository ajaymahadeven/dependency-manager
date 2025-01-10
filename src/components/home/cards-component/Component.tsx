import { DiNpm } from 'react-icons/di';
import { SiComposer, SiPython } from 'react-icons/si';
import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomeCardsComponent() {
  return (
    <>
      {/* Package Manager Cards */}
      <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-3">
        {/* Using h-full to maintain consistent height */}
        <Link href="/scan/npm" className="group h-full">
          <Card className="h-full border-zinc-200 transition-all duration-300 hover:bg-accent dark:border-zinc-800">
            <CardHeader className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent transition-transform duration-300 group-hover:scale-110">
                <DiNpm className="h-6 w-6 text-red-600 lg:h-9 lg:w-9" />
              </div>
              <CardTitle className="text-xl">NPM Packages</CardTitle>
              <CardDescription>
                Scan your package.json and get instant update recommendations
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/scan/pypi" className="group h-full">
          <Card className="h-full border-zinc-200 transition-all duration-300 hover:bg-accent dark:border-zinc-800">
            <CardHeader className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent transition-transform duration-300 group-hover:scale-110">
                <SiPython className="h-6 w-6 rounded text-yellow-400 lg:h-9 lg:w-9" />
              </div>
              <CardTitle className="text-xl">Python Packages</CardTitle>
              <CardDescription>
                Upload requirements.txt and get your dependencies in order
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/scan/composer" className="group h-full">
          <Card className="h-full border-zinc-200 transition-all duration-300 hover:bg-accent dark:border-zinc-800">
            <CardHeader className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent transition-transform duration-300 group-hover:scale-110">
                <SiComposer className="h-6 w-6 text-amber-950 lg:h-9 lg:w-9" />
              </div>
              <CardTitle className="text-xl">Composer</CardTitle>
              <CardDescription>
                Manage your PHP dependencies with ease !
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </>
  );
}

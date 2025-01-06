import Link from 'next/link';
import { FileCode, FileJson, Package } from 'lucide-react';
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
                <FileJson className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">NPM Packages</CardTitle>
              <CardDescription>
                Scan your package.json and get instant update recommendations
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/scan/python" className="group h-full">
          <Card className="h-full border-zinc-200 transition-all duration-300 hover:bg-accent dark:border-zinc-800">
            <CardHeader className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent transition-transform duration-300 group-hover:scale-110">
                <Package className="h-6 w-6" />
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
                <FileCode className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Composer</CardTitle>
              <CardDescription>
                Manage your PHP dependencies with ease (Coming Soon)
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </>
  );
}

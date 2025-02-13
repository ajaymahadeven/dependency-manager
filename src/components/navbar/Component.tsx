'use client';

// import { ThemeToggle } from '@/components/theme-toggle';
import { BsInfoCircleFill } from 'react-icons/bs';
import { LuShieldAlert } from 'react-icons/lu';
import { SiGithub } from 'react-icons/si';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SiteNavbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="container flex h-16 min-w-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="mx-2 flex items-center gap-2">
            <PackageOpen className="h-6 w-6" />
            <span className="hidden text-xl font-semibold sm:inline-block">
              Dependency Manager
            </span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          {!isHomePage && (
            <Button type="button" variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
          )}
          {/* <ThemeToggle /> */}

          {/* Why Updates matter link */}
          <Button type="button" variant="outline" size="icon" asChild>
            <Link href="/docs/why-updates-matter" prefetch={true}>
              <LuShieldAlert className="h-5 w-5" />
              <span className="sr-only">Why Updates matters?</span>
            </Link>
          </Button>

          {/* Info Link */}
          <Button type="button" variant="outline" size="icon" asChild>
            <Link href="/docs/package-status" prefetch={true}>
              <BsInfoCircleFill className="h-5 w-5" />
              <span className="sr-only">Info</span>
            </Link>
          </Button>

          {/* GitHub Link */}
          <Button type="button" variant={'outline'} size="icon" asChild>
            <Link
              href="https://t.ly/1-rek"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiGithub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

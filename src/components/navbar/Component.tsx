import Link from 'next/link';
import { Github } from 'lucide-react';
// import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from '@/components/ui/button';

export default function SiteNavbar() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Placeholder for logo */}
            <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              {/* Logo will be added here */}
            </div>
            <span className="text-lg font-semibold">DependencyTracker</span>
          </div>
          <div className="flex items-center gap-4">
            {/* <ThemeToggle /> */}
            <Button type="button" variant="ghost" size="icon" asChild>
              <Link
                href="https://github.com/yourusername/dependency-tracker"
                target="_blank"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

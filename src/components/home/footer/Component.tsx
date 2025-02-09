import Link from 'next/link';

export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="mt-24 flex w-full items-center justify-center border-t border-zinc-200 py-12 dark:border-zinc-800">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-xl font-medium">
              From Developers to Developers, with ❤️
            </p>
            <p className="text-muted-foreground text-sm">
              Crafted with precision for the developer community
            </p>
            <div className="flex flex-col items-center space-y-2">
              <p className="text-muted-foreground text-sm">
                Have interesting projects 🚀 or up for feedback 🔈?
              </p>
              <Link
                href="https://t.ly/lvx9X"
                className="hover:text-primary text-sm underline underline-offset-4 transition-colors"
              >
                Let&apos;s chat →
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

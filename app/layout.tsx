import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OSINT Workbench',
  description: 'Browse, search, and favorite OSINT tools from the OSINT Framework',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              OSINT Workbench
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
              <Link className="hover:text-primary" href="/">
                Tools
              </Link>
              <Link className="hover:text-primary" href="/cases">
                Cases
              </Link>
            </nav>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4">{children}</div>
      </body>
    </html>
  );
}

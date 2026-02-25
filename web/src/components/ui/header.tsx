'use client';

import Link from 'next/link';

interface HeaderProps {
  links?: { href: string; label: string }[];
}

export function Header({ links = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--primary)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/ascesaLogo.jpg"
            alt="ASCESA"
            className="h-10 w-32 object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white transition-colors hover:text-[var(--accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-medium text-white hover:text-[var(--accent)]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--gray-100)]"
          >
            Associe-se
          </Link>
        </div>
      </div>
    </header>
  );
}

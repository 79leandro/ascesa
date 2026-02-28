'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuthContext';
import { perf } from '@/lib/performance';

interface HeaderProps {
  links?: { href: string; label: string }[];
}

export function Header({ links = [] }: HeaderProps) {
  perf.start('Header render');
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  perf.end('Header render');

  if (isLoading) {
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
          <div className="flex items-center space-x-4">
            <div className="h-6 w-16 bg-white/20 rounded animate-pulse"></div>
            <div className="h-8 w-24 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

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
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center space-x-2 text-white">
                <span className="text-sm hidden sm:inline">
                  Olá, {user.name.split(' ')[0]}
                </span>
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="text-sm font-medium text-white hover:text-[var(--accent)] underline"
                >
                  Área do Associado
                </Link>
              </div>
              <button
                onClick={logout}
                className="text-sm font-medium text-white hover:text-[var(--accent)]"
              >
                Sair
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}

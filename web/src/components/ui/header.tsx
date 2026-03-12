'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuthContext';
import { perf } from '@/lib/performance';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  links?: { href: string; label: string }[];
}

export function Header({ links = [] }: HeaderProps) {
  perf.start('Header render');
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  perf.end('Header render');

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full bg-[var(--primary)] shadow-lg">
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
    <header className="sticky top-0 z-50 w-full bg-[var(--primary)] shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/ascesaLogo.jpg"
            alt="ASCESA"
            className="h-10 w-32 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/90 transition-all duration-300 hover:text-[var(--accent)] hover:scale-105 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center space-x-3 text-white">
                <span className="text-sm font-medium">
                  Olá, <span className="text-[var(--accent)]">{user.name.split(' ')[0]}</span>
                </span>
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="px-4 py-2 text-sm font-medium text-[var(--primary)] bg-white rounded-lg hover:bg-[var(--gray-100)] transition-all duration-200 hover:shadow-md"
                >
                  Área do Associado
                </Link>
              </div>
              <button
                onClick={logout}
                className="text-sm font-medium text-white/80 hover:text-white transition-all duration-200 hover:underline underline-offset-4"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-white/90 hover:text-white transition-all duration-200 hover:underline underline-offset-4"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[var(--primary)] transition-all duration-300 hover:bg-[var(--gray-100)] hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Associe-se
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--primary-dark)] border-t border-white/10 animate-fade-in-up">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-white/90 hover:text-white py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-3">
              {isAuthenticated && user ? (
                <>
                  <p className="text-white/70 text-sm">Olá, {user.name.split(' ')[0]}</p>
                  <Link
                    href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                    className="block w-full text-center py-2.5 bg-white text-[var(--primary)] rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Área do Associado
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-center py-2 text-white/80 hover:text-white"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-center py-2 text-white/90 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center py-2.5 bg-white text-[var(--primary)] rounded-lg font-medium hover:bg-[var(--gray-100)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Associe-se
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

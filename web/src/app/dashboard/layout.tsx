'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuthContext';
import { DashboardNav, DashboardLink } from '@/components/ui/navigation';
import { perf } from '@/lib/performance';

// Links disponíveis para ASSOCIADO - área restrita
const ASSOCIATE_LINKS: DashboardLink[] = [
  { href: '/dashboard', label: 'Início', icon: '🏠' },
  { href: '/dashboard/profile', label: 'Meu Perfil', icon: '👤' },
  { href: '/dashboard/benefits', label: 'Meus Benefícios', icon: '🎁' },
  { href: '/dashboard/documents', label: 'Documentos', icon: '📄' },
  { href: '/dashboard/payments', label: 'Pagamentos', icon: '💰' },
  { href: '/dashboard/card', label: 'Carteirinha', icon: '💳' },
  { href: '/dashboard/events', label: 'Eventos', icon: '🎉' },
  { href: '/dashboard/forum', label: 'Fórum', icon: '💬' },
  { href: '/dashboard/showcase', label: 'Vitrine Virtual', icon: '🛒' },
  { href: '/dashboard/contact', label: 'Fale Conosco', icon: '📧' },
  { href: '/dashboard/lgpd', label: 'LGPD', icon: '🔒' },
];

// Links disponíveis para USUARIO (não associado)
const USER_LINKS: DashboardLink[] = [
  { href: '/dashboard', label: 'Início', icon: '🏠' },
  { href: '/dashboard/profile', label: 'Meu Perfil', icon: '👤' },
  { href: '/dashboard/benefits', label: 'Benefícios', icon: '🎁' },
  { href: '/dashboard/contact', label: 'Fale Conosco', icon: '📧' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  perf.start('DashboardLayout render');
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // If not logged in, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // If admin, redirect to admin panel
    if (user?.role === 'ADMIN') {
      router.push('/admin');
      return;
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Show loading while checking auth
  if (isLoading || !user) {
    perf.end('DashboardLayout render');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  perf.end('DashboardLayout render');

  // Define navigation links based on role
  const navLinks = user.role === 'ASSOCIADO' ? ASSOCIATE_LINKS : USER_LINKS;
  const title = user.role === 'ASSOCIADO' ? 'Área do Associado' : 'Área do Usuário';

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile by default */}
      <div className={`fixed lg:static z-50 transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <DashboardNav links={navLinks} title={title} />
      </div>

      {/* Mobile menu button */}
      <button
        className="fixed bottom-4 right-4 lg:hidden z-30 bg-[var(--primary)] text-white p-4 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <main className="flex-1 bg-[var(--gray-50)] min-h-screen">
        {children}
      </main>
    </div>
  );
}

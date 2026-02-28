'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuthContext';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { perf } from '@/lib/performance';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  perf.start('AdminLayout render');
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (isLoading) return;

    // If not logged in, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // If not admin, redirect to dashboard
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Show loading while checking auth
  if (isLoading || !user) {
    perf.end('AdminLayout render');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  perf.end('AdminLayout render');

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
        <AdminSidebar />
      </div>

      {/* Mobile menu button */}
      <button
        className="fixed bottom-4 right-4 lg:hidden z-30 bg-[var(--primary)] text-white p-4 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <main className="flex-1 bg-[var(--gray-50)] min-h-screen p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}

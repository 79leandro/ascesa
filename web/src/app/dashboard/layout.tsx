'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuthContext';
import { DashboardNav } from '@/components/ui/navigation';
import { perf } from '@/lib/performance';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  perf.start('DashboardLayout render');
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // If not logged in, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // If admin or director, redirect to admin panel
    if (user?.role === 'ADMIN' || user?.role === 'DIRECTOR') {
      router.push('/admin');
      return;
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [router.asPath]);

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
        <DashboardNav />
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

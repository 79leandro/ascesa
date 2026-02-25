'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'ADMIN' || userData.role === 'DIRECTOR') {
        setIsAuthenticated(true);
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--primary)] text-white p-6">
        <h2 className="text-xl font-bold mb-8">Painel Admin</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="block py-2 px-4 rounded hover:bg-white/10">
            📊 Dashboard
          </Link>
          <Link href="/admin/benefits" className="block py-2 px-4 rounded hover:bg-white/10">
            🎁 Convênios
          </Link>
          <Link href="/admin/blog" className="block py-2 px-4 rounded hover:bg-white/10">
            📰 Blog
          </Link>
          <Link href="/admin/associates" className="block py-2 px-4 rounded hover:bg-white/10">
            👥 Associados
          </Link>
          <Link href="/admin" className="block py-2 px-4 rounded hover:bg-white/10">
            ⚙️ Configurações
          </Link>
          <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-white/10 mt-8">
            ← Voltar ao Site
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[var(--gray-50)]">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Associados', value: '1.234', icon: '👥' },
            { label: 'Convênios Ativos', value: '52', icon: '🎁' },
            { label: 'Novos este Mês', value: '45', icon: '📈' },
            { label: 'Mensagens', value: '12', icon: '📧' },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-[var(--border)]">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</div>
              <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            {[
              { action: 'Novo associado aprovado', time: 'Há 2 minutos' },
              { action: 'Convênio atualizado: Drogaria Popular', time: 'Há 1 hora' },
              { action: 'Nova mensagem de contato', time: 'Há 3 horas' },
              { action: 'Post publicado no blog', time: 'Há 1 dia' },
            ].map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-[var(--foreground)]">{activity.action}</span>
                <span className="text-sm text-[var(--muted-foreground)]">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

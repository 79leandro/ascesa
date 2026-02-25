'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SIDEBAR_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/benefits', label: 'Convênios', icon: '🎁' },
  { href: '/admin/blog', label: 'Blog', icon: '📰' },
  { href: '/admin/associates', label: 'Associados', icon: '👥' },
  { href: '/admin/documents', label: 'Documentos', icon: '📄' },
  { href: '/admin/payments', label: 'Pagamentos', icon: '💳' },
  { href: '/admin/assemblies', label: 'Assembleias', icon: '🏛️' },
  { href: '/admin/reports', label: 'Relatórios', icon: '📈' },
  { href: '/admin/partners', label: 'Parceiros', icon: '🤝' },
  { href: '/admin/events', label: 'Eventos', icon: '📅' },
  { href: '/admin/forum', label: 'Fórum', icon: '💬' },
  { href: '/admin/showcase', label: 'Vitrine', icon: '🛒' },
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️' },
  { href: '/dashboard', label: 'Voltar ao Site', icon: '←' },
];

interface Topic {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
}

export default function AdminForumPage() {
  const router = useRouter();
  const [topics] = useState<Topic[]>([
    {
      id: '1',
      title: 'Dúvidas sobre benefícios',
      author: 'João Silva',
      category: 'Benefícios',
      replies: 12,
      views: 234,
      isPinned: true,
      isLocked: false,
      createdAt: '2026-02-20',
    },
    {
      id: '2',
      title: 'Reunião de associado - Fevereiro',
      author: 'Maria Santos',
      category: 'Eventos',
      replies: 8,
      views: 156,
      isPinned: false,
      isLocked: false,
      createdAt: '2026-02-22',
    },
    {
      id: '3',
      title: 'Dicas de economia',
      author: 'Pedro Oliveira',
      category: 'Finanças',
      replies: 25,
      views: 456,
      isPinned: false,
      isLocked: false,
      createdAt: '2026-02-15',
    },
    {
      id: '4',
      title: 'Novo convênio de saúde',
      author: 'Ana Costa',
      category: 'Benefícios',
      replies: 0,
      views: 89,
      isPinned: false,
      isLocked: true,
      createdAt: '2026-02-23',
    },
  ]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role !== 'ADMIN' && userData.role !== 'DIRECTOR') {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
  };

  const totalReplies = topics.reduce((acc, t) => acc + t.replies, 0);
  const totalViews = topics.reduce((acc, t) => acc + t.views, 0);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[var(--primary)] text-white p-6">
        <h2 className="text-xl font-bold mb-8">Painel Admin</h2>
        <nav className="space-y-2">
          {SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 px-4 rounded hover:bg-white/10 ${
                link.href === '/admin/forum' ? 'bg-white/20' : ''
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-[var(--gray-50)]">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Gerenciar Fórum</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-[var(--primary)]">{topics.length}</p>
              <p className="text-[var(--muted-foreground)]">Tópicos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{totalReplies}</p>
              <p className="text-[var(--muted-foreground)]">Respostas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">{totalViews}</p>
              <p className="text-[var(--muted-foreground)]">Visualizações</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {topics.filter(t => t.isLocked).length}
              </p>
              <p className="text-[var(--muted-foreground)]">Bloqueados</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tópicos do Fórum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Título</th>
                    <th className="text-left py-3 px-4">Autor</th>
                    <th className="text-left py-3 px-4">Categoria</th>
                    <th className="text-left py-3 px-4">Respostas</th>
                    <th className="text-left py-3 px-4">Views</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map((topic) => (
                    <tr key={topic.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {topic.isPinned && <span>📌</span>}
                          {topic.isLocked && <span>🔒</span>}
                          <span className="font-medium">{topic.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{topic.author}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{topic.category}</span>
                      </td>
                      <td className="py-3 px-4">{topic.replies}</td>
                      <td className="py-3 px-4">{topic.views}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          topic.isLocked ? 'bg-red-100 text-red-800' :
                          topic.isPinned ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {topic.isLocked ? 'Bloqueado' : topic.isPinned ? 'Fixado' : 'Ativo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="outline" size="sm">
                            {topic.isLocked ? 'Desbloquear' : 'Bloquear'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

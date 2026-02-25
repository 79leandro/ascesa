'use client';

import { useState } from 'react';
import Link from 'next/link';

const initialPosts = [
  { id: 1, title: 'Novos Convênios em 2026', category: 'Notícias', status: 'Publicado', date: '20/02/2026' },
  { id: 2, title: 'Assembleia Geral 2026', category: 'Eventos', status: 'Publicado', date: '15/02/2026' },
  { id: 3, title: 'Dicas de Saúde e Bem-estar', category: 'Dicas', status: 'Rascunho', date: '10/02/2026' },
  { id: 4, title: 'Parceria com Escolas', category: 'Educação', status: 'Publicado', date: '05/02/2026' },
];

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
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️' },
  { href: '/dashboard', label: 'Voltar ao Site', icon: '←' },
];

export default function AdminBlogPage() {
  const [posts] = useState(initialPosts);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--primary)] text-white p-6">
        <h2 className="text-xl font-bold mb-8">Painel Admin</h2>
        <nav className="space-y-2">
          {SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 px-4 rounded hover:bg-white/10 ${
                link.href === '/admin/blog' ? 'bg-white/20' : ''
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[var(--gray-50)]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Gerenciar Blog</h1>
          <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-light)]">
            + Novo Post
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar posts..."
            className="px-4 py-2 border border-[var(--border)] rounded-lg flex-1"
          />
          <select className="px-4 py-2 border border-[var(--border)] rounded-lg">
            <option>Todas as categorias</option>
            <option>Notícias</option>
            <option>Eventos</option>
            <option>Dicas</option>
            <option>Educação</option>
          </select>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--gray-50)]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-[var(--foreground)]">Título</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[var(--foreground)]">Categoria</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[var(--foreground)]">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[var(--foreground)]">Data</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[var(--foreground)]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-[var(--border)]">
                  <td className="px-6 py-4 text-[var(--foreground)]">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[var(--gray-100)] rounded text-sm">{post.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${post.status === 'Publicado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-foreground)]">{post.date}</td>
                  <td className="px-6 py-4">
                    <button className="text-[var(--secondary)] hover:underline mr-3">Editar</button>
                    <button className="text-[var(--error)] hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

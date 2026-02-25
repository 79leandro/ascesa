'use client';

import Link from 'next/link';

const posts = [
  {
    id: 1,
    slug: 'novos-convênios-2026',
    title: 'Novos Convênios em 2026',
    excerpt: 'A ASCESA traz novas parcerias para beneficiá-lo. Veja quais empresas entraram para nossa rede de convênios.',
    category: 'Notícias',
    date: '20/02/2026',
    image: '/blog-1.jpg',
  },
  {
    id: 2,
    slug: 'assembleia-2026',
    title: 'Assembleia Geral 2026',
    excerpt: 'Convocamos todos os associados para a Assembleia Geral Ordinária que acontecerá em março.',
    category: 'Eventos',
    date: '15/02/2026',
    image: '/blog-2.jpg',
  },
  {
    id: 3,
    slug: 'dicas-saude-bem-estar',
    title: 'Dicas de Saúde e Bem-estar',
    excerpt: 'Separamos algumas dicas para você manter a saúde em dia, especialmente importante para quem trabalha no dia a dia.',
    category: 'Dicas',
    date: '10/02/2026',
    image: '/blog-3.jpg',
  },
  {
    id: 4,
    slug: 'parceria-escolas',
    title: 'Parceria com Escolas Parceiras',
    excerpt: 'Novas escolas e cursos加入了 nossa rede de convênios educacionais.',
    category: 'Educação',
    date: '05/02/2026',
    image: '/blog-4.jpg',
  },
];

const categories = ['Todos', 'Notícias', 'Eventos', 'Dicas', 'Educação'];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-[var(--foreground)] mb-4">
        Blog ASCESA
      </h1>
      <p className="text-center text-[var(--muted-foreground)] mb-12 max-w-2xl mx-auto">
        Fique por dentro das últimas notícias e novidades da ASCESA
      </p>

      {/* Categorias */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              cat === 'Todos'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--gray-100)] text-[var(--foreground)] hover:bg-[var(--gray-200)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id}>
            <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="h-48 bg-[var(--primary)] bg-opacity-10 flex items-center justify-center">
                <span className="text-4xl">📰</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[var(--secondary)]">
                    {post.category}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {post.date}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
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

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  seller: string;
  condition: string;
  views: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export default function AdminShowcasePage() {
  const router = useRouter();
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'iPhone 14 Pro Max',
      price: 4500,
      category: 'Eletrônicos',
      seller: 'João Silva',
      condition: 'Usado',
      views: 234,
      status: 'ACTIVE',
      createdAt: '2026-02-20',
    },
    {
      id: '2',
      name: 'Sofá 3 Lugares',
      price: 800,
      category: 'Móveis',
      seller: 'Maria Santos',
      condition: 'Usado',
      views: 156,
      status: 'ACTIVE',
      createdAt: '2026-02-18',
    },
    {
      id: '3',
      name: 'Smart TV 50 Polegadas',
      price: 1800,
      category: 'Eletrônicos',
      seller: 'Carlos Lima',
      condition: 'Usado',
      views: 312,
      status: 'INACTIVE',
      createdAt: '2026-02-10',
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

  const totalValue = products.reduce((acc, p) => acc + p.price, 0);
  const activeProducts = products.filter(p => p.status === 'ACTIVE').length;

  return (
    <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Gerenciar Vitrine Virtual</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-[var(--primary)]">{products.length}</p>
              <p className="text-[var(--muted-foreground)]">Total de Anúncios</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">{activeProducts}</p>
              <p className="text-[var(--muted-foreground)]">Anúncios Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-600">
                R$ {totalValue.toLocaleString('pt-BR')}
              </p>
              <p className="text-[var(--muted-foreground)]">Valor Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {products.reduce((acc, p) => acc + p.views, 0)}
              </p>
              <p className="text-[var(--muted-foreground)]">Total de Views</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Produto</th>
                    <th className="text-left py-3 px-4">Categoria</th>
                    <th className="text-left py-3 px-4">Vendedor</th>
                    <th className="text-left py-3 px-4">Preço</th>
                    <th className="text-left py-3 px-4">Views</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{product.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{product.category}</span>
                      </td>
                      <td className="py-3 px-4">{product.seller}</td>
                      <td className="py-3 px-4 font-medium">
                        R$ {product.price.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">{product.views}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Ver</Button>
                          <Button variant="outline" size="sm">
                            {product.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
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
    </div>
  );
}

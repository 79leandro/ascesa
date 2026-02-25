'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_ROUTES } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  seller: string;
  sellerContact: string;
  condition: 'Novo' | 'Usado' | 'Reformado';
  views: number;
  createdAt: string;
  isActive: boolean;
}

export default function ShowcasePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'iPhone 14 Pro Max',
      description: 'iPhone 14 Pro Max 256GB, excelente estado, com nota fiscal',
      price: 4500,
      originalPrice: 5999,
      category: 'Eletrônicos',
      images: [],
      seller: 'João Silva',
      sellerContact: 'joao@email.com',
      condition: 'Usado',
      views: 234,
      createdAt: '2026-02-20',
      isActive: true,
    },
    {
      id: '2',
      name: 'Sofá 3 Lugares',
      description: 'Sofá moderno, cor cinza, muito bem conservado',
      price: 800,
      originalPrice: 1200,
      category: 'Móveis',
      images: [],
      seller: 'Maria Santos',
      sellerContact: 'maria@email.com',
      condition: 'Usado',
      views: 156,
      createdAt: '2026-02-18',
      isActive: true,
    },
    {
      id: '3',
      name: 'Bicicleta Caloi 29',
      description: 'Bicicleta mountain bike, quase nova, pouco uso',
      price: 1200,
      originalPrice: 1800,
      category: 'Esportes',
      images: [],
      seller: 'Pedro Oliveira',
      sellerContact: 'pedro@email.com',
      condition: 'Usado',
      views: 89,
      createdAt: '2026-02-15',
      isActive: true,
    },
    {
      id: '4',
      name: 'Livro: O Investidor Inteligente',
      description: 'Livro经典 de investimentos, edição 2024',
      price: 45,
      originalPrice: 89,
      category: 'Livros',
      images: [],
      seller: 'Ana Costa',
      sellerContact: 'ana@email.com',
      condition: 'Novo',
      views: 67,
      createdAt: '2026-02-22',
      isActive: true,
    },
    {
      id: '5',
      name: 'Smart TV 50 Polegadas',
      description: 'Smart TV 4K, marca Samsung, funcionando perfeitamente',
      price: 1800,
      originalPrice: 2500,
      category: 'Eletrônicos',
      images: [],
      seller: 'Carlos Lima',
      sellerContact: 'carlos@email.com',
      condition: 'Usado',
      views: 312,
      createdAt: '2026-02-10',
      isActive: true,
    },
  ]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showNewAd, setShowNewAd] = useState(false);
  const [newAd, setNewAd] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: 'Novo',
    sellerContact: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

  const categories = ['Eletrônicos', 'Móveis', 'Esportes', 'Livros', 'Veículos', 'Roupas', 'Outros'];

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Eletrônicos: '📱',
      Móveis: '🛋️',
      Esportes: '🚴',
      Livros: '📚',
      Veículos: '🚗',
      Roupas: '👕',
      Outros: '📦',
    };
    return icons[category] || '📦';
  };

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'all' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch && p.isActive;
  });

  const handleCreateAd = () => {
    if (!newAd.name || !newAd.price || !newAd.category) return;

    const product: Product = {
      id: Date.now().toString(),
      name: newAd.name,
      description: newAd.description,
      price: parseFloat(newAd.price),
      category: newAd.category,
      images: [],
      seller: user?.name || 'Você',
      sellerContact: newAd.sellerContact,
      condition: newAd.condition as 'Novo' | 'Usado' | 'Reformado',
      views: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    setProducts([product, ...products]);
    setShowNewAd(false);
    setNewAd({ name: '', description: '', price: '', category: '', condition: 'Novo', sellerContact: '' });
  };

  const contactSeller = (product: Product) => {
    window.location.href = `mailto:${product.sellerContact}?subject=Interesse em: ${product.name}`;
  };

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Vitrine Virtual</h1>
          <p className="text-[var(--muted-foreground)]">Anuncie e encontre produtos de associados</p>
        </div>
        <button
          onClick={() => setShowNewAd(true)}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-light)]"
        >
          + Novo Anúncio
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-[var(--border)] rounded-lg"
        >
          <option value="all">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <div className="h-40 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-t-lg flex items-center justify-center">
              <span className="text-4xl">{getCategoryIcon(product.category)}</span>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <span className="text-xs text-[var(--muted-foreground)]">{product.category}</span>
                <span className={`text-xs px-2 py-1 rounded ${product.condition === 'Novo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {product.condition}
                </span>
              </div>
              <CardTitle className="text-lg mt-2 line-clamp-1">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
                {product.description}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-[var(--primary)]">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[var(--muted-foreground)] line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center text-xs text-[var(--muted-foreground)] mb-3">
                <span>Vendedor: {product.seller}</span>
                <span>{product.views} visualizações</span>
              </div>
              <button
                onClick={() => contactSeller(product)}
                className="w-full bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-[var(--primary-light)]"
              >
                Contatar Vendedor
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-[var(--muted-foreground)]">Nenhum produto encontrado.</p>
          </CardContent>
        </Card>
      )}

      {/* New Ad Modal */}
      {showNewAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Novo Anúncio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Produto</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  placeholder="Ex: iPhone 14"
                  value={newAd.name}
                  onChange={(e) => setNewAd({ ...newAd, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  rows={3}
                  placeholder="Descreva o produto..."
                  value={newAd.description}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="0,00"
                    value={newAd.price}
                    onChange={(e) => setNewAd({ ...newAd, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <select
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    value={newAd.category}
                    onChange={(e) => setNewAd({ ...newAd, category: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Condição</label>
                <select
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  value={newAd.condition}
                  onChange={(e) => setNewAd({ ...newAd, condition: e.target.value })}
                >
                  <option value="Novo">Novo</option>
                  <option value="Usado">Usado</option>
                  <option value="Reformado">Reformado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Seu Email para Contato</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  placeholder="seu@email.com"
                  value={newAd.sellerContact}
                  onChange={(e) => setNewAd({ ...newAd, sellerContact: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowNewAd(false)}
                  className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateAd}
                  className="flex-1 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-light)]"
                >
                  Publicar
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

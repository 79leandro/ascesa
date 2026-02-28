'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_ROUTES, api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  categoria: string;
  imagens: string[];
  vendedor: string;
  contatoVendedor: string;
  condicao: string;
  visualizacoes: number;
  criadoEm: string;
  ativo: boolean;
}

export default function ShowcasePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showNewAd, setShowNewAd] = useState(false);
  const [newAd, setNewAd] = useState({
    nome: '',
    descricao: '',
    preco: '',
    precoOriginal: '',
    categoria: '',
    condicao: 'USADO',
    contatoVendedor: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    } else if (isAuthenticated) {
      fetchProducts();
    }
  }, [isLoading, isAuthenticated, router]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/showcase');
      if (response.success) {
        setProducts(response.produtos);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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
    const matchesFilter = filter === 'all' || p.categoria === filter;
    const matchesSearch = p.nome.toLowerCase().includes(search.toLowerCase()) ||
      (p.descricao && p.descricao.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch && p.ativo;
  });

  const handleCreateAd = async () => {
    if (!newAd.nome || !newAd.preco || !newAd.categoria) return;

    try {
      const response = await api.post('/showcase', newAd);
      if (response.success) {
        setProducts([response.produto, ...products]);
        setShowNewAd(false);
        setNewAd({
          nome: '',
          descricao: '',
          preco: '',
          precoOriginal: '',
          categoria: '',
          condicao: 'USADO',
          contatoVendedor: '',
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await api.delete(`/showcase/${id}`);
      if (response.success) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const contactSeller = (product: Product) => {
    window.location.href = `mailto:${product.contatoVendedor}?subject=Interesse em: ${product.nome}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getConditionLabel = (condicao: string) => {
    const labels: Record<string, string> = {
      NOVO: 'Novo',
      USADO: 'Usado',
      REFORMADO: 'Reformado',
    };
    return labels[condicao] || condicao;
  };

  if (isLoading || loading || !user) {
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
              <span className="text-4xl">{getCategoryIcon(product.categoria)}</span>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <span className="text-xs text-[var(--muted-foreground)]">{product.categoria}</span>
                <span className={`text-xs px-2 py-1 rounded ${product.condicao === 'NOVO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {getConditionLabel(product.condicao)}
                </span>
              </div>
              <CardTitle className="text-lg mt-2 line-clamp-1">{product.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
                {product.descricao}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-[var(--primary)]">
                  R$ {product.preco.toFixed(2)}
                </span>
                {product.precoOriginal && (
                  <span className="text-sm text-[var(--muted-foreground)] line-through">
                    R$ {product.precoOriginal.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center text-xs text-[var(--muted-foreground)] mb-3">
                <span>Vendedor: {product.vendedor}</span>
                <span>{product.visualizacoes} visualizações</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => contactSeller(product)}
                  className="flex-1 bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-[var(--primary-light)]"
                >
                  Contatar
                </button>
                {product.vendedor === user.name && (
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    🗑️
                  </button>
                )}
              </div>
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
                  value={newAd.nome}
                  onChange={(e) => setNewAd({ ...newAd, nome: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  rows={3}
                  placeholder="Descreva o produto..."
                  value={newAd.descricao}
                  onChange={(e) => setNewAd({ ...newAd, descricao: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="0,00"
                    value={newAd.preco}
                    onChange={(e) => setNewAd({ ...newAd, preco: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preço Original (R$)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="0,00"
                    value={newAd.precoOriginal}
                    onChange={(e) => setNewAd({ ...newAd, precoOriginal: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <select
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    value={newAd.categoria}
                    onChange={(e) => setNewAd({ ...newAd, categoria: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Condição</label>
                  <select
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    value={newAd.condicao}
                    onChange={(e) => setNewAd({ ...newAd, condicao: e.target.value })}
                  >
                    <option value="NOVO">Novo</option>
                    <option value="USADO">Usado</option>
                    <option value="REFORMADO">Reformado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Seu Email para Contato</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  placeholder="seu@email.com"
                  value={newAd.contatoVendedor}
                  onChange={(e) => setNewAd({ ...newAd, contatoVendedor: e.target.value })}
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

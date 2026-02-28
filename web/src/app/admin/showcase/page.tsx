'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { useAdminAuth, useDebounce } from '@/hooks';
import { AdminLayout, FilterBar, FormModal } from '@/components/admin';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  categoria: string;
  vendedor: string;
  contatoVendedor: string;
  condicao: string;
  visualizacoes: number;
  ativo: boolean;
}

export default function AdminShowcasePage() {
  useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: 0,
    precoOriginal: 0,
    categoria: 'Outros',
    condicao: 'USADO',
    contatoVendedor: '',
    ativo: true,
  });

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.showcase.list, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProducts(data.produtos || data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingProduct
        ? API_ENDPOINTS.showcase.update(editingProduct.id)
        : API_ENDPOINTS.showcase.create;
      const res = await fetch(url, {
        method: editingProduct ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.message || 'Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.showcase.update(product.id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ativo: !product.ativo }),
      });
      const data = await res.json();
      if (data.success) fetchProducts();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.showcase.delete(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nome: product.nome,
      descricao: product.descricao || '',
      preco: product.preco || 0,
      precoOriginal: product.precoOriginal || 0,
      categoria: product.categoria,
      condicao: product.condicao,
      contatoVendedor: product.contatoVendedor || '',
      ativo: product.ativo,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      nome: '', descricao: '', preco: 0, precoOriginal: 0,
      categoria: 'Outros', condicao: 'USADO', contatoVendedor: '', ativo: true,
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nome.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.vendedor?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoria === categoryFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'ATIVO' && p.ativo) || (statusFilter === 'INATIVO' && !p.ativo);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filterOptions = [
    { value: 'all', label: 'Todas as categorias' },
    { value: 'Eletrônicos', label: 'Eletrônicos' },
    { value: 'Móveis', label: 'Móveis' },
    { value: 'Veículos', label: 'Veículos' },
    { value: 'Outros', label: 'Outros' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'INATIVO', label: 'Inativo' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  return (
    <AdminLayout
      title="Gerenciar Vitrine Virtual"
      actions={<Button onClick={() => { resetForm(); setShowModal(true); }}>+ Novo Anúncio</Button>}
    >
      <FilterBar
        searchPlaceholder="Buscar produtos..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { options: filterOptions, value: categoryFilter, onChange: setCategoryFilter },
          { options: statusOptions, value: statusFilter, onChange: setStatusFilter },
        ]}
      />

      {loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--gray-50)]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Produto</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Vendedor</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Categoria</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Preço</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Condição</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-[var(--border)]">
                  <td className="px-6 py-4">
                    <div className="font-medium">{product.nome}</div>
                    <div className="text-sm text-muted-foreground">{product.descricao?.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{product.vendedor || '-'}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{product.categoria}</span></td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(product.preco)}</td>
                  <td className="px-6 py-4">{product.condicao === 'NOVO' ? 'Novo' : 'Usado'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={product.ativo ? 'ATIVO' : 'INATIVO'} onClick={() => handleToggleStatus(product)} />
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEditModal(product)} className="text-secondary hover:underline mr-3">Editar</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredProducts.length === 0 && !loading && <div className="text-center py-12 text-muted-foreground">Nenhum produto encontrado.</div>}

      <FormModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel={editingProduct ? 'Atualizar' : 'Criar'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome *</label>
            <Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required placeholder="Nome do produto" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Descrição</label>
            <textarea value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="Descrição do produto" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Preço</label>
              <Input type="number" step="0.01" value={formData.preco} onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preço Original</label>
              <Input type="number" step="0.01" value={formData.precoOriginal} onChange={(e) => setFormData({ ...formData, precoOriginal: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Móveis">Móveis</option>
                <option value="Veículos">Veículos</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Condição</label>
              <select value={formData.condicao} onChange={(e) => setFormData({ ...formData, condicao: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="NOVO">Novo</option>
                <option value="USADO">Usado</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contato</label>
            <Input value={formData.contatoVendedor} onChange={(e) => setFormData({ ...formData, contatoVendedor: e.target.value })} placeholder="Telefone ou email de contato" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="ativo" checked={formData.ativo} onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })} />
            <label htmlFor="ativo" className="text-sm">Ativo</label>
          </div>
        </div>
      </FormModal>
    </AdminLayout>
  );
}

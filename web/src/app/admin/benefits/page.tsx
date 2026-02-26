'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

interface Benefit {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  nomeParceiro: string | null;
  logoParceiro: string | null;
  desconto: string | null;
  imagem: string | null;
  ativo: boolean;
  destacado: boolean;
  ordem: number;
}

const CATEGORIES = ['Saúde', 'Educação', 'Lazer', 'Serviços', 'Outros'];

export default function AdminBenefitsPage() {
  const router = useRouter();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'Saúde',
    nomeParceiro: '',
    desconto: '',
    ativo: true,
    destacado: false,
    ordem: 0,
  });

  useEffect(() => {
    checkAuth();
    fetchBenefits();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
  };

  const fetchBenefits = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.beneficios.list, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setBenefits(data.beneficios);
      }
    } catch (error) {
      console.error('Error fetching benefits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingBenefit
        ? API_ENDPOINTS.beneficios.update(editingBenefit.id)
        : API_ENDPOINTS.beneficios.create;

      const res = await fetch(url, {
        method: editingBenefit ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        fetchBenefits();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.message || 'Erro ao salvar benefício');
      }
    } catch (error) {
      console.error('Error saving benefit:', error);
      alert('Erro ao salvar benefício');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (benefit: Benefit) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.beneficios.toggleStatus(benefit.id), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        fetchBenefits();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este benefício?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.beneficios.delete(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        fetchBenefits();
      }
    } catch (error) {
      console.error('Error deleting benefit:', error);
    }
  };

  const openEditModal = (benefit: Benefit) => {
    setEditingBenefit(benefit);
    setFormData({
      nome: benefit.nome,
      descricao: benefit.descricao || '',
      categoria: benefit.categoria,
      nomeParceiro: benefit.nomeParceiro || '',
      desconto: benefit.desconto || '',
      ativo: benefit.ativo,
      destacado: benefit.destacado,
      ordem: benefit.ordem,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingBenefit(null);
    setFormData({
      nome: '',
      descricao: '',
      categoria: 'Saúde',
      nomeParceiro: '',
      desconto: '',
      ativo: true,
      destacado: false,
      ordem: 0,
    });
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  const filteredBenefits = benefits.filter((benefit) => {
    const matchesSearch =
      benefit.nome.toLowerCase().includes(search.toLowerCase()) ||
      (benefit.nomeParceiro && benefit.nomeParceiro.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || benefit.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
                link.href === '/admin/benefits' ? 'bg-white/20' : ''
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
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Gerenciar Convênios</h1>
          <Button onClick={openNewModal}>+ Novo Convênio</Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder="Buscar convênios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-white"
          >
            <option value="all">Todas as categorias</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : (
          <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[var(--gray-50)]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[var(--foreground)]">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[var(--foreground)]">Parceiro</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[var(--foreground)]">Categoria</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[var(--foreground)]">Desconto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[var(--foreground)]">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[var(--foreground)]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredBenefits.map((benefit) => (
                  <tr key={benefit.id} className="border-t border-[var(--border)]">
                    <td className="px-6 py-4 text-[var(--foreground)]">{benefit.nome}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{benefit.nomeParceiro || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[var(--gray-100)] rounded text-sm">{benefit.categoria}</span>
                    </td>
                    <td className="px-6 py-4 text-[var(--foreground)]">{benefit.desconto || '-'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(benefit)}
                        className={`px-2 py-1 rounded text-sm cursor-pointer ${
                          benefit.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {benefit.ativo ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEditModal(benefit)}
                        className="text-[var(--secondary)] hover:underline mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(benefit.id)}
                        className="text-[var(--error)] hover:underline"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredBenefits.length === 0 && !loading && (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            Nenhum convênio encontrado.
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingBenefit ? 'Editar Convênio' : 'Novo Convênio'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome *</label>
                      <Input
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        required
                        placeholder="Nome do convênio"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria *</label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                        required
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                      rows={3}
                      placeholder="Descrição do convênio"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Parceiro</label>
                      <Input
                        value={formData.nomeParceiro}
                        onChange={(e) => setFormData({ ...formData, nomeParceiro: e.target.value })}
                        placeholder="Nome do parceiro"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Desconto</label>
                      <Input
                        value={formData.desconto}
                        onChange={(e) => setFormData({ ...formData, desconto: e.target.value })}
                        placeholder="Ex: 20%"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ordem</label>
                      <Input
                        type="number"
                        value={formData.ordem}
                        onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.ativo}
                        onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                      />
                      <label htmlFor="isActive" className="text-sm">Ativo</label>
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.destacado}
                        onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                      />
                      <label htmlFor="isFeatured" className="text-sm">Destacado</label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1" disabled={saving}>
                      {saving ? 'Salvando...' : editingBenefit ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { useDebounce, useAdminAuth } from '@/hooks';
import { AdminLayout, FilterBar, FormModal } from '@/components/admin';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/constants';

interface Benefit {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  nomeParceiro: string | null;
  desconto: string | null;
  ativo: boolean;
  destacado: boolean;
  ordem: number;
}

const BENEFIT_CATEGORIES = CATEGORIES.benefits;

export default function AdminBenefitsPage() {
  useAdminAuth();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
  const [saving, setSaving] = useState(false);
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

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    setMounted(true);
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.beneficios.list, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBenefits(data.beneficios);
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchBenefits();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.beneficios.delete(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchBenefits();
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
    setFormData({ nome: '', descricao: '', categoria: 'Saúde', nomeParceiro: '', desconto: '', ativo: true, destacado: false, ordem: 0 });
  };

  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBenefits = benefits.filter((b) => {
    const matchesSearch = b.nome.toLowerCase().includes(search.toLowerCase()) || (b.nomeParceiro && b.nomeParceiro.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || b.categoria === categoryFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'ATIVO' && b.ativo) || (statusFilter === 'INATIVO' && !b.ativo);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filterOptions = [{ value: 'all', label: 'Todas as categorias' }, ...BENEFIT_CATEGORIES.map((c) => ({ value: c, label: c }))];

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'INATIVO', label: 'Inativo' },
  ];

  return (
    <AdminLayout
      title="Gerenciar Convênios"
      actions={<Button onClick={() => { resetForm(); setShowModal(true); }}>+ Novo Convênio</Button>}
    >
      <FilterBar
        searchPlaceholder="Buscar convênios..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { options: filterOptions, value: categoryFilter, onChange: setCategoryFilter },
          { options: statusOptions, value: statusFilter, onChange: setStatusFilter },
        ]}
      />

      {!mounted || loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--gray-50)]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Parceiro</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Categoria</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Desconto</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredBenefits.map((benefit) => (
                <tr key={benefit.id} className="border-t border-[var(--border)]">
                  <td className="px-6 py-4">{benefit.nome}</td>
                  <td className="px-6 py-4 text-muted-foreground">{benefit.nomeParceiro || '-'}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{benefit.categoria}</span></td>
                  <td className="px-6 py-4">{benefit.desconto || '-'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={benefit.ativo ? 'ATIVO' : 'INATIVO'} onClick={() => handleToggleStatus(benefit)} />
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEditModal(benefit)} className="text-secondary hover:underline mr-3">Editar</button>
                    <button onClick={() => handleDelete(benefit.id)} className="text-red-500 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredBenefits.length === 0 && !loading && <div className="text-center py-12 text-muted-foreground">Nenhum convênio encontrado.</div>}

      <FormModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingBenefit ? 'Editar Convênio' : 'Novo Convênio'}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel={editingBenefit ? 'Atualizar' : 'Criar'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome *</label>
              <Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required placeholder="Nome do convênio" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Categoria *</label>
              <select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                {BENEFIT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Descrição</label>
            <textarea value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="Descrição do convênio" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Parceiro</label>
              <Input value={formData.nomeParceiro} onChange={(e) => setFormData({ ...formData, nomeParceiro: e.target.value })} placeholder="Nome do parceiro" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Desconto</label>
              <Input value={formData.desconto} onChange={(e) => setFormData({ ...formData, desconto: e.target.value })} placeholder="Ex: 20%" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ordem</label>
              <Input type="number" value={formData.ordem} onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="ativo" checked={formData.ativo} onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })} />
              <label htmlFor="ativo" className="text-sm">Ativo</label>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="destacado" checked={formData.destacado} onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })} />
              <label htmlFor="destacado" className="text-sm">Destacado</label>
            </div>
          </div>
        </div>
      </FormModal>
    </AdminLayout>
  );
}

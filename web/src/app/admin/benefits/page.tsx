'use client';

import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { useDebounce, useAdminAuth, useToast } from '@/hooks';
import { FilterBar, FormModal } from '@/components/admin';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/skeleton';
import { DataTable, Column } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
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
  const toast = useToast();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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
      toast.addToast('Erro ao carregar convênios', 'error');
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
        toast.addToast(editingBenefit ? 'Convênio atualizado com sucesso' : 'Convênio criado com sucesso', 'success');
      } else {
        toast.addToast(data.message || 'Erro ao salvar benefício', 'error');
      }
    } catch (error) {
      console.error('Error saving benefit:', error);
      toast.addToast('Erro ao salvar benefício', 'error');
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
      if (data.success) {
        fetchBenefits();
        toast.addToast('Status atualizado com sucesso', 'success');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.addToast('Erro ao atualizar status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.beneficios.delete(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchBenefits();
        toast.addToast('Convênio excluído com sucesso', 'success');
      }
    } catch (error) {
      console.error('Error deleting benefit:', error);
      toast.addToast('Erro ao excluir convênio', 'error');
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

  const filteredBenefits = (benefits || []).filter((b) => {
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

  const columns: Column<Benefit>[] = [
    { key: 'nome', header: 'Nome', sortable: true },
    {
      key: 'nomeParceiro',
      header: 'Parceiro',
      cell: (row) => row.nomeParceiro || '-',
    },
    {
      key: 'categoria',
      header: 'Categoria',
      cell: (row) => <span className="px-2 py-1 bg-gray-100 rounded text-sm">{row.categoria}</span>,
    },
    {
      key: 'desconto',
      header: 'Desconto',
      cell: (row) => row.desconto || '-',
    },
    {
      key: 'ativo',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.ativo ? 'ATIVO' : 'INATIVO'} onClick={() => handleToggleStatus(row)} />,
    },
    {
      key: 'acoes',
      header: 'Ações',
      cell: (row) => (
        <div className="flex gap-2">
          <button onClick={() => openEditModal(row)} className="text-secondary hover:underline">Editar</button>
          <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:underline">Excluir</button>
        </div>
      ),
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciar Convênios"
        actions={
          <Button onClick={() => { resetForm(); setShowModal(true); }}>
            + Novo Convênio
          </Button>
        }
      />
      <FilterBar
        searchPlaceholder="Buscar convênios..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { options: filterOptions, value: categoryFilter, onChange: setCategoryFilter },
          { options: statusOptions, value: statusFilter, onChange: setStatusFilter },
        ]}
      />

      {loading ? (
        <TableSkeleton rows={5} />
      ) : filteredBenefits.length === 0 ? (
        <EmptyState
          title="Nenhum convênio encontrado"
          description={search || categoryFilter !== 'all' || statusFilter !== 'all' ? 'Tente ajustar os filtros de busca' : 'Comece adicionando um novo convênio'}
          actionLabel={!search && categoryFilter === 'all' && statusFilter === 'all' ? 'Adicionar Convênio' : undefined}
          onAction={() => { resetForm(); setShowModal(true); }}
        />
      ) : (
        <DataTable
          data={filteredBenefits}
          columns={columns}
          keyField="id"
        />
      )}

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
    </div>
  );
}

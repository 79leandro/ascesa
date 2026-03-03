'use client';

import { useState, useEffect } from 'react';
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

interface Partner {
  id: string;
  nome: string;
  razaoSocial: string | null;
  cnpj: string | null;
  email: string | null;
  telefone: string | null;
  categoria: string;
  desconto: string | null;
  descricao: string | null;
  site: string | null;
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE';
  inicioContrato: string | null;
  fimContrato: string | null;
  ativo: boolean;
}

const PARTNER_CATEGORIES = CATEGORIES.partners;

export default function AdminPartnersPage() {
  useAdminAuth();
  const toast = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    razaoSocial: '',
    cnpj: '',
    email: '',
    telefone: '',
    categoria: 'Saúde',
    desconto: '',
    descricao: '',
    site: '',
    status: 'ATIVO',
    inicioContrato: '',
    fimContrato: '',
    ativo: true,
  });

  useEffect(() => {
    setMounted(true);
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.parceiros.list, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPartners(data.parceiros);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.addToast('Erro ao carregar parceiros', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingPartner
        ? API_ENDPOINTS.parceiros.update(editingPartner.id)
        : API_ENDPOINTS.parceiros.create;
      const payload = {
        ...formData,
        inicioContrato: formData.inicioContrato ? new Date(formData.inicioContrato).toISOString() : null,
        fimContrato: formData.fimContrato ? new Date(formData.fimContrato).toISOString() : null,
      };
      const res = await fetch(url, {
        method: editingPartner ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        fetchPartners();
        setShowModal(false);
        resetForm();
        toast.addToast(editingPartner ? 'Parceiro atualizado com sucesso' : 'Parceiro criado com sucesso', 'success');
      } else {
        toast.addToast(data.message || 'Erro ao salvar parceiro', 'error');
      }
    } catch (error) {
      console.error('Error saving partner:', error);
      toast.addToast('Erro ao salvar parceiro', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (partner: Partner) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.parceiros.toggleStatus(partner.id), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchPartners();
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
      const res = await fetch(API_ENDPOINTS.parceiros.delete(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchPartners();
        toast.addToast('Parceiro excluído com sucesso', 'success');
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.addToast('Erro ao excluir parceiro', 'error');
    }
  };

  const openEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      nome: partner.nome,
      razaoSocial: partner.razaoSocial || '',
      cnpj: partner.cnpj || '',
      email: partner.email || '',
      telefone: partner.telefone || '',
      categoria: partner.categoria,
      desconto: partner.desconto || '',
      descricao: partner.descricao || '',
      site: partner.site || '',
      status: partner.status,
      inicioContrato: partner.inicioContrato ? partner.inicioContrato.split('T')[0] : '',
      fimContrato: partner.fimContrato ? partner.fimContrato.split('T')[0] : '',
      ativo: partner.ativo,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingPartner(null);
    setFormData({
      nome: '', razaoSocial: '', cnpj: '', email: '', telefone: '',
      categoria: 'Saúde', desconto: '', descricao: '', site: '',
      status: 'ATIVO', inicioContrato: '', fimContrato: '', ativo: true,
    });
  };

  const filteredPartners = (partners || []).filter((p) => {
    const matchesSearch = p.nome.toLowerCase().includes(search.toLowerCase()) ||
      (p.cnpj && p.cnpj.includes(search)) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || p.categoria === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categoryOptions = [
    { value: 'all', label: 'Todas as categorias' },
    ...PARTNER_CATEGORIES.map((c) => ({ value: c, label: c })),
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'INATIVO', label: 'Inativo' },
  ];

  const columns: Column<Partner>[] = [
    { key: 'nome', header: 'Nome', sortable: true },
    { key: 'cnpj', header: 'CNPJ', cell: (row) => row.cnpj || '-' },
    {
      key: 'categoria',
      header: 'Categoria',
      cell: (row) => <span className="px-2 py-1 bg-gray-100 rounded text-sm">{row.categoria}</span>,
    },
    { key: 'desconto', header: 'Desconto', cell: (row) => row.desconto || '-' },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} onClick={() => handleToggleStatus(row)} />,
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
        title="Gerenciar Parceiros"
        actions={
          <Button onClick={() => { resetForm(); setShowModal(true); }}>
            + Novo Parceiro
          </Button>
        }
      />
      <FilterBar
        searchPlaceholder="Buscar parceiros..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { options: categoryOptions, value: categoryFilter, onChange: setCategoryFilter },
          { options: statusOptions, value: statusFilter, onChange: setStatusFilter },
        ]}
      />

      {loading ? (
        <TableSkeleton rows={5} />
      ) : filteredPartners.length === 0 ? (
        <EmptyState
          title="Nenhum parceiro encontrado"
          description={search || categoryFilter !== 'all' || statusFilter !== 'all' ? 'Tente ajustar os filtros de busca' : 'Comece adicionando um novo parceiro'}
          actionLabel={!search && categoryFilter === 'all' && statusFilter === 'all' ? 'Adicionar Parceiro' : undefined}
          onAction={() => { resetForm(); setShowModal(true); }}
        />
      ) : (
        <DataTable
          data={filteredPartners}
          columns={columns}
          keyField="id"
        />
      )}

      <FormModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel={editingPartner ? 'Atualizar' : 'Criar'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome Fantasia *</label>
              <Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required placeholder="Nome do parceiro" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Razão Social</label>
              <Input value={formData.razaoSocial} onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })} placeholder="Razão social" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">CNPJ</label>
              <Input value={formData.cnpj} onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })} placeholder="00.000.000/0001-00" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="email@parceiro.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Telefone *</label>
              <Input value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} required placeholder="(00) 00000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Categoria *</label>
              <select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                {PARTNER_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Desconto</label>
              <Input value={formData.desconto} onChange={(e) => setFormData({ ...formData, desconto: e.target.value })} placeholder="Ex: 20%" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <Input value={formData.site} onChange={(e) => setFormData({ ...formData, site: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Descrição</label>
            <textarea value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="Descrição do parceiro..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Início Contrato</label>
              <Input type="date" value={formData.inicioContrato} onChange={(e) => setFormData({ ...formData, inicioContrato: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fim Contrato</label>
              <Input type="date" value={formData.fimContrato} onChange={(e) => setFormData({ ...formData, fimContrato: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="ATIVO">Ativo</option>
                <option value="PENDENTE">Pendente</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="ativo" checked={formData.ativo} onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })} />
              <label htmlFor="ativo" className="text-sm">Ativo</label>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}

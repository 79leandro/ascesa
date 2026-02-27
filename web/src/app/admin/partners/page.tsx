'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { useDebounce, useAdminAuth } from '@/hooks';
import { AdminLayout, FilterBar, FormModal } from '@/components/admin';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  const debouncedSearch = useDebounce(search);

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
      } else {
        alert(data.message || 'Erro ao salvar parceiro');
      }
    } catch (error) {
      console.error('Error saving partner:', error);
      alert('Erro ao salvar parceiro');
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
      if (data.success) fetchPartners();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.parceiros.delete(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
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

  const filteredPartners = partners.filter((p) => {
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

  return (
    <AdminLayout
      title="Gerenciar Parceiros"
      actions={<Button onClick={() => { resetForm(); setShowModal(true); }}>+ Novo Parceiro</Button>}
    >
      <FilterBar
        searchPlaceholder="Buscar parceiros..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { options: categoryOptions, value: categoryFilter, onChange: setCategoryFilter },
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
                <th className="px-6 py-3 text-left text-sm font-medium">CNPJ</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Categoria</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Desconto</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="border-t border-[var(--border)]">
                  <td className="px-6 py-4">{partner.nome}</td>
                  <td className="px-6 py-4 text-muted-foreground">{partner.cnpj || '-'}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{partner.categoria}</span></td>
                  <td className="px-6 py-4">{partner.desconto || '-'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={partner.status} onClick={() => handleToggleStatus(partner)} />
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEditModal(partner)} className="text-secondary hover:underline mr-3">Editar</button>
                    <button onClick={() => handleDelete(partner.id)} className="text-red-500 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredPartners.length === 0 && !loading && <div className="text-center py-12 text-muted-foreground">Nenhum parceiro encontrado.</div>}

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
    </AdminLayout>
  );
}

'use client';

import { useEffect, useState } from 'react';
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

interface Partner {
  id: string;
  name: string;
  corporateName: string | null;
  cnpj: string | null;
  email: string | null;
  phone: string | null;
  category: string;
  discount: string | null;
  description: string | null;
  logo: string | null;
  website: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  contractStart: string | null;
  contractEnd: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = ['Saúde', 'Educação', 'Lazer', 'Serviços', 'Outros'];

export default function AdminPartnersPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    corporateName: '',
    cnpj: '',
    email: '',
    phone: '',
    category: 'Saúde',
    discount: '',
    description: '',
    website: '',
    status: 'ACTIVE',
    contractStart: '',
    contractEnd: '',
    isActive: true,
  });

  useEffect(() => {
    checkAuth();
    fetchPartners();
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

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.partners.list, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPartners(data.partners);
      }
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
        ? API_ENDPOINTS.partners.update(editingPartner.id)
        : API_ENDPOINTS.partners.create;

      const payload = {
        ...formData,
        contractStart: formData.contractStart ? new Date(formData.contractStart).toISOString() : null,
        contractEnd: formData.contractEnd ? new Date(formData.contractEnd).toISOString() : null,
      };

      const res = await fetch(url, {
        method: editingPartner ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
      const res = await fetch(API_ENDPOINTS.partners.toggleStatus(partner.id), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        fetchPartners();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este parceiro?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.partners.delete(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        fetchPartners();
        setSelectedPartner(null);
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  const openEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      corporateName: partner.corporateName || '',
      cnpj: partner.cnpj || '',
      email: partner.email || '',
      phone: partner.phone || '',
      category: partner.category,
      discount: partner.discount || '',
      description: partner.description || '',
      website: partner.website || '',
      status: partner.status,
      contractStart: partner.contractStart ? partner.contractStart.split('T')[0] : '',
      contractEnd: partner.contractEnd ? partner.contractEnd.split('T')[0] : '',
      isActive: partner.isActive,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingPartner(null);
    setFormData({
      name: '',
      corporateName: '',
      cnpj: '',
      email: '',
      phone: '',
      category: 'Saúde',
      discount: '',
      description: '',
      website: '',
      status: 'ACTIVE',
      contractStart: '',
      contractEnd: '',
      isActive: true,
    });
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'PENDING':
        return 'Pendente';
      case 'INACTIVE':
        return 'Inativo';
      default:
        return status;
    }
  };

  const filteredPartners = partners.filter((p) => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.cnpj && p.cnpj.includes(search)) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const activeCount = partners.filter((p) => p.status === 'ACTIVE').length;
  const pendingCount = partners.filter((p) => p.status === 'PENDING').length;
  const inactiveCount = partners.filter((p) => p.status === 'INACTIVE').length;

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
                link.href === '/admin/partners' ? 'bg-white/20' : ''
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
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Gestão de Parceiros</h1>
          <Button onClick={openNewModal}>+ Novo Parceiro</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{partners.length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-red-600">{inactiveCount}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Inativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder="Buscar por nome, CNPJ ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-white"
          >
            <option value="ALL">Todos</option>
            <option value="ACTIVE">Ativos</option>
            <option value="PENDING">Pendentes</option>
            <option value="INACTIVE">Inativos</option>
          </select>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{partner.name}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(partner.status)}`}>
                      {getStatusLabel(partner.status)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">CNPJ</p>
                    <p className="text-sm">{partner.cnpj || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Categoria</p>
                    <span className="px-2 py-1 bg-[var(--gray-100)] rounded text-xs">
                      {partner.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Desconto</p>
                    <p className="text-lg font-bold text-green-600">{partner.discount || '-'}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedPartner(partner)}
                    >
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(partner)}>
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredPartners.length === 0 && !loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[var(--muted-foreground)]">Nenhum parceiro encontrado.</p>
            </CardContent>
          </Card>
        )}

        {/* Modal for partner details */}
        {selectedPartner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Detalhes do Parceiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Nome Fantasia</p>
                  <p className="font-medium">{selectedPartner.name}</p>
                </div>
                {selectedPartner.corporateName && (
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Razão Social</p>
                    <p className="font-medium">{selectedPartner.corporateName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">CNPJ</p>
                  <p className="font-medium">{selectedPartner.cnpj || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Email</p>
                  <p className="font-medium">{selectedPartner.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Telefone</p>
                  <p className="font-medium">{selectedPartner.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Categoria</p>
                  <p className="font-medium">{selectedPartner.category}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Desconto</p>
                  <p className="font-medium text-green-600">{selectedPartner.discount || '-'}</p>
                </div>
                {selectedPartner.description && (
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Descrição</p>
                    <p className="font-medium">{selectedPartner.description}</p>
                  </div>
                )}
                {selectedPartner.website && (
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Website</p>
                    <p className="font-medium">{selectedPartner.website}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Contrato</p>
                  <p className="font-medium">
                    {selectedPartner.contractStart && selectedPartner.contractEnd
                      ? `${selectedPartner.contractStart.split('T')[0]} até ${selectedPartner.contractEnd.split('T')[0]}`
                      : 'A definir'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedPartner.status)}`}>
                    {getStatusLabel(selectedPartner.status)}
                  </span>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedPartner(null)}
                  >
                    Fechar
                  </Button>
                  <Button className="flex-1" onClick={() => openEditModal(selectedPartner)}>
                    Editar
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  className="w-full mt-2"
                  onClick={() => handleDelete(selectedPartner.id)}
                >
                  Excluir Parceiro
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal for create/edit partner */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome Fantasia *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Nome do parceiro"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Razão Social</label>
                      <Input
                        value={formData.corporateName}
                        onChange={(e) => setFormData({ ...formData, corporateName: e.target.value })}
                        placeholder="Razão social"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">CNPJ</label>
                      <Input
                        value={formData.cnpj}
                        onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                        placeholder="00.000.000/0001-00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="email@parceiro.com.br"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefone *</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                        required
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Desconto (%)</label>
                      <Input
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        placeholder="Ex: 20%"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Website</label>
                      <Input
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                      rows={3}
                      placeholder="Descrição do convênio..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Início Contrato</label>
                      <Input
                        type="date"
                        value={formData.contractStart}
                        onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Fim Contrato</label>
                      <Input
                        type="date"
                        value={formData.contractEnd}
                        onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                      >
                        <option value="ACTIVE">Ativo</option>
                        <option value="PENDING">Pendente</option>
                        <option value="INACTIVE">Inativo</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <label htmlFor="isActive" className="text-sm">Ativo</label>
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
                      {saving ? 'Salvando...' : editingPartner ? 'Atualizar' : 'Cadastrar'}
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

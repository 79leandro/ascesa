'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️' },
  { href: '/dashboard', label: 'Voltar ao Site', icon: '←' },
];

interface Partner {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  contractStart: string;
  contractEnd: string;
  discount: string;
  description: string;
}

export default function AdminPartnersPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Drogaria Popular',
      cnpj: '12.345.678/0001-90',
      email: 'contato@drogariapopular.com.br',
      phone: '(61) 3333-3333',
      category: 'Saúde',
      status: 'ACTIVE',
      contractStart: '2025-01-01',
      contractEnd: '2026-12-31',
      discount: '30%',
      description: 'Descontos em medicamentos e produtos de saúde',
    },
    {
      id: '2',
      name: 'Universidade Presidente',
      cnpj: '98.765.432/0001-10',
      email: 'parcerias@unipresidente.edu.br',
      phone: '(61) 3444-4444',
      category: 'Educação',
      status: 'ACTIVE',
      contractStart: '2025-03-01',
      contractEnd: '2026-03-01',
      discount: '25%',
      description: 'Descontos em mensalidades e cursos',
    },
    {
      id: '3',
      name: 'Labomed Exames',
      cnpj: '45.678.901/0001-23',
      email: 'comercial@labomed.com.br',
      phone: '(61) 3555-5555',
      category: 'Saúde',
      status: 'ACTIVE',
      contractStart: '2025-06-01',
      contractEnd: '2026-06-01',
      discount: '20%',
      description: 'Descontos em exames laboratoriais',
    },
    {
      id: '4',
      name: 'Serviços Funerários Vale',
      cnpj: '67.890.123/0001-45',
      email: 'parceria@sfvale.com.br',
      phone: '(61) 3666-6666',
      category: 'Serviços',
      status: 'PENDING',
      contractStart: '',
      contractEnd: '',
      discount: '50%',
      description: 'Assistência funeral completa',
    },
    {
      id: '5',
      name: 'Hotel Monte Verde',
      cnpj: '78.901.234/0001-56',
      email: 'reservas@hotelmonteverde.com.br',
      phone: '(61) 3777-7777',
      category: 'Lazer',
      status: 'INACTIVE',
      contractStart: '2024-01-01',
      contractEnd: '2024-12-31',
      discount: '15%',
      description: 'Descontos em hospedagem',
    },
  ]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const filteredPartners = partners.filter(p => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cnpj.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = partners.filter(p => p.status === 'ACTIVE').length;
  const pendingCount = partners.filter(p => p.status === 'PENDING').length;
  const inactiveCount = partners.filter(p => p.status === 'INACTIVE').length;

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
          <Button onClick={() => setShowModal(true)}>
            + Novo Parceiro
          </Button>
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
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg flex-1 bg-white"
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
                  <p className="text-sm">{partner.cnpj}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Categoria</p>
                  <span className="px-2 py-1 bg-[var(--gray-100)] rounded text-xs">
                    {partner.category}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Desconto</p>
                  <p className="text-lg font-bold text-green-600">{partner.discount}</p>
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
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPartners.length === 0 && (
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
                  <p className="text-sm text-[var(--muted-foreground)]">Nome</p>
                  <p className="font-medium">{selectedPartner.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">CNPJ</p>
                  <p className="font-medium">{selectedPartner.cnpj}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Email</p>
                  <p className="font-medium">{selectedPartner.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Telefone</p>
                  <p className="font-medium">{selectedPartner.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Categoria</p>
                  <p className="font-medium">{selectedPartner.category}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Desconto</p>
                  <p className="font-medium text-green-600">{selectedPartner.discount}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Descrição</p>
                  <p className="font-medium">{selectedPartner.description}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Contrato</p>
                  <p className="font-medium">
                    {selectedPartner.contractStart && selectedPartner.contractEnd
                      ? `${selectedPartner.contractStart} até ${selectedPartner.contractEnd}`
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
                  <Button className="flex-1">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal for new partner */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Novo Parceiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="Nome do parceiro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CNPJ</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="00.000.000/0001-00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="email@parceiro.com.br"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <select className="w-full px-3 py-2 border border-[var(--border)] rounded-lg">
                    <option>Selecione...</option>
                    <option>Saúde</option>
                    <option>Educação</option>
                    <option>Lazer</option>
                    <option>Serviços</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Desconto (%)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="Ex: 20%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    rows={3}
                    placeholder="Descrição do convênio..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1">
                    Cadastrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

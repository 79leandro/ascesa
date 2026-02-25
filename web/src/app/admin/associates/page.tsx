'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_ENDPOINTS } from '@/lib/api';

interface Associate {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  createdAt: string;
}

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

export default function AdminAssociatesPage() {
  const router = useRouter();
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedAssociate, setSelectedAssociate] = useState<Associate | null>(null);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  useEffect(() => {
    loadAssociates();
  }, [filter]);

  const loadAssociates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // For now, we'll use mock data since there's no proper endpoint
      setAssociates([
        {
          id: '1',
          name: 'João Silva Santos',
          email: 'joao@teste.com',
          cpf: '123.456.789-01',
          phone: '(31) 99999-9999',
          status: 'PENDING',
          createdAt: '2026-02-20',
        },
        {
          id: '2',
          name: 'Maria Oliveira',
          email: 'maria@teste.com',
          cpf: '987.654.321-00',
          phone: '(31) 98888-7777',
          status: 'ACTIVE',
          createdAt: '2026-01-15',
        },
        {
          id: '3',
          name: 'Pedro Santos',
          email: 'pedro@teste.com',
          cpf: '456.789.123-00',
          phone: '(31) 97777-6666',
          status: 'PENDING',
          createdAt: '2026-02-22',
        },
      ]);
    } catch (error) {
      console.error('Error loading associates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (associateId: string, newStatus: string, sendEmail: boolean = true) => {
    setActionLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAssociates(prev =>
        prev.map(a =>
          a.id === associateId ? { ...a, status: newStatus as Associate['status'] } : a
        )
      );

      setSelectedAssociate(null);
      setNotes('');

      if (sendEmail) {
        alert(`Email de notificação enviado para o associado!`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(false);
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
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
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
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filteredAssociates = associates.filter(a => {
    const matchesFilter = filter === 'ALL' || a.status === filter;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.cpf.includes(search);
    return matchesFilter && matchesSearch;
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
                link.href === '/admin/associates' ? 'bg-white/20' : ''
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[var(--gray-50)]">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Gestão de Associados</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[var(--border)] bg-white"
          >
            <option value="ALL">Todos</option>
            <option value="PENDING">Pendentes</option>
            <option value="ACTIVE">Ativos</option>
            <option value="INACTIVE">Inativos</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{associates.length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-yellow-600">
                {associates.filter(a => a.status === 'PENDING').length}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">Pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-green-600">
                {associates.filter(a => a.status === 'ACTIVE').length}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-red-600">
                {associates.filter(a => a.status === 'INACTIVE').length}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">Inativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Associates List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Associados</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : filteredAssociates.length === 0 ? (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                Nenhum associado encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nome</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">CPF</th>
                      <th className="text-left py-3 px-4">Telefone</th>
                      <th className="text-left py-3 px-4">Data</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssociates.map((associate) => (
                      <tr key={associate.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{associate.name}</td>
                        <td className="py-3 px-4">{associate.email}</td>
                        <td className="py-3 px-4">{associate.cpf}</td>
                        <td className="py-3 px-4">{associate.phone}</td>
                        <td className="py-3 px-4">{associate.createdAt}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(associate.status)}`}>
                            {getStatusLabel(associate.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAssociate(associate)}
                          >
                            Ver Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal for details and actions */}
        {selectedAssociate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg m-4">
              <CardHeader>
                <CardTitle>Detalhes do Associado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Nome</p>
                  <p className="font-medium">{selectedAssociate.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Email</p>
                  <p className="font-medium">{selectedAssociate.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">CPF</p>
                  <p className="font-medium">{selectedAssociate.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Telefone</p>
                  <p className="font-medium">{selectedAssociate.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Data de Cadastro</p>
                  <p className="font-medium">{selectedAssociate.createdAt}</p>
                </div>

                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">Notas Internas</p>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Adicione notas internas sobre este associado..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {selectedAssociate.status === 'PENDING' && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(selectedAssociate.id, 'ACTIVE')}
                      disabled={actionLoading}
                    >
                      Aprovar
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => handleStatusChange(selectedAssociate.id, 'CANCELLED')}
                      disabled={actionLoading}
                    >
                      Rejeitar
                    </Button>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedAssociate(null)}
                  >
                    Fechar
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

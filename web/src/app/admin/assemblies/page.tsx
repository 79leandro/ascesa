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

interface Assembly {
  id: string;
  title: string;
  type: 'ORDINARY' | 'EXTRAORDINARY';
  date: string;
  time: string;
  location: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description: string;
  totalVotes: number;
}

interface Candidate {
  id: string;
  assemblyId: string;
  name: string;
  role: string;
  votes: number;
  photo: string;
}

export default function AdminAssembliesPage() {
  const router = useRouter();
  const [assemblies, setAssemblies] = useState<Assembly[]>([
    {
      id: '1',
      title: 'Assembleia Geral Ordinária 2026',
      type: 'ORDINARY',
      date: '2026-03-15',
      time: '10:00',
      location: 'Sede da ASCESA',
      status: 'SCHEDULED',
      description: 'Apresentação do relatório anual e eleição da diretoria',
      totalVotes: 0,
    },
    {
      id: '2',
      title: 'Assembleia Extraordinária - Reforma Estatutária',
      type: 'EXTRAORDINARY',
      date: '2026-02-20',
      time: '14:00',
      location: 'Sede da ASCESA',
      status: 'COMPLETED',
      description: 'Votação das alterações estatutárias',
      totalVotes: 156,
    },
    {
      id: '3',
      title: 'Assembleia Geral Ordinária 2025',
      type: 'ORDINARY',
      date: '2025-03-15',
      time: '10:00',
      location: 'Sede da ASCESA',
      status: 'COMPLETED',
      description: 'Apresentação do relatório anual e prestação de contas',
      totalVotes: 234,
    },
  ]);
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      assemblyId: '1',
      name: 'José Silva',
      role: 'Presidente',
      votes: 0,
      photo: '',
    },
    {
      id: '2',
      assemblyId: '1',
      name: 'Maria Santos',
      role: 'Vice-Presidente',
      votes: 0,
      photo: '',
    },
    {
      id: '3',
      assemblyId: '1',
      name: 'Pedro Oliveira',
      role: 'Diretor Financeiro',
      votes: 0,
      photo: '',
    },
    {
      id: '4',
      assemblyId: '2',
      name: 'Sim - Aprovar',
      role: 'Voto',
      votes: 142,
      photo: '',
    },
    {
      id: '5',
      assemblyId: '2',
      name: 'Não - Reprovar',
      role: 'Voto',
      votes: 14,
      photo: '',
    },
  ]);
  const [selectedAssembly, setSelectedAssembly] = useState<Assembly | null>(null);
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
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Agendada';
      case 'IN_PROGRESS':
        return 'Em Andamento';
      case 'COMPLETED':
        return 'Encerrada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    return type === 'ORDINARY' ? 'Ordinária' : 'Extraordinária';
  };

  const scheduledCount = assemblies.filter(a => a.status === 'SCHEDULED').length;
  const completedCount = assemblies.filter(a => a.status === 'COMPLETED').length;

  const filteredCandidates = selectedAssembly
    ? candidates.filter(c => c.assemblyId === selectedAssembly.id)
    : [];

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
                link.href === '/admin/assemblies' ? 'bg-white/20' : ''
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
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Assembleias e Votações</h1>
          <Button onClick={() => setShowModal(true)}>
            + Nova Assembleia
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{assemblies.length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-blue-600">{scheduledCount}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Agendadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Encerradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">
                {assemblies.reduce((acc, a) => acc + a.totalVotes, 0)}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">Total de Votos</p>
            </CardContent>
          </Card>
        </div>

        {/* Assemblies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assemblies.map((assembly) => (
            <Card key={assembly.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{assembly.title}</CardTitle>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      {getTypeLabel(assembly.type)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(assembly.status)}`}>
                    {getStatusLabel(assembly.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span>📅</span>
                  <span>{new Date(assembly.date).toLocaleDateString('pt-BR')}</span>
                  <span>às</span>
                  <span>{assembly.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>📍</span>
                  <span>{assembly.location}</span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">{assembly.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium">
                    {assembly.totalVotes > 0 ? `${assembly.totalVotes} votos` : 'Votação não iniciada'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAssembly(assembly)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {assemblies.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[var(--muted-foreground)] mb-4">Nenhuma assembleia encontrada.</p>
              <Button onClick={() => setShowModal(true)}>Criar Primeira Assembleia</Button>
            </CardContent>
          </Card>
        )}

        {/* Modal for assembly details */}
        {selectedAssembly && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Detalhes da Assembleia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Título</p>
                  <p className="font-medium">{selectedAssembly.title}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Tipo</p>
                  <p className="font-medium">{getTypeLabel(selectedAssembly.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Data e Hora</p>
                  <p className="font-medium">
                    {new Date(selectedAssembly.date).toLocaleDateString('pt-BR')} às {selectedAssembly.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Local</p>
                  <p className="font-medium">{selectedAssembly.location}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Descrição</p>
                  <p className="font-medium">{selectedAssembly.description}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedAssembly.status)}`}>
                    {getStatusLabel(selectedAssembly.status)}
                  </span>
                </div>

                {/* Candidates/Options */}
                {filteredCandidates.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <p className="font-medium mb-3">Candidatos/Opções de Voto</p>
                    <div className="space-y-2">
                      {filteredCandidates.map((candidate) => (
                        <div key={candidate.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{candidate.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{candidate.votes}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">votos</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  {selectedAssembly.status === 'SCHEDULED' && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      Iniciar Votação
                    </Button>
                  )}
                  {selectedAssembly.status === 'IN_PROGRESS' && (
                    <Button className="flex-1 bg-red-600 hover:bg-red-700">
                      Encerrar Votação
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedAssembly(null)}
                  >
                    Fechar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal for new assembly */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Nova Assembleia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="Título da assembleia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <select className="w-full px-3 py-2 border border-[var(--border)] rounded-lg">
                    <option value="ORDINARY">Ordinária</option>
                    <option value="EXTRAORDINARY">Extraordinária</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Data</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hora</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Local</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="Local da assembleia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    rows={3}
                    placeholder="Descrição da assembleia..."
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
                    Criar
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

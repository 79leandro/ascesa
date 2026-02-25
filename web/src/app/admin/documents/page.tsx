'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  name: string;
  type: string;
  associateName: string;
  associateEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: string;
  fileUrl: string;
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

export default function AdminDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Comprovante de Residência',
      type: 'RESIDENCE_PROOF',
      associateName: 'João Silva Santos',
      associateEmail: 'joao@teste.com',
      status: 'PENDING',
      uploadedAt: '2026-02-25T10:30:00Z',
      fileUrl: '#',
    },
    {
      id: '2',
      name: 'CPF',
      type: 'CPF',
      associateName: 'Maria Oliveira',
      associateEmail: 'maria@teste.com',
      status: 'APPROVED',
      uploadedAt: '2026-02-24T14:20:00Z',
      fileUrl: '#',
    },
    {
      id: '3',
      name: 'Carteira de Identidade',
      type: 'IDENTITY',
      associateName: 'Pedro Santos',
      associateEmail: 'pedro@teste.com',
      status: 'PENDING',
      uploadedAt: '2026-02-23T09:15:00Z',
      fileUrl: '#',
    },
    {
      id: '4',
      name: 'Comprovante de Renda',
      type: 'INCOME_PROOF',
      associateName: 'Ana Costa',
      associateEmail: 'ana@teste.com',
      status: 'REJECTED',
      uploadedAt: '2026-02-22T16:45:00Z',
      fileUrl: '#',
    },
    {
      id: '5',
      name: 'Foto 3x4',
      type: 'PHOTO',
      associateName: 'Carlos Lima',
      associateEmail: 'carlos@teste.com',
      status: 'APPROVED',
      uploadedAt: '2026-02-21T11:00:00Z',
      fileUrl: '#',
    },
  ]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

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

  const handleStatusChange = async (docId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      setDocuments(prev =>
        prev.map(d => (d.id === docId ? { ...d, status: newStatus } : d))
      );
      setSelectedDoc(null);
    } catch (error) {
      console.error('Error updating document:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Aprovado';
      case 'REJECTED':
        return 'Rejeitado';
      case 'PENDING':
        return 'Pendente';
      default:
        return status;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      CPF: 'CPF',
      IDENTITY: 'Carteira de Identidade',
      RESIDENCE_PROOF: 'Comprovante de Residência',
      INCOME_PROOF: 'Comprovante de Renda',
      PHOTO: 'Foto 3x4',
    };
    return labels[type] || type;
  };

  const filteredDocs = documents.filter(d => {
    const matchesFilter = filter === 'ALL' || d.status === filter;
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.associateName.toLowerCase().includes(search.toLowerCase()) ||
      d.associateEmail.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = documents.filter(d => d.status === 'PENDING').length;
  const approvedCount = documents.filter(d => d.status === 'APPROVED').length;
  const rejectedCount = documents.filter(d => d.status === 'REJECTED').length;

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
                link.href === '/admin/documents' ? 'bg-white/20' : ''
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[var(--gray-50)]">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Gestão de Documentos</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{documents.length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Total</p>
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
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Aprovados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Rejeitados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar documentos..."
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
            <option value="PENDING">Pendentes</option>
            <option value="APPROVED">Aprovados</option>
            <option value="REJECTED">Rejeitados</option>
          </select>
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDocs.length === 0 ? (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                Nenhum documento encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Documento</th>
                      <th className="text-left py-3 px-4">Associado</th>
                      <th className="text-left py-3 px-4">Data</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {getDocumentTypeLabel(doc.type)}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p>{doc.associateName}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{doc.associateEmail}</p>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                            {getStatusLabel(doc.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDoc(doc)}
                            >
                              Ver Detalhes
                            </Button>
                            {doc.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleStatusChange(doc.id, 'APPROVED')}
                                  disabled={loading}
                                >
                                  Aprovar
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleStatusChange(doc.id, 'REJECTED')}
                                  disabled={loading}
                                >
                                  Rejeitar
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal for document details */}
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg m-4">
              <CardHeader>
                <CardTitle>Detalhes do Documento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Tipo</p>
                  <p className="font-medium">{getDocumentTypeLabel(selectedDoc.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Nome do Arquivo</p>
                  <p className="font-medium">{selectedDoc.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Associado</p>
                  <p className="font-medium">{selectedDoc.associateName}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{selectedDoc.associateEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Data de Upload</p>
                  <p className="font-medium">
                    {new Date(selectedDoc.uploadedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedDoc.status)}`}>
                    {getStatusLabel(selectedDoc.status)}
                  </span>
                </div>

                <div className="flex gap-2 pt-4">
                  {selectedDoc.status === 'PENDING' && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange(selectedDoc.id, 'APPROVED')}
                        disabled={loading}
                      >
                        Aprovar
                      </Button>
                      <Button
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        onClick={() => handleStatusChange(selectedDoc.id, 'REJECTED')}
                        disabled={loading}
                      >
                        Rejeitar
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedDoc(null)}
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

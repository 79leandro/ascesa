'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { useAdminAuth, useDebounce } from '@/hooks';
import { AdminLayout, FilterBar } from '@/components/admin';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Document {
  id: string;
  tipo: string;
  nomeArquivo: string;
  caminho: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  criadoEm: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
}

export default function AdminDocumentsPage() {
  useAdminAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        status: statusFilter !== 'all' ? statusFilter : '',
        search: debouncedSearch,
      });

      const res = await fetch(`${API_ENDPOINTS.documents.adminList}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setDocuments(data.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter, debouncedSearch]);

  const handleApprove = async (docId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.documents.approve(docId), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
        alert('Documento aprovado com sucesso!');
      } else {
        alert(data.message || 'Erro ao aprovar documento');
      }
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };

  const handleReject = async (docId: string) => {
    if (!confirm('Tem certeza que deseja rejeitar este documento?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.documents.reject(docId), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
        alert('Documento rejeitado');
      } else {
        alert(data.message || 'Erro ao rejeitar documento');
      }
    } catch (error) {
      console.error('Error rejecting document:', error);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      CPF: 'CPF',
      RG: 'RG',
      COMPROVANTE_RESIDENCIA: 'Comprovante de Residência',
      FOTO: 'Foto 3x4',
      COMPROVANTE_RENDA: 'Comprovante de Renda',
      OUTRO: 'Outro',
    };
    return labels[type] || type;
  };

  const filterOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'APROVADO', label: 'Aprovado' },
    { value: 'REJEITADO', label: 'Rejeitado' },
  ];

  return (
    <AdminLayout
      title="Gerenciar Documentos"
      actions={<span className="text-sm text-muted-foreground">{documents.length} documentos</span>}
    >
      <FilterBar
        searchPlaceholder="Buscar por nome, email ou nome do arquivo..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { options: filterOptions, value: statusFilter, onChange: setStatusFilter },
        ]}
      />

      {loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--gray-50)]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Associado</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Arquivo</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Data Upload</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-t border-[var(--border)]">
                  <td className="px-6 py-4">
                    <div className="font-medium">{doc.usuario?.nome || '-'}</div>
                    <div className="text-sm text-muted-foreground">{doc.usuario?.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">{getTypeLabel(doc.tipo)}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <button
                      onClick={() => window.open(doc.caminho, '_blank')}
                      className="text-secondary hover:underline"
                    >
                      {doc.nomeArquivo}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {doc.criadoEm ? new Date(doc.criadoEm).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="text-secondary hover:underline"
                      >
                        Ver
                      </button>
                      {doc.status === 'PENDENTE' && (
                        <>
                          <button
                            onClick={() => handleApprove(doc.id)}
                            className="text-green-600 hover:underline"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleReject(doc.id)}
                            className="text-red-500 hover:underline"
                          >
                            Rejeitar
                          </button>
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

      {documents.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground">Nenhum documento encontrado.</div>
      )}

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle>Detalhes do Documento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Associado</p>
                <p className="font-medium">{selectedDocument.usuario?.nome || '-'}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{selectedDocument.usuario?.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Tipo</p>
                <p className="font-medium">{getTypeLabel(selectedDocument.tipo)}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Arquivo</p>
                <p className="font-medium">{selectedDocument.nomeArquivo}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Data de Upload</p>
                <p className="font-medium">
                  {selectedDocument.criadoEm ? new Date(selectedDocument.criadoEm).toLocaleString('pt-BR') : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Status</p>
                <StatusBadge status={selectedDocument.status} />
              </div>
              <div className="flex gap-2 pt-4 border-t">
                {selectedDocument.status === 'PENDENTE' && (
                  <>
                    <Button onClick={() => { handleApprove(selectedDocument.id); setSelectedDocument(null); }}>
                      Aprovar
                    </Button>
                    <Button variant="outline" onClick={() => { handleReject(selectedDocument.id); setSelectedDocument(null); }}>
                      Rejeitar
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}

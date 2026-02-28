'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_ENDPOINTS } from '@/lib/api';

interface Associate {
  id: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    status: string;
  };
  cpf: string;
  cidade: string;
  estado: string;
  status: string;
  dataAssociacao: string;
}

export default function AdminAssociatesPage() {
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedAssociate, setSelectedAssociate] = useState<Associate | null>(null);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  useEffect(() => {
    loadAssociates();
  }, [filter, pagination.page]);

  const loadAssociates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        status: filter !== 'ALL' ? filter : '',
        search,
        page: pagination.page.toString(),
        limit: '20',
      });

      const response = await fetch(`${API_ENDPOINTS.associates.list}?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setAssociates(data.data || []);
        if (data.pagination) {
          setPagination(prev => ({ ...prev, total: data.pagination.total, totalPages: data.pagination.totalPages }));
        }
      }
    } catch (error) {
      console.error('Error loading associates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (associateId: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.associates.approve(associateId), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        loadAssociates();
        alert('Associado aprovado com sucesso!');
      } else {
        alert(data.message || 'Erro ao aprovar');
      }
    } catch (error) {
      console.error('Error approving:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (associateId: string) => {
    if (!notes) {
      alert('Por favor, adicione uma justificativa para a rejeição');
      return;
    }
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.associates.reject(associateId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: notes }),
      });
      const data = await response.json();

      if (data.success) {
        loadAssociates();
        setSelectedAssociate(null);
        setNotes('');
        alert('Associado rejeitado');
      } else {
        alert(data.message || 'Erro ao rejeitar');
      }
    } catch (error) {
      console.error('Error rejecting:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateNotes = async (associateId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.associates.updateNotes(associateId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      });
      const data = await response.json();

      if (data.success) {
        alert('Notas atualizadas');
      }
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const handleSendReminder = async (associateId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.associates.sendReminder(associateId), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        alert('Lembrete enviado');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO':
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDENTE':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INATIVO':
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ATIVO':
      case 'ACTIVE':
        return 'Ativo';
      case 'PENDENTE':
      case 'PENDING':
        return 'Pendente';
      case 'INATIVO':
      case 'INACTIVE':
        return 'Inativo';
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Associados</h1>
        <div className="text-sm text-[var(--muted-foreground)]">
          Total: {pagination.total} associados
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Buscar por nome, email ou CPF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
          onKeyDown={(e) => e.key === 'Enter' && loadAssociates()}
        />
        <div className="flex gap-2">
          {['ALL', 'ATIVO', 'PENDENTE', 'INATIVO'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
              size="sm"
            >
              {status === 'ALL' ? 'Todos' : getStatusLabel(status)}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-[var(--gray-50)]">
                      <th className="text-left p-4">Nome</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">CPF</th>
                      <th className="text-left p-4">Cidade</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Data</th>
                      <th className="text-left p-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {associates.map((associate) => (
                      <tr key={associate.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{associate.usuario?.nome}</td>
                        <td className="p-4">{associate.usuario?.email}</td>
                        <td className="p-4">{associate.cpf}</td>
                        <td className="p-4">{associate.cidade || '-'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(associate.status)}`}>
                            {getStatusLabel(associate.status)}
                          </span>
                        </td>
                        <td className="p-4">
                          {associate.dataAssociacao
                            ? new Date(associate.dataAssociacao).toLocaleDateString('pt-BR')
                            : '-'}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAssociate(associate)}
                            >
                              Ver
                            </Button>
                            {associate.status === 'PENDENTE' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(associate.id)}
                                  disabled={actionLoading}
                                >
                                  Aprovar
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setSelectedAssociate(associate)}
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
            </CardContent>
          </Card>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal for details */}
      {selectedAssociate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Detalhes do Associado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Nome</p>
                  <p className="font-medium">{selectedAssociate.usuario?.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Email</p>
                  <p className="font-medium">{selectedAssociate.usuario?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">CPF</p>
                  <p className="font-medium">{selectedAssociate.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Telefone</p>
                  <p className="font-medium">{selectedAssociate.usuario?.telefone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Cidade</p>
                  <p className="font-medium">{selectedAssociate.cidade || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Estado</p>
                  <p className="font-medium">{selectedAssociate.estado || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedAssociate.status)}`}>
                    {getStatusLabel(selectedAssociate.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Data de Associação</p>
                  <p className="font-medium">
                    {selectedAssociate.dataAssociacao
                      ? new Date(selectedAssociate.dataAssociacao).toLocaleDateString('pt-BR')
                      : '-'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-2">Notas Internas</p>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione notas sobre este associado..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleUpdateNotes(selectedAssociate.id)}
                >
                  Salvar Notas
                </Button>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {selectedAssociate.status === 'PENDENTE' && (
                  <>
                    <Button onClick={() => handleApprove(selectedAssociate.id)} disabled={actionLoading}>
                      Aprovar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedAssociate.id)}
                      disabled={actionLoading}
                    >
                      Rejeitar
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleSendReminder(selectedAssociate.id)}
                >
                  Enviar Lembrete
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedAssociate(null);
                    setNotes('');
                  }}
                >
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

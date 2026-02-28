'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { api } from '@/lib/api';

interface Assembly {
  id: string;
  titulo: string;
  tipo: string;
  data: string;
  hora: string;
  local: string;
  descricao: string;
  status: string;
  totalVotos: number;
  candidatos: Candidate[];
}

interface Candidate {
  id: string;
  assembleiaId: string;
  nome: string;
  cargo: string;
  foto: string | null;
  votos: number;
}

export default function AdminAssembliesPage() {
  const { user, mounted: authLoading } = useAdminAuth();
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssembly, setSelectedAssembly] = useState<Assembly | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [newAssembly, setNewAssembly] = useState({
    titulo: '',
    tipo: 'ORDINARIA',
    data: '',
    hora: '',
    local: '',
    descricao: '',
  });
  const [newCandidate, setNewCandidate] = useState({
    nome: '',
    cargo: '',
    foto: '',
  });

  useEffect(() => {
    if (!authLoading && user) {
      fetchAssemblies();
    }
  }, [authLoading, user]);

  const fetchAssemblies = async () => {
    try {
      const response = await api.get('/assemblies');
      if (response.success) {
        setAssemblies(response.assembleias);
      }
    } catch (error) {
      console.error('Error fetching assemblies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADA':
        return 'bg-blue-100 text-blue-800';
      case 'EM_ANDAMENTO':
        return 'bg-green-100 text-green-800';
      case 'ENCERRADA':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AGENDADA':
        return 'Agendada';
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'ENCERRADA':
        return 'Encerrada';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    return type === 'ORDINARIA' ? 'Ordinária' : 'Extraordinária';
  };

  const scheduledCount = assemblies.filter(a => a.status === 'AGENDADA').length;
  const completedCount = assemblies.filter(a => a.status === 'ENCERRADA').length;

  const handleCreateAssembly = async () => {
    if (!newAssembly.titulo || !newAssembly.data) return;

    try {
      const response = await api.post('/assemblies', newAssembly);
      if (response.success) {
        setAssemblies([response.assembleia, ...assemblies]);
        setShowModal(false);
        setNewAssembly({
          titulo: '',
          tipo: 'ORDINARIA',
          data: '',
          hora: '',
          local: '',
          descricao: '',
        });
      }
    } catch (error) {
      console.error('Error creating assembly:', error);
    }
  };

  const handleAddCandidate = async () => {
    if (!selectedAssembly || !newCandidate.nome) return;

    try {
      const response = await api.post(`/assemblies/${selectedAssembly.id}/candidatos`, newCandidate);
      if (response.success) {
        setSelectedAssembly({
          ...selectedAssembly,
          candidatos: [...selectedAssembly.candidatos, response.candidato],
        });
        setAssemblies(assemblies.map(a =>
          a.id === selectedAssembly.id
            ? { ...a, candidatos: [...a.candidatos, response.candidato] }
            : a
        ));
        setShowCandidateModal(false);
        setNewCandidate({ nome: '', cargo: '', foto: '' });
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  };

  const handleStartVoting = async (id: string) => {
    try {
      const response = await api.patch(`/assemblies/${id}/iniciar`);
      if (response.success) {
        fetchAssemblies();
        if (selectedAssembly?.id === id) {
          setSelectedAssembly({ ...selectedAssembly, status: 'EM_ANDAMENTO' });
        }
      }
    } catch (error) {
      console.error('Error starting voting:', error);
    }
  };

  const handleEndVoting = async (id: string) => {
    try {
      const response = await api.patch(`/assemblies/${id}/encerrar`);
      if (response.success) {
        fetchAssemblies();
        if (selectedAssembly?.id === id) {
          setSelectedAssembly({ ...selectedAssembly, status: 'ENCERRADA' });
        }
      }
    } catch (error) {
      console.error('Error ending voting:', error);
    }
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!selectedAssembly) return;
    if (!confirm('Tem certeza que deseja remover este candidato?')) return;

    try {
      const response = await api.delete(`/assemblies/candidatos/${candidateId}`);
      if (response.success) {
        setSelectedAssembly({
          ...selectedAssembly,
          candidatos: selectedAssembly.candidatos.filter(c => c.id !== candidateId),
        });
        setAssemblies(assemblies.map(a =>
          a.id === selectedAssembly.id
            ? { ...a, candidatos: a.candidatos.filter(c => c.id !== candidateId) }
            : a
        ));
      }
    } catch (error) {
      console.error('Error removing candidate:', error);
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[var(--gray-50)] min-h-screen">
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
                {assemblies.reduce((acc, a) => acc + a.totalVotos, 0)}
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
                    <CardTitle className="text-lg">{assembly.titulo}</CardTitle>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      {getTypeLabel(assembly.tipo)}
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
                  <span>{new Date(assembly.data).toLocaleDateString('pt-BR')}</span>
                  <span>às</span>
                  <span>{assembly.hora}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>📍</span>
                  <span>{assembly.local}</span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">{assembly.descricao}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium">
                    {assembly.totalVotos > 0 ? `${assembly.totalVotos} votos` : `${assembly.candidatos?.length || 0} candidatos`}
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
                  <p className="font-medium">{selectedAssembly.titulo}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Tipo</p>
                  <p className="font-medium">{getTypeLabel(selectedAssembly.tipo)}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Data e Hora</p>
                  <p className="font-medium">
                    {new Date(selectedAssembly.data).toLocaleDateString('pt-BR')} às {selectedAssembly.hora}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Local</p>
                  <p className="font-medium">{selectedAssembly.local}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Descrição</p>
                  <p className="font-medium">{selectedAssembly.descricao}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedAssembly.status)}`}>
                    {getStatusLabel(selectedAssembly.status)}
                  </span>
                </div>

                {/* Candidates */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-medium">Candidatos/Opções de Voto</p>
                    {selectedAssembly.status === 'AGENDADA' && (
                      <Button size="sm" onClick={() => setShowCandidateModal(true)}>
                        + Adicionar
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {selectedAssembly.candidatos?.map((candidate) => (
                      <div key={candidate.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{candidate.nome}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{candidate.cargo}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="font-bold text-lg">{candidate.votos}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">votos</p>
                          </div>
                          {selectedAssembly.status === 'AGENDADA' && (
                            <button
                              onClick={() => handleDeleteCandidate(candidate.id)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!selectedAssembly.candidatos || selectedAssembly.candidatos.length === 0) && (
                      <p className="text-sm text-[var(--muted-foreground)]">Nenhum candidato cadastrado</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {selectedAssembly.status === 'AGENDADA' && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleStartVoting(selectedAssembly.id)}>
                      Iniciar Votação
                    </Button>
                  )}
                  {selectedAssembly.status === 'EM_ANDAMENTO' && (
                    <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => handleEndVoting(selectedAssembly.id)}>
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
                    value={newAssembly.titulo}
                    onChange={(e) => setNewAssembly({ ...newAssembly, titulo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <select
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    value={newAssembly.tipo}
                    onChange={(e) => setNewAssembly({ ...newAssembly, tipo: e.target.value })}
                  >
                    <option value="ORDINARIA">Ordinária</option>
                    <option value="EXTRAORDINARIA">Extraordinária</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Data</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                      value={newAssembly.data}
                      onChange={(e) => setNewAssembly({ ...newAssembly, data: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hora</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                      value={newAssembly.hora}
                      onChange={(e) => setNewAssembly({ ...newAssembly, hora: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Local</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="Local da assembleia"
                    value={newAssembly.local}
                    onChange={(e) => setNewAssembly({ ...newAssembly, local: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    rows={3}
                    placeholder="Descrição da assembleia..."
                    value={newAssembly.descricao}
                    onChange={(e) => setNewAssembly({ ...newAssembly, descricao: e.target.value })}
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
                  <Button className="flex-1" onClick={handleCreateAssembly}>
                    Criar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal for new candidate */}
        {showCandidateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md m-4">
              <CardHeader>
                <CardTitle>Adicionar Candidato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="Nome do candidato"
                    value={newCandidate.nome}
                    onChange={(e) => setNewCandidate({ ...newCandidate, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cargo</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="Ex: Presidente, Vice-Presidente"
                    value={newCandidate.cargo}
                    onChange={(e) => setNewCandidate({ ...newCandidate, cargo: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCandidateModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={handleAddCandidate}>
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { useAdminAuth, useDebounce } from '@/hooks';
import { AdminLayout, FilterBar } from '@/components/admin';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Topic {
  id: string;
  titulo: string;
  conteudo: string;
  autor: string;
  categoria: string;
  fixado: boolean;
  fechado: boolean;
  visualizacoes: number;
  criadoEm: string;
  _count?: { respostas: number };
}

export default function AdminForumPage() {
  useAdminAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.forum.list, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTopics(data.topicos || data.data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async (topic: Topic) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.forum.update(topic.id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fixado: !topic.fixado }),
      });
      const data = await res.json();
      if (data.success) fetchTopics();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleToggleLock = async (topic: Topic) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.forum.update(topic.id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fechado: !topic.fechado }),
      });
      const data = await res.json();
      if (data.success) fetchTopics();
    } catch (error) {
      console.error('Error toggling lock:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.forum.delete(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const filteredTopics = topics.filter((t) => {
    const matchesSearch = t.titulo.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      t.autor?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filterOptions = [
    { value: 'all', label: 'Todas as categorias' },
    { value: 'Geral', label: 'Geral' },
    { value: 'Benefícios', label: 'Benefícios' },
    { value: 'Eventos', label: 'Eventos' },
    { value: 'Dúvidas', label: 'Dúvidas' },
    { value: 'Sugestões', label: 'Sugestões' },
  ];

  return (
    <AdminLayout
      title="Gerenciar Fórum"
      actions={<span className="text-sm text-muted-foreground">{filteredTopics.length} tópicos</span>}
    >
      <FilterBar
        searchPlaceholder="Buscar tópicos..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { options: filterOptions, value: categoryFilter, onChange: setCategoryFilter },
        ]}
      />

      {loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--gray-50)]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Título</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Autor</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Categoria</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Respostas</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Visualizações</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic) => (
                <tr key={topic.id} className="border-t border-[var(--border)]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {topic.fixado && <span className="text-yellow-500" title="Fixado">📌</span>}
                      {topic.fechado && <span className="text-red-500" title="Fechado">🔒</span>}
                      <span className="font-medium">{topic.titulo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{topic.autor || '-'}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{topic.categoria}</span></td>
                  <td className="px-6 py-4">{topic._count?.respostas || 0}</td>
                  <td className="px-6 py-4">{topic.visualizacoes || 0}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={topic.fechado ? 'FECHADO' : 'ATIVO'} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedTopic(topic)} className="text-secondary hover:underline">Ver</button>
                      <button onClick={() => handleTogglePin(topic)} className="text-yellow-600 hover:underline">
                        {topic.fixado ? 'Desfixar' : 'Fixar'}
                      </button>
                      <button onClick={() => handleToggleLock(topic)} className="text-orange-600 hover:underline">
                        {topic.fechado ? 'Abrir' : 'Fechar'}
                      </button>
                      <button onClick={() => handleDelete(topic.id)} className="text-red-500 hover:underline">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredTopics.length === 0 && !loading && <div className="text-center py-12 text-muted-foreground">Nenhum tópico encontrado.</div>}

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{selectedTopic.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Autor</p>
                <p className="font-medium">{selectedTopic.autor || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Categoria</p>
                <p className="font-medium">{selectedTopic.categoria}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Conteúdo</p>
                <p className="font-medium">{selectedTopic.conteudo || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Data de Criação</p>
                <p className="font-medium">
                  {selectedTopic.criadoEm ? new Date(selectedTopic.criadoEm).toLocaleDateString('pt-BR') : '-'}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => setSelectedTopic(null)}>Fechar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}

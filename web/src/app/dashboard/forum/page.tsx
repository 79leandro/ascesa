'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_ROUTES, api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

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
  atualizadoEm: string;
  respostas?: Reply[];
  _count?: { respostas: number };
}

interface Reply {
  id: string;
  topicoId: string;
  conteudo: string;
  autor: string;
  usuarioId?: string;
  criadoEm: string;
}

export default function ForumPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('Geral');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    } else if (isAuthenticated) {
      fetchTopics();
    }
  }, [isLoading, isAuthenticated, router]);

  const fetchTopics = async () => {
    try {
      const response = await api.get('/forum');
      if (response.success) {
        setTopics(response.topicos);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Geral', 'Benefícios', 'Finanças', 'Eventos', 'Dúvidas', 'Sugestões'];

  const handleCreateTopic = async () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;

    try {
      const response = await api.post('/forum', {
        titulo: newTopicTitle,
        conteudo: newTopicContent,
        categoria: newTopicCategory,
      });
      if (response.success) {
        setTopics([response.topico, ...topics]);
        setShowNewTopic(false);
        setNewTopicTitle('');
        setNewTopicContent('');
      }
    } catch (error) {
      console.error('Error creating topic:', error);
    }
  };

  const handleSendReply = async () => {
    if (!newReply.trim() || !selectedTopic) return;

    try {
      const response = await api.post(`/forum/${selectedTopic.id}/respostas`, {
        conteudo: newReply,
      });
      if (response.success) {
        setReplies([...replies, response.resposta]);
        setTopics(topics.map(t =>
          t.id === selectedTopic.id
            ? { ...t, _count: { respostas: (t._count?.respostas || 0) + 1 } }
            : t
        ));
        setNewReply('');
        // Recarregar tópico completo
        fetchTopicDetail(selectedTopic.id);
      }
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  const fetchTopicDetail = async (topicId: string) => {
    try {
      const response = await api.get(`/forum/${topicId}`);
      if (response.success) {
        setSelectedTopic(response.topico);
        setReplies(response.topico.respostas || []);
      }
    } catch (error) {
      console.error('Error fetching topic detail:', error);
    }
  };

  const selectTopic = (topic: Topic) => {
    fetchTopicDetail(topic.id);
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este tópico?')) return;

    try {
      const response = await api.delete(`/forum/${id}`);
      if (response.success) {
        setTopics(topics.filter(t => t.id !== id));
        if (selectedTopic?.id === id) {
          setSelectedTopic(null);
        }
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'DIRECTOR';

  if (isLoading || loading || !user) {
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
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Fórum da Comunidade</h1>
          <p className="text-[var(--muted-foreground)]">Conecte-se com outros associados</p>
        </div>
        <button
          onClick={() => setShowNewTopic(true)}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-light)]"
        >
          + Novo Tópico
        </button>
      </div>

      {/* Topics List */}
      {!selectedTopic && !showNewTopic && (
        <div className="space-y-4">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                topic.fixado ? 'border-l-4 border-l-[var(--primary)]' : ''
              }`}
              onClick={() => !topic.fechado && selectTopic(topic)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {topic.fixado && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          📌 Fixado
                        </span>
                      )}
                      {topic.fechado && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          🔒 Fechado
                        </span>
                      )}
                      <span className="bg-[var(--gray-100)] text-[var(--foreground)] text-xs px-2 py-1 rounded">
                        {topic.categoria}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">{topic.titulo}</h3>
                    <p className="text-[var(--muted-foreground)] text-sm mt-1 line-clamp-2">
                      {topic.conteudo}
                    </p>
                  </div>
                  <div className="text-right text-sm text-[var(--muted-foreground)]">
                    <p>{topic._count?.respostas || 0} respostas</p>
                    <p>{topic.visualizacoes} visualizações</p>
                    <p className="mt-2">{new Date(topic.criadoEm).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-[var(--muted-foreground)]">
                  Por <span className="font-medium">{topic.autor}</span>
                  {(topic.autor === user.name || isAdmin) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTopic(topic.id);
                      }}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {topics.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-[var(--muted-foreground)]">Nenhum tópico encontrado.</p>
                <button
                  onClick={() => setShowNewTopic(true)}
                  className="mt-4 text-[var(--primary)] hover:underline"
                >
                  Criar primeiro tópico
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Topic Detail */}
      {selectedTopic && (
        <div>
          <button
            onClick={() => setSelectedTopic(null)}
            className="mb-4 text-[var(--primary)] hover:underline"
          >
            ← Voltar aos tópicos
          </button>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[var(--gray-100)] text-[var(--foreground)] text-xs px-2 py-1 rounded">
                  {selectedTopic.categoria}
                </span>
              </div>
              <CardTitle>{selectedTopic.titulo}</CardTitle>
              <p className="text-sm text-[var(--muted-foreground)]">
                Por {selectedTopic.autor} • {new Date(selectedTopic.criadoEm).toLocaleDateString('pt-BR')}
              </p>
            </CardHeader>
            <CardContent>
              <p>{selectedTopic.conteudo}</p>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="space-y-4 mb-6">
            {replies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {reply.autor}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {new Date(reply.criadoEm).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3">{reply.conteudo}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* New Reply */}
          {!selectedTopic.fechado && (
            <div className="flex gap-4">
              <textarea
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg"
                rows={3}
                placeholder="Escreva sua resposta..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
              />
              <button
                onClick={handleSendReply}
                className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--primary-light)] self-end"
              >
                Enviar
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Topic Modal */}
      {showNewTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg m-4">
            <CardHeader>
              <CardTitle>Criar Novo Tópico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  placeholder="Título do tópico"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  value={newTopicCategory}
                  onChange={(e) => setNewTopicCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Conteúdo</label>
                <textarea
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  rows={5}
                  placeholder="Escreva o conteúdo do tópico..."
                  value={newTopicContent}
                  onChange={(e) => setNewTopicContent(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewTopic(false)}
                  className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateTopic}
                  className="flex-1 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-light)]"
                >
                  Criar
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

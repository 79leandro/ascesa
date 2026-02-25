'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_ROUTES } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Topic {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  lastReply: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
}

interface Reply {
  id: string;
  topicId: string;
  content: string;
  author: string;
  createdAt: string;
  isAdmin: boolean;
}

export default function ForumPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: '1',
      title: 'Dúvidas sobre benefícios',
      content: 'Alguém sabe como utilizar os benefícios de farmácia?',
      author: 'João Silva',
      category: 'Benefícios',
      replies: 12,
      views: 234,
      lastReply: '2026-02-25',
      isPinned: true,
      isLocked: false,
      createdAt: '2026-02-20',
    },
    {
      id: '2',
      title: 'Reunião de associado - Fevereiro',
      content: 'Vamos discutir as próximas ações da associação',
      author: 'Maria Santos',
      category: 'Eventos',
      replies: 8,
      views: 156,
      lastReply: '2026-02-24',
      isPinned: false,
      isLocked: false,
      createdAt: '2026-02-22',
    },
    {
      id: '3',
      title: 'Dicas de economia',
      content: 'Compartilhe suas dicas de economia aqui',
      author: 'Pedro Oliveira',
      category: 'Finanças',
      replies: 25,
      views: 456,
      lastReply: '2026-02-25',
      isPinned: false,
      isLocked: false,
      createdAt: '2026-02-15',
    },
    {
      id: '4',
      title: 'Novo convênio de saúde',
      content: 'O que acham do novo convênio?',
      author: 'Ana Costa',
      category: 'Benefícios',
      replies: 0,
      views: 89,
      lastReply: '2026-02-23',
      isPinned: false,
      isLocked: false,
      createdAt: '2026-02-23',
    },
  ]);
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
    }
  }, [isLoading, isAuthenticated, router]);

  const categories = ['Geral', 'Benefícios', 'Finanças', 'Eventos', 'Dúvidas', 'Sugestões'];

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;

    const topic: Topic = {
      id: Date.now().toString(),
      title: newTopicTitle,
      content: newTopicContent,
      author: user?.name || 'Você',
      category: newTopicCategory,
      replies: 0,
      views: 0,
      lastReply: new Date().toISOString().split('T')[0],
      isPinned: false,
      isLocked: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTopics([topic, ...topics]);
    setShowNewTopic(false);
    setNewTopicTitle('');
    setNewTopicContent('');
  };

  const handleSendReply = () => {
    if (!newReply.trim() || !selectedTopic) return;

    const reply: Reply = {
      id: Date.now().toString(),
      topicId: selectedTopic.id,
      content: newReply,
      author: user?.name || 'Você',
      createdAt: new Date().toISOString(),
      isAdmin: user?.role === 'ADMIN' || user?.role === 'DIRECTOR',
    };

    setReplies([...replies, reply]);
    setTopics(topics.map(t =>
      t.id === selectedTopic.id
        ? { ...t, replies: t.replies + 1, lastReply: new Date().toISOString().split('T')[0] }
        : t
    ));
    setNewReply('');
  };

  const selectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setReplies([
      {
        id: '1',
        topicId: topic.id,
        content: 'Olá! Fico feliz que tenha perguntado. Posso ajudar com isso.',
        author: 'Maria Santos',
        createdAt: '2026-02-21T10:00:00Z',
        isAdmin: false,
      },
    ]);
  };

  if (isLoading || !user) {
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

      {/* Categories */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            className="px-3 py-1 bg-[var(--gray-100)] rounded-full text-sm hover:bg-[var(--gray-200)]"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Topics List */}
      {!selectedTopic && !showNewTopic && (
        <div className="space-y-4">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                topic.isPinned ? 'border-l-4 border-l-[var(--primary)]' : ''
              }`}
              onClick={() => !topic.isLocked && selectTopic(topic)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {topic.isPinned && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          📌 Fixado
                        </span>
                      )}
                      {topic.isLocked && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          🔒 Fechado
                        </span>
                      )}
                      <span className="bg-[var(--gray-100)] text-[var(--foreground)] text-xs px-2 py-1 rounded">
                        {topic.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">{topic.title}</h3>
                    <p className="text-[var(--muted-foreground)] text-sm mt-1 line-clamp-2">
                      {topic.content}
                    </p>
                  </div>
                  <div className="text-right text-sm text-[var(--muted-foreground)]">
                    <p>{topic.replies} respostas</p>
                    <p>{topic.views} visualizações</p>
                    <p className="mt-2">{topic.lastReply}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-[var(--muted-foreground)]">
                  Por <span className="font-medium">{topic.author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
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
                  {selectedTopic.category}
                </span>
              </div>
              <CardTitle>{selectedTopic.title}</CardTitle>
              <p className="text-sm text-[var(--muted-foreground)]">
                Por {selectedTopic.author} • {selectedTopic.createdAt}
              </p>
            </CardHeader>
            <CardContent>
              <p>{selectedTopic.content}</p>
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
                        {reply.author}
                        {reply.isAdmin && (
                          <span className="ml-2 bg-[var(--primary)] text-white text-xs px-2 py-1 rounded">
                            Admin
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {new Date(reply.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3">{reply.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* New Reply */}
          {!selectedTopic.isLocked && (
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

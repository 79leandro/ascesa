'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { APP_ROUTES, api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Event {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  local: string;
  categoria: string;
  online: boolean;
  preco: number;
  vagas: number;
  imagem?: string;
  ativo: boolean;
  inscricoes?: Registration[];
}

interface Registration {
  id: string;
  eventoId: string;
  usuarioId: string;
  nome: string;
  email: string;
  criadoEm: string;
}

export default function EventsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    } else if (isAuthenticated) {
      fetchEvents();
    }
  }, [isLoading, isAuthenticated, router]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      if (response.success) {
        setEvents(response.eventos);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Assembleia: 'bg-purple-100 text-purple-800',
      Workshop: 'bg-blue-100 text-blue-800',
      Palestra: 'bg-green-100 text-green-800',
      Social: 'bg-orange-100 text-orange-800',
      Webinar: 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleRegister = async (eventId: string) => {
    try {
      const response = await api.post(`/events/${eventId}/inscrever`);
      if (response.success) {
        // Recarregar eventos
        fetchEvents();
        setSelectedEvent(null);
      } else {
        alert(response.message || 'Erro ao se inscrever');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Erro ao se inscrever');
    }
  };

  const handleCancel = async (eventId: string) => {
    try {
      const response = await api.delete(`/events/${eventId}/cancelar`);
      if (response.success) {
        fetchEvents();
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error cancelling:', error);
    }
  };

  const isRegistered = (event: Event) => {
    return event.inscricoes?.some(i => i.usuarioId === user?.id) || false;
  };

  const getRegisteredCount = (event: Event) => {
    return event.inscricoes?.length || 0;
  };

  const filteredEvents = events.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'registered') return isRegistered(e);
    if (filter === 'online') return e.online;
    if (filter === 'free') return e.preco === 0;
    return e.categoria === filter;
  });

  const upcomingEvents = events.filter(e => new Date(e.data) >= new Date());
  const registeredCount = events.filter(e => isRegistered(e)).length;

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
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Calendário de Eventos</h1>
      <p className="text-[var(--muted-foreground)] mb-8">Participe dos eventos da associação</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-[var(--primary)]">{upcomingEvents.length}</p>
            <p className="text-[var(--muted-foreground)]">Próximos Eventos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{registeredCount}</p>
            <p className="text-[var(--muted-foreground)]">Inscrições Ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-[var(--secondary)]">
              {events.filter(e => e.online).length}
            </p>
            <p className="text-[var(--muted-foreground)]">Eventos Online</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'registered', label: 'Inscritos' },
          { id: 'online', label: 'Online' },
          { id: 'free', label: 'Gratuitos' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg ${
              filter === f.id
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--gray-100)] hover:bg-[var(--gray-200)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <div className="h-32 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-t-lg flex items-center justify-center">
              <span className="text-4xl">📅</span>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(event.categoria)}`}>
                  {event.categoria}
                </span>
                {event.online && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Online
                  </span>
                )}
              </div>
              <CardTitle className="text-lg mt-2">{event.titulo}</CardTitle>
              <CardDescription className="line-clamp-2">{event.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{new Date(event.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>{event.horaInicio} - {event.horaFim}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{event.local}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-[var(--muted-foreground)]">
                  {getRegisteredCount(event)}/{event.vagas} vagas
                </span>
                <span className="font-bold text-[var(--primary)]">
                  {event.preco === 0 ? 'Grátis' : `R$ ${event.preco.toFixed(2)}`}
                </span>
              </div>
              {isRegistered(event) ? (
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  ✓ Inscrito
                </button>
              ) : (
                <button
                  onClick={() => setSelectedEvent(event)}
                  disabled={getRegisteredCount(event) >= event.vagas}
                  className="w-full bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-[var(--primary-light)] disabled:bg-gray-300"
                >
                  {getRegisteredCount(event) >= event.vagas ? 'Esgotado' : 'Inscrever-se'}
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-[var(--muted-foreground)]">Nenhum evento encontrado.</p>
          </CardContent>
        </Card>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{selectedEvent.titulo}</CardTitle>
              <CardDescription>{selectedEvent.descricao}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Data</p>
                  <p className="font-medium">{new Date(selectedEvent.data).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Horário</p>
                  <p className="font-medium">{selectedEvent.horaInicio} - {selectedEvent.horaFim}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Local</p>
                  <p className="font-medium">{selectedEvent.local}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Categoria</p>
                  <p className="font-medium">{selectedEvent.categoria}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Vagas</p>
                <p className="font-medium">{getRegisteredCount(selectedEvent)}/{selectedEvent.vagas} inscritos</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Valor</p>
                <p className="font-medium text-xl text-[var(--primary)]">
                  {selectedEvent.preco === 0 ? 'Grátis' : `R$ ${selectedEvent.preco.toFixed(2)}`}
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                {isRegistered(selectedEvent) ? (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => handleCancel(selectedEvent.id)}
                    >
                      Cancelar Inscrição
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedEvent(null)}
                    >
                      Fechar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => handleRegister(selectedEvent.id)}
                      disabled={getRegisteredCount(selectedEvent) >= selectedEvent.vagas}
                    >
                      {getRegisteredCount(selectedEvent) >= selectedEvent.vagas ? 'Esgotado' : 'Confirmar Inscrição'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedEvent(null)}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

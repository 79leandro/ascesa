'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  category: string;
  isOnline: boolean;
  price: number;
  spots: number;
  enrolled: number;
  image: string;
  isRegistered: boolean;
}

export default function EventsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Assembleia Geral Ordinária 2026',
      description: 'Apresentação do relatório anual e prestação de contas',
      date: '2026-03-15',
      time: '10:00',
      endTime: '12:00',
      location: 'Sede da ASCESA',
      category: 'Assembleia',
      isOnline: false,
      price: 0,
      spots: 100,
      enrolled: 45,
      image: '',
      isRegistered: false,
    },
    {
      id: '2',
      title: 'Workshop: Educação Financeira',
      description: 'Aprenda a organizar suas finanças pessoais',
      date: '2026-03-20',
      time: '14:00',
      endTime: '17:00',
      location: 'Online',
      category: 'Workshop',
      isOnline: true,
      price: 0,
      spots: 50,
      enrolled: 32,
      image: '',
      isRegistered: false,
    },
    {
      id: '3',
      title: 'Palestra: Benefícios do Associado',
      description: 'Conheça todos os benefícios disponíveis para você',
      date: '2026-03-25',
      time: '19:00',
      endTime: '21:00',
      location: 'Auditório Principal',
      category: 'Palestra',
      isOnline: false,
      price: 0,
      spots: 80,
      enrolled: 67,
      image: '',
      isRegistered: true,
    },
    {
      id: '4',
      title: 'Churrasco de Confraternização',
      description: 'Evento de integração entre associados',
      date: '2026-04-10',
      time: '12:00',
      endTime: '18:00',
      location: 'Clube dos Associados',
      category: 'Social',
      isOnline: false,
      price: 50,
      spots: 150,
      enrolled: 89,
      image: '',
      isRegistered: false,
    },
    {
      id: '5',
      title: 'Webinar: Investimentos 2026',
      description: 'Tendências de investimentos para o ano',
      date: '2026-04-05',
      time: '20:00',
      endTime: '21:30',
      location: 'Online',
      category: 'Webinar',
      isOnline: true,
      price: 0,
      spots: 200,
      enrolled: 123,
      image: '',
      isRegistered: false,
    },
  ]);
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

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

  const handleRegister = (eventId: string) => {
    setEvents(events.map(e =>
      e.id === eventId
        ? { ...e, isRegistered: true, enrolled: e.enrolled + 1 }
        : e
    ));
    setSelectedEvent(null);
  };

  const handleCancel = (eventId: string) => {
    setEvents(events.map(e =>
      e.id === eventId
        ? { ...e, isRegistered: false, enrolled: e.enrolled - 1 }
        : e
    ));
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'registered') return e.isRegistered;
    if (filter === 'online') return e.isOnline;
    if (filter === 'free') return e.price === 0;
    return e.category === filter;
  });

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
  const registeredCount = events.filter(e => e.isRegistered).length;

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
              {events.filter(e => e.isOnline).length}
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
          { id: 'free', label: 'Gruitos' },
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
                <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
                {event.isOnline && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Online
                  </span>
                )}
              </div>
              <CardTitle className="text-lg mt-2">{event.title}</CardTitle>
              <CardDescription className="line-clamp-2">{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>{event.time} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-[var(--muted-foreground)]">
                  {event.enrolled}/{event.spots} vagas
                </span>
                <span className="font-bold text-[var(--primary)]">
                  {event.price === 0 ? 'Grátis' : `R$ ${event.price.toFixed(2)}`}
                </span>
              </div>
              {event.isRegistered ? (
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  ✓ Inscrito
                </button>
              ) : (
                <button
                  onClick={() => setSelectedEvent(event)}
                  disabled={event.enrolled >= event.spots}
                  className="w-full bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-[var(--primary-light)] disabled:bg-gray-300"
                >
                  {event.enrolled >= event.spots ? 'Esgotado' : 'Inscrever-se'}
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
              <CardTitle>{selectedEvent.title}</CardTitle>
              <CardDescription>{selectedEvent.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Data</p>
                  <p className="font-medium">{new Date(selectedEvent.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Horário</p>
                  <p className="font-medium">{selectedEvent.time} - {selectedEvent.endTime}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Local</p>
                  <p className="font-medium">{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Categoria</p>
                  <p className="font-medium">{selectedEvent.category}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Vagas</p>
                <p className="font-medium">{selectedEvent.enrolled}/{selectedEvent.spots} inscritos</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Valor</p>
                <p className="font-medium text-xl text-[var(--primary)]">
                  {selectedEvent.price === 0 ? 'Grátis' : `R$ ${selectedEvent.price.toFixed(2)}`}
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                {selectedEvent.isRegistered ? (
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
                      disabled={selectedEvent.enrolled >= selectedEvent.spots}
                    >
                      {selectedEvent.enrolled >= selectedEvent.spots ? 'Esgotado' : 'Confirmar Inscrição'}
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

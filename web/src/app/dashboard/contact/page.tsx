'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { APP_ROUTES } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  from: 'user' | 'admin';
  content: string;
  date: string;
}

export default function ContactPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'admin',
      content: 'Bem-vindo à ASCESA! Estamos sempre disponíveis para atender suas necessidades.',
      date: '2026-02-15T10:00:00Z',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);

    // Simulate sending
    const message: Message = {
      id: Date.now().toString(),
      from: 'user',
      content: newMessage,
      date: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate auto-response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        from: 'admin',
        content: 'Recebemos sua mensagem! Nossa equipe entrará em contato em breve.',
        date: new Date().toISOString(),
      };
      setMessages(prev => [...prev, response]);
    }, 1000);

    setSending(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Fale Conosco
        </h1>

        {/* Informações de contato */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">📧</div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-[var(--muted-foreground)]">contato@ascesa.com.br</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">📞</div>
              <p className="font-medium">Telefone</p>
              <p className="text-sm text-[var(--muted-foreground)]">(31) 3200-0000</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">🏢</div>
              <p className="font-medium">Atendimento</p>
              <p className="text-sm text-[var(--muted-foreground)]">Seg a Sex, 8h às 18h</p>
            </CardContent>
          </Card>
        </div>

        {/* Chat de mensagens */}
        <Card>
          <CardHeader>
            <CardTitle>Mensagens</CardTitle>
            <CardDescription>
              Tire suas dúvidas diretamente com nossa equipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Lista de mensagens */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-lg ${
                      message.from === 'user'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-gray-100 text-[var(--foreground)]'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-2 ${message.from === 'user' ? 'text-white/70' : 'text-[var(--muted-foreground)]'}`}>
                      {formatDate(message.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de nova mensagem */}
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={sending}
              />
              <Button onClick={handleSend} disabled={sending || !newMessage.trim()}>
                {sending ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

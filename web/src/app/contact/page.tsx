'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso!');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-[var(--foreground)] mb-4">
        Fale Conosco
      </h1>
      <p className="text-center text-[var(--muted-foreground)] mb-12">
        Estamos prontos para atendê-lo. Entre em contato conosco.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Informações de Contato */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[var(--foreground)]">
            Informações de Contato
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-[var(--foreground)] mb-2">Endereço</h3>
              <p className="text-[var(--muted-foreground)]">
                Av. João Pessoa, 1350 - Belo Horizonte, MG
              </p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--foreground)] mb-2">Telefone</h3>
              <p className="text-[var(--muted-foreground)]">
                (31) 3200-0000
              </p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--foreground)] mb-2">Email</h3>
              <p className="text-[var(--muted-foreground)]">
                contato@ascesa.com.br
              </p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--foreground)] mb-2">Horário de Atendimento</h3>
              <p className="text-[var(--muted-foreground)]">
                Segunda a sexta-feira: 8h às 18h
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[var(--foreground)]">
            Envie uma Mensagem
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com.br"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Assunto"
              placeholder="Sobre o que você quer falar?"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Mensagem
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)] outline-none transition-colors min-h-[120px]"
                placeholder="Digite sua mensagem..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar Mensagem
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

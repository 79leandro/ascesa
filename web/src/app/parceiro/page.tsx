'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ParceiroPage() {
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    cnpj: '',
    nomeContato: '',
    email: '',
    telefone: '',
    segmento: '',
    mensagem: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Em breve entraremos em contato!');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-[var(--foreground)] mb-4">
        Seja um Parceiro
      </h1>
      <p className="text-center text-[var(--muted-foreground)] mb-12 max-w-2xl mx-auto">
        Torne-se um parceiro da ASCESA e ofereça vantagens exclusivas aos nossos associados
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Benefícios para o parceiro */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[var(--foreground)]">
            Benefícios de Ser Parceiro
          </h2>
          <ul className="space-y-4">
            {[
              'Acesso a uma base de mais de 1.000 associados',
              'Divulgação da sua marca no site e materiais da ASCESA',
              'Aumento da clientela qualificada',
              'Parceria com uma instituição consolidada no mercado',
              'Suporte dedicado da equipe ASCESA',
            ].map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-[var(--secondary)] mr-3 text-xl">✓</span>
                <span className="text-[var(--muted-foreground)]">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 p-6 bg-[var(--gray-50)] rounded-xl">
            <h3 className="font-semibold text-[var(--foreground)] mb-2">
              Nossos Números
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-[var(--secondary)]">1000+</div>
                <div className="text-sm text-[var(--muted-foreground)]">Associados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--secondary)]">50+</div>
                <div className="text-sm text-[var(--muted-foreground)]">Parceiros</div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[var(--foreground)]">
            Quero Ser Parceiro
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome da Empresa"
              placeholder="Nome da sua empresa"
              value={formData.nomeEmpresa}
              onChange={(e) => setFormData({ ...formData, nomeEmpresa: e.target.value })}
              required
            />
            <Input
              label="CNPJ"
              placeholder="00.000.000/0001-00"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              required
            />
            <Input
              label="Nome do Contato"
              placeholder="Pessoa responsável"
              value={formData.nomeContato}
              onChange={(e) => setFormData({ ...formData, nomeContato: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com.br"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Telefone"
                placeholder="(61) 99999-9999"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                required
              />
            </div>
            <Input
              label="Segmento"
              placeholder="Ex: Educação, Saúde, Lazer..."
              value={formData.segmento}
              onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Mensagem
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)] outline-none transition-colors min-h-[100px]"
                placeholder="Conte-nos um pouco sobre sua empresa e os benefícios que oferece..."
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar Proposta
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

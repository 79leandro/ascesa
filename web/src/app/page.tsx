'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[var(--primary)] py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Credificando benefícios para você e sua família
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl">
                A ASCESA oferece vantagens exclusivas para servidores do Sicoob.
                Venha fazer parte da nossa comunidade e aproveitar os benefícios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <Button size="lg" variant="secondary">
                    Associe-se Agora
                  </Button>
                </Link>
                <Link href="/benefits">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary)]">
                    Ver Benefícios
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">50+</div>
                    <div className="text-white/70">Convênios</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">1000+</div>
                    <div className="text-white/70">Associados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">30%</div>
                    <div className="text-white/70">Desconto Médio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">24h</div>
                    <div className="text-white/70">Atendimento</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios em Destaque */}
      <section className="py-16 bg-[var(--gray-50)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-4">
            Nossos Benefícios
          </h2>
          <p className="text-center text-[var(--muted-foreground)] mb-12 max-w-2xl mx-auto">
            Descubra as vantagens exclusivas que a ASCESA oferece aos seus associados
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Descontos em Farmácias',
                description: 'Até 30% de desconto em medicamentos e produtos de saúde',
                icon: '💊',
              },
              {
                title: 'Assistência Funeral',
                description: 'Cobertura completa para você e sua família',
                icon: '🏠',
              },
              {
                title: 'Descontos em Educação',
                description: 'Faculdades, escolas e cursos com condições especiais',
                icon: '🎓',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">
                  {benefit.title}
                </h3>
                <p className="text-[var(--muted-foreground)]">{benefit.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/benefits">
              <Button variant="outline">Ver Todos os Benefícios</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-12">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Faça seu Cadastro',
                description: 'Preencha o formulário de associação online',
              },
              {
                step: '2',
                title: 'Aguarde Aprovação',
                description: 'Nossa equipe analisará sua solicitação',
              },
              {
                step: '3',
                title: 'Aprove os Benefícios',
                description: 'Comece a usar os convênios imediatamente',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="text-[var(--muted-foreground)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--primary)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ainda não é associado?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Junte-se a milhares de servidores do Sicoob que já aproveitam nossas vantagens
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Quero me Associar
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

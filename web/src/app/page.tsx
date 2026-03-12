'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Pill,
  GraduationCap,
  Home,
  Users,
  TrendingDown,
  Clock,
  ChevronDown,
  Heart,
  Shield,
  Star
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pattern-geometric overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-[var(--primary-dark)] to-[#0a290d]"></div>

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--secondary)]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 relative z-10 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in-up">
                <Star className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-white/90 text-sm font-medium">Associe-se agora e Ganhe Descontos Exclusivos</span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                Credificando benefícios para você e sua{' '}
                <span className="text-gradient-white">família</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
                A ASCESA oferece vantagens exclusivas para servidores do Sicoob.
                Venha fazer parte da nossa comunidade e aproveitar os benefícios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="btn-shine">
                    Associe-se Agora
                  </Button>
                </Link>
                <Link href="/benefits">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-[var(--primary)] backdrop-blur-sm"
                  >
                    Ver Benefícios
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex-1 flex justify-center">
              <div className="glass-card p-8 rounded-2xl animate-fade-in-up stagger-2">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center hover-lift cursor-default">
                    <div className="icon-bg mb-3 mx-auto">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-[var(--primary)] mb-1">50+</div>
                    <div className="text-[var(--muted-foreground)] text-sm">Convênios</div>
                  </div>
                  <div className="text-center hover-lift cursor-default">
                    <div className="icon-bg-light mb-3 mx-auto">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-[var(--primary)] mb-1">1000+</div>
                    <div className="text-[var(--muted-foreground)] text-sm">Associados</div>
                  </div>
                  <div className="text-center hover-lift cursor-default">
                    <div className="icon-bg-accent mb-3 mx-auto">
                      <TrendingDown className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-[var(--primary)] mb-1">30%</div>
                    <div className="text-[var(--muted-foreground)] text-sm">Desconto Médio</div>
                  </div>
                  <div className="text-center hover-lift cursor-default">
                    <div className="w-12 h-12 bg-[var(--warning)]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-[var(--warning)]" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-[var(--primary)] mb-1">24h</div>
                    <div className="text-[var(--muted-foreground)] text-sm">Atendimento</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-scroll-indicator">
            <ChevronDown className="w-8 h-8 text-white/60" />
          </div>
        </div>
      </section>

      {/* Benefícios em Destaque */}
      <section className="py-20 bg-[var(--gray-50)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-4">
              Nossos <span className="text-gradient">Benefícios</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-lg">
              Descubra as vantagens exclusivas que a ASCESA oferece aos seus associados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Descontos em Farmácias',
                description: 'Até 30% de desconto em medicamentos e produtos de saúde',
                icon: Pill,
                color: 'primary',
              },
              {
                title: 'Assistência Funeral',
                description: 'Cobertura completa para você e sua família',
                icon: Home,
                color: 'secondary',
              },
              {
                title: 'Descontos em Educação',
                description: 'Faculdades, escolas e cursos com condições especiais',
                icon: GraduationCap,
                color: 'accent',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm border border-[var(--border)] hover:shadow-xl transition-all duration-300 hover-lift card-glow group"
              >
                <div className={`icon-bg mb-6 group-hover:animate-bounce-subtle`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">
                  {benefit.title}
                </h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/benefits">
              <Button variant="outline" size="lg" className="hover-lift">
                Ver Todos os Benefícios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-4">
              Como <span className="text-gradient">Funciona</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-lg">
              Três passos simples para você aproveitar todos os benefícios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Faça seu Cadastro',
                description: 'Preencha o formulário de associação online em poucos minutos',
                icon: Users,
              },
              {
                step: '2',
                title: 'Aguarde Aprovação',
                description: 'Nossa equipe analisará sua solicitação rapidamente',
                icon: Shield,
              },
              {
                step: '3',
                title: 'Aprove os Benefícios',
                description: 'Comece a usar os convênios imediatamente após aprovação',
                icon: Star,
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] opacity-20"></div>
                )}

                <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover-lift">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="w-8 h-8 bg-[var(--secondary)] text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 -mt-2">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[var(--primary)] via-[var(--primary-light)] to-[var(--secondary)] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 pattern-waves opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ainda não é associado?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
            Junte-se a milhares de servidores do Sicoob que já aproveitam nossas vantagens
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="btn-shine text-lg px-8 py-4">
              Quero me Associar
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

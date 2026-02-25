'use client';

import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-[var(--foreground)] mb-8">
        Sobre Nós
      </h1>

      <div className="max-w-3xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
            Quem Somos
          </h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            A ASCESA - Associação dos Servidores do Sicoob é uma instituição sem fins lucrativos
            que visa promover a integração e o bem-estar dos servidores do Sistema Sicoob.
            Fundada com o objetivo de credificar benefícios e vantagens para nossos associados,
            trabalhamos continuamente para oferecer as melhores condições e serviços.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
            Nossa Missão
          </h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            Proporcionar qualidade de vida e benefícios exclusivos aos servidores do Sicoob,
            promovendo a camaraderie e o espírito de comunidade entre os associados.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
            Nossos Valores
          </h2>
          <ul className="space-y-3 text-[var(--muted-foreground)]">
            <li className="flex items-start">
              <span className="text-[var(--secondary)] mr-2">•</span>
              Compromisso com o associado
            </li>
            <li className="flex items-start">
              <span className="text-[var(--secondary)] mr-2">•</span>
              Transparência e ética
            </li>
            <li className="flex items-start">
              <span className="text-[var(--secondary)] mr-2">•</span>
              Inovação constante
            </li>
            <li className="flex items-start">
              <span className="text-[var(--secondary)] mr-2">•</span>
              Solidariedade e cooperação
            </li>
          </ul>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
            Faça Parte
          </h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            Junte-se a nós e aproveite todos os benefícios que a ASCESA oferece.
          </p>
          <a href="/register">
            <Button>Quero me Associar</Button>
          </a>
        </section>
      </div>
    </div>
  );
}

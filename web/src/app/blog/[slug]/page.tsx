'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

const posts: Record<string, any> = {
  'novos-convênios-2026': {
    title: 'Novos Convênios em 2026',
    category: 'Notícias',
    date: '20/02/2026',
    content: `
      <p>A ASCESA está sempre trabalhando para oferecer os melhores benefícios aos nossos associados. Em 2026, conquistamos novas parcerias que vão facilitar ainda mais a sua vida.</p>

      <h2>Novos Parceiros</h2>
      <p>Estamos很高兴 em anunciar novas parcerias nas áreas de saúde, educação e entretenimento. Esses convênios trazem descontos exclusivos para você e sua família.</p>

      <h2>Como Ativar</h2>
      <p>Para utilizar os novos convênios, basta acessar sua área logada e verificar os detalhes de cada parceiro. Sua carteirinha digital está disponível para apresentação nos estabelecimentos.</p>

      <h2>Em Breve</h2>
      <p>Continuamos negociando novas parcerias. Em breve, teremos mais novidades!</p>
    `,
  },
  'assembleia-2026': {
    title: 'Assembleia Geral 2026',
    category: 'Eventos',
    date: '15/02/2026',
    content: `
      <p>Prezados Associados,</p>

      <p>Convidamos a todos para a Assembleia Geral Ordinária da ASCESA, que acontecerá no dia 15 de março de 2026.</p>

      <h2>Pauta</h2>
      <ul>
        <li>Apresentação do relatório financeiro de 2025</li>
        <li>Eleição da nova diretoria</li>
        <li>Prestação de contas</li>
        <li>Assuntos gerais</li>
      </ul>

      <h2>Participação</h2>
      <p>A assembleia será realizada presencialmente e também terá transmissão online para associados que não puderem comparecer.</p>
    `,
  },
  'dicas-saude-bem-estar': {
    title: 'Dicas de Saúde e Bem-estar',
    category: 'Dicas',
    date: '10/02/2026',
    content: `
      <p>Cuidar da saúde é fundamental, especialmente para quem tem uma rotina agitada de trabalho. Separamos algumas dicas para você manter o bem-estar em dia.</p>

      <h2>Dicas Práticas</h2>
      <p><strong>1. Hidratação:</strong> Beba pelo menos 2 litros de água por dia.</p>
      <p><strong>2. Alimentação:</strong> Prefira alimentos naturais e evite excesso de industrializados.</p>
      <p><strong>3. Exercícios:</strong> Mesmo uma caminhada de 30 minutos faz diferença.</p>
      <p><strong>4. Sono:</strong> Durma pelo menos 7 horas por noite.</p>

      <h2>Convênios de Saúde</h2>
      <p>Lembre-se que você tem acesso a descontos em farmácias e planos de saúde através da ASCESA. Verifique os convênios disponíveis na sua área logada.</p>
    `,
  },
  'parceria-escolas': {
    title: 'Parceria com Escolas Parceiras',
    category: 'Educação',
    date: '05/02/2026',
    content: `
      <p>A educação é uma das prioridades da ASCESA. Por isso, buscamos constantemente novas parcerias com instituições de ensino.</p>

      <h2>Escolas Parceiras</h2>
      <p> Atualmente, temos convênios com diversas escolas e universidades, oferecendo descontos de até 25% para nossos associados e seus dependentes.</p>

      <h2>Como Utilizar</h2>
      <p>Para aproveitar os descontos, apresente sua carteirinha digital no momento da matrícula ou entre em contato diretamente com a instituição para informar o código de associado ASCESA.</p>
    `,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = posts[slug];

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Post não encontrado.</p>
        <Link href="/blog">
          <button className="mt-4 text-[var(--secondary)] hover:underline">
            Voltar ao Blog
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/blog" className="text-[var(--secondary)] hover:underline mb-4 inline-block">
        ← Voltar ao Blog
      </Link>

      <article className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="text-sm font-medium text-[var(--secondary)]">{post.category}</span>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mt-2 mb-2">
            {post.title}
          </h1>
          <span className="text-sm text-[var(--muted-foreground)]">{post.date}</span>
        </div>

        <div className="h-64 bg-[var(--primary)] bg-opacity-10 rounded-xl flex items-center justify-center mb-8">
          <span className="text-6xl">📰</span>
        </div>

        <div
          className="prose prose-lg max-w-none text-[var(--foreground)]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <p className="text-[var(--muted-foreground)]">
            Gostou? Compartilhe com seus colegas!
          </p>
          <div className="flex gap-4 mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Facebook
            </button>
            <button className="px-4 py-2 bg-sky-500 text-white rounded-lg">
              Twitter
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
              WhatsApp
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

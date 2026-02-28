// SEO Metadata Configuration
// Use this file to export metadata for each page

import { Metadata } from 'next';

export const SITE_CONFIG = {
  name: 'ASCESA',
  title: 'ASCESA - Associação dos Servidores do Sicoob',
  description: 'Credificando benefícios e vantagens para você e sua família.',
  url: 'https://ascesa.com.br',
  ogImage: '/og-image.jpg',
  keywords: [
    'ASCESA',
    'associação',
    'servidores',
    'Sicoob',
    'benefícios',
    'convênios',
    'descontos',
  ],
};

export const metadataConfig: Record<string, Metadata> = {
  home: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords,
    openGraph: {
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      type: 'website',
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      images: [{ url: SITE_CONFIG.ogImage }],
    },
  },
  about: {
    title: 'Sobre Nós | ASCESA',
    description: 'Conheça a história e missão da ASCESA - Associação dos Servidores do Sicoob.',
    keywords: [...SITE_CONFIG.keywords, 'sobre', 'história', 'missão'],
  },
  benefits: {
    title: 'Nossos Benefícios | ASCESA',
    description: 'Descubra todos os benefícios e convênios exclusivos para associados ASCESA.',
    keywords: [...SITE_CONFIG.keywords, 'benefícios', 'convênios', 'descontos'],
  },
  partner: {
    title: 'Seja um Parceiro | ASCESA',
    description: 'Torne-se um parceiro da ASCESA e ofereça benefícios exclusivos aos nossos associados.',
    keywords: [...SITE_CONFIG.keywords, 'parceiro', 'parceria', 'empresa'],
  },
  blog: {
    title: 'Blog | ASCESA',
    description: 'Notícias, novidades e conteúdo exclusivo para associados ASCESA.',
    keywords: [...SITE_CONFIG.keywords, 'blog', 'notícias', 'novidades'],
  },
  faq: {
    title: 'FAQ - Perguntas Frequentes | ASCESA',
    description: 'Encontre respostas para as perguntas mais frequentes sobre a ASCESA.',
    keywords: [...SITE_CONFIG.keywords, 'faq', 'perguntas', 'duvidas'],
  },
  contact: {
    title: 'Fale Conosco | ASCESA',
    description: 'Entre em contato com a ASCESA. Estamos prontos para atender você.',
    keywords: [...SITE_CONFIG.keywords, 'contato', 'telefone', 'email', 'endereço'],
  },
  login: {
    title: 'Login | ASCESA',
    description: 'Acesse sua conta na ASCESA.',
  },
  register: {
    title: 'Cadastre-se | ASCESA',
    description: 'Faça seu cadastro e aproveite todos os benefícios da ASCESA.',
    keywords: [...SITE_CONFIG.keywords, 'cadastro', 'associado', 'inscrever'],
  },
  dashboard: {
    title: 'Área do Associado | ASCESA',
    description: 'Acesse sua área exclusiva de associado ASCESA.',
  },
  admin: {
    title: 'Painel Administrativo | ASCESA',
    description: 'Painel de administração da ASCESA.',
  },
};

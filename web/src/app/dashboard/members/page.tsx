'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { APP_ROUTES } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  author: string;
  readTime: number;
  date: string;
  isPremium: boolean;
}

interface Webinar {
  id: string;
  title: string;
  description: string;
  presenter: string;
  date: string;
  time: string;
  duration: number;
  participants: number;
  maxParticipants: number;
  isLive: boolean;
  thumbnail: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  lessons: number;
  duration: number;
  instructor: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
}

export default function ExclusiveContentPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('articles');

  const [articles] = useState<Article[]>([
    {
      id: '1',
      title: 'Gestão Financeira para Associados',
      description: 'Aprenda a organizar suas finanças e investir de forma inteligente',
      category: 'Finanças',
      thumbnail: '',
      author: 'Dr. Carlos Silva',
      readTime: 8,
      date: '2026-02-20',
      isPremium: true,
    },
    {
      id: '2',
      title: 'Benefícios Fiscais para Associados',
      description: 'Descubra como economizar impostos sendo associado',
      category: 'Impostos',
      thumbnail: '',
      author: 'Dr. Pedro Santos',
      readTime: 12,
      date: '2026-02-18',
      isPremium: true,
    },
    {
      id: '3',
      title: 'Planejamento Tributário 2026',
      description: 'Guia completo para o ano fiscal',
      category: 'Tributos',
      thumbnail: '',
      author: 'Dra. Maria Oliveira',
      readTime: 15,
      date: '2026-02-15',
      isPremium: false,
    },
  ]);

  const [webinars] = useState<Webinar[]>([
    {
      id: '1',
      title: 'Live: Planejamento Financeiro 2026',
      description: 'Aprenda a organizar suas finanças para o novo ano',
      presenter: 'Dr. Carlos Silva',
      date: '2026-02-28',
      time: '19:00',
      duration: 90,
      participants: 156,
      maxParticipants: 200,
      isLive: true,
      thumbnail: '',
    },
    {
      id: '2',
      title: 'Webinar: Investimentos Seguros',
      description: 'Opções de investimento para associados',
      presenter: 'Dr. Pedro Santos',
      date: '2026-03-05',
      time: '14:00',
      duration: 60,
      participants: 89,
      maxParticipants: 100,
      isLive: false,
      thumbnail: '',
    },
  ]);

  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Curso de Educação Financeira',
      description: 'Aprenda do básico ao avançado em finanças pessoais',
      category: 'Finanças',
      thumbnail: '',
      lessons: 12,
      duration: 360,
      instructor: 'Dr. Carlos Silva',
      level: 'Iniciante',
    },
    {
      id: '2',
      title: 'Workshop: Controle de Gastos',
      description: 'Workshop prático sobre controle de despesas',
      category: 'Finanças',
      thumbnail: '',
      lessons: 4,
      duration: 120,
      instructor: 'Dra. Ana Costa',
      level: 'Iniciante',
    },
  ]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

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
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Área Exclusiva</h1>
      <p className="text-[var(--muted-foreground)] mb-8">Conteúdo exclusivo para associados</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b">
        {[
          { id: 'articles', label: 'Artigos', icon: '📄' },
          { id: 'webinars', label: 'Webinars', icon: '🎥' },
          { id: 'courses', label: 'Cursos', icon: '📚' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === tab.id
                ? 'bg-white border border-b-0 border-[var(--border)] text-[var(--primary)] font-medium'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Articles */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-t-lg flex items-center justify-center">
                <span className="text-4xl">📄</span>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-[var(--muted-foreground)]">{article.category}</span>
                  {article.isPremium && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
                <CardDescription>{article.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-[var(--muted-foreground)]">
                  <span>{article.author}</span>
                  <span>{article.readTime} min de leitura</span>
                </div>
                <button className="w-full mt-4 bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-[var(--primary-light)]">
                  Ler Artigo
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Webinars */}
      {activeTab === 'webinars' && (
        <div className="space-y-6">
          {webinars.map((webinar) => (
            <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-40 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-l-lg flex items-center justify-center">
                  <span className="text-4xl">🎥</span>
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--foreground)]">{webinar.title}</h3>
                      <p className="text-[var(--muted-foreground)] mt-1">{webinar.description}</p>
                    </div>
                    {webinar.isLive && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full animate-pulse">
                        AO VIVO
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <span>📅 {new Date(webinar.date).toLocaleDateString('pt-BR')}</span>
                    <span>🕐 {webinar.time}</span>
                    <span>⏱️ {webinar.duration} min</span>
                    <span>👤 {webinar.presenter}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {webinar.participants}/{webinar.maxParticipants} participantes
                    </span>
                    <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-light)]">
                      {webinar.isLive ? 'Assistir Agora' : 'Inscrever-se'}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Courses */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-t-lg flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              <CardHeader>
                <span className="text-xs text-[var(--muted-foreground)]">{course.category}</span>
                <CardTitle className="text-lg mt-2">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[var(--gray-100)] text-[var(--foreground)] text-xs px-2 py-1 rounded">
                    {course.lessons} aulas
                  </span>
                  <span className="bg-[var(--gray-100)] text-[var(--foreground)] text-xs px-2 py-1 rounded">
                    {Math.floor(course.duration / 60)}h {course.duration % 60}min
                  </span>
                  <span className="bg-[var(--gray-100)] text-[var(--foreground)] text-xs px-2 py-1 rounded">
                    {course.level}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">Instrutor: {course.instructor}</p>
                <button className="w-full bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-[var(--primary-light)]">
                  Iniciar Curso
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { APP_ROUTES } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Benefit {
  id: string;
  name: string;
  category: string;
  partnerName: string;
  discount: string;
  description: string;
  isActive: boolean;
}

export default function MyBenefitsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [benefits] = useState<Benefit[]>([
    {
      id: '1',
      name: 'Descontos em Farmácias',
      category: 'Saúde',
      partnerName: 'Drogaria Popular',
      discount: '30%',
      description: 'Desconto de 30% em medicamentos e produtos de saúde',
      isActive: true,
    },
    {
      id: '2',
      name: 'Assistência Funeral',
      category: 'Serviços',
      partnerName: 'Servico Funeral',
      discount: '50%',
      description: 'Assistência funeral completa para você e sua família',
      isActive: true,
    },
    {
      id: '3',
      name: 'Descontos em Educação',
      category: 'Educação',
      partnerName: 'Universidade Presidente',
      discount: '25%',
      description: 'Descontos em mensalidades e cursos',
      isActive: true,
    },
    {
      id: '4',
      name: 'Descontos em Laboratórios',
      category: 'Saúde',
      partnerName: 'Labomed',
      discount: '20%',
      description: 'Descontos em exames laboratoriais',
      isActive: true,
    },
  ]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Saúde':
        return 'bg-red-100 text-red-800';
      case 'Educação':
        return 'bg-blue-100 text-blue-800';
      case 'Serviços':
        return 'bg-purple-100 text-purple-800';
      case 'Lazer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[var(--50vh)]">
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Meus Benefícios
          </h1>
          <Link href={APP_ROUTES.benefits}>
            <Button variant="outline">
              Ver Todos os Benefícios
            </Button>
          </Link>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-[var(--primary)]">{benefits.length}</p>
              <p className="text-[var(--muted-foreground)]">Benefícios Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-green-600">30%</p>
              <p className="text-[var(--muted-foreground)]">Maior Desconto</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-[var(--secondary)]">4</p>
              <p className="text-[var(--muted-foreground)]">Categorias</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit) => (
            <Card key={benefit.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{benefit.name}</CardTitle>
                    <CardDescription className="mt-1">{benefit.partnerName}</CardDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(benefit.category)}`}>
                    {benefit.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-green-600">{benefit.discount}</span>
                  <span className="text-[var(--muted-foreground)] ml-2">de desconto</span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                  {benefit.description}
                </p>
                <Button className="w-full" variant={benefit.isActive ? 'default' : 'outline'}>
                  {benefit.isActive ? 'Utilizar' : 'Indisponível'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {benefits.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[var(--muted-foreground)] mb-4">
                Você ainda não tem benefícios ativados.
              </p>
              <Link href={APP_ROUTES.benefits}>
                <Button>Ver Benefícios Disponíveis</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

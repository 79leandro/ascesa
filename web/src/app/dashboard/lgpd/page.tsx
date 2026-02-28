'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { APP_ROUTES } from '@/lib/api';
import { useAuth } from '@/hooks/useAuthContext';

export default function LGPDPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [requesting, setRequesting] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

  const handleDataRequest = async (type: 'access' | 'delete' | 'portability') => {
    setRequesting(type);
    setMessage('');

    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate the request
      await new Promise(resolve => setTimeout(resolve, 1500));

      switch (type) {
        case 'access':
          setMessage('Solicitação de acesso aos dados enviada. Você receberá um e-mail com seus dados em até 48 horas.');
          break;
        case 'delete':
          setMessage('Solicitação de exclusão de dados enviada. Nossa equipe entrará em contato em até 48 horas.');
          break;
        case 'portability':
          setMessage('Solicitação de portabilidade enviada. Você receberá um arquivo com seus dados em até 48 horas.');
          break;
      }
    } catch (error) {
      setMessage('Erro ao processar solicitação. Tente novamente.');
    } finally {
      setRequesting(null);
    }
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Meus Dados e LGPD
        </h1>

        <p className="text-[var(--muted-foreground)] mb-8">
          Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem direitos
          sobre seus dados pessoais. Utilize esta página para exercer esses direitos.
        </p>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            {message}
          </div>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Acesso aos Dados</CardTitle>
              <CardDescription>
                Solicite uma cópia de todos os dados pessoais que temos sobre você
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Você receberá um e-mail com todos os seus dados cadastrais, histórico de pagamentos,
                benefícios utilizados e outras informações que temos armazenadas.
              </p>
              <Button
                onClick={() => handleDataRequest('access')}
                disabled={requesting !== null}
                variant="outline"
              >
                {requesting === 'access' ? 'Enviando...' : 'Solicitar Acesso'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portabilidade</CardTitle>
              <CardDescription>
                Receba seus dados em um formato estruturado e legível por máquina
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Você pode solicitar seus dados em formato Excel ou JSON para transferring
                para outro serviço.
              </p>
              <Button
                onClick={() => handleDataRequest('portability')}
                disabled={requesting !== null}
                variant="outline"
              >
                {requesting === 'portability' ? 'Enviando...' : 'Solicitar Portabilidade'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exclusão de Dados</CardTitle>
              <CardDescription>
                Solicite a exclusão dos seus dados pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Você pode solicitar a exclusão dos seus dados. Note que alguns dados
                podem ser mantidos por obrigação legal (ex: registros fiscais).
              </p>
              <Button
                onClick={() => handleDataRequest('delete')}
                disabled={requesting !== null}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                {requesting === 'delete' ? 'Enviando...' : 'Solicitar Exclusão'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atualizar Dados</CardTitle>
              <CardDescription>
                Mantenha seus dados cadastrais atualizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Você pode atualizar seus dados pessoais a qualquer momento através
                do seu perfil.
              </p>
              <Link href="/dashboard/profile">
                <Button variant="outline">
                  Atualizar Dados
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Dúvidas?</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Entre em contato com nosso Encarregado de Dados (DPO):
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            E-mail: privacidade@ascesa.com.br
          </p>
        </div>
      </div>
    </div>
  );
}

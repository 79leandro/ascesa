'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { APP_ROUTES } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  type: 'MONTHLY' | 'ANNUAL';
}

export default function PaymentsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      date: '2026-02-15',
      description: 'Mensalidade Fevereiro/2026',
      amount: 35.00,
      status: 'PAID',
      type: 'MONTHLY',
    },
    {
      id: '2',
      date: '2026-01-15',
      description: 'Mensalidade Janeiro/2026',
      amount: 35.00,
      status: 'PAID',
      type: 'MONTHLY',
    },
    {
      id: '3',
      date: '2025-12-15',
      description: 'Mensalidade Dezembro/2025',
      amount: 35.00,
      status: 'PAID',
      type: 'MONTHLY',
    },
  ]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Pago';
      case 'PENDING':
        return 'Pendente';
      case 'OVERDUE':
        return 'Atrasado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const totalPaid = payments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Extrato de Pagamentos
        </h1>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Total Pago</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Mensalidade</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{formatCurrency(35.00)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Próximo Vencimento</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">15/03/2026</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de pagamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>
              Veja todos os seus pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-center text-[var(--muted-foreground)] py-8">
                Nenhum pagamento registrado.
              </p>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {payment.description}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {formatDate(payment.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[var(--foreground)]">
                        {formatCurrency(payment.amount)}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

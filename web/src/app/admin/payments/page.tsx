'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SIDEBAR_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/benefits', label: 'Convênios', icon: '🎁' },
  { href: '/admin/blog', label: 'Blog', icon: '📰' },
  { href: '/admin/associates', label: 'Associados', icon: '👥' },
  { href: '/admin/documents', label: 'Documentos', icon: '📄' },
  { href: '/admin/payments', label: 'Pagamentos', icon: '💳' },
  { href: '/admin/assemblies', label: 'Assembleias', icon: '🏛️' },
  { href: '/admin/reports', label: 'Relatórios', icon: '📈' },
  { href: '/admin/partners', label: 'Parceiros', icon: '🤝' },
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️' },
  { href: '/dashboard', label: 'Voltar ao Site', icon: '←' },
];

interface Payment {
  id: string;
  associateName: string;
  associateEmail: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  month: string;
  year: number;
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      associateName: 'João Silva Santos',
      associateEmail: 'joao@teste.com',
      amount: 50.0,
      dueDate: '2026-02-10',
      paidDate: '2026-02-05',
      status: 'PAID',
      month: 'Fevereiro',
      year: 2026,
    },
    {
      id: '2',
      associateName: 'Maria Oliveira',
      associateEmail: 'maria@teste.com',
      amount: 50.0,
      dueDate: '2026-02-10',
      paidDate: null,
      status: 'PENDING',
      month: 'Fevereiro',
      year: 2026,
    },
    {
      id: '3',
      associateName: 'Pedro Santos',
      associateEmail: 'pedro@teste.com',
      amount: 50.0,
      dueDate: '2026-02-10',
      paidDate: null,
      status: 'OVERDUE',
      month: 'Fevereiro',
      year: 2026,
    },
    {
      id: '4',
      associateName: 'Ana Costa',
      associateEmail: 'ana@teste.com',
      amount: 50.0,
      dueDate: '2026-01-10',
      paidDate: '2026-01-08',
      status: 'PAID',
      month: 'Janeiro',
      year: 2026,
    },
    {
      id: '5',
      associateName: 'Carlos Lima',
      associateEmail: 'carlos@teste.com',
      amount: 50.0,
      dueDate: '2026-01-10',
      paidDate: null,
      status: 'OVERDUE',
      month: 'Janeiro',
      year: 2026,
    },
    {
      id: '6',
      associateName: 'Fernanda Silva',
      associateEmail: 'fernanda@teste.com',
      amount: 50.0,
      dueDate: '2025-12-10',
      paidDate: '2025-12-15',
      status: 'PAID',
      month: 'Dezembro',
      year: 2025,
    },
  ]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role !== 'ADMIN' && userData.role !== 'DIRECTOR') {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
  };

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const filteredPayments = payments.filter(p => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch =
      p.associateName.toLowerCase().includes(search.toLowerCase()) ||
      p.associateEmail.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPaid = payments.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'OVERDUE').reduce((acc, p) => acc + p.amount, 0);

  const markAsPaid = (paymentId: string) => {
    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? { ...p, status: 'PAID' as const, paidDate: new Date().toISOString().split('T')[0] }
          : p
      )
    );
    setSelectedPayment(null);
  };

  const sendReminder = (paymentId: string) => {
    alert('Lembrete enviado com sucesso!');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--primary)] text-white p-6">
        <h2 className="text-xl font-bold mb-8">Painel Admin</h2>
        <nav className="space-y-2">
          {SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 px-4 rounded hover:bg-white/10 ${
                link.href === '/admin/payments' ? 'bg-white/20' : ''
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[var(--gray-50)]">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Controle de Pagamentos</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-[var(--muted-foreground)]">Total Recebido</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-[var(--muted-foreground)]">Pendente</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-[var(--muted-foreground)]">Inadimplente</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-[var(--muted-foreground)]">Taxa de Inadimplência</p>
              <p className="text-2xl font-bold">
                {((totalOverdue / (totalPaid + totalPending + totalOverdue)) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg flex-1 bg-white"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-white"
          >
            <option value="ALL">Todos</option>
            <option value="PAID">Pagos</option>
            <option value="PENDING">Pendentes</option>
            <option value="OVERDUE">Atrasados</option>
          </select>
          <Button variant="outline">
            📧 Enviar Lembretes
          </Button>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPayments.length === 0 ? (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                Nenhum pagamento encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Associado</th>
                      <th className="text-left py-3 px-4">Mês/Ano</th>
                      <th className="text-left py-3 px-4">Valor</th>
                      <th className="text-left py-3 px-4">Vencimento</th>
                      <th className="text-left py-3 px-4">Pagamento</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium">{payment.associateName}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{payment.associateEmail}</p>
                        </td>
                        <td className="py-3 px-4">
                          {payment.month}/{payment.year}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          {payment.paidDate
                            ? new Date(payment.paidDate).toLocaleDateString('pt-BR')
                            : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                            {getStatusLabel(payment.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPayment(payment)}
                            >
                              Detalhes
                            </Button>
                            {payment.status !== 'PAID' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => markAsPaid(payment.id)}
                              >
                                Registrar
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal for payment details */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg m-4">
              <CardHeader>
                <CardTitle>Detalhes do Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Associado</p>
                  <p className="font-medium">{selectedPayment.associateName}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{selectedPayment.associateEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Mês/Ano</p>
                  <p className="font-medium">{selectedPayment.month}/{selectedPayment.year}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Valor</p>
                  <p className="font-medium text-lg">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Data de Vencimento</p>
                  <p className="font-medium">{new Date(selectedPayment.dueDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Data de Pagamento</p>
                  <p className="font-medium">
                    {selectedPayment.paidDate
                      ? new Date(selectedPayment.paidDate).toLocaleDateString('pt-BR')
                      : 'Não pago'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedPayment.status)}`}>
                    {getStatusLabel(selectedPayment.status)}
                  </span>
                </div>

                <div className="flex gap-2 pt-4">
                  {selectedPayment.status !== 'PAID' && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => markAsPaid(selectedPayment.id)}
                      >
                        Registrar Pagamento
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => sendReminder(selectedPayment.id)}
                      >
                        📧 Enviar Lembrete
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedPayment(null)}
                  >
                    Fechar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

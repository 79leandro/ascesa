'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/api';
import { useAdminAuth } from '@/hooks';
import { AdminLayout, FilterBar } from '@/components/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Payment {
  id: string;
  associateName: string;
  associateEmail: string;
  associateId: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  month: string;
  year: number;
}

interface Stats {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalAmount: number;
}

export default function AdminPaymentsPage() {
  useAdminAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats>({ totalPaid: 0, totalPending: 0, totalOverdue: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        status: filter !== 'ALL' ? filter : '',
        search,
      });

      const res = await fetch(`${API_ENDPOINTS.payments.list}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPayments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.payments.stats, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data || { totalPaid: 0, totalPending: 0, totalOverdue: 0, totalAmount: 0 });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filter, search]);

  const markAsPaid = async (paymentId: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.payments.markPaid(paymentId), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchPayments();
        fetchStats();
        setSelectedPayment(null);
        alert('Pagamento registrado com sucesso!');
      } else {
        alert(data.message || 'Erro ao registrar pagamento');
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const sendReminder = async (paymentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.payments.sendReminder(paymentId), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert('Lembrete enviado com sucesso!');
      } else {
        alert(data.message || 'Erro ao enviar lembrete');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  const sendBulkReminders = async () => {
    if (!confirm('Enviar lembretes para todos os associados com pagamento pendente/atrasado?')) return;
    try {
      const token = localStorage.getItem('token');
      const overduePayments = payments.filter(p => p.status !== 'PAID');
      for (const payment of overduePayments) {
        await fetch(API_ENDPOINTS.payments.sendReminder(payment.id), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      alert('Lembretes enviados com sucesso!');
    } catch (error) {
      console.error('Error sending bulk reminders:', error);
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
      p.associateName?.toLowerCase().includes(search.toLowerCase()) ||
      p.associateEmail?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const { totalPaid, totalPending, totalOverdue, totalAmount } = stats;

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
    }).format(value || 0);
  };

  const filterOptions = [
    { value: 'ALL', label: 'Todos' },
    { value: 'PAID', label: 'Pagos' },
    { value: 'PENDING', label: 'Pendentes' },
    { value: 'OVERDUE', label: 'Atrasados' },
  ];

  return (
    <AdminLayout
      title="Controle de Pagamentos"
      actions={
        <Button variant="outline" onClick={sendBulkReminders}>
          📧 Enviar Lembretes
        </Button>
      }
    >
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
              {totalAmount > 0 ? ((totalOverdue / totalAmount) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Buscar por nome ou email..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { options: filterOptions, value: filter, onChange: setFilter },
        ]}
      />

      {/* Payments Table */}
      {loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
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
                                disabled={actionLoading}
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
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Processando...' : 'Registrar Pagamento'}
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
    </AdminLayout>
  );
}

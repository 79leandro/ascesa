'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { useAdminAuth } from '@/hooks';
import { AdminLayout } from '@/components/admin';
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
  status: string;
  month: number;
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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats>({ totalPaid: 0, totalPending: 0, totalOverdue: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

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
      });
      const res = await fetch(`${API_ENDPOINTS.payments.list}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.pagamentos) {
        const formattedPayments = data.pagamentos.map((p: any) => ({
          id: p.id,
          associateName: p.associado?.nome || 'N/A',
          associateEmail: p.associado?.usuario?.email || 'N/A',
          associateId: p.associado?.id || '',
          amount: p.valor,
          dueDate: p.dataVencimento,
          paidDate: p.dataPagamento,
          status: p.status,
          month: p.mes,
          year: p.ano,
        }));
        setPayments(formattedPayments);
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
      if (data.data) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAGO': return 'bg-green-100 text-green-800';
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ATRASADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAGO': return 'Pago';
      case 'PENDENTE': return 'Pendente';
      case 'ATRASADO': return 'Atrasado';
      default: return status;
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = search === '' ||
      p.associateName.toLowerCase().includes(search.toLowerCase()) ||
      p.associateEmail.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const { totalPaid, totalPending, totalOverdue, totalAmount } = stats;

  return (
    <AdminLayout title="Controle de Pagamentos">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Total Recebido</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Pendente</p>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Atrasado</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Total Esperado</p>
            <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg"
          value={filter}
          onChange={(e) => { setFilter(e.target.value); fetchPayments(); }}
        >
          <option value="ALL">Todos</option>
          <option value="PAGO">Pagos</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="ATRASADO">Atrasados</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3">Associado</th>
                    <th className="text-left pb-3">Mês/Ano</th>
                    <th className="text-left pb-3">Valor</th>
                    <th className="text-left pb-3">Vencimento</th>
                    <th className="text-left pb-3">Pagamento</th>
                    <th className="text-left pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhum pagamento encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b last:border-0">
                        <td className="py-3">
                          <p className="font-medium">{payment.associateName}</p>
                          <p className="text-sm text-gray-500">{payment.associateEmail}</p>
                        </td>
                        <td className="py-3">{payment.month}/{payment.year}</td>
                        <td className="py-3">{formatCurrency(payment.amount)}</td>
                        <td className="py-3">{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('pt-BR') : '-'}</td>
                        <td className="py-3">
                          {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                            {getStatusLabel(payment.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}

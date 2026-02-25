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

interface ReportData {
  totalAssociates: number;
  activeAssociates: number;
  pendingAssociates: number;
  inactiveAssociates: number;
  newThisMonth: number;
  revenue: number;
  averageAge: number;
  genderDistribution: { male: number; female: number; other: number };
  statusDistribution: { active: number; pending: number; inactive: number; cancelled: number };
  monthlyGrowth: { month: string; count: number }[];
  topBenefits: { name: string; activations: number }[];
}

export default function AdminReportsPage() {
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData>({
    totalAssociates: 1234,
    activeAssociates: 856,
    pendingAssociates: 89,
    inactiveAssociates: 234,
    newThisMonth: 45,
    revenue: 123400,
    averageAge: 38,
    genderDistribution: { male: 620, female: 580, other: 34 },
    statusDistribution: { active: 856, pending: 89, inactive: 234, cancelled: 55 },
    monthlyGrowth: [
      { month: 'Set', count: 380 },
      { month: 'Out', count: 420 },
      { month: 'Nov', count: 450 },
      { month: 'Dez', count: 480 },
      { month: 'Jan', count: 510 },
      { month: 'Fev', count: 520 },
    ],
    topBenefits: [
      { name: 'Descontos em Farmácias', activations: 456 },
      { name: 'Plano de Saúde', activations: 389 },
      { name: 'Assistência Funeral', activations: 234 },
      { name: 'Descontos em Educação', activations: 178 },
      { name: 'Descontos em Hotéis', activations: 123 },
    ],
  });
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const exportReport = (format: 'csv' | 'pdf') => {
    alert(`Exportando relatório em formato ${format.toUpperCase()}...`);
  };

  const maxGrowth = Math.max(...reportData.monthlyGrowth.map(m => m.count));

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
                link.href === '/admin/reports' ? 'bg-white/20' : ''
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[var(--gray-50)]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Relatórios</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportReport('csv')}>
              📥 Exportar CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport('pdf')}>
              📄 Exportar PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-white"
          >
            <option value="overview">Visão Geral</option>
            <option value="demographics">Demográfico</option>
            <option value="financial">Financeiro</option>
            <option value="benefits">Convênios</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-white"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="365">Último ano</option>
          </select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Total de Associados</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {reportData.totalAssociates.toLocaleString('pt-BR')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Associados Ativos</p>
              <p className="text-3xl font-bold text-green-600">
                {reportData.activeAssociates.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {((reportData.activeAssociates / reportData.totalAssociates) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Novos este Mês</p>
              <p className="text-3xl font-bold text-blue-600">{reportData.newThisMonth}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Receita Mensal</p>
              <p className="text-3xl font-bold text-[var(--primary)]">
                {formatCurrency(reportData.revenue)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Associados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end justify-between gap-2">
                {reportData.monthlyGrowth.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-[var(--primary)] rounded-t transition-all"
                      style={{
                        height: `${(item.count / maxGrowth) * 100}%`,
                        minHeight: '20px',
                      }}
                    />
                    <p className="text-xs mt-2 text-[var(--muted-foreground)]">{item.month}</p>
                    <p className="text-xs font-medium">{item.count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Ativos', value: reportData.statusDistribution.active, color: 'bg-green-500' },
                  { label: 'Pendentes', value: reportData.statusDistribution.pending, color: 'bg-yellow-500' },
                  { label: 'Inativos', value: reportData.statusDistribution.inactive, color: 'bg-red-500' },
                  { label: 'Cancelados', value: reportData.statusDistribution.cancelled, color: 'bg-gray-500' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.label}</span>
                      <span className="text-sm font-medium">
                        {item.value} ({((item.value / reportData.totalAssociates) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${(item.value / reportData.totalAssociates) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Gender Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Gênero</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around items-center py-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">♂️</div>
                  <p className="text-2xl font-bold">{reportData.genderDistribution.male}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {((reportData.genderDistribution.male / reportData.totalAssociates) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">♀️</div>
                  <p className="text-2xl font-bold">{reportData.genderDistribution.female}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {((reportData.genderDistribution.female / reportData.totalAssociates) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">⚥</div>
                  <p className="text-2xl font-bold">{reportData.genderDistribution.other}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {((reportData.genderDistribution.other / reportData.totalAssociates) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Convênios Mais Utilizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.topBenefits.map((benefit, index) => (
                  <div key={benefit.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm">{benefit.name}</span>
                    </div>
                    <span className="text-sm font-medium">{benefit.activations} ativações</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">Média de Idade</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">{reportData.averageAge} anos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">Taxa de Ativos</p>
              <p className="text-3xl font-bold text-green-600">
                {((reportData.activeAssociates / reportData.totalAssociates) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">Taxa de Inadimplência</p>
              <p className="text-3xl font-bold text-red-600">
                {((reportData.inactiveAssociates / reportData.totalAssociates) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

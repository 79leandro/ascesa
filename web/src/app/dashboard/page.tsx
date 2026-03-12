'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/lib/api';
import {
  User,
  FileText,
  Gift,
  CreditCard,
  Wallet,
  MessageCircle,
  ClipboardList,
  Sparkles,
  LogOut,
  ArrowRight,
  TrendingUp,
  Shield
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
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

  const menuItems = [
    {
      href: APP_ROUTES.profile,
      icon: User,
      title: 'Meu Perfil',
      description: 'Gerencie seus dados cadastrais',
      color: 'primary',
    },
    {
      href: '/dashboard/documents',
      icon: FileText,
      title: 'Documentos',
      description: 'Envie seus documentos',
      color: 'secondary',
    },
    {
      href: '/dashboard/benefits',
      icon: Gift,
      title: 'Meus Benefícios',
      description: 'Convênios ativados',
      color: 'accent',
    },
    {
      href: '/dashboard/card',
      icon: CreditCard,
      title: 'Carteirinha',
      description: 'Carteirinha digital',
      color: 'warning',
    },
    {
      href: '/dashboard/payments',
      icon: Wallet,
      title: 'Pagamentos',
      description: 'Extrato de pagamentos',
      color: 'success',
    },
    {
      href: '/dashboard/contact',
      icon: MessageCircle,
      title: 'Fale Conosco',
      description: 'Entre em contato',
      color: 'info',
    },
  ];

  const colorClasses = {
    primary: 'from-[var(--primary)] to-[var(--primary-light)]',
    secondary: 'from-[var(--secondary)] to-[var(--secondary-light)]',
    accent: 'from-[var(--accent)] to-[#DCEDC8]',
    warning: 'from-[var(--warning)] to-[#FCD34D]',
    success: 'from-[var(--success)] to-[#6EE7B7]',
    info: 'from-[var(--info)] to-[#93C5FD]',
  };

  const iconBgColors = {
    primary: 'bg-[var(--primary)]/10 text-[var(--primary)]',
    secondary: 'bg-[var(--secondary)]/10 text-[var(--secondary)]',
    accent: 'bg-[var(--accent)]/10 text-[var(--primary)]',
    warning: 'bg-[var(--warning)]/10 text-[var(--warning)]',
    success: 'bg-[var(--success)]/10 text-[var(--success)]',
    info: 'bg-[var(--info)]/10 text-[var(--info)]',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--primary)] via-[var(--primary-light)] to-[var(--secondary)] rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Painel do Associado</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Bem-vindo de volta, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-white/80 max-w-xl">
              Acesse todos os seus benefícios, acompanhe seus pagamentos e mantenha seus dados atualizados.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white">
              <Shield className="w-5 h-5" />
              <span className="font-medium">
                {user.status === 'ACTIVE' ? 'Associado Ativo' : 'Pendente'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white hover:bg-white/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[var(--border)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Convênios Ativos</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">50+</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[var(--secondary)]/10 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-[var(--secondary)]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[var(--border)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Desconto Médio</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">30%</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
              <Gift className="w-7 h-7 text-[var(--primary)]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[var(--border)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Membro Desde</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {new Date().getFullYear()}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-[var(--primary)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--secondary)]" />
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} className="block group">
              <div className="bg-white rounded-2xl p-6 border border-[var(--border)] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 card-glow">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBgColors[item.color as keyof typeof iconBgColors]}`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-[var(--gray-400)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mt-4 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-2xl p-6 border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">Status da Associação</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Informações sobre sua situação junto à ASCESA
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl font-semibold ${
            user.status === 'ACTIVE'
              ? 'bg-[var(--success)]/10 text-[var(--success)]'
              : 'bg-[var(--warning)]/10 text-[var(--warning)]'
          }`}>
            {user.status === 'ACTIVE' ? 'Associado Ativo' : 'Pendente de Aprovação'}
          </div>
        </div>
      </div>
    </div>
  );
}

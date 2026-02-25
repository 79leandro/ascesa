'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useRequireAuth } from '@/hooks/useAuth';
import { User } from '@/lib/types';
import { APP_ROUTES } from '@/lib/api';

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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Bem-vindo, {user.name}!
        </h1>
        <button
          onClick={handleLogout}
          className="text-[var(--secondary)] hover:underline"
        >
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href={APP_ROUTES.profile} className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">👤</div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Meu Perfil</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Gerencie seus dados cadastrais</p>
          </div>
        </Link>

        <Link href={APP_ROUTES.documents} className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Documentos</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Envie seus documentos</p>
          </div>
        </Link>

        <Link href={APP_ROUTES.benefits} className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🎁</div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Meus Benefícios</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Veja os convênios disponíveis</p>
          </div>
        </Link>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--border)]">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Status</h3>
          <p className="text-sm text-[var(--secondary)] font-medium">
            {user.status === 'ACTIVE' ? 'Associado Ativo' : 'Pendente de Aprovação'}
          </p>
        </div>
      </div>
    </div>
  );
}

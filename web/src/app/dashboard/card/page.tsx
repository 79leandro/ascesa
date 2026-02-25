'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { APP_ROUTES } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function CardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
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

  // Generate a fake card number for display
  const cardNumber = `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`;
  const memberSince = new Date('2026-01-15');
  const validUntil = new Date('2027-01-15');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Carteirinha Digital
        </h1>

        {/* Card Visual */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-[#0D3A12] to-[#2E7D32] rounded-2xl p-8 text-white shadow-xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-sm opacity-80">Associação dos Servidores do Sicoob</p>
                <h2 className="text-2xl font-bold mt-1">ASCESA</h2>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Tipo</p>
                <p className="font-bold">ASSOCIADO</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm opacity-80">Nome</p>
              <p className="text-xl font-bold">{user.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm opacity-80">CPF</p>
                <p className="font-mono">***.***.***-**</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Matrícula</p>
                <p className="font-mono">{cardNumber}</p>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm opacity-80">Desde</p>
                <p className="font-bold">{formatDate(memberSince)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Validado até</p>
                <p className="font-bold">{formatDate(validUntil)}</p>
              </div>
            </div>
          </div>

          {/* Badge de status */}
          <div className="absolute -top-3 -right-3">
            <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              ATIVO
            </span>
          </div>
        </div>

        {/* Informações */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações do Associado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Nome completo</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Status</span>
              <span className="font-medium text-green-600">Ativo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Tipo de associação</span>
              <span className="font-medium">Padrão</span>
            </div>
          </CardContent>
        </Card>

        {/* Como usar */}
        <Card>
          <CardHeader>
            <CardTitle>Como usar</CardTitle>
            <CardDescription>
              Apresente esta carteirinha digital nos estabelecimentos parceiros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-[var(--muted-foreground)]">
              <li>Guarde esta imagem no seu celular</li>
              <li>Apresente o QR Code ou número de matrícula</li>
              <li>Mostre um documento com foto para confirmar</li>
              <li>Aproveite os descontos!</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

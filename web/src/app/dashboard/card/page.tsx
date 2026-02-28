'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { APP_ROUTES, API_ENDPOINTS } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Associate {
  id: string;
  cpf: string;
  cidade: string;
  estado: string;
  status: string;
  dataAssociacao: string;
}

export default function CardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [associate, setAssociate] = useState<Associate | null>(null);
  const [loadingAssociate, setLoadingAssociate] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      fetchAssociateData();
    }
  }, [user]);

  const fetchAssociateData = async () => {
    if (!user) return;
    setLoadingAssociate(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.associates.me, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAssociate(data.data);
      }
    } catch (error) {
      console.error('Error fetching associate:', error);
    } finally {
      setLoadingAssociate(false);
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string | null | undefined) => {
    if (!cpf) return '***.***.***-**';
    // Format CPF: 000.000.000-00
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `${cleaned.slice(0,3)}.${cleaned.slice(3,6)}.${cleaned.slice(6,9)}-${cleaned.slice(9)}`;
    }
    return cpf;
  };

  const maskCPF = (cpf: string | null | undefined) => {
    if (!cpf) return '***.***.***-**';
    return formatCPF(cpf);
  };

  const generateQRData = () => {
    if (!associate || !user) return '';
    // Generate a JSON string with associate verification data
    const qrData = {
      id: associate.id,
      nome: user.name,
      cpf: associate.cpf,
      status: associate.status,
      dataAssociacao: associate.dataAssociacao,
      validadoEm: new Date().toISOString(),
    };
    return JSON.stringify(qrData);
  };

  if (isLoading || loadingAssociate || !user) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Carregando...</p>
        </div>
      </div>
    );
  }

  const memberSince = associate?.dataAssociacao ? new Date(associate.dataAssociacao) : new Date();
  const validUntil = new Date(memberSince);
  validUntil.setFullYear(validUntil.getFullYear() + 1);

  const qrData = generateQRData();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Carteirinha Digital
        </h1>

        {/* Card Visual */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-[#0D3A12] to-[#2E7D32] rounded-2xl p-8 text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
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
                <p className="font-mono">{maskCPF(associate?.cpf)}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Matrícula</p>
                <p className="font-mono">{associate?.id?.slice(0, 8).toUpperCase() || '00000000'}</p>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm opacity-80">Desde</p>
                <p className="font-bold">{formatDate(associate?.dataAssociacao)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Validado até</p>
                <p className="font-bold">{formatDate(validUntil.toISOString())}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="mt-6 flex justify-center">
              <div className="bg-white p-2 rounded-lg">
                <QRCode
                  value={qrData}
                  size={120}
                  level="M"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>

          {/* Badge de status */}
          <div className="absolute -top-3 -right-3">
            <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              {associate?.status === 'ATIVO' ? 'ATIVO' : 'INATIVO'}
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
              <span className="text-[var(--muted-foreground)]">CPF</span>
              <span className="font-medium font-mono">{maskCPF(associate?.cpf)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Cidade</span>
              <span className="font-medium">{associate?.cidade || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Status</span>
              <span className={`font-medium ${associate?.status === 'ATIVO' ? 'text-green-600' : 'text-red-600'}`}>
                {associate?.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Data de associação</span>
              <span className="font-medium">{formatDate(associate?.dataAssociacao)}</span>
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

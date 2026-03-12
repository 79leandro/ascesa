'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { API_ENDPOINTS, APP_ROUTES } from '@/lib/api';
import { useAuth } from '@/hooks/useAuthContext';
import { perf } from '@/lib/performance';
import { useToast } from '@/components/ui/toast';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    // Redirect based on role
    if (user.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    perf.start('login submit');
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.accessToken, data.user);
        addToast('Login realizado com sucesso!', 'success');
      } else {
        addToast(data.message || 'Erro ao fazer login', 'error');
        setLoading(false);
      }
    } catch {
      addToast('Erro ao conectar com o servidor. Verifique sua conexão.', 'error');
      setLoading(false);
    }
    perf.end('login submit');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[var(--secondary)]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Bem-vindo de Volta
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Entre com sua conta para acessar o sistema
          </p>
        </div>

        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]"></div>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                  <Input
                    type="email"
                    placeholder="seu@email.com.br"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                  <Input
                    type="password"
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-[var(--secondary)] hover:underline font-medium">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button type="submit" className="w-full py-3 text-base" disabled={loading}>
                {loading ? (
                  'Entrando...'
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-[var(--muted-foreground)]">
                Não tem conta?{' '}
                <Link href={APP_ROUTES.register} className="text-[var(--secondary)] hover:underline font-semibold">
                  Cadastre-se
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

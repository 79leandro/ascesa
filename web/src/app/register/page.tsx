'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { API_ENDPOINTS, APP_ROUTES } from '@/lib/api';
import {
  validateCPF,
  formatCPF,
  formatPhone,
  validateEmail,
  cleanNumbers,
  VALIDATION,
  ERROR_MESSAGES,
} from '@/lib/validations';
import { Sparkles, User, Mail, Phone, Calendar, Briefcase, MapPin, Lock, ArrowRight, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
    profession: '',
    address: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: '',
    lgpdConsent: false,
  });

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < VALIDATION.MIN_NAME_LENGTH) {
      newErrors.name = ERROR_MESSAGES.name;
    }

    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = ERROR_MESSAGES.cpf;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = ERROR_MESSAGES.email;
    }

    if (formData.password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      newErrors.password = ERROR_MESSAGES.password;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.confirmPassword;
    }

    if (!formData.lgpdConsent) {
      newErrors.lgpdConsent = 'Você precisa aceitar os termos para se cadastrar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cpf: cleanNumbers(formData.cpf),
          phone: cleanNumbers(formData.phone),
          birthDate: formData.birthDate,
          profession: formData.profession,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Cadastro realizado com sucesso! Verifique seu email para confirmar.');
        setTimeout(() => {
          router.push(APP_ROUTES.login);
        }, 2000);
      } else {
        setErrors({ form: data.message || 'Erro ao fazer cadastro' });
      }
    } catch {
      setErrors({ form: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, cpf: formatted });
    if (errors.cpf) setErrors({ ...errors, cpf: '' });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-[var(--secondary)]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Faça seu Cadastro
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Preencha os dados abaixo para se tornar um associado ASCESA
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <div className="h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]"></div>
          <CardContent className="p-8">
            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {errors.form}
              </div>
            )}
            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="border-b border-[var(--border)] pb-6">
                <h3 className="font-bold mb-4 text-[var(--foreground)] flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--primary)]" />
                  Dados Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Nome Completo"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    error={errors.name}
                    required
                  />
                  <Input
                    label="CPF"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    error={errors.cpf}
                    maxLength={VALIDATION.MAX_CPF_LENGTH}
                    required
                  />
                  <Input
                    label="Data de Nascimento"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                  <Input
                    label="Profissão"
                    placeholder="Sua profissão"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  />
                </div>
              </div>

              {/* Contato */}
              <div className="border-b border-[var(--border)] pb-6">
                <h3 className="font-bold mb-4 text-[var(--foreground)] flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[var(--primary)]" />
                  Contato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="seu@email.com.br"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Telefone"
                    placeholder="(31) 99999-9999"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    maxLength={VALIDATION.MAX_PHONE_LENGTH}
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="border-b border-[var(--border)] pb-6">
                <h3 className="font-bold mb-4 text-[var(--foreground)] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--primary)]" />
                  Endereço
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Endereço"
                    placeholder="Rua, número, bairro"
                    className="md:col-span-2"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                  <Input
                    label="Cidade"
                    placeholder="Belo Horizonte"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input
                    label="Estado"
                    placeholder="MG"
                    maxLength={VALIDATION.STATE_MAX_LENGTH}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <h3 className="font-bold mb-4 text-[var(--foreground)] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[var(--primary)]" />
                  Segurança
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Senha"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    error={errors.password}
                    required
                  />
                  <Input
                    label="Confirmar Senha"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    error={errors.confirmPassword}
                    required
                  />
                </div>
              </div>

              {/* LGPD Consent */}
              <div className="border-t border-[var(--border)] pt-6">
                <label className="flex items-start gap-3 cursor-pointer p-4 bg-[var(--gray-50)] rounded-xl hover:bg-[var(--gray-100)] transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.lgpdConsent}
                    onChange={(e) => {
                      setFormData({ ...formData, lgpdConsent: e.target.checked });
                      if (errors.lgpdConsent) setErrors({ ...errors, lgpdConsent: '' });
                    }}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="text-sm text-[var(--muted-foreground)]">
                    Eu li e concordo com os{' '}
                    <Link href="/terms" target="_blank" className="text-[var(--secondary)] hover:underline font-medium">
                      Termos de Uso
                    </Link>{' '}
                    e a{' '}
                    <Link href="/privacy" target="_blank" className="text-[var(--secondary)] hover:underline font-medium">
                      Política de Privacidade
                    </Link>
                    . Estou ciente de que meus dados serão tratados em conformidade com a LGPD.
                  </span>
                </label>
                {errors.lgpdConsent && (
                  <p className="text-red-500 text-sm mt-2 ml-1">{errors.lgpdConsent}</p>
                )}
              </div>

              <Button type="submit" className="w-full py-3 text-base" disabled={loading}>
                {loading ? 'Cadastrando...' : (
                  <>
                    Finalizar Cadastro
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-[var(--muted-foreground)]">
                Já tem conta?{' '}
                <Link href={APP_ROUTES.login} className="text-[var(--secondary)] hover:underline font-semibold">
                  Fazer Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

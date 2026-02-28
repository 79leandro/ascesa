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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Faça seu Cadastro</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para se tornar um associado ASCESA
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.form && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {errors.form}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dados Pessoais */}
              <div className="border-b pb-4 mb-4">
                <h3 className="font-semibold mb-3 text-[var(--foreground)]">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="border-b pb-4 mb-4">
                <h3 className="font-semibold mb-3 text-[var(--foreground)]">Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="border-b pb-4 mb-4">
                <h3 className="font-semibold mb-3 text-[var(--foreground)]">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <h3 className="font-semibold mb-3 text-[var(--foreground)]">Segurança</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="border-t pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
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
                    <Link href="/terms" target="_blank" className="text-[var(--secondary)] hover:underline">
                      Termos de Uso
                    </Link>{' '}
                    e a{' '}
                    <Link href="/privacy" target="_blank" className="text-[var(--secondary)] hover:underline">
                      Política de Privacidade
                    </Link>
                    . Estou ciente de que meus dados serão tratados em conformidade com a LGPD.
                  </span>
                </label>
                {errors.lgpdConsent && (
                  <p className="text-red-500 text-sm mt-1">{errors.lgpdConsent}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </Button>

              <p className="text-center text-sm text-[var(--muted-foreground)]">
                Já tem conta?{' '}
                <Link href={APP_ROUTES.login} className="text-[var(--secondary)] hover:underline">
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

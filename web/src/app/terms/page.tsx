'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[var(--foreground)] mb-8">
          Termos de Uso
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>1. Introdução</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>
              Bem-vindo à ASCESA - Associação dos Servidores do Sicoob. Ao acessar e utilizar
              nossa plataforma, você concorda com os termos de uso descritos neste documento.
            </p>
            <p>
              A ASCESA é uma associação sem fins lucrativos dedicada a oferecer benefícios
              e vantagens aos seus associados, servidores do Sicoob.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. Elegibilidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>
              Podem se tornar associados da ASCESA:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Servidores ativos do Sicoob</li>
              <li>Funcionários de cooperativas filiadas</li>
              <li>Dependentes de associados ativos</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. Cadastro e Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>
              Ao realizar o cadastro, você concorda em fornecer informações verdadeiras,
              precisas e completas. Você é responsável por manter a confidencialidade
              de sua senha e por todas as atividades realizadas em sua conta.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>4. Uso dos Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>
              A ASCESA coleta e utiliza seus dados pessoais exclusivamente para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gestão da associação e comunicação com associados</li>
              <li>Prestação de serviços e benefícios</li>
              <li>Cumprimento de obrigações legais</li>
              <li>Melhoria de nossos serviços</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>5. Direitos do Associado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>
              Em conformidade com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acesso aos seus dados pessoais</li>
              <li>Correção de dados incompletos ou incorretos</li>
              <li>Exclusão de dados (quando aplicável)</li>
              <li>Portabilidade dos dados</li>
              <li>Revogação do consentimento</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>6. Pagamentos e Mensalidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>
              Os associados contribuem com mensalidades conformeregimento interno.
              O não pagamento pode resultar na suspensão de benefícios e,
              em último caso, exclusão da associação.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>7. Disposições Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>
              Estes termos podem ser alterados a qualquer tempo. As alterações
              serão comunicadas aos associados através do site ou e-mail.
            </p>
            <p>
              Para dúvidas, entre em contato através da nossa central de atendimento.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-[var(--muted-foreground)]">
            Última atualização: Fevereiro/2026
          </p>
          <Link href="/privacy" className="text-[var(--secondary)] hover:underline mt-2 inline-block">
            Ver Política de Privacidade →
          </Link>
        </div>
      </div>
    </div>
  );
}

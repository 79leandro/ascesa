'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[var(--foreground)] mb-8">
          Política de Privacidade
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>1. Introdução</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>
              A ASCESA está comprometida com a proteção de seus dados pessoais.
              Esta política descreve como coletamos, utilizamos e protegemos suas informações
              em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. Dados Coletados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>Coletamos os seguintes dados pessoais:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dados de identificação:</strong> Nome completo, CPF, RG, data de nascimento</li>
              <li><strong>Contato:</strong> Endereço, telefone, e-mail</li>
              <li><strong>Profissionais:</strong> Cargo, departamento, local de trabalho</li>
              <li><strong>Dados financeiros:</strong> Informações de pagamento (quando aplicável)</li>
              <li><strong>Dados de acesso:</strong> IP, navegador, páginas visitadas</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. Finalidade do Tratamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>Seus dados são utilizados para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gestão cadastral e administrativa da associação</li>
              <li>Prestação de serviços e benefícios aos associados</li>
              <li>Comunicação institucional</li>
              <li>Cumprimento de obrigações legais e regulatórias</li>
              <li>Elaboração de relatórios e estatísticas</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>4. Compartilhamento de Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>
              A ASCESA não vende seus dados pessoais. Podemos compartilhar dados com:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Parceiros e prestadores de serviços (para prestação de benefícios)</li>
              <li>Órgãos públicos (quando exigido por lei)</li>
              <li>Instituições financeiras (para processamento de pagamentos)</li>
            </ul>
            <p>
              Todos os compartilhamentos são realizados em conformidade com a LGPD.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>5. Armazenamento e Segurança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>
              Armazenamos seus dados em servidores seguros com medidas de proteção
              técnicas e administrativas adequadas. O acesso é restrito a pessoas autorizadas.
            </p>
            <p>
              Os dados serão mantidos pelo período necessário para as finalidades
              descritas nesta política, ou conforme exigido por lei.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>6. Seus Direitos (LGPD)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>Você tem os seguintes direitos:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Confirmação:</strong> Saber se tratamos seus dados</li>
              <li><strong>Acesso:</strong> Obter uma cópia dos seus dados</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incorretos</li>
              <li><strong>Exclusão:</strong> Solicitar exclusão de dados (quando aplicável)</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato legível</li>
              <li><strong>Oposição:</strong> Opor-se ao tratamento de dados</li>
              <li><strong>Revogação:</strong> Revogar consentimento a qualquer tempo</li>
            </ul>
            <p>
              Para exercer seus direitos, entre em contato através do e-mail:
              privacidade@ascesa.com.br
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>7. Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--muted-foreground)]">
            <p>
              Em caso de dúvidas sobre esta política ou para exercer seus direitos,
              entre em contato:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>E-mail:</strong> privacidade@ascesa.com.br</li>
              <li><strong>Telefone:</strong> (61) 3200-0000</li>
              <li><strong>Endereço:</strong> SCN Quadra 5, Bloco A - Asa Norte, Brasília, DF</li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-[var(--muted-foreground)]">
            Última atualização: Fevereiro/2026
          </p>
          <Link href="/terms" className="text-[var(--secondary)] hover:underline mt-2 inline-block">
            ← Ver Termos de Uso
          </Link>
        </div>
      </div>
    </div>
  );
}

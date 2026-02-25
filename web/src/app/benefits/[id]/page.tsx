'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const benefits = [
  {
    id: 1,
    category: 'Saúde',
    name: 'Desconto em Farmácias',
    partner: 'Drogaria Popular',
    description: 'Até 30% de desconto em medicamentos e produtos de beleza. Medicamentos genéricos com preço especial e produtos de higiene pessoal com desconto exclusivo para associados ASCESA.',
    discount: '30%',
    contact: '(31) 3200-0001',
    address: 'Av. João Pessoa, 1350 - Belo Horizonte, MG',
    instructions: 'Apresente sua carteirinha digital ou código de associado no momento da compra.',
  },
  {
    id: 2,
    category: 'Saúde',
    name: 'Plano de Saúde',
    partner: 'Sicoob Saúde',
    description: 'Planos odontológicos e de saúde com condições especiais para associados e familiares.',
    discount: '20%',
    contact: '(31) 3200-0002',
    address: 'www.sicoobsaude.com.br',
    instructions: 'Acesse o site ou compareça a uma unidade com seu código de associado.',
  },
  {
    id: 3,
    category: 'Educação',
    name: 'Desconto em Faculdades',
    partner: 'Unec',
    description: 'Bolsa de estudos e descontos em cursos de graduação e pós-graduação.',
    discount: '25%',
    contact: '(31) 3200-0003',
    address: 'www.unec.com.br',
    instructions: 'Informe o código de associado no momento da matrícula.',
  },
  {
    id: 4,
    category: 'Educação',
    name: 'Cursos Online',
    partner: 'Várias Plataformas',
    description: 'Descontos em plataformas de cursos online como Udemy, Coursera e outras.',
    discount: '15%',
    contact: 'www.ascesa.com.br/cursos',
    address: 'Online',
    instructions: 'Use o código ASCESA no checkout das plataformas parceiras.',
  },
  {
    id: 5,
    category: 'Serviços',
    name: 'Assistência Funeral',
    partner: 'Serviços Funerários',
    description: 'Cobertura completa para associados e familiares com condições especiais.',
    discount: '40%',
    contact: '(31) 3200-0005',
    address: 'www.servicosfunerarios.com.br',
    instructions: 'Entre em contato para contratar o serviço.',
  },
  {
    id: 6,
    category: 'Lazer',
    name: 'Descontos em Hotéis',
    partner: 'Rede de Hotéis',
    description: 'Pacotes de hospedagem com preços especiais em hotéis parceiros.',
    discount: '20%',
    contact: '(31) 3200-0006',
    address: 'Various locations',
    instructions: 'Informe o código de associado no momento da reserva.',
  },
];

export default function BenefitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [benefit, setBenefit] = useState<typeof benefits[0] | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const id = parseInt(params.id as string);
    const found = benefits.find((b) => b.id === id);
    if (found) {
      setBenefit(found);
    }
  }, [params.id]);

  if (!benefit) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Convênio não encontrado.</p>
        <Link href="/benefits">
          <Button className="mt-4">Voltar aos Benefícios</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/benefits" className="text-[var(--secondary)] hover:underline mb-4 inline-block">
        ← Voltar aos Benefícios
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-[var(--border)] p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-medium text-[var(--secondary)] uppercase">
                {benefit.category}
              </span>
              <h1 className="text-3xl font-bold text-[var(--foreground)] mt-2">
                {benefit.name}
              </h1>
              <p className="text-lg text-[var(--muted-foreground)] mt-1">
                {benefit.partner}
              </p>
            </div>
            <span className="bg-[var(--secondary)] text-white text-xl font-bold px-6 py-2 rounded-full">
              {benefit.discount}
            </span>
          </div>

          <p className="text-[var(--foreground)] mb-8">{benefit.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-[var(--gray-50)] rounded-lg">
              <h3 className="font-semibold text-[var(--foreground)] mb-2">📞 Contato</h3>
              <p className="text-[var(--muted-foreground)]">{benefit.contact}</p>
            </div>
            <div className="p-4 bg-[var(--gray-50)] rounded-lg">
              <h3 className="font-semibold text-[var(--foreground)] mb-2">📍 Endereço</h3>
              <p className="text-[var(--muted-foreground)]">{benefit.address}</p>
            </div>
          </div>

          <div className="p-4 bg-[var(--primary)] bg-opacity-10 rounded-lg mb-8">
            <h3 className="font-semibold text-[var(--foreground)] mb-2">ℹ️ Como Utilizar</h3>
            <p className="text-[var(--foreground)]">{benefit.instructions}</p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setIsFavorite(!isFavorite)}
              variant={isFavorite ? 'primary' : 'outline'}
            >
              {isFavorite ? '❤️ Favorito' : '🤍 Favoritar'}
            </Button>
            <Button variant="secondary">📱 Baixar Carteirinha</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

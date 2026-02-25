'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const benefits = [
  {
    id: 1,
    category: 'Saúde',
    name: 'Desconto em Farmácias',
    partner: 'Drogaria Popular',
    description: 'Até 30% de desconto em medicamentos e produtos de beleza',
    discount: '30%',
  },
  {
    id: 2,
    category: 'Saúde',
    name: 'Plano de Saúde',
    partner: 'Sicoob Saúde',
    description: 'Planos odontológicos e de saúde com condições especiais',
    discount: '20%',
  },
  {
    id: 3,
    category: 'Educação',
    name: 'Desconto em Faculdades',
    partner: 'Unec',
    description: 'Bolsa de estudos e descontos em cursos de graduação e pós',
    discount: '25%',
  },
  {
    id: 4,
    category: 'Educação',
    name: 'Cursos Online',
    partner: ' várias',
    description: 'Descontos em plataformas de cursos online',
    discount: '15%',
  },
  {
    id: 5,
    category: 'Serviços',
    name: 'Assistência Funeral',
    partner: 'Serv funerários',
    description: 'Cobertura completa para associados e familiares',
    discount: '40%',
  },
  {
    id: 6,
    category: 'Lazer',
    name: 'Descontos em Hotéis',
    partner: 'Rede de Hotéis',
    description: 'Pacotes de hospedagem com preços especiais',
    discount: '20%',
  },
];

const categories = ['Todas', 'Saúde', 'Educação', 'Serviços', 'Lazer'];

export default function BenefitsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');

  const filteredBenefits = benefits.filter((benefit) => {
    const matchesSearch = benefit.name.toLowerCase().includes(search.toLowerCase()) ||
      benefit.partner.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Todas' || benefit.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-[var(--foreground)] mb-4">
        Nossos Benefícios
      </h1>
      <p className="text-center text-[var(--muted-foreground)] mb-12">
        Descubra todas as vantagens exclusivas para associados ASCESA
      </p>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
        <Input
          placeholder="Buscar benefícios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--gray-100)] text-[var(--foreground)] hover:bg-[var(--gray-200)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Benefícios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBenefits.map((benefit) => (
          <Card key={benefit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-medium text-[var(--secondary)] uppercase">
                    {benefit.category}
                  </span>
                  <CardTitle className="mt-1">{benefit.name}</CardTitle>
                </div>
                <span className="bg-[var(--secondary)] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {benefit.discount}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)] mb-2">
                <strong>Parceiro:</strong> {benefit.partner}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBenefits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--muted-foreground)]">
            Nenhum benefício encontrado com os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}

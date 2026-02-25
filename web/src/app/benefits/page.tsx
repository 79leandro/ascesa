'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Benefit {
  id: string;
  name: string;
  description: string | null;
  category: string;
  partnerName: string | null;
  partnerLogo: string | null;
  discount: string | null;
  image: string | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

const categories = ['Todas', 'Saúde', 'Educação', 'Serviços', 'Lazer', 'Outros'];

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      // Fetch only active benefits for the public page
      const res = await fetch(`${API_ENDPOINTS.benefits.list}?active=true`);
      const data = await res.json();
      if (data.success) {
        setBenefits(data.benefits);
      }
    } catch (error) {
      console.error('Error fetching benefits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBenefits = benefits.filter((benefit) => {
    const matchesSearch =
      benefit.name.toLowerCase().includes(search.toLowerCase()) ||
      (benefit.partnerName && benefit.partnerName.toLowerCase().includes(search.toLowerCase())) ||
      (benefit.description && benefit.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === 'Todas' || benefit.category === category;
    return matchesSearch && matchesCategory;
  });

  // Get featured benefits to show first
  const featuredBenefits = filteredBenefits.filter(b => b.isFeatured);
  const regularBenefits = filteredBenefits.filter(b => !b.isFeatured);
  const displayBenefits = [...featuredBenefits, ...regularBenefits];

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

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-[var(--muted-foreground)]">Carregando benefícios...</p>
        </div>
      ) : (
        <>
          {/* Lista de Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBenefits.map((benefit) => (
              <Card key={benefit.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-medium text-[var(--secondary)] uppercase">
                        {benefit.category}
                      </span>
                      <CardTitle className="mt-1">{benefit.name}</CardTitle>
                    </div>
                    {benefit.discount && (
                      <span className="bg-[var(--secondary)] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {benefit.discount}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {benefit.partnerName && (
                    <p className="text-sm text-[var(--muted-foreground)] mb-2">
                      <strong>Parceiro:</strong> {benefit.partnerName}
                    </p>
                  )}
                  {benefit.description && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {benefit.description}
                    </p>
                  )}
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
        </>
      )}
    </div>
  );
}

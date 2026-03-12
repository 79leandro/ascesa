'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Tag, Building2 } from 'lucide-react';

interface Benefit {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: string;
  nomeParceiro: string | null;
  logoParceiro: string | null;
  desconto: string | null;
  imagem: string | null;
  ativo: boolean;
  destacado: boolean;
  ordem: number;
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
      const res = await fetch(`${API_ENDPOINTS.beneficios.list}?ativo=true`);
      const data = await res.json();
      if (data.success) {
        setBenefits(data.beneficios);
      }
    } catch (error) {
      console.error('Error fetching benefits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBenefits = benefits.filter((benefit) => {
    const matchesSearch =
      benefit.nome.toLowerCase().includes(search.toLowerCase()) ||
      (benefit.nomeParceiro && benefit.nomeParceiro.toLowerCase().includes(search.toLowerCase())) ||
      (benefit.descricao && benefit.descricao.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === 'Todas' || benefit.categoria === category;
    return matchesSearch && matchesCategory;
  });

  // Get featured benefits to show first
  const featuredBenefits = filteredBenefits.filter(b => b.destacado);
  const regularBenefits = filteredBenefits.filter(b => !b.destacado);
  const displayBenefits = [...featuredBenefits, ...regularBenefits];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[var(--secondary)]/10 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-[var(--secondary)]" />
          <span className="text-sm font-medium text-[var(--secondary)]">Beneficios Exclusivos</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4">
          Nossos <span className="text-gradient">Benefícios</span>
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
          Descubra todas as vantagens exclusivas para associados ASCESA
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-4xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Buscar benefícios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                category === cat
                  ? 'bg-[var(--primary)] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-[var(--gray-100)] text-[var(--foreground)] hover:bg-[var(--gray-200)] hover:shadow-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Carregando benefícios...</p>
        </div>
      ) : (
        <>
          {/* Featured Badge */}
          {featuredBenefits.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--warning)]" />
                Benefícios em Destaque
              </h2>
            </div>
          )}

          {/* Lista de Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBenefits.map((benefit, index) => (
              <Card
                key={benefit.id}
                className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-2 card-glow group ${benefit.destacado ? 'ring-2 ring-[var(--secondary)] ring-opacity-50' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {benefit.destacado && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Destaque
                    </span>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--secondary)] uppercase tracking-wide bg-[var(--secondary)]/10 px-3 py-1 rounded-full">
                        {benefit.categoria}
                      </span>
                      <CardTitle className="mt-3 text-lg leading-tight">{benefit.nome}</CardTitle>
                    </div>
                    {benefit.desconto && (
                      <span className="bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary-light)] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {benefit.desconto}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {benefit.nomeParceiro && (
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <p className="text-sm text-[var(--muted-foreground)]">
                        <strong className="text-[var(--foreground)]">Parceiro:</strong> {benefit.nomeParceiro}
                      </p>
                    </div>
                  )}
                  {benefit.descricao && (
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-3">
                      {benefit.descricao}
                    </p>
                  )}
                  <Button variant="outline" className="w-full mt-4 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBenefits.length === 0 && (
            <div className="text-center py-20 bg-[var(--gray-50)] rounded-2xl">
              <div className="w-16 h-16 bg-[var(--gray-200)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[var(--muted-foreground)]" />
              </div>
              <p className="text-lg text-[var(--muted-foreground)]">
                Nenhum benefício encontrado com os filtros selecionados.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => { setSearch(''); setCategory('Todas'); }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

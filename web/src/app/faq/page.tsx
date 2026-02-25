'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'Como posso me tornar associado da ASCESA?',
    answer: 'Para se tornar associado, basta acessar a página de cadastro e preencher o formulário com seus dados. Após o preenchimento, nossa equipe analisará sua solicitação e você receberá um email de confirmação.',
  },
  {
    question: 'Quais são os benefícios de ser associado?',
    answer: 'Os associados da ASCESA têm acesso a diversos benefícios incluindo descontos em farmácias, instituições de ensino, assistência funeral, convênios com empresas parceiras e muito mais.',
  },
  {
    question: 'Quanto custa para me associar?',
    answer: 'Os valores de associação podem variar. Entre em contato conosco para mais informações sobre planos e valores.',
  },
  {
    question: 'Como posso usar os convênios?',
    answer: 'Após aprovação do seu cadastro, você receberá um código de associado. Apresente este código nos estabelecimentos parceiros para aproveitar os descontos.',
  },
  {
    question: 'Posso incluir meus familiares no plano?',
    answer: 'Sim, a ASCESA oferece planos familiares. Entre em contato para verificar as opções disponíveis.',
  },
  {
    question: 'Como funciona a carteirinha digital?',
    answer: 'A carteirinha digital está disponível na área do associado após o login. Você pode apresentá-la diretamente do seu celular nos estabelecimentos parceiros.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-[var(--foreground)] mb-4">
        Perguntas Frequentes
      </h1>
      <p className="text-center text-[var(--muted-foreground)] mb-12 max-w-2xl mx-auto">
        Tire suas dúvidas sobre a ASCESA e seus benefícios
      </p>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-[var(--border)] rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center bg-white dark:bg-gray-800 hover:bg-gray-50"
            >
              <span className="font-medium text-[var(--foreground)]">
                {faq.question}
              </span>
              <span className="text-[var(--secondary)] text-2xl ml-4">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
                <p className="text-[var(--muted-foreground)]">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-[var(--muted-foreground)] mb-4">
          Não encontrou a resposta que procura?
        </p>
        <a href="/contact" className="text-[var(--secondary)] hover:underline">
          Fale Conosco
        </a>
      </div>
    </div>
  );
}

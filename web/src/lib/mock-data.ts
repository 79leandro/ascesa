// Mock data for development and testing
// Use this data when API is not available

// Benefits
export const mockBenefits = [
  { id: '1', nome: 'Plano de Saúde Premium', descricao: 'Plano de saúde completo com cobertura nacional', categoria: 'Saúde', nomeParceiro: 'Unimed', desconto: '30%', ativo: true, destacado: true, ordem: 1 },
  { id: '2', nome: 'Desconto em Medicamentos', descricao: 'Descontos especiais em farmácias parceiras', categoria: 'Saúde', nomeParceiro: 'Drogaria Pacheco', desconto: '25%', ativo: true, destacado: false, ordem: 2 },
  { id: '3', nome: 'Academia Smart Fit', descricao: 'Acesso a academias em todo o Brasil', categoria: 'Lazer', nomeParceiro: 'Smart Fit', desconto: '40%', ativo: true, destacado: true, ordem: 3 },
  { id: '4', nome: 'Educação Premium', descricao: 'Descontos em cursos e pós-graduações', categoria: 'Educação', nomeParceiro: 'PUC', desconto: '35%', ativo: true, destacado: false, ordem: 4 },
  { id: '5', nome: 'Seguro de Vida', descricao: 'Seguro de vida com cobertura completa', categoria: 'Saúde', nomeParceiro: 'Bradesco Seguros', desconto: '20%', ativo: false, destacado: false, ordem: 5 },
  { id: '6', nome: 'Parque de Diversões', descricao: 'Descontos em parques e diversão', categoria: 'Lazer', nomeParceiro: 'Hopihari', desconto: '15%', ativo: true, destacado: false, ordem: 6 },
  { id: '7', nome: 'Curso de Idiomas', descricao: 'Descontos em cursos de inglês e espanhol', categoria: 'Educação', nomeParceiro: 'Wizard', desconto: '30%', ativo: true, destacado: true, ordem: 7 },
  { id: '8', nome: 'Massagem e Spá', descricao: 'Descontos em serviços de bem-estar', categoria: 'Lazer', nomeParceiro: 'Sthai Spá', desconto: '25%', ativo: true, destacado: false, ordem: 8 },
];

// Partners
export const mockPartners = [
  { id: '1', nome: 'Unimed', cnpj: '12.345.678/0001-90', telefone: '(11) 4000-0000', email: 'contato@unimed.com.br', endereco: 'Av. Paulista, 1000 - São Paulo', ativo: true, categoria: 'Saúde' },
  { id: '2', nome: 'Smart Fit', cnpj: '23.456.789/0001-01', telefone: '(11) 3000-0000', email: 'contato@smartfit.com.br', 'endereco': 'Av. Rebouças, 500 - São Paulo', ativo: true, categoria: 'Lazer' },
  { id: '3', nome: 'Drogaria Pacheco', cnpj: '34.567.890/0001-12', telefone: '(11) 2500-0000', email: 'contato@pacheco.com.br', 'endereco': 'Av. Brasil, 200 - São Paulo', ativo: true, categoria: 'Saúde' },
  { id: '4', nome: 'Wizard Idiomas', cnpj: '45.678.901/0001-23', telefone: '(11) 3500-0000', email: 'contato@wizard.com.br', 'endereco': 'Av. Paulista, 500 - São Paulo', ativo: true, categoria: 'Educação' },
  { id: '5', nome: 'PUC', cnpj: '56.789.012/0001-34', telefone: '(11) 4500-0000', email: 'contato@puc.com.br', 'endereco': 'Av. Moreira de Freitas, 100 - São Paulo', ativo: true, categoria: 'Educação' },
  { id: '6', nome: 'Hopihari', cnpj: '67.890.123/0001-45', telefone: '(11) 5500-0000', email: 'contato@hopihari.com.br', 'endereco': 'Av. Marginal, 300 - São Paulo', ativo: false, categoria: 'Lazer' },
];

// Associates
export const mockAssociates = [
  { id: '1', nome: 'João Silva', cpf: '123.456.789-00', email: 'joao.silva@email.com', telefone: '(11) 99999-0001', dataNascimento: '1985-03-15', dataAssociacao: '2020-01-15', status: 'ATIVO', matricula: 'A001' },
  { id: '2', nome: 'Maria Santos', cpf: '234.567.890-11', email: 'maria.santos@email.com', telefone: '(11) 99999-0002', dataNascimento: '1990-07-22', dataAssociacao: '2021-03-10', status: 'ATIVO', matricula: 'A002' },
  { id: '3', nome: 'Pedro Oliveira', cpf: '345.678.901-22', email: 'pedro.oliveira@email.com', telefone: '(11) 99999-0003', dataNascimento: '1978-11-05', dataAssociacao: '2019-06-20', status: 'ATIVO', matricula: 'A003' },
  { id: '4', nome: 'Ana Costa', cpf: '456.789.012-33', email: 'ana.costa@email.com', telefone: '(11) 99999-0004', dataNascimento: '1995-01-30', dataAssociacao: '2022-02-14', status: 'PENDENTE', matricula: 'A004' },
  { id: '5', nome: 'Carlos Pereira', cpf: '567.890.123-44', email: 'carlos.pereira@email.com', telefone: '(11) 99999-0005', dataNascimento: '1982-09-12', dataAssociacao: '2018-08-25', status: 'ATIVO', matricula: 'A005' },
  { id: '6', nome: 'Fernanda Lima', cpf: '678.901.234-55', email: 'fernanda.lima@email.com', telefone: '(11) 99999-0006', dataNascimento: '1988-04-18', dataAssociacao: '2020-11-30', status: 'INATIVO', matricula: 'A006' },
  { id: '7', nome: 'Roberto Alves', cpf: '789.012.345-66', email: 'roberto.alves@email.com', telefone: '(11) 99999-0007', dataNascimento: '1975-12-03', dataAssociacao: '2017-05-15', status: 'ATIVO', matricula: 'A007' },
  { id: '8', nome: 'Juliana Ferreira', cpf: '890.123.456-77', email: 'juliana.ferreira@email.com', telefone: '(11) 99999-0008', dataNascimento: '1992-06-25', dataAssociacao: '2021-09-10', status: 'ATIVO', matricula: 'A008' },
];

// Payments
export const mockPayments = [
  { id: '1', associadoId: '1', associadoNome: 'João Silva', valor: 150.00, mesReferencia: '2026-02', dataVencimento: '2026-02-10', dataPagamento: '2026-02-08', status: 'PAGO', formaPagamento: 'Boleto' },
  { id: '2', associadoId: '2', associadoNome: 'Maria Santos', valor: 150.00, mesReferencia: '2026-02', dataVencimento: '2026-02-10', dataPagamento: null, status: 'PENDENTE', formaPagamento: null },
  { id: '3', associadoId: '3', associadoNome: 'Pedro Oliveira', valor: 150.00, mesReferencia: '2026-02', dataVencimento: '2026-02-10', dataPagamento: '2026-02-12', status: 'ATRASADO', formaPagamento: 'PIX' },
  { id: '4', associadoId: '5', associadoNome: 'Carlos Pereira', valor: 150.00, mesReferencia: '2026-01', dataVencimento: '2026-01-10', dataPagamento: '2026-01-05', status: 'PAGO', formaPagamento: 'Débito' },
  { id: '5', associadoId: '7', associadoNome: 'Roberto Alves', valor: 150.00, mesReferencia: '2026-01', dataVencimento: '2026-01-10', dataPagamento: '2026-01-09', status: 'PAGO', formaPagamento: 'Boleto' },
  { id: '6', associadoId: '8', associadoNome: 'Juliana Ferreira', valor: 150.00, mesReferencia: '2026-02', dataVencimento: '2026-02-10', dataPagamento: null, status: 'PENDENTE', formaPagamento: null },
  { id: '7', associadoId: '1', associadoNome: 'João Silva', valor: 150.00, mesReferencia: '2026-01', dataVencimento: '2026-01-10', dataPagamento: '2026-01-07', status: 'PAGO', formaPagamento: 'PIX' },
  { id: '8', associadoId: '2', associadoNome: 'Maria Santos', valor: 150.00, mesReferencia: '2026-01', dataVencimento: '2026-01-10', dataPagamento: '2026-01-15', status: 'ATRASADO', formaPagamento: 'Boleto' },
];

// Events
export const mockEvents = [
  { id: '1', titulo: 'Palestra sobre Investimentos', descricao: 'Aprenda a investir seu dinheiro de forma inteligente', data: '2026-03-15', hora: '19:00', local: 'Auditório Principal', capacidade: 100, inscricoes: 45, ativo: true, gratuito: true },
  { id: '2', nome: 'Workshop de Inteligência Artificial', descricao: 'Introdução ao mundo da IA e machine learning', data: '2026-03-20', hora: '14:00', local: 'Sala de Treinamento', capacidade: 30, inscricoes: 28, ativo: true, gratuito: true },
  { id: '3', nome: 'Confraternização de Final de Ano', descricao: 'Evento de integração entre associados', data: '2025-12-20', hora: '20:00', local: 'Chácara Recanto', capacidade: 200, inscricoes: 180, ativo: false, gratuito: true },
  { id: '4', nome: 'Curso de Oratória', descricao: 'Aprenda a falar em público com confiança', data: '2026-04-05', hora: '09:00', local: 'Sala de Treinamento', capacidade: 25, inscricoes: 10, ativo: true, gratuito: false, valor: 150.00 },
  { id: '5', nome: 'Feira de Oportunidades', descricao: 'Eventos com empresas parceiras oferecendo vagas', data: '2026-04-10', hora: '10:00', local: 'Estacionamento', capacidade: 500, inscricoes: 200, ativo: true, gratuito: true },
  { id: '6', nome: 'Seminário de Saúde', descricao: 'Palestras sobre cuidados com a saúde', data: '2026-03-25', hora: '08:00', local: 'Auditório Principal', capacidade: 150, ativo: true, gratuito: true },
];

// Documents
export const mockDocuments = [
  { id: '1', titulo: 'Estatuto Social', descricao: 'Documento que rege o funcionamento da associação', tipo: 'Estatuto', arquivo: 'estatuto.pdf', dataUpload: '2024-01-15', Tamanho: '2.3 MB', downloads: 1250, ativo: true },
  { id: '2', nome: 'Regimento Interno', descricao: 'Normas e procedimentos internos', tipo: 'Regimento', arquivo: 'regimento.pdf', dataUpload: '2024-01-15', tamanho: '1.8 MB', downloads: 890, ativo: true },
  { id: '3', nome: 'Demonstrações Financeiras 2025', descricao: 'Balanço patrimonial e demostrativos financeiros', tipo: 'Financeiro', arquivo: 'financeiro2025.pdf', dataUpload: '2026-01-31', tamanho: '5.2 MB', downloads: 450, ativo: true },
  { id: '4', nome: 'ATA Reunião Diretoria', descricao: 'ATA da reunião de diretoria de janeiro/2026', tipo: 'ATA', arquivo: 'ata012026.pdf', dataUpload: '2026-01-20', tamanho: '0.5 MB', downloads: 120, ativo: true },
  { id: '5', nome: 'Manual do Associado', descricao: 'Guia completo com informações para associados', tipo: 'Manual', arquivo: 'manual.pdf', dataUpload: '2025-06-10', tamanho: '3.1 MB', downloads: 2100, ativo: true },
  { id: '6', nome: 'Código de Ética', descricao: 'Normas de condutas e ética profissional', tipo: 'Políticas', arquivo: 'codigo_etica.pdf', dataUpload: '2024-03-01', tamanho: '1.2 MB', downloads: 780, ativo: false },
];

// Blog Posts
export const mockBlogPosts = [
  { id: '1', titulo: '5 Dicas para Investir seu Dinheiro', slug: '5-dicas-investir', conteudo: 'Aprenda as melhores estratégias...', imagem: '/blog/investimentos.jpg', autor: 'Carlos Silva', categoria: 'Finanças', dataPublicacao: '2026-02-28', visualizacoes: 1250, ativo: true, destaque: true },
  { id: '2', titulo: 'Nova Parceria com Smart Fit', slug: 'nova-parceria-smart-fit', conteudo: 'Temos uma novidade...', imagem: '/blog/parceria.jpg', autor: 'Maria Santos', categoria: 'Parcerias', dataPublicacao: '2026-02-25', visualizacoes: 890, ativo: true, destaque: true },
  { id: '3', titulo: 'Cuidados com a Saúde Mental', slug: 'saude-mental', conteudo: 'A saúde mental é fundamental...', imagem: '/blog/saude.jpg', autor: 'Dr. Pedro Lima', categoria: 'Saúde', dataPublicacao: '2026-02-20', visualizacoes: 2100, ativo: true, destaque: false },
  { id: '4', titulo: 'Assembleia Geral Ordinária 2026', slug: 'assembleia-2026', conteudo: 'Convidamos todos...', imagem: '/blog/assembleia.jpg', autor: 'Diretoria', categoria: 'Institucional', dataPublicacao: '2026-02-15', visualizacoes: 3200, ativo: true, destaque: true },
  { id: '5', titulo: 'Como usar seus benefícios', slug: 'como-usar-beneficios', conteudo: 'Aprenda a maximizar...', imagem: '/blog/beneficios.jpg', autor: 'Ana Costa', categoria: 'Benefícios', dataPublicacao: '2026-02-10', visualizacoes: 1560, ativo: true, destaque: false },
  { id: '6', titulo: 'Novidade: App ASCESA', slug: 'novidade-app', conteudo: 'Em breve lançaremos...', imagem: '/blog/app.jpg', autor: 'Tech Team', categoria: 'Tecnologia', dataPublicacao: '2026-03-01', visualizacoes: 4500, ativo: true, destaque: true },
];

// Forum
export const mockForumPosts = [
  { id: '1', titulo: 'Dúvida sobre plano de saúde', conteudo: 'Alguém sabe como funciona o plano da Unimed?', autorId: '1', autorNome: 'João Silva', categoria: 'Saúde', dataCriacao: '2026-02-28', respostas: 5, visualizacoes: 120, ativo: true, resolvido: false },
  { id: '2', titulo: 'Experiência com academia Smart Fit', conteudo: 'Queria saber a opinião de quem já usa...', autorId: '2', autorNome: 'Maria Santos', categoria: 'Lazer', dataCriacao: '2026-02-25', respostas: 12, visualizacoes: 340, ativo: true, resolvido: true },
  { id: '3', titulo: 'Quando será a próxima Assembleia?', conteudo: 'Alguém tem informações sobre...', autorId: '3', autorNome: 'Pedro Oliveira', categoria: 'Institucional', dataCriacao: '2026-02-20', respostas: 8, visualizacoes: 560, ativo: true, resolvido: true },
  { id: '4', titulo: 'Dúvida sobre mensalidade', conteudo: 'Qual o valor da mensalidade para 2026?', autorId: '4', autorNome: 'Ana Costa', categoria: 'Financeiro', dataCriacao: '2026-02-18', respostas: 3, visualizacoes: 180, ativo: true, resolvido: false },
  { id: '5', titulo: 'App não está funcionando', conteudo: 'Estou tentando acessar e dá erro...', autorId: '5', autorNome: 'Carlos Pereira', categoria: 'Tecnologia', dataCriacao: '2026-02-15', respostas: 15, visualizacoes: 420, ativo: false, resolvido: true },
];

// Showcase (Vitrine de Associados)
export const mockShowcase = [
  { id: '1', nome: 'João Silva - Designer', profissao: 'Designer Gráfico', telefone: '(11) 99999-0001', email: 'joao@email.com', instagram: '@joaodesign',Linkedin: 'linkedin.com/in/joaosilva', ativo: true, destaque: true },
  { id: '2', nome: 'Maria Santos - Advogada', profissao: 'Advogada', telefone: '(11) 99999-0002', email: 'maria@email.com', instagram: '@mariaadvoga', Linkedin: 'linkedin.com/in/mariasantos', ativo: true, destaque: true },
  { id: '3', nome: 'Pedro Oliveira - Engenheiro', profissao: 'Engenheiro Civil', telefone: '(11) 99999-0003', email: 'pedro@email.com', instagram: '@pedroeng', Linkedin: 'linkedin.com/in/pedrooliveira', ativo: true, destaque: false },
  { id: '4', nome: 'Ana Costa - Fotógrafa', profissao: 'Fotógrafa', telefone: '(11) 99999-0004', email: 'ana@email.com', instagram: '@anafoto', Linkedin: 'linkedin.com/in/anacosta', ativo: true, destaque: true },
  { id: '5', nome: 'Carlos Pereira - Contador', profissao: 'Contador', telefone: '(11) 99999-0005', email: 'carlos@email.com', instagram: '@carloscontador', Linkedin: 'linkedin.com/in/carlospereira', ativo: false, destaque: false },
  { id: '6', nome: 'Roberto Alves - Arquiteto', profissao: 'Arquiteto', telefone: '(11) 99999-0007', email: 'roberto@email.com', instagram: '@robertoarq', Linkedin: 'linkedin.com/in/robertoalves', ativo: true, destaque: false },
];

// Assemblies
export const mockAssemblies = [
  { id: '1', titulo: 'Assembleia Geral Ordinária 2026', descricao: 'Reunião anual para prestação de contas e eleição da diretoria', data: '2026-03-15', hora: '19:00', local: 'Sede da ASCESA', tipo: 'Ordinária', ativo: true },
  { id: '2', titulo: 'Assembleia Extraordinária', descricao: 'Discussão sobre alteração estatutária', data: '2026-04-20', hora: '14:00', local: 'Sede da ASCESA', tipo: 'Extraordinária', ativo: true },
  { id: '3', titulo: 'Assembleia Geral Ordinária 2025', descricao: 'Reunião anual para prestação de contas', data: '2025-03-15', hora: '19:00', local: 'Sede da ASCESA', tipo: 'Ordinária', ativo: false },
];

// Reports (Dashboard Stats)
export const mockReports = {
  totalAssociados: 1247,
  associadosAtivos: 1089,
  associadosInativos: 158,
  mensalidadesPrevistas: 163350.00,
  mensalidadesRecebidas: 148200.00,
  mensalidadesPendentes: 15150.00,
  totalBeneficios: 156,
  beneficiosAtivos: 89,
  totalEventos: 24,
  eventosProximos: 6,
  novosAssociadosMes: 23,
  associadosCanceladosMes: 5,
};

// User types for authentication
export const mockUsers = [
  { id: '1', nome: 'Administrador', email: 'admin@ascesa.com.br', senha: 'admin123', tipo: 'ADMIN', ativo: true },
  { id: '2', nome: 'Diretor', email: 'diretor@ascesa.com.br', senha: 'diretor123', tipo: 'DIRETOR', ativo: true },
  { id: '3', nome: 'João Silva', email: 'joao.silva@email.com', senha: 'usuario123', tipo: 'USUARIO', ativo: true },
];

// Categories for benefits
export const mockCategories = {
  benefits: ['Saúde', 'Lazer', 'Educação', 'Financeiro', 'Vestuário', 'Alimentação', 'Outros'],
  partners: ['Saúde', 'Lazer', 'Educação', 'Financeiro', 'Varejo', 'Serviços'],
  forum: ['Saúde', 'Lazer', 'Institucional', 'Financeiro', 'Tecnologia', 'Outros'],
};

// Status translations
export const mockStatusLabels = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
  PAGO: 'Pago',
  ATRASADO: 'Atrasado',
};

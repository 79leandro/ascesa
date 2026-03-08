import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { StatusUsuario, Papel, StatusPagamento, StatusAssociado, TipoAssembleia, StatusAssembleia } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private prisma: PrismaService) {}

  async seedAll() {
    try {
      this.logger.log('========================================');
      this.logger.log('🚀 INICIANDO SEED COMPLETO...');
      this.logger.log('========================================');

      await this.seedAdmin();
      await this.seedBenefits();
      await this.seedPartners();
      await this.seedEvents();
      await this.seedAssemblies();
      await this.seedUsersAndAssociates();
      await this.seedPayments();
      await this.seedProducts();
      await this.seedForumTopics();
      await this.seedDocuments();

      this.logger.log('========================================');
      this.logger.log('✅ SEED COMPLETO FINALIZADO!');
      this.logger.log('========================================');
    } catch (error) {
      this.logger.error('❌ Erro no seed:', error);
    }
  }

  private async seedAdmin() {
    const adminEmail = 'admin@ascesa.com';
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await this.prisma.usuario.upsert({
      where: { email: adminEmail },
      update: { senha: hashedPassword },
      create: {
        nome: 'Administrador',
        email: adminEmail,
        senha: hashedPassword,
        cpf: '00000000000',
        telefone: '00000000000',
        papel: Papel.ADMIN,
        status: StatusUsuario.ATIVO,
      },
    });

    await this.prisma.administrador.upsert({
      where: { usuarioId: admin.id },
      update: {},
      create: {
        usuarioId: admin.id,
        departamento: 'TI',
        cargo: 'Desenvolvedor',
      },
    });

    // Create director user
    const directorEmail = 'diretor@ascesa.com';
    const directorPassword = await bcrypt.hash('diretor123', 10);

    const director = await this.prisma.usuario.upsert({
      where: { email: directorEmail },
      update: { senha: directorPassword },
      create: {
        nome: 'Diretor Geral',
        email: directorEmail,
        senha: directorPassword,
        cpf: '11111111111',
        telefone: '(11) 11111-1111',
        papel: Papel.ADMIN,
        status: StatusUsuario.ATIVO,
      },
    });

    await this.prisma.administrador.upsert({
      where: { usuarioId: director.id },
      update: {},
      create: {
        usuarioId: director.id,
        departamento: 'Diretoria',
        cargo: 'Diretor Geral',
      },
    });

    this.logger.log('✅ Admin: admin@ascesa.com / admin123');
    this.logger.log('✅ Diretor: diretor@ascesa.com / diretor123');
  }

  private async seedBenefits() {
    const benefits = [
      // Saúde
      { nome: 'Plano de Saúde Premium', slug: 'plano-saude-premium', descricao: 'Plano de saúde completo com cobertura nacional, atendimento 24h e telemedicina.', categoria: 'Saúde', nomeParceiro: 'Unimed', desconto: '30%', ativo: true, destacado: true, ordem: 1 },
      { nome: 'Desconto em Medicamentos', slug: 'desconto-medicamentos', descricao: 'Descontos especiais em farmácias parceiras em todo o Brasil.', categoria: 'Saúde', nomeParceiro: 'Drogaria Pacheco', desconto: '25%', ativo: true, destacado: false, ordem: 2 },
      { nome: 'Seguro de Vida', slug: 'seguro-de-vida', descricao: 'Seguro de vida com cobertura completa e preços especiais.', categoria: 'Saúde', nomeParceiro: 'Bradesco Seguros', desconto: '20%', ativo: false, destacado: false, ordem: 3 },
      { nome: 'Farmácia', slug: 'farmacia', descricao: 'Descontos em medicamentos e produtos de higiene.', categoria: 'Saúde', nomeParceiro: 'Drogaria Popular', desconto: '20%', ativo: true, destacado: true, ordem: 4 },
      { nome: 'Clínica Odontológica', slug: 'clinica-odontologica', descricao: 'Descontos em tratamentos odontológicos.', categoria: 'Saúde', nomeParceiro: 'OdontoCompany', desconto: '30%', ativo: true, destacado: false, ordem: 5 },
      { nome: 'Clínica de Olhos', slug: 'clinica-olhos', descricao: 'Exames de vista e óculos com desconto.', categoria: 'Saúde', nomeParceiro: 'Optical', desconto: '25%', ativo: true, destacado: false, ordem: 6 },
      { nome: 'Plano Veterinário', slug: 'plano-veterinario', descricao: 'Descontos em consultas e medicamentos para pets.', categoria: 'Saúde', nomeParceiro: 'Pet Saúde', desconto: '15%', ativo: true, destacado: false, ordem: 7 },

      // Lazer
      { nome: 'Academia Smart Fit', slug: 'academia-smart-fit', descricao: 'Acesso a academias em todo o Brasil com infraestrutura completa.', categoria: 'Lazer', nomeParceiro: 'Smart Fit', desconto: '40%', ativo: true, destacado: true, ordem: 8 },
      { nome: 'Parque de Diversões', slug: 'parque-diversoes', descricao: 'Descontos em parques de diversões e entretenimento.', categoria: 'Lazer', nomeParceiro: 'Hopihari', desconto: '15%', ativo: true, destacado: false, ordem: 9 },
      { nome: 'Massagem e Spá', slug: 'massagem-spa', descricao: 'Descontos em serviços de bem-estar, massagem e spa.', categoria: 'Lazer', nomeParceiro: 'Sthai Spá', desconto: '25%', ativo: true, destacado: false, ordem: 10 },
      { nome: 'Cinemark', slug: 'cinemark', descricao: 'Descontos em Ingressos de cinema.', categoria: 'Lazer', nomeParceiro: 'Cinemark', desconto: '30%', ativo: true, destacado: true, ordem: 11 },
      { nome: 'Ingressos Shows', slug: 'ingressos-shows', descricao: 'Descontos em shows e eventos.', categoria: 'Lazer', nomeParceiro: 'Ticket Agora', desconto: '20%', ativo: true, destacado: false, ordem: 12 },
      { nome: 'Academia BioRitmo', slug: 'academia-bioritmo', descricao: 'Acesso a academias com piscinas e modalidades.', categoria: 'Lazer', nomeParceiro: 'BioRitmo', desconto: '35%', ativo: true, destacado: false, ordem: 13 },

      // Educação
      { nome: 'Educação Premium', slug: 'educacao-premium', descricao: 'Descontos em cursos de graduação, pós-graduação e extensão.', categoria: 'Educação', nomeParceiro: 'PUC', desconto: '35%', ativo: true, destacado: false, ordem: 14 },
      { nome: 'Curso de Idiomas', slug: 'curso-idiomas', descricao: 'Descontos em cursos de inglês, espanhol, francês e alemão.', categoria: 'Educação', nomeParceiro: 'Wizard', desconto: '30%', ativo: true, destacado: true, ordem: 15 },
      { nome: 'Material Escolar', slug: 'material-escolar', descricao: 'Descontos em papelarias e livrarias.', categoria: 'Educação', nomeParceiro: 'Papelaria Universitária', desconto: '20%', ativo: true, destacado: false, ordem: 16 },
      { nome: 'Coursera', slug: 'coursera', descricao: 'Cursos online com certificado internacional.', categoria: 'Educação', nomeParceiro: 'Coursera', desconto: '50%', ativo: true, destacado: false, ordem: 17 },
      { nome: 'Escola de Música', slug: 'escola-musica', descricao: 'Aulas de instrumento musical com desconto.', categoria: 'Educação', nomeParceiro: 'Harmonia Music', desconto: '25%', ativo: true, destacado: false, ordem: 18 },

      // Alimentação
      { nome: 'Descontos em Restaurantes', slug: 'restaurantes', descricao: 'Descontos em restaurantes parceiros em toda a cidade.', categoria: 'Alimentação', nomeParceiro: 'Restaurante Gourmet', desconto: '15%', ativo: true, destacado: false, ordem: 19 },
      { nome: 'Ifood', slug: 'ifood', descricao: 'Descontos em delivery de alimentação.', categoria: 'Alimentação', nomeParceiro: 'Ifood', desconto: '10%', ativo: true, destacado: false, ordem: 20 },
      { nome: 'Padaria Popular', slug: 'padaria-popular', descricao: 'Descontos em pães e produtos de padaria.', categoria: 'Alimentação', nomeParceiro: 'Padaria do Bairro', desconto: '20%', ativo: true, destacado: false, ordem: 21 },

      // Financeiro
      { nome: 'Cartão de Crédito', slug: 'cartao-credito', descricao: 'Cartão de crédito com benefícios exclusivos.', categoria: 'Financeiro', nomeParceiro: 'Banco do Brasil', desconto: '0', ativo: true, destacado: true, ordem: 22 },
      { nome: 'Empréstimo Consignado', slug: 'emprestimo-consignado', descricao: 'Taxas especiais para empréstimo consignado.', categoria: 'Financeiro', nomeParceiro: 'Banco Safra', desconto: '0', ativo: true, destacado: false, ordem: 23 },
      { nome: 'Seguros em Geral', slug: 'seguros-gerais', descricao: 'Descontos em seguros de carro, casa e vida.', categoria: 'Financeiro', nomeParceiro: 'Allianz', desconto: '15%', ativo: true, destacado: false, ordem: 24 },

      // Vestuário
      { nome: 'Descontos em Lojas', slug: 'lojas-roupa', descricao: 'Descontos em tiendas de roupas e acessórios.', categoria: 'Vestuário', nomeParceiro: 'Lojas Renner', desconto: '20%', ativo: true, destacado: false, ordem: 25 },
      { nome: 'Calçados', slug: 'calcados', descricao: 'Descontos em lojas de calçados.', categoria: 'Vestuário', nomeParceiro: 'Centauro', desconto: '25%', ativo: true, destacado: false, ordem: 26 },

      // Serviços
      { nome: 'Serviços Jurídicos', slug: 'servicos-juridicos', descricao: 'Descontos em serviços advocatícios.', categoria: 'Serviços', nomeParceiro: 'Silva & Associados', desconto: '25%', ativo: true, destacado: false, ordem: 27 },
      { nome: 'Descontouber', slug: 'descontouber', descricao: 'Descontos em corridas de uber e 99.', categoria: 'Serviços', nomeParceiro: 'Uber', desconto: '15%', ativo: true, destacado: false, ordem: 28 },
      { nome: 'Corte de Cabelo', slug: 'corte-cabelo', descricao: 'Descontos em salões de beleza.', categoria: 'Serviços', nomeParceiro: 'Salão Beleza', desconto: '20%', ativo: true, destacado: false, ordem: 29 },
      { nome: 'Manicure e Pedicure', slug: 'manicure-pedicure', descricao: 'Serviços de beleza com desconto.', categoria: 'Serviços', nomeParceiro: 'Espaço Beleza', desconto: '25%', ativo: true, destacado: false, ordem: 30 },
    ];

    for (const benefit of benefits) {
      await this.prisma.beneficio.upsert({
        where: { slug: benefit.slug },
        update: benefit,
        create: benefit,
      });
    }
    this.logger.log(`✅ ${benefits.length} benefícios`);
  }

  private async seedPartners() {
    const partners = [
      { nome: 'Unimed', cnpj: '12.345.678/0001-90', telefone: '(11) 4000-0000', email: 'contato@unimed.com.br', descricao: 'Plano de saúde com cobertura nacional', categoria: 'Saúde', desconto: '30%', status: 'ATIVO', ativo: true },
      { nome: 'Smart Fit', cnpj: '23.456.789/0001-01', telefone: '(11) 3000-0000', email: 'contato@smartfit.com.br', descricao: 'Academia com infraestrutura completa', categoria: 'Lazer', desconto: '40%', status: 'ATIVO', ativo: true },
      { nome: 'Drogaria Pacheco', cnpj: '34.567.890/0001-12', telefone: '(11) 2500-0000', email: 'contato@pacheco.com.br', descricao: 'Farmácia com discounts em medicamentos', categoria: 'Saúde', desconto: '25%', status: 'ATIVO', ativo: true },
      { nome: 'Wizard Idiomas', cnpj: '45.678.901/0001-23', telefone: '(11) 3500-0000', email: 'contato@wizard.com.br', descricao: 'Escola de idiomas', categoria: 'Educação', desconto: '30%', status: 'ATIVO', ativo: true },
      { nome: 'PUC', cnpj: '56.789.012/0001-34', telefone: '(11) 4500-0000', email: 'contato@puc.com.br', descricao: 'Universidade particular', categoria: 'Educação', desconto: '35%', status: 'ATIVO', ativo: true },
      { nome: 'Hopihari', cnpj: '67.890.123/0001-45', telefone: '(11) 5500-0000', email: 'contato@hopihari.com.br', descricao: 'Parque de diversões', categoria: 'Lazer', desconto: '15%', status: 'ATIVO', ativo: false },
      { nome: 'Sthai Spá', cnpj: '78.901.234/0001-56', telefone: '(11) 6500-0000', email: 'contato@sthai.com.br', descricao: 'Spa e massagem', categoria: 'Lazer', desconto: '25%', status: 'ATIVO', ativo: true },
      { nome: 'Bradesco Seguros', cnpj: '89.012.345/0001-67', telefone: '(11) 7500-0000', email: 'contato@bradescoseguros.com.br', descricao: 'Seguros em geral', categoria: 'Saúde', desconto: '20%', status: 'ATIVO', ativo: true },
    ];

    for (const partner of partners) {
      try {
        await this.prisma.parceiro.create({ data: partner });
      } catch (e) {
        // Skip duplicates
      }
    }
    this.logger.log(`✅ ${partners.length} parceiros`);
  }

  private async seedEvents() {
    const events = [
      { titulo: 'Palestra sobre Investimentos', descricao: 'Aprenda a investir seu dinheiro de forma inteligente com especialistas.', data: new Date('2026-03-15T19:00:00'), horaInicio: '19:00', horaFim: '21:00', local: 'Auditório Principal', categoria: 'Finanças', vagas: 100, ativo: true },
      { titulo: 'Workshop de Inteligência Artificial', descricao: 'Introdução ao mundo da IA e machine learning para iniciantes.', data: new Date('2026-03-20T14:00:00'), horaInicio: '14:00', horaFim: '18:00', local: 'Sala de Treinamento', categoria: 'Tecnologia', vagas: 30, ativo: true },
      { titulo: 'Confraternização de Final de Ano', descricao: 'Evento de integração entre associados com jantar e música.', data: new Date('2025-12-20T20:00:00'), horaInicio: '20:00', horaFim: '23:00', local: 'Chácara Recanto', categoria: 'Social', vagas: 200, ativo: false },
      { titulo: 'Curso de Oratória', descricao: 'Aprenda a falar em público com confiança e técnica.', data: new Date('2026-04-05T09:00:00'), horaInicio: '09:00', horaFim: '17:00', local: 'Sala de Treinamento', categoria: 'Educação', preco: 150, vagas: 25, ativo: true },
      { titulo: 'Feira de Oportunidades', descricao: 'Eventos com empresas parceiras oferecendo vagas de emprego.', data: new Date('2026-04-10T10:00:00'), horaInicio: '10:00', horaFim: '16:00', local: 'Estacionamento', categoria: 'Carreira', vagas: 500, ativo: true },
      { titulo: 'Seminário de Saúde', descricao: 'Palestras sobre cuidados com a saúde e prevenção.', data: new Date('2026-03-25T08:00:00'), horaInicio: '08:00', horaFim: '12:00', local: 'Auditório Principal', categoria: 'Saúde', vagas: 150, ativo: true },
      { titulo: 'Workshop de Culinária', descricao: 'Aprenda receitas saudáveis e práticas.', data: new Date('2026-04-15T15:00:00'), horaInicio: '15:00', horaFim: '18:00', local: 'Cozinha Experimental', categoria: 'Lazer', vagas: 20, ativo: true },
      { titulo: 'Palestra LGPD', descricao: 'Entenda a Lei de Proteção de Dados e seus direitos.', data: new Date('2026-04-20T14:00:00'), horaInicio: '14:00', horaFim: '16:00', local: 'Sala de Reuniões', categoria: 'Jurídico', vagas: 50, ativo: true },
    ];

    for (const event of events) {
      await this.prisma.evento.create({ data: event });
    }
    this.logger.log(`✅ ${events.length} eventos`);
  }

  private async seedAssemblies() {
    const assemblies = [
      {
        titulo: 'Assembleia Geral Ordinária 2026',
        tipo: TipoAssembleia.ORDINARIA,
        data: new Date('2026-03-15T19:00:00'),
        hora: '19:00',
        local: 'Sede da ASCESA',
        descricao: 'Reunião anual para prestação de contas, aprovação do balanço e eleição da diretoria.',
        status: StatusAssembleia.AGENDADA,
      },
      {
        titulo: 'Assembleia Extraordinária - Reforma Estatutária',
        tipo: TipoAssembleia.EXTRAORDINARIA,
        data: new Date('2026-04-20T14:00:00'),
        hora: '14:00',
        local: 'Sede da ASCESA',
        descricao: 'Discussão e votação de alterações no estatuto social.',
        status: StatusAssembleia.AGENDADA,
      },
      {
        titulo: 'Assembleia Geral Ordinária 2025',
        tipo: TipoAssembleia.ORDINARIA,
        data: new Date('2025-03-15T19:00:00'),
        hora: '19:00',
        local: 'Sede da ASCESA',
        descricao: 'Reunião anual para prestação de contas.',
        status: StatusAssembleia.ENCERRADA,
      },
    ];

    for (const assembly of assemblies) {
      const created = await this.prisma.assembleia.create({ data: assembly });

      // Add candidates to the first assembly
      if (assembly.titulo.includes('2026')) {
        await this.prisma.candidato.createMany({
          data: [
            { assembleiaId: created.id, nome: 'João Silva', cargo: 'Presidente' },
            { assembleiaId: created.id, nome: 'Maria Santos', cargo: 'Vice-Presidente' },
            { assembleiaId: created.id, nome: 'Pedro Oliveira', cargo: 'Tesoureiro' },
          ],
        });
      }
    }
    this.logger.log(`✅ ${assemblies.length} assembleias`);
  }

  private async seedUsersAndAssociates() {
    const users = [
      { email: 'joao.silva@email.com', nome: 'João Silva', cpf: '123.456.789-00', telefone: '(11) 99999-0001', password: 'usuario123', status: StatusUsuario.ATIVO, profissao: 'Servidor Público', dataNascimento: new Date('1985-03-15'), cidade: 'São Paulo', estado: 'SP' },
      { email: 'maria.santos@email.com', nome: 'Maria Santos', cpf: '234.567.890-11', telefone: '(11) 99999-0002', password: 'usuario123', status: StatusUsuario.ATIVO, profissao: 'Professora', dataNascimento: new Date('1990-07-22'), cidade: 'São Paulo', estado: 'SP' },
      { email: 'pedro.oliveira@email.com', nome: 'Pedro Oliveira', cpf: '345.678.901-22', telefone: '(11) 99999-0003', password: 'usuario123', status: StatusUsuario.ATIVO, profissao: 'Engenheiro', dataNascimento: new Date('1978-11-05'), cidade: 'Campinas', estado: 'SP' },
      { email: 'ana.costa@email.com', nome: 'Ana Costa', cpf: '456.789.012-33', telefone: '(11) 99999-0004', password: 'usuario123', status: StatusUsuario.PENDENTE, profissao: 'Enfermeira', dataNascimento: new Date('1995-01-30'), cidade: 'Santo André', estado: 'SP' },
      { email: 'carlos.pereira@email.com', nome: 'Carlos Pereira', cpf: '567.890.123-44', telefone: '(11) 99999-0005', password: 'usuario123', status: StatusUsuario.ATIVO, profissao: 'Advogado', dataNascimento: new Date('1982-09-12'), cidade: 'São Paulo', estado: 'SP' },
      { email: 'fernanda.lima@email.com', nome: 'Fernanda Lima', cpf: '678.901.234-55', telefone: '(11) 99999-0006', password: 'usuario123', status: StatusUsuario.INATIVO, profissao: 'Arquiteta', dataNascimento: new Date('1988-04-18'), cidade: 'São Paulo', estado: 'SP' },
      { email: 'roberto.alves@email.com', nome: 'Roberto Alves', cpf: '789.012.345-66', telefone: '(11) 99999-0007', password: 'usuario123', status: StatusUsuario.ATIVO, profissao: 'Contador', dataNascimento: new Date('1975-12-03'), cidade: 'Osasco', estado: 'SP' },
      { email: 'juliana.ferreira@email.com', nome: 'Juliana Ferreira', cpf: '890.123.456-77', telefone: '(11) 99999-0008', password: 'usuario123', status: StatusUsuario.ATIVO, profissao: 'Médica', dataNascimento: new Date('1992-06-25'), cidade: 'São Paulo', estado: 'SP' },
    ];

    const createdUsers: any[] = [];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const createdUser = await this.prisma.usuario.upsert({
        where: { email: user.email },
        update: { senha: hashedPassword },
        create: {
          email: user.email,
          nome: user.nome,
          cpf: user.cpf,
          telefone: user.telefone,
          senha: hashedPassword,
          papel: Papel.ASSOCIADO,
          status: user.status,
        },
      });

      const associadoStatus = user.status === StatusUsuario.ATIVO
        ? StatusAssociado.ATIVO
        : user.status === StatusUsuario.PENDENTE
          ? StatusAssociado.PENDENTE
          : StatusAssociado.INATIVO;

      await this.prisma.associado.upsert({
        where: { usuarioId: createdUser.id },
        update: {},
        create: {
          usuarioId: createdUser.id,
          cpf: user.cpf.replace(/\D/g, ''),
          dataNascimento: user.dataNascimento,
          profissao: user.profissao,
          endereco: 'Rua Example, 123',
          cidade: user.cidade,
          estado: user.estado,
          cep: '01234-567',
          tipoMembership: 'PADRAO',
          status: associadoStatus,
        },
      });

      createdUsers.push(createdUser);
    }

    // Add favorites
    const benefits = await this.prisma.beneficio.findMany({ take: 4 });

    for (let i = 0; i < createdUsers.length; i++) {
      for (let j = 0; j < Math.min(i + 1, benefits.length); j++) {
        try {
          await this.prisma.favorito.create({
            data: { usuarioId: createdUsers[i].id, beneficioId: benefits[j].id },
          });
        } catch (e) {
          // Ignore duplicate favorites
        }
      }
    }

    this.logger.log(`✅ ${users.length} usuários e associados`);
  }

  private async seedPayments() {
    const users = await this.prisma.usuario.findMany({ where: { papel: Papel.ASSOCIADO }, take: 6 });

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = 2026;

    const paymentData: any[] = [];

    // Generate payments for each user
    for (const user of users) {
      // Current month
      paymentData.push({
        usuarioId: user.id,
        mes: currentMonth,
        ano: currentYear,
        valor: 150.00,
        dataVencimento: new Date(currentYear, currentMonth - 1, 10),
        dataPagamento: new Date(currentYear, currentMonth - 1, 8),
        status: StatusPagamento.PAGO,
        metodoPagamento: 'PIX',
      });

      // Previous month
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

      const statuses = [StatusPagamento.PAGO, StatusPagamento.PENDENTE, StatusPagamento.ATRASADO];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      paymentData.push({
        usuarioId: user.id,
        mes: prevMonth,
        ano: prevYear,
        valor: 150.00,
        dataVencimento: new Date(prevYear, prevMonth - 1, 10),
        dataPagamento: status === StatusPagamento.PAGO ? new Date(prevYear, prevMonth - 1, 5) : null,
        status: status,
        metodoPagamento: status === StatusPagamento.PAGO ? 'Boleto' : null,
      });
    }

    for (const payment of paymentData) {
      await this.prisma.pagamento.create({ data: payment });
    }

    this.logger.log(`✅ ${paymentData.length} pagamentos`);
  }

  private async seedProducts() {
    const users = await this.prisma.usuario.findMany({ where: { papel: Papel.ASSOCIADO }, take: 6 });
    const products = [
      { nome: 'Smartphone Samsung Galaxy S21', descricao: 'Excelente estado, sem riscos', preco: 1500, precoOriginal: 2500, categoria: 'Eletrônicos', vendedor: 'João Silva', contatoVendedor: '(11) 99999-0001', condicao: 'USADO' as const, visualizacoes: 150, ativo: true },
      { nome: 'Bicicleta Caloi', descricao: 'Bicicleta adulto, novo', preco: 800, precoOriginal: 1200, categoria: 'Esporte', vendedor: 'Maria Santos', contatoVendedor: '(11) 99999-0002', condicao: 'NOVO' as const, visualizacoes: 80, ativo: true },
      { nome: 'Sofá 2 Lugares', descricao: 'Sofá usado em bom estado', preco: 450, precoOriginal: 900, categoria: 'Móveis', vendedor: 'Pedro Oliveira', contatoVendedor: '(11) 99999-0003', condicao: 'USADO' as const, visualizacoes: 200, ativo: true },
      { nome: 'Livro - Clean Code', descricao: 'Livro de programação', preco: 60, precoOriginal: 120, categoria: 'Livros', vendedor: 'Ana Costa', contatoVendedor: '(11) 99999-0004', condicao: 'USADO' as const, visualizacoes: 45, ativo: true },
      { nome: 'Mesa de Jantar', descricao: 'Mesa para 6 pessoas', preco: 350, precoOriginal: 600, categoria: 'Móveis', vendedor: 'Carlos Pereira', contatoVendedor: '(11) 99999-0005', condicao: 'USADO' as const, visualizacoes: 95, ativo: true },
      { nome: 'Guitarra Epiphone', descricao: 'Guitarra iniciante', preco: 700, precoOriginal: 1100, categoria: 'Música', vendedor: 'Fernanda Lima', contatoVendedor: '(11) 99999-0006', condicao: 'USADO' as const, visualizacoes: 120, ativo: true },
    ];

    for (let i = 0; i < products.length; i++) {
      await this.prisma.produto.create({
        data: { ...products[i], usuarioId: users[i]?.id },
      });
    }
    this.logger.log(`✅ ${products.length} produtos (vitrine)`);
  }

  private async seedForumTopics() {
    const topics = [
      { titulo: 'Dúvida sobre plano de saúde', conteudo: 'Alguém sabe como funciona o plano da Unimed? Quais são as coberturas?', autor: 'João Silva', categoria: 'Saúde', fixado: false, fechado: false, visualizacoes: 120 },
      { titulo: 'Experiência com academia Smart Fit', conteudo: 'Queria saber a opinião de quem já usa a Smart Fit. Vale a pena?', autor: 'Maria Santos', categoria: 'Lazer', fixado: false, fechado: false, visualizacoes: 340 },
      { titulo: 'Quando será a próxima Assembleia?', conteudo: 'Alguém tem informações sobre a data da próxima Assembleia?', autor: 'Pedro Oliveira', categoria: 'Institucional', fixado: false, fechado: false, visualizacoes: 560 },
      { titulo: 'Dúvida sobre mensalidade', conteudo: 'Qual o valor da mensalidade para 2026? Preciso saber para planejar.', autor: 'Ana Costa', categoria: 'Financeiro', fixado: false, fechado: false, visualizacoes: 180 },
      { titulo: 'App não está funcionando', conteudo: 'Estou tentando acessar e dá erro. Alguém mais tem esse problema?', autor: 'Carlos Pereira', categoria: 'Tecnologia', fixado: false, fechado: false, visualizacoes: 420 },
      { titulo: 'Bem-vindos ao Fórum ASCESA', conteudo: 'Este é o espaço para discussões entre associados. Participem!', autor: 'Administrador', categoria: 'Avisos', fixado: true, fechado: false, visualizacoes: 500 },
    ];

    for (const topic of topics) {
      await this.prisma.topico.create({ data: topic });
    }

    const topicos = await this.prisma.topico.findMany({ take: 2 });
    if (topicos.length > 0) {
      await this.prisma.resposta.create({
        data: { topicoId: topicos[0].id, conteudo: 'Ótima dúvida! Vou verificar e te retorno com mais informações.', autor: 'Administrador' },
      });
      if (topicos.length > 1) {
        await this.prisma.resposta.create({
          data: { topicoId: topicos[1].id, conteudo: 'Eu uso e recomendo! A estrutura é muito boa.', autor: 'Roberto Alves' },
        });
      }
    }

    this.logger.log(`✅ ${topics.length} tópicos do fórum`);
  }

  private async seedDocuments() {
    // Documents are uploaded by users, but we can create some templates
    const users = await this.prisma.usuario.findMany({ take: 1 });

    if (users.length > 0) {
      await this.prisma.documento.createMany({
        data: [
          {
            usuarioId: users[0].id,
            tipo: 'CPF',
            nomeArquivo: 'cpf_joao.pdf',
            caminho: '/uploads/documentos/cpf_joao.pdf',
            status: 'APROVADO' as any,
          },
          {
            usuarioId: users[0].id,
            tipo: 'COMPROVANTE_RESIDENCIA',
            nomeArquivo: 'comprovante_residencia.pdf',
            caminho: '/uploads/documentos/comprovante.pdf',
            status: 'APROVADO' as any,
          },
        ],
      });
      this.logger.log(`✅ 2 documentos`);
    } else {
      this.logger.log(`✅ 0 documentos (sem usuários)`);
    }
  }
}

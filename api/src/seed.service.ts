import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { StatusUsuario, Papel } from '@prisma/client';
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
      await this.seedProducts();
      await this.seedForumTopics();

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

    this.logger.log('✅ Admin: admin@ascesa.com / admin123');
  }

  private async seedBenefits() {
    const benefits = [
      { nome: 'Drogaria Popular', slug: 'drogaria-popular', descricao: '20% de desconto em medicamentos', categoria: 'SAUDE', desconto: '20%', ativo: true, destacado: true },
      { nome: 'Supermercado Premier', slug: 'supermercado-premier', descricao: '15% de desconto em compras', categoria: 'COMPRAS', desconto: '15%', ativo: true, destacado: false },
      { nome: 'Escola Sonho', slug: 'escola-sonho', descricao: '30% de desconto em mensalidades', categoria: 'EDUCACAO', desconto: '30%', ativo: true, destacado: true },
      { nome: 'Academia Fit Club', slug: 'academia-fit-club', descricao: '25% de desconto na mensalidade', categoria: 'LAZER', desconto: '25%', ativo: true, destacado: false },
      { nome: 'Restaurante Gourmet', slug: 'restaurante-gourmet', descricao: '10% de desconto no cardápio', categoria: 'LAZER', desconto: '10%', ativo: true, destacado: false },
      { nome: 'Pet Shop Amigo', slug: 'pet-shop-amigo', descricao: '15% de desconto em produtos', categoria: 'PET', desconto: '15%', ativo: true, destacado: false },
      { nome: 'Clínica Odontológica Sorriso', slug: 'clinica-sorriso', descricao: '25% em tratamentos odontológicos', categoria: 'SAUDE', desconto: '25%', ativo: true, destacado: true },
      { nome: 'Auto Escola Velocity', slug: 'auto-escola-velocity', descricao: '10% na primeira habilitação', categoria: 'EDUCACAO', desconto: '10%', ativo: true, destacado: false },
    ];

    for (const benefit of benefits) {
      await this.prisma.beneficio.create({ data: benefit });
    }
    this.logger.log(`✅ ${benefits.length} benefícios`);
  }

  private async seedPartners() {
    const partners = [
      { nome: 'Drogaria Popular', cnpj: '12345678000100', telefone: '(31) 1234-5678', email: 'contato@drogariapopular.com.br', descricao: 'Farmácia', categoria: 'SAUDE', desconto: '20%', status: 'ATIVO', ativo: true },
      { nome: 'Supermercado Premier', cnpj: '12345678000200', telefone: '(31) 2345-6789', email: 'contato@supermercadopremier.com.br', descricao: 'Supermercado', categoria: 'COMPRAS', desconto: '15%', status: 'ATIVO', ativo: true },
      { nome: 'Escola Sonho', cnpj: '12345678000300', telefone: '(31) 3456-7890', email: 'contato@escolasonho.com.br', descricao: 'Educação', categoria: 'EDUCACAO', desconto: '30%', status: 'ATIVO', ativo: true },
      { nome: 'Clínica Sorriso', cnpj: '12345678000400', telefone: '(31) 4567-8901', email: 'contato@clinicasorriso.com.br', descricao: 'Odontologia', categoria: 'SAUDE', desconto: '25%', status: 'ATIVO', ativo: true },
      { nome: 'Academia Fit Club', cnpj: '12345678000500', telefone: '(31) 5678-9012', email: 'contato@fitclub.com.br', descricao: 'Academia', categoria: 'LAZER', desconto: '25%', status: 'ATIVO', ativo: true },
    ];

    for (const partner of partners) {
      await this.prisma.parceiro.create({ data: partner });
    }
    this.logger.log(`✅ ${partners.length} parceiros`);
  }

  private async seedEvents() {
    const events = [
      { titulo: 'Workshop de Finanças', descricao: 'Aprenda a gerenciar suas finanças', data: new Date('2024-02-15T14:00:00'), horaInicio: '14:00', horaFim: '16:00', local: 'Online - zoom', categoria: 'WORKSHOP', vagas: 50, ativo: true },
      { titulo: 'Happy Hour dos Associados', descricao: 'Encontro mensal para networking', data: new Date('2024-02-20T19:00:00'), horaInicio: '19:00', horaFim: '22:00', local: 'Bar Central', categoria: 'SOCIAL', vagas: 100, ativo: true },
      { titulo: 'Palestra: Saúde Mental', descricao: 'Importância da saúde mental', data: new Date('2024-03-01T10:00:00'), horaInicio: '10:00', horaFim: '12:00', local: 'Auditório ASCESA', categoria: 'PALESTRA', vagas: 80, ativo: true },
      { titulo: 'Assembleia Geral', descricao: 'Prestação de contas', data: new Date('2024-03-15T14:00:00'), horaInicio: '14:00', horaFim: '18:00', local: 'Sede ASCESA', categoria: 'ASSEMBLEIA', vagas: 200, ativo: true },
      { titulo: 'Curso de Inglês Básico', descricao: 'Iniciando no inglês', data: new Date('2024-04-01T18:00:00'), horaInicio: '18:00', horaFim: '20:00', local: 'Sede ASCESA', categoria: 'CURSO', vagas: 30, ativo: true },
      { titulo: 'Feira de Artesanato', descricao: 'Feira de produtos artesanais', data: new Date('2024-04-10T09:00:00'), horaInicio: '09:00', horaFim: '17:00', local: 'Praça Central', categoria: 'FEIRA', vagas: 50, ativo: true },
    ];

    for (const event of events) {
      await this.prisma.evento.create({ data: event });
    }
    this.logger.log(`✅ ${events.length} eventos`);
  }

  private async seedAssemblies() {
    // Skip assemblies for now - requires proper enum types
    this.logger.log('✅ 0 assembleias (skip)');
  }

  private async seedUsersAndAssociates() {
    const users = [
      { email: 'joao.silva@email.com', nome: 'João Silva', cpf: '12345678901', telefone: '(31) 99999-0001', password: 'joao123', status: StatusUsuario.ATIVO, profissao: 'Servidor Público', dataNascimento: new Date('1985-03-15'), cidade: 'Belo Horizonte', estado: 'MG' },
      { email: 'maria.santos@email.com', nome: 'Maria Santos', cpf: '23456789012', telefone: '(31) 99999-0002', password: 'maria123', status: StatusUsuario.ATIVO, profissao: 'Professora', dataNascimento: new Date('1990-07-22'), cidade: 'Belo Horizonte', estado: 'MG' },
      { email: 'pedro.oliveira@email.com', nome: 'Pedro Oliveira', cpf: '34567890123', telefone: '(31) 99999-0003', password: 'pedro123', status: StatusUsuario.PENDENTE, profissao: 'Engenheiro', dataNascimento: new Date('1988-11-10'), cidade: 'Contagem', estado: 'MG' },
      { email: 'ana.costa@email.com', nome: 'Ana Costa', cpf: '45678901234', telefone: '(31) 99999-0004', password: 'ana123', status: StatusUsuario.ATIVO, profissao: 'Enfermeira', dataNascimento: new Date('1992-05-18'), cidade: 'Belo Horizonte', estado: 'MG' },
      { email: 'jose.souza@email.com', nome: 'José Souza', cpf: '56789012345', telefone: '(31) 99999-0005', password: 'jose123', status: StatusUsuario.ATIVO, profissao: 'Aposentado', dataNascimento: new Date('1960-09-30'), cidade: 'Belo Horizonte', estado: 'MG' },
      { email: 'carla.lima@email.com', nome: 'Carla Lima', cpf: '67890123456', telefone: '(31) 99999-0006', password: 'carla123', status: StatusUsuario.ATIVO, profissao: 'Advogada', dataNascimento: new Date('1987-12-05'), cidade: 'Belo Horizonte', estado: 'MG' },
    ];

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

      await this.prisma.associado.upsert({
        where: { usuarioId: createdUser.id },
        update: {},
        create: {
          usuarioId: createdUser.id,
          cpf: user.cpf,
          dataNascimento: user.dataNascimento,
          profissao: user.profissao,
          endereco: 'Rua Example',
          cidade: user.cidade,
          estado: user.estado,
          tipoMembership: 'PADRAO',
          status: user.status === StatusUsuario.ATIVO ? 'ATIVO' : 'PENDENTE',
        },
      });
    }

    // Add favorites
    const benefits = await this.prisma.beneficio.findMany({ take: 3 });
    const allUsers = await this.prisma.usuario.findMany({ where: { papel: Papel.ASSOCIADO }, take: 3 });

    for (let i = 0; i < allUsers.length; i++) {
      for (let j = 0; j < Math.min(i + 1, benefits.length); j++) {
        await this.prisma.favorito.create({
          data: { usuarioId: allUsers[i].id, beneficioId: benefits[j].id },
        });
      }
    }

    this.logger.log(`✅ ${users.length} usuários e associados`);
  }

  private async seedProducts() {
    const products = [
      { nome: 'Smartphone Samsung Galaxy S21', descricao: 'Excelente estado', preco: 1500, precoOriginal: 2500, categoria: 'ELETRONICOS', vendedor: 'João Silva', contatoVendedor: '(31) 99999-0001', condicao: 'USADO' as const, visualizacoes: 150, ativo: true },
      { nome: 'Bicicleta Caloi', descricao: 'Bicicleta adulto', preco: 800, precoOriginal: 1200, categoria: 'ESPORTE', vendedor: 'Maria Santos', contatoVendedor: '(31) 99999-0002', condicao: 'USADO' as const, visualizacoes: 80, ativo: true },
      { nome: 'Sofá 2 Lugares', descricao: 'Sofá usado em bom estado', preco: 450, precoOriginal: 900, categoria: 'MOVEIS', vendedor: 'Pedro Oliveira', contatoVendedor: '(31) 99999-0003', condicao: 'USADO' as const, visualizacoes: 200, ativo: true },
      { nome: 'Livro - Clean Code', descricao: 'Livro de programação', preco: 60, precoOriginal: 120, categoria: 'LIVROS', vendedor: 'Ana Costa', contatoVendedor: '(31) 99999-0004', condicao: 'USADO' as const, visualizacoes: 45, ativo: true },
      { nome: 'Mesa de Jantar', descricao: 'Mesa para 6 pessoas', preco: 350, precoOriginal: 600, categoria: 'MOVEIS', vendedor: 'José Souza', contatoVendedor: '(31) 99999-0005', condicao: 'USADO' as const, visualizacoes: 95, ativo: true },
      { nome: 'Guitarra Epiphone', descricao: 'Guitarra iniciante', preco: 700, precoOriginal: 1100, categoria: 'MUSICA', vendedor: 'Carla Lima', contatoVendedor: '(31) 99999-0006', condicao: 'USADO' as const, visualizacoes: 120, ativo: true },
    ];

    const users = await this.prisma.usuario.findMany({ where: { papel: Papel.ASSOCIADO }, take: 6 });

    for (let i = 0; i < products.length; i++) {
      await this.prisma.produto.create({
        data: { ...products[i], usuarioId: users[i]?.id },
      });
    }
    this.logger.log(`✅ ${products.length} produtos (vitrine)`);
  }

  private async seedForumTopics() {
    const topics = [
      { titulo: 'Bem-vindos ao Fórum ASCESA', conteudo: 'Este é o espaço para discussões entre associados.', autor: 'Administrador', categoria: 'AVISOS', fixado: true, fechado: false, visualizacoes: 500 },
      { titulo: 'Dúvida sobre convênio médico', conteudo: 'Alguém sabe quais convênios médicos estão disponíveis?', autor: 'João Silva', categoria: 'SAUDE', fixado: false, fechado: false, visualizacoes: 120 },
      { titulo: 'Sugestão: criar grupo de WhatsApp', conteudo: 'Seria interessante criar um grupo para facilitar a comunicação.', autor: 'Maria Santos', categoria: 'SUGESTOES', fixado: false, fechado: false, visualizacoes: 85 },
      { titulo: 'Evento de fim de ano', conteudo: 'Vocês querem um evento de fim de ano?', autor: 'Pedro Oliveira', categoria: 'EVENTOS', fixado: false, fechado: false, visualizacoes: 150 },
      { titulo: 'Como solicitar cartão de crédito?', conteudo: 'Passo a passo para solicitar o cartão.', autor: 'Ana Costa', categoria: 'DUVIDAS', fixado: false, fechado: false, visualizacoes: 200 },
    ];

    for (const topic of topics) {
      await this.prisma.topico.create({ data: topic });
    }

    const topicos = await this.prisma.topico.findMany({ take: 1 });
    if (topicos.length > 0) {
      await this.prisma.resposta.create({
        data: { topicoId: topicos[0].id, conteudo: 'Ótima dúvida! Vou verificar e te retorno.', autor: 'Administrador' },
      });
    }

    this.logger.log(`✅ ${topics.length} tópicos do fórum`);
  }
}

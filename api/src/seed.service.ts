import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { StatusUsuario } from '@prisma/client';
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
      await this.seedUsersAndAssociates();

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

    await this.prisma.usuario.upsert({
      where: { email: adminEmail },
      update: { senha: hashedPassword },
      create: {
        nome: 'Administrador',
        email: adminEmail,
        senha: hashedPassword,
        cpf: '00000000000',
        telefone: '00000000000',
        papel: 'ADMIN',
        status: StatusUsuario.ATIVO,
      },
    });

    this.logger.log('✅ Admin: admin@ascesa.com / admin123');
  }

  private async seedBenefits() {
    const benefits = [
      {
        nome: 'Drogaria Popular',
        slug: 'drogaria-popular',
        descricao: '20% de desconto em todos os medicamentos',
        categoria: 'SAUDE',
        desconto: '20%',
        ativo: true,
        destacado: true,
      },
      {
        nome: 'Supermercado Premier',
        slug: 'supermercado-premier',
        descricao: '15% de desconto em todas as compras',
        categoria: 'COMPRAS',
        desconto: '15%',
        ativo: true,
        destacado: false,
      },
      {
        nome: 'Escola Sonho',
        slug: 'escola-sonho',
        descricao: '30% de desconto em mensalidades',
        categoria: 'EDUCACAO',
        desconto: '30%',
        ativo: true,
        destacado: true,
      },
      {
        nome: 'Academia Fit Club',
        slug: 'academia-fit-club',
        descricao: '25% de desconto na mensalidade',
        categoria: 'LAZER',
        desconto: '25%',
        ativo: true,
        destacado: false,
      },
      {
        nome: 'Restaurante Gourmet',
        slug: 'restaurante-gourmet',
        descricao: '10% de desconto no cardápio',
        categoria: 'LAZER',
        desconto: '10%',
        ativo: true,
        destacado: false,
      },
      {
        nome: 'Pet Shop Amigo',
        slug: 'pet-shop-amigo',
        descricao: '15% de desconto em produtos',
        categoria: 'PET',
        desconto: '15%',
        ativo: true,
        destacado: false,
      },
    ];

    for (const benefit of benefits) {
      await this.prisma.beneficio.create({
        data: benefit,
      });
    }

    this.logger.log(`✅ ${benefits.length} benefícios`);
  }

  private async seedPartners() {
    const partners = [
      {
        nome: 'Drogaria Popular',
        cnpj: '12345678000100',
        telefone: '(31) 1234-5678',
        email: 'contato@drogariapopular.com.br',
        descricao: 'Farmácia com medicamentos',
        categoria: 'SAUDE',
        desconto: '20%',
        status: 'ATIVO',
        ativo: true,
      },
      {
        nome: 'Supermercado Premier',
        cnpj: '12345678000200',
        telefone: '(31) 2345-6789',
        email: 'contato@supermercadopremier.com.br',
        descricao: 'Rede de supermercados',
        categoria: 'COMPRAS',
        desconto: '15%',
        status: 'ATIVO',
        ativo: true,
      },
      {
        nome: 'Escola Sonho',
        cnpj: '12345678000300',
        telefone: '(31) 3456-7890',
        email: 'contato@escolasonho.com.br',
        descricao: 'Educação infantil',
        categoria: 'EDUCACAO',
        desconto: '30%',
        status: 'ATIVO',
        ativo: true,
      },
    ];

    for (const partner of partners) {
      await this.prisma.parceiro.create({
        data: partner,
      });
    }

    this.logger.log(`✅ ${partners.length} parceiros`);
  }

  private async seedEvents() {
    const events = [
      {
        titulo: 'Workshop de Finanças Pessoais',
        descricao: 'Aprenda a gerenciar suas finanças',
        data: new Date('2024-02-15T14:00:00'),
        horaInicio: '14:00',
        horaFim: '16:00',
        local: 'Online - zoom',
        categoria: 'WORKSHOP',
        vagas: 50,
        ativo: true,
      },
      {
        titulo: 'Happy Hour dos Associados',
        descricao: 'Encontro mensal para networking',
        data: new Date('2024-02-20T19:00:00'),
        horaInicio: '19:00',
        horaFim: '22:00',
        local: 'Bar Central - Centro',
        categoria: 'SOCIAL',
        vagas: 100,
        ativo: true,
      },
      {
        titulo: 'Palestra: Saúde Mental',
        descricao: 'Importância da saúde mental',
        data: new Date('2024-03-01T10:00:00'),
        horaInicio: '10:00',
        horaFim: '12:00',
        local: 'Auditório ASCESA',
        categoria: 'PALESTRA',
        vagas: 80,
        ativo: true,
      },
      {
        titulo: 'Assembleia Geral Ordinária',
        descricao: 'Prestação de contas',
        data: new Date('2024-03-15T14:00:00'),
        horaInicio: '14:00',
        horaFim: '18:00',
        local: 'Sede ASCESA',
        categoria: 'ASSEMBLEIA',
        vagas: 200,
        ativo: true,
      },
    ];

    for (const event of events) {
      await this.prisma.evento.create({
        data: event,
      });
    }

    this.logger.log(`✅ ${events.length} eventos`);
  }

  private async seedUsersAndAssociates() {
    const users = [
      {
        email: 'joao.silva@email.com',
        nome: 'João Silva',
        cpf: '12345678901',
        telefone: '(31) 99999-0001',
        password: 'joao123',
        status: StatusUsuario.ATIVO,
      },
      {
        email: 'maria.santos@email.com',
        nome: 'Maria Santos',
        cpf: '23456789012',
        telefone: '(31) 99999-0002',
        password: 'maria123',
        status: StatusUsuario.ATIVO,
      },
      {
        email: 'pedro.oliveira@email.com',
        nome: 'Pedro Oliveira',
        cpf: '34567890123',
        telefone: '(31) 99999-0003',
        password: 'pedro123',
        status: StatusUsuario.PENDENTE,
      },
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
          papel: 'USUARIO',
          status: user.status,
        },
      });

      await this.prisma.associado.create({
        data: {
          usuarioId: createdUser.id,
          cpf: user.cpf,
          dataNascimento: new Date('1990-01-01'),
          profissao: 'Servidor',
          status: 'ATIVO',
        },
      });
    }

    this.logger.log(`✅ ${users.length} usuários e associados`);
  }
}

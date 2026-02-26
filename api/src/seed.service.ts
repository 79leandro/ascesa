import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    try {
      const adminEmail = 'admin@ascesa.com';
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Upsert admin user - creates or updates
      await this.prisma.usuario.upsert({
        where: { email: adminEmail },
        update: {
          senha: hashedPassword,
          papel: 'ADMIN',
          status: 'ATIVO',
        },
        create: {
          nome: 'Administrador',
          email: adminEmail,
          senha: hashedPassword,
          cpf: '00000000000',
          telefone: '00000000000',
          papel: 'ADMIN',
          status: 'ATIVO',
        },
      });

      this.logger.log('Admin user synced successfully');
    } catch (error) {
      this.logger.error('Error seeding admin user:', error);
    }
  }
}

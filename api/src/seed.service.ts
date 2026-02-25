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
      await this.prisma.user.upsert({
        where: { email: adminEmail },
        update: {
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
        },
        create: {
          name: 'Administrador',
          email: adminEmail,
          password: hashedPassword,
          cpf: '00000000000',
          phone: '00000000000',
          role: 'ADMIN',
          status: 'ACTIVE',
        },
      });

      this.logger.log('Admin user synced successfully');
    } catch (error) {
      this.logger.error('Error seeding admin user:', error);
    }
  }
}

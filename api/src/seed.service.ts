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

      const existingAdmin = await this.prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await this.prisma.user.create({
          data: {
            name: 'Administrador',
            email: adminEmail,
            password: hashedPassword,
            cpf: '00000000000',
            phone: '00000000000',
            birthDate: new Date('1990-01-01'),
            address: 'Sede ASCESA',
            city: 'Belo Horizonte',
            state: 'MG',
            zipCode: '30000000',
            role: 'ADMIN',
            isActive: true,
            memberNumber: 'ADMIN001',
          },
        });

        this.logger.log('Admin user created successfully');
      } else {
        this.logger.log('Admin user already exists');
      }
    } catch (error) {
      this.logger.error('Error seeding admin user:', error);
    }
  }
}

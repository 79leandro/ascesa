import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello() {
    const userCount = await this.prisma.usuario.count();
    return {
      message: 'ASCESA API - Sistema de Gestão de Associados',
      dbConnected: true,
      usuarios: userCount,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello() {
    const userCount = await this.prisma.user.count();
    return {
      message: 'Hello World!',
      dbConnected: true,
      users: userCount,
    };
  }
}

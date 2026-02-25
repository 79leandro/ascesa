import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [UsersController],
  providers: [PrismaService],
})
export class UsersModule {}

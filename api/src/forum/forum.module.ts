import { Module } from '@nestjs/common';
import { ForumController } from './forum.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [ForumController],
  providers: [PrismaService],
})
export class ForumModule {}

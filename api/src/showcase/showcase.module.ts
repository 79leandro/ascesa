import { Module } from '@nestjs/common';
import { ShowcaseController } from './showcase.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [ShowcaseController],
  providers: [PrismaService],
})
export class ShowcaseModule {}

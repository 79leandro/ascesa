import { Module } from '@nestjs/common';
import { BeneficiosController } from './benefits.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [BeneficiosController],
  providers: [PrismaService],
})
export class BenefitsModule {}

import { Module } from '@nestjs/common';
import { BeneficiosController } from './benefits.controller';
import { BeneficiosService } from './benefits.service';
import { PrismaService } from '../prisma';

@Module({
  controllers: [BeneficiosController],
  providers: [BeneficiosService, PrismaService],
  exports: [BeneficiosService],
})
export class BenefitsModule {}

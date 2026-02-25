import { Module } from '@nestjs/common';
import { BenefitsController } from './benefits.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [BenefitsController],
  providers: [PrismaService],
})
export class BenefitsModule {}

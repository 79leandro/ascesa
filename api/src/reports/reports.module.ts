import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PrismaService, ReportsController],
  controllers: [ReportsController],
  exports: [ReportsController],
})
export class ReportsModule {}

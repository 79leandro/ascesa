import { Module } from '@nestjs/common';
import { ParceirosController } from './partners.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [ParceirosController],
  providers: [PrismaService],
})
export class PartnersModule {}

import { Module } from '@nestjs/common';
import { ParceirosController } from './partners.controller';
import { ParceirosService } from './partners.service';
import { PrismaService } from '../prisma';

@Module({
  controllers: [ParceirosController],
  providers: [ParceirosService, PrismaService],
  exports: [ParceirosService],
})
export class PartnersModule {}

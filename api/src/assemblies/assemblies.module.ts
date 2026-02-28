import { Module } from '@nestjs/common';
import { AssembliesController } from './assemblies.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [AssembliesController],
  providers: [PrismaService],
})
export class AssembliesModule {}

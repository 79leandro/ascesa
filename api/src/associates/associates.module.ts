import { Module } from '@nestjs/common';
import { AssociatesController } from './associates.controller';
import { PrismaService } from '../prisma';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [AssociatesController],
  providers: [PrismaService, MailService],
})
export class AssociatesModule {}

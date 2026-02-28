import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PrismaService } from '../prisma';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [PaymentsController],
  providers: [PrismaService, MailService],
})
export class PaymentsModule {}

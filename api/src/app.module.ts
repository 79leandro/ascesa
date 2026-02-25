import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma';
import { AuthModule } from './auth';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';
import { DocumentsModule } from './documents/documents.module';
import { UsersModule } from './users/users.module';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UploadsModule,
    MailModule,
    DocumentsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, SeedService],
})
export class AppModule {}

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
import { BenefitsModule } from './benefits/benefits.module';
import { PartnersModule } from './partners/partners.module';
import { ShowcaseModule } from './showcase/showcase.module';
import { ForumModule } from './forum/forum.module';
import { EventsModule } from './events/events.module';
import { AssembliesModule } from './assemblies/assemblies.module';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UploadsModule,
    MailModule,
    DocumentsModule,
    UsersModule,
    BenefitsModule,
    PartnersModule,
    ShowcaseModule,
    ForumModule,
    EventsModule,
    AssembliesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, SeedService],
})
export class AppModule {}

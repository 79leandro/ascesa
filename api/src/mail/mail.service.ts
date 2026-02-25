import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  /**
   * Envia email de boas-vindas
   */
  async sendWelcomeEmail(to: string, name: string) {
    try {
      const data = await this.resend.emails.send({
        from: 'ASCESA <onboarding@resend.dev>',
        to,
        subject: 'Bem-vindo à ASCESA!',
        html: `
          <h1>Bem-vindo, ${name}!</h1>
          <p>Sua conta na ASCESA foi criada com sucesso.</p>
          <p>Agora você pode aproveitar todos os benefícios exclusivos para servidores do Sicoob.</p>
          <p>Att,<br>Equipe ASCESA</p>
        `,
      });

      return data;
    } catch (error) {
      this.logger.error('Erro ao enviar email de boas-vindas', error);
      throw error;
    }
  }

  /**
   * Envia email de recuperação de senha
   */
  async sendPasswordResetEmail(to: string, resetToken: string) {
    try {
      const data = await this.resend.emails.send({
        from: 'ASCESA <onboarding@resend.dev>',
        to,
        subject: 'Recuperação de Senha - ASCESA',
        html: `
          <h1>Recuperação de Senha</h1>
          <p>Você solicitou a recuperação de senha.</p>
          <p>Use o código abaixo para redefinir sua senha:</p>
          <h2>${resetToken}</h2>
          <p>Este código expira em 1 hora.</p>
          <p>Se você não solicitou, ignore este email.</p>
        `,
      });

      return data;
    } catch (error) {
      this.logger.error('Erro ao enviar email de recuperação', error);
      throw error;
    }
  }

  /**
   * Envia email de aprovação de conta
   */
  async sendApprovalEmail(to: string, name: string) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const data = await this.resend.emails.send({
        from: 'ASCESA <onboarding@resend.dev>',
        to,
        subject: 'Sua conta ASCESA foi aprovada!',
        html: `
          <h1>Olá, ${name}!</h1>
          <p>Sua conta na ASCESA foi aprovada!</p>
          <p>Agora você pode fazer login e aproveitar todos os benefícios.</p>
          <p>Acesse: <a href="${frontendUrl}/login">${frontendUrl}/login</a></p>
          <p>Att,<br>Equipe ASCESA</p>
        `,
      });

      return data;
    } catch (error) {
      this.logger.error('Erro ao enviar email de aprovação', error);
      throw error;
    }
  }

  /**
   * Envia email de confirmação de cadastro
   */
  async sendConfirmationEmail(to: string, name: string, confirmationToken: string) {
    try {
      const data = await this.resend.emails.send({
        from: 'ASCESA <onboarding@resend.dev>',
        to,
        subject: 'Confirme seu cadastro na ASCESA',
        html: `
          <h1>Bem-vindo, ${name}!</h1>
          <p>Obrigado por se cadastrar na ASCESA - Associação dos Servidores do Sicoob.</p>
          <p>Seu cadastro está em análise e em breve você receberá a confirmação.</p>
          <p>Enquanto isso, aproveite para conhecer nossos benefícios.</p>
          <p>Att,<br>Equipe ASCESA</p>
        `,
      });

      return data;
    } catch (error) {
      this.logger.error('Erro ao enviar email de confirmação', error);
      throw error;
    }
  }
}

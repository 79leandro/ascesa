import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AUTH_CONSTANTS } from '../common/constants';

/**
 * Payload do JWT
 */
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

/**
 * Dados do usuário para resposta
 */
interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: string;
}

/**
 * Interface mínima do usuário para token
 */
interface TokenUser {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  /**
   * Registra um novo usuário no sistema
   */
  async register(registerDto: RegisterDto) {
    const { email, password, name, phone, cpf, birthDate, profession, address, city, state } = registerDto;

    // Verificar se usuário já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Verificar se CPF já está em uso
    if (cpf) {
      const existingCpf = await this.prisma.user.findFirst({
        where: { cpf },
      });
      if (existingCpf) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, AUTH_CONSTANTS.BCRYPT_ROUNDS);

    // Criar usuário e associado em transação
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        cpf,
        status: 'PENDING',
        role: 'ASSOCIATED',
        associated: {
          create: {
            cpf,
            birthDate: birthDate ? new Date(birthDate) : undefined,
            profession,
            address,
            city,
            state,
            membershipType: 'STANDARD',
            status: 'PENDING',
          },
        },
      },
      include: {
        associated: true,
      },
    });

    // Gerar token de acesso
    const token = this.generateToken(user);

    // Enviar email de confirmação (não bloqueia o registro se falhar)
    try {
      await this.mailService.sendConfirmationEmail(email, name, token);
    } catch (error) {
      this.logger.error('Erro ao enviar email de confirmação', error);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
      accessToken: token,
    };
  }

  /**
   * Autentica um usuário no sistema
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuário
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar status
    if (user.status === 'PENDING') {
      throw new UnauthorizedException('Conta pendente de aprovação');
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Conta suspensa');
    }

    // Atualizar último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Gerar token de acesso
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken: token,
    };
  }

  /**
   * Gera token JWT para o usuário
   */
  private generateToken(user: TokenUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Valida usuário pelo ID
   */
  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        associated: true,
        admin: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  /**
   * Solicita recuperação de senha
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Não revelar se o usuário existe ou não
    if (!user) {
      return { message: 'Se o email existir, você receberá um link de recuperação' };
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + AUTH_CONSTANTS.PASSWORD_RESET_EXPIRY_HOURS);

    // Salvar token no banco
    await this.prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: {
        token: resetToken,
        expiresAt,
        used: false,
      },
      create: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    // Enviar email de recuperação
    try {
      await this.mailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      this.logger.error('Erro ao enviar email de recuperação', error);
    }

    return { message: 'Se o email existir, você receberá um link de recuperação' };
  }

  /**
   * Redefine a senha do usuário
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    // Buscar token válido
    const passwordReset = await this.prisma.passwordReset.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!passwordReset) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Criptografar nova senha
    const hashedPassword = await bcrypt.hash(newPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);

    // Atualizar senha
    await this.prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword },
    });

    // Marcar token como usado
    await this.prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: { used: true },
    });

    return { message: 'Senha atualizada com sucesso' };
  }
}

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
  nome: string;
  papel: string;
  status?: string;
}

/**
 * Interface mínima do usuário para token
 */
interface TokenUser {
  id: string;
  email: string;
  papel: string;
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
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Verificar se CPF já está em uso
    if (cpf) {
      const existingCpf = await this.prisma.usuario.findFirst({
        where: { cpf },
      });
      if (existingCpf) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, AUTH_CONSTANTS.BCRYPT_ROUNDS);

    // Criar usuário e associado em transação
    const usuario = await this.prisma.usuario.create({
      data: {
        email,
        senha: hashedPassword,
        nome: name,
        telefone: phone,
        cpf,
        status: 'PENDENTE',
        papel: 'ASSOCIADO',
        associado: {
          create: {
            cpf,
            dataNascimento: birthDate ? new Date(birthDate) : undefined,
            profissao: profession,
            endereco: address,
            cidade: city,
            estado: state,
            tipoMembership: 'PADRAO',
            status: 'PENDENTE',
          },
        },
      },
      include: {
        associado: true,
      },
    });

    // Gerar token de acesso
    const token = this.generateToken(usuario);

    // Enviar email de confirmação (não bloqueia o registro se falhar)
    try {
      await this.mailService.sendConfirmationEmail(email, name, token);
    } catch (error) {
      this.logger.error('Erro ao enviar email de confirmação', error);
    }

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        papel: usuario.papel,
        status: usuario.status,
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
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, usuario.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar status (admin pode login mesmo pendente)
    if (usuario.status === 'PENDENTE' && usuario.papel !== 'ADMIN') {
      throw new UnauthorizedException('Conta pendente de aprovação');
    }

    if (usuario.status === 'SUSPENSO') {
      throw new UnauthorizedException('Conta suspensa');
    }

    // Atualizar último login
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoLogin: new Date() },
    });

    // Gerar token de acesso
    const token = this.generateToken(usuario);

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        papel: usuario.papel,
      },
      accessToken: token,
    };
  }

  /**
   * Gera token JWT para o usuário
   */
  private generateToken(usuario: TokenUser): string {
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.papel,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Valida usuário pelo ID
   */
  async validateUser(userId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        associado: true,
        administrador: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException();
    }

    return usuario;
  }

  /**
   * Solicita recuperação de senha
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    // Não revelar se o usuário existe ou não
    if (!usuario) {
      return { message: 'Se o email existir, você receberá um link de recuperação' };
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + AUTH_CONSTANTS.PASSWORD_RESET_EXPIRY_HOURS);

    // Salvar token no banco
    await this.prisma.redefinicaoSenha.upsert({
      where: { usuarioId: usuario.id },
      update: {
        token: resetToken,
        expiraEm: expiresAt,
        usado: false,
      },
      create: {
        usuarioId: usuario.id,
        token: resetToken,
        expiraEm: expiresAt,
      },
    });

    // Enviar email de recuperação
    try {
      await this.mailService.sendPasswordResetEmail(usuario.email, resetToken);
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
    const redefinicaoSenha = await this.prisma.redefinicaoSenha.findFirst({
      where: {
        token,
        usado: false,
        expiraEm: {
          gt: new Date(),
        },
      },
      include: {
        usuario: true,
      },
    });

    if (!redefinicaoSenha) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Criptografar nova senha
    const hashedPassword = await bcrypt.hash(newPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);

    // Atualizar senha
    await this.prisma.usuario.update({
      where: { id: redefinicaoSenha.usuarioId },
      data: { senha: hashedPassword },
    });

    // Marcar token como usado
    await this.prisma.redefinicaoSenha.update({
      where: { id: redefinicaoSenha.id },
      data: { usado: true },
    });

    return { message: 'Senha atualizada com sucesso' };
  }
}

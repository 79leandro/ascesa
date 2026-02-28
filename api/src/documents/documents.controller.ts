import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PrismaService } from '../prisma';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UPLOAD_CONSTANTS, DOCUMENT_STATUS } from '../common/constants';

/**
 * Controlador de documentos
 * Gerencia upload e listagem de documentos dos usuários
 */
@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private prisma: PrismaService) {}

  /**
   * Upload de documento
   */
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de arquivo não permitido'), false);
        }
      },
      limits: {
        fileSize: UPLOAD_CONSTANTS.MAX_FILE_SIZE,
      },
    }),
  )
  @ApiOperation({ summary: 'Upload de documento' })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
    @Body('userId') userId: string,
  ) {
    const documento = await this.prisma.documento.create({
      data: {
        usuarioId: userId,
        tipo: type as any,
        nomeArquivo: file.originalname,
        caminho: file.path,
        status: 'PENDENTE',
      },
    });

    return {
      success: true,
      documento: {
        id: documento.id,
        tipo: documento.tipo,
        nomeArquivo: documento.nomeArquivo,
        status: documento.status,
      },
    };
  }

  /**
   * Lista documentos do usuário
   */
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar documentos do usuário' })
  async getUserDocuments(@Param('userId') userId: string) {
    const documentos = await this.prisma.documento.findMany({
      where: { usuarioId: userId },
      orderBy: { criadoEm: 'desc' },
    });

    return { success: true, documentos };
  }

  /**
   * Lista todos os documentos (Admin)
   */
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DIRECTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os documentos (Admin)' })
  async getAllDocuments(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { usuario: { nome: { contains: search, mode: 'insensitive' } } },
        { usuario: { email: { contains: search, mode: 'insensitive' } } },
        { nomeArquivo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const documentos = await this.prisma.documento.findMany({
      where,
      include: {
        usuario: {
          select: { id: true, nome: true, email: true },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });

    return { success: true, data: documentos };
  }

  /**
   * Aprova documento
   */
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DIRECTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprovar documento' })
  async approveDocument(@Param('id') id: string) {
    const documento = await this.prisma.documento.update({
      where: { id },
      data: { status: 'APROVADO' },
    });

    return { success: true, documento };
  }

  /**
   * Rejeita documento
   */
  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DIRECTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rejeitar documento' })
  async rejectDocument(@Param('id') id: string, @Body('reason') reason?: string) {
    const documento = await this.prisma.documento.update({
      where: { id },
      data: { status: 'REJEITADO' },
    });

    return { success: true, documento };
  }
}

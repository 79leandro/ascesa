import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PrismaService } from '../prisma';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
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
}

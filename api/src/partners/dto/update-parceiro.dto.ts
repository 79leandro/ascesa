import { ApiProperty } from '@nestjs/swagger';

export class UpdateParceiroDto {
  @ApiProperty({ required: false })
  nome?: string;

  @ApiProperty({ required: false })
  razaoSocial?: string;

  @ApiProperty({ required: false })
  cnpj?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  telefone?: string;

  @ApiProperty({ required: false })
  categoria?: string;

  @ApiProperty({ required: false })
  desconto?: string;

  @ApiProperty({ required: false })
  descricao?: string;

  @ApiProperty({ required: false })
  logo?: string;

  @ApiProperty({ required: false })
  site?: string;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  inicioContrato?: Date;

  @ApiProperty({ required: false })
  fimContrato?: Date;

  @ApiProperty({ required: false })
  ativo?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';

export class UpdateBeneficioDto {
  @ApiProperty({ required: false })
  nome?: string;

  @ApiProperty({ required: false })
  descricao?: string;

  @ApiProperty({ required: false })
  termos?: string;

  @ApiProperty({ required: false })
  categoria?: string;

  @ApiProperty({ required: false })
  nomeParceiro?: string;

  @ApiProperty({ required: false })
  logoParceiro?: string;

  @ApiProperty({ required: false })
  desconto?: string;

  @ApiProperty({ required: false })
  imagem?: string;

  @ApiProperty({ required: false })
  ativo?: boolean;

  @ApiProperty({ required: false })
  destacado?: boolean;

  @ApiProperty({ required: false })
  ordem?: number;

  @ApiProperty({ required: false })
  parceiroId?: string;
}

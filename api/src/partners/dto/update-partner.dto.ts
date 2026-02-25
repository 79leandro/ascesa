import { ApiProperty } from '@nestjs/swagger';

export class UpdatePartnerDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  corporateName?: string;

  @ApiProperty({ required: false })
  cnpj?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  discount?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  logo?: string;

  @ApiProperty({ required: false })
  website?: string;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  contractStart?: Date;

  @ApiProperty({ required: false })
  contractEnd?: Date;

  @ApiProperty({ required: false })
  isActive?: boolean;
}

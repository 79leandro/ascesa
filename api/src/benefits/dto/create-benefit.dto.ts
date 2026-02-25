import { ApiProperty } from '@nestjs/swagger';

export class CreateBenefitDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  terms?: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ required: false })
  partnerName?: string;

  @ApiProperty({ required: false })
  partnerLogo?: string;

  @ApiProperty({ required: false })
  discount?: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ required: false })
  isActive?: boolean;

  @ApiProperty({ required: false })
  isFeatured?: boolean;

  @ApiProperty({ required: false })
  order?: number;

  @ApiProperty({ required: false })
  partnerId?: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  cnpj: string;

  @ApiProperty({ required: false })
  logoUrl?: string;

  @ApiProperty()
  locationsCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
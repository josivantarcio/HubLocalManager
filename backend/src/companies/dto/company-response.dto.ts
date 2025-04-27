import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';

export class CompanyResponseDto {
  @ApiProperty({ type: [Company] })
  companies: Company[];

  @ApiProperty()
  count: number;
}
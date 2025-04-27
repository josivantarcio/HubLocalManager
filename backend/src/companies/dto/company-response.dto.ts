import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';

export class CompanyResponseDto {
  @ApiProperty({ 
    type: [Company],
    description: 'List of companies',
    example: [{
      id: 1,
      name: 'Company Name',
      cnpj: '12345678901234',
      website: 'https://example.com',
      locationsCount: 0,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }]
  })
  companies: Company[];

  @ApiProperty({ 
    description: 'Total number of companies',
    example: 1
  })
  count: number;
}
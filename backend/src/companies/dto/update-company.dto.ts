import { IsString, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(14, 14)
  cnpj?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}
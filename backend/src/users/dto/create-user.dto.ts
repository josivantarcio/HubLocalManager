import { IsString, IsNotEmpty } from 'class-validator';

class UserDto {
  id: number;
  name: string;
  email: string;
}

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cnpj: string;

  user: UserDto;
}
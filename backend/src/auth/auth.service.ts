import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const { email, password, name } = registerDto;
    return this.usersService.create({ email, password, name });
  }

  async validateUserByEmail(email: string): Promise<any> {
    return this.usersService.findOneByEmail(email);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user; // Remove a senha do retorno
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<any> {
  const { email, password } = loginDto;
  const user = await this.validateUser(email, password);
  if (user) {
    return { access_token: 'jwt_token' }; // Implemente a geração do JWT
  }
  throw new Error('Invalid credentials');
}
}
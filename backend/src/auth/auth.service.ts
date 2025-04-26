import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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
    const user = await this.usersService.create({ email, password, name });
    const { password: _, ...result } = user;
    return result;
  }

  async validateUserByEmail(email: string): Promise<any> {
    return this.usersService.findByEmail(email);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const payload = { 
      sub: user.id,
      email: user.email,
      name: user.name
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

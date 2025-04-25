import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service'; // Importe o AuthService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService, // Injete o AuthService
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.authService.validateUser(payload); // Chame validateUser
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return { userId: user.id, email: user.email }; // Retorne os dados do usuário
  }
}

import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    authService = new AuthService(
      usersService as UsersService,
      jwtService as JwtService,
    );
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const user = { id: 1, email: 'test@example.com', password: await bcrypt.hash('123456', 10) };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);

      const result = await authService.validateUser('test@example.com', '123456');
      expect(result).toHaveProperty('id');
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found or password invalid', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      const result = await authService.validateUser('notfound@example.com', '123456');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { id: 1, email: 'test@example.com' };
      const result = await authService.login(user);
      expect(result.access_token).toBe('fake-jwt-token');
    });
  });

  describe('register', () => {
    it('should hash password and return access token', async () => {
      const userData = { name: 'Test', email: 'test@example.com', password: '123456' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: userData.email,
      });

      const result = await authService.register(userData);
      expect(result.access_token).toBe('fake-jwt-token');
    });

    it('should throw if user already exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue({ id: 1, email: 'test@example.com' });

      await expect(authService.register({
        name: 'Test',
        email: 'test@example.com',
        password: '123456',
      })).rejects.toThrow();
    });
  });
});

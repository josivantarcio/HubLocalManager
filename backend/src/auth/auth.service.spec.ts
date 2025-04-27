import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock.jwt.token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: hashedPassword,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);

      const result = await service.validateUser(loginDto.email, loginDto.password);
      expect(result).toEqual(mockUser);
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(
        service.validateUser(loginDto.email, loginDto.password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: hashedPassword,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);

      await expect(
        service.validateUser(loginDto.email, loginDto.password),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
      };

      const result = await service.login(mockUser as any);
      expect(result).toEqual({
        access_token: 'mock.jwt.token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });

  describe('register', () => {
    it('should create a new user and return access token', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        ...createUserDto,
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as any);

      const result = await service.register(createUserDto);
      expect(result).toEqual({
        access_token: 'mock.jwt.token',
      });
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });
});

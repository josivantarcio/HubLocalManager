import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: { create: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('deve criar um novo usuário e retornar o token de acesso', async () => {
      const createUserDto = { email: 'test@example.com', name: 'Test User', password: 'password' };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        companies: [],
      };
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as User);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock.jwt.token');

      const result = await service.register(createUserDto);

      expect(result).toEqual({
        access_token: 'mock.jwt.token',
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        companies: [],
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser(loginDto.email, loginDto.password);

      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(service.validateUser(loginDto.email, loginDto.password))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        companies: [],
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.validateUser(loginDto.email, loginDto.password))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        companies: [],
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser as User);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock.jwt.token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: 'mock.jwt.token',
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });
});

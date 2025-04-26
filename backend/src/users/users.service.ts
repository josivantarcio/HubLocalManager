import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const { email } = userData;
    
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create new user
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'name', 'email', 'password']
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
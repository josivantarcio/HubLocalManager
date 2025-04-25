import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    private usersService: UsersService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId: number) {
    const user = await this.usersService.findById(userId);
    
    const company = this.companiesRepository.create({
      ...createCompanyDto,
      user,
    });
    
    return this.companiesRepository.save(company);
  }

  async findAll(userId: number) {
    return this.companiesRepository.find({ 
      where: { user: { id: userId } },
      relations: ['user'] 
    });
  }

  async findOne(id: number, userId: number) {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    
    // Verificar se a empresa pertence ao usuário
    if (company.user.id !== userId) {
      throw new ForbiddenException('You do not have access to this company');
    }
    
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto, userId: number) {
    const company = await this.findOne(id, userId);
    
    Object.assign(company, updateCompanyDto);
    
    return this.companiesRepository.save(company);
  }

  async remove(id: number, userId: number) {
    const company = await this.findOne(id, userId);
    await this.companiesRepository.remove(company);
  }
}
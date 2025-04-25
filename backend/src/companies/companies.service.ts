import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createCompanyDto: CreateCompanyDto) {
    const { user: userDto, ...companyData } = createCompanyDto;
    const user = await this.usersService.findById(userDto.id);
    if (!user) {
      throw new NotFoundException(`User with ID ${userDto.id} not found`);
    }
    const company = this.companiesRepository.create({
      ...companyData,
      user,
    });
    return this.companiesRepository.save(company);
  }

  async findAll() {
    return this.companiesRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id);
    Object.assign(company, updateCompanyDto);
    return this.companiesRepository.save(company);
  }

  async remove(id: number) {
    const company = await this.findOne(id);
    await this.companiesRepository.remove(company);
  }
}
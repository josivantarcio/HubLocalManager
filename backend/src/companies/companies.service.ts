import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId: number) {
    const company = this.companiesRepository.create({
      ...createCompanyDto,
      userId, // Associa ao usuário logado (multi-tenancy)
    });
    return this.companiesRepository.save(company);
  }

  // Adicione métodos find, update, delete...
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Company | null> {
    return this.companiesRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async create(company: Partial<Company>): Promise<Company> {
    const newCompany = this.companiesRepository.create(company);
    return this.companiesRepository.save(newCompany);
  }

  async update(id: number, company: Partial<Company>): Promise<Company | null> {
    await this.companiesRepository.update(id, company);
    return this.companiesRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async remove(id: number): Promise<void> {
    await this.companiesRepository.delete(id);
  }
}
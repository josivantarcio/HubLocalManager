import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './company.entity';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Company> {
    const company = await this.companiesService.findOne(+id); // Linha 16
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  @Post()
  create(@Body() company: Partial<Company>): Promise<Company> {
    return this.companiesService.create(company);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() company: Partial<Company>): Promise<Company> {
    const updatedCompany = await this.companiesService.update(+id, company); // Linha 26
    if (!updatedCompany) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return updatedCompany;
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.companiesService.remove(+id);
  }
}
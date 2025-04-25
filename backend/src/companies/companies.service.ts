import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto'; // Import UpdateCompanyDto
import { UsersService } from '../users/users.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private usersService: UsersService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    if (!createCompanyDto) {
      throw new BadRequestException('Dados da empresa não fornecidos');
    }
    const { user: userDto, name, cnpj } = createCompanyDto;
    const user = await this.usersService.findOne(userDto.id);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    const company = this.companyRepository.create({ name, cnpj, user });
    return this.companyRepository.save(company);
  }

  async findAll() {
    return this.companyRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }
    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async remove(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }
    await this.companyRepository.remove(company);
    return { message: `Empresa com ID ${id} removida com sucesso` };
  }
}
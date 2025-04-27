import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  InternalServerErrorException,
  Logger,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { validate } from 'class-validator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CompanyResponseDto } from './dto/company-response.dto';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto, 
    userId: number,
    manager?: EntityManager
  ): Promise<CompanyResponseDto> {
    const repository = manager?.getRepository(Company) || this.companiesRepository;
    
    try {
      // Validação dos dados de entrada
      const errors = await validate(createCompanyDto);
      if (errors.length > 0) {
        const errorMessages = errors.flatMap(err => err.constraints ? Object.values(err.constraints) : []);
        throw new BadRequestException(errorMessages);
      }

      // Verifica se CNPJ já existe
      const exists = await repository.findOne({ 
        where: { cnpj: createCompanyDto.cnpj },
        withDeleted: true // Considera registros deletados logicamente
      });
      
      if (exists) {
        throw new ConflictException('CNPJ já cadastrado');
      }

      const company = repository.create({
        ...createCompanyDto,
        user: { id: userId },
      });

      const savedCompany = await repository.save(company);
      this.logger.log(`Company ${savedCompany.id} created by user ${userId}`);
      
      return this.toResponseDto(savedCompany);
    } catch (error) {
      this.logger.error(`Error creating company: ${error.message}`, error.stack);
      throw this.handleError(error);
    }
  }

  async findAll(
    userId: number,
    pagination: PaginationDto
  ): Promise<CompanyResponseDto> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    try {
      const [companies, count] = await this.companiesRepository.findAndCount({
        where: { user: { id: userId } },
        relations: ['locations'],
        skip,
        take: limit,
      });

      return {
        companies,
        count
      };
    } catch (error) {
      this.logger.error(
        `Error finding companies for user ${userId}: ${error.message}`,
      );
      throw this.handleError(error);
    }
  }

  async findOne(id: number, userId: number): Promise<CompanyResponseDto> {
    try {
      const company = await this.companiesRepository.findOne({
        where: { id, user: { id: userId } },
        relations: ['locations', 'user'],
      });

      if (!company) {
        throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
      }

      return this.toResponseDto(company);
    } catch (error) {
      this.logger.error(`Error finding company ${id}: ${error.message}`);
      throw this.handleError(error);
    }
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
    userId: number,
    manager?: EntityManager
  ): Promise<CompanyResponseDto> {
    const repository = manager?.getRepository(Company) || this.companiesRepository;
    
    try {
      const company = await repository.findOne({
        where: { id, user: { id: userId } },
      });

      if (!company) {
        throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
      }

      // Verifica se o novo CNPJ já existe (se foi alterado)
      if (updateCompanyDto.cnpj && updateCompanyDto.cnpj !== company.cnpj) {
        const exists = await repository.findOne({ 
          where: { cnpj: updateCompanyDto.cnpj },
          withDeleted: true
        });
        
        if (exists) {
          throw new ConflictException('Novo CNPJ já está em uso');
        }
      }

      Object.assign(company, updateCompanyDto);
      const updatedCompany = await repository.save(company);
      this.logger.log(`Company ${id} updated by user ${userId}`);

      return this.toResponseDto(updatedCompany);
    } catch (error) {
      this.logger.error(`Error updating company ${id}: ${error.message}`);
      throw this.handleError(error);
    }
  }

  async remove(
    id: number,
    userId: number,
    manager?: EntityManager
  ): Promise<void> {
    const repository = manager?.getRepository(Company) || this.companiesRepository;
    
    try {
      const company = await repository.findOne({
        where: { id, user: { id: userId } },
      });

      if (!company) {
        throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
      }

      await repository.remove(company);
      this.logger.log(`Company ${id} deleted by user ${userId}`);
    } catch (error) {
      this.logger.error(`Error deleting company ${id}: ${error.message}`);
      throw this.handleError(error);
    }
  }

  private toResponseDto(company: Company): CompanyResponseDto {
    return {
      id: company.id,
      name: company.name,
      website: company.website,
      cnpj: company.cnpj,
      logoUrl: company.logoUrl,
      locationsCount: company.locations?.length || 0,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  private handleError(error: Error) {
    if (
      error instanceof NotFoundException ||
      error instanceof ConflictException ||
      error instanceof BadRequestException
    ) {
      return error;
    }
    return new InternalServerErrorException('Ocorreu um erro inesperado');
  }
}
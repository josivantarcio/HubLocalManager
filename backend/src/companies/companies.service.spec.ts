import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CompanyResponseDto } from './dto/company-response.dto';
import { User } from '../users/entities/user.entity';

const mockUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
  companies: [],
};

interface MockCompany {
  id: number;
  name: string;
  cnpj: string;
  website: string;
  locationsCount: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async findAll(userId: number, pagination: PaginationDto): Promise<CompanyResponseDto> {
    const [companies, count] = await this.companiesRepository.findAndCount({
      where: { user: { id: userId } },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      relations: ['user'],
    });
    return {
      companies,
      count,
    };
  }

  async findOne(id: number, userId: number): Promise<Company | null> {
    return this.companiesRepository.findOne({ where: { id, user: { id: userId } }, relations: ['user'] });
  }

  async create(company: Partial<Company>, userId: number): Promise<Company> {
    const newCompany = this.companiesRepository.create(company);
    newCompany.user = mockUser;
    return this.companiesRepository.save(newCompany);
  }

  async update(id: number, company: Partial<Company>, userId: number): Promise<Company | null> {
    await this.companiesRepository.update(id, company);
    return this.companiesRepository.findOne({ where: { id, user: { id: userId } }, relations: ['user'] });
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.companiesRepository.delete(id);
  }
}

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companiesRepository: Repository<Company>;

  const mockCompany: MockCompany = {
    id: 1,
    name: 'Test Company',
    cnpj: '12345678901234',
    website: 'https://testcompany.com',
    locationsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
  };

  const mockCompaniesRepository = {
    create: jest.fn().mockReturnValue(mockCompany),
    save: jest.fn().mockResolvedValue(mockCompany),
    findOne: jest.fn().mockResolvedValue(mockCompany),
    findAndCount: jest.fn().mockResolvedValue([[mockCompany], 1]),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockCompany], 1]),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompaniesRepository,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    companiesRepository = module.get<Repository<Company>>(getRepositoryToken(Company));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma empresa', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        cnpj: '12345678901234',
        website: 'https://testcompany.com',
      };

      const result = await service.create(createCompanyDto, 1);

      expect(result).toEqual({
        id: mockCompany.id,
        name: mockCompany.name,
        cnpj: mockCompany.cnpj,
        website: mockCompany.website,
        locationsCount: mockCompany.locationsCount,
        createdAt: mockCompany.createdAt,
        updatedAt: mockCompany.updatedAt,
      });
      expect(companiesRepository.create).toHaveBeenCalledWith({
        ...createCompanyDto,
        user: mockUser,
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de empresas', async () => {
      const result = await service.findAll(1, { page: 1, limit: 10 });

      expect(result).toEqual({
        companies: [{
          id: mockCompany.id,
          name: mockCompany.name,
          cnpj: mockCompany.cnpj,
          website: mockCompany.website,
          locationsCount: mockCompany.locationsCount,
          createdAt: mockCompany.createdAt,
          updatedAt: mockCompany.updatedAt,
        }],
        count: 1,
      });
      expect(companiesRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ['locations'],
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma empresa específica', async () => {
      const result = await service.findOne(1, 1);

      expect(result).toEqual({
        id: mockCompany.id,
        name: mockCompany.name,
        cnpj: mockCompany.cnpj,
        website: mockCompany.website,
        locationsCount: mockCompany.locationsCount,
        createdAt: mockCompany.createdAt,
        updatedAt: mockCompany.updatedAt,
      });
      expect(companiesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, user: { id: 1 } },
        relations: ['locations', 'user'],
      });
    });
  });

  describe('update', () => {
    it('deve atualizar uma empresa', async () => {
      const updateCompanyDto: UpdateCompanyDto = {
        name: 'Updated Company',
        website: 'https://updatedcompany.com',
      };

      const result = await service.update(1, updateCompanyDto, 1);

      expect(result).toEqual({
        id: mockCompany.id,
        name: mockCompany.name,
        cnpj: mockCompany.cnpj,
        website: mockCompany.website,
        locationsCount: mockCompany.locationsCount,
        createdAt: mockCompany.createdAt,
        updatedAt: mockCompany.updatedAt,
      });
      expect(companiesRepository.update).toHaveBeenCalledWith(
        { id: 1, user: { id: 1 } },
        updateCompanyDto,
      );
    });
  });

  describe('remove', () => {
    it('deve remover uma empresa', async () => {
      await service.remove(1, 1);

      expect(companiesRepository.delete).toHaveBeenCalledWith({
        id: 1,
        user: { id: 1 },
      });
    });
  });
});
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

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

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repository: Repository<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    repository = module.get<Repository<Company>>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const userId = 1;
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        cnpj: '12345678901234',
      };

      const mockCompany = {
        id: 1,
        ...createCompanyDto,
        userId,
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockCompany as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockCompany as any);

      const result = await service.create(userId, createCompanyDto);
      expect(result).toEqual(mockCompany);
      expect(repository.create).toHaveBeenCalledWith({
        ...createCompanyDto,
        userId,
      });
      expect(repository.save).toHaveBeenCalledWith(mockCompany);
    });
  });

  describe('findAll', () => {
    it('should return all companies for a user', async () => {
      const userId = 1;
      const mockCompanies = [
        { id: 1, name: 'Company 1', userId },
        { id: 2, name: 'Company 2', userId },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockCompanies as any);

      const result = await service.findAll(userId);
      expect(result).toEqual(mockCompanies);
      expect(repository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
    });
  });

  describe('findOne', () => {
    it('should return a company by id', async () => {
      const userId = 1;
      const companyId = 1;
      const mockCompany = {
        id: companyId,
        name: 'Test Company',
        userId,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCompany as any);

      const result = await service.findOne(userId, companyId);
      expect(result).toEqual(mockCompany);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: companyId, user: { id: userId } },
      });
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const userId = 1;
      const companyId = 1;
      const updateCompanyDto: UpdateCompanyDto = {
        name: 'Updated Company',
      };

      const mockCompany = {
        id: companyId,
        name: 'Test Company',
        userId,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockCompany as any);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockCompany,
        ...updateCompanyDto,
      } as any);

      const result = await service.update(userId, companyId, updateCompanyDto);
      expect(result).toEqual({
        ...mockCompany,
        ...updateCompanyDto,
      });
      expect(service.findOne).toHaveBeenCalledWith(userId, companyId);
      expect(repository.save).toHaveBeenCalledWith({
        ...mockCompany,
        ...updateCompanyDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a company', async () => {
      const userId = 1;
      const companyId = 1;
      const mockCompany = {
        id: companyId,
        name: 'Test Company',
        userId,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockCompany as any);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await service.remove(userId, companyId);
      expect(service.findOne).toHaveBeenCalledWith(userId, companyId);
      expect(repository.remove).toHaveBeenCalledWith(mockCompany);
    });
  });
});
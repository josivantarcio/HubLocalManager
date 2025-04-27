import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyResponseDto } from './dto/company-response.dto';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  const mockCompaniesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { userId: 1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a company', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        description: 'Test Description',
      };
      const expectedResult = { id: 1, ...createCompanyDto };

      mockCompaniesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCompanyDto, { user: mockUser } as any);
      expect(result).toEqual(expectedResult);
      expect(mockCompaniesService.create).toHaveBeenCalledWith(createCompanyDto, mockUser.userId);
    });
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const expectedResult: CompanyResponseDto = {
        companies: [
          { id: 1, name: 'Test Company 1', description: 'Description 1' },
          { id: 2, name: 'Test Company 2', description: 'Description 2' },
        ],
        count: 2,
      };

      mockCompaniesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll({ user: mockUser } as any);
      expect(result).toEqual(expectedResult);
      expect(mockCompaniesService.findAll).toHaveBeenCalledWith(mockUser.userId);
    });
  });

  describe('findOne', () => {
    it('should return a company by id', async () => {
      const companyId = '1';
      const expectedResult = { id: 1, name: 'Test Company', description: 'Test Description' };

      mockCompaniesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(companyId, { user: mockUser } as any);
      expect(result).toEqual(expectedResult);
      expect(mockCompaniesService.findOne).toHaveBeenCalledWith(1, mockUser.userId);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const companyId = '1';
      const updateCompanyDto: UpdateCompanyDto = {
        name: 'Updated Company',
        description: 'Updated Description',
      };
      const expectedResult = { id: 1, ...updateCompanyDto };

      mockCompaniesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(companyId, updateCompanyDto, { user: mockUser } as any);
      expect(result).toEqual(expectedResult);
      expect(mockCompaniesService.update).toHaveBeenCalledWith(1, updateCompanyDto, mockUser.userId);
    });
  });

  describe('remove', () => {
    it('should remove a company', async () => {
      const companyId = '1';
      const expectedResult = { id: 1, name: 'Test Company', description: 'Test Description' };

      mockCompaniesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(companyId, { user: mockUser } as any);
      expect(result).toEqual(expectedResult);
      expect(mockCompaniesService.remove).toHaveBeenCalledWith(1, mockUser.userId);
    });
  });
});
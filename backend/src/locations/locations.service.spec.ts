import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CompaniesService } from '../companies/companies.service';

describe('LocationsService', () => {
  let service: LocationsService;
  let repository: Repository<Location>;
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getRepositoryToken(Location),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: CompaniesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    repository = module.get<Repository<Location>>(getRepositoryToken(Location));
    companiesService = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new location', async () => {
      const userId = 1;
      const companyId = 1;
      const createLocationDto: CreateLocationDto = {
        name: 'Test Location',
        cep: '12345678',
        street: 'Test Street',
        number: '123',
        neighborhood: 'Test Neighborhood',
        city: 'Test City',
        state: 'TS',
      };

      const mockCompany = {
        id: companyId,
        userId,
      };

      const mockLocation = {
        id: 1,
        ...createLocationDto,
        company: mockCompany,
      };

      jest.spyOn(companiesService, 'findOne').mockResolvedValue(mockCompany as any);
      jest.spyOn(repository, 'create').mockReturnValue(mockLocation as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockLocation as any);

      const result = await service.create(userId, companyId, createLocationDto);
      expect(result).toEqual(mockLocation);
      expect(companiesService.findOne).toHaveBeenCalledWith(userId, companyId);
      expect(repository.create).toHaveBeenCalledWith({
        ...createLocationDto,
        company: mockCompany,
      });
      expect(repository.save).toHaveBeenCalledWith(mockLocation);
    });
  });

  describe('findAll', () => {
    it('should return all locations for a company', async () => {
      const userId = 1;
      const companyId = 1;
      const mockLocations = [
        { id: 1, name: 'Location 1', company: { id: companyId } },
        { id: 2, name: 'Location 2', company: { id: companyId } },
      ];

      jest.spyOn(companiesService, 'findOne').mockResolvedValue({ id: companyId } as any);
      jest.spyOn(repository, 'find').mockResolvedValue(mockLocations as any);

      const result = await service.findAll(userId, companyId);
      expect(result).toEqual(mockLocations);
      expect(companiesService.findOne).toHaveBeenCalledWith(userId, companyId);
      expect(repository.find).toHaveBeenCalledWith({
        where: { company: { id: companyId } },
      });
    });
  });

  describe('findOne', () => {
    it('should return a location by id', async () => {
      const userId = 1;
      const companyId = 1;
      const locationId = 1;
      const mockLocation = {
        id: locationId,
        name: 'Test Location',
        company: { id: companyId },
      };

      jest.spyOn(companiesService, 'findOne').mockResolvedValue({ id: companyId } as any);
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockLocation as any);

      const result = await service.findOne(userId, companyId, locationId);
      expect(result).toEqual(mockLocation);
      expect(companiesService.findOne).toHaveBeenCalledWith(userId, companyId);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: locationId, company: { id: companyId } },
      });
    });
  });

  describe('update', () => {
    it('should update a location', async () => {
      const userId = 1;
      const companyId = 1;
      const locationId = 1;
      const updateLocationDto: UpdateLocationDto = {
        name: 'Updated Location',
      };

      const mockLocation = {
        id: locationId,
        name: 'Test Location',
        company: { id: companyId },
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockLocation as any);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockLocation,
        ...updateLocationDto,
      } as any);

      const result = await service.update(userId, companyId, locationId, updateLocationDto);
      expect(result).toEqual({
        ...mockLocation,
        ...updateLocationDto,
      });
      expect(service.findOne).toHaveBeenCalledWith(userId, companyId, locationId);
      expect(repository.save).toHaveBeenCalledWith({
        ...mockLocation,
        ...updateLocationDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a location', async () => {
      const userId = 1;
      const companyId = 1;
      const locationId = 1;
      const mockLocation = {
        id: locationId,
        name: 'Test Location',
        company: { id: companyId },
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockLocation as any);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await service.remove(userId, companyId, locationId);
      expect(service.findOne).toHaveBeenCalledWith(userId, companyId, locationId);
      expect(repository.remove).toHaveBeenCalledWith(mockLocation);
    });
  });
});

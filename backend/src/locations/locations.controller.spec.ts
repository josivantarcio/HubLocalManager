import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: number;
  };
}

describe('LocationsController', () => {
  let controller: LocationsController;
  let locationsService: LocationsService;

  const mockLocationsService = {
    create: jest.fn().mockResolvedValue({ 
      id: 1, 
      name: 'Test Location',
      cep: '12345678',
      street: 'Test Street',
      number: '123',
      neighborhood: 'Test Neighborhood',
      city: 'Test City',
      state: 'TS',
      company: {
        id: 1,
        name: 'Test Company',
        cnpj: '12345678901234',
        website: 'https://testcompany.com',
        locationsCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
          companies: [],
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    findAll: jest.fn().mockResolvedValue({
      locations: [{
        id: 1,
        name: 'Test Location',
        cep: '12345678',
        street: 'Test Street',
        number: '123',
        neighborhood: 'Test Neighborhood',
        city: 'Test City',
        state: 'TS',
        company: {
          id: 1,
          name: 'Test Company',
          cnpj: '12345678901234',
          website: 'https://testcompany.com',
          locationsCount: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            createdAt: new Date(),
            updatedAt: new Date(),
            companies: [],
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      count: 1,
    }),
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Test Location',
      cep: '12345678',
      street: 'Test Street',
      number: '123',
      neighborhood: 'Test Neighborhood',
      city: 'Test City',
      state: 'TS',
      company: {
        id: 1,
        name: 'Test Company',
        cnpj: '12345678901234',
        website: 'https://testcompany.com',
        locationsCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
          companies: [],
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Updated Location',
      cep: '12345678',
      street: 'Updated Street',
      number: '123',
      neighborhood: 'Updated Neighborhood',
      city: 'Updated City',
      state: 'TS',
      company: {
        id: 1,
        name: 'Test Company',
        cnpj: '12345678901234',
        website: 'https://testcompany.com',
        locationsCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
          companies: [],
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        { provide: LocationsService, useValue: mockLocationsService },
      ],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
    locationsService = module.get<LocationsService>(LocationsService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma localização', async () => {
      const createLocationDto: CreateLocationDto = {
        name: 'Test Location',
        cep: '12345678',
        street: 'Test Street',
        number: '123',
        neighborhood: 'Test Neighborhood',
        city: 'Test City',
        state: 'TS',
      };

      const mockReq = { user: { userId: 1 } } as RequestWithUser;
      const result = await controller.create(mockReq, '1', createLocationDto);

      expect(result).toEqual(mockLocationsService.create());
      expect(locationsService.create).toHaveBeenCalledWith(1, 1, createLocationDto);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as localizações', async () => {
      const mockReq = { user: { userId: 1 } } as RequestWithUser;
      const result = await controller.findAll(mockReq, '1');

      expect(result).toEqual(mockLocationsService.findAll());
      expect(locationsService.findAll).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma localização específica', async () => {
      const mockReq = { user: { userId: 1 } } as RequestWithUser;
      const result = await controller.findOne(mockReq, '1', '1');

      expect(result).toEqual(mockLocationsService.findOne());
      expect(locationsService.findOne).toHaveBeenCalledWith(1, 1, 1);
    });
  });

  describe('update', () => {
    it('deve atualizar uma localização', async () => {
      const updateLocationDto: UpdateLocationDto = {
        name: 'Updated Location',
        street: 'Updated Street',
        neighborhood: 'Updated Neighborhood',
        city: 'Updated City',
      };

      const mockReq = { user: { userId: 1 } } as RequestWithUser;
      const result = await controller.update(mockReq, '1', '1', updateLocationDto);

      expect(result).toEqual(mockLocationsService.update());
      expect(locationsService.update).toHaveBeenCalledWith(1, 1, 1, updateLocationDto);
    });
  });

  describe('remove', () => {
    it('deve remover uma localização', async () => {
      const mockReq = { user: { userId: 1 } } as RequestWithUser;
      await controller.remove(mockReq, '1', '1');

      expect(locationsService.remove).toHaveBeenCalledWith(1, 1, 1);
    });
  });
});
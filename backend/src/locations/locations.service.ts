import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
    private companiesService: CompaniesService,
  ) {}

  async create(createLocationDto: CreateLocationDto, userId: number) {
    const { companyId, ...locationData } = createLocationDto;
    
    // Verifica se a empresa pertence ao usuário
    const company = await this.companiesService.findOne(companyId, userId);
    
    const location = this.locationsRepository.create({
      ...locationData,
      company,
    });
    
    return this.locationsRepository.save(location);
  }

  async findAll(userId: number) {
    return this.locationsRepository.find({ 
      relations: ['company', 'company.user'],
      where: { company: { user: { id: userId } } }
    });
  }

  async findOne(id: number, userId: number) {
    const location = await this.locationsRepository.findOne({
      where: { id },
      relations: ['company', 'company.user'],
    });
    
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    
    // Verificar se o local pertence a uma empresa do usuário
    if (location.company.user.id !== userId) {
      throw new ForbiddenException('You do not have access to this location');
    }
    
    return location;
  }

  async findByCompany(companyId: number, userId: number) {
    // Verifica se a empresa pertence ao usuário
    await this.companiesService.findOne(companyId, userId);
    
    return this.locationsRepository.find({
      where: { company: { id: companyId } },
      relations: ['company'],
    });
  }

  async update(id: number, updateLocationDto: UpdateLocationDto, userId: number) {
    const location = await this.findOne(id, userId);
    
    Object.assign(location, updateLocationDto);
    
    return this.locationsRepository.save(location);
  }

  async remove(id: number, userId: number) {
    const location = await this.findOne(id, userId);
    await this.locationsRepository.remove(location);
  }
}
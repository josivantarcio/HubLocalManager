import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createLocationDto: CreateLocationDto) {
    const { company: companyDto, ...locationData } = createLocationDto;
    const company = await this.companiesService.findOne(companyDto.id);
    
    const location = this.locationsRepository.create({
      ...locationData,
      company,
    });
    
    return this.locationsRepository.save(location);
  }

  async findAll() {
    return this.locationsRepository.find({ relations: ['company'] });
  }

  async findOne(id: number) {
    const location = await this.locationsRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    
    return location;
  }

  async findByCompany(companyId: number) {
    return this.locationsRepository.find({
      where: { company: { id: companyId } },
      relations: ['company'],
    });
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.findOne(id);
    
    Object.assign(location, updateLocationDto);
    
    return this.locationsRepository.save(location);
  }

  async remove(id: number) {
    const location = await this.findOne(id);
    await this.locationsRepository.remove(location);
  }
}
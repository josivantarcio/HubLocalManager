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
    private locationRepository: Repository<Location>,
    private companiesService: CompaniesService,
  ) {}

  async create(createLocationDto: CreateLocationDto, userId: number): Promise<Location> {
    await this.companiesService.findOne(userId, createLocationDto.companyId);

    const location = this.locationRepository.create(createLocationDto);
    return this.locationRepository.save(location);
  }

  async findAll(companyId: number, userId: number): Promise<Location[]> {
    await this.companiesService.findOne(userId, companyId);
    return this.locationRepository.find({ where: { companyId } });
  }

  async findOne(id: number, companyId: number, userId: number): Promise<Location> {
    await this.companiesService.findOne(userId, companyId);

    const location = await this.locationRepository.findOne({
      where: { id, companyId },
    });

    if (!location) {
      throw new NotFoundException('Localização não encontrada');
    }

    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto, userId: number): Promise<Location> {
    const location = await this.findOne(id, updateLocationDto.companyId, userId);
    Object.assign(location, updateLocationDto);
    return this.locationRepository.save(location);
  }

  async remove(id: number, companyId: number, userId: number): Promise<void> {
    const location = await this.findOne(id, companyId, userId);
    await this.locationRepository.softDelete(location.id);
  }
}
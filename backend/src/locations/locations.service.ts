import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
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

  async create(userId: number, companyId: number, createLocationDto: CreateLocationDto): Promise<Location> {
    const company = await this.companiesService.findOne(userId, companyId);

    const location = this.locationRepository.create({
      ...createLocationDto,
      company,
    });

    return await this.locationRepository.save(location);
  }

  async findAll(userId: number, companyId: number): Promise<Location[]> {
    await this.companiesService.findOne(userId, companyId);
    return this.locationRepository.find({ where: { company: { id: companyId } } });
  }

  async findOne(userId: number, companyId: number, id: number): Promise<Location> {
    await this.companiesService.findOne(userId, companyId);

    const location = await this.locationRepository.findOne({
      where: { id, company: { id: companyId } },
    });

    if (!location) {
      throw new NotFoundException('Localização não encontrada');
    }

    return location;
  }

  async update(userId: number, companyId: number, id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const location = await this.findOne(userId, companyId, id);
    Object.assign(location, updateLocationDto);
    return await this.locationRepository.save(location);
  }

  async remove(userId: number, companyId: number, id: number): Promise<void> {
    const location = await this.findOne(userId, companyId, id);
    await this.locationRepository.remove(location);
  }
}
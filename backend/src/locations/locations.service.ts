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

  async create(userId: number, companyId: number, createLocationDto: CreateLocationDto): Promise<Location> {
    // Verify company exists and belongs to user
    await this.companiesService.findOne(userId, companyId);

    const location = this.locationsRepository.create({
      ...createLocationDto,
      company: { id: companyId },
    });

    return this.locationsRepository.save(location);
  }

  async findAll(userId: number, companyId: number) {
    // Verify company exists and belongs to user
    await this.companiesService.findOne(userId, companyId);

    return this.locationsRepository.find({
      where: { company: { id: companyId } },
    });
  }

  async findOne(userId: number, companyId: number, id: number): Promise<Location> {
    // Verify company exists and belongs to user
    await this.companiesService.findOne(userId, companyId);

    const location = await this.locationsRepository.findOne({
      where: { id, company: { id: companyId } },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  async update(
    userId: number,
    companyId: number,
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(userId, companyId, id);
    Object.assign(location, updateLocationDto);
    return this.locationsRepository.save(location);
  }

  async remove(userId: number, companyId: number, id: number): Promise<void> {
    const location = await this.findOne(userId, companyId, id);
    await this.locationsRepository.remove(location);
  }
}
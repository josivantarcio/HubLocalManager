import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuth } from '../auth/decorators/jwt-auth.decorator';

@Controller('companies/:companyId/locations')
@JwtAuth()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  async create(
    @Req() req,
    @Param('companyId') companyId: string,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    return this.locationsService.create(req.user.userId, +companyId, createLocationDto);
  }

  @Get()
  async findAll(@Req() req, @Param('companyId') companyId: string) {
    return this.locationsService.findAll(req.user.userId, +companyId);
  }

  @Get(':id')
  async findOne(
    @Req() req,
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.locationsService.findOne(req.user.userId, +companyId, +id);
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(req.user.userId, +companyId, +id, updateLocationDto);
  }

  @Delete(':id')
  async remove(
    @Req() req,
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.locationsService.remove(req.user.userId, +companyId, +id);
  }
}
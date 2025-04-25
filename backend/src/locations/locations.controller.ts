import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Query, Request } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('locations')
@UseGuards(JwtAuthGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLocationDto: CreateLocationDto, @Request() req) {
    return this.locationsService.create(createLocationDto, req.user.userId);
  }

  @Get()
  async findAll(@Query('companyId') companyId: string, @Request() req) {
    if (companyId) {
      return this.locationsService.findByCompany(+companyId, req.user.userId);
    }
    return this.locationsService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.locationsService.findOne(+id, req.user.userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateLocationDto: UpdateLocationDto, 
    @Request() req
  ) {
    return this.locationsService.update(+id, updateLocationDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    return this.locationsService.remove(+id, req.user.userId);
  }
}
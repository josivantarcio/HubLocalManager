import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('companies/:companyId/locations')
@UseGuards(JwtAuthGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(
    @Req() req,
    @Param('companyId') companyId: string,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    return this.locationsService.create(req.user.userId, +companyId, createLocationDto);
  }

  @Get()
  findAll(@Req() req, @Param('companyId') companyId: string) {
    return this.locationsService.findAll(req.user.userId, +companyId);
  }

  @Get(':id')
  findOne(
    @Req() req,
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.locationsService.findOne(req.user.userId, +companyId, +id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(req.user.userId, +companyId, +id, updateLocationDto);
  }

  @Delete(':id')
  remove(
    @Req() req,
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.locationsService.remove(req.user.userId, +companyId, +id);
  }
}
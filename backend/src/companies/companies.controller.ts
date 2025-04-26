import { Controller, Get, Post, Put, Delete, Body, Param, Req, Query, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuth } from '../auth/decorators/jwt-auth.decorator';

@Controller('companies')
@JwtAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Req() req, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(req.user.userId, createCompanyDto);
  }

  @Get()
  async findAll(@Req() req, @Query() pagination: PaginationDto) {
    return this.companiesService.findAll(req.user.userId, pagination);
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    return this.companiesService.findOne(req.user.userId, +id);
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(req.user.userId, +id, updateCompanyDto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.companiesService.remove(req.user.userId, +id);
  }
}
import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCompanyDto: CreateCompanyDto, @Request() req) {
    return this.companiesService.create(createCompanyDto, req.user.userId);
  }

  @Get()
  async findAll(@Request() req) {
    return this.companiesService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.companiesService.findOne(+id, req.user.userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateCompanyDto: UpdateCompanyDto, 
    @Request() req
  ) {
    return this.companiesService.update(+id, updateCompanyDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    return this.companiesService.remove(+id, req.user.userId);
  }
}
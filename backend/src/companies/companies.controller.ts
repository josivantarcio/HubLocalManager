import { Controller, Get, Req, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { PaginationDto } from './dto/pagination.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll(@Req() req, @Query() pagination: PaginationDto) {
    return this.companiesService.findAll(req.user.userId, pagination);
  }
}
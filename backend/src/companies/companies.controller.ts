import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: number;
  };
}

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: RequestWithUser, @Query() pagination: PaginationDto) {
    return this.companiesService.findAll(req.user.userId, pagination);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.companiesService.findOne(req.user.userId, +id);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(parseInt(id), updateCompanyDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.companiesService.remove(req.user.userId, +id);
  }
}
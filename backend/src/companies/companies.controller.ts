import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyResponseDto } from './dto/company-response.dto';

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
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req: RequestWithUser) {
    return this.companiesService.create(createCompanyDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req: RequestWithUser): Promise<CompanyResponseDto> {
    return this.companiesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.companiesService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req: RequestWithUser,
  ) {
    return this.companiesService.update(+id, updateCompanyDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.companiesService.remove(+id, req.user.userId);
  }
}
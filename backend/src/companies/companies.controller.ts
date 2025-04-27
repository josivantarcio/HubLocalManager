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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: {
    userId: number;
  };
}

@ApiTags('companies')
@ApiBearerAuth()
@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ 
    status: 201, 
    description: 'The company has been successfully created.',
    type: CompanyResponseDto
  })
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req: RequestWithUser) {
    return this.companiesService.create(createCompanyDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all companies.',
    type: CompanyResponseDto
  })
  findAll(@Request() req: RequestWithUser): Promise<CompanyResponseDto> {
    return this.companiesService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by id' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return a company by id.',
    type: CompanyResponseDto
  })
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.companiesService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company' })
  @ApiResponse({ 
    status: 200, 
    description: 'The company has been successfully updated.',
    type: CompanyResponseDto
  })
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req: RequestWithUser,
  ) {
    return this.companiesService.update(+id, updateCompanyDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company' })
  @ApiResponse({ 
    status: 200, 
    description: 'The company has been successfully deleted.'
  })
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.companiesService.remove(+id, req.user.userId);
  }
}
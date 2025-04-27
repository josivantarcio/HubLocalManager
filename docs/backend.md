# Documentação do Backend

## Visão Geral

O backend do HubLocal Manager é construído com NestJS, um framework Node.js progressivo para construir aplicações server-side eficientes e escaláveis. Utiliza TypeORM para acesso ao banco de dados PostgreSQL e implementa autenticação JWT. O sistema está configurado para rodar localmente em desenvolvimento e no Render.com em produção.

## Requisitos

- Node.js 20 ou superior
- Docker e Docker Compose
- PostgreSQL
- Conta no Render.com

## Configuração de Portas

- **Desenvolvimento Local**:
  - Backend: `http://localhost:3001`
  - PostgreSQL: `localhost:5433`
  - Swagger: `http://localhost:3001/api`

- **Produção (Render.com)**:
  - Backend: `https://hublocal-backend.onrender.com`
  - PostgreSQL: Render.com PostgreSQL
  - Swagger: `https://hublocal-backend.onrender.com/api`

## Infraestrutura Render.com

O backend está configurado para ser implantado no Render.com usando os seguintes recursos:

- **Web Service**: Para execução do container Docker
- **PostgreSQL**: Para o banco de dados
- **Environment Variables**: Para configuração
- **Health Checks**: Para monitoramento
- **Auto-scaling**: Para escalabilidade

## Docker

O projeto utiliza Docker para containerização, com um Dockerfile multi-stage otimizado:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install NestJS CLI and update npm
RUN npm install -g npm@latest && \
    npm install -g @nestjs/cli

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start the application
CMD ["node", "dist/main"]
```

## Variáveis de Ambiente

### Desenvolvimento (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=hublocal
DB_SYNCHRONIZE=false
DB_SSL=false
NODE_ENV=development
JWT_SECRET=seu_secret_aqui
JWT_EXPIRATION=1d
```

### Produção (.env.production)
```
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
DB_SYNCHRONIZE=false
DB_SSL=true
NODE_ENV=production
PORT=${PORT}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=1d
CORS_ORIGIN=${CORS_ORIGIN}
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── auth/               # Módulo de autenticação
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── guards/        # Guards de autenticação
│   │   └── strategies/    # Estratégias de autenticação
│   ├── companies/         # Módulo de empresas
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entities/     # Entidades do TypeORM
│   │   └── services/     # Serviços de negócio
│   ├── locations/        # Módulo de localizações
│   │   ├── dto/         # Data Transfer Objects
│   │   ├── entities/    # Entidades do TypeORM
│   │   └── services/    # Serviços de negócio
│   ├── users/           # Módulo de usuários
│   │   ├── dto/        # Data Transfer Objects
│   │   ├── entities/   # Entidades do TypeORM
│   │   └── services/   # Serviços de negócio
│   ├── common/         # Utilitários comuns
│   │   ├── filters/   # Filtros de exceção
│   │   ├── decorators/# Decorators personalizados
│   │   └── pipes/     # Pipes de validação
│   └── main.ts        # Ponto de entrada
├── test/              # Testes
├── migrations/        # Migrações do banco de dados
├── Dockerfile        # Configuração do Docker
└── .env.production   # Variáveis de ambiente para produção
```

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js
- **TypeORM**: ORM para acesso ao banco de dados
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação via tokens
- **Docker**: Containerização
- **Jest**: Testes unitários
- **Swagger**: Documentação da API

## Módulos

### Auth Module

Responsável pela autenticação e autorização dos usuários.

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### Companies Module

Gerencia as operações relacionadas a empresas.

```typescript
// src/companies/companies.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
```

### Locations Module

Gerencia as operações relacionadas a localizações.

```typescript
// src/locations/locations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Location } from './entities/location.entity';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    CompaniesModule,
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
```

### Users Module

Gerencia as operações relacionadas a usuários.

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

## Entidades

### User

```typescript
// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Company

```typescript
// src/companies/entities/company.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Location } from '../../locations/entities/location.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  cnpj: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  logoUrl: string;

  @OneToMany(() => Location, location => location.company)
  locations: Location[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Location

```typescript
// src/locations/entities/location.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cep: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @ManyToOne(() => Company, company => company.locations)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## DTOs (Data Transfer Objects)

### CreateUserDto

```typescript
// src/users/dto/create-user.dto.ts
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

### CreateCompanyDto

```typescript
// src/companies/dto/create-company.dto.ts
import { IsString, IsOptional, IsUrl, Matches } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^\d{14}$/, { message: 'CNPJ inválido' })
  cnpj: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}
```

### CreateLocationDto

```typescript
// src/locations/dto/create-location.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  cep: string;

  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsNumber()
  companyId: number;
}
```

## Serviços

### AuthService

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
```

### CompaniesService

```typescript
// src/companies/companies.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId: number) {
    const existingCompany = await this.companyRepository.findOne({
      where: { cnpj: createCompanyDto.cnpj },
      withDeleted: true,
    });

    if (existingCompany) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    const company = this.companyRepository.create({
      ...createCompanyDto,
      userId,
    });

    return this.companyRepository.save(company);
  }

  async findAll(userId: number, pagination: { page: number; limit: number }) {
    const [data, total] = await this.companyRepository.findAndCount({
      where: { userId },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });

    return { data, total };
  }

  async findOne(userId: number, id: number) {
    const company = await this.companyRepository.findOne({
      where: { id, userId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto, userId: number) {
    const company = await this.findOne(userId, id);

    if (updateCompanyDto.cnpj && updateCompanyDto.cnpj !== company.cnpj) {
      const existingCompany = await this.companyRepository.findOne({
        where: { cnpj: updateCompanyDto.cnpj },
        withDeleted: true,
      });

      if (existingCompany) {
        throw new ConflictException('CNPJ já cadastrado');
      }
    }

    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async remove(userId: number, id: number) {
    const company = await this.findOne(userId, id);
    await this.companyRepository.softDelete(company.id);
  }
}
```

## Configuração do Banco de Dados

```javascript
// ormconfig.js
module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
```

## Migrações

Para criar uma nova migração:

```bash
npm run migration:generate src/migrations/NameOfMigration
```

Para executar as migrações:

```bash
npm run migration:run
```

## Testes

O projeto utiliza Jest para testes:

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## Deploy

O deploy é feito automaticamente no Render.com através do arquivo `render.yaml`. Para configurar:

1. Crie uma conta no [Render.com](https://render.com)
2. Conecte seu repositório GitHub
3. O Render.com usará o `render.yaml` para configurar:
   - Serviço web
   - Banco de dados PostgreSQL
   - Variáveis de ambiente

### Variáveis de Ambiente

```env
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
DB_SYNCHRONIZE=false
DB_SSL=true
NODE_ENV=production
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=1d
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request 
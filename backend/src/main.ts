import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { dataSource } from './data-source';

async function bootstrap() {
  // Inicializar a conexão com o banco de dados
  await dataSource.initialize();

  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  app.enableCors();
  
  // Configurar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Configurar filtro global de exceções
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('HubLocal Manager API')
    .setDescription('API para gerenciamento de empresas e filiais')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Verificar se é uma execução de migração
  if (process.argv.includes('--migrate')) {
    await dataSource.runMigrations();
    console.log('Migrações executadas com sucesso');
    process.exit(0);
  }
  
  // Usar a porta definida pelo ambiente ou 3001 como fallback
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
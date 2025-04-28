import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { dataSource } from './data-source';

async function bootstrap() {
  // Inicializar a conexão com o banco de dados
  await dataSource.initialize();

  const app = await NestFactory.create(AppModule);
  
  // Configura o CORS para permitir requisições do frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Configura a validação global dos dados
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos não definidos nos DTOs
      transform: true, // Converte tipos automaticamente
      forbidNonWhitelisted: true, // Rejeita requisições com campos extras
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Configura o tratamento global de erros
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Configura o formato padrão das respostas
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // Configura a documentação da API
  const config = new DocumentBuilder()
    .setTitle('HubLocal API')
    .setDescription('API para gerenciamento de empresas e filiais')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Endpoint para verificar se a API está funcionando
  app.getHttpAdapter().get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Verificar se é uma execução de migração
  if (process.argv.includes('--migrate')) {
    await dataSource.runMigrations();
    console.log('Migrações executadas com sucesso');
    process.exit(0);
  }
  
  // Usar a porta definida pelo ambiente ou 3001 como fallback
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Aplicação rodando em: http://localhost:${port}`);
}
bootstrap();
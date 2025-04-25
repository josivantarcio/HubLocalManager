import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
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
  
  // Registrar o filtro de exceções HTTP
  app.useGlobalFilters(new HttpExceptionFilter());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
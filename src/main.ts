import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Enable CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Airport Management System API')
    .setDescription('Comprehensive API documentation for Airport Management System with support for airlines, airports, flights, passengers, tickets, baggage, and crew management.')
    .setVersion('1.0')
    .addTag('airlines', 'Airline management operations')
    .addTag('airports', 'Airport management operations')
    .addTag('flights', 'Flight scheduling and management')
    .addTag('aircraft', 'Aircraft fleet management')
    .addTag('passengers', 'Passenger information management')
    .addTag('tickets', 'Ticket booking and management')
    .addTag('baggage', 'Baggage tracking and management')
    .addTag('crew-positions', 'Crew position definitions')
    .addTag('crew-members', 'Crew member management')
    .addTag('crew-assignments', 'Crew assignment to flights')
    .addTag('admin', 'Administrative operations (backup/restore)')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-superuser',
        in: 'header',
        description: 'Superuser API key for administrative operations',
      },
      'superuser-api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'AMS API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT || 3000}/api`);
  console.log(`📚 Swagger documentation: http://localhost:${process.env.PORT || 3000}/api/docs`);
}

bootstrap();

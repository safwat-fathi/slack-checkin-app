import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import CONSTANTS from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  // Remove COOP header to fix Swagger UI issues
  app.use((_, res, next) => {
    res.removeHeader('Cross-Origin-Opener-Policy');
    next();
  });

  // Security headers configuration
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for Swagger UI
      crossOriginEmbedderPolicy: false, // Required for Swagger UI
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory(errors) {
        return errors;
      },
    }),
  );

  // Swagger configuration
  const options = new DocumentBuilder()
    .setTitle('BookLnk API')
    .setDescription('BookLnk API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token **_only_**',
        in: 'header',
      },
      CONSTANTS.ACCESS_TOKEN,
    );

  options.addServer(process.env.APP_URL, process.env.NODE_ENV);

  const config = options.build();
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI
  SwaggerModule.setup('docs', app, document);

  // CORS configuration
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  const port = process.env.HTTP_SERVER_PORT || 8000;

  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}
bootstrap();

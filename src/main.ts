import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalConfigKey } from './modules/global-config/config-keys';
import { GlobalConfigRepository } from './modules/global-config/global-config.repository';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Greenplus API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  SwaggerModule.setup('api-docs', app, document, customOptions);

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'upload'));

  // class-validator
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Get port
  const configService = app.get(ConfigService);
  const PORT = Number(configService.get<number>('PORT'));

  // Seeding
  const globalConfigRepository = app.get(GlobalConfigRepository);
  await seedGlobalClosureDates(globalConfigRepository);

  // CORS
  app.enableCors({ origin: '*' });

  await app.listen(PORT || 3000);
}

async function seedGlobalClosureDates(
  globalConfigRepository: GlobalConfigRepository,
) {
  try {
    await globalConfigRepository.get(GlobalConfigKey.FIRST_CLOSURE_DATE);
  } catch {
    await globalConfigRepository.create({
      key: GlobalConfigKey.FIRST_CLOSURE_DATE,
      value: new Date(3000, 1, 1).toISOString(),
    });
    await globalConfigRepository.create({
      key: GlobalConfigKey.SECOND_CLOSURE_DATE,
      value: new Date(3000, 1, 1).toISOString(),
    });
  }
}

bootstrap();

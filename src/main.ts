import { ValidationPipe } from '@nestjs/common';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { TrimPipe } from './common/decorator/trim.pipe';
import { GlobalConfigKey } from './modules/global-config/config-keys';
import { GlobalConfigRepository } from './modules/global-config/global-config.repository';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
// import express from 'express';
const express = require('express');

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

  // Get port
  const configService = app.get(ConfigService);
  const PORT = Number(configService.get<number>('PORT'));

  http.createServer(server).listen(PORT || 3000);
  const httpsOptions: HttpsOptions | null = readHttpsCertificate();
  if (httpsOptions !== null) {
    https.createServer(httpsOptions, server).listen(443);
  }

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

  await app.init();

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'upload'));

  // class-validator, trim
  app.useGlobalPipes(new ValidationPipe({ transform: true }), new TrimPipe());

  // Seeding
  const globalConfigRepository = app.get(GlobalConfigRepository);
  await seedGlobalClosureDates(globalConfigRepository);

  // CORS
  app.enableCors({ origin: '*' });
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

function readHttpsCertificate(): HttpsOptions | null {
  try {
    return {
      key: fs.readFileSync('private.key'),
      cert: fs.readFileSync('certificate.crt'),
    };
  } catch {
    return null;
  }
}

bootstrap();

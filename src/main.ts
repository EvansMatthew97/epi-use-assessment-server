import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as compression from 'compression';
import * as helmet from 'helmet';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet()); // default security measures
  app.enableCors(); // enable cross-origin requests
  app.use(compression()); // enable response compression
  // use validation
  app.useGlobalPipes(
    new ValidationPipe({}),
  );

  // start the server
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

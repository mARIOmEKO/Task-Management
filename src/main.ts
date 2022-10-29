import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server');

  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  await app.listen(serverConfig.port);
}
bootstrap();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@app/env/config/validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  const config = app.get(ConfigService<EnvironmentVariables>);
  const port = config.get('PORT');

  await app.listen(3000);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();

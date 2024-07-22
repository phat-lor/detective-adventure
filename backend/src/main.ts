import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AccessTGuard } from './common/guards';
import { ACGuard } from 'nest-access-control';
import { RBAC_POLICY } from './auth/rbac-policy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.ALLOWED_ORIGINS || '';
  const allowedOriginsArray = allowedOrigins
    .split(',')
    .map((item) => item.trim());

  app.enableCors({
    origin: allowedOriginsArray,
    credentials: true,
  });

  app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const reflector = new Reflector();

  app.useGlobalGuards(new AccessTGuard(reflector));
  app.useGlobalGuards(new ACGuard(reflector, RBAC_POLICY));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

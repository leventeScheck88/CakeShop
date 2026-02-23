import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  const corsOrigin = config.get<string>('CORS_ORIGIN') || 'http://localhost:5173';
  app.enableCors({ origin: corsOrigin.split(',').map((o) => o.trim()) });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = config.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();

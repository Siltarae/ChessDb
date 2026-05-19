import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module';
import { parseEnv } from './core/config/env.config';

const parseAllowedOrigins = (allowedOrigins: string): string[] => {
  return allowedOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
};

async function bootstrap() {
  const env = parseEnv(process.env);
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: parseAllowedOrigins(env.ALLOWED_ORIGINS),
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('ChessDB API')
    .setDescription('체스 기보 저장소 프로젝트 API 명세서')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, cleanupOpenApiDoc(document));

  await app.listen(env.PORT);
}
void bootstrap();

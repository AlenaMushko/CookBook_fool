import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';

import { GlobalExceptionFilter } from './common/expections/global-exception.filter';
import { SwaggerHelper } from './common/helpers/swagger.helper';
import { formatValidationErrors } from './common/helpers/validation-error.helper';
import { AppConfig, Config } from './config/config.type';
import logger from './logger';
import { AppModule } from './modules/app.module';
import { AUTH_COOKIE_NAMES } from './modules/auth/constants/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const configService = app.get(ConfigService<Config>);
  const appConfig = configService.get<AppConfig>('app');

  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || appConfig.allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(pinoHttp({ logger }));

  const config = new DocumentBuilder()
    .setTitle('CookBook API')
    .setDescription('The CookBook API description')
    .setVersion('1.0.0')
    .addTag('')
    .addCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN, {
      type: 'apiKey',
      in: 'cookie',
      name: AUTH_COOKIE_NAMES.ACCESS_TOKEN,
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerHelper.setDefaultResponses(document);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      defaultModelExpandDepth: 1,
      persistAuthorization: true,
    },
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(formatValidationErrors(errors)),
    }),
  );

  await app.listen(appConfig.port, () => {
    const url = `http://${appConfig.host}:${appConfig.port}`;
    logger.info(
      { port: appConfig.port, url, docs: `${url}/docs` },
      'Server started',
    );
  });
}
bootstrap();

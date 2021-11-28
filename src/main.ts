import { CustomValidationPipe } from '@app/common/pipes/custom-validation.pipe';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';
import { fastifyHelmet } from 'fastify-helmet';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';

initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();

(async () => {
  const configService = new ConfigService();
  const logger = new Logger('Main');

  const appHost = configService.get<string>('HOST') || '0.0.0.0';
  const appPort = configService.get<number>('PORT') || '3000';
  const appEnv = configService.get<number>('NODE_ENV') || '3000';

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  });

  //is used for transform pipes message
  app.useGlobalPipes(
    new CustomValidationPipe({
      transform: true,
      stopAtFirstError: true,
    }),
  );

  //is used for allow custom pipes attribute
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  //is used for exclude attribute in entities
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(appPort, appHost).then(() => {
    logger.log(`Server ${appEnv} is listening on ${appHost}:${appPort}`);
  });
})();

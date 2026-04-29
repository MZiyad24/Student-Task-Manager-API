import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseExceptionFilter } from './firebase/firebase.filter';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  app.useGlobalFilters(new FirebaseExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, 
    transform: true, 
  }));
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
    },
  });
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

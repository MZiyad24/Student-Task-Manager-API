import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseExceptionFilter } from './firebase/firebase.filter';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  app.useGlobalFilters(new FirebaseExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, 
    transform: true, 
  }));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

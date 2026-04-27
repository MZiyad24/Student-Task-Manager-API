import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseExceptionFilter } from './firebase/firebase.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new FirebaseExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

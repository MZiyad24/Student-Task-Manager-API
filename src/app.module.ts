import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { HealthController } from './firebase/firebase.controller';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}

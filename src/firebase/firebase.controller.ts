import { Controller, Get } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Controller('health')
export class HealthController {
  @Get()
  async check() {
    try {
      await admin.firestore().listCollections();
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}
import { Module, Global, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        const serviceAccount = require('../config/firebase-service-account.json');
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: 'taskmanagment-5dda9.appspot.com',
        });
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule implements OnModuleInit {
  async onModuleInit() {
    try {
      await admin.firestore().listCollections();
      console.log('Firebase Admin SDK: Connected to Firestore');
    } catch (error) {
      console.error('Firebase Admin SDK: Connection failed', error);
    }
  }
}
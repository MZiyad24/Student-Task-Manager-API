import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase-service-account.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  storageBucket: 'taskmanagment-5dda9.appspot.com',
});

export const bucket = admin.storage().bucket();
// src/uploads/uploads.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class UploadsService {
  async uploadFile(file: any, folder: string): Promise<string> {
    const bucket = admin.storage().bucket();
    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    console.log(`File uploaded to Firebase Storage: ${fileName}`);
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
    return url;
  }
}
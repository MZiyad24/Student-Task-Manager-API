import { Controller, Patch, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UploadsService } from '../uploads/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as admin from 'firebase-admin';

@Controller('users')
export class UserController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Patch('update/:uid')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @Param('uid') uid: string,
    @Body() updateData: any,
    @UploadedFile() file: any
  ) {
    let photoUrl = updateData.profilePicture;

    if (file) {
      photoUrl = await this.uploadsService.uploadFile(file, uid);
    }

    await admin.firestore().collection('users').doc(uid).update({
      ...updateData,
      profilePicture: photoUrl,
    });

    return { message: 'Profile Updated', photoUrl };
  }
}
import { Post, UseInterceptors, UploadedFile, Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

@Controller('user')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('upload-profile')
  @UseInterceptors(FileInterceptor('file')) // No complex diskStorage config here
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      return { message: 'No file uploaded' };
    }

    const url = await this.uploadsService.uploadFile(file, 'profile_pics');
      return { url };
    }
}
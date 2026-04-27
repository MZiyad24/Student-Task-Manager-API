// src/uploads/uploads.module.ts
import { Module } from '@nestjs/common';
import { UploadsController } from '../uploads/uploads.contoller';
import { UploadsService } from './uploads.service';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService], // Export so ProfileService can use it
})
export class UploadsModule {}
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UploadsService],
})
export class UserModule {}
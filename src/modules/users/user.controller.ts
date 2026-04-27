import { Controller, Patch, Body, Param, UseInterceptors, UploadedFile, Get, UseGuards, Req } from '@nestjs/common';
import { UploadsService } from '../uploads/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from '../auth/guards/auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dtos/update_profile.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Patch('/update/me')
  @UseInterceptors(FileInterceptor('imageUrl'))
  @UseGuards(FirebaseAuthGuard)
  async updateProfile(
    @Req() req,
    @Body() updateData: UpdateProfileDto,
    @UploadedFile() file: any
  ) {
    const uid = req.user.uid;
    return await this.userService.updateProfile(uid, updateData, file);
  }

  @Get('/me')
  @UseGuards(FirebaseAuthGuard)
  async getProfile(@Req() req) {
    const userId = req.user.uid;
    return await this.userService.getProfile(userId);
  }
}
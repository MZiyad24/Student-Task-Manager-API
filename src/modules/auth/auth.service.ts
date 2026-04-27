import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { SignupDto } from "./dtos/signup.dto";
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  async signup(dto: SignupDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const idFromEmail = dto.email.split('@')[0];
    if (idFromEmail !== dto.studentId) {
      throw new BadRequestException('Student ID must match email prefix');
    }

    const userRecord = await admin.auth().createUser({
      email: dto.email,
      password: dto.password,
      displayName: dto.name,
    });

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      name: dto.name,
      email: dto.email,
      studentId: dto.studentId,
      gender: dto.gender,
      academicLevel: dto.academicLevel,
    });

    return { message: 'Signup Success', uid: userRecord.uid };
  }
}
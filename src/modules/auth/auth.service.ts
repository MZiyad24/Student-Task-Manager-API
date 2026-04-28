import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { SignupDto } from "./dtos/signup.dto";
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import * as admin from 'firebase-admin';
import { ConfigService } from "@nestjs/config";
import { LoginDto } from "./dtos/login.dto";
import axios from 'axios';
import { UnauthorizedException } from "@nestjs/common/exceptions/unauthorized.exception";

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}
  
  async signup(dto: SignupDto) {
    console.log('api key', this.configService.get('FIREBASE_API_KEY'));
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const idFromEmail = dto.email.split('@')[0];
    if (idFromEmail !== dto.studentId) {
      throw new BadRequestException('Student ID must match email prefix');
    }
    const usersRef = admin.firestore().collection('users');
    const snapshot = await usersRef.where('studentId', '==', dto.studentId).get();

    if (!snapshot.empty) {
      throw new BadRequestException('Student ID already exists');
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
      gender: dto.gender || null,
      academicLevel: dto.academicLevel || null,
    });

    return await this.generateToken(dto.email, dto.password);
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    try {
      await admin.auth().getUserByEmail(email);
      const authData = await this.generateToken(email, password);

      const userDoc = await admin.firestore().collection('users')
        .where('email', '==', email)
        .get();
      const userData = userDoc.docs[0]?.data();

      return {
        ...authData,
        user: {
          name: userData?.name,
          studentId: userData?.studentId,
          gender: userData?.gender,
          academicLevel: userData?.academicLevel,
          email: userData?.email
        }
      };

    } catch (error) {
      if (error.response?.data?.error?.message === 'INVALID_PASSWORD' ||
        error.code === 'auth/user-not-found') {
        throw new UnauthorizedException('Invalid email or password');
      }
      throw new UnauthorizedException('Invalid login credentials');
    }
  }

  private async generateToken(email: string, password: string) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.configService.get('FIREBASE_API_KEY')}`;

    try {
      const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });

      return {
        message: 'successful',
        idToken: response.data.idToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
        localId: response.data.localId,
      };
    } catch (error) {
      throw new BadRequestException('User created but failed to generate token. Please login.');
    }
  }
}

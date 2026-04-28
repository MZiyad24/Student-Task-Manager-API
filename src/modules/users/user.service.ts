import { Injectable, NotFoundException } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { UpdateProfileDto } from "./dtos/update_profile.dto";
import { UploadsService } from "../uploads/uploads.service";
import { plainToInstance } from "class-transformer";
import { UserProfileDto } from "./dtos/profile.dto";

@Injectable()
export class UserService {
    constructor(private readonly uploadsService: UploadsService) {}

    async getProfile(uid:string) {
        const userDoc = await admin.firestore().collection('users').doc(uid).get();
        if (!userDoc.exists) {
            throw new NotFoundException('User not found or session expired');
        }
        const data = userDoc.data()!;
        return {
        uid: userDoc.id,
        studentId: data.studentId ?? '',
        email: data.email ?? '',
        name: data.name ?? '',
        academicYear: data.academicLevel ?? '',
        gender: data.gender ?? '',
        profilePicture: data.profilePicture ?? null,
        // Convert Firestore Timestamps to Strings if they exist
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    };
    }

    async updateProfile(uid: string, updateData: UpdateProfileDto, file: any) {
        const userRef = admin.firestore().collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new NotFoundException('User not found or session expired');
        }

        const updates: any = { ...updateData };
        if (file) {
            updates.profilePicture = await this.uploadsService.uploadFile(file, uid);
        }

        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
        await userRef.update(updates);

        return this.getProfile(uid); 
        
    }
}
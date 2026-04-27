import { Expose } from 'class-transformer';

export class UserProfileDto {
  @Expose()
  uid?: string;

  @Expose()
  email?: string;

  @Expose()
  studentId?: string;

  @Expose()
  name?: string;

  @Expose()
  academicLevel?: number;

  @Expose()
  gender?: string;

  @Expose()
  imageUrl?: string;

  @Expose()
  createdAt: any;
}
import { IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, MaxLength, Max, Min, } from 'class-validator';
import { isEmpty } from 'rxjs';

export class SignupDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @Matches(/^[0-9]+@stud\.fci-cu\.edu\.eg$/, {
    message: 'Email must be studentID@stud.fci-cu.edu.eg',
  })
  email!: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Student ID must be at least 8 characters { year + id }' })
  @MaxLength(8, { message: 'Student ID cannot exceed 8 characters' })
  studentId!: string;

  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  password!: string;

  @IsNotEmpty()
  confirmPassword!: string;

  @IsOptional()
  gender?: string;

  @IsOptional()
  @Min(1, { message: 'Academic level must be at least 1' })
  @Max(4, { message: 'Academic level cannot be greater than 4' })
  academicLevel?: number;
}
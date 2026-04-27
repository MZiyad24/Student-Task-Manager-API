import { IsEmail, IsNotEmpty, MinLength, Matches, IsOptional } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @Matches(/^[0-9]+@stud\.fci-cu\.edu\.eg$/, {
    message: 'Email must be studentID@stud.fci-cu.edu.eg',
  })
  email!: string;

  @IsNotEmpty()
  studentId!: string;

  @MinLength(8)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  password!: string;

  @IsNotEmpty()
  confirmPassword!: string;

  @IsOptional()
  gender?: string;

  @IsOptional()
  academicLevel?: number;
}
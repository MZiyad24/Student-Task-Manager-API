import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail()
    @Matches(/^[0-9]+@stud\.fci-cu\.edu\.eg$/, {
        message: 'Email must be studentID@stud.fci-cu.edu.eg',
    })
    email!: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[0-9])/, {
        message: 'Password must contain at least one number',
    })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password!: string
}
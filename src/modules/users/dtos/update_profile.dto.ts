import { IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  
  // @IsOptional()
  // imageUrl?: File;

  @IsOptional()
  @Min(1, { message: 'Academic level must be at least 1' })
  @Max(4, { message: 'Academic level cannot be greater than 4' })
  academicLevel?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  
}
// src/tasks/dto/create-task.dto.ts
import { IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  description?: string;

  @IsDateString()
  dueDate!: string;

  @IsEnum(['Low', 'Medium', 'High'])
  priority?: string;


}
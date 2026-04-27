import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';

// src/tasks/tasks.controller.ts
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.addTask(dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.tasksService.getUserTasks(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updates: any) {
    return this.tasksService.updateTask(id, updates);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
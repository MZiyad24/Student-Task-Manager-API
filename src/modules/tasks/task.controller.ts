import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Req } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { FirebaseAuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('add')
  @UseGuards(FirebaseAuthGuard)
  create(@Body() dto: CreateTaskDto, @Req() req) {
    const uid = req.user.uid;
    return this.tasksService.addTask( {...dto}, uid );
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  findAll(@Req() req) {
    const uid = req.user.uid;
    return this.tasksService.getUserTasks(uid);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  update(@Param('id') id: string, @Body() updates: any) {
    return this.tasksService.updateTask(id, updates);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  remove(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/mark/:id')
  @UseGuards(FirebaseAuthGuard)
  mark(@Param('id') id: string, @Body('isCompleted') isCompleted: boolean) {
    return this.tasksService.toggleTaskStatus(id, isCompleted);
  }
}
// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksController } from '../tasks/task.controller';
import { TasksService } from '../tasks/task.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
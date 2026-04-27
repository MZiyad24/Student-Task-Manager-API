// src/tasks/tasks.service.ts
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
  private readonly db = admin.firestore();
  private readonly collection = this.db.collection('tasks');

  // 1. Add New Task
  async addTask(dto: CreateTaskDto): Promise<{ id: string }> {
    try {
      const taskData = {
        userId: dto.userId,
        title: dto.title,
        description: dto.description || '',
        dueDate: admin.firestore.Timestamp.fromDate(new Date(dto.dueDate)),
        priority: dto.priority,
        isCompleted: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await this.collection.add(taskData);
      return { id: docRef.id };
    } catch (error) {
      throw new BadRequestException('Failed to create task: ' + error);
    }
  }

  // 2. Get All Tasks for a User
  async getUserTasks(userId: string): Promise<any[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .orderBy('dueDate', 'asc')
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp back to ISO string for Flutter
        dueDate: (data.dueDate as admin.firestore.Timestamp).toDate().toISOString(),
      };
    });
  }

  // 3. Edit Task
  async updateTask(taskId: string, updates: Partial<CreateTaskDto & { isCompleted: boolean }>): Promise<void> {
    const docRef = this.collection.doc(taskId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Task not found');
    }

    const dataToUpdate: any = { ...updates };
    
    // If updating due date, convert to Firestore Timestamp
    if (updates.dueDate) {
      dataToUpdate.dueDate = admin.firestore.Timestamp.fromDate(new Date(updates.dueDate));
    }

    await docRef.update(dataToUpdate);
  }

  // 4. Delete Task
  async deleteTask(taskId: string): Promise<void> {
    const docRef = this.collection.doc(taskId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Task not found');
    }

    await docRef.delete();
  }

  // 5. Mark as Completed (Specific utility)
  async toggleTaskStatus(taskId: string, isCompleted: boolean): Promise<void> {
    await this.updateTask(taskId, { isCompleted });
  }
}
// src/tasks/tasks.service.ts
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
  private readonly db = admin.firestore();
  private readonly collection = this.db.collection('tasks');

  async addTask(dto: CreateTaskDto, uid: string): Promise<{ id: string }> {
    try {
      const taskData = {
        userId: uid,
        title: dto.title,
        description: dto.description || '',
        dueDate: admin.firestore.Timestamp.fromDate(new Date(dto.dueDate)),
        priority: dto.priority,
        isCompleted: false,
        isFavorite: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await this.collection.add(taskData);
      return { id: docRef.id };

    } catch (error) {
      throw new BadRequestException('Failed to create task: ' + error);
    }
  }

  async getUserTasks(userId: string): Promise<any[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        isFavorite: data.isFavorite ?? false,
        isCompleted: data.isCompleted ?? false,
        dueDate: (data.dueDate as admin.firestore.Timestamp).toDate().toISOString(),
      };
    });
  }

  async updateTask(taskId: string, updates: Partial<CreateTaskDto & { isCompleted: boolean; isFavorite?: boolean }>): Promise<void> {
    const docRef = this.collection.doc(taskId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Task not found');
    }
    const dataToUpdate: any = { ...updates };

    if (updates.dueDate) {
      dataToUpdate.dueDate = admin.firestore.Timestamp.fromDate(new Date(updates.dueDate));
    }

    await docRef.update(dataToUpdate);
  }

  async deleteTask(taskId: string): Promise<void> {
    const docRef = this.collection.doc(taskId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Task not found');
    }

    await docRef.delete();
  }

  async toggleTaskStatus(taskId: string, isCompleted: boolean): Promise<void> {
    await this.updateTask(taskId, { isCompleted });
  }
}
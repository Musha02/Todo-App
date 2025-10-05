import { TaskRepository } from '../repositories/TaskRepository';
import { Task, CreateTaskDTO } from '../models/Task';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async getRecentTasks(): Promise<Task[]> {
    return this.taskRepository.findRecentIncompleteTasks(5);
  }

  async createTask(taskData: CreateTaskDTO): Promise<Task> {
    if (!taskData.title || taskData.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (taskData.title.length > 255) {
      throw new Error('Title must not exceed 255 characters');
    }

    return this.taskRepository.create({
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
    });
  }

  async completeTask(id: number): Promise<Task> {
    const task = await this.taskRepository.markAsCompleted(id);
    
    if (!task) {
      throw new Error('Task not found or already completed');
    }

    return task;
  }
}
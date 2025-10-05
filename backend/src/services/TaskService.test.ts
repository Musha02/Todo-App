import { TaskService } from './TaskService';
import { TaskRepository } from '../repositories/TaskRepository';
import { Task } from '../models/Task';

jest.mock('../repositories/TaskRepository');

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepository = new TaskRepository() as jest.Mocked<TaskRepository>;
    taskService = new TaskService(mockTaskRepository);
  });

  describe('getRecentTasks', () => {
    it('should return recent tasks from repository', async () => {
      const mockTasks: Task[] = [
        { id: 1, title: 'Task 1', description: 'Desc 1', completed: false, created_at: new Date() },
      ];

      mockTaskRepository.findRecentIncompleteTasks.mockResolvedValue(mockTasks);

      const result = await taskService.getRecentTasks();

      expect(result).toEqual(mockTasks);
      expect(mockTaskRepository.findRecentIncompleteTasks).toHaveBeenCalledWith(5);
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData = { title: 'New Task', description: 'Description' };
      const mockTask: Task = {
        id: 1,
        ...taskData,
        completed: false,
        created_at: new Date(),
      };

      mockTaskRepository.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask(taskData);

      expect(result).toEqual(mockTask);
      expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData);
    });

    it('should throw error if title is empty', async () => {
      await expect(
        taskService.createTask({ title: '', description: 'Desc' })
      ).rejects.toThrow('Title is required');
    });

    it('should throw error if title exceeds 255 characters', async () => {
      const longTitle = 'a'.repeat(256);
      
      await expect(
        taskService.createTask({ title: longTitle, description: 'Desc' })
      ).rejects.toThrow('Title must not exceed 255 characters');
    });

    it('should trim whitespace from title and description', async () => {
      const taskData = { title: '  Task  ', description: '  Desc  ' };
      const mockTask: Task = {
        id: 1,
        title: 'Task',
        description: 'Desc',
        completed: false,
        created_at: new Date(),
      };

      mockTaskRepository.create.mockResolvedValue(mockTask);

      await taskService.createTask(taskData);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: 'Task',
        description: 'Desc',
      });
    });
  });

  describe('completeTask', () => {
    it('should complete a task successfully', async () => {
      const taskId = 1;
      const mockTask: Task = {
        id: taskId,
        title: 'Task',
        description: 'Desc',
        completed: true,
        created_at: new Date(),
      };

      mockTaskRepository.markAsCompleted.mockResolvedValue(mockTask);

      const result = await taskService.completeTask(taskId);

      expect(result).toEqual(mockTask);
      expect(mockTaskRepository.markAsCompleted).toHaveBeenCalledWith(taskId);
    });

    it('should throw error if task not found', async () => {
      mockTaskRepository.markAsCompleted.mockResolvedValue(null);

      await expect(taskService.completeTask(999)).rejects.toThrow(
        'Task not found or already completed'
      );
    });
  });
});
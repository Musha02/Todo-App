import request from 'supertest';
import express, { Application } from 'express';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';
import { TaskRepository } from '../repositories/TaskRepository';
import { Task } from '../models/Task';

// Mock the TaskRepository
jest.mock('../repositories/TaskRepository');

describe('Task Routes Integration Tests', () => {
  let app: Application;
  let mockTaskRepository: jest.Mocked<TaskRepository>;
  let taskService: TaskService;
  let taskController: TaskController;

  beforeAll(() => {
    // Create express app
    app = express();
    app.use(express.json());

    // Create mocked repository
    mockTaskRepository = {
      findRecentIncompleteTasks: jest.fn(),
      create: jest.fn(),
      markAsCompleted: jest.fn(),
      findById: jest.fn(),
      deleteAll: jest.fn(),
    } as any;

    // Create service and controller with mocked repository
    taskService = new TaskService(mockTaskRepository);
    taskController = new TaskController(taskService);

    // Setup routes
    app.get('/api/tasks', taskController.getTasks);
    app.post('/api/tasks', taskController.createTask);
    app.patch('/api/tasks/:id/complete', taskController.completeTask);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return list of tasks', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Desc 1',
          completed: false,
          created_at: new Date('2025-10-04T16:47:13.447Z'),
        },
      ];

      mockTaskRepository.findRecentIncompleteTasks.mockResolvedValue(mockTasks);

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Task 1');
      expect(mockTaskRepository.findRecentIncompleteTasks).toHaveBeenCalledWith(5);
    });

    it('should return empty array when no tasks', async () => {
      mockTaskRepository.findRecentIncompleteTasks.mockResolvedValue([]);

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      mockTaskRepository.findRecentIncompleteTasks.mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = { title: 'New Task', description: 'New Description' };
      const createdTask: Task = {
        id: 1,
        title: 'New Task',
        description: 'New Description',
        completed: false,
        created_at: new Date(),
      };

      mockTaskRepository.create.mockResolvedValue(createdTask);

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.description).toBe(newTask.description);
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
      });
    });

    it('should return 400 for empty title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '', description: 'Desc' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title is required');
    });

    it('should return 400 for title with only whitespace', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '   ', description: 'Desc' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title is required');
    });

    it('should return 400 for title exceeding 255 characters', async () => {
      const longTitle = 'a'.repeat(256);
      
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: longTitle, description: 'Desc' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title must not exceed 255 characters');
    });

    it('should trim whitespace from title and description', async () => {
      const newTask = { title: '  Task  ', description: '  Desc  ' };
      const createdTask: Task = {
        id: 1,
        title: 'Task',
        description: 'Desc',
        completed: false,
        created_at: new Date(),
      };

      mockTaskRepository.create.mockResolvedValue(createdTask);

      await request(app).post('/api/tasks').send(newTask);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: 'Task',
        description: 'Desc',
      });
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should mark task as completed', async () => {
      const taskId = 1;
      const completedTask: Task = {
        id: taskId,
        title: 'Task',
        description: 'Desc',
        completed: true,
        created_at: new Date(),
      };

      mockTaskRepository.markAsCompleted.mockResolvedValue(completedTask);

      const response = await request(app).patch(`/api/tasks/${taskId}/complete`);

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
      expect(mockTaskRepository.markAsCompleted).toHaveBeenCalledWith(taskId);
    });

    it('should return 404 for non-existent task', async () => {
      mockTaskRepository.markAsCompleted.mockResolvedValue(null);

      const response = await request(app).patch('/api/tasks/999/complete');

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });

    it('should return 400 for invalid task ID', async () => {
      const response = await request(app).patch('/api/tasks/invalid/complete');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid task ID');
    });

    it('should return 400 for non-numeric task ID', async () => {
      const response = await request(app).patch('/api/tasks/abc123/complete');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid task ID');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors when creating task', async () => {
      mockTaskRepository.create.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', description: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle database errors when completing task', async () => {
      mockTaskRepository.markAsCompleted.mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app).patch('/api/tasks/1/complete');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
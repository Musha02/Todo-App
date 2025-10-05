import { TaskRepository } from './TaskRepository';
import pool from '../config/database';

jest.mock('../config/database');

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  let mockQuery: jest.Mock;

  beforeEach(() => {
    taskRepository = new TaskRepository();
    mockQuery = jest.fn();
    (pool.query as jest.Mock) = mockQuery;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findRecentIncompleteTasks', () => {
    it('should return recent incomplete tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Desc 1', completed: false, created_at: new Date() },
        { id: 2, title: 'Task 2', description: 'Desc 2', completed: false, created_at: new Date() },
      ];

      mockQuery.mockResolvedValue({ rows: mockTasks });

      const result = await taskRepository.findRecentIncompleteTasks(5);

      expect(result).toEqual(mockTasks);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE completed = FALSE'),
        [5]
      );
    });

    it('should return empty array when no tasks', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await taskRepository.findRecentIncompleteTasks(5);

      expect(result).toEqual([]);
    });

    it('should use custom limit', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await taskRepository.findRecentIncompleteTasks(10);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        [10]
      );
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const newTask = { title: 'New Task', description: 'New Description' };
      const mockCreatedTask = {
        id: 1,
        ...newTask,
        completed: false,
        created_at: new Date(),
      };

      mockQuery.mockResolvedValue({ rows: [mockCreatedTask] });

      const result = await taskRepository.create(newTask);

      expect(result).toEqual(mockCreatedTask);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO task'),
        [newTask.title, newTask.description]
      );
    });

    it('should create task with empty description', async () => {
      const newTask = { title: 'Task', description: '' };
      const mockCreatedTask = {
        id: 1,
        title: 'Task',
        description: '',
        completed: false,
        created_at: new Date(),
      };

      mockQuery.mockResolvedValue({ rows: [mockCreatedTask] });

      const result = await taskRepository.create(newTask);

      expect(result.description).toBe('');
    });
  });

  describe('markAsCompleted', () => {
    it('should mark task as completed', async () => {
      const taskId = 1;
      const mockCompletedTask = {
        id: taskId,
        title: 'Task',
        description: 'Description',
        completed: true,
        created_at: new Date(),
      };

      mockQuery.mockResolvedValue({ rows: [mockCompletedTask] });

      const result = await taskRepository.markAsCompleted(taskId);

      expect(result).toEqual(mockCompletedTask);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE task'),
        [taskId]
      );
    });

    it('should return null if task not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await taskRepository.markAsCompleted(999);

      expect(result).toBeNull();
    });

    it('should return null if task already completed', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await taskRepository.markAsCompleted(1);

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find task by id', async () => {
      const mockTask = {
        id: 1,
        title: 'Task',
        description: 'Description',
        completed: false,
        created_at: new Date(),
      };

      mockQuery.mockResolvedValue({ rows: [mockTask] });

      const result = await taskRepository.findById(1);

      expect(result).toEqual(mockTask);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1]
      );
    });

    it('should return null if task not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await taskRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('deleteAll', () => {
    it('should delete all tasks', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await taskRepository.deleteAll();

      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM task');
    });
  });
});
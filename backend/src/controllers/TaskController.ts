import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';

export class TaskController {
  private taskService: TaskService;

  constructor(taskService: TaskService) {
    this.taskService = taskService;
  }

  getTasks = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.getRecentTasks();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  };

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description } = req.body;
      const task = await this.taskService.createTask({ title, description });
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      const message = error instanceof Error ? error.message : 'Failed to create task';
      res.status(400).json({ error: message });
    }
  };

  completeTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      const task = await this.taskService.completeTask(id);
      res.json(task);
    } catch (error) {
      console.error('Error completing task:', error);
      const message = error instanceof Error ? error.message : 'Failed to complete task';
      
      if (message.includes('not found')) {
        res.status(404).json({ error: message });
      } else {
        res.status(500).json({ error: message });
      }
    }
  };
}
import pool from '../config/database';
import { Task, CreateTaskDTO } from '../models/Task';

export class TaskRepository {
  async findRecentIncompleteTasks(limit: number = 5): Promise<Task[]> {
    const result = await pool.query(
      `SELECT id, title, description, completed, created_at 
       FROM task 
       WHERE completed = FALSE 
       ORDER BY created_at DESC 
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  async create(taskData: CreateTaskDTO): Promise<Task> {
    const result = await pool.query(
      `INSERT INTO task (title, description) 
       VALUES ($1, $2) 
       RETURNING id, title, description, completed, created_at`,
      [taskData.title, taskData.description]
    );
    return result.rows[0];
  }

  async markAsCompleted(id: number): Promise<Task | null> {
    const result = await pool.query(
      `UPDATE task 
       SET completed = TRUE 
       WHERE id = $1 AND completed = FALSE
       RETURNING id, title, description, completed, created_at`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<Task | null> {
    const result = await pool.query(
      `SELECT id, title, description, completed, created_at 
       FROM task 
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async deleteAll(): Promise<void> {
    await pool.query('DELETE FROM task');
  }
}
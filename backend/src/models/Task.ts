export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

export interface UpdateTaskDTO {
  completed: boolean;
}
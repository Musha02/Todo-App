import axios from 'axios';

// const API_URL = /*process.env.REACT_APP_API_URL || */'http://localhost:5000';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  createTask: async (task: CreateTaskDTO): Promise<Task> => {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  },

  completeTask: async (id: number): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/complete`);
    return response.data;
  },
};

export default api;
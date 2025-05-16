import axios from 'axios';
import { Task } from '../types/task';

const API_BASE_URL = 'http://your-api-base-url';

export interface CreateTaskInput {
  title: string;
  category: string;
  completed: boolean;
  dueDate: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  description?: string;
  repeatType?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';
  reminder?: {
    enabled: boolean;
    time: string;
    type: 'notification' | 'email';
  };
}

export interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
  };
}

export interface TaskResponse {
  success: boolean;
  data: {
    task: Task;
  };
}

export interface ApiResponse {
  success: boolean;
}

class TaskService {
  private static instance: TaskService;
  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async fetchTasks(userId: string): Promise<Task[]> {
    try {
      const response = await axios.get<TasksResponse>(`${API_BASE_URL}/api/tasks`, {
        params: { userId }
      });

      if (response.data.success) {
        return response.data.data.tasks;
      }
      throw new Error('Failed to fetch tasks');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async createTask(task: CreateTaskInput): Promise<Task> {
    try {
      const response = await axios.post<TaskResponse>(`${API_BASE_URL}/api/tasks`, task);
      
      if (response.data.success) {
        return response.data.data.task;
      }
      throw new Error('Failed to create task');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTaskStatus(taskId: string, completed: boolean): Promise<Task> {
    try {
      const response = await axios.patch<TaskResponse>(`${API_BASE_URL}/api/tasks/${taskId}`, {
        completed
      });

      if (response.data.success) {
        return response.data.data.task;
      }
      throw new Error('Failed to update task');
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      const response = await axios.delete<ApiResponse>(`${API_BASE_URL}/api/tasks/${taskId}`);

      if (!response.data.success) {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}

export const taskService = TaskService.getInstance(); 
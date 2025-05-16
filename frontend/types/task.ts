export interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  dueDate: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  description?: string;
  createdAt: string;
  order: number;
  isTemplate?: boolean;
  repeatType?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';
  reminder?: {
    enabled: boolean;
    time: string;
    type: 'notification' | 'email';
  };
}

export interface TaskTemplate {
  id: string;
  title: string;
  category: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  time?: string;
}

export interface TasksType {
  [key: string]: Task[];
} 
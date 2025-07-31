import axios from 'axios';

const API_BASE_URL = 'https://tasky-server-8tsc.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const userStorage = localStorage.getItem('user-storage');
  if (userStorage) {
    try {
      const parsed = JSON.parse(userStorage);
      const user = parsed.state?.user;
      if (user?.token && config.headers) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      console.error('Error parsing user storage:', error);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user-storage');
      window.location.href = '/signin';
    }
    const rejectionError = error instanceof Error ? error : new Error(error?.message || 'Unknown error');
    return Promise.reject(rejectionError);
  }
);

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  priority: 'High' | 'Medium' | 'Low';
  project?: string | null;
  labels: string[];
  isCompleted: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
  project?: string;
  labels?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
  project?: string;
  labels?: string[];
  isCompleted?: boolean;
}

interface TasksResponse {
  tasks: Task[];
}

interface TaskResponse {
  task: Task;
}

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<TasksResponse>('/tasks');
    return response.data.tasks || [];
  },

  getTasksByStatus: async (status: 'active' | 'completed' | 'deleted'): Promise<Task[]> => {
    const response = await api.get<TasksResponse>(`/tasks?status=${status}`);
    return response.data.tasks || [];
  },

  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    const response = await api.post<TaskResponse>('/tasks', taskData);
    return response.data.task;
  },

  updateTask: async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    const response = await api.patch<TaskResponse>(`/tasks/${id}`, taskData);
    return response.data.task;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  completeTask: async (id: string): Promise<Task> => {
    const response = await api.patch<TaskResponse>(`/tasks/complete/${id}`);
    return response.data.task;
  },

  incompleteTask: async (id: string): Promise<Task> => {
    const response = await api.patch<TaskResponse>(`/tasks/incomplete/${id}`);
    return response.data.task;
  },

  restoreTask: async (id: string): Promise<Task> => {
    const response = await api.patch<TaskResponse>(`/tasks/restore/${id}`);
    return response.data.task;
  },
};

export const authApi = {
  login: async (emailOrUsername: string, password: string) => {
    const response = await api.post('/auth/login', {
      emailOrUsername,
      password,
    });
    return response.data;
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.patch('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export const userApi = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (userData: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
  }) => {
    const response = await api.patch('/user/profile', userData);
    return response.data;
  },
};

export default api; 
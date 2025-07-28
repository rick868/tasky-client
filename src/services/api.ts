import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});



api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
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


export const taskApi = {
  
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data.tasks || [];
  },

  
  getTasksByStatus: async (status: 'active' | 'completed' | 'deleted'): Promise<Task[]> => {
    const response = await api.get(`/tasks?status=${status}`);
    return response.data.tasks || [];
  },

  
  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    const response = await api.post('/tasks', taskData);
    return response.data.task;
  },

  
  updateTask: async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, taskData);
    return response.data.task;
  },

  
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  
  completeTask: async (id: string): Promise<Task> => {
    const response = await api.patch(`/tasks/complete/${id}`);
    return response.data.task;
  },

  // Incomplete task
  incompleteTask: async (id: string): Promise<Task> => {
    const response = await api.patch(`/tasks/incomplete/${id}`);
    return response.data.task;
  },

  // Restore task
  restoreTask: async (id: string): Promise<Task> => {
    const response = await api.patch(`/tasks/restore/${id}`);
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
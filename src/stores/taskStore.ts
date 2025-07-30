import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, taskApi } from '../services/api';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleComplete: (taskId: string) => void;
  restoreTask: (taskId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
 
  fetchTasks: () => Promise<void>;
  createTask: (taskData: any) => Promise<void>;
  markComplete: (taskId: string) => Promise<void>;
  markIncomplete: (taskId: string) => Promise<void>;
  restoreTaskAsync: (taskId: string) => Promise<void>;
  deleteTaskAsync: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,

      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      })),
      toggleComplete: (taskId) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        )
      })),
      restoreTask: (taskId) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, isDeleted: false } : task
        )
      })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      fetchTasks: async () => {
        set({ loading: true, error: null });
        try {
          const tasks = await taskApi.getTasks();
          set({ tasks, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch tasks', 
            loading: false 
          });
        }
      },

      createTask: async (taskData) => {
        set({ loading: true, error: null });
        try {
          const newTask = await taskApi.createTask(taskData);
          set((state) => ({ 
            tasks: [newTask, ...state.tasks], 
            loading: false 
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create task', 
            loading: false 
          });
          throw error;
        }
      },

      markComplete: async (taskId) => {
        set({ loading: true, error: null });
        try {
          const updatedTask = await taskApi.completeTask(taskId);
          if (updatedTask && updatedTask.id) {
            set((state) => ({
              tasks: state.tasks.map(task => 
                task.id === taskId ? updatedTask : task
              ),
              loading: false
            }));
          } else {
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark task complete', 
            loading: false 
          });
          throw error;
        }
      },

      markIncomplete: async (taskId) => {
        set({ loading: true, error: null });
        try {
          const updatedTask = await taskApi.incompleteTask(taskId);
          if (updatedTask && updatedTask.id) {
            set((state) => ({
              tasks: state.tasks.map(task => 
                task.id === taskId ? updatedTask : task
              ),
              loading: false
            }));
          } else {
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark task incomplete', 
            loading: false 
          });
          throw error;
        }
      },

      restoreTaskAsync: async (taskId) => {
        set({ loading: true, error: null });
        try {
          const updatedTask = await taskApi.restoreTask(taskId);
          if (updatedTask && updatedTask.id) {
            set((state) => ({
              tasks: state.tasks.map(task => 
                task.id === taskId ? updatedTask : task
              ),
              loading: false
            }));
          } else {
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to restore task', 
            loading: false 
          });
          throw error;
        }
      },

      deleteTaskAsync: async (taskId) => {
        set({ loading: true, error: null });
        try {
          await taskApi.deleteTask(taskId);
          set((state) => ({
            tasks: state.tasks.filter(task => task.id !== taskId),
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete task', 
            loading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: 'task-storage', 
      partialize: (state) => ({ tasks: state.tasks }), 
    }
  )
); 
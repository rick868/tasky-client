import { useEffect } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { useUserStore } from '../stores/userStore';

export const useAppInitialization = () => {
  const { fetchTasks } = useTaskStore();
  const { user, isAuthenticated } = useUserStore();

  useEffect(() => {
    // Only fetch tasks if user is authenticated
    if (isAuthenticated && user) {
      fetchTasks();
    }
  }, [isAuthenticated, user, fetchTasks]);
}; 
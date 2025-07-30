import { useEffect } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { useUserStore } from '../stores/userStore';

export const useAppInitialization = () => {
  const { fetchTasks } = useTaskStore();
  const { user, isAuthenticated } = useUserStore();

  useEffect(() => {
   
    if (isAuthenticated && user) {
      fetchTasks();
    }
  }, [isAuthenticated, user, fetchTasks]);
}; 
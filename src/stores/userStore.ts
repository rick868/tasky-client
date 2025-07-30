import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
  token: string;
  profilePicture?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  updateUserDetails: (details: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        error: null 
      }),
      updateUserDetails: (details) => set((state) => ({
        user: state.user ? { ...state.user, ...details } : null
      })),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 
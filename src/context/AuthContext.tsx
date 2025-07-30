import { createContext, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useUserStore } from '../stores/userStore';

type User = {
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
  token: string;
  profilePicture?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  updateUserDetails: (details: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    isAuthenticated,
    loading,
    error,
    setUser,
    logout,
    updateUserDetails,
    setLoading,
    setError,
  } = useUserStore();

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user-storage');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.state?.user) {
          setUser(parsed.state.user);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, [setUser]);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    error,
    setUser,
    logout,
    updateUserDetails,
    setLoading,
    setError,
  }), [user, isAuthenticated, loading, error, setUser, logout, updateUserDetails, setLoading, setError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

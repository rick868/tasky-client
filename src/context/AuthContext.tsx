import  { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

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
  login: (userData: User) => void;
  logout: () => void;
  updateUserDetails: (details: Partial<Omit<User, 'token'>>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateProfilePicture: (file: File) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUserDetails: () => {},
  updatePassword: async () => false,
  updateProfilePicture: () => {},
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUserDetails = useCallback((details: Partial<Omit<User, 'token'>>) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const updatedUser = { ...prevUser, ...details };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const response = await fetch('http://localhost:4000/api/user/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }, [user]);

  const updateProfilePicture = useCallback((file: File) => {
    // Placeholder logic for profile picture upload
    // In real app, upload file and update user profilePicture URL
    const url = URL.createObjectURL(file);
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const updatedUser = { ...prevUser, profilePicture: url };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const contextValue = useMemo(() => ({
    user,
    login,
    logout,
    updateUserDetails,
    updatePassword,
    updateProfilePicture,
  }), [user, login, logout, updateUserDetails, updatePassword, updateProfilePicture]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

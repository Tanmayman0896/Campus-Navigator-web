"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiService from '@/lib/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  major: string;
  year: number;
  level: number;
  xp: number;
  badges: number;
  completedModules: number;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

interface ProfileResponse {
  success: boolean;
  user: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    studentId: string;
    major: string;
    year: number;
  }) => Promise<void>;
  logout: () => void;
  updateUserProgress: (progressData: {
    xp: number;
    level: number;
    badges: number;
    completedModules: number;
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('campus_navigator_token');
        if (token) {
          apiService.setToken(token);
          const response = await apiService.getUserProfile() as ProfileResponse;
          if (response.success) {
            setUser(response.user);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token
        apiService.removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password }) as AuthResponse;
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    studentId: string;
    major: string;
    year: number;
  }) => {
    try {
      const response = await apiService.register(userData) as AuthResponse;
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const updateUserProgress = async (progressData: {
    xp: number;
    level: number;
    badges: number;
    completedModules: number;
  }) => {
    try {
      const response = await apiService.updateUserProgress(progressData) as any;
      if (response.success) {
        setUser(prev => prev ? { ...prev, ...progressData } : null);
      }
    } catch (error) {
      console.error('Failed to update user progress:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getUserProfile() as ProfileResponse;
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserProgress,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface GameProgress {
  gameId: string;
  lessonId: string;
  score: number;
  completed: boolean;
  completedAt: string;
  attempts: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  school: string;
  grade?: string;
  ecoPoints: number;
  level: number;
  streakDays: number;
  gameProgress: GameProgress[];
  badges: Array<{
    badgeId: {
      _id: string;
      name: string;
      description: string;
      icon: string;
      rarity: string;
    };
    earnedAt: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateGameProgress: (lessonId: string, gameId: string, score: number, ecoPoints: number) => void;
  getGameProgress: (lessonId: string, gameId: string) => GameProgress | null;
  getLessonProgress: (lessonId: string) => number;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  school: string;
  grade?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/me`);
          if (response.data.success) {
            const userData = response.data.user;
            // Initialize gameProgress if it doesn't exist
            if (!userData.gameProgress) {
              userData.gameProgress = [];
            }
            setUser(userData);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        // Initialize gameProgress if it doesn't exist
        if (!userData.gameProgress) {
          userData.gameProgress = [];
        }
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);

      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data;
        // Initialize gameProgress if it doesn't exist
        if (!newUser.gameProgress) {
          newUser.gameProgress = [];
        }
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData: Partial<User>): void => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const updateGameProgress = (lessonId: string, gameId: string, score: number, ecoPoints: number): void => {
    if (!user) return;

    const existingProgress = user.gameProgress.find(
      p => p.lessonId === lessonId && p.gameId === gameId
    );

    let updatedGameProgress: GameProgress[];

    if (existingProgress) {
      // Update existing progress
      updatedGameProgress = user.gameProgress.map(p => 
        p.lessonId === lessonId && p.gameId === gameId
          ? {
              ...p,
              score: Math.max(p.score, score), // Keep highest score
              completed: true,
              completedAt: new Date().toISOString(),
              attempts: p.attempts + 1
            }
          : p
      );
    } else {
      // Add new progress
      updatedGameProgress = [
        ...user.gameProgress,
        {
          gameId,
          lessonId,
          score,
          completed: true,
          completedAt: new Date().toISOString(),
          attempts: 1
        }
      ];
    }

    setUser({
      ...user,
      gameProgress: updatedGameProgress,
      ecoPoints: user.ecoPoints + ecoPoints
    });
  };

  const getGameProgress = (lessonId: string, gameId: string): GameProgress | null => {
    if (!user) return null;
    return user.gameProgress.find(
      p => p.lessonId === lessonId && p.gameId === gameId
    ) || null;
  };

  const getLessonProgress = (lessonId: string): number => {
    if (!user) return 0;
    const lessonGames = user.gameProgress.filter(p => p.lessonId === lessonId);
    if (lessonGames.length === 0) return 0;
    
    // Calculate completion percentage based on completed games
    const completedGames = lessonGames.filter(p => p.completed).length;
    return Math.round((completedGames / lessonGames.length) * 100);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    updateGameProgress,
    getGameProgress,
    getLessonProgress,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

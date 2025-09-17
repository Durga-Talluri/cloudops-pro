import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types';
import { authService } from '@/services/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        
        // Verify token is still valid
        try {
          const currentUser = await authService.getCurrentUser();
          dispatch({ type: 'SET_USER', payload: currentUser });
        } catch (error) {
          // Token is invalid, clear auth state
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { user, token } = await authService.login(credentials);
      
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { user, token } = await authService.register(data);
      
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const refreshUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
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
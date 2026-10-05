import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('medilens_token');
    const userStr = localStorage.getItem('medilens_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && typeof user === 'object') {
          return { token, user, isAuthenticated: true };
        }
      } catch {
        localStorage.removeItem('medilens_token');
        localStorage.removeItem('medilens_user');
      }
    }
    return { token: null, user: null, isAuthenticated: false };
  });

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('medilens_token', token);
    localStorage.setItem('medilens_user', JSON.stringify(user));
    setState({ token, user, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('medilens_token');
    localStorage.removeItem('medilens_user');
    setState({ token: null, user: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

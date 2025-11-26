import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export type Role = 'student' | 'admin';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  status: 'active' | 'deactivated';
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const storageKey = 'bscs3b_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { user: AuthUser; token: string };
        setUser(parsed.user);
        setToken(parsed.token);
        api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
      } catch {}
    }
    setLoading(false);
  }, []);

  const persist = (nextUser: AuthUser | null, nextToken: string | null) => {
    setUser(nextUser);
    setToken(nextToken);
    if (nextToken) {
      api.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
      localStorage.setItem(storageKey, JSON.stringify({ user: nextUser, token: nextToken }));
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem(storageKey);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.user, data.token);
    if (data.user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { fullName, email, password });
    persist(data.user, data.token);
    navigate('/dashboard', { replace: true });
  };

  const logout = () => {
    persist(null, null);
    navigate('/', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

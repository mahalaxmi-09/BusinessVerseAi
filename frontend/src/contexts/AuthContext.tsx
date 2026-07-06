import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'employee' | 'viewer';
  name: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  demoLogin: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  rbacCheck: (roles: Array<'owner' | 'admin' | 'manager' | 'employee' | 'viewer'>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthState = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthStateProvider');
  }
  return context;
};

export const AuthStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('bv_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('bv_token');
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) throw new Error('Invalid credentials');
      
      const data = await response.json();
      localStorage.setItem('bv_token', data.access_token);
      localStorage.setItem('bv_user', JSON.stringify(data.user));
      
      setToken(data.access_token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.log('Login failed: ', err);
      return false;
    }
  };

  const demoLogin = async (): Promise<boolean> => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Demo login failed');
      
      const data = await response.json();
      localStorage.setItem('bv_token', data.access_token);
      localStorage.setItem('bv_user', JSON.stringify(data.user));
      
      setToken(data.access_token);
      setUser(data.user);
      return true;
    } catch (err) {
      // Offline fallback: simulate local token
      console.log('Backend offline, triggering mock demo token session.');
      const mockUser: UserProfile = {
        email: 'demo@businessverse.ai',
        role: 'owner',
        name: 'Demo Sandbox Manager (Offline)'
      };
      localStorage.setItem('bv_token', 'mock_offline_jwt_token');
      localStorage.setItem('bv_user', JSON.stringify(mockUser));
      setToken('mock_offline_jwt_token');
      setUser(mockUser);
      return true;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('bv_token');
    localStorage.removeItem('bv_user');
    setToken(null);
    setUser(null);
  }, []);

  const rbacCheck = (roles: Array<'owner' | 'admin' | 'manager' | 'employee' | 'viewer'>): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      demoLogin,
      logout,
      isAuthenticated: !!token,
      rbacCheck
    }}>
      {children}
    </AuthContext.Provider>
  );
};

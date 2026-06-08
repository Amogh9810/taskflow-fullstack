import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const storedToken = localStorage.getItem('taskflow_token');
        if (storedToken) {
          setToken(storedToken);
          const response = await api.get('/auth/me');
          setUser(response.data);
          localStorage.setItem('taskflow_user', JSON.stringify(response.data));
        }
      } catch (err) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('taskflow_token', token);
    localStorage.setItem('taskflow_user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token && !!user,
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

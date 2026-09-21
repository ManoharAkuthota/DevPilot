import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('devpilot_access_token');
    if (token) {
      authService.getProfile()
        .then((profile) => {
          setUser(profile);
          localStorage.setItem('devpilot_user', JSON.stringify(profile));
        })
        .catch(() => {
          // Keep existing session if profile call transiently fails
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (usernameOrEmail, password) => {
    const response = await authService.login(usernameOrEmail, password);
    authService.saveAuthSession(response);
    setUser(response.user);
    return response.user;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    authService.saveAuthSession(response);
    setUser(response.user);
    return response.user;
  };

  const demoLogin = async () => {
    return await login('alex@devpilot.io', 'DevPilot2025!');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('devpilot_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

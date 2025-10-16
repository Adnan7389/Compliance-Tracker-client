import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

// Custom hook moved outside to avoid ESLint warning
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract only safe fields for localStorage
  const getSafeUserData = useCallback((userData) => {
    return {
      id: userData.id,
      name: userData.name,
      role: userData.role,
      businessId: userData.businessId
      // ✅ Only non-sensitive data
      // ❌ No email, tokens, or personal info
    };
  }, []);

  const getProfile = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      const userData = response.data.user;
      const safeUserData = getSafeUserData(userData);

      setUser(safeUserData);
      localStorage.setItem('user', JSON.stringify(safeUserData));
      setError('');
      return safeUserData;
    } catch (error) {
      // If profile fetch fails, clear any stale data
      localStorage.removeItem('user');
      setUser(null);
      throw error;
    }
  }, [getSafeUserData]);

  const checkAuth = useCallback(async () => {
    try {
      // Try to get profile - will work if HTTP-only cookie exists
      await getProfile();
    } catch {
      // Not authenticated - clear any stale data
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [getProfile]);

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // ✅ Now includes checkAuth in dependencies

  const login = async (credentials) => {
    try {
      setError('');
      const response = await authAPI.login(credentials);
      const { user: userData } = response.data;

      // Extract only safe data for localStorage
      const safeUserData = getSafeUserData(userData);

      setUser(safeUserData);
      localStorage.setItem('user', JSON.stringify(safeUserData));

      return response.data;
    } catch (error) {
      let errorMessage = 'Login failed';

      if (error.response?.data?.message === 'Invalid credentials') {
        errorMessage = 'Email or password is incorrect';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      const response = await authAPI.register(userData);
      const { user: fullUserData } = response.data;

      // Extract only safe data for localStorage
      const safeUserData = getSafeUserData(fullUserData);

      setUser(safeUserData);
      localStorage.setItem('user', JSON.stringify(safeUserData));

      return response.data;
    } catch (error) {
      let errorMessage = 'Registration failed';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors from express-validator
        errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear frontend state
      setUser(null);
      localStorage.removeItem('user');
      setError('');
    }
  };

  const logoutAll = async () => {
    try {
      await authAPI.logoutAll();
    } catch (error) {
      console.error('Logout all devices failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      setError('');
    }
  };

  const clearError = () => setError('');

  const value = {
    user,
    login,
    register,
    logout,
    logoutAll,
    getProfile,
    loading,
    error,
    clearError,
    isAuthenticated: !!user,
    isOwner: user?.role === 'owner',
    isStaff: user?.role === 'staff',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
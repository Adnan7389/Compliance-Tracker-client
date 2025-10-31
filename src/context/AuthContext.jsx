import React, { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { AuthContext } from './auth';

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
      businessId: userData.businessId,
      businessName: userData.businessName,
      email: userData.email
      // ✅ Only non-sensitive data
    };
  }, []);

  const getProfile = useCallback(async () => {
    console.log('[AuthContext] getProfile: Fetching user profile...');
    try {
      const response = await authAPI.getProfile();
      const userData = response.data.user;
      const safeUserData = getSafeUserData(userData);

      console.log('[AuthContext] getProfile: Success', safeUserData);
      setUser(safeUserData);
      localStorage.setItem('user', JSON.stringify(safeUserData));
      setError('');
      return safeUserData;
    } catch (error) {
      console.error('[AuthContext] getProfile: Failed', error);
      // If profile fetch fails, clear any stale data
      localStorage.removeItem('user');
      setUser(null);
      throw error;
    }
  }, [getSafeUserData]);

  const checkAuth = useCallback(async () => {
    console.log('[AuthContext] checkAuth: Checking authentication status...');
    const token = localStorage.getItem('user');
    console.log(`[AuthContext] checkAuth: Found token in localStorage: ${!!token}`);

    if (token) {
      try {
        // Try to get profile - will work if HTTP-only cookie exists
        await getProfile();
        console.log('[AuthContext] checkAuth: Profile fetch successful');
      } catch {
        console.error('[AuthContext] checkAuth: Profile fetch failed, clearing user data.');
        // Not authenticated - clear any stale data
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false);
  }, [getProfile]);

  // Check if user is authenticated on app start
  useEffect(() => {
    console.log('[AuthContext] useEffect: Initial authentication check...');
    checkAuth();
  }, [checkAuth]); // ✅ Now includes checkAuth in dependencies

  const login = async (credentials) => {
    console.log('[AuthContext] login: Attempting to log in...');
    try {
      setError('');
      const response = await authAPI.login(credentials);
      const { user: userData } = response.data;

      console.log('[AuthContext] login: Success', userData);
      // Extract only safe data for localStorage
      const safeUserData = getSafeUserData(userData);

      setUser(safeUserData);
      localStorage.setItem('user', JSON.stringify(safeUserData));

      return response.data;
    } catch (error) {
      console.error('[AuthContext] login: Failed', error);
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
    console.log('[AuthContext] logout: Logging out...');
    try {
      await authAPI.logout();
      console.log('[AuthContext] logout: API call successful');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear frontend state
      console.log('[AuthContext] logout: Clearing user data.');
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
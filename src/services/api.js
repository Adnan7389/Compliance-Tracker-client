import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with credentials for HTTP-only cookies
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Essential for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - no need to add token to headers since it's in cookies
api.interceptors.request.use(
  (config) => {
    // Token is automatically sent via HTTP-only cookie
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user');
      // window.location.href = '/login'; // Causing infinite loop
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  logoutAll: () => api.post('/auth/logout-all'),
  getProfile: () => api.get('/auth/profile'),
};

export const staffAPI = {
  create: (staffData) => api.post('/staff', staffData),
  getAll: () => api.get('/staff'),
  getById: (staffId) => api.get(`/staff/${staffId}`),
};

export const tasksAPI = {
  create: (taskData) => api.post('/tasks', taskData),
  getAll: (params = {}) => api.get('/tasks', { params }),
  getById: (taskId) => api.get(`/tasks/${taskId}`),
  update: (taskId, updates) => api.put(`/tasks/${taskId}`, updates),
  delete: (taskId) => api.delete(`/tasks/${taskId}`),
};

export default api;
import axios from 'axios';

let apiUrl = import.meta.env.VITE_API_URL || '/api';
if (apiUrl && !apiUrl.startsWith('http')) {
  apiUrl = `https://${apiUrl}`;
}

const API_BASE_URL = apiUrl;

// Create axios instance with credentials for HTTP-only cookies
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Essential for HTTP-only cookies
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - no need to add token to headers since it's in cookies
api.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.params || '');

    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;

    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status} (${duration}ms)`);

    return response;
  },
  async (error) => {
    const endTime = new Date();
    const duration = endTime - error.config.metadata.startTime;

    console.error(`❌ ${error.config.method?.toUpperCase()} ${error.config.url} ${error.response?.status} (${duration}ms)`, error.response?.data);

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Bad Request - validation errors
          error.message = data.message || 'Validation failed';
          error.type = 'VALIDATION_ERROR';
          error.details = data.errors || data.details;
          break;

        case 401:
          // Unauthorized - token expired or invalid
          error.message = data.message || 'Session expired';
          error.type = 'AUTH_ERROR';

          // Clear user data and redirect to login
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - no permission
          error.message = data.message || 'Access denied';
          error.type = 'PERMISSION_ERROR';
          break;

        case 404:
          // Not Found
          error.message = data.message || 'Resource not found';
          error.type = 'NOT_FOUND_ERROR';
          break;

        case 409:
          // Conflict - duplicate resource
          error.message = data.message || 'Resource already exists';
          error.type = 'CONFLICT_ERROR';
          error.details = data.details;
          break;

        case 422:
          // Unprocessable Entity - validation errors
          error.message = data.message || 'Validation failed';
          error.type = 'VALIDATION_ERROR';
          error.details = data.errors || data.details;
          break;

        case 429:
          // Too Many Requests - rate limiting
          error.message = data.message || 'Too many requests. Please try again later.';
          error.type = 'RATE_LIMIT_ERROR';
          break;

        case 500:
          // Internal Server Error
          error.message = 'Server error. Please try again later.';
          error.type = 'SERVER_ERROR';
          break;

        default:
          error.message = data.message || 'An unexpected error occurred';
          error.type = 'UNKNOWN_ERROR';
      }
    } else if (error.request) {
      // Network error - no response received
      error.message = 'Network error. Please check your connection.';
      error.type = 'NETWORK_ERROR';
    } else {
      // Something else happened
      error.message = error.message || 'An unexpected error occurred';
      error.type = 'UNKNOWN_ERROR';
    }

    return Promise.reject(error);
  }
);

// Retry configuration for idempotent requests
const retryConfig = {
  maxRetries: 2,
  retryDelay: 1000, // 1 second
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableMethods: ['get', 'head', 'options'] // Idempotent methods only
};

// Enhanced request function with retry logic
const requestWithRetry = async (config, retryCount = 0) => {
  try {
    return await api(config);
  } catch (error) {
    const shouldRetry =
      retryConfig.retryableMethods.includes(config.method?.toLowerCase()) &&
      retryConfig.retryableStatuses.includes(error.response?.status) &&
      retryCount < retryConfig.maxRetries;

    if (shouldRetry) {
      console.log(`🔄 Retrying request (${retryCount + 1}/${retryConfig.maxRetries})...`);

      await new Promise(resolve =>
        setTimeout(resolve, retryConfig.retryDelay * (retryCount + 1))
      );

      return requestWithRetry(config, retryCount + 1);
    }

    throw error;
  }
};

// API service methods with consistent error handling
export const apiService = {
  // GET request with retry
  get: (url, config = {}) => requestWithRetry({ ...config, method: 'get', url }),

  // POST request (no retry)
  post: (url, data = {}, config = {}) => api.post(url, data, config),

  // PUT request (no retry)
  put: (url, data = {}, config = {}) => api.put(url, data, config),

  // PATCH request (no retry)
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),

  // DELETE request (no retry)
  delete: (url, config = {}) => api.delete(url, config),
};

// Specific API endpoints
export const authAPI = {
  login: (credentials) => apiService.post('/auth/login', credentials),
  register: (userData) => apiService.post('/auth/register', userData),
  logout: () => apiService.post('/auth/logout'),
  logoutAll: () => apiService.post('/auth/logout-all'),
  getProfile: () => apiService.get('/auth/profile'),
};

export const staffAPI = {
  create: (staffData) => apiService.post('/staff', staffData),
  getAll: () => apiService.get('/staff'),
  getById: (staffId) => apiService.get(`/staff/${staffId}`),
};

export const tasksAPI = {
  create: (taskData) => apiService.post('/tasks', taskData),
  getAll: (params = {}) => apiService.get('/tasks', { params }),
  getById: (taskId) => apiService.get(`/tasks/${taskId}`),
  update: (taskId, updates) => apiService.put(`/tasks/${taskId}`, updates),
  delete: (taskId) => apiService.delete(`/tasks/${taskId}`),
  getTaskHistory: (taskId) => apiService.get(`/tasks/${taskId}/history`),
};

export const dashboardAPI = {
  getDashboard: () => apiService.get('/dashboard'),
  getStats: () => apiService.get('/dashboard/stats'),
};

export const documentsAPI = {
  upload: (taskId, formData) => api.post(`/tasks/${taskId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getTaskDocuments: (taskId) => apiService.get(`/tasks/${taskId}/documents`),
  download: (documentId) => apiService.get(`/documents/${documentId}/download`, {
    responseType: 'blob' // Important for file downloads
  }),
  delete: (documentId) => apiService.delete(`/documents/${documentId}`),
};

// Utility functions
export const isNetworkError = (error) => error.type === 'NETWORK_ERROR';
export const isValidationError = (error) => error.type === 'VALIDATION_ERROR';
export const isAuthError = (error) => error.type === 'AUTH_ERROR';
export const isPermissionError = (error) => error.type === 'PERMISSION_ERROR';

export default apiService;
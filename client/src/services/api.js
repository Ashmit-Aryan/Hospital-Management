import axios from 'axios';
import toast from 'react-hot-toast';

// Use full URL for API calls during development
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Use relative path in production
  : 'http://localhost:5000/api';  // Use full URL in development

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Don't show toast for login page errors
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    if (error.response?.status === 401 && !isLoginRequest) {
      // Only redirect if we're not already on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
        
        toast.error('Session expired. Please login again.');
      }
    } else if (error.response?.data?.error && !isLoginRequest) {
      toast.error(error.response.data.error);
    } else if (!error.response && !isLoginRequest) {
      // No response means network error or CORS issue
      toast.error('Cannot connect to server. Please check if the backend is running.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
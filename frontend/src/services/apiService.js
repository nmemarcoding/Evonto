// src/services/apiService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://evonto.onrender.com/api',
   
});

// Request interceptor: attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: check for updated Authorization token and handle auth errors
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers['authorization'];
    if (newToken) {
      localStorage.setItem('authToken', newToken);
       // store user info 

        const userInfo = response.data
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
    return response;
  },
  (error) => {
    // Check if the error is due to authentication issues (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.log('Authentication error detected, logging out user');
      logout(); 
      
      // If the app has a global state manager like Redux, you could dispatch
      // an action here to update the auth state across the application
    }
    return Promise.reject(error);
  }
);

// Logout utility to clear all user data from localStorage
export const logout = () => {
  // Remove authentication token
  localStorage.removeItem('authToken');
  
  // Remove user info/profile
  localStorage.removeItem('userInfo');
  
  // Remove any other user-related data that might be stored
  localStorage.removeItem('user');
  localStorage.removeItem('userData');
  localStorage.removeItem('preferences');
  localStorage.removeItem('events');
  
  console.log('User successfully logged out, all local data cleared');
  
  // If you want to be extremely thorough, you could use this instead:
  // However, be careful as this would clear ALL localStorage for your domain
  // localStorage.clear();
};

// Token validation utility (manual check)
export const validateToken = async () => {
  const token = localStorage.getItem('authToken');

  if (!token) return false;

  try {
    const response = await api.post('/check-token', null, {
      headers: {
        Authorization: token,
      },
    });

    const isValid = response?.data?.startsWith('Token is valid for user:') || false;
    
    // If token validation fails, make sure to log out
    if (!isValid) {
      logout();
    }
    
    return isValid;
  } catch (err) {
    console.error('Token validation error:', err);
    // On error (expired token, server error, etc.), log out the user
    logout();
    return false;
  }
};

export default api;
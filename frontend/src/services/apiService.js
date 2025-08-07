// src/services/apiService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
   
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

// Response interceptor: check for updated Authorization token
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
  (error) => Promise.reject(error)
);

// Logout utility to clear the stored token
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
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

    return (
      response?.data?.startsWith('Token is valid for user:') || false
    );
  } catch (err) {
    console.error('Token validation error:', err);
    return false;
  }
};

export default api;
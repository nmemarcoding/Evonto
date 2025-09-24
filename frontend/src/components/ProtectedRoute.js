import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { validateToken, logout } from '../services/apiService';

const ProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateToken();
      setAuthorized(isValid);
      
      // If token is invalid, clear the user data
      if (!isValid && localStorage.getItem('authToken')) {
        console.log('Invalid token detected, logging out user');
        // Ensure all user data is properly cleared
        logout();
      }
    };
    checkAuth();
  }, []);

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500 text-sm">🔐 Checking authentication...</div>
      </div>
    );
  }

  if (!authorized) {
    // Token is invalid or missing, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
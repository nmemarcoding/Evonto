// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/apiService';

function Navbar({ showLogin = true }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="w-full px-6 py-4 shadow-sm flex justify-between items-center bg-white z-10">
      <h1
        className="text-2xl font-bold text-blue-600 tracking-tight cursor-pointer"
        onClick={() => navigate('/')}
      >
        Evonto
      </h1>

      {user ? (
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <span className="font-medium hidden sm:inline">Hi, {user.username}</span>
          <button
            onClick={handleLogout}
            className="text-red-500 font-semibold hover:underline"
          >
            Logout
          </button>
        </div>
      ) : (
        showLogin && (
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </button>
        )
      )}
    </header>
  );
}

export default Navbar;

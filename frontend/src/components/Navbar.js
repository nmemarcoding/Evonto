import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/apiService';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch {
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [location.pathname]); // Refresh user info when location changes

  const handleLogout = () => {
    logout();
    setUserInfo(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">Evonto</Link>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden md:flex space-x-6 items-center">
            <NavLinks userInfo={userInfo} onLogout={handleLogout} />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pt-2 pb-4 space-y-2">
          <NavLinks userInfo={userInfo} onLogout={handleLogout} isMobile />
        </div>
      )}
    </nav>
  );
}

function NavLinks({ userInfo, onLogout, isMobile = false }) {
  const baseClass = isMobile
    ? 'block text-gray-700 py-2 text-sm font-medium'
    : 'text-gray-700 hover:text-indigo-600 text-sm font-medium';

  return (
    <>
      <Link to="/" className={baseClass}>Home</Link>

      {!userInfo ? (
        <>
          <Link to="/register" className={baseClass}>Register</Link>
          <Link to="/login" className={baseClass}>Login</Link>
        </>
      ) : (
        <>
          <Link to="/create-event" className={baseClass}>Create Event</Link>
          <Link to="/my-events" className={baseClass}>My Events</Link>
          <span className={baseClass}>👤 {userInfo.username}</span>
          <button onClick={onLogout} className={`${baseClass} text-red-500`}>
            Logout
          </button>
        </>
      )}
    </>
  );
}

export default Navbar;

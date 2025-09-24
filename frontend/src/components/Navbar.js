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
    <nav className="bg-white backdrop-blur-lg bg-opacity-80 sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 text-transparent bg-clip-text">Evonto</Link>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-800 focus:outline-none w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50"
              aria-label="Toggle menu"
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

          <div className="hidden md:flex space-x-1 items-center">
            <NavLinks userInfo={userInfo} onLogout={handleLogout} />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-xl mx-4 mt-1 overflow-hidden">
          <div className="px-4 py-3 space-y-3 flex flex-col">
            <NavLinks userInfo={userInfo} onLogout={handleLogout} isMobile />
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLinks({ userInfo, onLogout, isMobile = false }) {
  const baseClass = isMobile
    ? 'block px-3 py-2.5 rounded-xl text-gray-700 font-medium text-base hover:bg-gray-50 active:bg-gray-100'
    : 'px-3 py-1.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 text-sm';

  return (
    <>
      <Link to="/" className={baseClass}>Home</Link>

      {!userInfo ? (
        <>
          <Link to="/register" className={baseClass}>Register</Link>
          <Link to="/login" className={`${baseClass} bg-primary-50 text-primary-600`}>Login</Link>
        </>
      ) : (
        <>
          <Link to="/create-event" className={baseClass}>Create Event</Link>
          <Link to="/my-events" className={baseClass}>My Events</Link>
          <div className={isMobile ? baseClass : `ml-2 px-3 py-1.5 bg-gray-50 rounded-xl flex items-center gap-2`}>
            <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
              {userInfo.username?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="font-medium text-sm text-gray-700">{userInfo.username}</span>
          </div>
          <button onClick={onLogout} className={`${baseClass} text-red-500`}>
            Logout
          </button>
        </>
      )}
    </>
  );
}

export default Navbar;

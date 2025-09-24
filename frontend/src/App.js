// src/App.js
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import EventDetails from './pages/EventDetails'; 
import InvitationDetails from './pages/InvitationDetails';
import ProtectedRoute from './components/ProtectedRoute';
import api from './services/apiService';

function App() {
  const [serverRunning, setServerRunning] = useState(null); // null = checking, true = running, false = down

  // Set document title
  useEffect(() => {
    document.title = "Evonto | Event Management";
  }, []);

  useEffect(() => {
    const checkServer = async () => {
      try {
        // Using the ping endpoint to check server status
        await api.get('/ping');
        setServerRunning(true);
      } catch (error) {
        console.error('❌ Server check failed:', error.message);
        setServerRunning(false);
      }
    };

    checkServer();
  }, []);

  if (serverRunning === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={logo} 
              alt="Evonto Logo" 
              className="w-20 h-20 animate-pulse" 
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Evonto</h2>
          <p className="mt-3 text-gray-600">Loading application...</p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto animate-pulse rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!serverRunning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-red-50 px-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={logo} 
              alt="Evonto Logo" 
              className="w-20 h-20 opacity-50" 
            />
          </div>
          <h2 className="text-xl font-semibold text-red-600">Server Unavailable</h2>
          <p className="mt-3 text-gray-700">Unable to reach the server. Please try refreshing or check your connection.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/invitation" element={<InvitationDetails />} />

        {/* Protected Routes */}
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events"
          element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/:id"
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

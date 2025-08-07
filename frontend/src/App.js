// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import EventDetails from './pages/EventDetails'; 
import InvitationDetails from './pages/InvitationDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/event/:id" element={<EventDetails />} /> 
        <Route path="/invitation" element={<InvitationDetails />} />

      </Routes>
    </Router>
  );
}

export default App;

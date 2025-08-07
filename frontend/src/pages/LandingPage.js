// src/pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CalendarDays, Users, Mail } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 mt-12 mb-16">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 mb-4">
          Plan Events <br /> That People Remember
        </h2>
        <p className="text-lg text-gray-500 mb-6 max-w-md">
          Evonto makes it simple to create, share, and manage your events.
          Send invitations, track responses, and host with confidence.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-12 px-6 rounded-t-3xl">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-semibold text-gray-800">Why Choose Evonto?</h3>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <CalendarDays className="w-12 h-12 text-blue-600 mb-4" />
            <h4 className="text-lg font-medium mb-1">Effortless Scheduling</h4>
            <p className="text-gray-500 text-sm">
              Create events in seconds. Set time, location, and preferences easily.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Users className="w-12 h-12 text-blue-600 mb-4" />
            <h4 className="text-lg font-medium mb-1">Smart Guest Management</h4>
            <p className="text-gray-500 text-sm">
              Invite friends and track responses in real-time.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Mail className="w-12 h-12 text-blue-600 mb-4" />
            <h4 className="text-lg font-medium mb-1">Instant Notifications</h4>
            <p className="text-gray-500 text-sm">
              Stay updated with every RSVP, reminder, and message.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="text-center mt-16 mb-10 px-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-3">Ready to host your next event?</h4>
        <button
          onClick={() => navigate('/register')}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Create Your Free Account
        </button>
      </footer>
    </div>
  );
}

export default LandingPage;

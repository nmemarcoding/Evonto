// src/pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CalendarDays, Users, Mail, ArrowRight } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 mt-12 mb-20 max-w-4xl mx-auto">
        <div className="relative mb-5">
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-primary-100 rounded-full blur-xl opacity-70"></div>
          <div className="absolute -bottom-2 -left-8 w-16 h-16 bg-primary-200 rounded-full blur-lg opacity-70"></div>
          <span className="relative inline-block bg-primary-50 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Easier Event Planning
          </span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-gray-900 mb-6">
          Plan Events <br className="hidden sm:block" /> 
          <span className="bg-gradient-to-r from-primary-600 to-primary-500 text-transparent bg-clip-text">That People Remember</span>
        </h2>
        
        <p className="text-lg text-gray-500 mb-8 max-w-xl">
          Evonto makes it simple to create, share, and manage your events.
          Send invitations, track responses, and host with confidence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/register')}
            className="bg-primary-600 text-white px-6 py-3.5 rounded-2xl text-base font-semibold shadow-ios hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="bg-gray-50 text-gray-800 px-6 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-100 transition-colors border border-gray-100"
          >
            Sign In
          </button>
        </div>
        
        <div className="mt-16 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="px-4">
              <div className="text-3xl font-bold text-primary-600 mb-1">500+</div>
              <div className="text-sm text-gray-500">Events Created</div>
            </div>
            <div className="px-4 border-x border-gray-200">
              <div className="text-3xl font-bold text-primary-600 mb-1">10k+</div>
              <div className="text-sm text-gray-500">RSVPs Managed</div>
            </div>
            <div className="px-4">
              <div className="text-3xl font-bold text-primary-600 mb-1">98%</div>
              <div className="text-sm text-gray-500">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16 px-6 rounded-t-[2.5rem] sm:rounded-t-[3rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent"></div>
        
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="bg-primary-50 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 inline-block">
            Features
          </span>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Evonto?</h3>
          <p className="text-gray-500">Streamline your event planning process with our intuitive platform designed for modern hosts</p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-ios">
            <div className="bg-primary-50 w-14 h-14 flex items-center justify-center rounded-xl mb-5">
              <CalendarDays className="w-7 h-7 text-primary-600" />
            </div>
            <h4 className="text-xl font-semibold mb-3">Effortless Scheduling</h4>
            <p className="text-gray-500">
              Create events in seconds. Set time, location, and preferences with our intuitive interface.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-ios">
            <div className="bg-primary-50 w-14 h-14 flex items-center justify-center rounded-xl mb-5">
              <Users className="w-7 h-7 text-primary-600" />
            </div>
            <h4 className="text-xl font-semibold mb-3">Smart Guest Management</h4>
            <p className="text-gray-500">
              Invite guests easily and track responses in real-time with our powerful dashboard.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-ios">
            <div className="bg-primary-50 w-14 h-14 flex items-center justify-center rounded-xl mb-5">
              <Mail className="w-7 h-7 text-primary-600" />
            </div>
            <h4 className="text-xl font-semibold mb-3">Instant Notifications</h4>
            <p className="text-gray-500">
              Stay updated with every RSVP, reminder, and message from your guests automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="text-center px-6 py-16 bg-gray-50">
        <div className="max-w-lg mx-auto">
          <h4 className="text-2xl font-bold text-gray-900 mb-4">Ready to host your next event?</h4>
          <p className="text-gray-500 mb-6">Join thousands of event planners who trust Evonto to handle their events</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-primary-600 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-primary-700 transition-colors shadow-ios"
          >
            Create Your Free Account
          </button>
          <p className="text-gray-400 text-sm mt-12">© 2025 Evonto. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

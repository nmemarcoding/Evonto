// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('/login', form);

      // Token + userInfo storage is handled by apiService interceptor
      console.log('Login success:', response.data);
      navigate('/'); // Redirect to home or dashboard
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMsg(error?.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 text-transparent bg-clip-text mb-2">
              Evonto
            </h1>
            <p className="text-gray-500">Welcome back, log in to continue</p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center shadow-ios">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 ml-1">
                  Password
                </label>
                <button type="button" className="text-sm text-primary-600 font-medium hover:text-primary-700">
                  Forgot?
                </button>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                required
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-4 rounded-2xl text-base font-semibold hover:bg-primary-700 transition shadow-ios disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : 'Log in'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-primary-600 font-semibold hover:text-primary-700"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <footer className="py-6 text-center">
        <p className="text-sm text-gray-500">
          &copy; 2025 Evonto. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Login;

// src/pages/CreateEvent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';
import Navbar from '../components/Navbar';

function CreateEvent() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await api.post('/events', form);
      console.log('Event created:', response.data);
      setSuccessMsg('Event created successfully!');
      setForm({
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
      });
    } catch (error) {
      console.error('Event creation failed:', error);
      setErrorMsg(error?.response?.data?.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Create New Event
          </h2>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to set up your event</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center shadow-ios">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center shadow-ios">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </div>
        )}

        <div className="bg-white shadow-ios rounded-ios-xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Event Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Add a title for your event"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Tell people what your event is about"
                value={form.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition placeholder-gray-400 resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDateTime" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                  Start Date & Time
                </label>
                <input
                  id="startDateTime"
                  type="datetime-local"
                  name="startDateTime"
                  value={form.startDateTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="endDateTime" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                  End Date & Time
                </label>
                <input
                  id="endDateTime"
                  type="datetime-local"
                  name="endDateTime"
                  value={form.endDateTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="Where will your event take place?"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-semibold hover:bg-primary-700 transition shadow-ios disabled:opacity-50 flex justify-center items-center mt-4"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Event...
                </span>
              ) : 'Create Event'}
            </button>
          </form>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => navigate('/my-events')}
            className="text-primary-600 font-medium hover:text-primary-700 text-sm"
          >
            Cancel and return to My Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;

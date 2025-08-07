import React, { useEffect, useState } from 'react';
import api from '../services/apiService';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import InviteGuestModal from '../components/InviteGuestModal';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events/my');
      setEvents(response.data || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setErrorMsg('Could not load your events.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${eventId}`);
      fetchEvents(); // refresh
    } catch (err) {
      alert('Failed to delete event.');
    }
  };

  const openInviteModal = (eventId) => {
    setSelectedEventId(eventId);
    setShowInviteModal(true);
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-primary-100 text-primary-600' };
    } else if (now > end) {
      return { status: 'past', label: 'Past', color: 'bg-gray-100 text-gray-600' };
    } else {
      return { status: 'ongoing', label: 'In Progress', color: 'bg-emerald-100 text-emerald-600' };
    }
  };

  const filteredEvents = events.filter((event) => {
    const now = new Date();
    const eventStart = new Date(event.startDateTime);
    const eventStatus = getEventStatus(event.startDateTime, event.endDateTime).status;

    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'upcoming' && eventStatus !== 'upcoming') return false;
    if (filter === 'past' && eventStatus !== 'past') return false;
    if (filter === 'ongoing' && eventStatus !== 'ongoing') return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-4 sm:mb-0">
            My Events
          </h2>
          
          <button 
            onClick={() => navigate('/create-event')}
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-5 rounded-xl shadow-ios transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6"></path>
            </svg>
            New Event
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white shadow-ios rounded-ios-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">In Progress</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary-500 animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Loading events...</p>
            </div>
          </div>
        ) : errorMsg ? (
          <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl text-center shadow-ios">
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errorMsg}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white shadow-ios rounded-ios-xl p-10 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "No events match your search" : "You haven't created any events yet"}
            </p>
            <button 
              onClick={() => navigate('/create-event')}
              className="bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-6 rounded-xl shadow-ios transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6"></path>
              </svg>
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredEvents.map((event) => {
              const { status, label, color } = getEventStatus(event.startDateTime, event.endDateTime);
              
              return (
                <div
                  key={event.eventId}
                  className="bg-white shadow-ios rounded-ios-xl p-5 border border-gray-100"
                >
                  <div className="flex justify-between items-start flex-wrap sm:flex-nowrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                          {label}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(event.startDateTime)}</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>{formatDate(event.endDateTime)}</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col space-x-3 sm:space-x-0 sm:space-y-2 sm:items-end">
                      <button
                        onClick={() => navigate(`/event/${event.eventId}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-800 text-sm rounded-xl hover:bg-gray-200 transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Details
                      </button>
                      <button
                        onClick={() => openInviteModal(event.eventId)}
                        className="px-4 py-2 bg-primary-50 text-primary-600 text-sm rounded-xl hover:bg-primary-100 transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Invite
                      </button>
                      <button
                        onClick={() => handleDelete(event.eventId)}
                        className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-xl hover:bg-red-100 transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Guest Modal */}
      {showInviteModal && (
        <InviteGuestModal 
          eventId={selectedEventId} 
          onClose={() => setShowInviteModal(false)} 
        />
      )}
    </div>
  );
}

export default MyEvents;

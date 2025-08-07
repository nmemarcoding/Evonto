import React, { useEffect, useState } from 'react';
import api from '../services/apiService';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
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
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setShowInviteModal(true);
  };

  const sendInvitation = async () => {
    if (!guestName || (!guestEmail && !guestPhone)) {
      alert('Please enter guest name and either email or phone.');
      return;
    }

    try {
      await api.post('/invitations/send', {
        eventId: selectedEventId,
        guestName,
        guestEmail: guestEmail || null,
        guestPhone: guestPhone || null,
      });
      setShowInviteModal(false);
      alert('Invitation sent!');
    } catch (err) {
      console.error('Invitation failed:', err);
      alert('Failed to send invitation.');
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleString();

  const filteredEvents = events.filter((event) => {
    const now = new Date();
    const eventStart = new Date(event.startDateTime);

    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'upcoming' && eventStart < now) return false;
    if (filter === 'past' && eventStart >= now) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Events</h2>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading events...</div>
        ) : errorMsg ? (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm text-center">
            {errorMsg}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-gray-500">No matching events found.</div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <div
                key={event.eventId}
                className="bg-white shadow rounded-xl p-5 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p><strong>Starts:</strong> {formatDate(event.startDateTime)}</p>
                      <p><strong>Ends:</strong> {formatDate(event.endDateTime)}</p>
                      <p><strong>Location:</strong> {event.location}</p>
                      <p><strong>Created by:</strong> {event.createdByUsername}</p>
                      <p><strong>Created at:</strong> {formatDate(event.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 items-end">
                    <button
                      onClick={() => navigate(`/event/${event.eventId}`)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openInviteModal(event.eventId)}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded hover:bg-indigo-200"
                    >
                      Invite Guest
                    </button>
                    <button
                      onClick={() => handleDelete(event.eventId)}
                      className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Guest Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Invite Guest</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Guest Name"
                className="w-full border px-3 py-2 rounded"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Guest Email (optional)"
                className="w-full border px-3 py-2 rounded"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Guest Phone (optional)"
                className="w-full border px-3 py-2 rounded"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-5 space-x-3">
              <button
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={sendInvitation}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyEvents;

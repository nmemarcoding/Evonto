// src/pages/MyEvents.js
import React, { useEffect, useState } from 'react';
import api from '../services/apiService';
import Navbar from '../components/Navbar';
import InviteGuestModal from '../components/InviteGuestModal';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [activeInviteId, setActiveInviteId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
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

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    setDeletingId(eventId);
    try {
      await api.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e.eventId !== eventId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete event.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Events</h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading events...</div>
        ) : errorMsg ? (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm text-center">
            {errorMsg}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-500">You haven’t created any events yet.</div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.eventId}
                className="bg-white shadow-md rounded-xl p-5 border border-gray-100 relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleDelete(event.eventId)}
                      disabled={deletingId === event.eventId}
                      className="text-sm text-red-500 font-medium hover:underline"
                    >
                      {deletingId === event.eventId ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                      onClick={() => setActiveInviteId(event.eventId)}
                      className="text-sm text-blue-500 font-medium hover:underline"
                    >
                      Invite Guest
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500 space-y-1">
                  <p><strong>Starts:</strong> {formatDate(event.startDateTime)}</p>
                  <p><strong>Ends:</strong> {formatDate(event.endDateTime)}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Created by:</strong> {event.createdByUsername}</p>
                  <p><strong>Created at:</strong> {formatDate(event.createdAt)}</p>
                </div>

                {activeInviteId === event.eventId && (
                  <InviteGuestModal
                    eventId={event.eventId}
                    onClose={() => setActiveInviteId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEvents;

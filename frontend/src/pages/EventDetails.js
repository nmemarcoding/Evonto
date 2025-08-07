import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/apiService';
import Navbar from '../components/Navbar';

function EventDetails() {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${eventId}/details`);
      setEvent(response.data.event);
      setInvitations(response.data.invitations || []);
    } catch (err) {
      console.error('Failed to fetch event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleString();

  const handleCopyLink = (guest) => {
    const baseUrl = window.location.origin;
    const invitationUrl = `${baseUrl}/invitation?eventId=${eventId}&guestName=${encodeURIComponent(
      guest.guestName
    )}${guest.guestEmail ? `&guestEmail=${encodeURIComponent(guest.guestEmail)}` : ''}`;

    navigator.clipboard
      .writeText(invitationUrl)
      .then(() => {
        setCopySuccess(`Copied link for ${guest.guestName}`);
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(() => {
        alert('Failed to copy link.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : event ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{event.title}</h2>
            <p className="text-center text-gray-600 mb-6">{event.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow rounded-xl p-5 mb-8">
              <div>
                <p><strong>Start:</strong> {formatDate(event.startDateTime)}</p>
                <p><strong>End:</strong> {formatDate(event.endDateTime)}</p>
                <p><strong>Location:</strong> {event.location}</p>
              </div>
              <div>
                <p><strong>Created At:</strong> {formatDate(event.createdAt)}</p>
                <p><strong>Event ID:</strong> {event.eventId}</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mb-4">Invited Guests</h3>

            {copySuccess && (
              <div className="mb-4 text-green-600 text-sm text-center">{copySuccess}</div>
            )}

            {invitations.length === 0 ? (
              <p className="text-gray-500">No guests invited yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {invitations.map((guest) => (
                  <div
                    key={guest.invitationId}
                    className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between"
                  >
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><strong>Name:</strong> {guest.guestName}</p>
                      <p><strong>Email:</strong> {guest.guestEmail || '—'}</p>
                      <p><strong>Phone:</strong> {guest.guestPhone || '—'}</p>
                      <p><strong>RSVP:</strong> {guest.rsvpStatus}</p>
                      <p><strong>Sent At:</strong> {formatDate(guest.invitationSentAt)}</p>
                      <p><strong>Responded:</strong> {guest.respondedAt ? formatDate(guest.respondedAt) : '—'}</p>
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      <a
                        href={`/invitation?eventId=${eventId}&guestName=${encodeURIComponent(
                          guest.guestName
                        )}${guest.guestEmail ? `&guestEmail=${encodeURIComponent(guest.guestEmail)}` : ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        View Invitation
                      </a>
                      <button
                        onClick={() => handleCopyLink(guest)}
                        className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500">Event not found.</div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;

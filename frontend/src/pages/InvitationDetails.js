import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/apiService';
import Navbar from '../components/Navbar';

function InvitationDetails() {
  const [searchParams] = useSearchParams();
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [responseSuccess, setResponseSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const eventId = searchParams.get('eventId');
  const guestName = searchParams.get('guestName');
  const guestEmail = searchParams.get('guestEmail'); // optional

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!eventId || !guestName) {
        setError('Missing required invitation parameters.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.post('/invitations/info', {
          eventId,
          guestName,
          guestEmail: guestEmail || null,
        });

        setInvitation(response.data);
      } catch (err) {
        console.error(err);
        setError('Could not fetch invitation details.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [eventId, guestName, guestEmail]);

  const formatDate = (iso) => new Date(iso).toLocaleString();

  const respondToInvite = async (rsvpStatus) => {
    if (!invitation?.invitationId) return;
    setSubmitting(true);

    try {
      await api.post('/invitations/respond', {
        invitationId: invitation.invitationId,
        rsvpStatus,
      });

      setInvitation({
        ...invitation,
        rsvpStatus,
        respondedAt: new Date().toISOString(),
      });

      setResponseSuccess(`RSVP updated to: ${rsvpStatus}`);
      setTimeout(() => setResponseSuccess(''), 3000);
    } catch (err) {
      alert('Failed to update RSVP.');
    } finally {
      setSubmitting(false);
    }
  };

  const isCurrent = (val) => invitation?.rsvpStatus === val;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Invitation Details
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading invitation...</p>
        ) : error ? (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded text-center">{error}</div>
        ) : (
          <div className="bg-white shadow rounded-xl p-6 border border-gray-100 space-y-3">
            <p><strong>Guest Name:</strong> {invitation.guestName}</p>
            <p><strong>Email:</strong> {invitation.guestEmail || 'Not provided'}</p>
            <p><strong>Phone:</strong> {invitation.guestPhone || 'Not provided'}</p>
            <p><strong>RSVP Status:</strong> {invitation.rsvpStatus}</p>
            <p><strong>Sent At:</strong> {formatDate(invitation.invitationSentAt)}</p>
            <p><strong>Responded At:</strong> {invitation.respondedAt ? formatDate(invitation.respondedAt) : 'Not yet responded'}</p>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">Update your RSVP:</h4>
              <div className="flex gap-3 flex-wrap">
                <button
                  disabled={submitting}
                  onClick={() => respondToInvite('YES')}
                  className={`px-4 py-2 rounded text-sm text-white ${
                    isCurrent('YES') ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  Yes
                </button>
                <button
                  disabled={submitting}
                  onClick={() => respondToInvite('NO')}
                  className={`px-4 py-2 rounded text-sm text-white ${
                    isCurrent('NO') ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  No
                </button>
                <button
                  disabled={submitting}
                  onClick={() => respondToInvite('MAYBE')}
                  className={`px-4 py-2 rounded text-sm text-white ${
                    isCurrent('MAYBE') ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                >
                  Maybe
                </button>
              </div>
            </div>

            {responseSuccess && (
              <div className="mt-4 text-green-600 text-sm font-medium">{responseSuccess}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitationDetails;

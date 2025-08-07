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

  const formatDate = (iso) => {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

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

  const getRSVPColor = (status) => {
    switch (status) {
      case 'YES': return 'bg-emerald-500';
      case 'NO': return 'bg-red-500';
      case 'MAYBE': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };

  const getRSVPStatusDisplay = (status) => {
    switch (status) {
      case 'YES': return 'Attending';
      case 'NO': return 'Not Attending';
      case 'MAYBE': return 'Maybe Attending';
      default: return 'Not Responded';
    }
  };

  const isCurrent = (val) => invitation?.rsvpStatus === val;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Invitation Details
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary-500 animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Loading invitation...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 px-5 py-4 rounded-2xl text-center border border-red-100 shadow-sm">
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white shadow-ios rounded-ios-xl p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-gray-900">{invitation.guestName}</h2>
                <div className={`${getRSVPColor(invitation.rsvpStatus)} px-3 py-1 rounded-full text-xs text-white font-medium`}>
                  {getRSVPStatusDisplay(invitation.rsvpStatus)}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="text-xs text-gray-500 font-medium mb-1">Email</div>
                    <div className="text-gray-700">{invitation.guestEmail || 'Not provided'}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="text-xs text-gray-500 font-medium mb-1">Phone</div>
                    <div className="text-gray-700">{invitation.guestPhone || 'Not provided'}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="text-xs text-gray-500 font-medium mb-1">Sent At</div>
                    <div className="text-gray-700">{formatDate(invitation.invitationSentAt)}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="text-xs text-gray-500 font-medium mb-1">Response Date</div>
                    <div className="text-gray-700">
                      {invitation.respondedAt ? formatDate(invitation.respondedAt) : 'Not yet responded'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-ios rounded-ios-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Update your RSVP</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  disabled={submitting}
                  onClick={() => respondToInvite('YES')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl ${
                    isCurrent('YES') 
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-200' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-200'
                  } transition-all duration-200`}
                >
                  <svg className="w-7 h-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Yes</span>
                </button>
                
                <button
                  disabled={submitting}
                  onClick={() => respondToInvite('MAYBE')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl ${
                    isCurrent('MAYBE') 
                      ? 'bg-amber-500 text-white ring-2 ring-amber-200' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-200'
                  } transition-all duration-200`}
                >
                  <svg className="w-7 h-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Maybe</span>
                </button>
                
                <button
                  disabled={submitting}
                  onClick={() => respondToInvite('NO')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl ${
                    isCurrent('NO') 
                      ? 'bg-red-500 text-white ring-2 ring-red-200' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200'
                  } transition-all duration-200`}
                >
                  <svg className="w-7 h-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm font-medium">No</span>
                </button>
              </div>
            </div>

            {responseSuccess && (
              <div className="bg-primary-50 text-primary-600 px-5 py-4 rounded-xl text-center border border-primary-100 shadow-sm animate-fade-in">
                <svg className="w-5 h-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{responseSuccess}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitationDetails;

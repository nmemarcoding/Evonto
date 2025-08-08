import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/apiService';
import Navbar from '../components/Navbar';

function InvitationDetails() {
  const [searchParams] = useSearchParams();
  const [invitation, setInvitation] = useState(null);
  const [event, setEvent] = useState(null);
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

        // The response now contains both event and invitation
        const { event: eventData, invitation: invitationData } = response.data;
        
        // Ensure we handle the event data properly, including the new hostUsername field
        setEvent({
          ...eventData,
          hostUsername: eventData.hostUsername || null
        });
        setInvitation(invitationData);
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

      setResponseSuccess(`RSVP updated to: ${getRSVPStatusDisplay(rsvpStatus)}`);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            You're Invited!
          </h1>
          <p className="text-gray-600 mt-2">
            {invitation?.guestName ? `Hello ${invitation.guestName}, please respond to your invitation below` : 'Please respond to your invitation below'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-primary-500 animate-spin mb-6"></div>
              <p className="text-gray-600 font-medium">Loading your invitation...</p>
              <p className="text-gray-400 text-sm mt-2">Just a moment please</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 px-6 py-8 rounded-2xl text-center border border-red-100 shadow-sm max-w-md mx-auto mt-8">
            <div className="bg-red-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Something went wrong</h3>
            <p className="text-red-600">{error}</p>
            <p className="text-gray-600 text-sm mt-4">Please check your invitation link and try again</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Event Details Section */}
            {event && (
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                {/* Event Banner/Header */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold">{event.title}</h2>
                    
                    {/* Event Status */}
                    {(() => {
                      const now = new Date();
                      const start = new Date(event.startDateTime);
                      const end = new Date(event.endDateTime);
                      let statusClass = '';
                      let statusText = '';
                      
                      if (now < start) {
                        statusClass = 'bg-blue-100 text-blue-800';
                        statusText = 'Upcoming';
                      } else if (now >= start && now <= end) {
                        statusClass = 'bg-green-100 text-green-800';
                        statusText = 'In Progress';
                      } else {
                        statusClass = 'bg-gray-100 text-gray-800';
                        statusText = 'Past';
                      }
                      
                      return (
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusClass} self-start`}>
                          {statusText}
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Host badge in header */}
                  {event.hostUsername && (
                    <div className="flex items-center mt-1">
                      <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium inline-flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Hosted by {event.hostUsername}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  {/* Date and Time */}
                  <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-xl">
                    <div className="bg-primary-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">When</p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(event.startDateTime)}
                      </p>
                      <p className="text-xs text-gray-600">
                        to {formatDate(event.endDateTime)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Location */}
                  {event.location && (
                    <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-xl">
                      <div className="bg-primary-100 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Where</p>
                        <p className="text-sm font-medium text-gray-800">{event.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Description */}
                  {event.description && (
                    <div className="mb-4 mt-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">About This Event</h3>
                      <p className="text-gray-600 text-sm whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100">{event.description}</p>
                    </div>
                  )}
                  
                  {/* Host Information */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-xl">
                      <div className="bg-primary-100 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Host</p>
                        <p className="text-sm font-medium text-gray-800">{event.hostUsername || 'Event Organizer'}</p>
                        <p className="text-xs text-gray-600">Created on {new Date(event.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* RSVP Section - Moved up for better user flow */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 mb-6">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Your Response</h3>
                  <div className={`${getRSVPColor(invitation.rsvpStatus)} px-3 py-1 rounded-full text-xs text-white font-medium`}>
                    {getRSVPStatusDisplay(invitation.rsvpStatus)}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-4">
                    {invitation.respondedAt 
                      ? "You've already responded, but you can update your RSVP below:" 
                      : "Please let the host know if you can attend:"}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <button
                    disabled={submitting}
                    onClick={() => respondToInvite('YES')}
                    className={`flex flex-col items-center justify-center p-5 rounded-xl ${
                      isCurrent('YES') 
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-200' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-200'
                    } transition-all duration-200`}
                  >
                    <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Yes</span>
                    <span className="text-xs mt-1">{isCurrent('YES') ? 'Attending' : ''}</span>
                  </button>
                  
                  <button
                    disabled={submitting}
                    onClick={() => respondToInvite('MAYBE')}
                    className={`flex flex-col items-center justify-center p-5 rounded-xl ${
                      isCurrent('MAYBE') 
                        ? 'bg-amber-500 text-white ring-2 ring-amber-200' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-200'
                    } transition-all duration-200`}
                  >
                    <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Maybe</span>
                    <span className="text-xs mt-1">{isCurrent('MAYBE') ? 'Possibly' : ''}</span>
                  </button>
                  
                  <button
                    disabled={submitting}
                    onClick={() => respondToInvite('NO')}
                    className={`flex flex-col items-center justify-center p-5 rounded-xl ${
                      isCurrent('NO') 
                        ? 'bg-red-500 text-white ring-2 ring-red-200' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200'
                    } transition-all duration-200`}
                  >
                    <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm font-medium">No</span>
                    <span className="text-xs mt-1">{isCurrent('NO') ? 'Cannot attend' : ''}</span>
                  </button>
                </div>
                
                {invitation.respondedAt && (
                  <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500">
                      Last responded: {formatDate(invitation.respondedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Invitation Details Section */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">Your Invitation Details</h3>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 text-lg font-bold">{invitation.guestName?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{invitation.guestName}</h4>
                      <p className="text-sm text-gray-500">Invited Guest</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start">
                    <div className="mr-3 text-gray-400 mt-0.5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-1">Email Address</div>
                      <div className="text-gray-700 text-sm">{invitation.guestEmail || 'Not provided'}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start">
                    <div className="mr-3 text-gray-400 mt-0.5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-1">Phone Number</div>
                      <div className="text-gray-700 text-sm">{invitation.guestPhone || 'Not provided'}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start">
                    <div className="mr-3 text-gray-400 mt-0.5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-1">Invitation Sent</div>
                      <div className="text-gray-700 text-sm">{formatDate(invitation.invitationSentAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {responseSuccess && (
              <div className="bg-emerald-50 mt-6 text-emerald-700 p-5 rounded-xl text-center border border-emerald-100 shadow-sm animate-fade-in relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 opacity-30 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="bg-white rounded-full w-10 h-10 mx-auto flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium mb-1">Thank You!</h4>
                  <p className="font-medium">{responseSuccess}</p>
                  <p className="text-sm text-emerald-600 mt-2">Your response has been saved</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-8 text-gray-500 text-xs">
          <p>Powered by Evonto • Event Management System</p>
        </div>
      </div>
    </div>
  );
}

export default InvitationDetails;

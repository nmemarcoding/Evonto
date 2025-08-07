import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/apiService';
import Navbar from '../components/Navbar';
import InviteGuestModal from '../components/InviteGuestModal';

function EventDetails() {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState('all');
  const navigate = useNavigate();

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

  const formatDate = (iso) => {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

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

  const getRsvpStatusColor = (status) => {
    switch (status) {
      case 'YES': return 'bg-emerald-100 text-emerald-600';
      case 'NO': return 'bg-red-100 text-red-600';
      case 'MAYBE': return 'bg-amber-100 text-amber-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getRsvpStatusDisplay = (status) => {
    switch (status) {
      case 'YES': return 'Attending';
      case 'NO': return 'Declined';
      case 'MAYBE': return 'Maybe';
      default: return 'Pending';
    }
  };

  const getEventStatus = () => {
    if (!event) return {};
    
    const now = new Date();
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);

    if (now < start) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-primary-100 text-primary-600' };
    } else if (now > end) {
      return { status: 'past', label: 'Past', color: 'bg-gray-100 text-gray-600' };
    } else {
      return { status: 'ongoing', label: 'In Progress', color: 'bg-emerald-100 text-emerald-600' };
    }
  };

  const countResponses = () => {
    if (!invitations.length) return { yes: 0, no: 0, maybe: 0, pending: 0 };
    
    return invitations.reduce((acc, inv) => {
      if (inv.rsvpStatus === 'YES') acc.yes++;
      else if (inv.rsvpStatus === 'NO') acc.no++;
      else if (inv.rsvpStatus === 'MAYBE') acc.maybe++;
      else acc.pending++;
      return acc;
    }, { yes: 0, no: 0, maybe: 0, pending: 0 });
  };

  const responseStats = countResponses();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary-500 animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Loading event details...</p>
            </div>
          </div>
        ) : event ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventStatus().color}`}>
                    {getEventStatus().label}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{event.title}</h2>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <button 
                  onClick={() => navigate('/my-events')}
                  className="px-3 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to My Events
                </button>
              </div>
            </div>
            
            <div className="bg-white shadow-ios rounded-ios-xl mb-8">
              <div className="p-6">
                <p className="text-gray-600 mb-6">{event.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-start">
                    <div className="bg-primary-100 rounded-xl p-2 mr-3">
                      <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Start Time</p>
                      <p className="text-gray-900 font-medium">{formatDate(event.startDateTime)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-start">
                    <div className="bg-primary-100 rounded-xl p-2 mr-3">
                      <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">End Time</p>
                      <p className="text-gray-900 font-medium">{formatDate(event.endDateTime)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-start">
                    <div className="bg-primary-100 rounded-xl p-2 mr-3">
                      <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Location</p>
                      <p className="text-gray-900 font-medium">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Response Summary</h3>
                  <button 
                    onClick={() => setShowInviteModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center shadow-sm transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Invite Guest
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">{responseStats.yes}</div>
                    <div className="text-xs text-gray-500 font-medium">Attending</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-1">{responseStats.maybe}</div>
                    <div className="text-xs text-gray-500 font-medium">Maybe</div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">{responseStats.no}</div>
                    <div className="text-xs text-gray-500 font-medium">Declined</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-500 mb-1">{responseStats.pending}</div>
                    <div className="text-xs text-gray-500 font-medium">Pending</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-xl font-semibold text-gray-900">Invited Guests</h3>
              <span className="text-sm text-gray-500 mb-4 sm:mb-0">Total: {invitations.length}</span>
            </div>

            {/* Search and filter controls */}
            <div className="bg-white shadow-ios rounded-ios-xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search guests..."
                    className="w-full pl-10 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  value={rsvpFilter}
                  onChange={(e) => setRsvpFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  <option value="all">All Responses</option>
                  <option value="YES">Attending</option>
                  <option value="MAYBE">Maybe</option>
                  <option value="NO">Declined</option>
                  <option value="NO_RESPONSE">Pending</option>
                </select>
              </div>
            </div>

            {copySuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center shadow-ios">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {copySuccess}
              </div>
            )}

            {invitations.length === 0 ? (
              <div className="bg-white shadow-ios rounded-ios-xl p-8 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No guests invited yet</h3>
                <p className="text-gray-500 mb-6">
                  Start inviting guests to your event
                </p>
                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl shadow-ios transition-colors inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Invite Your First Guest
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {invitations
                  .filter(guest => {
                    // Apply search filter
                    const searchLower = searchTerm.toLowerCase();
                    const matchesSearch = 
                      guest.guestName?.toLowerCase().includes(searchLower) ||
                      guest.guestEmail?.toLowerCase().includes(searchLower) ||
                      guest.guestPhone?.toLowerCase().includes(searchLower);
                    
                    // Apply RSVP status filter
                    const matchesRsvp = rsvpFilter === 'all' || guest.rsvpStatus === rsvpFilter;
                    
                    return matchesSearch && matchesRsvp;
                  })
                  .map((guest) => {
                    const statusColor = getRsvpStatusColor(guest.rsvpStatus);
                    const statusText = getRsvpStatusDisplay(guest.rsvpStatus);
                  
                  return (
                    <div
                      key={guest.invitationId}
                      className="bg-white shadow-ios rounded-ios-xl p-5 border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-base font-semibold text-gray-900">{guest.guestName}</h4>
                          <p className="text-sm text-gray-500">
                            {guest.guestEmail && 
                              <span className="inline-flex items-center mr-3">
                                <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {guest.guestEmail}
                              </span>
                            }
                            {guest.guestPhone && 
                              <span className="inline-flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {guest.guestPhone}
                              </span>
                            }
                          </p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                          {statusText}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-3 space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Invitation Sent:</span>
                          <span className="text-gray-700 font-medium">{formatDate(guest.invitationSentAt)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Response:</span>
                          <span className="text-gray-700 font-medium">
                            {guest.respondedAt ? formatDate(guest.respondedAt) : 'Not yet'}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <a
                          href={`/invitation?eventId=${eventId}&guestName=${encodeURIComponent(
                            guest.guestName
                          )}${guest.guestEmail ? `&guestEmail=${encodeURIComponent(guest.guestEmail)}` : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-primary-50 text-primary-600 text-sm font-medium rounded-xl hover:bg-primary-100 transition-colors text-center flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </a>
                        <button
                          onClick={() => handleCopyLink(guest)}
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors text-center flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                          Copy Link
                        </button>
                      </div>
                    </div>
                  );
                })}
                {invitations.length > 0 && invitations.filter(guest => {
                  const searchLower = searchTerm.toLowerCase();
                  const matchesSearch = 
                    guest.guestName?.toLowerCase().includes(searchLower) ||
                    guest.guestEmail?.toLowerCase().includes(searchLower) ||
                    guest.guestPhone?.toLowerCase().includes(searchLower);
                  
                  const matchesRsvp = rsvpFilter === 'all' || guest.rsvpStatus === rsvpFilter;
                  
                  return matchesSearch && matchesRsvp;
                }).length === 0 && (
                  <div className="col-span-full bg-white shadow-ios rounded-ios-xl p-8 text-center">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No guests found</h3>
                    <p className="text-gray-500 mb-4">
                      No guests match your current search and filter criteria
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl flex items-center text-sm hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Clear Search
                        </button>
                      )}
                      {rsvpFilter !== 'all' && (
                        <button
                          onClick={() => setRsvpFilter('all')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl flex items-center text-sm hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white shadow-ios rounded-ios-xl p-10 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Event not found</h3>
            <p className="text-gray-500 mb-6">
              This event may have been deleted or you don't have permission to view it
            </p>
            <button 
              onClick={() => navigate('/my-events')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl shadow-ios transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to My Events
            </button>
          </div>
        )}
      </div>
      
      {/* Invite Guest Modal */}
      {showInviteModal && (
        <InviteGuestModal 
          eventId={eventId} 
          onClose={() => {
            setShowInviteModal(false);
            fetchEventDetails(); // Refresh the guest list
          }} 
        />
      )}
    </div>
  );
}

export default EventDetails;

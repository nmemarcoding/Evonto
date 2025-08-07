// src/components/InviteGuestModal.js
import React, { useState, useEffect } from 'react';
import api from '../services/apiService';

function InviteGuestModal({ eventId, onClose }) {
  const [form, setForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [existingInvitations, setExistingInvitations] = useState([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);

  // Animation effect
  useEffect(() => {
    setAnimateIn(true);
    document.body.style.overflow = 'hidden';
    
    // Fetch existing invitations to check for duplicates client-side
    fetchExistingInvitations();
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  // Fetch existing invitations for this event
  const fetchExistingInvitations = async () => {
    setIsLoadingInvitations(true);
    try {
      const response = await api.post('/invitations/list', { 
        eventId: eventId.toString() 
      });
      setExistingInvitations(response.data || []);
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Check if guest is already invited based on name or email
  const isAlreadyInvited = (name, email) => {
    if (isLoadingInvitations) return false;
    
    const normalizedName = name.trim().toLowerCase();
    const normalizedEmail = email?.trim().toLowerCase();
    
    return existingInvitations.some(invitation => {
      const existingName = invitation.guestName?.toLowerCase();
      const existingEmail = invitation.guestEmail?.toLowerCase();
      
      // Check for duplicate by name (case insensitive)
      if (existingName === normalizedName) {
        return true;
      }
      
      // If email is provided, also check for duplicate by email
      if (normalizedEmail && existingEmail === normalizedEmail) {
        return true;
      }
      
      return false;
    });
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // ✅ Custom validation: guestName required + email OR phone
    if (!form.guestName.trim()) {
      setErrorMsg('Guest name is required.');
      setLoading(false);
      return;
    }

    if (!form.guestEmail.trim() && !form.guestPhone.trim()) {
      setErrorMsg('You must provide either an email or phone number.');
      setLoading(false);
      return;
    }
    
    // Client-side check for duplicate invitations
    if (isAlreadyInvited(form.guestName, form.guestEmail)) {
      setErrorMsg('This guest has already been invited to this event.');
      setLoading(false);
      return;
    }
    
    // Ensure email is never empty string but null if not provided
    // This helps the backend distinguish between "no email" and "empty email"
    const formData = { ...form };
    if (formData.guestEmail.trim() === '') {
      formData.guestEmail = null;
    }
    if (formData.guestPhone.trim() === '') {
      formData.guestPhone = null;
    }

    try {
      const payload = {
        ...formData, // Use formData with properly formatted null values
        eventId: eventId.toString(),
      };
      const response = await api.post('/invitations/send', payload);
      setSuccessMsg('Invitation sent successfully!');
      setForm({ guestName: '', guestEmail: '', guestPhone: '' });
      
      // Refresh the invitations list
      fetchExistingInvitations();
    } catch (error) {
      console.error('Invitation failed:', error);
      
      // Check for specific error responses
      if (error.response) {
        const responseData = error.response.data;
        if (typeof responseData === 'string' && responseData.includes('Guest already invited')) {
          setErrorMsg('This guest has already been invited to this event.');
        } else if (error.response.status === 400) {
          setErrorMsg('This guest has already been invited to this event.');
        } else {
          setErrorMsg('Failed to send invitation. Please try again.');
        }
      } else {
        setErrorMsg('Failed to send invitation. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 transition-opacity duration-300"
      style={{ opacity: animateIn ? 1 : 0 }}
      onClick={handleClose}
    >
      <div 
        className={`bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-ios-lg sm:mb-0 mb-0 transition-transform duration-300 ${animateIn ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal handle for mobile */}
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden"></div>
        
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Invite Guest</h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-5 text-sm flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl mb-5 text-sm flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </div>
        )}

        {isLoadingInvitations && (
          <div className="bg-gray-50 border border-gray-100 text-gray-600 px-4 py-3 rounded-2xl mb-5 text-sm flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading guest information...
          </div>
        )}
        
        <form onSubmit={handleInvite} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 ml-1">
              Guest Name
            </label>
            <input
              id="guestName"
              type="text"
              name="guestName"
              placeholder="Full name"
              value={form.guestName}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition placeholder-gray-400"
              disabled={isLoadingInvitations}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 ml-1">
              Email (optional if phone provided)
            </label>
            <input
              id="guestEmail"
              type="email"
              name="guestEmail"
              placeholder="email@example.com"
              value={form.guestEmail}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition placeholder-gray-400"
              disabled={isLoadingInvitations}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 ml-1">
              Phone (optional if email provided)
            </label>
            <input
              id="guestPhone"
              type="text"
              name="guestPhone"
              placeholder="(123) 456-7890"
              value={form.guestPhone}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition placeholder-gray-400"
              disabled={isLoadingInvitations}
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading || isLoadingInvitations}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-semibold hover:bg-primary-700 transition shadow-sm disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteGuestModal;

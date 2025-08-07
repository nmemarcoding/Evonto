// src/components/InviteGuestModal.js
import React, { useState } from 'react';
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    try {
      const payload = {
        ...form,
        eventId: eventId.toString(),
      };
      await api.post('/invitations/send', payload);
      setSuccessMsg('Invitation sent successfully!');
      setForm({ guestName: '', guestEmail: '', guestPhone: '' });
    } catch (error) {
      console.error('Invitation failed:', error);
      setErrorMsg('Failed to send invitation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>
        <h3 className="text-xl font-semibold mb-4 text-center">Invite Guest</h3>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl mb-3 text-sm text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl mb-3 text-sm text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleInvite} className="space-y-4">
          <input
            type="text"
            name="guestName"
            placeholder="Guest Name"
            value={form.guestName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="guestEmail"
            placeholder="Guest Email (optional)"
            value={form.guestEmail}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="guestPhone"
            placeholder="Guest Phone (optional)"
            value={form.guestPhone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Invitation'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InviteGuestModal;

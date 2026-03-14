import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';

export interface RegisterEventModalEvent {
  slug: string;
  title: string;
}

interface RegisterEventModalProps {
  event: RegisterEventModalEvent | null;
  onClose: () => void;
}

const GRADUATION_YEARS = Array.from({ length: 40 }, (_, i) => 2024 - i);

export function RegisterEventModal({ event, onClose }: RegisterEventModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    year: '',
    attending: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to API
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleClose = () => {
    onClose();
    // Reset state after modal closes
    setTimeout(() => {
      setForm({ name: '', email: '', location: '', year: '', attending: '' });
      setSubmitted(false);
    }, 300);
  };

  return (
    <Modal isOpen={!!event} onClose={handleClose} title="Register Event">
      {submitted ? (
        <div className="text-center py-8">
          <Icon icon="mdi:check-circle" className="w-14 h-14 text-primary-500 mx-auto mb-4" />
          <h3 className="text-gray-900 font-bold text-lg mb-2">Registration Successful!</h3>
          <p className="text-gray-500 text-sm mb-6">
            You have successfully registered for{' '}
            <span className="font-semibold">{event?.title}</span>.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-8 py-2.5 rounded-full transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-primary-400 transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Email Address
            </label>
            <input
              type="email"
              required
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-primary-400 transition-colors"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="Enter your location"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-primary-400 transition-colors"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Graduation Year
            </label>
            <div className="relative">
              <select
                value={form.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-700 outline-none focus:border-primary-400 cursor-pointer transition-colors"
              >
                <option value="">All Years</option>
                {GRADUATION_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <Icon
                icon="mdi:chevron-down"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Attending */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Will you be coming for the event?
            </label>
            <div className="flex items-center gap-6">
              {[
                { value: 'yes', label: 'YES, I will' },
                { value: 'no', label: 'NO I will . not' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="attending"
                    value={opt.value}
                    checked={form.attending === opt.value}
                    onChange={() => handleChange('attending', opt.value)}
                    className="w-5 h-5 accent-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-3 rounded-full transition-colors"
          >
            Register Event
          </button>
        </form>
      )}
    </Modal>
  );
}

// features/donation/pages/DonationPage.tsx

import { toast } from '@/shared/components/ui/Toast';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import DonationImage from '/donation-image.png';
import { useLocation } from 'react-router-dom';

export function DonationPage() {
  const copyToClipboard = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied successfully');
    } catch (err) {
      toast.error('Failed to copy');
      console.error('Copy failed', err);
    }
  };

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Make a Donation</h1>

      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT CARD */}
        <div className="bg-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
          <p className="text-gray-600 leading-relaxed mb-6">
            Give back and help create opportunities that benefit alumnae and the wider community.
            Your contribution helps support members, fund initiatives, and strengthen our community.
          </p>

          {/* Bank Name */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Bank Name</p>
            <p className="text-lg font-semibold text-gray-900">Guarantee Trust Bank</p>
          </div>

          {/* Account Number */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Number</p>
              <p className="text-lg font-semibold text-gray-900">0250037225</p>
            </div>

            <button
              onClick={() => copyToClipboard('0250037225', 'account')}
              className="p-2 rounded-lg hover:bg-gray-200 transition"
            >
              <Icon icon="mdi:content-copy" className="w-5 h-5 text-blue-600" />
            </button>
          </div>

          {/* Account Name */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Name</p>
              <p className="text-lg font-semibold text-gray-900">FGGC Alumnae Lagos</p>
            </div>

            <button
              onClick={() => copyToClipboard('FGGC Alumnae Lagos', 'name')}
              className="p-2 rounded-lg hover:bg-gray-200 transition"
            >
              <Icon icon="mdi:content-copy" className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center lg:justify-end">
          <img
            src={DonationImage}
            alt="Donation Illustration"
            className="w-[260px] sm:w-[320px] lg:w-[360px] h-auto"
          />
        </div>
      </div>
    </section>
  );
}

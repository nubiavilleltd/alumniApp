import type { OpenPaymentOptions, PaymentGateway } from './payment.interface';

// Paystack injects PaystackPop onto window via their CDN script.
// We declare it here so TypeScript is happy.
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        access_code: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string;

export const paystackGateway: PaymentGateway = {
  openPayment(options: OpenPaymentOptions) {
    if (!window.PaystackPop) {
      console.error('Paystack script not loaded.');
      return;
    }
    window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: options.email,
      amount: options.amount * 100,   // Naira → kobo
      ref: options.reference,
      access_code: options.accessCode,
      callback: (response) => options.onSuccess(response.reference),
      onClose: options.onClose,
    }).openIframe();
  },
};
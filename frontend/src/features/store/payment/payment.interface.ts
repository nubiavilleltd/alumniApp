// ─── Gateway-agnostic interface ───────────────────────────────────────────────
// Swap the provider (Paystack → Flutterwave etc.) by changing usePaymentGateway
// without touching any checkout or hook code.

export interface OpenPaymentOptions {
  email: string;
  amount: number;       // in Naira — provider converts to kobo internally
  reference: string;
  accessCode: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export interface PaymentGateway {
  openPayment: (options: OpenPaymentOptions) => void;
}
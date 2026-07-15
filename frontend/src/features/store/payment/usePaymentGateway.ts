// Single import point — swap provider here to change gateway globally
import { paystackGateway } from './paystack.provider';
import type { OpenPaymentOptions } from './payment.interface';

export function usePaymentGateway() {
  return {
    openPayment: (options: OpenPaymentOptions) => paystackGateway.openPayment(options),
  };
}
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/shared/components/ui/Toast';
import { addressService } from '../services/address.service';
import { useCart } from './useCart';
import type { CheckoutPayload } from '../types/address.types';
import { usePaymentGateway } from '../payment/usePaymentGateway';

export function useCheckout() {
  const { clearCart } = useCart();
  const { openPayment } = usePaymentGateway();

  const initiate = useMutation({
    mutationFn: (payload: CheckoutPayload) => addressService.initiateCheckout(payload),
    onError: (error: any) => toast.fromError(error),
  });

  const verify = useMutation({
    mutationFn: (reference: string) => addressService.verifyPayment(reference),
    onSuccess: () => {
      void clearCart();
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => toast.fromError(error),
  });

  const checkout = async (payload: CheckoutPayload, userEmail: string) => {
    const checkoutData = await initiate.mutateAsync(payload);
    openPayment({
      email: userEmail,
      amount: checkoutData.amount,
      reference: checkoutData.reference,
      accessCode: checkoutData.accessCode,
      onSuccess: (reference) => void verify.mutateAsync(reference),
      onClose: () => toast.info('Payment cancelled.'),
    });
  };

  return {
    checkout,
    isInitiating: initiate.isPending,
    isVerifying: verify.isPending,
    isLoading: initiate.isPending || verify.isPending,
  };
}
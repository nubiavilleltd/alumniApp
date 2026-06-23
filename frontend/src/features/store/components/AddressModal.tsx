import { useForm } from 'react-hook-form';
import { Modal } from '@/shared/components/ui/Modal';
import Button from '@/shared/components/ui/Button';
import { useCheckoutStore } from '../stores/useCheckoutStore';
import type { ShippingAddress } from '../types/address.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddressModal({ isOpen, onClose }: Props) {
  const setAddress = useCheckoutStore(
    (s) => s.setShippingAddress,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddress>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      altPhone: '',
      address: '',
      landmark: '',
      state: '',
      area: '',
    },
  });

  const onSubmit = (data: ShippingAddress) => {
    const payload = {
      ...data,
      id: crypto.randomUUID(),
    };

    setAddress(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shipping Address"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* NAME */}
        <div className="grid grid-cols-2 gap-3">
          <input
            {...register('firstName', {
              required: true,
            })}
            placeholder="First Name"
            className="border p-2 rounded"
          />

          <input
            {...register('lastName', {
              required: true,
            })}
            placeholder="Last Name"
            className="border p-2 rounded"
          />
        </div>

        {/* PHONE */}
        <input
          {...register('phone', { required: true })}
          placeholder="Phone Number"
          className="border p-2 rounded w-full"
        />

        <input
          {...register('altPhone')}
          placeholder="Alternative Phone"
          className="border p-2 rounded w-full"
        />

        {/* ADDRESS */}
        <textarea
          {...register('address', {
            required: true,
          })}
          placeholder="Full Address"
          className="border p-2 rounded w-full"
        />

        <input
          {...register('landmark')}
          placeholder="Landmark"
          className="border p-2 rounded w-full"
        />

        {/* STATE + AREA */}
        <div className="grid grid-cols-2 gap-3">
          <input
            {...register('state', {
              required: true,
            })}
            placeholder="State"
            className="border p-2 rounded"
          />

          <input
            {...register('area', {
              required: true,
            })}
            placeholder="Area"
            className="border p-2 rounded"
          />
        </div>

        <Button type="submit" className="w-full">
          Add Address
        </Button>
      </form>
    </Modal>
  );
}
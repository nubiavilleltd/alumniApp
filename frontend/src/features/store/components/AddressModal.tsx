// import { useForm } from 'react-hook-form';
// import { Modal } from '@/shared/components/ui/Modal';
// import Button from '@/shared/components/ui/Button';
// import { useCheckoutStore } from '../stores/useCheckoutStore';
// import type { ShippingAddress } from '../types/address.types';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function AddressModal({ isOpen, onClose }: Props) {
//   const setAddress = useCheckoutStore(
//     (s) => s.setShippingAddress,
//   );

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ShippingAddress>({
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       phone: '',
//       altPhone: '',
//       address: '',
//       landmark: '',
//       state: '',
//       area: '',
//     },
//   });

//   const onSubmit = (data: ShippingAddress) => {
//     const payload = {
//       ...data,
//       id: crypto.randomUUID(),
//     };

//     setAddress(payload);
//     onClose();
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Shipping Address"
//     >
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="space-y-4"
//       >
//         {/* NAME */}
//         <div className="grid grid-cols-2 gap-3">
//           <input
//             {...register('firstName', {
//               required: true,
//             })}
//             placeholder="First Name"
//             className="border p-2 rounded"
//           />

//           <input
//             {...register('lastName', {
//               required: true,
//             })}
//             placeholder="Last Name"
//             className="border p-2 rounded"
//           />
//         </div>

//         {/* PHONE */}
//         <input
//           {...register('phone', { required: true })}
//           placeholder="Phone Number"
//           className="border p-2 rounded w-full"
//         />

//         <input
//           {...register('altPhone')}
//           placeholder="Alternative Phone"
//           className="border p-2 rounded w-full"
//         />

//         {/* ADDRESS */}
//         <textarea
//           {...register('address', {
//             required: true,
//           })}
//           placeholder="Full Address"
//           className="border p-2 rounded w-full"
//         />

//         <input
//           {...register('landmark')}
//           placeholder="Landmark"
//           className="border p-2 rounded w-full"
//         />

//         {/* STATE + AREA */}
//         <div className="grid grid-cols-2 gap-3">
//           <input
//             {...register('state', {
//               required: true,
//             })}
//             placeholder="State"
//             className="border p-2 rounded"
//           />

//           <input
//             {...register('area', {
//               required: true,
//             })}
//             placeholder="Area"
//             className="border p-2 rounded"
//           />
//         </div>

//         <Button type="submit" className="w-full">
//           Add Address
//         </Button>
//       </form>
//     </Modal>
//   );
// }








import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/shared/components/ui/Modal';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import Button from '@/shared/components/ui/Button';
import { useCheckoutStore } from '../stores/useCheckoutStore';
import { MOCK_SHIPPING_RATES } from '../mock/shippingRates.mock';
import type { ShippingAddress } from '../types/address.types';

// ─── Validation schema ────────────────────────────────────────────────────────
const addressSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  phone: z
    .string()
    .trim()
    .regex(/^0[789][01]\d{8}$/, 'Enter a valid 11-digit Nigerian phone number'),
  altPhone: z
    .string()
    .trim()
    .regex(/^(0[789][01]\d{8})?$/, 'Enter a valid 11-digit Nigerian phone number or leave blank')
    .optional(),
  address: z.string().trim().min(5, 'Please enter a valid delivery address'),
  landmark: z.string().trim().optional(),
  state: z.string().min(1, 'Please select a state'),
  area: z.string().min(1, 'Please select an area'),
});

type AddressFormValues = z.infer<typeof addressSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AddressModal({ isOpen, onClose }: Props) {
  const { setShippingAddress, shippingAddress } = useCheckoutStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
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

  // Pre-fill when editing an existing address
  useEffect(() => {
    if (isOpen && shippingAddress) {
      reset({
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        phone: shippingAddress.phone,
        altPhone: shippingAddress.altPhone ?? '',
        address: shippingAddress.address,
        landmark: shippingAddress.landmark ?? '',
        state: shippingAddress.state,
        area: shippingAddress.area,
      });
    } else if (isOpen) {
      reset({
        firstName: '',
        lastName: '',
        phone: '',
        altPhone: '',
        address: '',
        landmark: '',
        state: '',
        area: '',
      });
    }
  }, [isOpen, shippingAddress, reset]);

  const selectedState = watch('state');

  // Reset area when state changes
  useEffect(() => {
    setValue('area', '', { shouldValidate: false });
  }, [selectedState, setValue]);

  // ── Option lists ───────────────────────────────────────────────────────────
  const stateOptions = MOCK_SHIPPING_RATES.map((s) => ({
    label: s.state,
    value: s.state,
  }));

  const areaOptions =
    MOCK_SHIPPING_RATES.find((s) => s.state === selectedState)?.areas.map((a) => ({
      label: `${a.area} — ₦${a.fee.toLocaleString()}`,
      value: a.area,
    })) ?? [];

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = (data: AddressFormValues) => {
    const payload: ShippingAddress = {
      ...data,
      altPhone: data.altPhone || undefined,
      landmark: data.landmark || undefined,
      id: shippingAddress?.id ?? crypto.randomUUID(),
    };
    setShippingAddress(payload);
    onClose();
  };

  const isEditing = !!shippingAddress;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Change Address' : 'Add Address'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            id="firstName"
            required
            placeholder="Enter your first name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <FormInput
            label="Last Name"
            id="lastName"
            required
            placeholder="Enter your last name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        {/* Phone row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Phone Number"
            id="phone"
            required
            placeholder="e.g. 08012345678"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <FormInput
            label="Additional Phone Number"
            id="altPhone"
            placeholder="e.g. 09087654321"
            error={errors.altPhone?.message}
            {...register('altPhone')}
          />
        </div>

        {/* Delivery address */}
        <TextareaInput
          label="Delivery Address"
          id="address"
          required
          rows={3}
          placeholder="Enter your address"
          error={errors.address?.message}
          {...register('address')}
        />

        {/* Landmark */}
        <FormInput
          label="Landmark"
          id="landmark"
          placeholder="Enter landmark"
          error={errors.landmark?.message}
          {...register('landmark')}
        />

        {/* State + Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            label="State"
            id="state"
            required
            options={stateOptions}
            placeholder="Select your state"
            error={errors.state?.message}
            value={selectedState}
            onChange={(e) =>
              setValue('state', e.target.value, { shouldValidate: true, shouldDirty: true })
            }
            onBlur={() => trigger('state')}
          />
          <SelectInput
            label="Area"
            id="area"
            required
            options={areaOptions}
            placeholder={selectedState ? 'Select your area' : 'Select state first'}
            disabled={!selectedState || areaOptions.length === 0}
            error={errors.area?.message}
            value={watch('area')}
            onChange={(e) =>
              setValue('area', e.target.value, { shouldValidate: true, shouldDirty: true })
            }
            onBlur={() => trigger('area')}
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Add Address'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
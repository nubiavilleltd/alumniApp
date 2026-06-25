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
import { NIGERIA_STATES } from '../constants/nigerianStates';
import { getAreasForState, getShippingFee } from '../constants/shippingRates';
import type { ShippingAddress } from '../types/address.types';
import type { NigeriaState } from '../constants/nigerianStates';

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
    .regex(/^(0[789][01]\d{8})?$/, 'Enter a valid 11-digit phone number or leave blank')
    .optional(),
  address: z.string().trim().min(5, 'Please enter a valid delivery address'),
  landmark: z.string().trim().optional(),
  state: z.string().min(1, 'Please select a state'),
  area: z.string().min(1, 'Please select an area'),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

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
      firstName: '', lastName: '', phone: '', altPhone: '',
      address: '', landmark: '', state: '', area: '',
    },
  });

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
        firstName: '', lastName: '', phone: '', altPhone: '',
        address: '', landmark: '', state: '', area: '',
      });
    }
  }, [isOpen, shippingAddress, reset]);

  const selectedState = watch('state');
  const selectedArea = watch('area');

  // Reset area whenever state changes
  useEffect(() => {
    setValue('area', '', { shouldValidate: false });
  }, [selectedState, setValue]);

  // All 37 states
  const stateOptions = NIGERIA_STATES.map((s) => ({ label: s, value: s }));

  // Areas for the selected state — always populated since every state has areas
  const areaOptions = selectedState
    ? getAreasForState(selectedState as NigeriaState).map((a) => ({
        label: a.area,
        value: a.area,
      }))
    : [];

  // Shipping fee hint for the selected area
  const selectedAreaFee =
    selectedState && selectedArea
      ? getShippingFee(selectedState, selectedArea)
      : null;

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
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="First Name" id="firstName" required
            placeholder="Enter your first name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <FormInput
            label="Last Name" id="lastName" required
            placeholder="Enter your last name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        {/* Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Phone Number" id="phone" required
            placeholder="e.g. 08012345678"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <FormInput
            label="Additional Phone Number" id="altPhone"
            placeholder="e.g. 09087654321"
            error={errors.altPhone?.message}
            {...register('altPhone')}
          />
        </div>

        {/* Address */}
        <TextareaInput
          label="Delivery Address" id="address" required rows={3}
          placeholder="Enter your address"
          error={errors.address?.message}
          {...register('address')}
        />

        {/* Landmark */}
        <FormInput
          label="Landmark" id="landmark"
          placeholder="Enter landmark"
          error={errors.landmark?.message}
          {...register('landmark')}
        />

        {/* State + Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            label="State" id="state" required
            options={stateOptions}
            placeholder="Select your state"
            error={errors.state?.message}
            value={selectedState}
            onChange={(e) =>
              setValue('state', e.target.value, { shouldValidate: true, shouldDirty: true })
            }
            onBlur={() => trigger('state')}
          />

          <div className="flex flex-col gap-1">
            <SelectInput
              label="Area" id="area" required
              options={areaOptions}
              placeholder={selectedState ? 'Select your area' : 'Select state first'}
              disabled={!selectedState}
              error={errors.area?.message}
              value={selectedArea}
              onChange={(e) =>
                setValue('area', e.target.value, { shouldValidate: true, shouldDirty: true })
              }
              onBlur={() => trigger('area')}
            />
            {/* Shipping fee hint — shown once area is selected */}
            {selectedAreaFee !== null && selectedArea && (
              <p className="text-xs text-gray-500 mt-0.5">
                Shipping fee:{' '}
                <span className="font-semibold text-primary-600">
                  ₦{selectedAreaFee.toLocaleString()}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Add Address'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
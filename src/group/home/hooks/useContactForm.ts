import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { contactSchema, type ContactFormValues } from '@/schemas/contactSchema';

export function useContactForm() {
  return useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
    mode: 'onTouched',
  });
}

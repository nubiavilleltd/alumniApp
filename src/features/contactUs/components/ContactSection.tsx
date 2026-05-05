import { Icon } from '@iconify/react';
import { useState, type FormEvent } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { BaseInput } from '@/shared/components/ui/input/BaseInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { Button } from '@/shared/components/ui/Button';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { usePrefillFormFromUser } from '@/features/contactUs/hooks/usePrefillFormFromUser';
import type { Contact } from '@/features/contactUs/types/contact.types';

/* ───────────────── TYPES ───────────────── */

interface ContactMethod {
  label: string;
  valueLines: string[];
  icon: string;
  href: string;
  target?: string;
  rel?: string;
}

interface ContactSectionProps {
  title: string;
  description: string;
  contactMethods: ContactMethod[];
  onSubmit: (form: Contact) => Promise<void>;
  isSubmitting: boolean;
}

/* ───────────────── HELPERS ───────────────── */

const initialFormState: Contact = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
};

type ContactFieldErrors = Partial<Record<keyof Contact, string>>;

function validate(form: Contact): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!form.firstName.trim()) errors.firstName = 'First name is required.';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Invalid email.';
  }
  if (!form.message.trim()) errors.message = 'Message is required.';

  return errors;
}

/* ───────────────── COMPONENT ───────────────── */

export function ContactSection({
  title,
  description,
  contactMethods,
  onSubmit,
  isSubmitting,
}: ContactSectionProps) {
  const { data: currentUser, isLoading } = useCurrentUser();

  const [form, setForm] = useState<Contact>(initialFormState);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState('');

  /* Prefill */
  usePrefillFormFromUser<Contact>({
    currentUser,
    setForm,
    mapUserToForm: (user) => ({
      firstName: user.otherNames || user.fullName?.split(' ')[0] || '',
      lastName: user.surname || user.fullName?.split(' ')[1] || '',
      email: user.email || '',
    }),
  });

  const handleChange = <K extends keyof Contact>(field: K, value: Contact[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validation = validate(form);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    try {
      await onSubmit(form);
      setForm(initialFormState);
    } catch (err: any) {
      setFormError(err.message || 'Something went wrong.');
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-page__shell">
        {/* LEFT */}
        <section className="contact-intro">
          <h1 className="contact-intro__title">{title}</h1>
          <p className="contact-intro__copy">{description}</p>

          <div className="contact-intro__details">
            {contactMethods.map((m) => (
              <article key={m.label} className="contact-detail">
                <div className="contact-detail__header">
                  <span className="contact-detail__icon">
                    <Icon icon={m.icon} />
                  </span>
                  <h2 className="contact-detail__label">{m.label}</h2>
                </div>

                <AppLink
                  href={m.href}
                  target={m.target}
                  rel={m.rel}
                  className="contact-detail__value contact-detail__value-link"
                >
                  {m.valueLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </AppLink>
              </article>
            ))}
          </div>
        </section>

        {/* RIGHT */}
        <section className="contact-form-card">
          <form onSubmit={handleSubmit} className="contact-form-card__form">
            <div className="contact-form-card__grid">
              <BaseInput
                value={form.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                label="First Name"
                error={errors.firstName}
                disabled={isSubmitting || isLoading}
              />

              <BaseInput
                value={form.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                label="Last Name"
                error={errors.lastName}
                disabled={isSubmitting || isLoading}
              />

              <BaseInput
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                label="Email"
                type="email"
                className="contact-form-card__field--full"
                error={errors.email}
                disabled={isSubmitting || isLoading}
              />

              <TextareaInput
                value={form.message}
                onChange={(e) => handleChange('message', e.target.value)}
                label="Message"
                className="contact-form-card__field--full"
                error={errors.message}
                disabled={isSubmitting || isLoading}
              />
            </div>

            {formError && <div className="text-red-500">{formError}</div>}

            <Button type="submit" disabled={isSubmitting || isLoading}>
              Send message
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}

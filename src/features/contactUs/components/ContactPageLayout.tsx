import { Icon } from '@iconify/react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { AppLink } from '@/shared/components/ui/AppLink';
import { BaseInput } from '@/shared/components/ui/input/BaseInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import type { Contact } from '@/features/contactUs/types/contact.types';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { usePrefillFormFromUser } from '@/features/contactUs/hooks/usePrefillFormFromUser';
import { toast } from '@/shared/components/ui/Toast';

/* ───────────────── TYPES ───────────────── */

type ContactMethod = {
  label: string;
  valueLines: string[];
  icon: string;
  href: string;
  target?: string;
  rel?: string;
};

interface Props {
  title: string;
  description: string;
  contactMethods: ContactMethod[];
  onSubmit: (form: Contact) => Promise<void>;
  isSubmitting: boolean;
}

/* ───────────────── FORM SETUP ───────────────── */

const initialFormState: Contact = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
};

type ContactFieldErrors = Partial<Record<keyof Contact, string>>;

function validateContactForm(form: Contact): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!form.firstName.trim()) errors.firstName = 'First name is required.';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.message.trim()) errors.message = 'Message is required.';

  return errors;
}

/* ───────────────── COMPONENT ───────────────── */

export function ContactPageLayout({
  title,
  description,
  contactMethods,
  onSubmit,
  isSubmitting,
}: Props) {
  const { data: currentUser, isLoading } = useCurrentUser();

  const [form, setForm] = useState<Contact>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState('');

  usePrefillFormFromUser<Contact>({
    currentUser,
    setForm,
    mapUserToForm: (user) => ({
      firstName: user.otherNames || user.fullName?.split(' ')[0] || '',
      lastName: user.surname || user.fullName?.split(' ')[1] || '',
      email: user.email || '',
    }),
  });

  const handleFieldChange = <K extends keyof Contact>(field: K, value: Contact[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateContactForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setFormError('');
    toast.success('Message successfully sent');

    try {
      await onSubmit(form);
      setForm(initialFormState);
    } catch (error: any) {
      setFormError(error.message ?? 'Unable to send your message right now. Please try again.');
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-page__shell">
        <section className="contact-intro" aria-labelledby="contact-title">
          <h1 id="contact-title" className="contact-intro__title">
            {title}
          </h1>
          <p className="contact-intro__copy">{description}</p>

          <div className="contact-intro__details" aria-label="Contact details">
            {contactMethods.map((method) => (
              <article key={method.label} className="contact-detail">
                <div className="contact-detail__header">
                  <span className="contact-detail__icon" aria-hidden="true">
                    <Icon icon={method.icon} />
                  </span>
                  <h2 className="contact-detail__label">{method.label}</h2>
                </div>
                <AppLink
                  href={method.href}
                  className="contact-detail__value contact-detail__value-link"
                  target={method.target}
                  rel={method.rel}
                  ariaLabel={`${method.label}: ${method.valueLines.join(', ')}`}
                >
                  {method.valueLines.map((line) => (
                    <span key={line} className="contact-detail__line">
                      {line}
                    </span>
                  ))}
                </AppLink>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-form-card" aria-label="Send us a message">
          <img
            className="contact-form-card__arrow"
            src="/contact_arrow.png"
            alt=""
            aria-hidden="true"
          />
          <form className="contact-form-card__form" onSubmit={handleSubmit}>
            <div className="contact-form-card__grid">
              <BaseInput
                value={form.firstName}
                onChange={(event) => handleFieldChange('firstName', event.target.value)}
                label="First Name"
                name="firstName"
                placeholder="Enter your first name"
                autoComplete="given-name"
                error={fieldErrors.firstName}
                required
                disabled={isSubmitting}
              />
              <BaseInput
                value={form.lastName}
                onChange={(event) => handleFieldChange('lastName', event.target.value)}
                label="Last Name"
                name="lastName"
                placeholder="Enter your last name"
                autoComplete="family-name"
                error={fieldErrors.lastName}
                required
                disabled={isSubmitting}
              />
              <BaseInput
                className="contact-form-card__field--full"
                value={form.email}
                onChange={(event) => handleFieldChange('email', event.target.value)}
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                error={fieldErrors.email}
                required
                disabled={isSubmitting}
              />
              <TextareaInput
                className="contact-form-card__field--full"
                value={form.message}
                onChange={(event) => handleFieldChange('message', event.target.value)}
                label="How can we help you?"
                name="message"
                placeholder="Write your message here..."
                rows={6}
                error={fieldErrors.message}
                required
                disabled={isSubmitting}
              />
            </div>

            {formError && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</div>
            )}

            <Button
              type="submit"
              size="lg"
              className="contact-form-card__button"
              disabled={isSubmitting || isLoading}
            >
              Send message
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}

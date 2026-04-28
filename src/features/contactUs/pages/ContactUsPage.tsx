import { Icon } from '@iconify/react';
import { useState, type FormEvent } from 'react';
import { SEO } from '@/shared/common/SEO';
import { Button } from '@/shared/components/ui/Button';
import { BaseInput } from '@/shared/components/ui/input/BaseInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { useSubmitContactForm } from '@/features/contactUs/hooks/useContactUs';
import type { Contact } from '@/features/contactUs/types/contact.types';

const contactMethods = [
  {
    label: 'Find us',
    valueLines: ['123 Alumni Avenue, Victoria Island', 'Lagos, Nigeria'],
    icon: 'mdi:map-marker-outline',
  },
  {
    label: 'Call us',
    valueLines: ['+234 800 000 0000'],
    icon: 'mdi:phone-outline',
  },
  {
    label: 'Email us',
    valueLines: ['alumni@fggcowerri.com'],
    icon: 'mdi:email-outline',
  },
];

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

export function ContactUsPage() {
  const submitContactForm = useSubmitContactForm();
  const [form, setForm] = useState<Contact>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState('');

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

    try {
      await submitContactForm.mutateAsync(form);
      setForm(initialFormState);
    } catch (error: any) {
      setFormError(error.message ?? 'Unable to send your message right now. Please try again.');
    }
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with the FGGC Owerri Alumnae Association for membership, events, and website support."
      />

      <main className="contact-page">
        <div className="contact-page__shell">
          <section className="contact-intro" aria-labelledby="contact-title">
            <h1 id="contact-title" className="contact-intro__title">
              Get in touch with us
            </h1>
            <p className="contact-intro__copy">
              Have questions about membership, events, or the website? We're here to help.
            </p>

            <div className="contact-intro__details" aria-label="Contact details">
              {contactMethods.map((method) => (
                <article key={method.label} className="contact-detail">
                  <div className="contact-detail__header">
                    <span className="contact-detail__icon" aria-hidden="true">
                      <Icon icon={method.icon} />
                    </span>
                    <h2 className="contact-detail__label">{method.label}</h2>
                  </div>
                  <p className="contact-detail__value">
                    {method.valueLines.map((line) => (
                      <span key={line} className="contact-detail__line">
                        {line}
                      </span>
                    ))}
                  </p>
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
                  disabled={submitContactForm.isPending}
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
                  disabled={submitContactForm.isPending}
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
                  disabled={submitContactForm.isPending}
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
                  disabled={submitContactForm.isPending}
                />
              </div>

              {formError && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="contact-form-card__button"
                loading={submitContactForm.isPending}
              >
                Send message
              </Button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
